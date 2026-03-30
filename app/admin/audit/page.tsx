"use client"

import * as React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import { useAuth } from '@/components/auth-context'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'

type AuditRow = {
  id: string
  action: string
  target: string
  targetId: string | null
  eventId: string | null
  metadata: unknown
  createdAt: string
  actor: {
    authUserId: string
    email: string
    displayName: string | null
  } | null
}

export default function AdminAuditPage() {
  const { isAuthenticated, hasPermission, openAuthModal } = useAuth()
  const canAccessAdmin = hasPermission('admin.access')

  const [actionFilter, setActionFilter] = React.useState('')
  const [targetFilter, setTargetFilter] = React.useState('')
  const [actorFilter, setActorFilter] = React.useState('')
  const [logs, setLogs] = React.useState<AuditRow[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const loadLogs = React.useCallback(async () => {
    setError(null)

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.access_token) {
      setError('Your session expired. Please sign in again.')
      openAuthModal()
      return
    }

    const params = new URLSearchParams()
    if (actionFilter.trim()) params.set('action', actionFilter.trim())
    if (targetFilter.trim()) params.set('target', targetFilter.trim())
    if (actorFilter.trim()) params.set('actorAuthUserId', actorFilter.trim())

    setIsLoading(true)
    const response = await fetch(`/api/admin/audit?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    })

    const result = await response.json()

    if (!response.ok) {
      setError(result?.error ?? 'Failed to load audit logs')
      setIsLoading(false)
      return
    }

    setLogs(Array.isArray(result?.logs) ? (result.logs as AuditRow[]) : [])
    setIsLoading(false)
  }, [actionFilter, actorFilter, openAuthModal, targetFilter])

  React.useEffect(() => {
    if (!isAuthenticated) return
    if (!canAccessAdmin) return
    loadLogs()
  }, [canAccessAdmin, isAuthenticated, loadLogs])

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
        <h1 className='text-3xl font-bold'>Audit Viewer</h1>
        <p className='text-muted-foreground'>Track role assignments and moderation actions.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid gap-3 md:grid-cols-3'>
            <Input
              placeholder='Action contains...'
              value={actionFilter}
              onChange={(event) => setActionFilter(event.target.value)}
            />
            <Input
              placeholder='Target contains...'
              value={targetFilter}
              onChange={(event) => setTargetFilter(event.target.value)}
            />
            <Input
              placeholder='Actor auth id contains...'
              value={actorFilter}
              onChange={(event) => setActorFilter(event.target.value)}
            />
          </div>
          <Button variant='outline' onClick={loadLogs} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Apply Filters'}
          </Button>
        </CardContent>
      </Card>

      {error && <p className='text-sm text-destructive'>{error}</p>}

      <Card>
        <CardHeader>
          <CardTitle>Recent Events</CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <p className='text-sm text-muted-foreground'>No audit records found.</p>
          ) : (
            <div className='space-y-3'>
              {logs.map((log) => (
                <div key={log.id} className='rounded-md border p-3 space-y-2'>
                  <div className='flex flex-wrap items-center gap-2'>
                    <Badge variant='secondary'>{log.action}</Badge>
                    <Badge variant='outline'>{log.target}</Badge>
                    {log.targetId && <Badge variant='outline'>target: {log.targetId}</Badge>}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    {new Date(log.createdAt).toLocaleString()} | actor: {log.actor?.authUserId || 'system'}
                  </p>
                  {log.metadata ? (
                    <pre className='text-xs whitespace-pre-wrap bg-muted rounded-md p-2 overflow-x-auto'>
                      {JSON.stringify(log.metadata, null, 2)}
                    </pre>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
