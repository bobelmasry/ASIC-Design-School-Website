import { randomUUID } from 'crypto'

import { NextResponse } from 'next/server'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { checkPermission, ensureUserProfile } from '@/lib/server/rbac'
import {
  createAuthedSupabaseClient,
  getAuthenticatedUser,
} from '@/lib/server/supabase-auth'

const attachmentSchema = z.object({
  name: z.string(),
  path: z.string(),
  bucket: z.string(),
  contentType: z.string(),
  size: z.number().nonnegative(),
})

const createReplySchema = z.object({
  content: z.string().trim().min(1),
  attachments: z.array(attachmentSchema).optional().default([]),
})

type ThreadReply = {
  id: string
  content: string
  user_id: string
  user_full_name: string
  user_avatar: string
  created_at: string
  likes: number
  liked_user_ids: string[]
  attachments: z.infer<typeof attachmentSchema>[]
}

const isPrismaUnavailable = (error: unknown) => {
  if (!error || typeof error !== 'object' || !('code' in error)) return false
  const code = (error as { code?: string }).code
  return code === 'P2021' || code === 'P2022'
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await getAuthenticatedUser(request)
  if (!auth.user || !auth.token) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const parsed = createReplySchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid payload', issues: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const { id: threadId } = await context.params

  await ensureUserProfile({
    authUserId: auth.user.id,
    email: auth.user.email ?? `${auth.user.id}@unknown.local`,
    displayName: auth.user.user_metadata?.full_name ?? null,
    emailVerified: Boolean(auth.user.email_confirmed_at),
  })

  const canReply = await checkPermission({
    authUserId: auth.user.id,
    permissionKey: 'forum.post.reply',
  })

  if (!canReply.allowed) {
    return NextResponse.json(
      { error: canReply.reason ?? 'Permission denied' },
      { status: 403 },
    )
  }

  const supabase = createAuthedSupabaseClient(auth.token)
  const authorName = auth.user.user_metadata?.full_name ?? auth.user.email ?? 'Community Member'

  try {
    const userProfile = await prisma.userProfile.findUnique({
      where: { authUserId: auth.user.id },
      select: { id: true, authUserId: true, displayName: true, email: true, avatarUrl: true },
    })

    if (userProfile?.id) {
      const prismaThread = await prisma.forumThread.findUnique({
        where: { id: threadId },
        select: { id: true },
      })

      if (prismaThread?.id) {
        const post = await prisma.forumPost.create({
          data: {
            threadId,
            authorId: userProfile.id,
            type: 'REPLY',
            content: parsed.data.content,
          },
          select: {
            id: true,
            content: true,
            createdAt: true,
            author: {
              select: {
                authUserId: true,
                displayName: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
        })

        if (parsed.data.attachments.length > 0) {
          await prisma.auditLog.create({
            data: {
              actorId: userProfile.id,
              action: 'forum.reply.attachments.set',
              target: 'forum_post',
              targetId: post.id,
              metadata: parsed.data.attachments,
            },
          })
        }

        const repliesCount = await prisma.forumPost.count({
          where: {
            threadId,
            parentPostId: null,
            type: 'REPLY',
          },
        })

        const reply = {
          id: post.id,
          content: post.content,
          user_id: post.author.authUserId,
          user_full_name: post.author.displayName ?? post.author.email,
          user_avatar: post.author.avatarUrl,
          created_at: post.createdAt.toISOString(),
          likes: 0,
          liked_user_ids: [],
          attachments: parsed.data.attachments,
          isAccepted: false,
          isHidden: false,
          moderationReason: null,
          moderatedBy: null,
          moderatedAt: null,
        }

        return NextResponse.json({ reply, repliesCount }, { status: 201 })
      }
    }
  } catch (error) {
    if (!isPrismaUnavailable(error)) {
      throw error
    }
  }

  const { data: thread, error: fetchError } = await supabase
    .from('posts')
    .select('id,replies')
    .eq('id', threadId)
    .single()

  if (fetchError || !thread) {
    return NextResponse.json({ error: 'Discussion not found' }, { status: 404 })
  }

  const existingReplies = Array.isArray(thread.replies) ? thread.replies : []
  const reply: ThreadReply = {
    id: randomUUID(),
    content: parsed.data.content,
    user_id: auth.user.id,
    user_full_name: authorName,
    user_avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=0ea5e9&color=fff`,
    created_at: new Date().toISOString(),
    likes: 0,
    liked_user_ids: [],
    attachments: parsed.data.attachments,
  }

  const updatedReplies = [...existingReplies, reply]

  const { error: updateError } = await supabase
    .from('posts')
    .update({
      replies: updatedReplies,
      replies_count: updatedReplies.length,
    })
    .eq('id', threadId)

  if (updateError) {
    return NextResponse.json(
      { error: updateError.message ?? 'Failed to create reply' },
      { status: 500 },
    )
  }

  return NextResponse.json(
    { reply, repliesCount: updatedReplies.length },
    { status: 201 },
  )
}
