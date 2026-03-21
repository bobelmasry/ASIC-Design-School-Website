"use client"

import * as React from "react"

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
  signOut: () => void
  openAuthModal: () => void
  closeAuthModal: () => void
  isAuthModalOpen: boolean
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User>(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false)

  const signIn = async (email: string, _password: string) => {
    // Simulated sign in - in production, this would hit your API
    setUser({
      id: "1",
      name: email.split("@")[0],
      email,
      avatar: `https://ui-avatars.com/api/?name=${email.split("@")[0]}&background=0ea5e9&color=fff`,
    })
    setIsAuthModalOpen(false)
  }

  const signUp = async (name: string, email: string, _password: string) => {
    // Simulated sign up
    setUser({
      id: "1",
      name,
      email,
      avatar: `https://ui-avatars.com/api/?name=${name}&background=0ea5e9&color=fff`,
    })
    setIsAuthModalOpen(false)
  }

  const signOut = () => {
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
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
