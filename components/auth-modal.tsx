"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/auth-context"
import { Cpu, Github, Linkedin } from "lucide-react"

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.55-.2-2.27H12v4.29h6.44a5.5 5.5 0 0 1-2.39 3.61v2.99h3.86c2.26-2.08 3.58-5.14 3.58-8.62z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.07 7.94-2.9l-3.86-2.99c-1.07.72-2.43 1.15-4.08 1.15-3.14 0-5.8-2.12-6.75-4.98H1.27v3.13A12 12 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.25 14.28A7.2 7.2 0 0 1 4.87 12c0-.79.14-1.56.38-2.28V6.59H1.27A12 12 0 0 0 0 12c0 1.94.46 3.77 1.27 5.41l3.98-3.13z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.34.61 4.58 1.81l3.43-3.43C17.95 1.15 15.24 0 12 0A12 12 0 0 0 1.27 6.59l3.98 3.13c.95-2.86 3.61-4.95 6.75-4.95z"
      />
    </svg>
  )
}

export function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithGithub,
    signInWithLinkedIn,
  } = useAuth()
  const [mode, setMode] = React.useState<"signin" | "signup">("signin")
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [authError, setAuthError] = React.useState<string | null>(null)

  const getErrorMessage = (error: unknown) => {
    if (error instanceof Error && error.message) return error.message
    return "Authentication failed. Please try again."
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError(null)
    setIsLoading(true)
    try {
      if (mode === "signin") {
        await signIn(email, password)
      } else {
        await signUp(name, email, password)
      }
    } catch (error) {
      setAuthError(getErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }

  const handleProviderSignIn = async (provider: "google" | "github" | "linkedin") => {
    setAuthError(null)
    setIsLoading(true)
    try {
      if (provider === "google") {
        await signInWithGoogle()
      } else if (provider === "github") {
        await signInWithGithub()
      } else {
        await signInWithLinkedIn()
      }
    } catch (error) {
      setAuthError(getErrorMessage(error))
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

        <div className="space-y-2">
          <Button
            type="button"
            variant="outline"
            className="w-full border-border/70 hover:bg-muted/60 dark:border-primary/30 dark:bg-primary/5 dark:hover:bg-primary/15 dark:hover:text-foreground"
            onClick={() => handleProviderSignIn("google")}
            disabled={isLoading}
          >
            <GoogleIcon />
            Continue with Google
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full border-border/70 hover:bg-muted/60 dark:border-primary/30 dark:bg-primary/5 dark:hover:bg-primary/15 dark:hover:text-foreground"
            onClick={() => handleProviderSignIn("github")}
            disabled={isLoading}
          >
            <Github className="h-4 w-4" />
            Continue with GitHub
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full border-border/70 hover:bg-muted/60 dark:border-primary/30 dark:bg-primary/5 dark:hover:bg-primary/15 dark:hover:text-foreground"
            onClick={() => handleProviderSignIn("linkedin")}
            disabled={isLoading}
          >
            <Linkedin className="h-4 w-4" />
            Continue with LinkedIn
          </Button>
        </div>

        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">or continue with email</span>
          </div>
        </div>
        
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
          {authError && <p className="text-sm text-destructive">{authError}</p>}
        </form>

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
