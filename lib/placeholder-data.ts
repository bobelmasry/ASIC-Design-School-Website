import { MessageSquare, Cpu, Zap, Layout, CircuitBoard, GitBranch, Briefcase, FileText } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export type Engineer = {
  id: string
  name: string
  avatar: string
  location: {
    city: string
    country: string
    remotePreference: "remote" | "hybrid" | "onsite"
  }
  domains: string[]
}

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
  description: string
  longDescription: string
  url: string
  category: "flow" | "ip" | "pdk" | "tool" | "soc"
  stars: number
  tags: string[]
  featured?: boolean
}

export const engineers: Engineer[] = [
  {
    id: "dina-mahmoud",
    name: "Dr. Dina Mahmoud",
    avatar: "https://ui-avatars.com/api/?name=Dina+Mahmoud&background=0ea5e9&color=fff",
    location: {
      city: "Cairo",
      country: "Egypt",
      remotePreference: "hybrid",
    },
    domains: ["Digital Design", "Verification", "Physical Design"],
  },
  {
    id: "mohamed-shalan",
    name: "Dr. Mohamed Shalan",
    avatar: "https://ui-avatars.com/api/?name=Mohamed+Shalan&background=8b5cf6&color=fff",
    location: {
      city: "Cairo",
      country: "Egypt",
      remotePreference: "remote",
    },
    domains: ["Analog", "Mixed-Signal"],
  },
  {
    id: "basem-hesham",
    name: "Basem Hesham",
    avatar: "https://ui-avatars.com/api/?name=Basem+Hesham&background=10b981&color=fff",
    location: {
      city: "Cairo",
      country: "Egypt",
      remotePreference: "hybrid",
    },
    domains: ["Digital Design", "FPGA"],
  },
  {
    id: "rana-taher",
    name: "Rana Taher",
    avatar: "https://ui-avatars.com/api/?name=Rana+Mansour&background=f59e0b&color=fff",
    location: {
      city: "Cairo",
      country: "Egypt",
      remotePreference: "remote",
    },
    domains: ["Verification", "Digital Design"],
  },
  {
    id: "mohamed-gaber",
    name: "Mohamed Gaber",
    avatar: "https://ui-avatars.com/api/?name=Mohamed+Gaber&background=ec4899&color=fff",
    location: {
      city: "Cairo",
      country: "Egypt",
      remotePreference: "onsite",
    },
    domains: ["Digital Design", "FPGA"],
  }
]

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
    id: "caravel",
    name: "Caravel",
    description: "A template SoC for Google-funded shuttle runs through Efabless",
    longDescription: "Caravel is a template SoC designed for use with the Google-sponsored shuttle program through Efabless. It provides a standardized wrapper with GPIO, SPI, UART, and power management, allowing designers to focus on their custom logic in a user project area.",
    url: "https://github.com/efabless/caravel",
    category: "soc",
    stars: 388,
    tags: ["SoC", "Efabless", "SKY130", "RISC-V"],
    featured: true,
  },
  {
    id: "openlane",
    name: "OpenLane",
    description: "Automated RTL-to-GDSII flow for digital design",
    longDescription: "OpenLane is an automated RTL-to-GDSII flow built around open-source tools including OpenROAD, Yosys, Magic, Netgen, and more. It supports both SKY130 and GF180MCU PDKs and is actively maintained by Efabless.",
    url: "https://github.com/The-OpenROAD-Project/OpenLane",
    category: "flow",
    stars: 1738,
    tags: ["RTL-to-GDSII", "Synthesis", "P&R", "OpenROAD"],
    featured: true,
  },
  {
    id: "dffram",
    name: "DFFRAM",
    description: "Standard cell-based RAM compiler",
    longDescription: "DFFRAM is an open-source standard cell-based RAM compiler that generates synthesizable RAM designs using only flip-flops and standard cells. It supports multiple configurations and is optimized for SKY130 PDK.",
    url: "https://github.com/AUCOHL/DFFRAM",
    category: "ip",
    stars: 164,
    tags: ["RAM", "Memory", "SKY130", "Standard Cells"],
    featured: true,
  },
  {
    id: "openroad",
    name: "OpenROAD",
    description: "Complete RTL-to-GDSII flow with cutting-edge algorithms",
    longDescription: "OpenROAD is an integrated chip physical design tool that provides a fully autonomous, 24-hour RTL-to-GDSII flow. It includes state-of-the-art algorithms for floorplanning, placement, CTS, routing, and finishing.",
    url: "https://github.com/The-OpenROAD-Project/OpenROAD",
    category: "flow",
    stars: 2547,
    tags: ["Physical Design", "P&R", "Floorplanning", "CTS"],
    featured: true,
  },
  {
    id: "yosys",
    name: "Yosys",
    description: "Open synthesis suite for Verilog RTL synthesis",
    longDescription: "Yosys is a framework for Verilog RTL synthesis. It currently has extensive Verilog-2005 support and provides a basic set of synthesis algorithms for various application domains.",
    url: "https://github.com/YosysHQ/yosys",
    category: "tool",
    stars: 4383,
    tags: ["Synthesis", "Verilog", "FPGA", "ASIC"],
  },
  {
    id: "sky130-pdk",
    name: "SKY130 PDK",
    description: "SkyWater Technology 130nm open-source PDK",
    longDescription: "The SkyWater Open Source PDK is a collaboration between Google and SkyWater Technology Foundry to provide a fully open source Process Design Kit for the SKY130 130nm process node.",
    url: "https://github.com/google/skywater-pdk",
    category: "pdk",
    stars: 3472,
    tags: ["PDK", "130nm", "SkyWater", "Google"],
    featured: true,
  },
  {
    id: "gf180mcu-pdk",
    name: "GF180MCU PDK",
    description: "GlobalFoundries 180nm open-source PDK",
    longDescription: "The GF180MCU open-source PDK provides design kit files for the GlobalFoundries 180nm MCU process. It includes standard cells, I/O libraries, and IP blocks for analog and digital design.",
    url: "https://github.com/google/gf180mcu-pdk",
    category: "pdk",
    stars: 476,
    tags: ["PDK", "180nm", "GlobalFoundries", "MCU"],
  },
  {
    id: "verilator",
    name: "Verilator",
    description: "Fast Verilog/SystemVerilog simulator",
    longDescription: "Verilator is the fastest free Verilog HDL simulator. It compiles synthesizable Verilog into multithreaded C++ or SystemC code for execution. It's commonly used for large-scale simulation and verification.",
    url: "https://github.com/verilator/verilator",
    category: "tool",
    stars: 3500,
    tags: ["Simulation", "Verilog", "SystemVerilog", "C++"],
  },
  {
    id: "magic",
    name: "Magic VLSI",
    description: "VLSI layout tool for DRC, extraction, and GDS",
    longDescription: "Magic is a venerable VLSI layout tool, written in the 1980s at Berkeley. It has been extensively updated and is now used for DRC checking, parasitic extraction, and GDS generation in modern open-source flows.",
    url: "https://github.com/RTimothyEdwards/magic",
    category: "tool",
    stars: 630,
    tags: ["Layout", "DRC", "Extraction", "GDS"],
  },
  {
    id: "cocotb",
    name: "cocotb",
    description: "Coroutine-based cosimulation testbench for HDL",
    longDescription: "cocotb is a coroutine-based cosimulation testbench environment for verifying VHDL and Verilog RTL using Python. It provides a powerful and productive way to write testbenches.",
    url: "https://github.com/cocotb/cocotb",
    category: "tool",
    stars: 2312,
    tags: ["Verification", "Python", "Testbench", "Simulation"],
  },
  {
    id: "picorv32",
    name: "PicoRV32",
    description: "Size-optimized RISC-V CPU core",
    longDescription: "PicoRV32 is a CPU core that implements the RISC-V RV32IMC instruction set. It is designed to be small and efficient, making it ideal for FPGA and ASIC implementations where area is constrained.",
    url: "https://github.com/YosysHQ/picorv32",
    category: "ip",
    stars: 4075,
    tags: ["RISC-V", "CPU", "RV32IMC", "Compact"],
  },
  {
    id: "vexriscv",
    name: "VexRiscv",
    description: "SpinalHDL-based RISC-V CPU core",
    longDescription: "VexRiscv is a RISC-V implementation written in SpinalHDL. It's highly configurable and supports various ISA extensions. The core can be tuned from a small embedded processor to a high-performance Linux-capable system.",
    url: "https://github.com/SpinalHDL/VexRiscv",
    category: "ip",
    stars: 3093,
    tags: ["RISC-V", "SpinalHDL", "CPU", "Configurable"],
  },
]

export const domains = [
  "Digital Design",
  "Analog",
  "Mixed-Signal",
  "Verification",
  "Physical Design",
  "FPGA",
]
