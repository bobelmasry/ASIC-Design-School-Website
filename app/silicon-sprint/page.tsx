"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SpeakerModal } from "@/components/SpeakerModal"
import {
  Calendar,
  MapPin,
  Clock,
  BookOpen,
} from "lucide-react"

type ScheduleDay = {
  date?: string
  day?: string
  title: string
  location: string
  sessions: { time: string; topic: string; type?: string }[]
  icon?: any
}

const programSchedule: ScheduleDay[] = [
  {
    date: "April 6",
    day: "Day 1",
    title: "",
    location: "Shafik Gabr",
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
    location: "Moataz Al Alfi",
    sessions: [
      { time: "10:00 - 10:45", topic: "Physical Implementation Strategy (Mohamed Hosni)" },
      { time: "10:45 - 11:30", topic: "Greyhound FPGA and the Fabulous LibreLane Plugin (Leo Moser)" },
      { time: "11:30 - 12:15", topic: "Assertions & Covergroups. Using SymbiYosys for formal design verification (Abdelmonem)"},
      { time: "12:15 - 12:45", topic: "Coffee Break" },
      { time: "12:45 - 13:30", topic: "Static Timing Analysis using OpenSTA (Abdelrahman Oun)" },
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
    location: "Shafik Gabr",
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

const clinicDays: ScheduleDay[] = [
  {
    date: "April 11",
    title: "Clinic Day 1",
    location: "Shafik Gabr",
    sessions: [
      { time: "10:00 - 12:30", topic: "Fix errors and timing violations detected" },
      { time: "12:30 - 13:00", topic: "Lunch Break" },
      { time: "13:00 - 15:00", topic: "Fix errors and timing violations detected" },
      { time: "15:00 - 15:30", topic: "Coffee Break" },
    ],
  },
  {
    date: "April 25",
    title: "Clinic Day 2",
    location: "P019",
    sessions: [
      { time: "10:00 - 12:30", topic: "Fix errors and timing violations detected" },
      { time: "12:30 - 13:00", topic: "Lunch Break" },
      { time: "13:00 - 15:00", topic: "Shuttle Readiness: Finalizing designs for the free OpenMPW shuttle" },
    ],
  },
]

const combinedSchedule = [...programSchedule, ...clinicDays]

function renderTopic(topic: string, onSpeakerClick: (slug: string) => void) {
  const match = topic.match(/^(.*)\(([^)]+)\)$/)
  if (match) {
    const [_, prefix, name] = match
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
    return (
      <div className="space-y-1">
        <div className="font-medium">{prefix.trim()}</div>
        <button
          onClick={() => onSpeakerClick(slug)}
          className="text-sm text-primary hover:underline cursor-pointer bg-transparent border-none p-0 font-normal"
        >
          {name}
        </button>
      </div>
    )
  }
  return topic
}

export default function SpringSchoolPage() {
  const [selectedSpeaker, setSelectedSpeaker] = React.useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  const handleSpeakerClick = (slug: string) => {
    setSelectedSpeaker(slug)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedSpeaker(null)
  }
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
                <p className="text-sm text-muted-foreground">April 11 & 25</p>
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
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 lg:grid-cols-5 mb-8 h-auto">
              <TabsTrigger value="day1" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-sm">Day 1 - April 6</TabsTrigger>
              <TabsTrigger value="day2" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-sm">Day 2 - April 7</TabsTrigger>
              <TabsTrigger value="day3" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-sm">Day 3 - April 8</TabsTrigger>
              <TabsTrigger value="day4" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-sm">Clinic Day 1 - April 11</TabsTrigger>
              <TabsTrigger value="day5" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-sm">Clinic Day 2 - April 25</TabsTrigger>
            </TabsList>
            {combinedSchedule.map((day, index) => (
              <TabsContent key={day.date} value={`day${index + 1}`}>
                <Card className="relative overflow-hidden border-gray-300 dark:border-gray-800">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{day.location}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {day.title.startsWith("Clinic") ? (
                      <div className="space-y-3">
                        {day.sessions.map((session, idx) => (
                          <div 
                            key={idx} 
                            className={"flex items-start gap-3 p-3 rounded-lg bg-muted/50"}
                          >
                            <div className="text-md font-mono text-muted-foreground whitespace-nowrap pt-0.5">
                              {session.time}
                            </div>
                            <div className="flex-1">
                              <p className="text-md font-medium">{renderTopic(session.topic, handleSpeakerClick)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
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
                                    className={"flex items-start gap-3 p-4 rounded-lg bg-muted/50"}
                                  >
                                    <div className="text-md font-mono text-muted-foreground whitespace-nowrap pt-0.5">
                                      {session.time}
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-md font-medium">{renderTopic(session.topic, handleSpeakerClick)}</p>
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
                                    <div className="text-md font-mono text-muted-foreground whitespace-nowrap pt-0.5">
                                      {session.time}
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-md font-medium">{renderTopic(session.topic, handleSpeakerClick)}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </>
                          )
                        })()}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      <SpeakerModal
        speakerSlug={selectedSpeaker}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </div>
  )
}
