"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-context"
import {
  ArrowRight,
  Github,
} from "lucide-react"

export default function HomePage() {
  const { openAuthModal, isAuthenticated } = useAuth()

    

  return (
    <div className="flex flex-col min-h-screen bg-[radial-gradient(circle_at_top,_rgba(63,131,248,0.25),_transparent_60%)]">
      <section className="relative overflow-hidden mb-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="absolute -top-24 right-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="mb-6">
              <Image
                src="/large_logo1.png"
                alt="Open Source ASIC Hub"
                width={320}
                height={240}
                className="mx-auto h-auto w-auto max-w-56"
                priority
              />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-balance">
              A launchpad for open silicon talent across the Middle East & Africa
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground text-pretty">
              Build your network, refine your ASIC practice, and ship tape-outs together. We combine
              community, curriculum, and open-source tooling into one deliberate experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/silicon-sprint">
                  Silicon Sprint School
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              {isAuthenticated ? (
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary/40 text-primary hover:bg-primary/10 dark:border-primary/60 dark:text-primary"
                  asChild
                >
                  <Link href="/forum">Browse the Forum</Link>
                </Button>
              ) : (
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary/40 text-primary hover:bg-primary/10 dark:border-primary/60 dark:text-primary"
                  onClick={openAuthModal}
                >
                  Browse the Forum
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
