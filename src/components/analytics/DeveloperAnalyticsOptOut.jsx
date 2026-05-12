import { useEffect } from "react"
import { setDeveloperAnalyticsDisabled } from "../../lib/analytics/shouldTrack"

function applyAnalyticsQueryParams() {
  if (typeof window === "undefined") {
    return
  }

  const params = new URLSearchParams(window.location.search)

  if (params.get("disableAnalytics") === "true" || params.get("disableAnalytics") === "1") {
    setDeveloperAnalyticsDisabled(true)
  }

  if (params.get("enableAnalytics") === "true" || params.get("enableAnalytics") === "1") {
    setDeveloperAnalyticsDisabled(false)
  }
}

export default function DeveloperAnalyticsOptOut() {
  useEffect(() => {
    applyAnalyticsQueryParams()
  }, [])

  return null
}
