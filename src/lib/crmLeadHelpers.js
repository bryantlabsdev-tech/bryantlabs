import { normalizeLeadStatus } from "../config/admin"

const MS_DAY = 24 * 60 * 60 * 1000

function startOfLocalDay(d) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x.getTime()
}

export function isFollowUpOverdue(lead) {
  if (!lead?.next_follow_up_at) {
    return false
  }

  return startOfLocalDay(lead.next_follow_up_at) < startOfLocalDay(new Date())
}

export function formatFollowUpLine(lead) {
  if (!lead?.next_follow_up_at) {
    return null
  }

  const target = startOfLocalDay(lead.next_follow_up_at)
  const today = startOfLocalDay(new Date())
  const diffDays = Math.round((target - today) / MS_DAY)

  if (diffDays < 0) {
    return "Follow-up overdue"
  }

  if (diffDays === 0) {
    return "Follow up today"
  }

  if (diffDays === 1) {
    return "Follow up tomorrow"
  }

  const dayName = new Intl.DateTimeFormat(undefined, { weekday: "long" }).format(
    new Date(lead.next_follow_up_at),
  )

  if (diffDays < 7) {
    return `Follow up ${dayName}`
  }

  return `Follow up ${new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(new Date(lead.next_follow_up_at))}`
}

export function formatLastContactedLine(lead) {
  if (!lead?.last_contacted_at) {
    return "Not contacted yet"
  }

  const then = new Date(lead.last_contacted_at).getTime()
  const now = Date.now()
  const diffMs = now - then
  const diffDays = Math.floor(diffMs / MS_DAY)

  if (diffDays <= 0) {
    const diffHours = Math.floor(diffMs / (60 * 60 * 1000))

    if (diffHours <= 0) {
      const diffMins = Math.floor(diffMs / (60 * 1000))
      return diffMins <= 1 ? "Last contacted just now" : `Last contacted ${diffMins}m ago`
    }

    return `Last contacted ${diffHours}h ago`
  }

  if (diffDays === 1) {
    return "Last contacted yesterday"
  }

  return `Last contacted ${diffDays} days ago`
}

export function getLeadNextAction(lead) {
  if (!lead) {
    return ""
  }

  if (isFollowUpOverdue(lead)) {
    return "Follow up overdue"
  }

  const status = normalizeLeadStatus(lead.status)

  if (status === "closed_won") {
    return "Won — finalize handoff"
  }

  if (status === "closed_lost") {
    return "Lost — close out"
  }

  if (status === "archived") {
    return "Archived"
  }

  if (status === "proposal_sent") {
    return "Awaiting proposal response"
  }

  if (!lead.intro_link_sent_at && (status === "new" || status === "contacted")) {
    return "Send intro link"
  }

  if (
    lead.intro_link_sent_at &&
    (status === "new" ||
      status === "contacted" ||
      status === "intro_scheduled")
  ) {
    return "Waiting on response"
  }

  if (status === "intro_scheduled" && !lead.intro_link_sent_at) {
    return "Schedule intro"
  }

  return "Review lead"
}

export function getLeadSurfaceBadges(lead) {
  if (!lead) {
    return []
  }

  const badges = []
  const status = normalizeLeadStatus(lead.status)

  if (lead.intro_link_sent_at) {
    badges.push({ key: "intro_sent", label: "Intro sent", tone: "violet" })
  }

  if (isFollowUpOverdue(lead)) {
    badges.push({ key: "overdue", label: "Overdue", tone: "rose" })
  }

  if (status === "closed_won") {
    badges.push({ key: "won", label: "Won", tone: "emerald" })
  } else if (status === "closed_lost") {
    badges.push({ key: "lost", label: "Lost", tone: "rose" })
  } else if (status === "proposal_sent") {
    badges.push({ key: "proposal", label: "Proposal sent", tone: "amber" })
  } else if (status === "contacted") {
    badges.push({ key: "reviewing", label: "Reviewing", tone: "indigo" })
  } else if (status === "intro_scheduled") {
    badges.push({ key: "intro_s", label: "Intro scheduled", tone: "violet" })
  } else if (status === "archived") {
    badges.push({ key: "archived", label: "Archived", tone: "neutral" })
  } else {
    badges.push({ key: "new", label: "New", tone: "cyan" })
  }

  return badges
}

export function formatUpdatedAtLine(lead) {
  if (!lead?.updated_at) {
    return null
  }

  return `Record updated ${new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(lead.updated_at))}`
}
