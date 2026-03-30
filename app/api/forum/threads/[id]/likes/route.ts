import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { createAuthedSupabaseClient, getAuthenticatedUser } from '@/lib/server/supabase-auth'

type ThreadLikeVoteRow = {
  userProfile: {
    authUserId: string
  }
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

  const { id: threadId } = await context.params

  try {
    const userProfile = await prisma.userProfile.findUnique({
      where: { authUserId: auth.user.id },
      select: { id: true },
    })

    if (userProfile?.id) {
      const prismaThread = await prisma.forumThread.findUnique({
        where: { id: threadId },
        select: { id: true },
      })

      if (prismaThread?.id) {
        const existingVote = await prisma.forumVote.findFirst({
          where: {
            userProfileId: userProfile.id,
            threadId,
            postId: null,
          },
          select: { id: true },
        })

        if (existingVote?.id) {
          await prisma.forumVote.delete({
            where: { id: existingVote.id },
          })
        } else {
          await prisma.forumVote.create({
            data: {
              userProfileId: userProfile.id,
              threadId,
              value: 1,
            },
          })
        }

        const votes = (await prisma.forumVote.findMany({
          where: {
            threadId,
            value: { gt: 0 },
          },
          select: {
            userProfile: {
              select: {
                authUserId: true,
              },
            },
          },
        })) as ThreadLikeVoteRow[]

        const likedUserIds = votes
          .map((vote: ThreadLikeVoteRow) => vote.userProfile.authUserId)
          .filter((userId: string) => Boolean(userId))

        return NextResponse.json({
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
    .select('id,json_likes')
    .eq('id', threadId)
    .single()

  if (fetchError || !thread) {
    return NextResponse.json({ error: 'Discussion not found' }, { status: 404 })
  }

  const currentLikedUsers = Array.isArray(thread.json_likes) ? thread.json_likes : []
  const hasLiked = currentLikedUsers.includes(auth.user.id)
  const nextLikedUsers = hasLiked
    ? currentLikedUsers.filter((userId) => userId !== auth.user.id)
    : [...currentLikedUsers, auth.user.id]

  const likesCount = nextLikedUsers.length

  const { error: updateError } = await supabase
    .from('posts')
    .update({
      likes: likesCount,
      json_likes: nextLikedUsers,
    })
    .eq('id', threadId)

  if (updateError) {
    return NextResponse.json(
      { error: updateError.message ?? 'Failed to update like' },
      { status: 500 },
    )
  }

  return NextResponse.json({
    liked: !hasLiked,
    likes: likesCount,
    likedUserIds: nextLikedUsers,
  })
}
