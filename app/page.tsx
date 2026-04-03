"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-context"
import {
  Users,
  MessageSquare,
  Briefcase,
  ArrowRight,
  Cpu,
  Github,
  Sparkles,
  GraduationCap,
  Calendar,
  MapPin,
  Compass,
  Activity,
  Rocket,
  BookOpen,
  Shield,
  ChevronRight,
  Zap,
  Globe,
  Code2
} from "lucide-react"
import { engineers, forumPosts } from "@/lib/placeholder-data"

const valueProps = [
  {
    icon: MessageSquare,
    title: "Forum intelligence",
    description: "Daily, high-signal conversations with senior reviewers and async mentorship.",
    href: "/forum",
  },
  {
    icon: Users,
    title: "Engineer directory",
    description: "Search talent by domain, process node, and availability. Built for real collaboration.",
    href: "/engineers",
  },
  {
    icon: Briefcase,
    title: "Opportunities board",
    description: "Curated roles, fellowships, and sponsored shuttles with transparent expectations.",
    href: "/forum?category=jobs",
  },
]

const journey = [
  {
    icon: Compass,
    title: "Claim your profile",
    description: "Showcase experience levels, preferred nodes, and what you want to build next.",
  },
  {
    icon: Activity,
    title: "Ship inside cohorts",
    description: "Join structured studios for verification, physical design, and tape-out prep.",
  },
  {
    icon: Rocket,
    title: "Launch to silicon",
    description: "Pair with mentors, access tooling credits, and submit polished MPW projects.",
  },
]

const tracks = [
  {
    name: "Foundations Studio",
    summary: "Four-week boot sequence covering HDL fundamentals, simulation labs, and Git-powered reviews.",
    highlights: [
      "HDL clinics with senior mentors",
      "Tooling setup office hours",
      "Peer accountability pods",
    ],
    accent: "from-primary/25 via-primary/5 to-background",
  },
  {
    name: "Verification Guild",
    summary: "UVM, cocotb, and coverage-driven techniques applied to community IP blocks.",
    highlights: [
      "Live waveform tear-downs",
      "Reusable agent templates",
      "Access to real bug backlogs",
    ],
    accent: "from-foreground/10 via-background to-background",
  },
  {
    name: "Tape-out Studio",
    summary: "Floorplanning to sign-off on SKY130 + GF180 with OpenLane and OpenROAD mentors.",
    highlights: [
      "GDS reviews with industry leads",
      "Dedicated timing clinics",
      "Bring-up simulations + labs",
    ],
    accent: "from-primary/20 via-background to-background",
  },
]

const openSourceProjects = [
  {
    name: "Caravel",
    description: "Template SoC ready for shuttle-eligible designs.",
    url: "https://github.com/efabless/caravel",
    tags: ["SoC", "SKY130", "Wrapper"],
  },
  {
    name: "OpenLane",
    description: "Automated RTL-to-GDSII flow powering our tape-out studio.",
    url: "https://github.com/The-OpenROAD-Project/OpenLane",
    tags: ["Flow", "OpenROAD", "Automation"],
  },
  {
    name: "DFFRAM",
    description: "Standard cell RAM compiler used inside multiple cohort projects.",
    url: "https://github.com/AUCOHL/DFFRAM",
    tags: ["Memory", "Compiler", "SKY130"],
  },
]

const fieldNotes = [
  {
    title: "Pop-up debug circles",
    body: "Small groups hop on calls to triage LVS mismatches, waveform mysteries, or bring-up quirks. Screens are shared, fixes are documented, and recordings land in the archive.",
    tag: "ritual",
  },
  {
    title: "Archive walks",
    body: "Every other Friday we revisit a historical open-source tape-out, annotate the GDS, and explain why each routing choice mattered for yield.",
    tag: "study",
  },
  {
    title: "Office hour swaps",
    body: "Analog engineers trade time with verification leads, so both sides learn enough of the other craft to collaborate faster on mixed-signal efforts.",
    tag: "exchange",
  },
]

export default function HomePage() {
  const { openAuthModal, isAuthenticated, canAccessMembersPage } = useAuth()
  const visibleValueProps = canAccessMembersPage
    ? valueProps
    : valueProps.filter((prop) => prop.href !== "/engineers")

    

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden border-b bg-[radial-gradient(circle_at_top,_rgba(63,131,248,0.25),_transparent_60%)] mb-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="absolute -top-24 right-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
              A launchpad for open silicon talent across the Middle East & North Africa
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
                <Badge className="bg-primary text-primary-foreground">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Featured Program
                </Badge>
                <Badge variant="outline">Spring 2026</Badge>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Silicon Sprint at AUC</h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                A hands-on residency at The American University in Cairo combining lectures, labs, and
                fabrication slots. Operate real open-source EDA flows with mentors who guided previous MPW
                wins.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Button asChild>
                  <Link href="/silicon-sprint">
                    View Full Agenda
                    <BookOpen className="ml-2 h-4 w-4" />
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
                    <p className="text-sm text-muted-foreground">In-person with hybrid support</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-96 w-full">
              <Card className="bg-card/80 backdrop-blur border-primary/20">
                <CardHeader>
                  <CardTitle>Program Highlights</CardTitle>
                  <CardDescription>What participants tackle across eight intensive weeks.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold">Topics covered</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {["Digital Logic", "SystemVerilog", "Simulation", "Synthesis", "OpenLane", "Tape-out"].map((topic) => (
                        <Badge key={topic} variant="secondary" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Post-fabrication</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {["Bring-up", "Testing", "Characterization", "Debugging"].map((topic) => (
                        <Badge key={topic} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground border-t pt-4">
                    Cohorts receive dedicated lab time, on-call mentors, and fabrication sponsorship for standout projects.
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b">
        <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid lg:grid-cols-[1.1fr,0.9fr] gap-10 items-center">
            <div>
              <Badge variant="outline" className="mb-4">Faces of the Hub</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
                Experts, students, and builders growing together
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Each profile captures domains, tooling mastery, languages, and what members are looking for—so
                collaborations start faster.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                  <Zap className="h-3 w-3 mr-1" />
                  Open source first
                </Badge>
                <Badge variant="secondary">
                  <Globe className="h-3 w-3 mr-1" />
                  Pan-MENA
                </Badge>
                <Badge variant="secondary">
                  <Code2 className="h-3 w-3 mr-1" />
                  Practical knowledge
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {engineers.slice(0, 4).map((engineer) => (
                <Card key={engineer.id} className="p-4 border-border/60 hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <img src={engineer.avatar} alt={engineer.name} className="h-12 w-12 rounded-full" />
                    <div>
                      <p className="font-medium text-sm">{engineer.name}</p>
                      <p className="text-xs text-muted-foreground">{engineer.location.country}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {engineer.domains.slice(0, 2).map((domain) => (
                      <Badge key={domain} variant="outline" className="text-xs">
                        {domain}
                      </Badge>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b bg-background">
        <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-3">
            <Badge variant="outline" className="mb-2">
              <Github className="h-3 w-3 mr-1" />
              Open Source Stack
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-balance">Tools we contribute to and teach</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {openSourceProjects.map((project) => (
              <a
                key={project.name}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="h-full border-border/60 hover:border-primary/50 transition-all">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Github className="h-5 w-5" />
                      {project.name}
                    </CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
