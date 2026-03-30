import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

type AuditEventParams = {
  actorAuthUserId?: string | null
  action: string
  target: string
  targetId?: string | null
  eventId?: string | null
  metadata?: unknown
}

export const logAuditEvent = async (params: AuditEventParams) => {
  let actorId: string | null = null

  if (params.actorAuthUserId) {
    const actorProfile = await prisma.userProfile.findUnique({
      where: { authUserId: params.actorAuthUserId },
      select: { id: true },
    })

    actorId = actorProfile?.id ?? null
  }

  await prisma.auditLog.create({
    data: {
      actorId,
      action: params.action,
      target: params.target,
      targetId: params.targetId ?? null,
      eventId: params.eventId ?? null,
      metadata: params.metadata as Prisma.JsonValue,
    },
  })
}
