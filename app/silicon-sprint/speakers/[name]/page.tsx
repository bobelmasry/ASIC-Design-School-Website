"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"

const speakers = {
  "tim-ansell": {
    name: "Tim Ansell",
    title: "ASIC Design Expert",
    image: "/speakers/tim-ansell.jpg",
    description: "Tim Ansell is a leading expert in ASIC design and open-source EDA tools. He has extensive experience in chip design and has contributed to various open-source projects in the semiconductor industry.",
    bio: "With over 15 years in the field, Tim has worked on multiple tape-outs and is passionate about democratizing access to ASIC technology through education and open-source tools.",
  },
  "mohamed-gaber": {
    name: "Mohamed Gaber",
    title: "ASIC Design Engineer",
    image: "/speakers/mohamed-gaber.jpg",
    description: "Mohamed Gaber specializes in ASIC design and has developed LibreLane, an open-source ASIC design flow. He is committed to advancing the field through innovative tools and education.",
    bio: "Mohamed holds a degree in Electrical Engineering and has worked on several ASIC projects. He is actively involved in the open-source community and regularly contributes to forums and workshops.",
  },
  "mohamed-hosni": {
    name: "Mohamed Hosni",
    title: "Physical Design Specialist",
    image: "/speakers/mohamed-hosni.jpg",
    description: "Mohamed Hosni is an expert in physical design and implementation strategies for ASICs. He has led multiple successful tape-outs and mentors aspiring engineers.",
    bio: "With a background in semiconductor physics and extensive industry experience, Mohamed focuses on optimizing design flows and ensuring manufacturability of complex chips.",
  },
  "leo-moser": {
    name: "Leo Moser",
    title: "FPGA and LibreLane Contributor",
    image: "/speakers/leo-moser.jpg",
    description: "Leo Moser works on FPGA integration and has made significant contributions to the LibreLane plugin for Greyhound FPGA, enhancing open-source ASIC workflows.",
    bio: "A software engineer with a passion for hardware, Leo bridges the gap between software development and hardware design, making tools more accessible to developers.",
  },
  "abdulmoniem": {
    name: "Abdulmoniem",
    title: "Formal Verification Expert",
    image: "/speakers/abdulmoniem.jpg",
    description: "Abdulmoniem specializes in formal design verification using SymbiYosys and is an advocate for rigorous verification methodologies in ASIC design.",
    bio: "He has developed several verification frameworks and teaches best practices for ensuring design correctness through formal methods.",
  },
  "abdulrahman": {
    name: "Abdulrahman",
    title: "Static Timing Analysis Specialist",
    image: "/speakers/abdulrahman.jpg",
    description: "Abdulrahman focuses on static timing analysis using OpenSTA and helps teams optimize timing closure in their ASIC designs.",
    bio: "With expertise in timing analysis tools and methodologies, he ensures that designs meet performance requirements and are ready for fabrication.",
  },
  "basem": {
    name: "Basem",
    title: "ASIC Implementation Lead",
    image: "/speakers/basem.jpg",
    description: "Basem leads practical sessions on ASIC implementation, covering synthesis, placement, routing, and signoff processes.",
    bio: "An experienced engineer with hands-on knowledge of the entire ASIC flow, Basem trains engineers on using open-source tools effectively.",
  },
  "radwa": {
    name: "Radwa",
    title: "Verification Engineer",
    image: "/speakers/radwa.jpg",
    description: "Radwa specializes in functional verification using Cocotb and ensures that ASIC designs are thoroughly tested before tape-out.",
    bio: "She develops testbenches and verification environments, emphasizing the importance of comprehensive testing in the design process.",
  },
  "dr-dina-mahmoud": {
    name: "Dr. Dina Mahmoud",
    title: "Hardware Security Researcher",
    image: "/speakers/dr-dina-mahmoud.jpg",
    description: "Dr. Dina Mahmoud is a researcher in hardware security, focusing on protecting ASIC designs from various threats and vulnerabilities.",
    bio: "With a PhD in Computer Engineering, she conducts research on secure design practices and educates on emerging threats in semiconductor technology.",
  },
  "mohamed-kassem": {
    name: "Mohamed Kassem",
    title: "ASIC Design Leader",
    image: "/speakers/mohamed-kassem.jpg",
    description: "Mohamed Kassem is a keynote speaker and leader in ASIC design, sharing insights on industry trends and future directions.",
    bio: "He has led major ASIC projects and is committed to fostering the next generation of chip designers through education and mentorship.",
  },
}

export default function SpeakerPage() {
  const params = useParams()
  const speakerSlug = params.name as string
  const speaker = speakers[speakerSlug as keyof typeof speakers]

  if (!speaker) {
    return (
      <div className="container px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Speaker Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The speaker you're looking for doesn't exist.
        </p>
        <Button asChild>
          <Link href="/silicon-sprint">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Silicon Sprint
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 max-w-4xl">
      {/* Back Button */}
      <Button variant="ghost" className="mb-6 hover:text-white" asChild>
        <Link href="/silicon-sprint">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Silicon Sprint
        </Link>
      </Button>

      <Card className="border-gray-300 dark:border-gray-800">
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-full md:w-48 h-48 bg-muted rounded-lg flex items-center justify-center">
              <img
                src={speaker.image}
                alt={speaker.name}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement
                  img.style.display = 'none'
                  const fallback = img.nextElementSibling as HTMLElement
                  fallback.style.display = 'flex'
                }}
              />
              <div className="hidden items-center justify-center text-muted-foreground">
                No Image Available
              </div>
            </div>
            <div className="flex-1">
              <CardTitle className="text-3xl mb-2">{speaker.name}</CardTitle>
              <Badge variant="secondary" className="mb-4">{speaker.title}</Badge>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {speaker.description}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <h3>About {speaker.name}</h3>
            <p>{speaker.bio}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}