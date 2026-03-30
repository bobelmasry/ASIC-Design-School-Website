"use client"

import Link from "next/link"

import { useAuth } from "@/components/auth-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const modules = [
  {
    title: "Forum Administration",
    description: "Manage role assignments for forum moderation and review active assignments.",
    href: "/forum/admin",
    enabled: true,
  },
  {
    title: "User Management",
    description: "Browse profiles, account status, and active role assignments.",
    href: "/admin/users",
    enabled: true,
  },
  {
    title: "Role & Permission Editor",
    description: "Create custom roles and manage mapped permission keys.",
    href: "/admin/roles",
    enabled: true,
  },
  {
    title: "Audit Viewer",
    description: "Inspect audit trails for RBAC changes and moderation actions.",
    href: "/admin/audit",
    enabled: true,
  },
]

export default function AdminPage() {
  const { isAuthenticated, hasPermission, openAuthModal } = useAuth()

  const canAccessAdmin = hasPermission("admin.access") || hasPermission("forum.moderate")

  if (!isAuthenticated) {
    return (
      <div className="container px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Sign in required</h1>
        <p className="mt-2 text-muted-foreground">Admin pages require an authenticated account.</p>
        <Button className="mt-6" onClick={openAuthModal}>Sign In</Button>
      </div>
    )
  }

  if (!canAccessAdmin) {
    return (
      <div className="container px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Not authorized</h1>
        <p className="mt-2 text-muted-foreground">Your account does not currently include admin access.</p>
      </div>
    )
  }

  return (
    <div className="container px-4 py-10 md:py-14">
      <div className="mb-8">
        <Badge variant="outline" className="mb-3">Admin</Badge>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Admin Hub</h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Centralized entry for administration workflows. Enabled modules are clickable; upcoming modules are scaffolded.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {modules.map((module) => (
          <Card key={module.title} className="border-gray-300 dark:border-gray-800">
            <CardHeader>
              <CardTitle>{module.title}</CardTitle>
              <CardDescription>{module.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {module.enabled ? (
                <Button asChild>
                  <Link href={module.href}>Open module</Link>
                </Button>
              ) : (
                <Button disabled variant="outline">Planned</Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
