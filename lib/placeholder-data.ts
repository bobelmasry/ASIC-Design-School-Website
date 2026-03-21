import { MessageSquare, Cpu, Zap, Layout, CircuitBoard, GitBranch, Briefcase } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export type Engineer = {
  id: string
  name: string
  email: string
  avatar: string
  location: {
    city: string
    country: string
    remotePreference: "remote" | "hybrid" | "onsite"
  }
  linkedinUrl?: string
  githubUrl?: string
  experienceLevel: "student" | "junior" | "mid" | "senior"
  domains: string[]
  tools: string[]
  languages: string[]
  openSourceContributions: {
    name: string
    url: string
    description: string
  }[]
  lookingFor: string[]
  areasOfInterest: string[]
  about?: string
}

export type ForumCategory = {
  id: string
  name: string
  slug: string
  description: string
  count: number
  color: string
  icon: LucideIcon
}

export type ForumPost = {
  id: string
  title: string
  excerpt: string
  content: string
  author: {
    id: string
    name: string
    avatar: string
  }
  category: string
  tags: string[]
  createdAt: string
  replies: number
  views: number
  likes: number
  isPinned?: boolean
  isHot?: boolean
}

export type ForumReply = {
  id: string
  postId: string
  content: string
  author: {
    id: string
    name: string
    avatar: string
  }
  createdAt: string
  likes: number
  isAccepted?: boolean
}

export const engineers: Engineer[] = [
  {
    id: "dina-mahmoud",
    name: "Dr. Dina Mahmoud",
    email: "dina.mahmoud@example.com",
    avatar: "https://ui-avatars.com/api/?name=Dina+Mahmoud&background=0ea5e9&color=fff",
    location: {
      city: "Cairo",
      country: "Egypt",
      remotePreference: "hybrid",
    },
    linkedinUrl: "https://linkedin.com/in/dinamahmoud",
    githubUrl: "https://github.com/dinamahmoud",
    experienceLevel: "senior",
    domains: ["Digital Design", "Verification", "Physical Design"],
    tools: ["OpenLane", "Vivado", "Design Compiler", "VCS", "Innovus"],
    languages: ["Verilog", "SystemVerilog", "Python", "Tcl"],
    openSourceContributions: [
      {
        name: "DFFRAM",
        url: "https://github.com/AUCOHL/DFFRAM",
        description: "Contributed RTL optimizations and timing fixes",
      },
    ],
    lookingFor: ["Mentoring", "Projects to contribute to"],
    areasOfInterest: ["RISC-V", "AI accelerators", "Low-power design"],
    about: "Senior ASIC design engineer with 8+ years of experience in digital design and physical implementation. Passionate about open-source silicon and mentoring the next generation of engineers.",
  },
  {
    id: "mohamed-shalan",
    name: "Dr. Mohamed Shalan",
    email: "mohamed.shalan@example.com",
    avatar: "https://ui-avatars.com/api/?name=Mohamed+Shalan&background=8b5cf6&color=fff",
    location: {
      city: "Cairo",
      country: "Egypt",
      remotePreference: "remote",
    },
    linkedinUrl: "https://linkedin.com/in/mohamedshalan",
    githubUrl: "https://github.com/mohamedshalan",
    experienceLevel: "mid",
    domains: ["Analog", "Mixed-Signal"],
    tools: ["Cadence Virtuoso", "Spectre", "HSPICE"],
    languages: ["Verilog", "Python", "SKILL"],
    openSourceContributions: [],
    lookingFor: ["Jobs", "Learning", "Projects to contribute to"],
    areasOfInterest: ["Low-power design", "Biomedical circuits", "IoT"],
    about: "Analog/Mixed-signal designer specializing in low-power sensor interfaces and data converters. Looking to expand into open-source analog design.",
  },
  {
    id: "basem-hesham",
    name: "Basem Hesham",
    email: "basem.hesham@example.com",
    avatar: "https://ui-avatars.com/api/?name=Basem+Hesham&background=10b981&color=fff",
    location: {
      city: "Cairo",
      country: "Egypt",
      remotePreference: "hybrid",
    },
    linkedinUrl: "https://linkedin.com/in/basemhesham",
    githubUrl: "https://github.com/basemhesham",
    experienceLevel: "junior",
    domains: ["Digital Design", "FPGA"],
    tools: ["Vivado", "Quartus", "Verilator", "Yosys"],
    languages: ["Verilog", "SystemVerilog", "Chisel", "Python"],
    openSourceContributions: [
      {
        name: "RISC-V Core",
        url: "https://github.com/basemhesham/riscv-core",
        description: "Personal RISC-V RV32I implementation",
      },
    ],
    lookingFor: ["Jobs", "Learning", "Mentoring"],
    areasOfInterest: ["RISC-V", "Computer architecture", "Security"],
    about: "Recent graduate passionate about computer architecture and RISC-V. Working on my first tapeout through Efabless.",
  },
  {
    id: "rana",
    name: "Rana",
    email: "rana.mansour@example.com",
    avatar: "https://ui-avatars.com/api/?name=Rana+Mansour&background=f59e0b&color=fff",
    location: {
      city: "Cairo",
      country: "Egypt",
      remotePreference: "remote",
    },
    linkedinUrl: "https://linkedin.com/in/ranamansour",
    githubUrl: "https://github.com/ranamansour",
    experienceLevel: "mid",
    domains: ["Verification", "Digital Design"],
    tools: ["VCS", "Verilator", "UVM", "Questa"],
    languages: ["SystemVerilog", "Python", "C++"],
    openSourceContributions: [],
    lookingFor: ["Jobs", "Freelance opportunities"],
    areasOfInterest: ["Formal verification", "AI accelerators"],
    about: "Verification engineer with expertise in UVM and formal methods. Led verification efforts for multiple successful tapeouts.",
  },
  {
    id: "mohamed-gaber",
    name: "Mohamed Gaber",
    email: "mohamed.gaber@example.com",
    avatar: "https://ui-avatars.com/api/?name=Mohamed+Gaber&background=ec4899&color=fff",
    location: {
      city: "Cairo",
      country: "Egypt",
      remotePreference: "onsite",
    },
    githubUrl: "https://github.com/mohamedgaber",
    experienceLevel: "student",
    domains: ["Digital Design", "FPGA"],
    tools: ["Vivado", "Yosys", "OpenLane"],
    languages: ["Verilog", "Python"],
    openSourceContributions: [],
    lookingFor: ["Learning", "Mentoring", "Projects to contribute to"],
    areasOfInterest: ["RISC-V", "Open-source silicon", "GPU design"],
    about: "Electrical engineering student excited about open-source silicon. Currently learning digital design through OpenLane and FPGA projects.",
  }
]

export const forumCategories: ForumCategory[] = [
  {
    id: "digital-design",
    name: "Digital Design",
    slug: "digital-design",
    description: "RTL design, synthesis, timing analysis, and digital architecture",
    count: 156,
    color: "bg-blue-500",
    icon: Cpu,
  },
  {
    id: "analog",
    name: "Analog/Mixed-Signal",
    slug: "analog-mixed-signal",
    description: "Analog circuit design, ADCs, DACs, and mixed-signal integration",
    count: 89,
    color: "bg-purple-500",
    icon: Zap,
  },
  {
    id: "verification",
    name: "Verification",
    slug: "verification",
    description: "UVM, formal verification, simulation, and testbench development",
    count: 124,
    color: "bg-green-500",
    icon: MessageSquare,
  },
  {
    id: "physical-design",
    name: "Physical Design",
    slug: "physical-design",
    description: "Floorplanning, placement, routing, and timing closure",
    count: 98,
    color: "bg-orange-500",
    icon: Layout,
  },
  {
    id: "fpga",
    name: "FPGA",
    slug: "fpga",
    description: "FPGA development, prototyping, and vendor-specific tools",
    count: 201,
    color: "bg-cyan-500",
    icon: CircuitBoard,
  },
  {
    id: "open-source",
    name: "Open Source",
    slug: "open-source",
    description: "OpenLane, Caravel, DFFRAM, and other open-source silicon projects",
    count: 178,
    color: "bg-teal-500",
    icon: GitBranch,
  },
  {
    id: "jobs",
    name: "Jobs",
    slug: "jobs",
    description: "Job postings, career advice, and professional opportunities",
    count: 67,
    color: "bg-rose-500",
    icon: Briefcase,
  },
]

export const forumPosts: ForumPost[] = [
  {
    id: "1",
    title: "How to fix setup timing violations in OpenLane with tight constraints?",
    excerpt: "I'm working on a RISC-V core tapeout using OpenLane and facing persistent setup timing violations on critical paths...",
    content: "I'm working on a RISC-V core tapeout using OpenLane and facing persistent setup timing violations on critical paths. I've tried adjusting the clock period and synthesis strategies but can't seem to close timing. The violation is about 0.5ns on the ALU path. Has anyone dealt with similar issues? What strategies work best for timing closure in OpenLane?\n\nMy current configuration:\n- Clock period: 20ns\n- SYNTH_STRATEGY: AREA 0\n- Target density: 0.55\n\nAny help would be appreciated!",
    author: {
      id: "3",
      name: "Omar Khalil",
      avatar: "https://ui-avatars.com/api/?name=Omar+Khalil&background=10b981&color=fff",
    },
    category: "Open Source",
    tags: ["OpenLane", "timing", "RISC-V", "synthesis"],
    createdAt: "2026-03-14T10:30:00Z",
    replies: 8,
    views: 342,
    likes: 24,
    isPinned: true,
  },
  {
    id: "2",
    title: "Best practices for UVM verification of AXI interfaces?",
    excerpt: "I'm setting up a UVM testbench for a block with multiple AXI4 interfaces. Looking for recommendations...",
    content: "I'm setting up a UVM testbench for a block with multiple AXI4 interfaces. Looking for recommendations on structuring the verification environment, particularly around handling out-of-order responses and using coverage-driven verification effectively. Any recommended UVM libraries or methodologies?",
    author: {
      id: "4",
      name: "Layla Mansour",
      avatar: "https://ui-avatars.com/api/?name=Layla+Mansour&background=f59e0b&color=fff",
    },
    category: "Verification",
    tags: ["UVM", "AXI", "verification", "coverage"],
    createdAt: "2026-03-13T15:45:00Z",
    replies: 5,
    views: 218,
    likes: 15,
    isHot: true,
  },
  {
    id: "3",
    title: "SKY130 PDK: Recommended decap cell strategy for mixed-signal designs?",
    excerpt: "Working on a mixed-signal design using the SkyWater 130nm PDK. The digital portion is fairly large...",
    content: "Working on a mixed-signal design using the SkyWater 130nm PDK. The digital portion is fairly large and I'm concerned about IR drop affecting analog block performance. What's the recommended approach for decap cell insertion? Should I use the standard cells or custom capacitors for the analog sections?",
    author: {
      id: "2",
      name: "Fatima Al-Rashid",
      avatar: "https://ui-avatars.com/api/?name=Fatima+Al-Rashid&background=8b5cf6&color=fff",
    },
    category: "Analog",
    tags: ["SKY130", "mixed-signal", "PDK", "analog"],
    createdAt: "2026-03-12T09:20:00Z",
    replies: 3,
    views: 156,
    likes: 8,
  },
  {
    id: "4",
    title: "Chisel vs SystemVerilog for new RISC-V project?",
    excerpt: "Starting a new RISC-V implementation project and trying to decide between Chisel and SystemVerilog...",
    content: "Starting a new RISC-V implementation project and trying to decide between Chisel and SystemVerilog. The project needs to eventually go through OpenLane for tapeout. What are the pros and cons of each approach? I'm comfortable with both but want to make the right choice for maintainability and community contribution.",
    author: {
      id: "5",
      name: "Youssef Benali",
      avatar: "https://ui-avatars.com/api/?name=Youssef+Benali&background=ec4899&color=fff",
    },
    category: "Digital Design",
    tags: ["Chisel", "SystemVerilog", "RISC-V", "HDL"],
    createdAt: "2026-03-11T14:00:00Z",
    replies: 12,
    views: 489,
    likes: 32,
    isHot: true,
  },
  {
    id: "5",
    title: "Entry-level ASIC design positions in MENA region?",
    excerpt: "I'm graduating this summer with a focus on digital design. Looking for entry-level ASIC positions...",
    content: "I'm graduating this summer with a focus on digital design. I've completed the VSD-IAT workshop and have done one FPGA project. Looking for entry-level ASIC positions in the MENA region. Are there companies actively hiring? Open to relocation within the region. Any advice on what to focus on to improve my chances?",
    author: {
      id: "5",
      name: "Youssef Benali",
      avatar: "https://ui-avatars.com/api/?name=Youssef+Benali&background=ec4899&color=fff",
    },
    category: "Jobs",
    tags: ["jobs", "entry-level", "MENA", "career"],
    createdAt: "2026-03-10T11:30:00Z",
    replies: 7,
    views: 324,
    likes: 18,
  },
  {
    id: "6",
    title: "Power analysis methodology for sub-threshold designs",
    excerpt: "Working on an ultra-low-power IoT sensor chip targeting sub-threshold operation...",
    content: "Working on an ultra-low-power IoT sensor chip targeting sub-threshold operation. Traditional power analysis tools seem to struggle with accuracy at these voltage levels. What methodologies and tools do you recommend for accurate power estimation in sub-threshold designs?",
    author: {
      id: "6",
      name: "Nadia Zayed",
      avatar: "https://ui-avatars.com/api/?name=Nadia+Zayed&background=6366f1&color=fff",
    },
    category: "Physical Design",
    tags: ["power", "low-power", "sub-threshold", "IoT"],
    createdAt: "2026-03-09T16:15:00Z",
    replies: 4,
    views: 187,
    likes: 11,
  },
  {
    id: "7",
    title: "Welcome to ASIC Hub - Introduce Yourself!",
    excerpt: "Welcome to the ASIC Hub community! This is the place to introduce yourself and connect with fellow engineers...",
    content: "Welcome to the ASIC Hub community! This is the place to introduce yourself and connect with fellow engineers across the MENA region.\n\nTell us about:\n- Your background and experience level\n- What domains you work in (digital, analog, verification, etc.)\n- What you're hoping to learn or contribute\n- Any projects you're working on\n\nLooking forward to meeting everyone!",
    author: {
      id: "1",
      name: "Ahmed Hassan",
      avatar: "https://ui-avatars.com/api/?name=Ahmed+Hassan&background=0ea5e9&color=fff",
    },
    category: "Open Source",
    tags: ["introduction", "community", "welcome"],
    createdAt: "2026-03-01T09:00:00Z",
    replies: 45,
    views: 1250,
    likes: 89,
    isPinned: true,
  },
]

export const forumReplies: ForumReply[] = [
  {
    id: "1",
    postId: "1",
    content: "For OpenLane timing closure, I'd suggest a few approaches:\n\n1. Increase the clock period temporarily to see if the design can meet timing at all, then gradually tighten it.\n\n2. Use SYNTH_STRATEGY settings - try DELAY 4 for timing-critical designs.\n\n3. Check your floorplan - sometimes the ALU being placed far from register files causes long paths.\n\n4. Consider pipelining the critical path if architecture allows.\n\nI had a similar issue with a 0.4ns violation and solved it by adjusting the PL_TARGET_DENSITY to allow better placement flexibility.",
    author: {
      id: "1",
      name: "Ahmed Hassan",
      avatar: "https://ui-avatars.com/api/?name=Ahmed+Hassan&background=0ea5e9&color=fff",
    },
    createdAt: "2026-03-14T11:45:00Z",
    likes: 15,
    isAccepted: true,
  },
  {
    id: "2",
    postId: "1",
    content: "Adding to Ahmed's points - make sure you're using the latest OpenLane version. There were significant improvements in timing optimization in recent releases. Also, check if you're using CLOCK_UNCERTAINTY appropriately - sometimes it's set too conservatively for academic projects.",
    author: {
      id: "6",
      name: "Nadia Zayed",
      avatar: "https://ui-avatars.com/api/?name=Nadia+Zayed&background=6366f1&color=fff",
    },
    createdAt: "2026-03-14T13:20:00Z",
    likes: 8,
  },
  {
    id: "3",
    postId: "2",
    content: "For AXI UVM verification, I highly recommend checking out the PULP Platform's AXI verification IPs - they're well-structured and handle most edge cases. For out-of-order handling:\n\n1. Use a scoreboard with ID-based tracking\n2. Implement response reordering queues per ID\n3. Cover all possible ordering scenarios with functional coverage\n\nHappy to share some code snippets if you'd like!",
    author: {
      id: "1",
      name: "Ahmed Hassan",
      avatar: "https://ui-avatars.com/api/?name=Ahmed+Hassan&background=0ea5e9&color=fff",
    },
    createdAt: "2026-03-13T17:00:00Z",
    likes: 12,
    isAccepted: true,
  },
  {
    id: "4",
    postId: "4",
    content: "I've used both extensively. Here's my take:\n\nSystemVerilog pros:\n- Direct synthesis support in all tools\n- Wider industry adoption\n- Better for mixed simulation/synthesis flows\n\nChisel pros:\n- More expressive for parameterized designs\n- Better code reuse patterns\n- Scala ecosystem for generators\n\nFor OpenLane specifically, both work fine since you'll be generating Verilog either way. If you want community contributions, SystemVerilog might be more accessible to a wider audience.",
    author: {
      id: "6",
      name: "Nadia Zayed",
      avatar: "https://ui-avatars.com/api/?name=Nadia+Zayed&background=6366f1&color=fff",
    },
    createdAt: "2026-03-11T16:30:00Z",
    likes: 21,
  },
]

export type OpenSourceProject = {
  id: string
  name: string
  description: string
  longDescription: string
  url: string
  category: "flow" | "ip" | "pdk" | "tool" | "soc"
  stars: number
  contributors: number
  tags: string[]
  featured?: boolean
}

export const openSourceProjectsList: OpenSourceProject[] = [
  {
    id: "caravel",
    name: "Caravel",
    description: "A template SoC for Google-funded shuttle runs through Efabless",
    longDescription: "Caravel is a template SoC designed for use with the Google-sponsored shuttle program through Efabless. It provides a standardized wrapper with GPIO, SPI, UART, and power management, allowing designers to focus on their custom logic in a user project area.",
    url: "https://github.com/efabless/caravel",
    category: "soc",
    stars: 1200,
    contributors: 45,
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
    stars: 2500,
    contributors: 120,
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
    stars: 450,
    contributors: 15,
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
    stars: 1800,
    contributors: 85,
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
    stars: 3200,
    contributors: 250,
    tags: ["Synthesis", "Verilog", "FPGA", "ASIC"],
  },
  {
    id: "sky130-pdk",
    name: "SKY130 PDK",
    description: "SkyWater Technology 130nm open-source PDK",
    longDescription: "The SkyWater Open Source PDK is a collaboration between Google and SkyWater Technology Foundry to provide a fully open source Process Design Kit for the SKY130 130nm process node.",
    url: "https://github.com/google/skywater-pdk",
    category: "pdk",
    stars: 2800,
    contributors: 60,
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
    stars: 650,
    contributors: 25,
    tags: ["PDK", "180nm", "GlobalFoundries", "MCU"],
  },
  {
    id: "verilator",
    name: "Verilator",
    description: "Fast Verilog/SystemVerilog simulator",
    longDescription: "Verilator is the fastest free Verilog HDL simulator. It compiles synthesizable Verilog into multithreaded C++ or SystemC code for execution. It's commonly used for large-scale simulation and verification.",
    url: "https://github.com/verilator/verilator",
    category: "tool",
    stars: 2400,
    contributors: 180,
    tags: ["Simulation", "Verilog", "SystemVerilog", "C++"],
  },
  {
    id: "magic",
    name: "Magic VLSI",
    description: "VLSI layout tool for DRC, extraction, and GDS",
    longDescription: "Magic is a venerable VLSI layout tool, written in the 1980s at Berkeley. It has been extensively updated and is now used for DRC checking, parasitic extraction, and GDS generation in modern open-source flows.",
    url: "https://github.com/RTimothyEdwards/magic",
    category: "tool",
    stars: 800,
    contributors: 30,
    tags: ["Layout", "DRC", "Extraction", "GDS"],
  },
  {
    id: "cocotb",
    name: "cocotb",
    description: "Coroutine-based cosimulation testbench for HDL",
    longDescription: "cocotb is a coroutine-based cosimulation testbench environment for verifying VHDL and Verilog RTL using Python. It provides a powerful and productive way to write testbenches.",
    url: "https://github.com/cocotb/cocotb",
    category: "tool",
    stars: 1900,
    contributors: 150,
    tags: ["Verification", "Python", "Testbench", "Simulation"],
  },
  {
    id: "picorv32",
    name: "PicoRV32",
    description: "Size-optimized RISC-V CPU core",
    longDescription: "PicoRV32 is a CPU core that implements the RISC-V RV32IMC instruction set. It is designed to be small and efficient, making it ideal for FPGA and ASIC implementations where area is constrained.",
    url: "https://github.com/YosysHQ/picorv32",
    category: "ip",
    stars: 2100,
    contributors: 40,
    tags: ["RISC-V", "CPU", "RV32IMC", "Compact"],
  },
  {
    id: "vexriscv",
    name: "VexRiscv",
    description: "SpinalHDL-based RISC-V CPU core",
    longDescription: "VexRiscv is a RISC-V implementation written in SpinalHDL. It's highly configurable and supports various ISA extensions. The core can be tuned from a small embedded processor to a high-performance Linux-capable system.",
    url: "https://github.com/SpinalHDL/VexRiscv",
    category: "ip",
    stars: 2300,
    contributors: 55,
    tags: ["RISC-V", "SpinalHDL", "CPU", "Configurable"],
  },
]

export const projectCategories = [
  { value: "all", label: "All Projects" },
  { value: "flow", label: "Design Flows" },
  { value: "ip", label: "IP Cores" },
  { value: "pdk", label: "PDKs" },
  { value: "tool", label: "Tools" },
  { value: "soc", label: "SoCs" },
]

export const domains = [
  "Digital Design",
  "Analog",
  "Mixed-Signal",
  "Verification",
  "Physical Design",
  "FPGA",
]

export const tools = [
  "OpenLane",
  "Vivado",
  "Quartus",
  "Design Compiler",
  "Innovus",
  "VCS",
  "Verilator",
  "Yosys",
  "Cadence Virtuoso",
  "Spectre",
  "HSPICE",
  "ICC2",
  "PrimeTime",
  "Questa",
  "UVM",
]

export const languages = [
  "Verilog",
  "SystemVerilog",
  "Chisel",
  "Python",
  "Tcl",
  "C++",
  "VHDL",
  "Perl",
  "SKILL",
]

export const experienceLevels = [
  { value: "student", label: "Student" },
  { value: "junior", label: "Junior (0-2 years)" },
  { value: "mid", label: "Mid (3-5 years)" },
  { value: "senior", label: "Senior (6+ years)" },
]

export const lookingForOptions = [
  "Jobs",
  "Freelance opportunities",
  "Learning",
  "Mentoring",
  "Projects to contribute to",
]

export const areasOfInterest = [
  "RISC-V",
  "AI accelerators",
  "Security",
  "Low-power design",
  "Computer architecture",
  "Open-source silicon",
  "GPU design",
  "Biomedical circuits",
  "IoT",
  "Formal verification",
  "3D IC",
  "Advanced nodes",
]

export const processNodes = [
  "180nm",
  "130nm",
  "90nm",
  "65nm",
  "45nm",
  "40nm",
  "28nm",
  "22nm",
  "14nm",
  "7nm",
  "5nm",
]

export const countries = [
  "Egypt",
  "UAE",
  "Saudi Arabia",
  "Jordan",
  "Lebanon",
  "Morocco",
  "Tunisia",
  "Algeria",
  "Kuwait",
  "Qatar",
  "Bahrain",
  "Oman",
  "Iraq",
  "Palestine",
  "Libya",
  "Sudan",
  "Yemen",
  "Syria",
]
