/**
 * Best-effort client IP for logging or optional Turnstile `remoteip`.
 * Prefer headers set by the edge (Cloudflare) before generic forward chains,
 * which can point at a proxy instead of the visitor and break siteverify.
 */
export function getRequestIp(req) {
  const cf = String(req.headers["cf-connecting-ip"] ?? "").trim()
  if (cf) {
    return cf
  }

  const trueClient = String(req.headers["true-client-ip"] ?? "").trim()
  if (trueClient) {
    return trueClient
  }

  const realIp = String(req.headers["x-real-ip"] ?? "").trim()
  if (realIp) {
    return realIp
  }

  const forwardedFor = String(req.headers["x-forwarded-for"] ?? "")
    .split(",")[0]
    .trim()

  return forwardedFor || null
}

function isProductionRuntime() {
  const nodeEnv = String(process.env.NODE_ENV ?? "").toLowerCase()
  const vercelEnv = String(process.env.VERCEL_ENV ?? "").toLowerCase()

  return nodeEnv === "production" || vercelEnv === "production"
}

/**
 * Cloudflare siteverify: `remoteip` is optional. Sending a wrong IP (common
 * behind multi-hop proxies) can cause `success: false` even when the widget
 * succeeded. Opt in with TURNSTILE_SEND_REMOTE_IP=true when you trust the IP.
 */
export async function verifyTurnstileToken(token, remoteIp) {
  const secretKey = process.env.TURNSTILE_SECRET_KEY
  const isProduction = isProductionRuntime()

  if (!secretKey) {
    if (isProduction) {
      console.error(
        "[Bryant Labs] Turnstile verification failed because TURNSTILE_SECRET_KEY is not configured in production.",
      )
      return {
        success: false,
        error: "Turnstile is not configured.",
      }
    }

    console.warn(
      "[Bryant Labs] Turnstile verification skipped in non-production because TURNSTILE_SECRET_KEY is not set.",
    )
    return { success: true, skipped: true }
  }

  if (!token) {
    return { success: false, error: "Missing Turnstile token." }
  }

  const params = new URLSearchParams({
    secret: secretKey,
    response: token,
  })

  const sendRemoteIp = process.env.TURNSTILE_SEND_REMOTE_IP === "true"

  if (sendRemoteIp && remoteIp) {
    params.set("remoteip", remoteIp)
  }

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    })

    const result = await response.json().catch(() => ({}))

    if (!response.ok) {
      return {
        success: false,
        error: `siteverify HTTP ${response.status}`,
        httpStatus: response.status,
        errorCodes: result["error-codes"] ?? null,
      }
    }

    const errorCodes = result["error-codes"] ?? null

    return {
      success: Boolean(result.success),
      error: Array.isArray(errorCodes) ? errorCodes.join(", ") : null,
      errorCodes,
      httpStatus: response.status,
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    }
  }
}
