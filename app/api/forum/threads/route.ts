import { NextResponse } from 'next/server'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { checkPermission, ensureUserProfile } from '@/lib/server/rbac'
import {
  createAuthedSupabaseClient,
  createServerSupabaseClient,
  getAuthenticatedUser,
} from '@/lib/server/supabase-auth'

const createThreadSchema = z.object({
  title: z.string().trim().min(1).max(150),
  category: z.string().trim().min(1),
  content: z.string().trim().min(1),
  tags: z.array(z.string().trim().min(1).max(50)).optional().default([]),
  attachments: z.array(
    z.object({
      name: z.string(),
      path: z.string(),
      bucket: z.string(),
      contentType: z.string(),
      size: z.number().nonnegative(),
    }),
  ).optional().default([]),
})

const isPrismaUnavailable = (error: unknown) => {
  if (!error || typeof error !== 'object' || !('code' in error)) return false
  const code = (error as { code?: string }).code
  return code === 'P2021' || code === 'P2022'
}

const toCategorySlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'general'

const toCategoryName = (slug: string) =>
  slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')

type ThreadListItem = {
  id: string
  title: string
  excerpt: string
  category: string
  tags: string[]
  created_at: string
  replies_count: number
  likes: number
  user_id: string
  user_full_name: string
  json_likes: string[]
}

type PrismaThreadListRecord = {
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
  posts: Array<{
    id: string
  }>
  votes: Array<{
    value: number
    userProfile: {
      authUserId: string
    }
  }>
}

const normalizeTag = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const getLegacyThreads = async (filters: {
  query?: string
  category?: string
  tag?: string
}): Promise<ThreadListItem[]> => {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error || !Array.isArray(data)) {
    return []
  }

  const normalized = data.map((post) => {
    const likedUsers = Array.isArray(post.json_likes) ? post.json_likes : []
    const rawTags = Array.isArray(post.tags) ? post.tags : []
    const tags = rawTags
      .map((tag) => (typeof tag === 'string' ? normalizeTag(tag) : ''))
      .filter((tag) => Boolean(tag))

    return {
      id: String(post.id),
      title: post.title ?? 'Untitled discussion',
      excerpt: post.excerpt ?? (post.content ? `${post.content.slice(0, 160)}...` : ''),
      category: post.category ?? 'General',
      tags,
      created_at: post.created_at ?? new Date().toISOString(),
      replies_count: Number(post.replies_count ?? post.replies ?? 0),
      likes: Number(post.likes ?? likedUsers.length),
      user_id: post.user_id ?? 'unknown',
      user_full_name: post.user_full_name ?? 'Community Member',
      json_likes: likedUsers,
    }
  })

  return normalized.filter((thread) => {
    const matchesCategory = filters.category
      ? normalizeTag(thread.category) === normalizeTag(filters.category)
      : true
    const matchesTag = filters.tag
      ? thread.tags.some((tag) => normalizeTag(tag) === normalizeTag(filters.tag as string))
      : true
    const matchesQuery = filters.query
      ? `${thread.title} ${thread.excerpt}`
          .toLowerCase()
          .includes(filters.query.toLowerCase())
      : true

    return matchesCategory && matchesTag && matchesQuery
  })
}

const getPrismaThreads = async (filters: {
  query?: string
  category?: string
  tag?: string
}): Promise<ThreadListItem[]> => {
  const normalizedTag = filters.tag ? normalizeTag(filters.tag) : ''
  const normalizedCategory = filters.category ? normalizeTag(filters.category) : ''

  const threads = (await prisma.forumThread.findMany({
    where: {
      ...(filters.query
        ? {
            OR: [
              { title: { contains: filters.query, mode: 'insensitive' } },
              { content: { contains: filters.query, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(normalizedCategory
        ? {
            category: {
              slug: normalizedCategory,
            },
          }
        : {}),
      ...(normalizedTag
        ? {
            threadTags: {
              some: {
                tag: {
                  slug: normalizedTag,
                },
              },
            },
          }
        : {}),
    },
    orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
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
      posts: {
        select: {
          id: true,
        },
      },
      votes: {
        where: { value: { gt: 0 } },
        select: {
          value: true,
          userProfile: {
            select: {
              authUserId: true,
            },
          },
        },
      },
    },
  })) as PrismaThreadListRecord[]

  return threads.map((thread: PrismaThreadListRecord) => {
    const likedUserIds = thread.votes
      .map((vote: PrismaThreadListRecord['votes'][number]) => vote.userProfile.authUserId)
      .filter((userId: string) => Boolean(userId))

    return {
      id: thread.id,
      title: thread.title,
      excerpt: thread.content ? `${thread.content.slice(0, 160)}...` : '',
      category: thread.category.slug || thread.category.name,
      tags: thread.threadTags.map((threadTag) => threadTag.tag.slug || threadTag.tag.name),
      created_at: thread.createdAt.toISOString(),
      replies_count: thread.posts.length,
      likes: thread.votes.length,
      user_id: thread.author.authUserId,
      user_full_name: thread.author.displayName ?? thread.author.email,
      json_likes: likedUserIds,
    }
  })
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const filters = {
    query: url.searchParams.get('q')?.trim() || undefined,
    category: url.searchParams.get('category')?.trim() || undefined,
    tag: url.searchParams.get('tag')?.trim() || undefined,
  }

  try {
    const prismaThreads = await getPrismaThreads(filters)
    if (prismaThreads.length > 0) {
      return NextResponse.json({ threads: prismaThreads })
    }
  } catch (error) {
    if (!isPrismaUnavailable(error)) {
      throw error
    }
  }

  const legacyThreads = await getLegacyThreads(filters)
  return NextResponse.json({ threads: legacyThreads })
}

export async function POST(request: Request) {
  const auth = await getAuthenticatedUser(request)
  if (!auth.user || !auth.token) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const parsed = createThreadSchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid payload', issues: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const payload = parsed.data
  const uniqueTags = Array.from(new Set(payload.tags.map((tag) => normalizeTag(tag)).filter(Boolean)))

  await ensureUserProfile({
    authUserId: auth.user.id,
    email: auth.user.email ?? `${auth.user.id}@unknown.local`,
    displayName: auth.user.user_metadata?.full_name ?? null,
    emailVerified: Boolean(auth.user.email_confirmed_at),
  })

  const canCreateThread = await checkPermission({
    authUserId: auth.user.id,
    permissionKey: 'forum.thread.create',
  })

  if (!canCreateThread.allowed) {
    return NextResponse.json(
      { error: canCreateThread.reason ?? 'Permission denied' },
      { status: 403 },
    )
  }

  const fullName = auth.user.user_metadata?.full_name ?? auth.user.email ?? 'Community Member'

  try {
    const userProfile = await prisma.userProfile.findUnique({
      where: { authUserId: auth.user.id },
      select: { id: true },
    })

    if (userProfile?.id) {
      const categorySlug = toCategorySlug(payload.category)
      const category = await prisma.forumCategory.upsert({
        where: { slug: categorySlug },
        update: {},
        create: {
          slug: categorySlug,
          name: toCategoryName(categorySlug),
        },
        select: { id: true },
      })

      const thread = await prisma.forumThread.create({
        data: {
          categoryId: category.id,
          authorId: userProfile.id,
          title: payload.title,
          content: payload.content,
          threadTags: {
            create: uniqueTags.map((tag) => ({
              tag: {
                connectOrCreate: {
                  where: { slug: tag },
                  create: {
                    slug: tag,
                    name: toCategoryName(tag),
                  },
                },
              },
            })),
          },
        },
        select: { id: true },
      })

      if (payload.attachments.length > 0) {
        await prisma.auditLog.create({
          data: {
            actorId: userProfile.id,
            action: 'forum.thread.attachments.set',
            target: 'forum_thread',
            targetId: thread.id,
            metadata: payload.attachments,
          },
        })
      }

      return NextResponse.json({ id: thread.id }, { status: 201 })
    }
  } catch (error) {
    if (!isPrismaUnavailable(error)) {
      throw error
    }
  }

  const supabase = createAuthedSupabaseClient(auth.token)
  const { data, error } = await supabase
    .from('posts')
    .insert({
      title: payload.title,
      content: payload.content,
      category: payload.category,
      tags: uniqueTags,
      user_id: auth.user.id,
      user_full_name: fullName,
      attachments: payload.attachments,
    })
    .select('id')
    .single()

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message ?? 'Failed to create discussion' },
      { status: 500 },
    )
  }

  return NextResponse.json({ id: data.id }, { status: 201 })
}
