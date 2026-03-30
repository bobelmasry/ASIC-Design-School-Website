import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { ensureAdminAccess } from '@/lib/server/admin-access'

export async function GET(request: Request) {
  const access = await ensureAdminAccess(request, { allowForumModeration: true })
  if ('error' in access) return access.error

  const permissions = await prisma.permission.findMany({
    orderBy: [{ resource: 'asc' }, { action: 'asc' }],
    select: {
      id: true,
      key: true,
      resource: true,
      action: true,
      description: true,
    },
  })

  return NextResponse.json({ permissions })
}
