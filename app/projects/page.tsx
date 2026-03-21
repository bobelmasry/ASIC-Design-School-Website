"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Github, 
  Search, 
  Star, 
  Users, 
  ExternalLink,
  Cpu,
  Layers,
  CircuitBoard,
  Wrench,
  Box,
  ArrowRight
} from "lucide-react"
import { openSourceProjectsList, projectCategories, type OpenSourceProject } from "@/lib/placeholder-data"

const categoryIcons: Record<string, React.ElementType> = {
  flow: Layers,
  ip: Cpu,
  pdk: CircuitBoard,
  tool: Wrench,
  soc: Box,
}

const categoryColors: Record<string, string> = {
  flow: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  ip: "bg-green-500/10 text-green-500 border-green-500/20",
  pdk: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  tool: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  soc: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
}

function ProjectCard({ project }: { project: OpenSourceProject }) {
  const Icon = categoryIcons[project.category] || Cpu
  
  return (
    <Card className="group hover:border-primary/50 transition-all hover:shadow-lg h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className={`h-10 w-10 rounded-lg flex items-center justify-center border ${categoryColors[project.category]}`}>
            <Icon className="h-5 w-5" />
          </div>
          {project.featured && (
            <Badge className="bg-primary/10 text-primary border-primary/20">Featured</Badge>
          )}
        </div>
        <CardTitle className="flex items-center gap-2 text-lg">
          {project.name}
          <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {project.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex flex-wrap gap-1 mb-4">
          {project.tags.slice(0, 4).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4" />
              {project.stars.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {project.contributors}
            </span>
          </div>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-primary hover:underline font-medium"
          >
            <Github className="h-4 w-4" />
            View
          </a>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState("all")

  const filteredProjects = React.useMemo(() => {
    return openSourceProjectsList.filter((project) => {
      const matchesSearch =
        searchQuery === "" ||
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesCategory = selectedCategory === "all" || project.category === selectedCategory
      
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  const featuredProjects = filteredProjects.filter((p) => p.featured)
  const otherProjects = filteredProjects.filter((p) => !p.featured)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <section className="border-b bg-gradient-to-b from-muted/50 to-background">
        <div className="container px-4 py-12 md:py-16">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-balance">
              Open Source Projects
            </h1>
            <p className="text-lg text-muted-foreground mb-6 text-pretty">
              Explore the open-source tools, PDKs, IP cores, and design flows that are 
              democratizing chip design. These projects power the modern open silicon movement.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild>
                <a href="https://github.com/AUCOHL" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  AUCOHL on GitHub
                </a>
              </Button>
              <Button className="hover:text-gray-400" variant="outline" asChild>
                <Link href="/forum?category=open-source">
                  Discuss Projects
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="flex-1">
        <div className="container px-4 py-8">
              {/* Featured Projects */}
              {featuredProjects.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Star className="h-5 w-5 text-primary" />
                    Featured Projects
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredProjects.map((project) => (
                      <a
                        key={project.id}
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <ProjectCard project={project} />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* All Other Projects */}
              {otherProjects.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Github className="h-5 w-5" />
                    {featuredProjects.length > 0 ? "More Projects" : "All Projects"}
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {otherProjects.map((project) => (
                      <a
                        key={project.id}
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <ProjectCard project={project} />
                      </a>
                    ))}
                  </div>
                </div>
              )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-muted/30">
        <div className="container px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Want to Contribute?</h2>
            <p className="text-muted-foreground mb-6">
              Join the open-source silicon movement. Whether you&apos;re fixing bugs, 
              adding features, or improving documentation, every contribution matters.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild>
                <Link href="/engineers">
                  Find Collaborators
                </Link>
              </Button>
              <Button className="hover:text-gray-400" variant="outline" asChild>
                <Link href="/forum/new">
                  Share Your Project
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
