import { NextResponse } from 'next/server'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { logAuditEvent } from '@/lib/server/audit'
import { ensureAdminAccess } from '@/lib/server/admin-access'

const updateUserStatusSchema = z.object({
  authUserId: z.string().trim().min(1),
  isActive: z.boolean(),
})

export async function GET(request: Request) {
  const access = await ensureAdminAccess(request)
  if ('error' in access) return access.error

  const url = new URL(request.url)
  const search = (url.searchParams.get('search') ?? '').trim()

  const users = await prisma.userProfile.findMany({
    where: search
      ? {
          OR: [
            { email: { contains: search, mode: 'insensitive' } },
            { displayName: { contains: search, mode: 'insensitive' } },
            { authUserId: { contains: search, mode: 'insensitive' } },
          ],
        }
      : undefined,
    orderBy: { createdAt: 'desc' },
    take: 100,
    select: {
      id: true,
      authUserId: true,
      email: true,
      displayName: true,
      emailVerified: true,
      isActive: true,
      createdAt: true,
      roleAssignments: {
        where: { revokedAt: null },
        select: {
          id: true,
          scopeType: true,
          eventId: true,
          role: {
            select: {
              key: true,
              name: true,
            },
          },
        },
      },
    },
  })

  return NextResponse.json({ users })
}

export async function PATCH(request: Request) {
  const access = await ensureAdminAccess(request)
  if ('error' in access) return access.error

  const parsed = updateUserStatusSchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid payload', issues: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const payload = parsed.data
  let updatedUser: {
    id: string
    authUserId: string
    email: string
    displayName: string | null
    isActive: boolean
  }

  try {
    updatedUser = await prisma.userProfile.update({
      where: { authUserId: payload.authUserId },
      data: {
        isActive: payload.isActive,
        roleVersion: { increment: 1 },
      },
      select: {
        id: true,
        authUserId: true,
        email: true,
        displayName: true,
        isActive: true,
      },
    })
  } catch {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  await logAuditEvent({
    actorAuthUserId: access.authUserId,
    action: payload.isActive ? 'admin.user.activate' : 'admin.user.suspend',
    target: 'user_profile',
    targetId: updatedUser.id,
    metadata: {
      targetAuthUserId: updatedUser.authUserId,
      email: updatedUser.email,
    },
  })

  return NextResponse.json({ user: updatedUser })
}
