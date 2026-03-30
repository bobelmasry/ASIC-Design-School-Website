"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, RefreshCcw, ShieldCheck, UserPlus } from "lucide-react"

import { useAuth } from "@/components/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabase"

type RoleRecord = {
  key: string
  name: string
  description?: string | null
}

type AssignmentRecord = {
  id: string
  scopeType: "GLOBAL" | "EVENT"
  eventId: string | null
  createdAt: string
  role: {
    key: string
    name: string
  }
  user: {
    authUserId: string
    email: string
    displayName?: string | null
  }
}

type ScopeType = "GLOBAL" | "EVENT"

export default function ForumAdminPage() {
  const { isAuthenticated, openAuthModal } = useAuth()

  const [roles, setRoles] = React.useState<RoleRecord[]>([])
  const [assignments, setAssignments] = React.useState<AssignmentRecord[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState<string | null>(null)

  const [targetAuthUserId, setTargetAuthUserId] = React.useState("")
  const [targetEmail, setTargetEmail] = React.useState("")
  const [targetDisplayName, setTargetDisplayName] = React.useState("")
  const [roleKey, setRoleKey] = React.useState("")
  const [scopeType, setScopeType] = React.useState<ScopeType>("GLOBAL")
  const [eventId, setEventId] = React.useState("")
  const [filterUserId, setFilterUserId] = React.useState("")

  const withToken = React.useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.access_token) return null
    return session.access_token
  }, [])

  const loadRoles = React.useCallback(async (token: string) => {
    const response = await fetch("/api/admin/rbac/roles", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const result = await response.json()
    if (!response.ok) {
      throw new Error(result?.error ?? "Failed to load role catalog")
    }

    setRoles(Array.isArray(result?.roles) ? (result.roles as RoleRecord[]) : [])
    if (!roleKey && Array.isArray(result?.roles) && result.roles.length > 0) {
      setRoleKey(result.roles[0].key)
    }
  }, [roleKey])

  const loadAssignments = React.useCallback(async (token: string) => {
    const params = new URLSearchParams()
    if (filterUserId.trim()) {
      params.set("targetAuthUserId", filterUserId.trim())
    }

    const suffix = params.toString() ? `?${params.toString()}` : ""
    const response = await fetch(`/api/admin/rbac/assignments${suffix}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const result = await response.json()
    if (!response.ok) {
      throw new Error(result?.error ?? "Failed to load assignments")
    }

    setAssignments(
      Array.isArray(result?.assignments) ? (result.assignments as AssignmentRecord[]) : [],
    )
  }, [filterUserId])

  const refresh = React.useCallback(async () => {
    setError(null)
    setSuccess(null)

    const token = await withToken()
    if (!token) {
      setError("Your session expired. Please sign in again.")
      openAuthModal()
      return
    }

    setIsLoading(true)
    try {
      await Promise.all([loadRoles(token), loadAssignments(token)])
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to load admin data")
    } finally {
      setIsLoading(false)
    }
  }, [loadAssignments, loadRoles, openAuthModal, withToken])

  React.useEffect(() => {
    if (!isAuthenticated) {
      openAuthModal()
      return
    }
    refresh()
  }, [isAuthenticated, openAuthModal, refresh])

  const handleAssign = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!targetAuthUserId.trim() || !targetEmail.trim() || !roleKey.trim()) {
      setError("User ID, email, and role are required")
      return
    }

    if (scopeType === "EVENT" && !eventId.trim()) {
      setError("Event ID is required for EVENT scope assignments")
      return
    }

    const token = await withToken()
    if (!token) {
      setError("Your session expired. Please sign in again.")
      openAuthModal()
      return
    }

    setError(null)
    setSuccess(null)
    setIsSubmitting(true)

    const payload = {
      targetAuthUserId: targetAuthUserId.trim(),
      targetEmail: targetEmail.trim(),
      targetDisplayName: targetDisplayName.trim() || undefined,
      roleKey: roleKey.trim(),
      scopeType,
      eventId: scopeType === "EVENT" ? eventId.trim() : undefined,
    }

    try {
      const response = await fetch("/api/admin/rbac/assignments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result?.error ?? "Failed to assign role")
      }

      setSuccess(result?.assignment?.status === "already-assigned" ? "Role is already assigned" : "Role assigned successfully")
      await loadAssignments(token)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to assign role")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRevoke = async (assignment: AssignmentRecord) => {
    const token = await withToken()
    if (!token) {
      setError("Your session expired. Please sign in again.")
      openAuthModal()
      return
    }

    setError(null)
    setSuccess(null)

    try {
      const response = await fetch("/api/admin/rbac/assignments", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          targetAuthUserId: assignment.user.authUserId,
          roleKey: assignment.role.key,
          scopeType: assignment.scopeType,
          eventId: assignment.eventId ?? undefined,
        }),
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result?.error ?? "Failed to revoke assignment")
      }

      setSuccess(`Revoked ${result?.revokedCount ?? 0} assignment(s)`)
      await loadAssignments(token)
    } catch (revokeError) {
      setError(revokeError instanceof Error ? revokeError.message : "Failed to revoke assignment")
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="container px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-3">Sign In Required</h1>
        <p className="text-muted-foreground mb-6">You need to sign in with moderator access.</p>
        <Button onClick={openAuthModal}>Sign In</Button>
      </div>
    )
  }

  return (
    <div className="container max-w-5xl px-4 py-8 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <Button variant="ghost" className="mb-2" asChild>
            <Link href="/forum">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Forum
            </Link>
          </Button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            Forum Admin
          </h1>
          <p className="text-sm text-muted-foreground">Manage moderator and community role assignments.</p>
        </div>

        <Button variant="outline" onClick={refresh} disabled={isLoading}>
          <RefreshCcw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && <p className="text-sm text-green-600 dark:text-green-400">{success}</p>}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Assign Role
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAssign} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="targetAuthUserId">Target User ID</Label>
              <Input
                id="targetAuthUserId"
                value={targetAuthUserId}
                onChange={(event) => setTargetAuthUserId(event.target.value)}
                placeholder="Supabase auth user id"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetEmail">Target Email</Label>
              <Input
                id="targetEmail"
                type="email"
                value={targetEmail}
                onChange={(event) => setTargetEmail(event.target.value)}
                placeholder="user@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetDisplayName">Display Name (optional)</Label>
              <Input
                id="targetDisplayName"
                value={targetDisplayName}
                onChange={(event) => setTargetDisplayName(event.target.value)}
                placeholder="Community Moderator"
              />
            </div>

            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={roleKey} onValueChange={setRoleKey}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.key} value={role.key}>
                      {role.name} ({role.key})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Scope</Label>
              <Select value={scopeType} onValueChange={(value: ScopeType) => setScopeType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select scope" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GLOBAL">GLOBAL</SelectItem>
                  <SelectItem value="EVENT">EVENT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventId">Event ID (EVENT scope only)</Label>
              <Input
                id="eventId"
                value={eventId}
                onChange={(event) => setEventId(event.target.value)}
                disabled={scopeType !== "EVENT"}
                placeholder="event_cuid"
              />
            </div>

            <div className="md:col-span-2">
              <Button type="submit" disabled={isSubmitting || isLoading}>
                {isSubmitting ? "Assigning..." : "Assign Role"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Assignments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={filterUserId}
              onChange={(event) => setFilterUserId(event.target.value)}
              placeholder="Filter by auth user id"
            />
            <Button variant="outline" onClick={refresh} disabled={isLoading}>Apply</Button>
          </div>

          {assignments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No active assignments found.</p>
          ) : (
            <div className="space-y-2">
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="border rounded-md p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                >
                  <div className="text-sm">
                    <p className="font-medium">
                      {assignment.user.displayName || assignment.user.email} - {assignment.role.name}
                    </p>
                    <p className="text-muted-foreground">
                      {assignment.user.authUserId} | {assignment.scopeType}
                      {assignment.eventId ? ` | event: ${assignment.eventId}` : ""}
                    </p>
                  </div>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRevoke(assignment)}
                  >
                    Revoke
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
