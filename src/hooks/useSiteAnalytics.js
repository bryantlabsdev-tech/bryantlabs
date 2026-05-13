import { useCallback, useEffect, useState } from "react"
import { ANALYTICS_EVENTS } from "../lib/analytics"
import {
  activityDescriptionFromEvent,
  buildFunnelCounts,
  buildSectionTraffic,
  estimateReturningVisitors,
} from "../lib/analyticsPresentation"
import { getSupabaseClient } from "../lib/supabaseClient"

const DAY_MS = 24 * 60 * 60 * 1000

function startOfDay(date) {
  const next = new Date(date)
  next.setHours(0, 0, 0, 0)
  return next
}

function formatEventTime(value) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}

function buildAnalyticsSummary(events) {
  const todayStart = startOfDay(new Date()).getTime()

  const pageViews = events.filter(
    (event) => event.event_name === ANALYTICS_EVENTS.PAGE_VIEW,
  )
  const intakeStarts = events.filter(
    (event) => event.event_name === ANALYTICS_EVENTS.INTAKE_STARTED,
  )
  const intakeSubmissions = events.filter(
    (event) => event.event_name === ANALYTICS_EVENTS.INTAKE_SUBMITTED,
  )

  const visitsToday = pageViews.filter(
    (event) => new Date(event.created_at).getTime() >= todayStart,
  ).length
  const intakeStartCount = intakeStarts.length
  const intakeSubmissionCount = intakeSubmissions.length

  const sectionTraffic = buildSectionTraffic(pageViews)
  const maxSectionCount = sectionTraffic[0]?.count ?? 0
  const mostActiveSection =
    maxSectionCount > 0 ? sectionTraffic[0].label : "Not enough traffic yet"

  const activityFeed = events.slice(0, 14).map((event) => ({
    id: event.id,
    description: activityDescriptionFromEvent(event),
    timeLabel: formatEventTime(event.created_at),
  }))

  return {
    visitsToday,
    intakeStartCount,
    intakeSubmissionCount,
    mostActiveSection,
    returningVisitorsEstimate: estimateReturningVisitors(pageViews),
    sectionTraffic,
    activityFeed,
    funnel: buildFunnelCounts(events),
    hasAnyEvents: events.length > 0,
    hasPageViews: pageViews.length > 0,
    hasIntakeActivity: intakeStartCount > 0 || intakeSubmissionCount > 0,
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
