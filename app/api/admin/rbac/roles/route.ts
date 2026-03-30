import { NextResponse } from 'next/server'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { ensureAdminAccess } from '@/lib/server/admin-access'

const mutateRoleSchema = z.object({
  key: z.string().trim().min(1).max(60),
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500).optional(),
  permissionKeys: z.array(z.string().trim().min(1)).default([]),
})

const updateRoleSchema = mutateRoleSchema.extend({
  roleId: z.string().trim().min(1),
})

type RoleWithPermissions = {
  id: string
  key: string
  name: string
  description: string | null
  isSystem: boolean
  permissions: Array<{
    permission: {
      key: string
      resource: string
      action: string
    }
  }>
}

export async function GET(request: Request) {
  const access = await ensureAdminAccess(request, { allowForumModeration: true })
  if ('error' in access) return access.error

  const roles = (await prisma.role.findMany({
    orderBy: { key: 'asc' },
    include: {
      permissions: {
        include: {
          permission: {
            select: {
              key: true,
              resource: true,
              action: true,
            },
          },
        },
      },
    },
  })) as RoleWithPermissions[]

  return NextResponse.json({
    roles: roles.map((role: RoleWithPermissions) => ({
      id: role.id,
      key: role.key,
      name: role.name,
      description: role.description,
      isSystem: role.isSystem,
      permissions: role.permissions.map((entry: RoleWithPermissions['permissions'][number]) => entry.permission),
    })),
  })
}

export async function POST(request: Request) {
  const access = await ensureAdminAccess(request)
  if ('error' in access) return access.error

  const parsed = mutateRoleSchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid payload', issues: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const payload = parsed.data
  const uniquePermissionKeys = Array.from(new Set(payload.permissionKeys))
  const permissions = uniquePermissionKeys.length
    ? await prisma.permission.findMany({
        where: { key: { in: uniquePermissionKeys } },
        select: { id: true, key: true },
      })
    : []

  if (permissions.length !== uniquePermissionKeys.length) {
    return NextResponse.json(
      { error: 'One or more permission keys are invalid' },
      { status: 400 },
    )
  }

  const role = await prisma.role.create({
    data: {
      key: payload.key,
      name: payload.name,
      description: payload.description ?? null,
      isSystem: false,
      permissions: {
        create: permissions.map((permission) => ({ permissionId: permission.id })),
      },
    },
    include: {
      permissions: {
        include: {
          permission: {
            select: {
              key: true,
              resource: true,
              action: true,
            },
          },
        },
      },
    },
  })

  return NextResponse.json(
    {
      role: {
        id: role.id,
        key: role.key,
        name: role.name,
        description: role.description,
        isSystem: role.isSystem,
        permissions: role.permissions.map((entry) => entry.permission),
      },
    },
    { status: 201 },
  )
}

export async function PATCH(request: Request) {
  const access = await ensureAdminAccess(request)
  if ('error' in access) return access.error

  const parsed = updateRoleSchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid payload', issues: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const payload = parsed.data
  const existingRole = await prisma.role.findUnique({
    where: { id: payload.roleId },
    select: { id: true, isSystem: true },
  })

  if (!existingRole) {
    return NextResponse.json({ error: 'Role not found' }, { status: 404 })
  }

  if (existingRole.isSystem) {
    return NextResponse.json(
      { error: 'System roles cannot be edited' },
      { status: 403 },
    )
  }

  const uniquePermissionKeys = Array.from(new Set(payload.permissionKeys))
  const permissions = uniquePermissionKeys.length
    ? await prisma.permission.findMany({
        where: { key: { in: uniquePermissionKeys } },
        select: { id: true, key: true },
      })
    : []

  if (permissions.length !== uniquePermissionKeys.length) {
    return NextResponse.json(
      { error: 'One or more permission keys are invalid' },
      { status: 400 },
    )
  }

  const role = await prisma.$transaction(async (tx) => {
    await tx.rolePermission.deleteMany({
      where: { roleId: payload.roleId },
    })

    return tx.role.update({
      where: { id: payload.roleId },
      data: {
        key: payload.key,
        name: payload.name,
        description: payload.description ?? null,
        permissions: {
          create: permissions.map((permission) => ({ permissionId: permission.id })),
        },
      },
      include: {
        permissions: {
          include: {
            permission: {
              select: {
                key: true,
                resource: true,
                action: true,
              },
            },
          },
        },
      },
    })
  })

  return NextResponse.json({
    role: {
      id: role.id,
      key: role.key,
      name: role.name,
      description: role.description,
      isSystem: role.isSystem,
      permissions: role.permissions.map((entry) => entry.permission),
    },
  })
}
