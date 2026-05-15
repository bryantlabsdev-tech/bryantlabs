export const pricingSectionEyebrow = "Scoped engagements"

export const pricingSectionTitle = "How engagements are priced"

export const pricingIntro =
  "Reference bands—not shopping-cart SKUs. A quote follows fit review and implementation planning, with scope, integrations, and milestones explicit before you commit to build work."

/** Primary narrative — one path, not three packages. */
export const pricingPrimaryPathTitle = "One engagement model"

export const pricingPrimaryPathBody =
  "Bryant Labs scopes milestone-based work to your constraints. Investment reflects surface area, integrations, and operational depth—not a tier label. Retainers are separate from project milestones and only apply once a core build is live."

/** Bridges price browsing to staged intake. */
export const pricingToIntakeBridge =
  "Start with a short brief below—we align on scope and timeline before estimating. Deeper implementation planning (including optional paid discovery) comes only after that first pass."

/** Calm operational framing under the heading. */
export const pricingEngagementNote =
  "Work moves in milestones with approvals between phases. Discovery and strategy exist only when requirements need depth—they inform estimates and credit toward kickoff when you proceed."

/** Centered callout above the bridge (sets tone before numbers). */
export const pricingMilestoneAlignmentEyebrow = "Milestone alignment & estimates"

/** Non-metric example phasing—truthful variance note in UI. */
export const pricingMilestoneExampleIntro =
  "Illustrative phasing (each engagement varies): how investment maps to delivery phases."

export const pricingMilestoneExamplePhases = [
  "Early: discovery, scope, and system planning",
  "Core build: implementation sprint aligned to milestones",
  "Close: testing, handoff, and launch support",
]

export const pricingMilestoneExampleTitle = "Reference phasing"

/** Sets expectation for first human reply—no SLA fabrication. */
export const pricingFirstReplyEyebrow = "First reply"

export const pricingFirstReplyPromise =
  "After your brief, expect a direct email reply—not a generic drip. We lead with a fit read and concrete next actions (questions, a short intro when useful, or a scoped discovery suggestion only if estimates need more definition first)."

/** Head for the reference band list inside the primary card. */
export const pricingReferenceBandsTitle = "Reference investment bands"

/** Grounds bands vs final quotes—same line as CTA rail. */
export const pricingBandsDisclaimer =
  "Final pricing follows scope, integrations, and timeline—not the band alone."

/** Drives narrative layout (not equal “product” cards). */
export const pricingTiers = [
  {
    id: "mvp",
    variant: "build",
    name: "Scoped MVP engagements",
    price: "Starting from $1,000+",
    priceNote: "Reference floor",
    description:
      "Single-surface products scoped for validation—depth and integrations priced to your brief.",
    features: [
      "Implementation planning before kickoff",
      "Mobile or web MVP aligned to your milestone plan",
      "Deploy-ready handoff when the scoped slice is done",
    ],
    highlighted: false,
  },
  {
    id: "systems",
    variant: "build",
    name: "Custom internal systems",
    price: "Engagements starting from $3,000+",
    priceNote: "Typical entry for scoped systems work",
    description:
      "Dashboards, workflows, and automation mapped to how you operate—phased delivery, not a catalog SKU.",
    features: [
      "Roles, data paths, and integrations grounded in your stack",
      "Reporting surfaces matched to operational reality",
      "Milestone checkpoints so scope stays aligned with the work",
    ],
    highlighted: true,
  },
  {
    id: "retainer",
    variant: "retainer",
    name: "Retainer & ongoing support",
    price: "Tailored monthly",
    priceNote: "After launch",
    description:
      "Iteration, reliability, and prioritized access once the core build is live—structured as a retainer or agreed hour blocks.",
    features: [
      "Roadmap-aware improvements and small enhancements",
      "Release and incident support as agreed",
      "Cadence matched to your season—not a generic block",
    ],
    highlighted: false,
  },
]
