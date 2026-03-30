import { NextResponse } from 'next/server'

import { checkPermission, ensureUserProfile } from '@/lib/server/rbac'
import { getAuthenticatedUser } from '@/lib/server/supabase-auth'

type AdminAccessOptions = {
  allowForumModeration?: boolean
}

type AdminAccessResult = {
  authUserId: string
}

type AdminAccessError = {
  error: NextResponse
}

export const ensureAdminAccess = async (
  request: Request,
  options: AdminAccessOptions = {},
): Promise<AdminAccessResult | AdminAccessError> => {
  const auth = await getAuthenticatedUser(request)
  if (!auth.user) {
    return {
      error: NextResponse.json({ error: 'Authentication required' }, { status: 401 }),
    }
  }

  await ensureUserProfile({
    authUserId: auth.user.id,
    email: auth.user.email ?? `${auth.user.id}@unknown.local`,
    displayName: auth.user.user_metadata?.full_name ?? null,
    emailVerified: Boolean(auth.user.email_confirmed_at),
  })

  const adminAccess = await checkPermission({
    authUserId: auth.user.id,
    permissionKey: 'admin.access',
  })

  if (adminAccess.allowed) {
    return { authUserId: auth.user.id }
  }

  if (options.allowForumModeration) {
    const moderatorAccess = await checkPermission({
      authUserId: auth.user.id,
      permissionKey: 'forum.moderate',
    })

    if (moderatorAccess.allowed) {
      return { authUserId: auth.user.id }
    }
  }

  return {
    error: NextResponse.json(
      { error: adminAccess.reason ?? 'Permission denied' },
      { status: 403 },
    ),
  }
}