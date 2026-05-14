export const projects = [
  {
    name: "Ummah",
    tagline: "Short-form social platform for web and mobile, built to scale",
    category: "Consumer Social Platform",
    badge: "Live Beta",
    description:
      "Short-form social platform built with a TypeScript React architecture (Vite), Supabase as the primary backend for data and realtime services, and Capacitor-powered mobile deployment from the same product surface. Firebase Cloud Messaging provides native push infrastructure—complementing Supabase, not replacing it as the core platform backend.",
    highlights: [
      "Realtime feeds and engagement-ready surfaces",
      "Capacitor-powered mobile deployment alongside responsive web",
      "Supabase-backed persistence and scalable backend orchestration",
      "Native push delivery via Firebase Cloud Messaging (FCM)",
    ],
    links: [
      { label: "View Website", href: "https://theummah.app" },
      {
        label: "iOS TestFlight",
        href: "https://testflight.apple.com/join/eCgEaCGV",
      },
    ],
    stack: [
      "TypeScript",
      "React",
      "Vite",
      "Supabase",
      "Capacitor",
      "Tailwind CSS",
      "TanStack Query",
    ],
    theme: {
      gradient: "from-emerald-500 via-teal-500 to-green-600",
      glow: "rgba(16, 185, 129, 0.28)",
      panel: "from-emerald-950 to-slate-950",
    },
  },
  {
    name: "TrackoraAI",
    tagline: "AI workflow and coaching platform with full product plumbing",
    category: "AI Workflow Tool",
    badge: "Live Platform",
    description:
      "AI-powered coaching and workflow platform with subscriptions, authentication, and mobile and web support.",
    highlights: [
      "AI-generated coaching forms",
      "Subscription and payment flow",
      "User authentication",
      "Web and mobile access",
    ],
    links: [
      { label: "View Platform", href: "https://trackoraai.com" },
      {
        label: "iOS TestFlight",
        href: "https://testflight.apple.com/join/Gk5dcwds",
      },
    ],
    stack: ["React", "Vite", "Supabase", "Stripe", "Render", "OpenAI", "TestFlight"],
    theme: {
      gradient: "from-cyan-500 via-sky-500 to-blue-600",
      glow: "rgba(34, 211, 238, 0.3)",
      panel: "from-slate-950 to-cyan-950",
    },
  },
  {
    slug: "trackora-hq",
    name: "TrackoraHQ",
    tagline: "Private internal tool for sales operations and field visibility",
    category: "Sales Analytics Dashboard",
    badge: "Private case study",
    /** No public URLs — portfolio-only reference. */
    privateCaseStudy: true,
    /** Hard lock: never render TestFlight / download CTAs for this entry. */
    publicLinksAllowed: false,
    description:
      "Private internal analytics and reporting workspace for sales operations—role-based views, goal tracking, and operational signals tailored to client workflows. Not publicly distributed; client-internal environment only.",
    highlights: [
      "Role-based performance and reporting views",
      "Goals and pipeline visibility for the field",
      "Operational dashboards for teams",
      "Controlled access for approved internal stakeholders",
    ],
    links: [],
    privateCaseStudyFootnote: "Private internal operations platform",
    stackLabel: "Internal stack",
    stack: [
      "React Native",
      "Analytics Systems",
      "Operational Dashboards",
      "Internal Tooling",
    ],
    theme: {
      gradient: "from-amber-400 via-orange-500 to-rose-500",
      glow: "rgba(251, 146, 60, 0.28)",
      panel: "from-orange-950 to-slate-950",
    },
  },
  {
    name: "Stackless",
    tagline: "Contractor CRM, dispatch, and operations in one system",
    category: "Contractor CRM & Dispatch Platform",
    badge: "Active Prototype",
    description:
      "CRM, dispatch, and all-in-one operations platform for general contractors to manage contacts, jobs, schedules, and field workflows.",
    highlights: [
      "Contractor CRM",
      "Job dispatching",
      "Scheduling workflows",
      "All-in-one business operations tools",
    ],
    links: [
      { label: "View Platform", href: "https://stack-less.vercel.app/" },
      {
        label: "iOS TestFlight",
        href: "https://testflight.apple.com/join/zbvZPNHE",
      },
    ],
    stack: [
      "React",
      "Vite",
      "Supabase",
      "CRM Systems",
      "Dispatch Workflows",
      "Operations Management",
    ],
    theme: {
      gradient: "from-violet-500 via-purple-500 to-fuchsia-600",
      glow: "rgba(168, 85, 247, 0.28)",
      panel: "from-violet-950 to-slate-950",
    },
  },
]
