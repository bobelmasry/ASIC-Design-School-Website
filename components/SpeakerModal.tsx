"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"

interface Speaker {
  name: string
  image: string
  description: string[]
}

const speakers: Record<string, Speaker> = {
  "tim-ansell": {
    name: "Tim Ansell",
    image: "/speakers/tim-ansell.jpg",
    description: ["Tim Ansell is a leading expert in ASIC design and open-source EDA tools. He has extensive experience in chip design and has contributed to various open-source projects in the semiconductor industry."],
  },
  "mohamed-gaber": {
    name: "Mohamed Gaber",
    image: "/speakers/mohamed-gaber.jpg",
    description: [
      "Mohamed Gaber is a career developer of free and open source electronic design automation utilities. An Efabless alumus and member of the FOSSi Foundation, Gaber has been the lead maintainer of OpenLane since 2021 and the primary author of its rewrite, LibreLane."
    ],
  },
  "mohamed-hosni": {
    name: "Mohamed Hosni",
    image: "/mohamed-hosni.jpeg",
    description: [
      "Mohamed Hosni is a Senior ASIC Methodology Engineer at Qualcomm, specializing in signoff methodologies for advanced technology nodes. He previously worked at Efabless, where he contributed to 10+ open-source tape-outs using OpenLane, OpenROAD, and related tools on SKY130 and GF180 PDKs.",
      "He holds a B.Sc. in Nanoelectronics Engineering from Zewail City and is currently pursuing an M.Sc. in Electrical and Computer Engineering at Purdue University."
    ],
  },
  "leo-moser": {
    name: "Leo Moser",
    image: "/leo.jpeg",
    description: [
      "Leo Moser is an open source silicon advocate and aspiring chip designer. He obtained his Master's degree at Graz University of Technology, majoring in microelectonics and IC design.",
      "In his work, he designed Greyhound, a RISC-V SoC with tightly coupled FABulous eFPGA fabricated on IHP's SG13G2 process. Previously, Leo worked at Efabless, where he focused on PDK enablement for the IHP Open Source PDK and on analog automation with CACE.",
      "He is excited about the future of the free and open source silicon community."
    ],
  },
  "abdelmonem": {
    name: "Abdelmonem",
    image: "/Abdelmonem.jpeg",
    description: [
      "Abdelmonem is a digital IC Design and Verification Engineer at Pearl Semiconductor. Before that he earned his Bachelor of Engineering in Electronics and Communications from Cairo University in 2023.",
      "At Pearl Semiconductor, he is working on Phase-Locked Loop (PLL) solutions as part of advanced integrated circuit design and verification of wireless communication systems."
    ],
  },
  "abdelrahman-oun": {
    name: "Abdelrahman Oun",
    image: "/abdulrahman.jpeg",
    description: [
      "Abdelrahman Oun is a Senior Digital Design Engineer at Pearl Semiconductor with over 3 years of experience in the semiconductors industry. He holds a Bachelor's degree in Electronics and Communications Engineering from the Faculty of Engineering, Ain Shams University, graduating in 2022.",
      "Throughout his career, Abdelrahman has built a strong track record of contributions across multiple tape-outs, spanning the full chip development cycle. His work encompasses RTL feature implementation, block-level and system-level verification up to chip top, as well as backend implementation including timing closure and chip finishing."
    ],
  },
  "basem-hesham": {
    name: "Basem Hesham",
    image: "/speakers/basem.jpg",
    description: ["Basem leads practical sessions on ASIC implementation, covering synthesis, placement, routing, and signoff processes."],
  },
  "radwa": {
    name: "Radwa",
    image: "/speakers/radwa.jpg",
    description: ["Radwa specializes in functional verification using Cocotb and ensures that ASIC designs are thoroughly tested before tape-out."],
  },
  "mohamed-kassem": {
    name: "Mohamed Kassem",
    image: "/kassem.png",
    description: [
      "Mohamed Kassem is on a mission to make custom silicon economically and operationally accessible to all. His work ensures that creating useful, smart products no longer requires massive teams, multi-year cycles, or deep specialized hardware expertise.",
      "He fundamentally believes that open-source hardware is the necessary foundation for scaling innovation in an increasingly connected and diverse world of devices. Mohamed builds the platforms and business models that are disrupting traditional semiconductor operations.",
      "By leveraging AI-native, no-code design workflows, he empowers a new generation of builders to bridge the gap from idea to silicon with unprecedented speed and efficiency. Whether through his pioneering work in the open-source community or his leadership in high-speed hardware development, his goal remains constant: lowering the barrier to entry for the next wave of global hardware innovation."
    ],
  },
  "salma-sultan": {
    name: "Salma Sultan",
    image: "/speakers/salma.jpg",
    description: ["Salma is a digital design engineer with expertise in RTL design and verification, contributing to the development of high-performance ASICs."],
  },
}

interface SpeakerModalProps {
  speakerSlug: string | null
  isOpen: boolean
  onClose: () => void
}

export function SpeakerModal({ speakerSlug, isOpen, onClose }: SpeakerModalProps) {
  const speaker = speakerSlug ? speakers[speakerSlug as keyof typeof speakers] : null

  if (!speaker) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] md:w-[90vw] max-w-none max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl">{speaker.name}</DialogTitle>
          <DialogDescription className="sr-only">
            Speaker biography and background information
          </DialogDescription>
        </DialogHeader>

        <Card className="border-0 shadow-none">
          <CardContent className="p-0">
            <div className="flex flex-col gap-4 md:gap-6">
              <div className="w-32 h-32 md:w-40 md:h-40 bg-muted rounded-lg flex items-center justify-center flex-shrink-0 mx-auto">
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
                <div className="hidden items-center justify-center text-muted-foreground text-sm">
                  No Image Available
                </div>
              </div>
              <div className="flex-1 space-y-3 md:space-y-4">
                {speaker.description.map((paragraph, index) => (
                  <p key={index} className="text-base md:text-lg text-muted-foreground leading-relaxed text-justify">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}