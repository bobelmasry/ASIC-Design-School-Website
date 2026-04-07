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
    image: "/tim-ansell.jpeg",
    description: ["Tim 'Mithro' Ansell is a pioneering figure in open-source silicon, known for his crucial role in democratizing chip design. Through initiatives like the SkyWater and GlobalFoundries open-source PDKs and the Open MPW program, he has significantly lowered barriers to entry, enabling innovation and access for individuals and smaller entities in semiconductor technology."],
  },
  "mohamed-gaber": {
    name: "Mohamed Gaber",
    image: "/mohamed-gaber.jpeg",
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
      "Leo Moser is an open source silicon advocate and aspiring chip designer. He is a LibreLane developer and has contributed to several of the open source PDKs. He has also designed several open-source chips himself, including Greyhound: a RISC-V SoC with embedded FPGA.",
    ],
  },
  "abdelmonem-sallam": {
    name: "Abdelmonem Sallam",
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
    image: "/basem.jpg",
    description: ["Basem Hesham is a Research Assistant at The American University in Cairo (AUC), specializing in physical implementation. He holds a Bachelor's degree in Electronics and Communications Engineering from the Faculty of Engineering, Zagazig University, graduating in 2024.",
      "He leads practical sessions from RTL-to-GDSII implementation, guiding participants through the complete flow of synthesis, floorplanning, placement, and routing, followed by final signoff verification."
    ],
  },
  "radwa-gamal": {
    name: "Radwa Gamal",
    image: "/radwa-gamal.jpg",
    description: ["Radwa Gamal is a Teaching Assistant at The American University in Cairo (AUC). She holds a Bachelor of Science in Electronics and Communications Engineering from Ain Shams University, graduating in 2024.",
      "She leads practical sessions in cocotb-based digital verification, guiding participants to build a UVM-inspired verification environment using PyUVM, cocotb, and Verilator."
    ],
  },
  "mohamed-kassem": {
    name: "Mohamed Kassem",
    image: "/kassem.png",
    description: [
      "Mohamed Kassem is CEO and Co-Founder of NativeChips, a company building an AI-powered platform that turns natural language into manufactured silicon. NativeChips automates the entire chip design flow using multi-agent AI — from a plain English description of what you need to a tapeout-ready design — making custom chips accessible to companies that were never able to afford them or have the expertise to make them before. Mohamed is also the founder of ChipFoundry, a community initiative making chip fabrication accessible to startups, researchers, and independent designers at a fraction of traditional cost. Before NativeChips, as CTO of Efabless, he built the chipIgnite platform and the open-source silicon infrastructure behind hundreds of community-driven tapeouts — helping turn open-source chip design from a research concept into real chips in real packages shipped to real people.",
    ],
  },
  "salma-sultan": {
    name: "Salma Sultan",
    image: "/salma-sultan.jpeg",
    description: ["A Digital Design and Verification Engineer who graduated with honors from Cairo University in 2022 with a B.Sc. in Electronics and Communications Engineering. Her professional experience includes roles at Pearl Semiconductor and Wasiela, where she specialized in digital verification using UVM, RTL design, open source digital verification technologies and hardware algorithm development."],
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