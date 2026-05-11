export const projects = [
  {
    name: "TrackoraHQ",
    tagline: "Operations command center for distributed field teams",
    category: "Operations Platform",
    description:
      "A unified HQ for dispatch, job tracking, and live team visibility—built to replace fragmented tools with one fast control surface.",
    stack: ["React Native", "Node", "Realtime"],
    theme: {
      gradient: "from-indigo-600 via-violet-600 to-fuchsia-600",
      glow: "rgba(99, 102, 241, 0.35)",
      panel: "from-slate-900 to-indigo-950",
    },
    metrics: [
      { label: "Dispatch time", value: "-38%" },
      { label: "Active crews", value: "120+" },
    ],
  },
  {
    name: "TrackoraAI",
    tagline: "AI layer for scheduling, routing, and field intelligence",
    category: "AI Automation",
    description:
      "Predictive scheduling and natural-language ops queries layered on top of live field data—less manual coordination, fewer missed windows.",
    stack: ["OpenAI", "Vector DB", "Edge APIs"],
    theme: {
      gradient: "from-cyan-500 via-sky-500 to-blue-600",
      glow: "rgba(34, 211, 238, 0.3)",
      panel: "from-slate-950 to-cyan-950",
    },
    metrics: [
      { label: "Manual triage", value: "-52%" },
      { label: "SLA adherence", value: "96%" },
    ],
  },
  {
    name: "Ummah",
    tagline: "Community platform with events, giving, and member care",
    category: "Mobile + Web",
    description:
      "A member-first app pairing prayer times, community events, and secure giving with admin tools that stay simple for volunteers.",
    stack: ["Flutter", "Firebase", "Stripe"],
    theme: {
      gradient: "from-emerald-500 via-teal-500 to-green-600",
      glow: "rgba(16, 185, 129, 0.28)",
      panel: "from-emerald-950 to-slate-950",
    },
    metrics: [
      { label: "Monthly active", value: "18k" },
      { label: "App store", value: "4.9★" },
    ],
  },
  {
    name: "Brightscape CRM",
    tagline: "Pipeline CRM tuned for service businesses",
    category: "CRM & Dashboards",
    description:
      "Lead intake, follow-up automation, and revenue forecasting in a CRM that mirrors how owners actually sell—not generic enterprise bloat.",
    stack: ["Next.js", "Postgres", "Automations"],
    theme: {
      gradient: "from-amber-400 via-orange-500 to-rose-500",
      glow: "rgba(251, 146, 60, 0.28)",
      panel: "from-orange-950 to-slate-950",
    },
    metrics: [
      { label: "Close rate", value: "+24%" },
      { label: "Admin hours", value: "-11/wk" },
    ],
  },
]
