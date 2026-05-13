import { ANALYTICS_EVENTS } from "./analytics"

/**
 * Maps raw router paths to founder-friendly place names.
 */
export function placeLabelFromPath(pagePath) {
  if (!pagePath || typeof pagePath !== "string") {
    return "Site"
  }

  const raw = pagePath.trim()
  const lower = raw.toLowerCase()
  const hash = lower.includes("#") ? lower.slice(lower.indexOf("#")) : ""
  const pathOnly = lower.split("#")[0].split("?")[0] || "/"

  if (pathOnly.startsWith("/admin/login")) {
    return "Admin login"
  }

  if (pathOnly.startsWith("/admin")) {
    return "Admin dashboard"
  }

  if (pathOnly === "/privacy") {
    return "Privacy policy"
  }

  if (pathOnly === "/terms") {
    return "Terms of service"
  }

  if (hash.includes("#contact")) {
    return "Project intake"
  }

  if (hash.includes("#work")) {
    return "Portfolio"
  }

  if (hash.includes("#services")) {
    return "Services"
  }

  if (hash.includes("#pricing")) {
    return "Pricing"
  }

  if (hash.includes("#support")) {
    return "Support & care"
  }

  if (pathOnly === "/" || pathOnly === "") {
    return "Homepage"
  }

  return "Other pages"
}

export function buildSectionTraffic(pageViewEvents) {
  const counts = new Map()

  for (const event of pageViewEvents) {
    const label = placeLabelFromPath(event.page_path)
    counts.set(label, (counts.get(label) ?? 0) + 1)
  }

  const rows = [...counts.entries()].map(([label, count]) => ({ label, count }))
  rows.sort((a, b) => b.count - a.count)
  return rows
}

function shortCtaLabel(metadata) {
  if (!metadata || typeof metadata !== "object") {
    return ""
  }

  const label = String(metadata.cta_label ?? "").trim()

  if (!label) {
    return ""
  }

  if (label.length > 48) {
    return `${label.slice(0, 45)}…`
  }

  return label
}

/**
 * One readable line per event for the activity feed (no raw URLs or session IDs).
 */
export function activityDescriptionFromEvent(event) {
  const name = event.event_name
  const place = placeLabelFromPath(event.page_path)
  const meta = event.metadata && typeof event.metadata === "object" ? event.metadata : {}

  switch (name) {
    case ANALYTICS_EVENTS.PAGE_VIEW:
      if (place === "Homepage") {
        return "Homepage viewed"
      }

      if (place === "Project intake") {
        return "Intake section viewed"
      }

      return `${place} viewed`

    case ANALYTICS_EVENTS.CTA_CLICK: {
      const cta = shortCtaLabel(meta)
      return cta ? `Key action: ${cta}` : "Call-to-action clicked"
    }

    case ANALYTICS_EVENTS.INTAKE_STARTED:
      return "Someone started a project intake"

    case ANALYTICS_EVENTS.INTAKE_SUBMITTED:
      return "Project intake submitted"

    case ANALYTICS_EVENTS.INTRO_LINK_SENT:
      return "Intro call email sent to a lead"

    case ANALYTICS_EVENTS.LEAD_STATUS_UPDATED:
      return "Lead status updated in CRM"

    case ANALYTICS_EVENTS.INTAKE_BLOCKED_HONEYPOT:
      return "Automated submission filtered"

    case ANALYTICS_EVENTS.INTAKE_BLOCKED_TURNSTILE:
      return "Submission paused for verification"

    case ANALYTICS_EVENTS.INTAKE_BLOCKED_RATE_LIMIT:
      return "Submission temporarily slowed"

    default:
      return "Site activity recorded"
  }
}

/**
 * Distinct sessions that viewed more than one meaningful section (rough returning signal).
 */
export function estimateReturningVisitors(pageViewEvents) {
  const bySession = new Map()

  for (const event of pageViewEvents) {
    const sid = event.session_id

    if (!sid) {
      continue
    }

    const label = placeLabelFromPath(event.page_path)
    if (!bySession.has(sid)) {
      bySession.set(sid, new Set())
    }

    bySession.get(sid).add(label)
  }

  let returning = 0

  for (const labels of bySession.values()) {
    if (labels.size >= 2) {
      returning += 1
    }
  }

  return returning
}

export function countDistinctVisitorSessions(pageViewEvents) {
  const ids = new Set()

  for (const event of pageViewEvents) {
    if (event.session_id) {
      ids.add(event.session_id)
    }
  }

  if (ids.size > 0) {
    return ids.size
  }

  return pageViewEvents.length
}

export function buildFunnelCounts(events) {
  const pageViews = events.filter((e) => e.event_name === ANALYTICS_EVENTS.PAGE_VIEW)

  return {
    visitors: countDistinctVisitorSessions(pageViews),
    intakeStarted: events.filter((e) => e.event_name === ANALYTICS_EVENTS.INTAKE_STARTED)
      .length,
    intakeSubmitted: events.filter((e) => e.event_name === ANALYTICS_EVENTS.INTAKE_SUBMITTED)
      .length,
    introCallSent: events.filter((e) => e.event_name === ANALYTICS_EVENTS.INTRO_LINK_SENT)
      .length,
  }
}
