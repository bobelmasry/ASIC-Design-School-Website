"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  MapPin,
  Clock,
  BookOpen,
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
      { time: "14:00 - 15:00", topic: "Practical Session: Environment Setup - Running Synthesis Exploration (Basem Hesham)" },
      { time: "15:00 - 15:30", topic: "Break" },
      { time: "15:30 - 16:30", topic: "Running the flow - from synthesis to power network (Basem Hesham)" },
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
      { time: "13:30 - 14:15", topic: "Practical Session: Placement & CTS (Basem Hesham)" },
      { time: "14:15 - 15:00", topic: "Lunch Break" },
      { time: "15:00 - 16:00", topic: "Practical Session: Routing (Basem Hesham)" },
      { time: "16:00 - 16:30", topic: "Coffee Break" },
      { time: "16:30 - 17:30", topic: "(Salma)" },
    ],
  },
  {
    date: "April 8",
    day: "Day 3",
    title: "",
    sessions: [
      { time: "10:00 - 10:45", topic: "DFT and Difetto (Mohamed Gaber)" },
      { time: "10:45 - 11:30", topic: "Multi-Project Chip Integration (Mohamed Hosni)" },
      { time: "11:30 - 12:15", topic: "Practical Session: Cocotb (Radwa)" },
      { time: "12:15 - 12:45", topic: "Coffee Break" },
      { time: "12:45 - 13:45", topic: "Practical Session: Final Signoff (Basem Hesham)" },
      { time: "13:45 - 14:45", topic: "Lunch Break" },
      { time: "14:45 - 15:45", topic: "Practical: Macro-First Hardening (Basem Hesham)" },
      { time: "15:45 - 16:15", topic: "Break" },
      { time: "16:15 - 17:00", topic: "Keynote Session (Mohamed Kassem)" },
    ],
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
      { time: "15:00 - 15:30", topic: "Coffee Break" },
    ],
  },
  {
    date: "April 18",
    title: "Clinic Day 2",
    sessions: [
      { time: "10:00 - 12:30", topic: "Fix errors and timing violations detected" },
      { time: "12:30 - 13:00", topic: "Lunch Break" },
      { time: "13:00 - 15:00", topic: "Shuttle Readiness: Finalizing designs for the free OpenMPW shuttle" },
    ],
  },
]

function renderTopic(topic: string) {
  const match = topic.match(/^(.*)\(([^)]+)\)$/)
  if (match) {
    const [_, prefix, name] = match
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
    return (
      <>
        {prefix.trim()}{' '}
        (<Link href={`/silicon-sprint/speakers/${slug}`} className="text-primary hover:underline">
          {name}
        </Link>)
      </>
    )
  }
  return topic
}

export default function SpringSchoolPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative border-b bg-gradient-to-b from-primary/5 via-primary/10 to-background overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container px-4 py-16 md:py-24 relative">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-6">
              <Badge variant="outline">Spring School</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-balance">
              Silicon Sprint
            </h1>
            <p className="text-xl md:text-2xl font-medium text-foreground/80 mb-4">
              Digital ASIC Design with Open-Source EDA Tools
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-2xl">
              A comprehensive training program at The American University in Cairo
              for ASIC design using Open-source technologies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" variant="outline" className="border-primary/40 text-primary hover:bg-primary/10 dark:border-primary/60 dark:text-primary" asChild>
                <Link href="#curriculum">
                  View Program
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Info */}
      <section className="border-b mb-32">
        <div className="container px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
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
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">+ 2 Clinic Days</p>
                <p className="text-sm text-muted-foreground">April 11 & 18</p>
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

          </div>
        </div>
      </section>

      {/* Program Schedule */}
      <section id="curriculum" className="border-b scroll-mt-20">
        <div className="container px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">The Program Schedule</h2>
          </div>
          
          {/* Main Program Days */}
          <Tabs defaultValue="day1" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="day1">Day 1 - April 6</TabsTrigger>
              <TabsTrigger value="day2">Day 2 - April 7</TabsTrigger>
              <TabsTrigger value="day3">Day 3 - April 8</TabsTrigger>
            </TabsList>
            {programSchedule.map((day, index) => (
              <TabsContent key={day.date} value={`day${index + 1}`}>
                <Card className="relative overflow-hidden border-gray-300 dark:border-gray-800">
                  <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-bl from-primary/10 to-transparent" />
                  <CardContent>
                    <div className="grid lg:grid-cols-2 gap-3">
                      {(() => {
                        const mid = Math.ceil(day.sessions.length / 2)
                        const firstColumn = day.sessions.slice(0, mid)
                        const secondColumn = day.sessions.slice(mid)
                        return (
                          <>
                            <div className="space-y-3">
                              {firstColumn.map((session, idx) => (
                                <div 
                                  key={idx} 
                                  className={"flex items-start gap-3 p-3 rounded-lg bg-muted/50"}
                                >
                                  <div className="text-lg font-mono text-muted-foreground whitespace-nowrap pt-0.5">
                                    {session.time}
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-lg font-medium">{renderTopic(session.topic)}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="space-y-3">
                              {secondColumn.map((session, idx) => (
                                <div 
                                  key={idx + mid} 
                                  className={"flex items-start gap-3 p-3 rounded-lg bg-muted/50"}
                                >
                                  <div className="text-lg font-mono text-muted-foreground whitespace-nowrap pt-0.5">
                                    {session.time}
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-lg font-medium">{renderTopic(session.topic)}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )
                      })()}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>

          {/* Clinic Days */}
          <div className="text-center mb-8 mt-16">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Clinic Days</h3>
          </div>
          <Tabs defaultValue="clinic1" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="clinic1">Clinic Day 1 - April 11</TabsTrigger>
              <TabsTrigger value="clinic2">Clinic Day 2 - April 18</TabsTrigger>
            </TabsList>
            {clinicDays.map((clinic, index) => (
              <TabsContent key={clinic.date} value={`clinic${index + 1}`}>
                <Card className="relative overflow-hidden border-gray-300 dark:border-gray-800">
                  <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-bl from-primary/10 to-transparent" />
                  <CardContent>
                    <div className="space-y-3">
                      {clinic.sessions.map((session, idx) => (
                        <div 
                          key={idx} 
                          className={"flex items-start gap-3 p-3 rounded-lg bg-muted/50"}
                        >
                          <div className="text-lg font-mono text-muted-foreground whitespace-nowrap pt-0.5">
                            {session.time}
                          </div>
                          <div className="flex-1">
                            <p className="text-lg font-medium">{session.topic}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>
    </div>
  )
}
