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
    title: "",
    sessions: [
      { time: "09:30 - 10:00", topic: "Welcome & Registration" },
      { time: "10:00 - 10:30", topic: "Opening", type: "lecture" },
      { time: "10:30 - 11:30", topic: "Keynote Session (Tim Ansell)" },
      { time: "11:30 - 12:00", topic: "Coffee Break" },
      { time: "12:00 - 13:00", topic: "Open-Source Chip Design, Librelane (Mohamed Gaber)" },
      { time: "13:00 - 14:00", topic: "Lunch Break" },
      { time: "14:00 - 15:00", topic: "Practical Session: Environment Setup - Running Synthesis Exploration (Basem)" },
      { time: "15:00 - 15:30", topic: "Break" },
      { time: "15:30 - 16:30", topic: "Running the flow - from synthesis to power network (Basem)" },
    ],
    icon: BookOpen,
  },
  {
    date: "April 7",
    day: "Day 2",
    title: "",
    sessions: [
      { time: "10:00 - 10:45", topic: "Physical Implementation Strategy (Mohamed Hosni)" },
      { time: "10:45 - 11:30", topic: "Greyhound FPGA and the Fabulous LibreLane Plugin (Leo Moser)" },
      { time: "11:30 - 12:15", topic: "Assertions & Covergroups. Using SymbiYosys for formal design verification (Abdulmoniem)"},
      { time: "12:15 - 12:45", topic: "Coffee Break" },
      { time: "12:45 - 13:30", topic: "Static Timing Analysis using OpenSTA (Abdulrahman)" },
      { time: "13:30 - 14:15", topic: "Practical Session: Placement & CTS (Basem)" },
      { time: "14:15 - 15:00", topic: "Lunch Break" },
      { time: "15:00 - 16:00", topic: "Practical Session: Routing (Basem)" },
      { time: "16:00 - 16:30", topic: "Coffee Break" },
      { time: "16:30 - 17:30", topic: "Practical Session: Cocotb (Radwa)" },
    ],
    icon: Code,
  },
  {
    date: "April 8",
    day: "Day 3",
    title: "",
    sessions: [
      { time: "10:00 - 10:45", topic: "Hardware Security (Dr. Dina Mahmoud)" },
      { time: "10:45 - 11:30", topic: "DFT and Difetto (Mohamed Gaber)" },
      { time: "11:30 - 12:15", topic: "Multi-Project Chip Integration (Mohamed Hosni)" },
      { time: "12:15 - 12:45", topic: "Coffee Break" },
      { time: "12:45 - 13:45", topic: "Practical Session: Final Signoff (Basem)" },
      { time: "13:45 - 14:45", topic: "Lunch Break" },
      { time: "14:45 - 15:45", topic: "Practical: Macro-First Hardening (Basem)" },
      { time: "15:45 - 16:15", topic: "Break" },
      { time: "16:15 - 17:00", topic: "Keynote Session (Mohamed Kassem)" },
    ],
    icon: Layers,
  },
]

const clinicDays = [
  {
    date: "April 11",
    title: "Clinic Day 1",
    sessions: [
      { time: "10:00 - 12:30", topic: "Fix errors and timing violations detected" },
      { time: "12:30 - 13:00", topic: "Lunch Break" },
      { time: "13:00 - 15:00", topic: "Fix errors and timing violations detected" },
      { time: "15:30 - 16:00", topic: "Lunch Break" },
    ],
    icon: Microscope,
  },
  {
    date: "April 18",
    title: "Clinic Day 2",
    sessions: [
      { time: "10:00 - 12:30", topic: "Fix errors and timing violations detected" },
      { time: "12:30 - 13:00", topic: "Lunch Break" },
      { time: "13:00 - 15:00", topic: "Shuttle Readiness: Finalizing designs for the free OpenMPW shuttle" },
    ],
    icon: Wrench,
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
                        className={"flex items-start gap-3 p-3 rounded-lg bg-muted/50"}
                      >
                        <div className="text-xs font-mono text-muted-foreground whitespace-nowrap pt-0.5">
                          {session.time}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{session.topic}</p>
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
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-3">
                    {clinic.sessions.map((session, idx) => (
                      <div 
                        key={idx} 
                        className={"flex items-start gap-3 p-3 rounded-lg bg-muted/50"}
                      >
                        <div className="text-xs font-mono text-muted-foreground whitespace-nowrap pt-0.5">
                          {session.time}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{session.topic}</p>
                        </div>
                      </div>
                    ))}
                  </div>
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
    </div>
  )
}
