export async function verifyTurnstileToken(token, remoteIp) {
  const secretKey = process.env.TURNSTILE_SECRET_KEY

  if (!secretKey) {
    console.warn(
      "[Bryant Labs] Turnstile verification skipped because TURNSTILE_SECRET_KEY is not set.",
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

  if (remoteIp) {
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

    const result = await response.json()

    return {
      success: Boolean(result.success),
      error: result["error-codes"]?.join(", ") ?? null,
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    }
  }
}

export function getRequestIp(req) {
  const forwardedFor = String(req.headers["x-forwarded-for"] ?? "")
    .split(",")[0]
    .trim()

  return forwardedFor || null
}
