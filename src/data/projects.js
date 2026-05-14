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
    tagline: "AI coaching SaaS with billing, auth, and managed OpenAI delivery",
    category: "AI Workflow Tool",
    badge: "Live Platform",
    description:
      "AI-powered coaching platform built with a TypeScript React frontend (Vite), Supabase Auth and Postgres, and a Node/Express API that powers OpenAI generation, Stripe subscriptions, and webhook-based billing sync. Web-first product with an optional mobile path—subscription SaaS infrastructure, not a thin AI wrapper.",
    highlights: [
      "OpenAI-powered coaching and session generation",
      "Stripe Checkout, subscriptions, and webhook-driven billing sync",
      "Supabase Auth with Postgres-backed profiles and plan-aware access",
      "Protected Node/Express API layer for quotas, limits, and secure delivery",
    ],
    links: [
      { label: "View Platform", href: "https://trackoraai.com" },
      {
        label: "iOS TestFlight",
        href: "https://testflight.apple.com/join/Gk5dcwds",
      },
    ],
    stack: [
      "TypeScript",
      "React",
      "Vite",
      "Supabase",
      "Node.js",
      "Express",
      "Stripe",
      "OpenAI",
    ],
    theme: {
      gradient: "from-cyan-500 via-sky-500 to-blue-600",
      glow: "rgba(34, 211, 238, 0.3)",
      panel: "from-slate-950 to-cyan-950",
    },
  },
  {
    slug: "trackora-hq",
    name: "TrackoraHQ",
    tagline: "Private internal operations platform—local-first dashboards and mobile delivery",
    category: "Internal Operations Platform",
    badge: "Private Case Study",
    /** No public URLs — portfolio-only reference. */
    privateCaseStudy: true,
    /** Hard lock: never render TestFlight / download CTAs for this entry. */
    publicLinksAllowed: false,
    description:
      "Private internal operations platform built for mobile sales performance visibility, operational pacing, and field execution workflows. Local-first architecture with rich operational dashboards—client-internal deployment only, with no public or multi-tenant SaaS surface.",
    highlights: [
      "Local-first operational dashboards",
      "Mobile-first performance visibility for the field",
      "Projection and pacing surfaces aligned to execution workflows",
      "Cross-platform mobile delivery with Capacitor",
    ],
    links: [],
    privateCaseStudyFootnote: "Private internal operations platform",
    stackLabel: "Internal stack",
    stack: [
      "React",
      "TypeScript",
      "Vite",
      "Capacitor",
      "Local-first Architecture",
      "Operational Dashboards",
      "Cross-platform Mobile",
    ],
    theme: {
      gradient: "from-amber-400 via-orange-500 to-rose-500",
      glow: "rgba(251, 146, 60, 0.28)",
      panel: "from-orange-950 to-slate-950",
    },
  },
  {
    name: "Stackless",
    tagline: "Contractor CRM, dispatch, scheduling, and field operations in one platform",
    category: "Contractor CRM & Dispatch Platform",
    badge: "Active Prototype",
    description:
      "Contractor CRM and field operations platform for managing customers, crews, jobs, dispatch, and schedules in one workflow. Built with a typed React/Vite frontend, Supabase Auth and Postgres with RLS, multi-tenant operations data, Stripe billing, and a Node/Express integration layer.",
    highlights: [
      "Multi-tenant customer, crew, and job management",
      "Job dispatch, assignments, and scheduling workflows",
      "Field verification with checklists and proof photo support",
      "Supabase Auth, Postgres, RLS, and storage-backed workflows",
      "Stripe billing, customer portal, and crew invites via email/SMS",
    ],
    links: [
      { label: "View Platform", href: "https://stack-less.vercel.app/" },
      {
        label: "iOS TestFlight",
        href: "https://testflight.apple.com/join/zbvZPNHE",
      },
    ],
    stack: [
      "TypeScript",
      "React",
      "Vite",
      "Supabase",
      "Multi-tenant Data Model",
      "Job Dispatch",
      "Stripe Billing",
      "Node/Express",
      "Capacitor Mobile",
      "Field Verification",
    ],
    theme: {
      gradient: "from-violet-500 via-purple-500 to-fuchsia-600",
      glow: "rgba(168, 85, 247, 0.28)",
      panel: "from-violet-950 to-slate-950",
    },
  },
]
