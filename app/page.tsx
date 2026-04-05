"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-context"
import {
  ArrowRight,
  Github,
} from "lucide-react"
import { engineers } from "@/lib/placeholder-data"

export default function HomePage() {
  const { openAuthModal, isAuthenticated } = useAuth()

    

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden border-b bg-[radial-gradient(circle_at_top,_rgba(63,131,248,0.25),_transparent_60%)] mb-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="absolute -top-24 right-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
              A launchpad for open silicon talent across the Middle East & Africa
            </h1>
            <div className="mx-auto max-w-2xl rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-foreground/90">
              <p className="inline-flex flex-wrap items-center justify-center gap-2">
                <span className="font-semibold text-primary">New:</span>
                <span>Silicon Sprint 2026 agenda is now live.</span>
                <Link href="/silicon-sprint" className="inline-flex items-center gap-1 font-semibold text-primary hover:underline">
                  Explore it
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </p>
            </div>
            <p className="text-lg md:text-xl text-muted-foreground text-pretty">
              Build your network, refine your ASIC practice, and ship tape-outs together. We combine
              community, curriculum, and open-source tooling into one deliberate experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <></>
              ) : (
                <Button size="lg" onClick={openAuthModal}>
                  Join the Community
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
              <Button
                size="lg"
                variant="outline"
                className="border-primary/40 text-primary hover:bg-primary/10 dark:border-primary/60 dark:text-primary"
                asChild
              >
                <Link href="/forum">Browse the Forum</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b bg-gradient-to-br from-primary/10 via-background to-background relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background via-transparent to-transparent" aria-hidden />
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="flex flex-col lg:flex-row gap-10 items-center">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-5">
                <Badge className="bg-primary" variant="outline">Spring 2026</Badge>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Silicon Sprint at AUC</h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                A comprehensive training program at The American University in Cairo for ASIC design using Open-source technologies.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Button asChild>
                  <Link href="/silicon-sprint">
                    View Program
                  </Link>
                </Button>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="flex gap-3">
                  <div>
                    <p className="font-semibold">Comprehensive curriculum</p>
                    <p className="text-sm text-muted-foreground">HDL, simulation, synthesis, prototyping</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div>
                    <p className="font-semibold">Real fabrication</p>
                    <p className="text-sm text-muted-foreground">Top teams tape out on SKY130</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div>
                    <p className="font-semibold">Bring-up sessions</p>
                    <p className="text-sm text-muted-foreground">Debug silicon alongside mentors</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div>
                    <p className="font-semibold">Cairo, Egypt</p>
                    <p className="text-sm text-muted-foreground">In-person</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
