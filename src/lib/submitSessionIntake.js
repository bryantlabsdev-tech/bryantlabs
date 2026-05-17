import {
  getAnalyticsSessionId,
  trackIntakeBlockedHoneypot,
  trackIntakeBlockedRateLimit,
  trackIntakeBlockedTurnstile,
  trackIntakeSubmitted,
} from "./analytics"
import { isAnalyticsDisabledInStorage } from "./analytics/shouldTrack"

export class SessionIntakeError extends Error {
  constructor(message, options = {}) {
    super(message)
    this.name = "SessionIntakeError"
    this.code = options.code
    this.cause = options.cause
  }
}

function buildIntakePayload(session, formData, turnstileToken) {
  const intakeStage = String(formData.get("intakeStage") ?? "quick").trim()
  const rawNotes = String(formData.get("notes") ?? "").trim()
  const intakeContext = String(formData.get("intakeContext") ?? "").trim()
  const contextLine = intakeContext
    ? `Engagement shape: ${intakeContext}`
    : ""
  const additionalNotes = [contextLine, rawNotes].filter(Boolean).join("\n\n")

  return {
    intakeStage,
    intakeContext,
    sessionId: session.id,
    sessionName: session.name,
    sessionPriceCents: session.priceCents,
    sessionPriceLabel: session.priceLabel,
    planningSession: session.name,
    fullName: String(formData.get("fullName") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    company: String(formData.get("company") ?? "").trim(),
    projectSummary: String(formData.get("projectSummary") ?? "").trim(),
    audience: String(formData.get("audience") ?? "").trim(),
    coreFeatures: String(formData.get("coreFeatures") ?? "").trim(),
    platform: String(formData.get("platform") ?? "").trim(),
    timeline: String(formData.get("timeline") ?? "").trim(),
    budgetRange: String(formData.get("budget") ?? "").trim(),
    referenceLinks: String(formData.get("references") ?? "").trim(),
    additionalNotes,
    submittedAt: new Date().toISOString(),
    website_url: String(formData.get("website_url") ?? "").trim(),
    turnstileToken: String(turnstileToken ?? "").trim(),
    analyticsSessionId: getAnalyticsSessionId(),
    analyticsDisabled: isAnalyticsDisabledInStorage(),
  }
}

export async function submitSessionIntake({ session, formData, turnstileToken }) {
  const payload = buildIntakePayload(session, formData, turnstileToken)

  const response = await fetch("/api/submit-intake", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  const details = await response.json().catch(() => ({}))

  if (response.ok) {
    if (payload.website_url) {
      await trackIntakeBlockedHoneypot()
    } else {
      await trackIntakeSubmitted({
        session_id: session.id,
      })
    }

    return {
      success: true,
      intake: payload,
      checkoutUrl: null,
    }
  }

  if (details.code === "rate_limited") {
    await trackIntakeBlockedRateLimit()
  } else if (details.code === "turnstile_failed") {
    await trackIntakeBlockedTurnstile()
  }

  throw new SessionIntakeError(
    details.error ?? "We couldn’t save your intake. Please try again.",
    {
      code: details.code,
      cause: details,
    },
  )
}
