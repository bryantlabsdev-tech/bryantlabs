import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let client
let hasWarnedAboutMissingEnv = false

function warnMissingSupabaseEnv() {
  if (hasWarnedAboutMissingEnv) {
    return
  }

  hasWarnedAboutMissingEnv = true
  console.warn(
    "[Bryant Labs] Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local.",
  )
}

export function getSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    warnMissingSupabaseEnv()
    throw new Error(
      "Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
    )
  }

  if (!client) {
    client = createClient(supabaseUrl, supabaseAnonKey)
  }

  return client
}
