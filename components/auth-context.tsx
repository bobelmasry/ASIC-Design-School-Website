"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

type OAuthProvider = "google" | "github"

type User = {
  id: string
  name: string
  email: string
  avatar?: string
} | null

type AuthContextType = {
  user: User
  isAuthenticated: boolean
  permissions: string[]
  hasPermission: (permissionKey: string) => boolean
  signIn: (email: string, password: string) => Promise<void>
  signInWithProvider: (provider: OAuthProvider) => Promise<void>
  signUp: (name: string, email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  openAuthModal: () => void
  closeAuthModal: () => void
  isAuthModalOpen: boolean
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = React.useState<User>(null)
  const [permissions, setPermissions] = React.useState<string[]>([])
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false)

  const loadPermissions = React.useCallback(async (accessToken: string) => {
    const response = await fetch("/api/auth/permissions", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      setPermissions([])
      return
    }

    const result = (await response.json()) as { permissions?: string[] }
    setPermissions(Array.isArray(result.permissions) ? result.permissions : [])
  }, [])

  // Load session on startup
  React.useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getSession()

      const sessionUser = data.session?.user
      if (sessionUser) {
        setUser({
          id: sessionUser.id,
          name: sessionUser.user_metadata?.full_name || "User",
          email: sessionUser.email!,
          avatar: `https://ui-avatars.com/api/?name=${
            sessionUser.user_metadata?.full_name || "User"
          }&background=0ea5e9&color=fff`,
        })
        if (data.session?.access_token) {
          await loadPermissions(data.session.access_token)
        }
      } else {
        setPermissions([])
      }
    }

    loadUser()

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const sessionUser = session?.user

        if (sessionUser) {
          setUser({
            id: sessionUser.id,
            name: sessionUser.user_metadata?.full_name || "User",
            email: sessionUser.email!,
            avatar: `https://ui-avatars.com/api/?name=${
              sessionUser.user_metadata?.full_name || "User"
            }&background=0ea5e9&color=fff`,
          })

          if (session?.access_token) {
            void loadPermissions(session.access_token)
          }
        } else {
          setUser(null)
          setPermissions([])
        }
      }
    )

    return () => listener.subscription.unsubscribe()
  }, [loadPermissions])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    setIsAuthModalOpen(false)
  }

  const signInWithProvider = async (provider: OAuthProvider) => {
    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/callback`
        : undefined

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
      },
    })

    if (error) throw error
    setIsAuthModalOpen(false)
  }

  const signUp = async (name: string, email: string, password: string) => {
    const emailRedirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/verify-email`
        : undefined

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo,
        data: {
          full_name: name,
        },
      },
    })

    if (error) throw error
    setIsAuthModalOpen(false)
    router.push(`/verify-email?email=${encodeURIComponent(email)}`)
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setPermissions([])
  }

  const openAuthModal = () => setIsAuthModalOpen(true)
  const closeAuthModal = () => setIsAuthModalOpen(false)

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        permissions,
        hasPermission: (permissionKey: string) => permissions.includes(permissionKey),
        signIn,
        signInWithProvider,
        signUp,
        signOut,
        openAuthModal,
        closeAuthModal,
        isAuthModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = React.useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}