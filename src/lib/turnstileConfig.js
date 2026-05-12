const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY?.trim() ?? ""

export function isTurnstileConfigured() {
  return Boolean(siteKey)
}

export function getTurnstileSiteKey() {
  return siteKey
}
