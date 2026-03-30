export type AppRole = 'member' | 'employee' | 'admin'

const ROLE_HIERARCHY: Record<AppRole, number> = {
  member: 0,
  employee: 1,
  admin: 2,
}

export const normalizeRole = (role: string | null | undefined): AppRole => {
  if (role === 'admin' || role === 'employee' || role === 'member') {
    return role
  }

  return 'member'
}

export const hasRoleAtLeast = (role: AppRole, minimumRole: AppRole) => {
  return ROLE_HIERARCHY[role] >= ROLE_HIERARCHY[minimumRole]
}

export const canAccessMembersPage = (role: AppRole) => hasRoleAtLeast(role, 'employee')

export const canModerateForum = (role: AppRole) => hasRoleAtLeast(role, 'admin')

export const resolveRoleFromMetadata = (input: {
  appMetadata?: Record<string, unknown> | null
  userMetadata?: Record<string, unknown> | null
}) => {
  const appMetadataRole =
    typeof input.appMetadata?.role === 'string' ? input.appMetadata.role : null
  const userMetadataRole =
    typeof input.userMetadata?.role === 'string' ? input.userMetadata.role : null

  return normalizeRole(appMetadataRole ?? userMetadataRole)
}