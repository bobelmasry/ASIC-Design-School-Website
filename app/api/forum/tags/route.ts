import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { createServerSupabaseClient } from '@/lib/server/supabase-auth'

const isPrismaUnavailable = (error: unknown) => {
  if (!error || typeof error !== 'object' || !('code' in error)) return false
  const code = (error as { code?: string }).code
  return code === 'P2021' || code === 'P2022'
}

const normalizeTag = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export async function GET() {
  try {
    const tags = await prisma.forumTag.findMany({
      orderBy: { name: 'asc' },
      select: {
        slug: true,
        name: true,
      },
    })

    return NextResponse.json({
      tags: tags.map((tag) => ({ slug: tag.slug, name: tag.name })),
    })
  } catch (error) {
    if (!isPrismaUnavailable(error)) {
      throw error
    }
  }

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from('posts').select('tags')

  if (error || !Array.isArray(data)) {
    return NextResponse.json({ tags: [] })
  }

  const tags = new Set<string>()
  for (const row of data) {
    if (!Array.isArray(row.tags)) continue
    for (const rawTag of row.tags) {
      if (typeof rawTag !== 'string') continue
      const normalized = normalizeTag(rawTag)
      if (normalized) tags.add(normalized)
    }
  }

  return NextResponse.json({
    tags: Array.from(tags)
      .sort((a, b) => a.localeCompare(b))
      .map((slug) => ({
        slug,
        name: slug
          .split('-')
          .filter(Boolean)
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' '),
      })),
  })
}
