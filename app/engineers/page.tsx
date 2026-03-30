"use client"
import { EngineerCard } from "@/components/engineer-card"
import { Button } from "@/components/ui/button"
import { engineers } from "@/lib/placeholder-data"
import { useAuth } from "@/components/auth-context"
import { Users } from "lucide-react"

export default function EngineersPage() {
  const { isAuthenticated, hasPermission, openAuthModal } = useAuth()

  if (!isAuthenticated) {
    return (
      <div className="container px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Sign in required</h1>
        <p className="mt-2 text-muted-foreground">Engineers directory is available to authenticated users with permission.</p>
        <Button className="mt-6" onClick={openAuthModal}>Sign In</Button>
      </div>
    )
  }

  if (!hasPermission("engineers.read")) {
    return (
      <div className="container px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Not authorized</h1>
        <p className="mt-2 text-muted-foreground">Your account does not currently include access to the engineers directory.</p>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Users className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Engineer Directory</h1>
        </div>
        <p className="text-muted-foreground">
          Discover talented ASIC engineers from across the MENA region
        </p>
      </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 mt-16">
          {engineers.map((engineer) => (
            <EngineerCard key={engineer.id} engineer={engineer} />
          ))}
        </div>     
    </div>
  )
}
