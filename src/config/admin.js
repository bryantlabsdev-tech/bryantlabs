export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL?.trim().toLowerCase() ?? ""

export const LEAD_STATUSES = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "intro_scheduled", label: "Intro scheduled" },
  { value: "discovery_pending", label: "Discovery pending" },
  { value: "proposal_sent", label: "Proposal sent" },
  { value: "closed_won", label: "Closed won" },
  { value: "closed_lost", label: "Closed lost" },
  { value: "archived", label: "Archived" },
]

export function isApprovedAdminEmail(email) {
  if (!ADMIN_EMAIL || !email) {
    return false
  }

  return email.trim().toLowerCase() === ADMIN_EMAIL
}
