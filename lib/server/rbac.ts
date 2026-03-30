import { Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'

type PermissionCheckParams = {
  authUserId: string
  permissionKey: string
  eventId?: string | null
}

type PermissionCheckResult = {
  allowed: boolean
  reason?: string
}

const LEGACY_BOOTSTRAP_PERMISSIONS = new Set([
  'forum.thread.create',
  'forum.post.reply',
  'forum.moderate',
])

const isPrismaUnavailable = (error: unknown) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return error.code === 'P2021' || error.code === 'P2022'
  }
  return false
}

export const ensureUserProfile = async (params: {
  authUserId: string
  email: string
  displayName?: string | null
  emailVerified?: boolean
}) => {
  try {
    await prisma.userProfile.upsert({
      where: { authUserId: params.authUserId },
      update: {
        email: params.email,
        displayName: params.displayName ?? undefined,
        emailVerified: params.emailVerified ?? undefined,
      },
      create: {
        authUserId: params.authUserId,
        email: params.email,
        displayName: params.displayName ?? undefined,
        emailVerified: params.emailVerified ?? false,
      },
    })
  } catch (error) {
    if (isPrismaUnavailable(error)) return
    throw error
  }
}

export const checkPermission = async (
  params: PermissionCheckParams,
): Promise<PermissionCheckResult> => {
  try {
    const roleCount = await prisma.role.count()
    if (roleCount === 0) {
      return {
        allowed: LEGACY_BOOTSTRAP_PERMISSIONS.has(params.permissionKey),
        reason: 'RBAC not seeded yet',
      }
    }

    const user = await prisma.userProfile.findUnique({
      where: { authUserId: params.authUserId },
      select: {
        id: true,
        isActive: true,
        roleAssignments: {
          where: {
            revokedAt: null,
            OR: [
              { scopeType: 'GLOBAL' },
              {
                scopeType: 'EVENT',
                eventId: params.eventId ?? undefined,
              },
            ],
          },
          select: {
            role: {
              select: {
                permissions: {
                  select: {
                    permission: {
                      select: { key: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!user?.isActive) {
      return { allowed: false, reason: 'User profile is not active' }
    }

    const permissionKeys = new Set(
      user.roleAssignments.flatMap((assignment) =>
        assignment.role.permissions.map((entry) => entry.permission.key),
      ),
    )

    return {
      allowed: permissionKeys.has(params.permissionKey),
      reason: permissionKeys.has(params.permissionKey)
        ? undefined
        : `Missing permission: ${params.permissionKey}`,
    }
  } catch (error) {
    if (isPrismaUnavailable(error)) {
      return {
        allowed: LEGACY_BOOTSTRAP_PERMISSIONS.has(params.permissionKey),
        reason: 'RBAC tables not migrated yet',
      }
    }
    throw error
  }
}
