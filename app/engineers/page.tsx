"use client"
import { EngineerCard } from "@/components/engineer-card"
import { engineers } from "@/lib/placeholder-data"
import { Users } from "lucide-react"

export default function EngineersPage() {

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
