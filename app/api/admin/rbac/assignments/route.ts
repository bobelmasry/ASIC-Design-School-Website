import { NextResponse } from 'next/server'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { ensureAdminAccess } from '@/lib/server/admin-access'
import { logAuditEvent } from '@/lib/server/audit'

const assignmentScopeEnum = z.enum(['GLOBAL', 'EVENT'])
type AssignmentScope = z.infer<typeof assignmentScopeEnum>

type RoleAssignmentSummary = {
  id: string
  scopeType: string
  eventId: string | null
  createdAt: Date
  role: {
    key: string
    name: string
  }
  userProfile: {
    authUserId: string
    email: string
    displayName: string | null
  }
}

const createAssignmentSchema = z.object({
  targetAuthUserId: z.string().trim().min(1),
  targetEmail: z.string().email(),
  targetDisplayName: z.string().trim().min(1).optional(),
  roleKey: z.string().trim().min(1),
  scopeType: assignmentScopeEnum.default('GLOBAL'),
  eventId: z.string().trim().min(1).optional(),
})

const revokeAssignmentSchema = z.object({
  targetAuthUserId: z.string().trim().min(1),
  roleKey: z.string().trim().min(1),
  scopeType: assignmentScopeEnum.default('GLOBAL'),
  eventId: z.string().trim().min(1).optional(),
})

export async function GET(request: Request) {
  const access = await ensureAdminAccess(request, { allowForumModeration: true })
  if ('error' in access) return access.error

  const url = new URL(request.url)
  const targetAuthUserId = url.searchParams.get('targetAuthUserId')

  const where = {
    revokedAt: null,
    ...(targetAuthUserId
      ? {
          userProfile: {
            authUserId: targetAuthUserId,
          },
        }
      : {}),
  }

  const assignments = (await prisma.roleAssignment.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      role: {
        select: {
          key: true,
          name: true,
        },
      },
      userProfile: {
        select: {
          authUserId: true,
          email: true,
          displayName: true,
        },
      },
    },
  })) as RoleAssignmentSummary[]

  return NextResponse.json({
    assignments: assignments.map((assignment: RoleAssignmentSummary) => ({
      id: assignment.id,
      scopeType: assignment.scopeType,
      eventId: assignment.eventId,
      createdAt: assignment.createdAt,
      role: assignment.role,
      user: assignment.userProfile,
    })),
  })
}

export async function POST(request: Request) {
  const access = await ensureAdminAccess(request, { allowForumModeration: true })
  if ('error' in access) return access.error

  const parsed = createAssignmentSchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid payload', issues: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const payload = parsed.data

  if (payload.scopeType === 'EVENT' && !payload.eventId) {
    return NextResponse.json(
      { error: 'eventId is required for EVENT scope assignments' },
      { status: 400 },
    )
  }

  const role = await prisma.role.findUnique({
    where: { key: payload.roleKey },
    select: { id: true, key: true, name: true },
  })

  if (!role) {
    return NextResponse.json({ error: 'Role not found' }, { status: 404 })
  }

  const targetUser = await prisma.userProfile.upsert({
    where: { authUserId: payload.targetAuthUserId },
    update: {
      email: payload.targetEmail,
      displayName: payload.targetDisplayName ?? undefined,
      isActive: true,
      roleVersion: { increment: 1 },
    },
    create: {
      authUserId: payload.targetAuthUserId,
      email: payload.targetEmail,
      displayName: payload.targetDisplayName,
    },
    select: { id: true, authUserId: true, email: true, displayName: true },
  })

  const existingAssignment = await prisma.roleAssignment.findFirst({
    where: {
      userProfileId: targetUser.id,
      roleId: role.id,
      scopeType: payload.scopeType as AssignmentScope,
      eventId: payload.eventId ?? null,
      revokedAt: null,
    },
    select: { id: true },
  })

  if (existingAssignment) {
    return NextResponse.json(
      {
        assignment: {
          id: existingAssignment.id,
          status: 'already-assigned',
          role,
          user: targetUser,
          scopeType: payload.scopeType,
          eventId: payload.eventId ?? null,
        },
      },
      { status: 200 },
    )
  }

  const assignment = await prisma.roleAssignment.create({
    data: {
      userProfileId: targetUser.id,
      roleId: role.id,
      scopeType: payload.scopeType as AssignmentScope,
      eventId: payload.eventId ?? null,
      grantedById: access.authUserId,
    },
    select: {
      id: true,
      createdAt: true,
      scopeType: true,
      eventId: true,
    },
  })

  await logAuditEvent({
    actorAuthUserId: access.authUserId,
    action: 'rbac.role_assignment.create',
    target: 'role_assignment',
    targetId: assignment.id,
    eventId: payload.eventId ?? null,
    metadata: {
      targetAuthUserId: targetUser.authUserId,
      roleKey: role.key,
      scopeType: payload.scopeType,
    },
  })

  return NextResponse.json(
    {
      assignment: {
        ...assignment,
        status: 'created',
        role,
        user: targetUser,
      },
    },
    { status: 201 },
  )
}

export async function DELETE(request: Request) {
  const access = await ensureAdminAccess(request, { allowForumModeration: true })
  if ('error' in access) return access.error

  const parsed = revokeAssignmentSchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid payload', issues: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const payload = parsed.data

  if (payload.scopeType === 'EVENT' && !payload.eventId) {
    return NextResponse.json(
      { error: 'eventId is required for EVENT scope assignments' },
      { status: 400 },
    )
  }

  const role = await prisma.role.findUnique({
    where: { key: payload.roleKey },
    select: { id: true },
  })

  if (!role) {
    return NextResponse.json({ error: 'Role not found' }, { status: 404 })
  }

  const targetUser = await prisma.userProfile.findUnique({
    where: { authUserId: payload.targetAuthUserId },
    select: { id: true },
  })

  if (!targetUser) {
    return NextResponse.json({ error: 'Target user not found' }, { status: 404 })
  }

  const revokeResult = await prisma.roleAssignment.updateMany({
    where: {
      userProfileId: targetUser.id,
      roleId: role.id,
      scopeType: payload.scopeType,
      eventId: payload.eventId ?? null,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  })

  if (revokeResult.count > 0) {
    await prisma.userProfile.update({
      where: { id: targetUser.id },
      data: {
        roleVersion: { increment: 1 },
      },
    })

    await logAuditEvent({
      actorAuthUserId: access.authUserId,
      action: 'rbac.role_assignment.revoke',
      target: 'role_assignment',
      targetId: null,
      eventId: payload.eventId ?? null,
      metadata: {
        targetAuthUserId: payload.targetAuthUserId,
        roleKey: payload.roleKey,
        scopeType: payload.scopeType,
        revokedCount: revokeResult.count,
      },
    })
  }

  return NextResponse.json({ revokedCount: revokeResult.count })
}
