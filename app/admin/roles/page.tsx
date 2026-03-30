"use client"

import * as React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import { useAuth } from '@/components/auth-context'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { supabase } from '@/lib/supabase'

type PermissionRecord = {
  id: string
  key: string
  resource: string
  action: string
  description: string | null
}

type RoleRecord = {
  id: string
  key: string
  name: string
  description: string | null
  isSystem: boolean
  permissions: Array<{
    key: string
    resource: string
    action: string
  }>
}

export default function AdminRolesPage() {
  const { isAuthenticated, hasPermission, openAuthModal } = useAuth()
  const canAccessAdmin = hasPermission('admin.access')

  const [roles, setRoles] = React.useState<RoleRecord[]>([])
  const [permissions, setPermissions] = React.useState<PermissionRecord[]>([])
  const [selectedRoleId, setSelectedRoleId] = React.useState<string | null>(null)

  const [isLoading, setIsLoading] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState<string | null>(null)

  const [form, setForm] = React.useState({
    key: '',
    name: '',
    description: '',
    permissionKeys: [] as string[],
  })

  const selectedRole = React.useMemo(
    () => roles.find((role) => role.id === selectedRoleId) ?? null,
    [roles, selectedRoleId],
  )

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

  const loadData = React.useCallback(async () => {
    const token = await withToken()
    if (!token) return

    setError(null)
    setSuccess(null)
    setIsLoading(true)

    const [rolesResponse, permissionsResponse] = await Promise.all([
      fetch('/api/admin/rbac/roles', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      fetch('/api/admin/rbac/permissions', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    ])

    const [rolesResult, permissionsResult] = await Promise.all([
      rolesResponse.json(),
      permissionsResponse.json(),
    ])

    if (!rolesResponse.ok) {
      setError(rolesResult?.error ?? 'Failed to load roles')
      setIsLoading(false)
      return
    }

    if (!permissionsResponse.ok) {
      setError(permissionsResult?.error ?? 'Failed to load permissions')
      setIsLoading(false)
      return
    }

    const nextRoles = Array.isArray(rolesResult?.roles) ? (rolesResult.roles as RoleRecord[]) : []
    setRoles(nextRoles)
    setPermissions(
      Array.isArray(permissionsResult?.permissions)
        ? (permissionsResult.permissions as PermissionRecord[])
        : [],
    )

    if (!selectedRoleId && nextRoles.length > 0) {
      setSelectedRoleId(nextRoles[0].id)
    }

    setIsLoading(false)
  }, [selectedRoleId, withToken])

  React.useEffect(() => {
    if (!isAuthenticated || !canAccessAdmin) return
    loadData()
  }, [canAccessAdmin, isAuthenticated, loadData])

  React.useEffect(() => {
    if (!selectedRole) return

    setForm({
      key: selectedRole.key,
      name: selectedRole.name,
      description: selectedRole.description ?? '',
      permissionKeys: selectedRole.permissions.map((permission) => permission.key),
    })
  }, [selectedRole])

  const togglePermission = (permissionKey: string) => {
    setForm((prev) => {
      const exists = prev.permissionKeys.includes(permissionKey)
      return {
        ...prev,
        permissionKeys: exists
          ? prev.permissionKeys.filter((value) => value !== permissionKey)
          : [...prev.permissionKeys, permissionKey],
      }
    })
  }

  const handleCreate = async () => {
    const token = await withToken()
    if (!token) return

    if (!form.key.trim() || !form.name.trim()) {
      setError('Role key and name are required')
      return
    }

    setError(null)
    setSuccess(null)
    setIsSubmitting(true)

    const response = await fetch('/api/admin/rbac/roles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        key: form.key.trim(),
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        permissionKeys: form.permissionKeys,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      setError(result?.error ?? 'Failed to create role')
      setIsSubmitting(false)
      return
    }

    setSuccess('Role created successfully')
    setSelectedRoleId(result?.role?.id ?? null)
    await loadData()
    setIsSubmitting(false)
  }

  const handleUpdate = async () => {
    if (!selectedRole) {
      setError('Select a role to update')
      return
    }

    const token = await withToken()
    if (!token) return

    setError(null)
    setSuccess(null)
    setIsSubmitting(true)

    const response = await fetch('/api/admin/rbac/roles', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        roleId: selectedRole.id,
        key: form.key.trim(),
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        permissionKeys: form.permissionKeys,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      setError(result?.error ?? 'Failed to update role')
      setIsSubmitting(false)
      return
    }

    setSuccess('Role updated successfully')
    await loadData()
    setIsSubmitting(false)
  }

  const resetForNewRole = () => {
    setSelectedRoleId(null)
    setForm({
      key: '',
      name: '',
      description: '',
      permissionKeys: [],
    })
    setError(null)
    setSuccess(null)
  }

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
      <div>
        <Button variant='ghost' className='mb-2' asChild>
          <Link href='/admin'>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Back to Admin Hub
          </Link>
        </Button>
        <h1 className='text-3xl font-bold'>Role and Permission Editor</h1>
        <p className='text-muted-foreground'>Create custom roles and map permission keys.</p>
      </div>

      {error && <p className='text-sm text-destructive'>{error}</p>}
      {success && <p className='text-sm text-green-600 dark:text-green-400'>{success}</p>}

      <div className='grid gap-6 lg:grid-cols-3'>
        <Card className='lg:col-span-1'>
          <CardHeader>
            <CardTitle>Roles</CardTitle>
            <CardDescription>System roles are read-only.</CardDescription>
          </CardHeader>
          <CardContent className='space-y-2'>
            <Button variant='outline' className='w-full' onClick={resetForNewRole}>
              New Role
            </Button>
            {isLoading ? (
              <p className='text-sm text-muted-foreground'>Loading roles...</p>
            ) : (
              roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRoleId(role.id)}
                  className={`w-full rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                    selectedRoleId === role.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                  }`}
                >
                  <div className='flex items-center justify-between gap-2'>
                    <span className='font-medium'>{role.name}</span>
                    {role.isSystem ? <Badge variant='outline'>system</Badge> : null}
                  </div>
                  <p className='text-xs text-muted-foreground'>{role.key}</p>
                </button>
              ))
            )}
          </CardContent>
        </Card>

        <Card className='lg:col-span-2'>
          <CardHeader>
            <CardTitle>{selectedRole ? 'Edit Role' : 'Create Role'}</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='role-key'>Role Key</Label>
                <Input
                  id='role-key'
                  value={form.key}
                  disabled={Boolean(selectedRole?.isSystem)}
                  onChange={(event) => setForm((prev) => ({ ...prev, key: event.target.value }))}
                  placeholder='events_manager'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='role-name'>Role Name</Label>
                <Input
                  id='role-name'
                  value={form.name}
                  disabled={Boolean(selectedRole?.isSystem)}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder='Events Manager'
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='role-description'>Description</Label>
              <Textarea
                id='role-description'
                value={form.description}
                disabled={Boolean(selectedRole?.isSystem)}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, description: event.target.value }))
                }
                rows={3}
                placeholder='Optional role description'
              />
            </div>

            <div className='space-y-2'>
              <Label>Permissions</Label>
              <div className='max-h-72 overflow-y-auto rounded-md border p-3 space-y-2'>
                {permissions.map((permission) => {
                  const checked = form.permissionKeys.includes(permission.key)
                  return (
                    <label
                      key={permission.id}
                      className='flex items-start gap-3 rounded-md border px-3 py-2 text-sm cursor-pointer hover:bg-muted/50'
                    >
                      <input
                        type='checkbox'
                        checked={checked}
                        disabled={Boolean(selectedRole?.isSystem)}
                        onChange={() => togglePermission(permission.key)}
                        className='mt-0.5'
                      />
                      <span>
                        <span className='font-medium'>{permission.key}</span>
                        <span className='block text-xs text-muted-foreground'>
                          {permission.resource}.{permission.action}
                        </span>
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>

            <div className='flex flex-wrap gap-2'>
              {!selectedRole ? (
                <Button onClick={handleCreate} disabled={isSubmitting || isLoading}>
                  {isSubmitting ? 'Creating...' : 'Create Role'}
                </Button>
              ) : (
                <Button
                  onClick={handleUpdate}
                  disabled={isSubmitting || isLoading || Boolean(selectedRole.isSystem)}
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
