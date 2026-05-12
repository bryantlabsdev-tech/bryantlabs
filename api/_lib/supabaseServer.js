import { createClient } from "@supabase/supabase-js"

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

export async function insertConsultationLead(row) {
  const supabase = getServerSupabaseClient()

  if (!supabase) {
    throw new Error("Supabase is not configured.")
  }

  const { error } = await supabase.from("consultation_leads").insert([row])

  if (error) {
    throw error
  }
}

export async function trackServerSiteEvent({
  eventName,
  pagePath = "/#contact",
  metadata = {},
  sessionId,
  userAgent,
}) {
  const supabase = getServerSupabaseClient()

  if (!supabase || !eventName) {
    return
  }

  try {
    await supabase.from("site_events").insert([
      {
        event_name: eventName,
        page_path: pagePath,
        metadata,
        session_id: sessionId ?? null,
        user_agent: userAgent ? String(userAgent).slice(0, 512) : null,
      },
    ])
  } catch (error) {
    console.warn("[Bryant Labs] Server analytics event was not recorded.", {
      eventName,
      error: error.message,
    })
  }
}
