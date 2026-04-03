"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-context"
import { 
  Github, 
  Star, 
  ExternalLink,
  ArrowRight
} from "lucide-react"
import { openSourceProjectsList, type OpenSourceProject } from "@/lib/placeholder-data"

function ProjectCard({ project }: { project: OpenSourceProject }) {
  
  return (
    <Card className="group hover:border-primary/50 transition-all hover:shadow-lg h-full flex flex-col border-gray-300 dark:border-gray-800">
      <CardHeader className="pb-3">
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
          </div>
          <p className="flex items-center gap-1 hover:text-blue-600 hover:underline transition-colors">
            <Github className="h-4 w-4" />
            View
          </p>
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
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-8 text-balance">
              Open Source Projects
            </h1>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild>
                <a href="https://github.com/AUCOHL" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  AUCOHL on GitHub
                </a>
              </Button>
              <Button className="dark:hover:text-gray-400" variant="outline" asChild>
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
        </div>
      </section>
    </div>
  )
}
