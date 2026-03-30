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
  ChevronRight,
  Zap,
  Globe,
  Code2,
  GraduationCap,
  Calendar,
  MapPin,
  Sparkles
} from "lucide-react"
import { engineers } from "@/lib/placeholder-data"

const valueProps = [
  {
    icon: MessageSquare,
    title: "Community Forum",
    description: "Ask questions, share knowledge, and learn from experienced ASIC engineers across all domains.",
    href: "/forum",
  },
  {
    icon: Users,
    title: "Engineer Directory",
    description: "Find and connect with talented ASIC professionals in the MENA region with detailed skill profiles.",
    href: "/engineers",
  },
  {
    icon: Briefcase,
    title: "Job Opportunities",
    description: "Discover career opportunities and connect with companies looking for ASIC design talent.",
    href: "/forum?category=jobs",
  },
]

const stats = [
  { value: "500+", label: "Engineers" },
  { value: "1,200+", label: "Discussions" },
  { value: "15+", label: "Countries" },
  { value: "50+", label: "Tape-outs" },
]

const openSourceProjects = [
  {
    name: "Caravel",
    description: "A template SoC for Google-funded shuttle runs through Efabless",
    url: "https://github.com/efabless/caravel",
  },
  {
    name: "OpenLane",
    description: "Automated RTL-to-GDSII flow for digital design",
    url: "https://github.com/The-OpenROAD-Project/OpenLane",
  },
  {
    name: "DFFRAM",
    description: "Standard cell-based RAM compiler",
    url: "https://github.com/AUCOHL/DFFRAM",
  },
]

export default function HomePage() {
  const { openAuthModal, isAuthenticated, canAccessMembersPage } = useAuth()
  const visibleValueProps = canAccessMembersPage
    ? valueProps
    : valueProps.filter((prop) => prop.href !== "/engineers")

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-muted/50 to-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container px-4 py-24 md:py-32 lg:py-40 relative">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              <Cpu className="h-3 w-3 mr-1" />
              Open Source Silicon Community
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-balance">
              <span className="text-primary">Open Source ASIC Hub</span>
            </h1>
            <p className="text-xl md:text-2xl font-medium text-foreground/80 mb-4">
              Democratizing chip design
            </p>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
              The ASIC Design Community for MENA Engineers. Connect with fellow engineers, 
              share knowledge, and build the future of silicon together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Button size="lg" asChild>
                  <Link href="/profile/create">
                    Create Your Profile
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button size="lg" onClick={openAuthModal}>
                  Join the Community
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
              {canAccessMembersPage && (
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary/40 text-primary hover:bg-primary/10 dark:border-primary/50 dark:text-primary dark:hover:bg-primary/20"
                  asChild
                >
                  <Link href="/engineers">Browse Engineers</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Silicon Sprint Announcement - Highlighted */}
      <section className="border-b bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container px-4 py-12 md:py-16 relative">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-primary text-primary-foreground">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Featured Program
                </Badge>
                <Badge variant="outline">Spring 2026</Badge>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-balance">
                Silicon Sprint at AUC
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                A hands-on training program focused on digital ASIC design using open-source 
                Electronic Design Automation (OS EDA) tools. Learn from experienced instructors 
                through lectures and lab sessions, with top projects selected for fabrication.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Comprehensive Curriculum</p>
                    <p className="text-xs text-muted-foreground">HDL, Simulation, Synthesis, Prototyping</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Cpu className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Real Fabrication</p>
                    <p className="text-xs text-muted-foreground">Best projects taped out on silicon</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Silicon Bring-up Sessions</p>
                    <p className="text-xs text-muted-foreground">Testing, characterization, debugging</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">The American University in Cairo</p>
                    <p className="text-xs text-muted-foreground">In-person, collaborative learning</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" asChild>
                  <Link href="/silicon-sprint">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-primary/40 text-primary hover:bg-primary/10 dark:border-primary/50 dark:text-primary dark:hover:bg-primary/20">
                  Apply Now
                </Button>
              </div>
            </div>
            <div className="lg:w-80 w-full">
              <Card className="bg-card/80 backdrop-blur border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Program Highlights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Topics Covered</p>
                    <div className="flex flex-wrap gap-1">
                      {["Digital Logic", "Verilog/SystemVerilog", "Simulation", "Synthesis", "OpenLane", "Prototyping"].map((topic) => (
                        <Badge key={topic} variant="secondary" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Post-Fabrication</p>
                    <div className="flex flex-wrap gap-1">
                      {["Bring-up", "Testing", "Characterization", "Debugging"].map((topic) => (
                        <Badge key={topic} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      Collaborate on projects with guidance from industry experts. 
                      Top designs get fabricated on real silicon.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b bg-muted/30">
        <div className="container px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="border-b">
        <div className="container px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4">About the Community</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
                Built by Engineers, for Engineers
              </h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Founded by a professor and active contributor to major open-source silicon projects 
                including Caravel, OpenLane, and DFFRAM, this community aims to connect ASIC 
                design talent across the MENA region.
              </p>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Whether you&apos;re a student taking your first steps in digital design, 
                or a senior engineer with multiple tape-outs, there&apos;s a place for you here 
                to learn, share, and grow.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                  <Zap className="h-3 w-3 mr-1" />
                  Open Source First
                </Badge>
                <Badge variant="secondary">
                  <Globe className="h-3 w-3 mr-1" />
                  MENA Focused
                </Badge>
                <Badge variant="secondary">
                  <Code2 className="h-3 w-3 mr-1" />
                  Practical Knowledge
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {engineers.slice(0, 4).map((engineer) => (
                <Card key={engineer.id} className="p-4 hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <img
                      src={engineer.avatar}
                      alt={engineer.name}
                      className="h-10 w-10 rounded-full"
                    />
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

      {/* Value Propositions */}
      <section className="border-b">
        <div className="container px-4 py-16 md:py-24">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">What We Offer</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
              Everything You Need to Grow
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From knowledge sharing to career opportunities, we&apos;ve built the tools 
              to help ASIC engineers in the MENA region thrive.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {visibleValueProps.map((prop) => (
              <Card key={prop.title} className="group hover:border-primary/50 transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <prop.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="flex items-center gap-2">
                    {prop.title}
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </CardTitle>
                  <CardDescription className="text-base">
                    {prop.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link
                    href={prop.href}
                    className="text-sm text-primary font-medium hover:underline inline-flex items-center"
                  >
                    Learn more
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Open Source Projects */}
      <section className="border-b bg-muted/30">
        <div className="container px-4 py-16 md:py-24">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <Github className="h-3 w-3 mr-1" />
              Open Source
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
              Powered by Open Source Silicon
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We believe in democratizing chip design. Our community actively contributes 
              to and supports these foundational open-source projects.
            </p>
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
                <Card className="h-full hover:border-primary/50 transition-all hover:shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Github className="h-5 w-5" />
                      {project.name}
                    </CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground">
        <div className="container px-4 py-16 md:py-24">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
              Ready to Join the Community?
            </h2>
            <p className="text-primary-foreground/80 mb-8 text-lg">
              Create your profile, connect with fellow engineers, and start contributing 
              to the future of silicon design in the MENA region.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/profile/create">
                    Create Your Profile
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button size="lg" variant="secondary" onClick={openAuthModal}>
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                asChild
              >
                <Link href="/forum">
                  Explore Forum
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
