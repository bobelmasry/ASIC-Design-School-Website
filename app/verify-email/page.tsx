"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email")

  return (
    <div className="container px-4 py-16">
      <Card className="mx-auto max-w-xl">
        <CardHeader>
          <CardTitle>Verify your email</CardTitle>
          <CardDescription>
            Finish registration by clicking the verification link in your inbox.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          {email ? (
            <p>
              We sent a verification email to <span className="font-medium text-foreground">{email}</span>.
            </p>
          ) : (
            <p>Check your email inbox for the verification link from Supabase Auth.</p>
          )}
          <p>
            After verification, return to login and sign in to access protected routes.
          </p>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/login">Go to login</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Back to home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
