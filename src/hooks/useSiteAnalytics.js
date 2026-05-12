import { useCallback, useEffect, useState } from "react"
import { ANALYTICS_EVENTS } from "../lib/analytics"
import { getSupabaseClient } from "../lib/supabaseClient"

const DAY_MS = 24 * 60 * 60 * 1000

function startOfDay(date) {
  const next = new Date(date)
  next.setHours(0, 0, 0, 0)
  return next
}

function formatEventLabel(eventName) {
  return eventName.replaceAll("_", " ")
}

function formatEventTime(value) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}

function buildTopPages(events) {
  const counts = new Map()

  for (const event of events) {
    if (event.event_name !== ANALYTICS_EVENTS.PAGE_VIEW || !event.page_path) {
      continue
    }

    counts.set(event.page_path, (counts.get(event.page_path) ?? 0) + 1)
  }

  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 5)
    .map(([pagePath, count]) => ({ pagePath, count }))
}

function buildAnalyticsSummary(events) {
  const now = Date.now()
  const todayStart = startOfDay(new Date(now)).getTime()
  const sevenDaysAgo = now - 7 * DAY_MS

  const pageViews = events.filter(
    (event) => event.event_name === ANALYTICS_EVENTS.PAGE_VIEW,
  )
  const intakeStarts = events.filter(
    (event) => event.event_name === ANALYTICS_EVENTS.INTAKE_STARTED,
  )
  const intakeSubmissions = events.filter(
    (event) => event.event_name === ANALYTICS_EVENTS.INTAKE_SUBMITTED,
  )
  const ctaClicks = events.filter(
    (event) => event.event_name === ANALYTICS_EVENTS.CTA_CLICK,
  )

  const visitsToday = pageViews.filter(
    (event) => new Date(event.created_at).getTime() >= todayStart,
  ).length
  const visitsLastSevenDays = pageViews.filter(
    (event) => new Date(event.created_at).getTime() >= sevenDaysAgo,
  ).length
  const intakeStartCount = intakeStarts.length
  const intakeSubmissionCount = intakeSubmissions.length
  const conversionRate =
    intakeStartCount > 0
      ? Math.round((intakeSubmissionCount / intakeStartCount) * 100)
      : 0

  return {
    visitsToday,
    visitsLastSevenDays,
    intakeStartCount,
    intakeSubmissionCount,
    conversionRate,
    ctaClickCount: ctaClicks.length,
    topPages: buildTopPages(events),
    recentEvents: events.slice(0, 12).map((event) => ({
      id: event.id,
      eventName: event.event_name,
      pagePath: event.page_path,
      createdAt: event.created_at,
      label: formatEventLabel(event.event_name),
      timeLabel: formatEventTime(event.created_at),
    })),
  }
}

async function fetchSiteEvents() {
  const supabase = getSupabaseClient()
  const since = new Date(Date.now() - 30 * DAY_MS).toISOString()
  const { data, error } = await supabase
    .from("site_events")
    .select("id, created_at, event_name, page_path, metadata, session_id")
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(500)

  if (error) {
    throw error
  }

  return data ?? []
}

export function useSiteAnalytics() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadAnalytics = useCallback(async ({ showLoading = true } = {}) => {
    if (showLoading) {
      setLoading(true)
    }

    setError("")

    try {
      const nextEvents = await fetchSiteEvents()
      setEvents(nextEvents)
    } catch (loadError) {
      setError(
        loadError?.message ?? "We could not load analytics events right now.",
      )
      setEvents([])
    } finally {
      if (showLoading) {
        setLoading(false)
      }
    }
  }, [])

  const resetAnalytics = useCallback(async () => {
    setError("")

    const supabase = getSupabaseClient()
    const { error: resetError } = await supabase.rpc("reset_analytics")

    if (resetError) {
      throw resetError
    }

    setEvents([])
    setLoading(false)
  }, [])

  useEffect(() => {
    let active = true

    async function loadInitialAnalytics() {
      try {
        const nextEvents = await fetchSiteEvents()

        if (!active) {
          return
        }

        setEvents(nextEvents)
        setError("")
      } catch (loadError) {
        if (!active) {
          return
        }

        setError(
          loadError?.message ?? "We could not load analytics events right now.",
        )
        setEvents([])
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void loadInitialAnalytics()

    return () => {
      active = false
    }
  }, [])

  return {
    summary: buildAnalyticsSummary(events),
    loading,
    error,
    reloadAnalytics: () => loadAnalytics({ showLoading: true }),
    resetAnalytics,
  }
}
