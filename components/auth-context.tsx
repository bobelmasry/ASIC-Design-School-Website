"use client"

import * as React from "react"
import { supabase } from "@/lib/supabase"

type User = {
  id: string
  name: string
  email: string
  avatar?: string
} | null

type AuthContextType = {
  user: User
  isAuthenticated: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (name: string, email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  openAuthModal: () => void
  closeAuthModal: () => void
  isAuthModalOpen: boolean
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User>(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false)

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

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
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