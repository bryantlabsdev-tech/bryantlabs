import { logAppError } from "./logError.js"

const ENV_KEYS = [
  "EMAIL_USER",
  "EMAIL_PASSWORD",
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
  "CALENDLY_INTRO_URL",
  "TURNSTILE_SECRET_KEY",
]

function readEnvValue(key) {
  if (key === "SUPABASE_URL") {
    return process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  }

  if (key === "SUPABASE_ANON_KEY") {
    return process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
  }

  return process.env[key]
}

export function getEnvStatus() {
  return Object.fromEntries(
    ENV_KEYS.map((key) => [key, Boolean(String(readEnvValue(key) ?? "").trim())]),
  )
}

export function getMissingEnvKeys(keys = ENV_KEYS) {
  return keys.filter((key) => !String(readEnvValue(key) ?? "").trim())
}

export async function logMissingEnvForRoute({
  source,
  keys = ENV_KEYS,
  severity = "error",
}) {
  const missing = getMissingEnvKeys(keys)

  if (missing.length === 0) {
    return []
  }

  await logAppError({
    source,
    severity,
    message: `Missing required environment variables: ${missing.join(", ")}`,
    details: {
      missing,
    },
  })

  return missing
}

export const routeEnvRequirements = {
  "submit-intake": [
    "EMAIL_USER",
    "EMAIL_PASSWORD",
    "SUPABASE_URL",
    "SUPABASE_ANON_KEY",
    "TURNSTILE_SECRET_KEY",
  ],
  "send-intake-confirmation": ["EMAIL_USER", "EMAIL_PASSWORD"],
  "send-intro-link": [
    "EMAIL_USER",
    "EMAIL_PASSWORD",
    "SUPABASE_URL",
    "SUPABASE_ANON_KEY",
    "CALENDLY_INTRO_URL",
  ],
}
