"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/auth-context"
import { Cpu } from "lucide-react"

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, signIn, signInWithProvider, signUp } = useAuth()
  const [mode, setMode] = React.useState<"signin" | "signup">("signin")
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      if (mode === "signin") {
        await signIn(email, password)
      } else {
        await signUp(name, email, password)
        setSuccessMessage("Account created. Check your email to verify your account before signing in.")
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Authentication failed"
      setErrorMessage(message)
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    if (!isAuthModalOpen) {
      setErrorMessage(null)
      setSuccessMessage(null)
    }
  }, [isAuthModalOpen])

  const handleProviderSignIn = async (provider: "google" | "github") => {
    setIsLoading(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      await signInWithProvider(provider)
    } catch (error) {
      const message = error instanceof Error ? error.message : "OAuth sign in failed"
      setErrorMessage(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={closeAuthModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Cpu className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">Open Source ASIC Hub</span>
          </div>
          <DialogTitle className="text-center">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {mode === "signin"
              ? "Sign in to connect with the ASIC engineering community"
              : "Join the MENA ASIC engineering community"}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Loading..." : mode === "signin" ? "Sign In" : "Sign Up"}
          </Button>

          {errorMessage && (
            <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {errorMessage}
            </p>
          )}

          {successMessage && (
            <p className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300">
              {successMessage}
            </p>
          )}
        </form>

        <div className="space-y-2">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => void handleProviderSignIn("google")}
            disabled={isLoading}
          >
            Continue with Google
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => void handleProviderSignIn("github")}
            disabled={isLoading}
          >
            Continue with GitHub
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          {mode === "signin" ? (
            <>
              {"Don't have an account? "}
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={() => setMode("signup")}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={() => setMode("signin")}
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </DialogContent>
    </Dialog>
  )
}
