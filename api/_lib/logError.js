import { getServerSupabaseClient } from "./supabaseServer.js"

const REDACTED_KEYS = [
  "password",
  "secret",
  "token",
  "authorization",
  "apikey",
  "api_key",
  "smtp",
  "email_password",
]

function shouldRedactKey(key) {
  const normalized = String(key).toLowerCase()
  return REDACTED_KEYS.some((fragment) => normalized.includes(fragment))
}

function sanitizeDetails(details) {
  if (!details || typeof details !== "object") {
    return {}
  }

  if (Array.isArray(details)) {
    return details.map((value) =>
      typeof value === "object" && value !== null
        ? sanitizeDetails(value)
        : value,
    )
  }

  return Object.fromEntries(
    Object.entries(details).map(([key, value]) => {
      if (shouldRedactKey(key)) {
        return [key, "[redacted]"]
      }

      if (value && typeof value === "object") {
        return [key, sanitizeDetails(value)]
      }

      return [key, value]
    }),
  )
}

export async function logAppError({
  source,
  severity = "error",
  message,
  details = {},
}) {
  const safeSource = String(source ?? "unknown").trim() || "unknown"
  const safeMessage = String(message ?? "Unknown error").trim() || "Unknown error"
  const safeSeverity = String(severity ?? "error").trim() || "error"
  const safeDetails = sanitizeDetails(details)

  console.error("[Bryant Labs] app_errors", {
    source: safeSource,
    severity: safeSeverity,
    message: safeMessage,
    details: safeDetails,
  })

  const supabase = getServerSupabaseClient()

  if (!supabase) {
    return { recorded: false }
  }

  try {
    const { error } = await supabase.from("app_errors").insert([
      {
        source: safeSource,
        severity: safeSeverity,
        message: safeMessage,
        details: safeDetails,
      },
    ])

    if (error) {
      console.error("[Bryant Labs] app_errors insert failed", {
        source: safeSource,
        message: safeMessage,
        error: error.message,
      })
      return { recorded: false, error: error.message }
    }

    return { recorded: true }
  } catch (error) {
    console.error("[Bryant Labs] app_errors insert failed", {
      source: safeSource,
      message: safeMessage,
      error: error.message,
    })

    return { recorded: false, error: error.message }
  }
}
