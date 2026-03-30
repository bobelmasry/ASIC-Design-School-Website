import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { ensureUserProfile } from '@/lib/server/rbac'
import { getAuthenticatedUser } from '@/lib/server/supabase-auth'

const ensureCommunityMemberRole = async (authUserId: string) => {
  const [userProfile, communityRole] = await Promise.all([
    prisma.userProfile.findUnique({
      where: { authUserId },
      select: { id: true },
    }),
    prisma.role.findUnique({
      where: { key: 'community_member' },
      select: { id: true },
    }),
  ])

  if (!userProfile?.id || !communityRole?.id) return

  const existing = await prisma.roleAssignment.findFirst({
    where: {
      userProfileId: userProfile.id,
      roleId: communityRole.id,
      scopeType: 'GLOBAL',
      revokedAt: null,
      eventId: null,
    },
    select: { id: true },
  })

  if (existing?.id) return

  await prisma.roleAssignment.create({
    data: {
      userProfileId: userProfile.id,
      roleId: communityRole.id,
      scopeType: 'GLOBAL',
      eventId: null,
    },
  })
}

export async function GET(request: Request) {
  const auth = await getAuthenticatedUser(request)

  if (!auth.user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  await ensureUserProfile({
    authUserId: auth.user.id,
    email: auth.user.email ?? `${auth.user.id}@unknown.local`,
    displayName: auth.user.user_metadata?.full_name ?? null,
    emailVerified: Boolean(auth.user.email_confirmed_at),
  })

  if (auth.user.email_confirmed_at) {
    await ensureCommunityMemberRole(auth.user.id)
  }

  type PermissionEntry = {
    role: {
      permissions: Array<{
        permission: {
          key: string
        }
      }>
    }
  }

  const user = await prisma.userProfile.findUnique({
    where: { authUserId: auth.user.id },
    select: {
      roleAssignments: {
        where: {
          revokedAt: null,
          OR: [{ scopeType: 'GLOBAL' }, { scopeType: 'EVENT' }],
        },
        select: {
          role: {
            select: {
              permissions: {
                select: {
                  permission: {
                    select: {
                      key: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      isActive: true,
    },
  })

  if (user && !user.isActive) {
    return NextResponse.json(
      { error: 'Account is suspended', permissions: [] },
      { status: 403 },
    )
  }

  const permissionSet = new Set(
    (user?.roleAssignments as PermissionEntry[] | undefined)?.flatMap((assignment: PermissionEntry) =>
      assignment.role.permissions.map((item: PermissionEntry['role']['permissions'][number]) => item.permission.key),
    ) ?? [],
  )

  return NextResponse.json({ permissions: Array.from(permissionSet) })
}
