"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

const speakers = {
  "tim-ansell": {
    name: "Tim Ansell",
    image: "/speakers/tim-ansell.jpg",
    description: "Tim Ansell is a leading expert in ASIC design and open-source EDA tools. He has extensive experience in chip design and has contributed to various open-source projects in the semiconductor industry.",
  },
  "mohamed-gaber": {
    name: "Mohamed Gaber",
    image: "/speakers/mohamed-gaber.jpg",
    description: "Mohamed Gaber is a career developer of free and open source electronic design automation utilities. An Efabless alumus and member of the FOSSi Foundation, Gaber has been the lead maintainer of OpenLane since 2021 and the primary author of its rewrite, LibreLane.",
  },
  "mohamed-hosni": {
    name: "Mohamed Hosni",
    image: "/mohamed-hosni.jpeg",
    description: "Mohamed Hosni is a Senior ASIC Methodology Engineer at Qualcomm, specializing in signoff methodologies for advanced technology nodes. He previously worked at Efabless, where he contributed to 10+ open-source tape-outs using OpenLane, OpenROAD, and related tools on SKY130 and GF180 PDKs. He holds a B.Sc. in Nanoelectronics Engineering from Zewail City and is currently pursuing an M.Sc. in Electrical and Computer Engineering at Purdue University.",
  },
  "leo-moser": {
    name: "Leo Moser",
    image: "/speakers/leo-moser.jpg",
    description: "Leo Moser works on FPGA integration and has made significant contributions to the LibreLane plugin for Greyhound FPGA, enhancing open-source ASIC workflows.",
  },
  "abdelmonem": {
    name: "Abdelmonem",
    image: "/Abdelmonem.jpeg",
    description: "Abdelmonem is a digital IC Design and Verification Engineer at Pearl Semiconductor. Before that he earned his Bachelor of Engineering in Electronics and Communications from Cairo University in 2023. At Pearl Semiconductor, he is working on Phase-Locked Loop (PLL) solutions as part of advanced integrated circuit design and verification of wireless communication systems.",
  },
  "abdulrahman": {
    name: "Abdulrahman",
    image: "/abdulrahman.jpeg",
    description: "Abdelrahman Oun is a Senior Digital Design Engineer at Pearl Semiconductor with over 3 years of experience in the semiconductors industry. He holds a Bachelor's degree in Electronics and Communications Engineering from the Faculty of Engineering, Ain Shams University, graduating in 2022. Throughout his career, Abdelrahman has built a strong track record of contributions across multiple tape-outs, spanning the full chip development cycle. His work encompasses RTL feature implementation, block-level and system-level verification up to chip top, as well as backend implementation including timing closure and chip finishing.",
  },
  "basem": {
    name: "Basem",
    image: "/speakers/basem.jpg",
    description: "Basem leads practical sessions on ASIC implementation, covering synthesis, placement, routing, and signoff processes.",
  },
  "radwa": {
    name: "Radwa",
    image: "/speakers/radwa.jpg",
    description: "Radwa specializes in functional verification using Cocotb and ensures that ASIC designs are thoroughly tested before tape-out.",
  },
  "dr-dina-mahmoud": {
    name: "Dr. Dina Mahmoud",
    image: "/speakers/dr-dina-mahmoud.jpg",
    description: "Dr. Dina Mahmoud is a researcher in hardware security, focusing on protecting ASIC designs from various threats and vulnerabilities.",
  },
  "mohamed-kassem": {
    name: "Mohamed Kassem",
    image: "/speakers/mohamed-kassem.jpg",
    description: "Mohamed Kassem is a keynote speaker and leader in ASIC design, sharing insights on industry trends and future directions.",
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
              <p className="text-lg text-muted-foreground leading-relaxed">
                {speaker.description}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  )
}