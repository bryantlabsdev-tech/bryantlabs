import {
  Code2,
  Smartphone,
  Building2,
  Rocket,
  Workflow,
  LayoutDashboard,
  Layers,
} from "lucide-react"

export const services = [
  {
    title: "Engineered product systems",
    description:
      "Purpose-built software aligned to your operations—clear domains, APIs where they belong, and deployment paths that match how your team ships.",
    icon: Code2,
    accent: "from-violet-500/20 to-indigo-500/5",
  },
  {
    title: "Web & native client surfaces",
    description:
      "Responsive web and native-capable clients from a coherent product core—performance, access control, and release cadence treated as first-class concerns.",
    icon: Smartphone,
    accent: "from-cyan-500/20 to-blue-500/5",
  },
  {
    title: "Internal operations platforms",
    description:
      "Portals, role-based tools, and workflow software for how work actually moves—replacing ad-hoc spreadsheets with accountable, auditable systems.",
    icon: Building2,
    accent: "from-emerald-500/20 to-teal-500/5",
  },
  {
    title: "SaaS infrastructure & monetization",
    description:
      "Subscription-ready foundations: authentication, entitlements, Stripe-aware billing hooks, and data models that can grow past the first release.",
    icon: Rocket,
    accent: "from-indigo-500/20 to-purple-500/5",
  },
  {
    title: "Automation & integration layers",
    description:
      "Reliable orchestration across APIs, webhooks, and human approvals—background jobs and guardrails so operational work stops living in inboxes.",
    icon: Workflow,
    accent: "from-amber-500/20 to-orange-500/5",
  },
  {
    title: "Operational dashboards & reporting",
    description:
      "Tailored visibility for leadership and operators—pipelines, KPIs, and drill-downs grounded in your data model, not generic chart widgets.",
    icon: LayoutDashboard,
    accent: "from-rose-500/20 to-pink-500/5",
  },
  {
    title: "Customer & member product experiences",
    description:
      "Polished customer-facing apps, member areas, and digital touchpoints with the same engineering discipline as internal systems—on brand, on policy, on scale.",
    icon: Layers,
    accent: "from-sky-500/20 to-indigo-500/5",
  },
]
