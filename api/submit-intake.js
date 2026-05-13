import { readIntakePayload, sendIntakeEmails } from "./_lib/intakeEmail.js"
import { logMissingEnvForRoute, routeEnvRequirements } from "./_lib/envCheck.js"
import { logAppError } from "./_lib/logError.js"
import { parseOptionalUsPhone } from "./_lib/optionalPhone.js"
import {
  checkIntakeRateLimit,
  getIntakeRateLimitKey,
} from "./_lib/rateLimit.js"
import {
  extractIntakeInsertFailureHint,
  insertIntakeConsultationLead,
  serializeSupabaseInsertError,
  trackServerSiteEvent,
} from "./_lib/supabaseServer.js"
import { getRequestIp, verifyTurnstileToken } from "./_lib/turnstile.js"

const TURNSTILE_FAILURE_MESSAGE =
  "We couldn’t verify the submission. Please try again."
const RATE_LIMIT_MESSAGE =
  "Too many attempts. Please wait a few minutes and try again."
const SAVE_FAILURE_MESSAGE =
  "We couldn’t save your intake. Please try again."

const INTAKE_DIAGNOSTIC = process.env.INTAKE_DIAGNOSTIC_LOG === "true"

function logIntakeDiagnostic(phase, data) {
  if (!INTAKE_DIAGNOSTIC) {
    return
  }

  console.info(`[Bryant Labs] intake diagnostic · ${phase}`, data)
}

function emailDomain(email) {
  const value = String(email ?? "").trim()
  const at = value.indexOf("@")

  return at === -1 ? null : value.slice(at + 1)
}

function getRequestUserAgent(req) {
  return String(req.headers["user-agent"] ?? "").slice(0, 512)
}

async function safeLogAppError(entry) {
  try {
    await logAppError(entry)
  } catch (logFailure) {
    console.error("[Bryant Labs] submit-intake logAppError failed", logFailure)
  }
}

async function handleSubmitIntake(req, res) {
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

  logIntakeDiagnostic("read_payload", {
    honeypot: Boolean(payload.websiteUrl),
    hasTurnstileToken: Boolean(payload.turnstileToken?.length),
    sessionId: payload.sessionId || null,
    emailDomain: emailDomain(payload.email),
  })

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

    await safeLogAppError({
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

  logIntakeDiagnostic("turnstile", {
    success: turnstileResult.success,
    skipped: Boolean(turnstileResult.skipped),
    error: turnstileResult.error ?? null,
    httpStatus: turnstileResult.httpStatus ?? null,
  })

  if (!turnstileResult.success) {
    await trackServerSiteEvent({
      eventName: "intake_blocked_turnstile",
      metadata: { reason: "turnstile_failed" },
      ...analyticsContext,
    })

    await safeLogAppError({
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
      ...(INTAKE_DIAGNOSTIC
        ? {
            _diagnostic: {
              turnstileError: turnstileResult.error ?? null,
            },
          }
        : {}),
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

  const insertResult = await insertIntakeConsultationLead(payload)

  if (!insertResult.ok) {
    const supabaseErr = serializeSupabaseInsertError(insertResult.error)
    const failureHint =
      insertResult.failureHint ?? extractIntakeInsertFailureHint(insertResult.error)

    await safeLogAppError({
      source: "submit-intake",
      message: "Supabase intake insert failed.",
      details: {
        reason: "supabase_insert_failed",
        supabase: supabaseErr,
        supabaseMessage: supabaseErr.message,
        supabaseCode: supabaseErr.code,
        supabaseDetails: supabaseErr.details,
        supabaseHint: supabaseErr.hint,
        intakeInsertFailureHint: failureHint,
        intakeInsertAttemptLog: insertResult.attemptLog,
        emailDomain: emailDomain(payload.email),
        sessionId: payload.sessionId || null,
      },
    })

    console.error("[Bryant Labs] submit-intake insert exhausted fallbacks", {
      supabase: supabaseErr,
      intakeInsertFailureHint: failureHint,
      attemptCount: insertResult.attemptLog?.length ?? 0,
      lastAttemptKeys: insertResult.attemptKeys,
    })

    return res.status(502).json({
      error: SAVE_FAILURE_MESSAGE,
      code: "save_failed",
      ...(INTAKE_DIAGNOSTIC
        ? {
            _diagnostic: {
              supabase: supabaseErr,
              intakeInsertFailureHint: failureHint,
              intakeInsertAttemptLog: insertResult.attemptLog,
            },
          }
        : {}),
    })
  }

  logIntakeDiagnostic("insert_ok", {
    attemptIndex: insertResult.attemptIndex,
    keys: insertResult.attemptKeys,
    emailDomain: emailDomain(payload.email),
  })

  let emailResult

  try {
    logIntakeDiagnostic("email_start", { emailDomain: emailDomain(payload.email) })
    emailResult = await sendIntakeEmails(payload)
    logIntakeDiagnostic("email_done", {
      customerConfirmationSent: emailResult.customerConfirmationSent,
      internalNotificationSent: emailResult.internalNotificationSent,
    })
  } catch (error) {
    await safeLogAppError({
      source: "submit-intake",
      message: "Intake email dispatch failed after lead save.",
      details: {
        reason: "smtp_dispatch_failed",
        error: error?.message ?? String(error),
        emailDomain: emailDomain(payload.email),
      },
    })

    return res.status(200).json({
      success: true,
      customerConfirmationSent: false,
      internalNotificationSent: false,
    })
  }

  if (!emailResult.customerConfirmationSent) {
    await safeLogAppError({
      source: "submit-intake",
      message: "Client confirmation email failed after lead save.",
      details: {
        reason: "customer_confirmation_failed",
        emailDomain: emailDomain(payload.email),
        internalNotificationSent: emailResult.internalNotificationSent,
      },
    })
  }

  if (!emailResult.internalNotificationSent) {
    await safeLogAppError({
      source: "submit-intake",
      severity: "warn",
      message: "Internal intake notification email failed after lead save.",
      details: {
        reason: "internal_notification_failed",
        emailDomain: emailDomain(payload.email),
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

export default async function handler(req, res) {
  try {
    return await handleSubmitIntake(req, res)
  } catch (fatal) {
    console.error("[Bryant Labs] submit-intake unhandled exception", fatal)

    await safeLogAppError({
      source: "submit-intake",
      message: "submit-intake unhandled exception.",
      details: {
        reason: "unhandled",
        message: fatal?.message ?? String(fatal),
      },
    })

    if (!res.headersSent) {
      return res.status(500).json({
        error: SAVE_FAILURE_MESSAGE,
        code: "server_error",
        ...(INTAKE_DIAGNOSTIC
          ? {
              _diagnostic: {
                message: fatal?.message ?? String(fatal),
              },
            }
          : {}),
      })
    }
  }
}
