import { createClient } from "@supabase/supabase-js"
import { buildIntakeInsertAttemptRows } from "./intakeEmail.js"
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
 * Parse PostgREST / Postgres errors for ops logs (no secrets).
 * Surfaces failing column name when present in the server message.
 */
export function extractIntakeInsertFailureHint(error) {
  const msg = String(error?.message ?? "")
  const lower = msg.toLowerCase()

  if (lower.includes("row-level security") || lower.includes("violates row-security")) {
    return { kind: "rls", summary: msg.slice(0, 600) }
  }

  if (lower.includes("duplicate key") || lower.includes("unique constraint")) {
    return { kind: "unique", summary: msg.slice(0, 600) }
  }

  let match = msg.match(/null value in column "([^"]+)"/i)

  if (match) {
    return { kind: "not_null", column: match[1], summary: msg.slice(0, 600) }
  }

  match = msg.match(/column "([^"]+)" (?:of relation|does not exist)/i)

  if (match) {
    return { kind: "column", column: match[1], summary: msg.slice(0, 600) }
  }

  match = msg.match(/Could not find the '([^']+)' column/i)

  if (match) {
    return { kind: "unknown_column", column: match[1], summary: msg.slice(0, 600) }
  }

  return { kind: "unknown", summary: msg.slice(0, 600) }
}

const INTAKE_INSERT_VERBOSE =
  process.env.INTAKE_INSERT_VERBOSE_LOG === "true" ||
  process.env.INTAKE_DIAGNOSTIC_LOG === "true"

/**
 * Public intake: try full payload first, then smaller rows when PostgREST
 * reports missing/unknown columns (production schema behind repo migrations).
 * Does not retry on RLS, unique constraint, or NOT NULL (smaller rows would not help).
 */
export async function insertIntakeConsultationLead(payload) {
  const supabase = getServerSupabaseClient()

  if (!supabase) {
    return {
      ok: false,
      error: new Error("Supabase is not configured."),
      attemptLog: [],
      failureHint: { kind: "config", summary: "Missing SUPABASE_URL / SUPABASE_ANON_KEY" },
      attemptIndex: null,
      attemptKeys: null,
    }
  }

  const attemptRows = buildIntakeInsertAttemptRows(payload)
  const attemptLog = []
  let lastError = null

  for (let i = 0; i < attemptRows.length; i += 1) {
    const row = stripUndefinedDeep(attemptRows[i])
    const keys = Object.keys(row)
    const { error } = await supabase.from("consultation_leads").insert([row])

    if (!error) {
      attemptLog.push({
        index: i,
        keys,
        success: true,
        supabase: null,
        failureHint: null,
      })

      if (INTAKE_INSERT_VERBOSE) {
        console.info("[Bryant Labs] intake insert succeeded", {
          attemptIndex: i,
          failingPayloadKeysResolved: keys,
        })
      }

      return {
        ok: true,
        error: null,
        attemptLog,
        failureHint: null,
        attemptIndex: i,
        attemptKeys: keys,
      }
    }

    lastError = error
    const serialized = serializeSupabaseInsertError(error)
    const failureHint = extractIntakeInsertFailureHint(error)

    attemptLog.push({
      index: i,
      keys,
      success: false,
      supabase: serialized,
      failureHint,
    })

    console.error("[Bryant Labs] intake insert attempt failed", {
      attemptIndex: i,
      failingPayloadKeys: keys,
      supabaseMessage: serialized.message,
      supabaseCode: serialized.code,
      supabaseDetails: serialized.details,
      supabaseHint: serialized.hint,
      failureHint,
    })

    const canRetry = i < attemptRows.length - 1 && isProbableMissingColumnError(error)

    if (!canRetry) {
      return {
        ok: false,
        error: lastError,
        attemptLog,
        failureHint,
        attemptIndex: null,
        attemptKeys: keys,
      }
    }
  }

  return {
    ok: false,
    error: lastError ?? new Error("Supabase insert failed with no error object."),
    attemptLog,
    failureHint: extractIntakeInsertFailureHint(lastError),
    attemptIndex: null,
    attemptKeys: attemptLog.length ? attemptLog[attemptLog.length - 1].keys : null,
  }
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
