"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
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
  sessions: { time: string; topic: string; type?: string; slides?: string; examples?: string; docs?: string }[]
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
      { time: "10:30 - 11:30", topic: "Keynote Session (Tim Ansell)", slides: "https://wafer.space/auc26" },
      { time: "11:30 - 12:00", topic: "Coffee Break" },
      { time: "12:00 - 13:00", topic: "Open-Source Chip Design, Librelane (Mohamed Gaber)", slides: "https://drive.google.com/file/d/1ksYEgGr2fBxmM1dTbJwVan_1DhpXb92P/view?usp=sharing" },
      { time: "13:00 - 14:00", topic: "Lunch Break" },
      { time: "14:00 - 15:00", topic: "Practical Session: Environment Setup - Running Synthesis Exploration (Basem Hesham)", docs: "https://silicon-sprint-auc.readthedocs.io/en/latest/MODULE0.html" },
      { time: "15:00 - 15:30", topic: "Break" },
      { time: "15:30 - 16:30", topic: "Running the flow - from synthesis to power network (Basem Hesham)", docs: "https://silicon-sprint-auc.readthedocs.io/en/latest/MODULE1.html" },
    ],
    icon: BookOpen,
  },
  {
    date: "April 7",
    day: "Day 2",
    title: "",
    location: "Moataz Al Alfi",
    sessions: [
      { time: "10:00 - 10:45", topic: "Physical Implementation Strategy (Mohamed Hosni)", slides: "https://drive.google.com/file/d/1E1Fh80G-JvfwB8BfyVTs9FNPOGuiGsac/view?usp=sharing" },
      { time: "10:45 - 11:30", topic: "Greyhound FPGA and the Fabulous LibreLane Plugin (Leo Moser)", slides: "https://drive.google.com/file/d/1fFZwgoz6OES-jErUPs55MulHUcBhlxa8/view?usp=sharing" },
      { time: "11:30 - 12:15", topic: "Assertions & Covergroups. Using SymbiYosys for formal design verification (Abdelmonem Sallam)", slides: "https://drive.google.com/file/d/1miDgRRiVVTdeB9C4rUvcaafIlsgFk4XT/view?usp=sharing", examples: "https://drive.google.com/file/d/1zCmTklELKQxxZDU4FnXWs3z3SvA2dQtL/view?usp=sharing"},
      { time: "12:15 - 12:45", topic: "Coffee Break" },
      { time: "12:45 - 13:30", topic: "Static Timing Analysis using OpenSTA (Abdelrahman Oun)", slides: "https://docs.google.com/presentation/d/1-LU7Usa1kdFBHA-rGm3NR9sBmxJF2xAH/edit?usp=sharing&ouid=105113756179876167247&rtpof=true&sd=true" },
      { time: "13:30 - 14:15", topic: "Practical Session: Placement & CTS (Basem Hesham)", docs: "https://silicon-sprint-auc.readthedocs.io/en/latest/MODULE2.html" },
      { time: "14:15 - 15:00", topic: "Lunch Break" },
      { time: "15:00 - 16:00", topic: "Practical Session: Routing (Basem Hesham)", docs: "https://silicon-sprint-auc.readthedocs.io/en/latest/MODULE3.html" },
      { time: "16:00 - 16:30", topic: "Coffee Break" },
      { time: "16:30 - 17:30", topic: "Digital Verification using Pyuvm and cocotb (Salma Sultan)", slides: "https://salmas-talk.vercel.app", "examples": "https://drive.google.com/drive/folders/1M_ctISLqdPZ0a-_ZZ86Key-rF5HDt8c6?usp=drive_link" },
    ],
  },
  {
    date: "April 8",
    day: "Day 3",
    title: "",
    location: "Shafik Gabr",
    sessions: [
      { time: "10:00 - 10:45", topic: "Design for Testing and Fault (Mohamed Gaber)", slides: "https://drive.google.com/file/d/1kLSx_spoS17FHUGNksKq80f-QElAsxby/view?usp=sharing" },
      { time: "10:45 - 11:30", topic: "Multi-Project Chip Integration (Mohamed Hosni)", slides: "https://drive.google.com/file/d/18cQgGXea_OPcCRX_Gh9kL_zhGXYblLG5/view?usp=sharing" },
      { time: "11:30 - 12:15", topic: "Practical Session: Cocotb (Radwa Gamal)" },
      { time: "12:15 - 12:45", topic: "Coffee Break" },
      { time: "12:45 - 13:45", topic: "Practical Session: Final Signoff (Basem Hesham)", docs: "https://silicon-sprint-auc.readthedocs.io/en/latest/MODULE4.html" },
      { time: "13:45 - 14:45", topic: "Lunch Break" },
      // { time: "14:45 - 15:45", topic: "Practical: Macro-First Hardening (Basem Hesham)" },
      // { time: "15:45 - 16:15", topic: "Break" },
      // { time: "16:15 - 17:00", topic: "Keynote Session: Sustaining Open Source Silicon Ecosystem - How to Make it Real! (Mohamed Kassem)" },
      { time: "14:45 - 15:30", topic: "Keynote Session: Sustaining Open Source Silicon Ecosystem - How to Make it Real! (Mohamed Kassem)" },
    ],
  },
]

const clinicDays: ScheduleDay[] = [
  {
    date: "April 11",
    title: "Clinic Day 1",
    location: "Shafik Gabr",
    sessions: [
      { time: "10:00 - 11:00", topic: "Practical: Macro-First Hardening (Basem Hesham)", "docs": "https://silicon-sprint-auc.readthedocs.io/en/latest/MODULE4.html" },
      { time: "11:00 - 12:30", topic: "Fix errors and timing violations detected" },
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

function renderTopic(session: { time: string; topic: string; type?: string; slides?: string; examples?: string; docs?: string }, onSpeakerClick: (slug: string) => void) {
  const topic = session.topic
  const match = topic.match(/^(.*)\(([^)]+)\)$/)
  if (match) {
    const [_, prefix, name] = match
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
    return (
      <div className="space-y-1">
        <div className="font-medium">{prefix.trim()}</div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSpeakerClick(slug)}
            className="text-sm text-primary hover:underline cursor-pointer bg-transparent border-none p-0 font-normal"
          >
            {name}
          </button>
          {session.slides && (
            <a
              href={session.slides}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:underline"
            >
              Slides
            </a>
          )}
          {session.examples && (
            <a
              href={session.examples}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:underline"
            >
              Examples
            </a>
          )}
          {session.docs && (
            <a
              href={session.docs}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:underline"
            >
              Docs
            </a>
          )}
        </div>
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
      <section className="relative border-b bg-linear-to-b from-primary/5 via-primary/10 to-background overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container px-4 py-16 md:py-24 relative">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_420px]">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-balance">
                Silicon Sprint 2026
              </h1>
              <p className="text-xl md:text-2xl font-medium text-foreground/80 mb-4">
                Digital ASIC Design with Open-Source EDA Tools
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-2xl">
                The American University in Cairo presents Silicon Sprint, a comprehensive hands-on training program in digital ASIC design using fully open-source EDA tools. Participants master the complete flow from RTL to GDSII — including synthesis, place-and-route, timing analysis, and verification — while gaining practical, industry-relevant skills. A standout feature is the rare opportunity to fabricate their own chip designs on real silicon for free through a professional tape-out process.
              </p>
              <p className="text-md text-muted-foreground">
                The event is supported by{" "}
                <a
                  href="https://engineering.cmu.edu/afretec/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  Afretec
                </a>
                .
              </p>
            </div>

            <aside className="mx-auto w-full max-w-105">
              <div className="rounded-2xl border border-border/70 bg-white/85 p-5 shadow-sm backdrop-blur-sm dark:bg-white/90">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Supporting Partner
                </p>
                <a
                  href="https://engineering.cmu.edu/afretec/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                  aria-label="Afretec Network"
                >
                  <Image
                    src="/afretec_network_nobg.png"
                    alt="Afretec Network by Carnegie Mellon-Africa"
                    width={640}
                    height={640}
                    className="h-auto w-full"
                    priority
                  />
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Program Schedule */}
      <section id="curriculum" className="border-b scroll-mt-20">
        <div className="container px-4 py-16">
          
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
                      <span className="text-lg text-blue-800 underline">{day.location}</span>
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
                              <p className="text-md font-medium">{renderTopic(session, handleSpeakerClick)}</p>
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
                                      <p className="text-md font-medium">{renderTopic(session, handleSpeakerClick)}</p>
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
                                      <p className="text-md font-medium">{renderTopic(session, handleSpeakerClick)}</p>
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
