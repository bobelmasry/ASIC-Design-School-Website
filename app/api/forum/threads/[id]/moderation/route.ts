import { NextResponse } from 'next/server'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { checkPermission, ensureUserProfile } from '@/lib/server/rbac'
import {
  createAuthedSupabaseClient,
  getAuthenticatedUser,
} from '@/lib/server/supabase-auth'

const moderationActionSchema = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('remove-reply'),
    replyId: z.string().trim().min(1),
    reason: z.string().trim().min(1).optional(),
  }),
  z.object({
    action: z.literal('restore-reply'),
    replyId: z.string().trim().min(1),
  }),
  z.object({
    action: z.literal('mark-accepted'),
    replyId: z.string().trim().min(1),
  }),
])

type ThreadReply = {
  id: string
  content: string
  likes?: number
  liked_user_ids?: string[]
  isAccepted?: boolean
  isHidden?: boolean
  moderationReason?: string | null
  moderatedBy?: string | null
  moderatedAt?: string | null
  moderationHistory?: Array<{
    action: string
    reason: string | null
    moderatedBy: string
    moderatedAt: string
  }>
  created_at?: string
  user_id?: string
  user_full_name?: string
  user_avatar?: string | null
  attachments?: Array<{
    name: string
    path: string
    bucket: string
    contentType: string
    size: number
  }>
}

const parseAttachments = (value: unknown): NonNullable<ThreadReply['attachments']> => {
  if (!Array.isArray(value)) return []

  return value
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object')
    .map((item) => ({
      name: typeof item.name === 'string' ? item.name : '',
      path: typeof item.path === 'string' ? item.path : '',
      bucket: typeof item.bucket === 'string' ? item.bucket : '',
      contentType: typeof item.contentType === 'string' ? item.contentType : 'application/octet-stream',
      size: typeof item.size === 'number' ? item.size : 0,
    }))
    .filter((attachment) => attachment.name && attachment.path && attachment.bucket)
}

const isPrismaUnavailable = (error: unknown) => {
  if (!error || typeof error !== 'object' || !('code' in error)) return false
  const code = (error as { code?: string }).code
  return code === 'P2021' || code === 'P2022'
}

type PrismaReplyRecord = {
  id: string
  content: string
  createdAt: Date
  isAccepted: boolean
  author: {
    authUserId: string
    displayName: string | null
    email: string
    avatarUrl: string | null
  }
  votes: Array<{
    userProfile: {
      authUserId: string
    }
  }>
  moderationActions: Array<{
    action: string
    reason: string | null
    createdAt: Date
    actor: {
      authUserId: string
    }
  }>
}

type PrismaReplyAttachmentLogRow = {
  targetId: string | null
  metadata: unknown
}

const getPrismaReplies = async (threadId: string): Promise<ThreadReply[]> => {
  const posts = (await prisma.forumPost.findMany({
    where: {
      threadId,
      type: 'REPLY',
      parentPostId: null,
    },
    orderBy: { createdAt: 'asc' },
    include: {
      author: {
        select: {
          authUserId: true,
          displayName: true,
          email: true,
          avatarUrl: true,
        },
      },
      votes: {
        where: { value: { gt: 0 } },
        select: {
          userProfile: {
            select: {
              authUserId: true,
            },
          },
        },
      },
      moderationActions: {
        where: { targetType: 'POST' },
        orderBy: { createdAt: 'desc' },
        select: {
          action: true,
          reason: true,
          createdAt: true,
          actor: {
            select: {
              authUserId: true,
            },
          },
        },
      },
    },
  })) as PrismaReplyRecord[]

  const replyIds = posts.map((post) => post.id)
  const replyAttachmentLogs = replyIds.length
    ? ((await prisma.auditLog.findMany({
        where: {
          target: 'forum_post',
          targetId: { in: replyIds },
          action: 'forum.reply.attachments.set',
        },
        orderBy: { createdAt: 'desc' },
        select: {
          targetId: true,
          metadata: true,
        },
      })) as PrismaReplyAttachmentLogRow[])
    : []

  const attachmentsByReplyId = new Map<string, NonNullable<ThreadReply['attachments']>>()
  for (const log of replyAttachmentLogs) {
    if (!log.targetId || attachmentsByReplyId.has(log.targetId)) continue
    attachmentsByReplyId.set(log.targetId, parseAttachments(log.metadata))
  }

  return posts.map((post: PrismaReplyRecord) => {
    const likedUserIds = post.votes
      .map((vote: PrismaReplyRecord['votes'][number]) => vote.userProfile.authUserId)
      .filter((userId: string) => Boolean(userId))

    const latestModeration = post.moderationActions[0]
    const isHidden = latestModeration?.action === 'remove-reply'
    const moderationHistory = post.moderationActions.map((entry) => ({
      action: entry.action,
      reason: entry.reason ?? null,
      moderatedBy: entry.actor.authUserId,
      moderatedAt: entry.createdAt.toISOString(),
    }))

    return {
      id: post.id,
      content: post.content,
      user_id: post.author.authUserId,
      user_full_name: post.author.displayName ?? post.author.email,
      user_avatar: post.author.avatarUrl,
      created_at: post.createdAt.toISOString(),
      likes: likedUserIds.length,
      liked_user_ids: likedUserIds,
      isAccepted: post.isAccepted,
      isHidden,
      moderationReason: latestModeration?.reason ?? null,
      moderatedBy: latestModeration?.actor.authUserId ?? null,
      moderatedAt: latestModeration?.createdAt.toISOString() ?? null,
      moderationHistory,
      attachments: attachmentsByReplyId.get(post.id) ?? [],
    }
  })
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await getAuthenticatedUser(request)
  if (!auth.user || !auth.token) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const parsed = moderationActionSchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid payload', issues: parsed.error.flatten() },
      { status: 400 },
    )
  }

  await ensureUserProfile({
    authUserId: auth.user.id,
    email: auth.user.email ?? `${auth.user.id}@unknown.local`,
    displayName: auth.user.user_metadata?.full_name ?? null,
    emailVerified: Boolean(auth.user.email_confirmed_at),
  })

  const canModerate = await checkPermission({
    authUserId: auth.user.id,
    permissionKey: 'forum.moderate',
  })

  if (!canModerate.allowed) {
    return NextResponse.json(
      { error: canModerate.reason ?? 'Permission denied' },
      { status: 403 },
    )
  }

  const { id: threadId } = await context.params

  try {
    const actorProfile = await prisma.userProfile.findUnique({
      where: { authUserId: auth.user.id },
      select: { id: true },
    })

    const prismaThread = await prisma.forumThread.findUnique({
      where: { id: threadId },
      select: { id: true },
    })

    if (actorProfile?.id && prismaThread?.id) {
      const targetReply = await prisma.forumPost.findFirst({
        where: {
          id: parsed.data.replyId,
          threadId,
          type: 'REPLY',
          parentPostId: null,
        },
        select: { id: true },
      })

      if (!targetReply) {
        return NextResponse.json({ error: 'Reply not found' }, { status: 404 })
      }

      if (parsed.data.action === 'mark-accepted') {
        await prisma.$transaction([
          prisma.forumPost.updateMany({
            where: {
              threadId,
              type: 'REPLY',
              parentPostId: null,
            },
            data: { isAccepted: false },
          }),
          prisma.forumPost.update({
            where: { id: parsed.data.replyId },
            data: { isAccepted: true },
          }),
          prisma.moderationAction.create({
            data: {
              actorId: actorProfile.id,
              threadId,
              postId: parsed.data.replyId,
              targetType: 'POST',
              action: 'mark-accepted',
            },
          }),
        ])
      } else {
        await prisma.moderationAction.create({
          data: {
            actorId: actorProfile.id,
            threadId,
            postId: parsed.data.replyId,
            targetType: 'POST',
            action: parsed.data.action,
            reason:
              parsed.data.action === 'remove-reply'
                ? parsed.data.reason ?? 'Removed by moderator'
                : 'Restored by moderator',
          },
        })
      }

      const replies = await getPrismaReplies(threadId)

      return NextResponse.json({
        action: parsed.data.action,
        replyId: parsed.data.replyId,
        replies,
      })
    }
  } catch (error) {
    if (!isPrismaUnavailable(error)) {
      throw error
    }
  }

  const supabase = createAuthedSupabaseClient(auth.token)

  const { data: thread, error: fetchError } = await supabase
    .from('posts')
    .select('id,replies')
    .eq('id', threadId)
    .single()

  if (fetchError || !thread) {
    return NextResponse.json({ error: 'Discussion not found' }, { status: 404 })
  }

  const currentReplies = Array.isArray(thread.replies) ? (thread.replies as ThreadReply[]) : []
  const payload = parsed.data
  const actionTimestamp = new Date().toISOString()

  const normalizeHistory = (
    history: ThreadReply['moderationHistory'],
  ): NonNullable<ThreadReply['moderationHistory']> => {
    if (!Array.isArray(history)) return []

    return history.filter(
      (
        entry,
      ): entry is {
        action: string
        reason: string | null
        moderatedBy: string
        moderatedAt: string
      } =>
        Boolean(entry) &&
        typeof entry.action === 'string' &&
        typeof entry.moderatedBy === 'string' &&
        typeof entry.moderatedAt === 'string',
    )
  }

  const nextReplies = currentReplies.map((reply) => {
    const moderationHistory = normalizeHistory(reply.moderationHistory)

    if (payload.action === 'mark-accepted') {
      return {
        ...reply,
        isAccepted: reply.id === payload.replyId,
        attachments: parseAttachments(reply.attachments),
        moderationHistory:
          reply.id === payload.replyId
            ? [
                {
                  action: payload.action,
                  reason: null,
                  moderatedBy: auth.user.id,
                  moderatedAt: actionTimestamp,
                },
                ...moderationHistory,
              ]
            : moderationHistory,
      }
    }

    if (reply.id !== payload.replyId) return reply

    if (payload.action === 'remove-reply') {
      return {
        ...reply,
        isHidden: true,
        moderationReason: payload.reason ?? 'Removed by moderator',
        moderatedBy: auth.user.id,
        moderatedAt: actionTimestamp,
        attachments: parseAttachments(reply.attachments),
        moderationHistory: [
          {
            action: payload.action,
            reason: payload.reason ?? 'Removed by moderator',
            moderatedBy: auth.user.id,
            moderatedAt: actionTimestamp,
          },
          ...moderationHistory,
        ],
      }
    }

    return {
      ...reply,
      isHidden: false,
      moderationReason: null,
      moderatedBy: auth.user.id,
      moderatedAt: actionTimestamp,
      attachments: parseAttachments(reply.attachments),
      moderationHistory: [
        {
          action: payload.action,
          reason: 'Restored by moderator',
          moderatedBy: auth.user.id,
          moderatedAt: actionTimestamp,
        },
        ...moderationHistory,
      ],
    }
  })

  const replyExists = currentReplies.some((reply) => reply.id === payload.replyId)
  if (!replyExists) {
    return NextResponse.json({ error: 'Reply not found' }, { status: 404 })
  }

  const { error: updateError } = await supabase
    .from('posts')
    .update({ replies: nextReplies })
    .eq('id', threadId)

  if (updateError) {
    return NextResponse.json(
      { error: updateError.message ?? 'Failed to apply moderation action' },
      { status: 500 },
    )
  }

  return NextResponse.json({
    action: payload.action,
    replyId: payload.replyId,
    replies: nextReplies,
  })
}
