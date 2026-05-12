import {
  mapIntakePayloadToLeadRow,
  readIntakePayload,
  sendIntakeEmails,
} from "./_lib/intakeEmail.js"
import {
  checkIntakeRateLimit,
  getIntakeRateLimitKey,
} from "./_lib/rateLimit.js"
import { insertConsultationLead, trackServerSiteEvent } from "./_lib/supabaseServer.js"
import { getRequestIp, verifyTurnstileToken } from "./_lib/turnstile.js"

const TURNSTILE_FAILURE_MESSAGE =
  "We couldn’t verify the submission. Please try again."
const RATE_LIMIT_MESSAGE =
  "Too many attempts. Please wait a few minutes and try again."

function getRequestUserAgent(req) {
  return String(req.headers["user-agent"] ?? "").slice(0, 512)
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST")
    return res.status(405).json({ error: "Method not allowed" })
  }

  const body = req.body ?? {}
  const payload = readIntakePayload(body)
  const userAgent = getRequestUserAgent(req)
  const analyticsContext = {
    sessionId: payload.analyticsSessionId,
    userAgent,
  }

  if (payload.websiteUrl) {
    await trackServerSiteEvent({
      eventName: "intake_blocked_honeypot",
      metadata: { reason: "honeypot_filled" },
      ...analyticsContext,
    })

    return res.status(200).json({ success: true })
  }

  const rateLimitKey = getIntakeRateLimitKey(req, body)
  const rateLimit = checkIntakeRateLimit(rateLimitKey)

  if (!rateLimit.allowed) {
    await trackServerSiteEvent({
      eventName: "intake_blocked_rate_limit",
      metadata: { reason: "rate_limited" },
      ...analyticsContext,
    })

    return res.status(429).json({
      error: RATE_LIMIT_MESSAGE,
      code: "rate_limited",
    })
  }

  const turnstileResult = await verifyTurnstileToken(
    payload.turnstileToken,
    getRequestIp(req),
  )

  if (!turnstileResult.success) {
    await trackServerSiteEvent({
      eventName: "intake_blocked_turnstile",
      metadata: { reason: "turnstile_failed" },
      ...analyticsContext,
    })

    return res.status(400).json({
      error: TURNSTILE_FAILURE_MESSAGE,
      code: "turnstile_failed",
    })
  }

  const missingFields = [
    "fullName",
    "email",
    "planningSession",
    "projectSummary",
    "platform",
    "budgetRange",
    "timeline",
    "audience",
    "coreFeatures",
    "sessionId",
    "sessionName",
    "sessionPriceLabel",
  ].filter((field) => !payload[field])

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: "Missing required intake fields.",
      missingFields,
    })
  }

  if (!Number.isFinite(payload.sessionPriceCents)) {
    return res.status(400).json({
      error: "Missing required intake fields.",
      missingFields: ["sessionPriceCents"],
    })
  }

  try {
    await insertConsultationLead(mapIntakePayloadToLeadRow(payload))
  } catch (error) {
    console.error("[Bryant Labs] Intake lead insert failed", {
      error: error.message,
    })

    return res.status(502).json({
      error: "We could not save your intake request. Please try again in a moment.",
    })
  }

  let emailResult

  try {
    emailResult = await sendIntakeEmails(payload)
  } catch (error) {
    console.error("[Bryant Labs] Intake email dispatch failed after save", {
      error: error.message,
    })

    return res.status(502).json({
      error: "Client confirmation email could not be sent.",
      customerConfirmationSent: false,
      internalNotificationSent: false,
    })
  }

  if (!emailResult.customerConfirmationSent) {
    return res.status(502).json({
      error: "Client confirmation email could not be sent.",
      customerConfirmationSent: false,
      internalNotificationSent: emailResult.internalNotificationSent,
    })
  }

  return res.status(200).json({
    success: true,
    customerConfirmationSent: emailResult.customerConfirmationSent,
    internalNotificationSent: emailResult.internalNotificationSent,
  })
}
