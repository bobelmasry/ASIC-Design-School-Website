"use client"

import * as React from "react"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"
import {
  canAccessMembersPage,
  canModerateForum,
  resolveRoleFromMetadata,
  type AppRole,
} from "@/lib/rbac"

type AppUser = {
  id: string
  name: string
  email: string
  role: AppRole
  avatar?: string
} | null

type AuthContextType = {
  user: AppUser
  role: AppRole
  isAuthenticated: boolean
  canAccessMembersPage: boolean
  canModerateForum: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (name: string, email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  openAuthModal: () => void
  closeAuthModal: () => void
  isAuthModalOpen: boolean
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

const mapSessionUser = (sessionUser: SupabaseUser): Exclude<AppUser, null> => {
  const fullName = sessionUser.user_metadata?.full_name || "User"
  const role = resolveRoleFromMetadata({
    appMetadata: sessionUser.app_metadata,
    userMetadata: sessionUser.user_metadata,
  })

  return {
    id: sessionUser.id,
    name: fullName,
    email: sessionUser.email!,
    role,
    avatar: `https://ui-avatars.com/api/?name=${fullName}&background=0ea5e9&color=fff`,
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AppUser>(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false)

  // Load session on startup
  React.useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getSession()

      const sessionUser = data.session?.user
      if (sessionUser) {
        setUser(mapSessionUser(sessionUser))
      }
    }

    loadUser()

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const sessionUser = session?.user

        if (sessionUser) {
          setUser(mapSessionUser(sessionUser))
        } else {
          setUser(null)
        }
      }
    )

    return () => listener.subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    setIsAuthModalOpen(false)
  }

  const signUp = async (name: string, email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    })

    if (error) throw error
    setIsAuthModalOpen(false)
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const openAuthModal = () => setIsAuthModalOpen(true)
  const closeAuthModal = () => setIsAuthModalOpen(false)
  const role = user?.role ?? "member"

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!user,
        canAccessMembersPage: canAccessMembersPage(role),
        canModerateForum: canModerateForum(role),
        signIn,
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