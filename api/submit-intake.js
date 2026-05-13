import {
  mapIntakePayloadToLeadRow,
  readIntakePayload,
  sendIntakeEmails,
} from "./_lib/intakeEmail.js"
import { logMissingEnvForRoute, routeEnvRequirements } from "./_lib/envCheck.js"
import { logAppError } from "./_lib/logError.js"
import { parseOptionalUsPhone } from "./_lib/optionalPhone.js"
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
const SAVE_FAILURE_MESSAGE =
  "We couldn’t save your intake. Please try again."

function getRequestUserAgent(req) {
  return String(req.headers["user-agent"] ?? "").slice(0, 512)
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST")
    return res.status(405).json({ error: "Method not allowed" })
  }

  await logMissingEnvForRoute({
    source: "submit-intake",
    keys: routeEnvRequirements["submit-intake"],
    severity: "warn",
  })

  const body = req.body ?? {}
  const payload = readIntakePayload(body)
  const userAgent = getRequestUserAgent(req)
  const analyticsContext = {
    sessionId: payload.analyticsSessionId,
    userAgent,
    email: payload.email,
    analyticsDisabled: payload.analyticsDisabled,
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

    await logAppError({
      source: "submit-intake",
      severity: "warn",
      message: "Intake submission blocked by rate limit.",
      details: {
        reason: "rate_limited",
        sessionId: payload.analyticsSessionId || null,
      },
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

    await logAppError({
      source: "submit-intake",
      severity: "warn",
      message: "Intake submission failed Turnstile verification.",
      details: {
        reason: "turnstile_failed",
        turnstileError: turnstileResult.error ?? null,
        skipped: Boolean(turnstileResult.skipped),
      },
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

  const phoneCheck = parseOptionalUsPhone(payload.phone)

  if (!phoneCheck.ok) {
    return res.status(400).json({
      error:
        "If you include a phone number, use a 10-digit US number (with or without formatting) or leave the field blank.",
      code: "invalid_phone",
    })
  }

  payload.phone = phoneCheck.value

  try {
    await insertConsultationLead(mapIntakePayloadToLeadRow(payload))
  } catch (error) {
    await logAppError({
      source: "submit-intake",
      message: "Supabase intake insert failed.",
      details: {
        reason: "supabase_insert_failed",
        error: error.message,
        email: payload.email,
      },
    })

    return res.status(502).json({
      error: SAVE_FAILURE_MESSAGE,
      code: "save_failed",
    })
  }

  let emailResult

  try {
    emailResult = await sendIntakeEmails(payload)
  } catch (error) {
    await logAppError({
      source: "submit-intake",
      message: "Intake email dispatch failed after lead save.",
      details: {
        reason: "smtp_dispatch_failed",
        error: error.message,
        email: payload.email,
      },
    })

    return res.status(200).json({
      success: true,
      customerConfirmationSent: false,
      internalNotificationSent: false,
    })
  }

  if (!emailResult.customerConfirmationSent) {
    await logAppError({
      source: "submit-intake",
      message: "Client confirmation email failed after lead save.",
      details: {
        reason: "customer_confirmation_failed",
        email: payload.email,
        internalNotificationSent: emailResult.internalNotificationSent,
      },
    })
  }

  if (!emailResult.internalNotificationSent) {
    await logAppError({
      source: "submit-intake",
      severity: "warn",
      message: "Internal intake notification email failed after lead save.",
      details: {
        reason: "internal_notification_failed",
        email: payload.email,
        customerConfirmationSent: emailResult.customerConfirmationSent,
      },
    })
  }

  return res.status(200).json({
    success: true,
    customerConfirmationSent: emailResult.customerConfirmationSent,
    internalNotificationSent: emailResult.internalNotificationSent,
  })
}
