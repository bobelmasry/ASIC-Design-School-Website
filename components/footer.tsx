"use client"

import Link from "next/link"
import Image from "next/image"
import { ExternalLink, Github, Twitter, Mail } from "lucide-react"

const openSourceProjects = [
  { name: "Caravel", url: "https://github.com/efabless/caravel" },
  { name: "OpenLane", url: "https://github.com/The-OpenROAD-Project/OpenLane" },
  { name: "DFFRAM", url: "https://github.com/AUCOHL/DFFRAM" },
]

const communityLinks = [
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
          <div className="md:col-span-1 flex justify-center md:justify-start">
            <Link href="/" className="flex flex-col md:flex-row items-center gap-4 mb-4">
              <Image src="/large_logo.png" alt="Open Source ASIC Hub" width={60} height={60} className="h-18 w-24 md:h-32 md:w-36 text-primary" />
            </Link>
          </div>

          {/* Community */}
          <div className="text-center">
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
          <div className="text-center">
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
          <div className="text-center">
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
