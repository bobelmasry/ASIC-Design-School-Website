export type EventAgendaItem = {
  title: string
  startsAt: string
  duration: string
  description: string
  speakerName?: string
}

export type EventSponsor = {
  name: string
  logoUrl?: string
  website?: string
}

export type EventFaq = {
  question: string
  answer: string
}

export type EventContent = {
  slug: string
  name: string
  summary: string
  location: string
  startsOn: string
  endsOn: string
  isPublished: boolean
  agenda: EventAgendaItem[]
  sponsors: EventSponsor[]
  faq: EventFaq[]
}

export const eventsData: EventContent[] = [
  {
    slug: 'silicon-sprint-2026',
    name: 'Silicon Sprint 2026',
    summary:
      'An in-person intensive on digital ASIC design with open-source EDA tools, ending in project-based tapeout readiness.',
    location: 'The American University in Cairo',
    startsOn: '2026-04-06',
    endsOn: '2026-04-08',
    isPublished: true,
    agenda: [
      {
        title: 'Digital Logic and RTL Foundations',
        startsAt: '2026-04-06T09:00:00+02:00',
        duration: '90 min',
        description: 'Core digital abstractions, RTL modeling patterns, and coding conventions for synthesis-safe designs.',
      },
      {
        title: 'Simulation and Verification Lab',
        startsAt: '2026-04-06T13:15:00+02:00',
        duration: '105 min',
        description: 'Hands-on testbench setup using open-source simulation tooling and waveform-based debugging.',
      },
      {
        title: 'OpenLane End-to-End Flow',
        startsAt: '2026-04-07T10:45:00+02:00',
        duration: '90 min',
        description: 'From synthesized netlist to routed layout, timing closure checkpoints, and signoff expectations.',
      },
    ],
    sponsors: [
      {
        name: 'Open Source ASIC Hub',
        website: 'https://github.com/The-OpenROAD-Project',
      },
      {
        name: 'AUC Engineering and Science Services',
      },
    ],
    faq: [
      {
        question: 'Do I need prior tapeout experience?',
        answer: 'No. Basic digital logic and Linux familiarity are enough to start.',
      },
      {
        question: 'Will materials be available after sessions?',
        answer: 'Yes. Session resources are published for enrolled users after each day.',
      },
    ],
  },
  {
    slug: 'asic-design-school-2025',
    name: 'ASIC Design School 2025',
    summary:
      'A community-driven bootcamp for RTL design, verification, and introductory physical design practices.',
    location: 'Hybrid (Cairo + Online)',
    startsOn: '2025-09-20',
    endsOn: '2025-09-24',
    isPublished: true,
    agenda: [
      {
        title: 'Verilog Patterns for Reusable IP',
        startsAt: '2025-09-20T10:00:00+02:00',
        duration: '120 min',
        description: 'Reusable module interfaces, parameterization, and integration-ready coding practices.',
      },
      {
        title: 'Clocking, Constraints, and Timing Intent',
        startsAt: '2025-09-21T11:30:00+02:00',
        duration: '90 min',
        description: 'Constraint strategy, SDC basics, and practical timing tradeoffs for beginner ASIC projects.',
      },
      {
        title: 'Mini Project Reviews',
        startsAt: '2025-09-24T15:00:00+02:00',
        duration: '120 min',
        description: 'Mentor feedback, quality checklist walk-through, and next-step recommendations.',
      },
    ],
    sponsors: [
      {
        name: 'OpenLane Community',
        website: 'https://github.com/The-OpenROAD-Project/OpenLane',
      },
    ],
    faq: [
      {
        question: 'Is this event public?',
        answer: 'Event details are public. Forum and materials require authenticated access based on permissions.',
      },
      {
        question: 'Can students join?',
        answer: 'Yes. Students are encouraged to apply and participate in team projects.',
      },
    ],
  },
]

export const getPublishedEvents = () =>
  eventsData.filter((event) => event.isPublished)

export const getEventBySlug = (slug: string) =>
  getPublishedEvents().find((event) => event.slug === slug)
