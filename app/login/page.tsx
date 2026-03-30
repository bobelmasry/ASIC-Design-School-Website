"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth-context"

export default function LoginPage() {
  const searchParams = useSearchParams()
  const { openAuthModal } = useAuth()

  const nextPath = searchParams.get("next") ?? "/forum"
  const reason = searchParams.get("reason")

  React.useEffect(() => {
    openAuthModal()
  }, [openAuthModal])

  return (
    <div className="container px-4 py-16">
      <Card className="mx-auto max-w-xl">
        <CardHeader>
          <CardTitle>Sign in required</CardTitle>
          <CardDescription>
            {reason === "expired"
              ? "Your session expired. Sign in again to continue."
              : "Please sign in to continue to protected pages."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full" onClick={openAuthModal}>
            Open sign in form
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href={nextPath}>Continue after signing in</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
