import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { createAuthedSupabaseClient, getAuthenticatedUser } from '@/lib/server/supabase-auth'

type ReplyLikeVoteRow = {
  userProfile: {
    authUserId: string
  }
}

type ThreadReply = {
  id: string
  likes?: number | null
  liked_user_ids?: string[] | null
}

const isPrismaUnavailable = (error: unknown) => {
  if (!error || typeof error !== 'object' || !('code' in error)) return false
  const code = (error as { code?: string }).code
  return code === 'P2021' || code === 'P2022'
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string; replyId: string }> },
) {
  const auth = await getAuthenticatedUser(request)
  if (!auth.user || !auth.token) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const { id: threadId, replyId } = await context.params

  try {
    const userProfile = await prisma.userProfile.findUnique({
      where: { authUserId: auth.user.id },
      select: { id: true },
    })

    if (userProfile?.id) {
      const prismaReply = await prisma.forumPost.findFirst({
        where: {
          id: replyId,
          threadId,
          type: 'REPLY',
        },
        select: { id: true },
      })

      if (prismaReply?.id) {
        const existingVote = await prisma.forumVote.findFirst({
          where: {
            userProfileId: userProfile.id,
            postId: replyId,
            threadId: null,
          },
          select: { id: true },
        })

        if (existingVote?.id) {
          await prisma.forumVote.delete({ where: { id: existingVote.id } })
        } else {
          await prisma.forumVote.create({
            data: {
              userProfileId: userProfile.id,
              postId: replyId,
              value: 1,
            },
          })
        }

        const votes = (await prisma.forumVote.findMany({
          where: {
            postId: replyId,
            value: { gt: 0 },
          },
          select: {
            userProfile: {
              select: {
                authUserId: true,
              },
            },
          },
        })) as ReplyLikeVoteRow[]

        const likedUserIds = votes
          .map((vote: ReplyLikeVoteRow) => vote.userProfile.authUserId)
          .filter((userId: string) => Boolean(userId))

        return NextResponse.json({
          replyId,
          liked: likedUserIds.includes(auth.user.id),
          likes: likedUserIds.length,
          likedUserIds,
        })
      }
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
  const replyIndex = currentReplies.findIndex((reply) => reply.id === replyId)

  if (replyIndex === -1) {
    return NextResponse.json({ error: 'Reply not found' }, { status: 404 })
  }

  const targetReply = currentReplies[replyIndex]
  const currentLikedUsers = Array.isArray(targetReply.liked_user_ids)
    ? targetReply.liked_user_ids
    : []

  const hasLiked = currentLikedUsers.includes(auth.user.id)
  const nextLikedUsers = hasLiked
    ? currentLikedUsers.filter((userId) => userId !== auth.user.id)
    : [...currentLikedUsers, auth.user.id]

  const nextReplies = currentReplies.map((reply) => {
    if (reply.id !== replyId) return reply

    return {
      ...reply,
      liked_user_ids: nextLikedUsers,
      likes: nextLikedUsers.length,
    }
  })

  const { error: updateError } = await supabase
    .from('posts')
    .update({ replies: nextReplies })
    .eq('id', threadId)

  if (updateError) {
    return NextResponse.json(
      { error: updateError.message ?? 'Failed to update reply like' },
      { status: 500 },
    )
  }

  return NextResponse.json({
    replyId,
    liked: !hasLiked,
    likes: nextLikedUsers.length,
    likedUserIds: nextLikedUsers,
  })
}
