import Link from "next/link"
import { Cpu, Github, Linkedin, ExternalLink } from "lucide-react"

const openSourceProjects = [
  { name: "Caravel", url: "https://github.com/efabless/caravel" },
  { name: "OpenLane", url: "https://github.com/The-OpenROAD-Project/OpenLane" },
  { name: "DFFRAM", url: "https://github.com/AUCOHL/DFFRAM" },
]

const communityLinks = [
  { name: "Engineers", href: "/engineers" },
  { name: "Projects", href: "/projects" },
  { name: "Forum", href: "/forum" },
  { name: "Silicon Sprint", href: "/silicon-sprint" },
]

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Cpu className="h-6 w-6 text-primary" />
              <span className="font-semibold text-lg">Open Source ASIC Hub</span>
            </Link>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-semibold mb-4">Community</h3>
            <ul className="space-y-2">
              {communityLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Open Source */}
          <div>
            <h3 className="font-semibold mb-4">Open Source Projects</h3>
            <ul className="space-y-2">
              {openSourceProjects.map((project) => (
                <li key={project.name}>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                  >
                    {project.name}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/The-OpenROAD-Project"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                >
                  OpenROAD Project
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://efabless.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                >
                  Efabless
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://skywater-pdk.readthedocs.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                >
                  SkyWater PDK Docs
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
