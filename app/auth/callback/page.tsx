"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  React.useEffect(() => {
    const syncSession = async () => {
      const explicitError = searchParams.get("error_description") ?? searchParams.get("error")
      if (explicitError) {
        setErrorMessage(explicitError)
        return
      }

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.access_token) {
        setErrorMessage("Sign in could not be completed. Please try again.")
        return
      }

      router.replace("/forum")
    }

    void syncSession()
  }, [router, searchParams])

  return (
    <div className="container px-4 py-16">
      <Card className="mx-auto max-w-xl">
        <CardHeader>
          <CardTitle>Completing sign in</CardTitle>
          <CardDescription>
            We are finalizing your OAuth session.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {errorMessage ? (
            <>
              <p className="text-sm text-destructive">{errorMessage}</p>
              <Button asChild>
                <Link href="/login">Back to login</Link>
              </Button>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Please wait...</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
