const INTERNAL_EMAIL_SNIPPETS = ["test", "admin", "dev", "bryantlabs"]

const EMULATOR_USER_AGENT_PATTERN =
  /emulator|simulator|sdk_gphone|android sdk built for x86/i

function hasInternalEmail(email) {
  const normalized = String(email ?? "").trim().toLowerCase()

  if (!normalized) {
    return false
  }

  return INTERNAL_EMAIL_SNIPPETS.some((snippet) => normalized.includes(snippet))
}

function isDevelopmentEnvironment() {
  return (
    process.env.NODE_ENV === "development" ||
    process.env.VERCEL_ENV === "development" ||
    process.env.VERCEL_ENV === "preview"
  )
}

export function shouldTrackServerAnalytics({
  email,
  userAgent,
  analyticsDisabled = false,
} = {}) {
  if (isDevelopmentEnvironment()) {
    return false
  }

  if (analyticsDisabled) {
    return false
  }

  if (email && hasInternalEmail(email)) {
    return false
  }

  if (userAgent && EMULATOR_USER_AGENT_PATTERN.test(String(userAgent))) {
    return false
  }

  return true
}
