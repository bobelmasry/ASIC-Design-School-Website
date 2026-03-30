"use client"

import Link from "next/link"

import { useAuth } from "@/components/auth-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function MaterialsPage() {
  const { isAuthenticated, hasPermission, openAuthModal } = useAuth()

  if (!isAuthenticated) {
    return (
      <div className="container px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Sign in required</h1>
        <p className="mt-2 text-muted-foreground">Learning materials are available for authenticated users with materials access.</p>
        <Button className="mt-6" onClick={openAuthModal}>Sign In</Button>
      </div>
    )
  }

  if (!hasPermission("materials.read")) {
    return (
      <div className="container px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Not authorized</h1>
        <p className="mt-2 text-muted-foreground">You need a role that includes materials.read to access this section.</p>
      </div>
    )
  }

  return (
    <div className="container px-4 py-10 md:py-14">
      <div className="mb-8">
        <Badge variant="outline" className="mb-3">Learning Materials</Badge>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Materials</h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Materials UI scaffold is now available. Event/session scoped content wiring is the next implementation step.
        </p>
      </div>

      <Card className="max-w-3xl border-dashed border-gray-400/60 dark:border-gray-700">
        <CardHeader>
          <CardTitle>Coming Next</CardTitle>
          <CardDescription>
            Material types (video, pdf, lab_file, reading_list, remote_lab) will be rendered from the database in the next slice.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline">
            <Link href="/events">Browse events</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
