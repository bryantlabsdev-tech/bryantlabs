import { createClient } from "@supabase/supabase-js"
import { getSupabaseClient } from "./supabaseClient"
import { shouldTrack } from "./analytics/shouldTrack"

const SESSION_STORAGE_KEY = "bryantlabs.analytics.session_id"

export const ANALYTICS_EVENTS = {
  PAGE_VIEW: "page_view",
  CTA_CLICK: "cta_click",
  INTAKE_STARTED: "intake_started",
  INTAKE_SUBMITTED: "intake_submitted",
  INTAKE_BLOCKED_HONEYPOT: "intake_blocked_honeypot",
  INTAKE_BLOCKED_TURNSTILE: "intake_blocked_turnstile",
  INTAKE_BLOCKED_RATE_LIMIT: "intake_blocked_rate_limit",
  INTRO_LINK_SENT: "intro_link_sent",
  LEAD_STATUS_UPDATED: "lead_status_updated",
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let analyticsClient

function createSessionId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }

  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export function getAnalyticsSessionId() {
  if (typeof window === "undefined") {
    return null
  }

  try {
    const existing = window.localStorage.getItem(SESSION_STORAGE_KEY)

    if (existing) {
      return existing
    }

    const nextSessionId = createSessionId()
    window.localStorage.setItem(SESSION_STORAGE_KEY, nextSessionId)
    return nextSessionId
  } catch {
    return createSessionId()
  }
}

function getAnalyticsClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null
  }

  if (!analyticsClient) {
    analyticsClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  }

  return analyticsClient
}

function getCurrentPagePath() {
  if (typeof window === "undefined") {
    return null
  }

  return `${window.location.pathname}${window.location.search}${window.location.hash}`
}

function shouldTrackPublicPath(pagePath = getCurrentPagePath()) {
  if (!pagePath) {
    return false
  }

  return !pagePath.startsWith("/admin")
}

function sanitizeMetadata(metadata = {}) {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return {}
  }

  return Object.fromEntries(
    Object.entries(metadata).filter(([, value]) => {
      if (value === undefined || value === null) {
        return false
      }

      if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
        return true
      }

      return false
    }),
  )
}

async function resolveTrackingUser(explicitUser) {
  if (explicitUser) {
    return explicitUser
  }

  try {
    const { data } = await getSupabaseClient().auth.getSession()
    return data.session?.user
  } catch {
    return undefined
  }
}

async function canTrackAnalytics(user) {
  return shouldTrack(await resolveTrackingUser(user))
}

export async function trackEvent(eventName, { pagePath, metadata, user } = {}) {
  const client = getAnalyticsClient()

  if (!client || !eventName) {
    return
  }

  if (!(await canTrackAnalytics(user))) {
    return
  }

  const resolvedPagePath = pagePath ?? getCurrentPagePath()

  if (!shouldTrackPublicPath(resolvedPagePath)) {
    return
  }

  try {
    await client.from("site_events").insert([
      {
        event_name: eventName,
        page_path: resolvedPagePath,
        metadata: sanitizeMetadata(metadata),
        session_id: getAnalyticsSessionId(),
        user_agent:
          typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 512) : null,
      },
    ])
  } catch (error) {
    console.warn("[Bryant Labs] Analytics event was not recorded.", {
      eventName,
      error,
    })
  }
}

export async function trackAdminEvent(eventName, { pagePath = "/admin", metadata, user } = {}) {
  const client = getAnalyticsClient()

  if (!client || !eventName) {
    return
  }

  if (!(await canTrackAnalytics(user))) {
    return
  }

  try {
    await client.from("site_events").insert([
      {
        event_name: eventName,
        page_path: pagePath,
        metadata: sanitizeMetadata(metadata),
        session_id: getAnalyticsSessionId(),
        user_agent:
          typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 512) : null,
      },
    ])
  } catch (error) {
    console.warn("[Bryant Labs] Admin analytics event was not recorded.", {
      eventName,
      error,
    })
  }
}

export async function trackPageView(pagePath = getCurrentPagePath(), options = {}) {
  if (!shouldTrackPublicPath(pagePath)) {
    return Promise.resolve()
  }

  if (!(await canTrackAnalytics(options.user))) {
    return Promise.resolve()
  }

  return trackEvent(ANALYTICS_EVENTS.PAGE_VIEW, { pagePath, user: options.user })
}

export function trackCtaClick(ctaLabel, metadata = {}) {
  return trackEvent(ANALYTICS_EVENTS.CTA_CLICK, {
    metadata: {
      cta_label: ctaLabel,
      ...metadata,
    },
  })
}

export function trackIntakeStarted(metadata = {}) {
  return trackEvent(ANALYTICS_EVENTS.INTAKE_STARTED, {
    pagePath: "/#contact",
    metadata,
  })
}

export function trackIntakeSubmitted(metadata = {}) {
  return trackEvent(ANALYTICS_EVENTS.INTAKE_SUBMITTED, {
    pagePath: "/#contact",
    metadata,
  })
}

export function trackIntakeBlockedHoneypot(metadata = {}) {
  return trackEvent(ANALYTICS_EVENTS.INTAKE_BLOCKED_HONEYPOT, {
    pagePath: "/#contact",
    metadata,
  })
}

export function trackIntakeBlockedTurnstile(metadata = {}) {
  return trackEvent(ANALYTICS_EVENTS.INTAKE_BLOCKED_TURNSTILE, {
    pagePath: "/#contact",
    metadata,
  })
}

export function trackIntakeBlockedRateLimit(metadata = {}) {
  return trackEvent(ANALYTICS_EVENTS.INTAKE_BLOCKED_RATE_LIMIT, {
    pagePath: "/#contact",
    metadata,
  })
}

export function trackIntroLinkSent(metadata = {}, user) {
  return trackAdminEvent(ANALYTICS_EVENTS.INTRO_LINK_SENT, { metadata, user })
}

export function trackLeadStatusUpdated(metadata = {}, user) {
  return trackAdminEvent(ANALYTICS_EVENTS.LEAD_STATUS_UPDATED, { metadata, user })
}
