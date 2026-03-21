import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Github, Linkedin, ArrowRight } from "lucide-react"
import type { Engineer } from "@/lib/placeholder-data"

type EngineerCardProps = {
  engineer: Engineer
}

const experienceBadgeColors: Record<string, string> = {
  student: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  junior: "bg-green-500/10 text-green-500 border-green-500/20",
  mid: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  senior: "bg-purple-500/10 text-purple-500 border-purple-500/20",
}

const experienceLabels: Record<string, string> = {
  student: "Student",
  junior: "Junior",
  mid: "Mid-Level",
  senior: "Senior",
}

export function EngineerCard({ engineer }: EngineerCardProps) {
  return (
    <Card className="group hover:border-primary/50 transition-all hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-background">
              <AvatarImage src={engineer.avatar} alt={engineer.name} />
              <AvatarFallback>{engineer.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold group-hover:text-primary transition-colors">
                {engineer.name}
              </h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>
                  {engineer.location.city}, {engineer.location.country}
                </span>
              </div>
            </div>
          </div>
          <Badge
            variant="outline"
            className={experienceBadgeColors[engineer.experienceLevel]}
          >
            {experienceLabels[engineer.experienceLevel]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Domains */}
        <div className="flex flex-wrap gap-1.5">
          {engineer.domains.slice(0, 3).map((domain) => (
            <Badge key={domain} variant="secondary" className="text-xs">
              {domain}
            </Badge>
          ))}
          {engineer.domains.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{engineer.domains.length - 3}
            </Badge>
          )}
        </div>

        {/* Tools */}
        <div>
          <p className="text-xs text-muted-foreground mb-1.5">Key Tools</p>
          <div className="flex flex-wrap gap-1">
            {engineer.tools.slice(0, 4).map((tool) => (
              <Badge key={tool} variant="outline" className="text-xs font-normal">
                {tool}
              </Badge>
            ))}
            {engineer.tools.length > 4 && (
              <Badge variant="outline" className="text-xs font-normal">
                +{engineer.tools.length - 4}
              </Badge>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex gap-2">
            {engineer.githubUrl && (
              <a
                href={engineer.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="GitHub profile"
              >
                <Github className="h-4 w-4" />
              </a>
            )}
            {engineer.linkedinUrl && (
              <a
                href={engineer.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn profile"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            )}
          </div>
          <Button className="hover:text-white" variant="ghost" size="sm" asChild>
            <Link href={`/engineers/${engineer.id}`}>
              View Profile
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
