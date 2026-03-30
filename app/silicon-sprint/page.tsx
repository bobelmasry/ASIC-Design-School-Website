"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  GraduationCap,
  Calendar,
  MapPin,
  Clock,
  Users,
  Cpu,
  Code,
  Layers,
  Wrench,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Microscope,
  Zap
} from "lucide-react"

const programSchedule = [
  {
    date: "April 6",
    day: "Day 1",
    title: "Foundations & HDL",
    sessions: [
      { time: "09:00 - 10:30", topic: "Digital Logic Fundamentals", type: "lecture" },
      { time: "10:45 - 12:15", topic: "Introduction to Verilog/SystemVerilog", type: "lecture" },
      { time: "13:15 - 15:00", topic: "Lab: Your First Verilog Module", type: "lab" },
      { time: "15:15 - 17:00", topic: "Lab: Combinational Circuits Design", type: "lab" },
    ],
    icon: BookOpen,
  },
  {
    date: "April 7",
    day: "Day 2",
    title: "Simulation & Synthesis",
    sessions: [
      { time: "09:00 - 10:30", topic: "Testbench Development & Verification", type: "lecture" },
      { time: "10:45 - 12:15", topic: "Introduction to OpenLane Flow", type: "lecture" },
      { time: "13:15 - 15:00", topic: "Lab: Simulation with Verilator", type: "lab" },
      { time: "15:15 - 17:00", topic: "Lab: Synthesis with Yosys", type: "lab" },
    ],
    icon: Code,
  },
  {
    date: "April 8",
    day: "Day 3",
    title: "Physical Design & Tapeout",
    sessions: [
      { time: "09:00 - 10:30", topic: "Physical Design: P&R, CTS, Timing", type: "lecture" },
      { time: "10:45 - 12:15", topic: "DRC/LVS Verification & GDS Generation", type: "lecture" },
      { time: "13:15 - 15:00", topic: "Lab: Complete OpenLane Flow", type: "lab" },
      { time: "15:15 - 17:00", topic: "Project Kickoff & Team Formation", type: "lab" },
    ],
    icon: Layers,
  },
]

const clinicDays = [
  {
    date: "April 11",
    title: "Clinic Day 1: Silicon Bring-up",
    description: "Hands-on session for hardware testing fundamentals and initial bring-up procedures for fabricated designs.",
    topics: [
      "Silicon bring-up procedures",
      "Basic hardware testing",
      "Initial functionality validation",
      "Test setup configuration",
    ],
    icon: Microscope,
  },
  {
    date: "April 18",
    title: "Clinic Day 2: Characterization",
    description: "Advanced testing session focused on performance characterization and debugging techniques.",
    topics: [
      "Performance characterization",
      "Debug techniques",
      "Design validation",
      "Results documentation",
    ],
    icon: Wrench,
  },
]

const highlights = [
  {
    title: "Hands-on Labs",
    description: "50% of the program is dedicated to practical lab sessions with real EDA tools.",
    icon: Wrench,
  },
  {
    title: "Real Fabrication",
    description: "Top projects will be fabricated on silicon through the Efabless shuttle program.",
    icon: Cpu,
  },
  {
    title: "Expert Instructors",
    description: "Learn from experienced ASIC engineers and open-source silicon contributors.",
    icon: Users,
  },
  {
    title: "Industry Tools",
    description: "Work with OpenLane, Yosys, Verilator, and other production-grade OS EDA tools.",
    icon: Zap,
  },
]

const requirements = [
  "Basic digital logic knowledge (Boolean algebra, gates, flip-flops)",
  "Programming experience (preferably Python or C)",
  "Familiarity with Linux command line",
  "Strong motivation to learn ASIC design",
  "Laptop capable of running Linux VM or Docker",
]

export default function SpringSchoolPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative border-b bg-gradient-to-b from-primary/5 via-primary/10 to-background overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container px-4 py-16 md:py-24 relative">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-6">
              <Badge className="bg-primary text-primary-foreground">
                <GraduationCap className="h-3 w-3 mr-1" />
                Educational Program
              </Badge>
              <Badge variant="outline">Spring 2026</Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">Coming Up Very Soon</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-balance">
              Silicon Sprint
            </h1>
            <p className="text-xl md:text-2xl font-medium text-foreground/80 mb-4">
              Digital ASIC Design with Open-Source EDA Tools
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-2xl">
              A comprehensive training program at The American University in Cairo, 
              teaching digital ASIC design from HDL to GDS using open-source tools. 
              The best projects will be fabricated on real silicon.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="/forum">
                  Join the Community
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-primary/40 text-primary hover:bg-primary/10 dark:border-primary/60 dark:text-primary" asChild>
                <Link href="#curriculum">
                  View Curriculum
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Info */}
      <section className="border-b">
        <div className="container px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">April 6-8, 2026</p>
                <p className="text-sm text-muted-foreground">3-Day Intensive</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">AUC Cairo</p>
                <p className="text-sm text-muted-foreground">In-person</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">+ 2 Clinic Days</p>
                <p className="text-sm text-muted-foreground">April 11 & 18</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Limited Seats</p>
                <p className="text-sm text-muted-foreground">Spots Filling Up</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="border-b bg-muted/30">
        <div className="container px-4 py-16">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Why Join?</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Program Highlights</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A unique opportunity to learn industry-relevant skills with hands-on experience 
              and the chance to see your design fabricated on silicon.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((highlight) => (
              <Card key={highlight.title} className="text-center border-gray-300 dark:border-gray-800">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <highlight.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{highlight.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {highlight.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Program Schedule */}
      <section id="curriculum" className="border-b scroll-mt-20">
        <div className="container px-4 py-16">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">3-Day Intensive Program</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Program Schedule</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              An intensive 3-day program covering the complete ASIC design flow, 
              followed by 2 clinic days for silicon bring-up and characterization.
            </p>
          </div>
          
          {/* Main Program Days */}
          <div className="space-y-6 mb-12">
            {programSchedule.map((day) => (
              <Card key={day.date} className="relative overflow-hidden border-gray-300 dark:border-gray-800">
                <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-bl from-primary/10 to-transparent" />
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <day.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge>{day.date}</Badge>
                        <Badge variant="secondary">{day.day}</Badge>
                      </div>
                      <CardTitle className="text-xl">{day.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-3">
                    {day.sessions.map((session, idx) => (
                      <div 
                        key={idx} 
                        className={`flex items-start gap-3 p-3 rounded-lg ${
                          session.type === "lab" ? "bg-primary/5 border border-primary/10" : "bg-muted/50"
                        }`}
                      >
                        <div className="text-xs font-mono text-muted-foreground whitespace-nowrap pt-0.5">
                          {session.time}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{session.topic}</p>
                          <Badge variant="outline" className="text-xs mt-1">
                            {session.type === "lab" ? "Hands-on Lab" : "Lecture"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Clinic Days */}
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-4">Post-Fabrication</Badge>
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Clinic Days</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Two dedicated sessions for silicon bring-up and characterization after fabrication.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {clinicDays.map((clinic) => (
              <Card key={clinic.date} className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <clinic.icon className="h-5 w-5 text-primary" />
                    </div>
                    <Badge className="bg-primary text-primary-foreground">{clinic.date}</Badge>
                  </div>
                  <CardTitle>{clinic.title}</CardTitle>
                  <CardDescription>{clinic.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {clinic.topics.map((topic) => (
                      <li key={topic} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="border-b bg-muted/30">
        <div className="container px-4 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4">Prerequisites</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Requirements</h2>
              <p className="text-muted-foreground mb-6">
                This program is designed for students and early-career engineers 
                who want to learn ASIC design. Prior tapeout experience is not required.
              </p>
              <ul className="space-y-3">
                {requirements.map((req) => (
                  <li key={req} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Card className="bg-card/80 backdrop-blur">
              <CardHeader>
                <CardTitle>Tools You'll Use</CardTitle>
                <CardDescription>
                  Industry-standard open-source EDA tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {[
                    "OpenLane",
                    "Yosys",
                    "Verilator",
                    "Magic",
                    "Netgen",
                    "KLayout",
                    "OpenROAD",
                    "SKY130 PDK",
                    "Cocotb",
                    "GTKWave",
                  ].map((tool) => (
                    <Badge key={tool} variant="secondary">
                      {tool}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      

      {/* CTA */}
      <section className="bg-primary text-primary-foreground">
        <div className="container px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get Ready to Design Your First Chip
            </h2>
            <p className="text-primary-foreground/70 mb-8 text-base">
              Start preparing now by exploring the curriculum, asking questions in our community forum, and building your digital logic fundamentals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="#curriculum">
                  Explore the Program
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 text-black dark:text-white"
                asChild
              >
                <Link href="/forum">
                  Connect on Forum
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
