"use client"

import * as React from 'react'
import Link from 'next/link'
import { ArrowLeft, Search } from 'lucide-react'

import { useAuth } from '@/components/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { supabase } from '@/lib/supabase'

type RoleRecord = {
  id: string
  key: string
  name: string
}

type UserRow = {
  id: string
  authUserId: string
  email: string
  displayName: string | null
  emailVerified: boolean
  isActive: boolean
  createdAt: string
  roleAssignments: Array<{
    id: string
    scopeType: 'GLOBAL' | 'EVENT'
    eventId: string | null
    role: {
      key: string
      name: string
    }
  }>
}

export default function AdminUsersPage() {
  const { isAuthenticated, hasPermission, openAuthModal } = useAuth()
  const canAccessAdmin = hasPermission('admin.access')

  const [users, setUsers] = React.useState<UserRow[]>([])
  const [roles, setRoles] = React.useState<RoleRecord[]>([])
  const [search, setSearch] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [statusUpdatingAuthUserId, setStatusUpdatingAuthUserId] = React.useState<string | null>(null)
  const [assigningAuthUserId, setAssigningAuthUserId] = React.useState<string | null>(null)
  const [revokingAssignmentId, setRevokingAssignmentId] = React.useState<string | null>(null)
  const [selectedRoleByUserId, setSelectedRoleByUserId] = React.useState<Record<string, string>>({})
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState<string | null>(null)

  const withToken = React.useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.access_token) {
      setError('Your session expired. Please sign in again.')
      openAuthModal()
      return null
    }

    return session.access_token
  }, [openAuthModal])

  const loadRoles = React.useCallback(async (token: string) => {
    const response = await fetch('/api/admin/rbac/roles', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const result = await response.json()
    if (!response.ok) {
      throw new Error(result?.error ?? 'Failed to load roles')
    }

    const nextRoles = Array.isArray(result?.roles)
      ? (result.roles as Array<{ id: string; key: string; name: string }>)
      : []

    setRoles(
      nextRoles.map((role) => ({
        id: role.id,
        key: role.key,
        name: role.name,
      })),
    )
  }, [])

  const loadUsers = React.useCallback(async () => {
    setError(null)
    setSuccess(null)

    const token = await withToken()
    if (!token) return

    setIsLoading(true)

    try {
      await loadRoles(token)

      const params = new URLSearchParams()
      if (search.trim()) params.set('search', search.trim())

      const response = await fetch(`/api/admin/users?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result?.error ?? 'Failed to load users')
        setIsLoading(false)
        return
      }

      setUsers(Array.isArray(result?.users) ? (result.users as UserRow[]) : [])
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Failed to load users')
    } finally {
      setIsLoading(false)
    }
  }, [loadRoles, search, withToken])

  const handleToggleStatus = async (user: UserRow) => {
    const token = await withToken()
    if (!token) return

    setError(null)
    setSuccess(null)
    setStatusUpdatingAuthUserId(user.authUserId)

    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          authUserId: user.authUserId,
          isActive: !user.isActive,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result?.error ?? 'Failed to update user status')
        return
      }

      setUsers((prev) =>
        prev.map((item) =>
          item.authUserId === user.authUserId
            ? {
                ...item,
                isActive: Boolean(result?.user?.isActive),
              }
            : item,
        ),
      )
      setSuccess(user.isActive ? 'User suspended successfully' : 'User activated successfully')
    } catch {
      setError('Failed to update user status')
    } finally {
      setStatusUpdatingAuthUserId(null)
    }
  }

  const handleAssignRole = async (user: UserRow) => {
    const selectedRoleKey = selectedRoleByUserId[user.authUserId]
    if (!selectedRoleKey) {
      setError('Select a role before assigning')
      return
    }

    const token = await withToken()
    if (!token) return

    setError(null)
    setSuccess(null)
    setAssigningAuthUserId(user.authUserId)

    try {
      const response = await fetch('/api/admin/rbac/assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          targetAuthUserId: user.authUserId,
          targetEmail: user.email,
          targetDisplayName: user.displayName ?? undefined,
          roleKey: selectedRoleKey,
          scopeType: 'GLOBAL',
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result?.error ?? 'Failed to assign role')
        return
      }

      await loadUsers()
      setSuccess(
        result?.assignment?.status === 'already-assigned'
          ? 'Role is already assigned to this user'
          : 'Role assigned successfully',
      )
    } catch {
      setError('Failed to assign role')
    } finally {
      setAssigningAuthUserId(null)
    }
  }

  const handleRevokeAssignment = async (assignment: UserRow['roleAssignments'][number]) => {
    const targetUser = users.find((user) =>
      user.roleAssignments.some((item) => item.id === assignment.id),
    )
    if (!targetUser) {
      setError('Unable to locate assignment owner')
      return
    }

    const token = await withToken()
    if (!token) return

    setError(null)
    setSuccess(null)
    setRevokingAssignmentId(assignment.id)

    try {
      const response = await fetch('/api/admin/rbac/assignments', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          targetAuthUserId: targetUser.authUserId,
          roleKey: assignment.role.key,
          scopeType: assignment.scopeType,
          eventId: assignment.eventId ?? undefined,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result?.error ?? 'Failed to revoke assignment')
        return
      }

      await loadUsers()
      setSuccess(`Revoked ${result?.revokedCount ?? 0} assignment(s)`)
    } catch {
      setError('Failed to revoke assignment')
    } finally {
      setRevokingAssignmentId(null)
    }
  }

  React.useEffect(() => {
    if (!isAuthenticated) return
    if (!canAccessAdmin) return
    loadUsers()
  }, [canAccessAdmin, isAuthenticated, loadUsers])

  if (!isAuthenticated) {
    return (
      <div className='container px-4 py-16 text-center'>
        <h1 className='text-2xl font-bold'>Sign in required</h1>
        <p className='mt-2 text-muted-foreground'>Admin pages require an authenticated account.</p>
        <Button className='mt-6' onClick={openAuthModal}>Sign In</Button>
      </div>
    )
  }

  if (!canAccessAdmin) {
    return (
      <div className='container px-4 py-16 text-center'>
        <h1 className='text-2xl font-bold'>Not authorized</h1>
        <p className='mt-2 text-muted-foreground'>Your account does not currently include admin access.</p>
      </div>
    )
  }

  return (
    <div className='container px-4 py-10 space-y-6'>
      <div className='flex items-center justify-between gap-3'>
        <div>
          <Button variant='ghost' className='mb-2' asChild>
            <Link href='/admin'>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back to Admin Hub
            </Link>
          </Button>
          <h1 className='text-3xl font-bold'>User Management</h1>
          <p className='text-muted-foreground'>Search user profiles and inspect active assignments.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Directory</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex gap-2'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <Input
                className='pl-10'
                placeholder='Search by email, display name, or auth user id'
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <Button variant='outline' onClick={loadUsers} disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Search'}
            </Button>
          </div>

          {error && <p className='text-sm text-destructive'>{error}</p>}
          {success && <p className='text-sm text-green-600 dark:text-green-400'>{success}</p>}

          {users.length === 0 ? (
            <p className='text-sm text-muted-foreground'>No users matched this query.</p>
          ) : (
            <div className='space-y-3'>
              {users.map((user) => (
                <div key={user.id} className='rounded-md border p-3 space-y-2'>
                  <div className='flex flex-wrap items-center gap-2'>
                    <p className='font-medium'>{user.displayName || user.email}</p>
                    <Badge variant={user.isActive ? 'default' : 'destructive'}>
                      {user.isActive ? 'Active' : 'Suspended'}
                    </Badge>
                    <Badge variant={user.emailVerified ? 'secondary' : 'outline'}>
                      {user.emailVerified ? 'Verified Email' : 'Email Unverified'}
                    </Badge>
                  </div>

                  <p className='text-xs text-muted-foreground'>
                    {user.email} | {user.authUserId}
                  </p>

                  <div className='flex flex-wrap gap-2'>
                    <Button
                      size='sm'
                      variant={user.isActive ? 'destructive' : 'default'}
                      onClick={() => handleToggleStatus(user)}
                      disabled={statusUpdatingAuthUserId === user.authUserId}
                    >
                      {statusUpdatingAuthUserId === user.authUserId
                        ? 'Saving...'
                        : user.isActive
                          ? 'Suspend User'
                          : 'Activate User'}
                    </Button>
                  </div>

                  <div className='grid gap-2 md:grid-cols-[1fr_auto]'>
                    <Select
                      value={selectedRoleByUserId[user.authUserId]}
                      onValueChange={(value) =>
                        setSelectedRoleByUserId((prev) => ({ ...prev, [user.authUserId]: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select role to assign' />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.key}>
                            {role.name} ({role.key})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button
                      variant='outline'
                      onClick={() => handleAssignRole(user)}
                      disabled={assigningAuthUserId === user.authUserId || roles.length === 0}
                    >
                      {assigningAuthUserId === user.authUserId ? 'Assigning...' : 'Assign Role'}
                    </Button>
                  </div>

                  <div className='flex flex-wrap gap-2'>
                    {user.roleAssignments.length === 0 ? (
                      <Badge variant='outline'>No active roles</Badge>
                    ) : (
                      user.roleAssignments.map((assignment) => (
                        <div
                          key={assignment.id}
                          className='inline-flex items-center gap-2 rounded-md border px-2 py-1'
                        >
                          <Badge variant='outline'>
                            {assignment.role.key} ({assignment.scopeType}
                            {assignment.eventId ? `:${assignment.eventId}` : ''})
                          </Badge>
                          <Button
                            size='sm'
                            variant='ghost'
                            className='h-6 px-2'
                            onClick={() => handleRevokeAssignment(assignment)}
                            disabled={revokingAssignmentId === assignment.id}
                          >
                            {revokingAssignmentId === assignment.id ? '...' : 'Revoke'}
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
