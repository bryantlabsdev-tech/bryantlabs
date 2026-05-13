import { createClient } from "@supabase/supabase-js"
import { shouldTrackServerAnalytics } from "./shouldTrackAnalytics.js"

export function getServerSupabaseClient() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    return null
  }

  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

/** Drop keys with undefined so PostgREST never receives undefined JSON. */
export function stripUndefinedDeep(value) {
  if (value === undefined) {
    return undefined
  }

  if (value === null || typeof value !== "object") {
    return value
  }

  if (Array.isArray(value)) {
    return value.map((entry) => stripUndefinedDeep(entry))
  }

  return Object.fromEntries(
    Object.entries(value)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => [k, stripUndefinedDeep(v)]),
  )
}

/** Safe for logs / JSON responses (PostgREST errors are plain objects). */
export function serializeSupabaseInsertError(error) {
  if (error == null) {
    return { message: "Unknown error" }
  }

  if (typeof error !== "object") {
    return { message: String(error) }
  }

  return {
    message: String(error.message ?? error),
    code: error.code != null ? String(error.code) : null,
    details: error.details != null ? String(error.details) : null,
    hint: error.hint != null ? String(error.hint) : null,
  }
}

function isProbableMissingColumnError(error) {
  const msg = String(error?.message ?? "").toLowerCase()
  const code = String(error?.code ?? "")

  return (
    msg.includes("could not find") ||
    msg.includes("schema cache") ||
    msg.includes("does not exist") ||
    code === "PGRST204" ||
    code === "42703"
  )
}

/**
 * Inserts a public intake row using anon RLS. Retries without optional columns
 * when PostgREST reports an unknown column (production schema behind migrations).
 */
export async function insertConsultationLead(row) {
  const supabase = getServerSupabaseClient()

  if (!supabase) {
    throw new Error("Supabase is not configured.")
  }

  const cleanRow = stripUndefinedDeep(row)

  const attempts = [cleanRow]
  const withoutStripe = { ...cleanRow }
  delete withoutStripe.stripe_customer_email

  if (Object.keys(withoutStripe).length < Object.keys(cleanRow).length) {
    attempts.push(withoutStripe)
  }

  let lastError = null

  for (let i = 0; i < attempts.length; i += 1) {
    const { error } = await supabase.from("consultation_leads").insert([attempts[i]])

    if (!error) {
      return
    }

    lastError = error

    const canRetry = i < attempts.length - 1 && isProbableMissingColumnError(error)

    if (!canRetry) {
      throw lastError
    }
  }

  throw lastError ?? new Error("Supabase insert failed with no error object.")
}

export async function trackServerSiteEvent({
  eventName,
  pagePath = "/#contact",
  metadata = {},
  sessionId,
  userAgent,
  email,
  analyticsDisabled = false,
}) {
  const supabase = getServerSupabaseClient()

  if (!supabase || !eventName) {
    return
  }

  if (
    !shouldTrackServerAnalytics({
      email,
      userAgent,
      analyticsDisabled,
    })
  ) {
    return
  }

  try {
    const { error } = await supabase.from("site_events").insert([
      {
        event_name: eventName,
        page_path: pagePath,
        metadata,
        session_id: sessionId ?? null,
        user_agent: userAgent ? String(userAgent).slice(0, 512) : null,
      },
    ])

    if (error) {
      console.warn("[Bryant Labs] Server analytics event was not recorded.", {
        eventName,
        error: serializeSupabaseInsertError(error),
      })
    }
  } catch (error) {
    console.warn("[Bryant Labs] Server analytics event was not recorded.", {
      eventName,
      error: error?.message ?? String(error),
    })
  }
}
