import { useEffect, useRef } from "react"
import { getTurnstileSiteKey, isTurnstileConfigured } from "../../lib/turnstileConfig"

const TURNSTILE_SCRIPT_ID = "bryantlabs-turnstile-script"

export default function TurnstileWidget({ onTokenChange, resetSignal = 0 }) {
  const containerRef = useRef(null)
  const widgetIdRef = useRef(null)
  const siteKey = getTurnstileSiteKey()

  useEffect(() => {
    if (!isTurnstileConfigured() || !containerRef.current) {
      return undefined
    }

    const handleToken = (token) => {
      onTokenChange(token)
    }

    const handleReset = () => {
      onTokenChange("")
    }

    const renderWidget = () => {
      if (!window.turnstile || !containerRef.current) {
        return
      }

      if (widgetIdRef.current) {
        window.turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        theme: "dark",
        callback: handleToken,
        "expired-callback": handleReset,
        "error-callback": handleReset,
      })
    }

    if (window.turnstile) {
      renderWidget()
      return () => {
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.remove(widgetIdRef.current)
        }
      }
    }

    let script = document.getElementById(TURNSTILE_SCRIPT_ID)

    if (!script) {
      script = document.createElement("script")
      script.id = TURNSTILE_SCRIPT_ID
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
      script.async = true
      script.defer = true
      document.head.appendChild(script)
    }

    script.addEventListener("load", renderWidget)

    return () => {
      script.removeEventListener("load", renderWidget)

      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
      }
    }
  }, [onTokenChange, resetSignal, siteKey])

  if (!isTurnstileConfigured()) {
    return null
  }

  return <div ref={containerRef} className="mt-2" />
}
