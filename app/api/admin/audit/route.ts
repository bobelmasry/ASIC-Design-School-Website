import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { ensureAdminAccess } from '@/lib/server/admin-access'

export async function GET(request: Request) {
  const access = await ensureAdminAccess(request)
  if ('error' in access) return access.error

  const url = new URL(request.url)
  const action = (url.searchParams.get('action') ?? '').trim()
  const target = (url.searchParams.get('target') ?? '').trim()
  const actorAuthUserId = (url.searchParams.get('actorAuthUserId') ?? '').trim()

  const logs = await prisma.auditLog.findMany({
    where: {
      ...(action ? { action: { contains: action, mode: 'insensitive' } } : {}),
      ...(target ? { target: { contains: target, mode: 'insensitive' } } : {}),
      ...(actorAuthUserId
        ? {
            actor: {
              authUserId: {
                contains: actorAuthUserId,
                mode: 'insensitive',
              },
            },
          }
        : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: 200,
    select: {
      id: true,
      action: true,
      target: true,
      targetId: true,
      eventId: true,
      metadata: true,
      createdAt: true,
      actor: {
        select: {
          authUserId: true,
          email: true,
          displayName: true,
        },
      },
    },
  })

  return NextResponse.json({ logs })
}
