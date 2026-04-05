import { MessageSquare, Cpu, Zap, Layout, CircuitBoard, GitBranch, Briefcase, FileText } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export type ForumCategory = {
  id: string
  name: string
  description: string
  color: string
  icon: LucideIcon
}

export type OpenSourceProject = {
  id: string
  name: string
  url: string
  stars: number
  description?: string
}

export const forumCategories: ForumCategory[] = [
  {
    id: "digital-design",
    name: "Digital Design",
    description: "RTL design, synthesis, timing analysis, and digital architecture",
    color: "bg-blue-500",
    icon: Cpu,
  },
  {
    id: "analog",
    name: "Analog/Mixed-Signal",
    description: "Analog circuit design, ADCs, DACs, and mixed-signal integration",
    color: "bg-purple-500",
    icon: Zap,
  },
  {
    id: "verification",
    name: "Verification",
    description: "UVM, formal verification, simulation, and testbench development",
    color: "bg-green-500",
    icon: MessageSquare,
  },
  {
    id: "physical-design",
    name: "Physical Design",
    description: "Floorplanning, placement, routing, and timing closure",
    color: "bg-orange-500",
    icon: Layout,
  },
  {
    id: "fpga",
    name: "FPGA",
    description: "FPGA development, prototyping, and vendor-specific tools",
    color: "bg-cyan-500",
    icon: CircuitBoard,
  },
  {
    id: "open-source",
    name: "Open Source",
    description: "OpenLane, Caravel, DFFRAM, and other open-source silicon projects",
    color: "bg-teal-500",
    icon: GitBranch,
  },
  {
    id: "jobs",
    name: "Jobs",
    description: "Job postings, career advice, and professional opportunities",
    color: "bg-rose-500",
    icon: Briefcase,
  },
  {
    id: "miscellaneous",
    name: "Miscellaneous",
    description: "General discussions, off-topic chats, and miscellaneous topics",
    color: "bg-gray-500",
    icon: FileText,
  },
]

export const openSourceProjectsList: OpenSourceProject[] = [
  {
    id: "librelane",
    name: "LibreLane",
    url: "https://github.com/librelane/librelane",
    description: "ASIC implementation flow infrastructure, successor to OpenLane",
    stars: 352,
  },
  {
    id: "caravel_user_project",
    name: "Caravel User Project",
    description: "User project designed for integration into the Caravel chip user space.", 
    url: "https://github.com/chipfoundry/caravel_user_project",
    stars: 16,
  },
  {
    id: "openroad",
    name: "OpenROAD",
    description: "OpenROAD's unified application implementing an RTL-to-GDS Flow.",
    url: "https://github.com/The-OpenROAD-Project/OpenROAD",
    stars: 2547,
  },
  {
    id: "greyhound-ifp",
    name: "Greyhound IFP",
    description: "Greyhound on IHP SG13G2 0.13 μm BiCMOS process",
    url: "https://github.com/mole99/greyhound-ihp",
    stars: 87,
  },
  {
    id: "dffram",
    name: "DFFRAM",
    description: "Standard Cell Library based Memory Compiler using FF/Latch cells",
    url: "https://github.com/AUCOHL/DFFRAM",
    stars: 164,
  },
  {
    id: "difetto",
    name: "Difetto",
    url: "https://github.com/donn/difetto",
    description: "About [WIP] Open-source DFT flow",
    stars: 26,
  },
  {
    id: "sky130-pdk",
    name: "SKY130 PDK",
    url: "https://github.com/google/skywater-pdk",
    description: "Open source process design kit for usage with SkyWater Technology Foundry's 130nm node.",
    stars: 3472,
  }
]
