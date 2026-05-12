import { useRef } from "react"
import { setDeveloperAnalyticsDisabled } from "../lib/analytics/shouldTrack"

export function useDeveloperAnalyticsOptOutGesture() {
  const clickCountRef = useRef(0)
  const resetTimeoutRef = useRef(null)

  const handleGesture = (event) => {
    if (!event.shiftKey || !event.altKey) {
      return
    }

    clickCountRef.current += 1

    if (resetTimeoutRef.current) {
      window.clearTimeout(resetTimeoutRef.current)
    }

    resetTimeoutRef.current = window.setTimeout(() => {
      clickCountRef.current = 0
    }, 1500)

    if (clickCountRef.current < 3) {
      return
    }

    clickCountRef.current = 0
    setDeveloperAnalyticsDisabled(true)
  }

  return handleGesture
}
