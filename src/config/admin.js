export const CLIENT_ADMIN_EMAIL =
  import.meta.env.VITE_ADMIN_EMAIL?.trim().toLowerCase() ?? ""

export const LEAD_STATUSES = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "intro_scheduled", label: "Intro scheduled" },
  { value: "proposal_sent", label: "Proposal sent" },
  { value: "closed_won", label: "Closed won" },
  { value: "closed_lost", label: "Closed lost" },
  { value: "archived", label: "Archived" },
]

const STATUS_STYLE_MAP = {
  new: {
    badge: "border-cyan-400/25 bg-cyan-500/10 text-cyan-100",
    select: "border-cyan-400/30 bg-cyan-500/10 text-cyan-50",
  },
  contacted: {
    badge: "border-indigo-400/25 bg-indigo-500/10 text-indigo-100",
    select: "border-indigo-400/30 bg-indigo-500/10 text-indigo-50",
  },
  intro_scheduled: {
    badge: "border-violet-400/25 bg-violet-500/10 text-violet-100",
    select: "border-violet-400/30 bg-violet-500/10 text-violet-50",
  },
  proposal_sent: {
    badge: "border-amber-400/25 bg-amber-500/10 text-amber-100",
    select: "border-amber-400/30 bg-amber-500/10 text-amber-50",
  },
  closed_won: {
    badge: "border-emerald-400/25 bg-emerald-500/10 text-emerald-100",
    select: "border-emerald-400/30 bg-emerald-500/10 text-emerald-50",
  },
  closed_lost: {
    badge: "border-rose-400/25 bg-rose-500/10 text-rose-100",
    select: "border-rose-400/30 bg-rose-500/10 text-rose-50",
  },
  archived: {
    badge: "border-white/10 bg-white/[0.04] text-white/55",
    select: "border-white/10 bg-white/[0.04] text-white/60",
  },
}

const LEGACY_STATUS_ALIASES = {
  intake_submitted: "new",
  discovery_pending: "intro_scheduled",
}

export function normalizeLeadStatus(status) {
  if (!status) {
    return "new"
  }

  return LEGACY_STATUS_ALIASES[status] ?? status
}

export function getLeadStatusLabel(status) {
  const normalized = normalizeLeadStatus(status)
  const match = LEAD_STATUSES.find((entry) => entry.value === normalized)

  if (match) {
    return match.label
  }

  return status
}

export function getLeadStatusStyles(status, variant = "select") {
  const normalized = normalizeLeadStatus(status)
  const styles = STATUS_STYLE_MAP[normalized]

  if (!styles) {
    return variant === "badge"
      ? "border-white/10 bg-white/[0.04] text-white/70"
      : "border-white/10 bg-black/30 text-white"
  }

  return styles[variant]
}

export function isApprovedAdminEmail(email) {
  if (!CLIENT_ADMIN_EMAIL || !email) {
    return false
  }

  return email.trim().toLowerCase() === CLIENT_ADMIN_EMAIL
}

export function buildLeadMetrics(leads) {
  const total = leads.length
  const newCount = leads.filter(
    (lead) => normalizeLeadStatus(lead.status) === "new",
  ).length
  const contactedCount = leads.filter(
    (lead) => normalizeLeadStatus(lead.status) === "contacted",
  ).length
  const closedWonCount = leads.filter(
    (lead) => normalizeLeadStatus(lead.status) === "closed_won",
  ).length
  const conversionRate = total > 0 ? Math.round((closedWonCount / total) * 100) : 0

  return {
    total,
    newCount,
    contactedCount,
    closedWonCount,
    conversionRate,
  }
}
