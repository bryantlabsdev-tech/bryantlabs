/**
 * Client-side presentation helpers for admin Ops (app_errors).
 * Keeps categorization lightweight and aligned with existing logAppError payloads.
 */

const MS_MIN = 60_000
const MS_HOUR = 60 * MS_MIN
const MS_DAY = 24 * MS_HOUR

export function formatTimeAgo(iso) {
  if (!iso) {
    return ""
  }

  const then = new Date(iso).getTime()

  if (Number.isNaN(then)) {
    return ""
  }

  const diff = Date.now() - then
  const sec = Math.floor(diff / 1000)

  if (sec < 45) {
    return "just now"
  }

  if (sec < 3600) {
    const m = Math.floor(sec / 60)
    return `${m}m ago`
  }

  if (diff < MS_DAY) {
    const h = Math.floor(diff / MS_HOUR)
    return `${h}h ago`
  }

  const d = Math.floor(diff / MS_DAY)
  return `${d}d ago`
}

export function routeLabelFromSource(source) {
  const s = String(source ?? "").trim()

  if (!s) {
    return "—"
  }

  if (s.includes("submit") || s === "submit-intake") {
    return "/api/submit-intake"
  }

  if (s.includes("intro") || s === "send-intro-link") {
    return "/api/send-intro-link"
  }

  return `/api (${s})`
}

/** Boutique-style category for filters and badges. */
export function deriveOpsCategory(entry) {
  const source = String(entry?.source ?? "").toLowerCase()
  const message = String(entry?.message ?? "").toLowerCase()
  const reason = String(entry?.details?.reason ?? "").toLowerCase()

  if (source.includes("submit-intake") || source === "submit-intake") {
    return "intake"
  }

  if (source.includes("send-intro-link") || source === "send-intro-link") {
    if (
      message.includes("auth") ||
      message.includes("token") ||
      message.includes("signed in") ||
      reason.includes("auth")
    ) {
      return "auth"
    }

    return "email"
  }

  if (source.includes("analytics") || reason.includes("analytics")) {
    return "analytics"
  }

  if (source.includes("crm") || reason.includes("crm")) {
    return "crm"
  }

  if (
    message.includes("environment") ||
    message.includes("missing required") ||
    source.includes("env")
  ) {
    return "config"
  }

  return "config"
}

/**
 * Stable display code for headers (derived; not stored in DB).
 */
export function deriveOpsErrorCode(entry) {
  const source = String(entry?.source ?? "")
  const reason = String(entry?.details?.reason ?? "")
  const message = String(entry?.message ?? "").toLowerCase()

  if (source.includes("submit-intake")) {
    if (reason === "supabase_insert_failed") return "INTAKE_INSERT_FAILED"
    if (reason === "turnstile_failed") return "TURNSTILE_VERIFY_FAILED"
    if (reason === "rate_limited") return "INTAKE_RATE_LIMITED"
    if (reason === "smtp_dispatch_failed") return "SMTP_SEND_FAILED"
    if (reason === "customer_confirmation_failed") return "SMTP_CUSTOMER_CONFIRM_FAILED"
    if (reason === "internal_notification_failed") return "SMTP_INTERNAL_NOTIFY_FAILED"
    if (reason === "unhandled") return "INTAKE_UNHANDLED_EXCEPTION"
    if (message.includes("turnstile")) return "TURNSTILE_VERIFY_FAILED"
    if (message.includes("rate limit")) return "INTAKE_RATE_LIMITED"
    if (message.includes("insert")) return "INTAKE_INSERT_FAILED"
    if (message.includes("email")) return "SMTP_SEND_FAILED"
    return "INTAKE_ERROR"
  }

  if (source.includes("send-intro-link")) {
    if (message.includes("auth") || message.includes("token")) return "ADMIN_AUTH_FAILED"
    if (message.includes("email") || message.includes("smtp")) return "INTRO_EMAIL_FAILED"
    return "INTRO_LINK_ERROR"
  }

  if (message.includes("missing required environment")) {
    return "CONFIG_ENV_MISSING"
  }

  return "OPERATIONAL_ERROR"
}

export function extractAffectedIdentity(entry) {
  const d = entry?.details

  if (!d || typeof d !== "object") {
    return { email: null, emailDomain: null }
  }

  const rawEmail = typeof d.email === "string" ? d.email.trim() : ""
  const email = rawEmail || null
  const domain = typeof d.emailDomain === "string" ? d.emailDomain.trim() : null

  if (email) {
    const at = email.indexOf("@")
    return { email, emailDomain: at === -1 ? null : email.slice(at + 1) }
  }

  return { email: null, emailDomain: domain }
}

export function summarizeOpsHealth({ unresolvedCount }) {
  if (unresolvedCount === 0) {
    return {
      tone: "ok",
      headline: "No unresolved operational issues",
      subline: "Monitored API routes are clear. Spot-check intake if you shipped changes.",
    }
  }

  const subline =
    unresolvedCount === 1
      ? "Open the issue below for diagnostics and next steps."
      : `${unresolvedCount} issues need review or resolution.`

  return {
    tone: "attention",
    headline: `${unresolvedCount} unresolved operational issue${unresolvedCount === 1 ? "" : "s"}`,
    subline,
  }
}

export function lastIntakeIssueSummary(errors) {
  const list = Array.isArray(errors) ? errors : []
  const intake = list.filter((e) => String(e?.source ?? "").includes("submit-intake"))

  if (intake.length === 0) {
    return null
  }

  const latest = intake.reduce((best, cur) => {
    const t = new Date(cur.created_at).getTime()
    const bt = best ? new Date(best.created_at).getTime() : 0
    return t > bt ? cur : best
  }, null)

  if (!latest) {
    return null
  }

  return {
    at: latest.created_at,
    ago: formatTimeAgo(latest.created_at),
    code: deriveOpsErrorCode(latest),
    resolved: Boolean(latest.resolved),
  }
}
