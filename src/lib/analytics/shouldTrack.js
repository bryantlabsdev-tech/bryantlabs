const DISABLE_STORAGE_KEY = "disableAnalytics"

const INTERNAL_EMAIL_SNIPPETS = ["test", "admin", "dev", "bryantlabs"]

const EMULATOR_USER_AGENT_PATTERN =
  /emulator|simulator|sdk_gphone|android sdk built for x86/i

export function isAnalyticsDisabledInStorage() {
  if (typeof window === "undefined") {
    return false
  }

  try {
    return window.localStorage.getItem(DISABLE_STORAGE_KEY) === "true"
  } catch {
    return false
  }
}

export function setDeveloperAnalyticsDisabled(disabled) {
  if (typeof window === "undefined") {
    return
  }

  try {
    if (disabled) {
      window.localStorage.setItem(DISABLE_STORAGE_KEY, "true")
    } else {
      window.localStorage.removeItem(DISABLE_STORAGE_KEY)
    }
  } catch {
    // Ignore storage failures on restricted browsers.
  }
}

function hasInternalEmail(email) {
  const normalized = String(email ?? "").trim().toLowerCase()

  if (!normalized) {
    return false
  }

  return INTERNAL_EMAIL_SNIPPETS.some((snippet) => normalized.includes(snippet))
}

function isFlaggedInternalUser(user) {
  if (!user) {
    return false
  }

  const appMetadata = user.app_metadata ?? {}
  const userMetadata = user.user_metadata ?? {}

  return Boolean(
    appMetadata.is_internal ||
      appMetadata.is_test_account ||
      userMetadata.is_internal ||
      userMetadata.is_test_account,
  )
}

function isEmulatorSession() {
  if (typeof navigator === "undefined") {
    return false
  }

  return EMULATOR_USER_AGENT_PATTERN.test(navigator.userAgent)
}

function isLocalDevelopmentHost() {
  if (typeof window === "undefined") {
    return false
  }

  const hostname = window.location.hostname

  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "[::1]"
  )
}

export function shouldTrack(user) {
  if (import.meta.env.DEV) {
    return false
  }

  if (isLocalDevelopmentHost()) {
    return false
  }

  if (isEmulatorSession()) {
    return false
  }

  if (isAnalyticsDisabledInStorage()) {
    return false
  }

  if (isFlaggedInternalUser(user)) {
    return false
  }

  const email = user?.email?.toLowerCase() ?? ""

  if (email && hasInternalEmail(email)) {
    return false
  }

  return true
}
