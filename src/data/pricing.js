export const pricingIntro =
  "Indicative floors for how Bryant Labs typically scopes work—not fixed SKUs. Final investment depends on your requirements, integrations, and timeline; scope and implementation alignment are settled before any build commitment."

/** Short editorial note under the heading (milestone model + scoping). */
export const pricingEngagementNote =
  "Engagements are milestone-based. Scope and technical requirements determine final pricing. Discovery and planning sessions inform estimates and are credited toward kickoff when you proceed with a build."

export const pricingTiers = [
  {
    id: "mvp",
    variant: "build",
    name: "Scoped MVP Engagements",
    price: "Starting from $1,000+",
    priceNote: "Indicative starting point",
    description:
      "Single-platform MVPs scoped for validation and launch—features, platforms, and depth priced to your brief.",
    features: [
      "Discovery-informed scope before kickoff",
      "Mobile or web MVP tailored to validation goals",
      "Deployment and handoff aligned to your milestone plan",
    ],
    highlighted: false,
  },
  {
    id: "systems",
    variant: "build",
    name: "Custom Internal Systems",
    price: "Engagements starting from $3,000+",
    priceNote: "Typical entry for scoped systems work",
    description:
      "Internal tools, dashboards, and automation tailored to operational workflows—phased delivery, not a one-size catalog.",
    features: [
      "Workflows, roles, and integrations mapped to your stack",
      "Reporting and data paths designed for how you operate",
      "Milestone reviews so scope stays aligned with reality",
    ],
    highlighted: true,
  },
  {
    id: "retainer",
    variant: "retainer",
    name: "Retainer & Ongoing Support",
    price: "Tailored monthly",
    priceNote: "Partnership after launch",
    description:
      "Post-build iteration, reliability, and prioritized access—separate from project milestones, structured as a retainer or agreed hour blocks.",
    features: [
      "Roadmap-aware improvements and small enhancements",
      "Release, monitoring, and incident support as agreed",
      "Flexible cadence so capacity matches your season",
    ],
    highlighted: false,
  },
]
