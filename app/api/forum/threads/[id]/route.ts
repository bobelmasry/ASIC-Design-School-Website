import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { createServerSupabaseClient } from '@/lib/server/supabase-auth'

type ThreadDetailResponse = {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  created_at: string
  replies_count: number
  likes: number
  user_id: string
  user_full_name: string
  json_likes: string[]
  attachments: Array<{
    name: string
    path: string
    bucket: string
    contentType: string
    size: number
  }>
  replies: Array<{
    id: string
    content: string
    user_id: string
    user_full_name: string
    user_avatar: string | null
    created_at: string
    likes: number
    liked_user_ids: string[]
    isAccepted: boolean
    isHidden: boolean
    moderationReason: string | null
    moderatedBy: string | null
    moderatedAt: string | null
    moderationHistory: Array<{
      action: string
      reason: string | null
      moderatedBy: string
      moderatedAt: string
    }>
    attachments: Array<{
      name: string
      path: string
      bucket: string
      contentType: string
      size: number
    }>
  }>
}

const isPrismaUnavailable = (error: unknown) => {
  if (!error || typeof error !== 'object' || !('code' in error)) return false
  const code = (error as { code?: string }).code
  return code === 'P2021' || code === 'P2022'
}

const emptyAttachments: ThreadDetailResponse['attachments'] = []

const parseAttachments = (value: unknown): ThreadDetailResponse['attachments'] => {
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

type PrismaThreadAttachmentLogRow = {
  metadata: unknown
}

type PrismaReplyAttachmentLogRow = {
  targetId: string | null
  metadata: unknown
}

type PrismaThreadDetailRecord = {
  id: string
  title: string
  content: string
  createdAt: Date
  category: {
    name: string
    slug: string
  }
  threadTags: Array<{
    tag: {
      slug: string
      name: string
    }
  }>
  author: {
    authUserId: string
    displayName: string | null
    email: string
  }
  votes: Array<{
    userProfile: {
      authUserId: string
    }
  }>
  posts: Array<{
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
  }>
}

const getLegacyThreadById = async (threadId: string): Promise<ThreadDetailResponse | null> => {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', threadId)
    .single()

  if (error || !data) return null

  const likedUsers = Array.isArray(data.json_likes) ? data.json_likes : []
  const rawReplies = Array.isArray(data.replies) ? (data.replies as unknown[]) : []
  const replies: ThreadDetailResponse['replies'] = rawReplies
    .filter(
      (reply: unknown): reply is Record<string, unknown> =>
        Boolean(reply) && typeof reply === 'object',
    )
    .map((reply: Record<string, unknown>) => ({
          id: String(reply.id ?? ''),
          content: typeof reply.content === 'string' ? reply.content : '',
          user_id: typeof reply.user_id === 'string' ? reply.user_id : 'unknown',
          user_full_name:
            typeof reply.user_full_name === 'string' ? reply.user_full_name : 'Community Member',
          user_avatar: typeof reply.user_avatar === 'string' ? reply.user_avatar : null,
          created_at:
            typeof reply.created_at === 'string'
              ? reply.created_at
              : new Date().toISOString(),
          likes: typeof reply.likes === 'number' ? reply.likes : 0,
          liked_user_ids: Array.isArray(reply.liked_user_ids)
            ? reply.liked_user_ids.filter((id: unknown): id is string => typeof id === 'string')
            : [],
          isAccepted: Boolean(reply.isAccepted),
          isHidden: Boolean(reply.isHidden),
          moderationReason: typeof reply.moderationReason === 'string' ? reply.moderationReason : null,
          moderatedBy: typeof reply.moderatedBy === 'string' ? reply.moderatedBy : null,
          moderatedAt: typeof reply.moderatedAt === 'string' ? reply.moderatedAt : null,
          moderationHistory: Array.isArray(reply.moderationHistory)
            ? reply.moderationHistory
                .filter(
                  (entry: unknown): entry is Record<string, unknown> =>
                    Boolean(entry) && typeof entry === 'object',
                )
                .map((entry: Record<string, unknown>) => ({
                  action: typeof entry.action === 'string' ? entry.action : 'unknown',
                  reason: typeof entry.reason === 'string' ? entry.reason : null,
                  moderatedBy:
                    typeof entry.moderatedBy === 'string' ? entry.moderatedBy : 'unknown',
                  moderatedAt:
                    typeof entry.moderatedAt === 'string'
                      ? entry.moderatedAt
                      : new Date().toISOString(),
                }))
            : [],
          attachments: parseAttachments(reply.attachments),
        }))

  return {
    id: String(data.id),
    title: data.title ?? 'Untitled discussion',
    content: data.content ?? '',
    category: data.category ?? 'General',
    tags: Array.isArray(data.tags)
      ? data.tags.filter((tag: unknown): tag is string => typeof tag === 'string')
      : [],
    created_at: data.created_at ?? new Date().toISOString(),
    replies_count: Number(data.replies_count ?? replies.length),
    likes: Number(data.likes ?? likedUsers.length),
    user_id: data.user_id ?? 'unknown',
    user_full_name: data.user_full_name ?? 'Community Member',
    json_likes: likedUsers,
    attachments: parseAttachments(data.attachments),
    replies,
  }
}

const getPrismaThreadById = async (threadId: string): Promise<ThreadDetailResponse | null> => {
  const thread = (await prisma.forumThread.findUnique({
    where: { id: threadId },
    include: {
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
      threadTags: {
        include: {
          tag: {
            select: {
              slug: true,
              name: true,
            },
          },
        },
      },
      author: {
        select: {
          authUserId: true,
          displayName: true,
          email: true,
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
      posts: {
        where: {
          parentPostId: null,
          type: 'REPLY',
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
            where: {
              targetType: 'POST',
            },
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
      },
    },
  })) as PrismaThreadDetailRecord | null

  if (!thread) return null

  const threadAttachmentLog = (await prisma.auditLog.findFirst({
    where: {
      target: 'forum_thread',
      targetId: thread.id,
      action: 'forum.thread.attachments.set',
    },
    orderBy: { createdAt: 'desc' },
    select: { metadata: true },
  })) as PrismaThreadAttachmentLogRow | null

  const threadAttachments = parseAttachments(threadAttachmentLog?.metadata)

  const replyIds = thread.posts.map((post) => post.id)
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

  const replyAttachmentsByPostId = new Map<string, ThreadDetailResponse['attachments']>()
  for (const log of replyAttachmentLogs) {
    if (!log.targetId || replyAttachmentsByPostId.has(log.targetId)) continue
    replyAttachmentsByPostId.set(log.targetId, parseAttachments(log.metadata))
  }

  const threadLikedUserIds = thread.votes
    .map((vote: PrismaThreadDetailRecord['votes'][number]) => vote.userProfile.authUserId)
    .filter((userId: string) => Boolean(userId))

  const replies: ThreadDetailResponse['replies'] = thread.posts.map((post: PrismaThreadDetailRecord['posts'][number]) => {
    const replyLikedUserIds = post.votes
      .map((vote: PrismaThreadDetailRecord['posts'][number]['votes'][number]) => vote.userProfile.authUserId)
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
      likes: replyLikedUserIds.length,
      liked_user_ids: replyLikedUserIds,
      isAccepted: post.isAccepted,
      isHidden,
      moderationReason: latestModeration?.reason ?? null,
      moderatedBy: latestModeration?.actor.authUserId ?? null,
      moderatedAt: latestModeration?.createdAt.toISOString() ?? null,
      moderationHistory,
      attachments: replyAttachmentsByPostId.get(post.id) ?? emptyAttachments,
    }
  })

  return {
    id: thread.id,
    title: thread.title,
    content: thread.content,
    category: thread.category.slug || thread.category.name,
    tags: thread.threadTags.map((threadTag) => threadTag.tag.slug || threadTag.tag.name),
    created_at: thread.createdAt.toISOString(),
    replies_count: replies.length,
    likes: threadLikedUserIds.length,
    user_id: thread.author.authUserId,
    user_full_name: thread.author.displayName ?? thread.author.email,
    json_likes: threadLikedUserIds,
    attachments: threadAttachments,
    replies,
  }
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id: threadId } = await context.params

  try {
    const thread = await getPrismaThreadById(threadId)
    if (thread) {
      return NextResponse.json({ thread })
    }
  } catch (error) {
    if (!isPrismaUnavailable(error)) {
      throw error
    }
  }

  const legacyThread = await getLegacyThreadById(threadId)
  if (!legacyThread) {
    return NextResponse.json({ error: 'Discussion not found' }, { status: 404 })
  }

  return NextResponse.json({ thread: legacyThread })
}
