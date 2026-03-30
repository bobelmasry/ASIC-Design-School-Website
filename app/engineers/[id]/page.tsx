"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/components/auth-context"
import { engineers } from "@/lib/placeholder-data"
import {
  MapPin,
  Github,
  Linkedin,
  Mail,
  ArrowLeft,
  Briefcase,
  Code2,
  Cpu,
  ExternalLink,
  Zap,
  Target,
  Globe,
} from "lucide-react"

const experienceLabels: Record<string, string> = {
  student: "Student",
  junior: "Junior (0-2 years)",
  mid: "Mid-Level (3-5 years)",
  senior: "Senior (6+ years)",
}

const experienceBadgeColors: Record<string, string> = {
  student: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  junior: "bg-green-500/10 text-green-500 border-green-500/20",
  mid: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  senior: "bg-purple-500/10 text-purple-500 border-purple-500/20",
}

export default function EngineerProfilePage() {
  const params = useParams()
  const { canAccessMembersPage } = useAuth()

  if (!canAccessMembersPage) {
    return (
      <div className="container px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Restricted</h1>
        <p className="text-muted-foreground mb-6">
          Member profiles are currently available to employees and admins only.
        </p>
        <Button asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    )
  }
  
  const engineer = engineers.find((e) => e.id === params.id)

  if (!engineer) {
    return (
      <div className="container px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Engineer Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The engineer profile you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button asChild>
          <Link href="/engineers">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Directory
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl px-4 py-8 md:py-12">
      {/* Back button */}
      <Link
        href="/engineers"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to Directory
      </Link>

      {/* Profile Header */}
      <Card className="mb-6 border-gray-300 dark:border-gray-800">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background shadow-lg">
              <AvatarImage src={engineer.avatar} alt={engineer.name} />
              <AvatarFallback className="text-2xl">{engineer.name.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold">{engineer.name}</h1>
                  <Badge
                    variant="outline"
                    className={experienceBadgeColors[engineer.experienceLevel]}
                  >
                    {experienceLabels[engineer.experienceLevel]}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {engineer.location.city}, {engineer.location.country}
                  </span>
                  <span className="flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    <span className="capitalize">{engineer.location.remotePreference}</span>
                  </span>
                </div>
              </div>

              {/* Social Links & Contact */}
              <div className="flex flex-wrap gap-3">
                {engineer.githubUrl && (
                  <Button className="dark:hover:text-gray-400" variant="outline" size="sm" asChild>
                    <a href={engineer.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" />
                      GitHub
                    </a>
                  </Button>
                )}
                {engineer.linkedinUrl && (
                  <Button className="dark:hover:text-gray-400" variant="outline" size="sm" asChild>
                    <a href={engineer.linkedinUrl} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="mr-2 h-4 w-4" />
                      LinkedIn
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* About */}
          {engineer.about && (
            <Card className="border-gray-300 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  About
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{engineer.about}</p>
              </CardContent>
            </Card>
          )}

          {/* Domains */}
          <Card className="border-gray-300 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Domains
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {engineer.domains.map((domain) => (
                  <Badge key={domain} variant="secondary" className="text-sm py-1.5 px-3">
                    {domain}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tools & Languages */}
          <Card className="border-gray-300 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Code2 className="h-5 w-5 text-primary" />
                Tools & Languages
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2 text-muted-foreground">Tools</h4>
                <div className="flex flex-wrap gap-2">
                  {engineer.tools.map((tool) => (
                    <Badge key={tool} variant="outline" className="text-sm">
                      {tool}
                    </Badge>
                  ))}
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-2 text-muted-foreground">Languages</h4>
                <div className="flex flex-wrap gap-2">
                  {engineer.languages.map((lang) => (
                    <Badge key={lang} variant="outline" className="text-sm">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Open Source Contributions */}
          {engineer.openSourceContributions.length > 0 && (
            <Card className="border-gray-300 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Github className="h-5 w-5 text-primary" />
                  Open Source Contributions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {engineer.openSourceContributions.map((contribution, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{contribution.name}</h4>
                        <a
                          href={contribution.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline inline-flex items-center text-sm"
                        >
                          View
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </div>
                      <p className="text-sm text-muted-foreground">{contribution.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">

          {/* Areas of Interest */}
          <Card className="border-gray-300 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="text-lg">Areas of Interest</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {engineer.areasOfInterest.map((area) => (
                  <Badge key={area} variant="outline" className="text-sm">
                    {area}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
