import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { trackPageView } from "../../lib/analytics"

export default function AnalyticsPageTracker() {
  const location = useLocation()

  useEffect(() => {
    const pagePath = `${location.pathname}${location.search}${location.hash}`
    void trackPageView(pagePath)
  }, [location.pathname, location.search, location.hash])

  return null
}
