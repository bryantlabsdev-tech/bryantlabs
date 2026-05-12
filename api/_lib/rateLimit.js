import { createHash } from "node:crypto"

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000
const RATE_LIMIT_MAX_ATTEMPTS = 5
const rateLimitBuckets = new Map()

function hashRateLimitKey(parts) {
  return createHash("sha256").update(parts.join("|")).digest("hex")
}

export function getIntakeRateLimitKey(req, body) {
  const sessionId = String(body.analyticsSessionId ?? "").trim() || "anonymous"
  const userAgent = String(req.headers["user-agent"] ?? "").slice(0, 512)
  const forwardedFor = String(req.headers["x-forwarded-for"] ?? "")
    .split(",")[0]
    .trim()
  const forwardedHash = forwardedFor
    ? createHash("sha256").update(forwardedFor).digest("hex").slice(0, 16)
    : "no-forwarded-for"

  return hashRateLimitKey([sessionId, userAgent, forwardedHash])
}

export function checkIntakeRateLimit(key) {
  const now = Date.now()
  const windowStart = now - RATE_LIMIT_WINDOW_MS
  const attempts = (rateLimitBuckets.get(key) ?? []).filter(
    (timestamp) => timestamp > windowStart,
  )

  if (attempts.length >= RATE_LIMIT_MAX_ATTEMPTS) {
    rateLimitBuckets.set(key, attempts)
    return { allowed: false, retryAfterMs: attempts[0] + RATE_LIMIT_WINDOW_MS - now }
  }

  attempts.push(now)
  rateLimitBuckets.set(key, attempts)

  return { allowed: true }
}

export function recordIntakeRateLimitAttempt(key) {
  const now = Date.now()
  const windowStart = now - RATE_LIMIT_WINDOW_MS
  const attempts = (rateLimitBuckets.get(key) ?? []).filter(
    (timestamp) => timestamp > windowStart,
  )

  attempts.push(now)
  rateLimitBuckets.set(key, attempts)
}
