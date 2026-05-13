/**
 * Same rules as server: optional; if present, 10 US digits after optional +1.
 * @returns {{ ok: boolean, value: string | null }}
 */
export function parseOptionalUsPhone(raw) {
  const trimmed = String(raw ?? "").trim()

  if (!trimmed) {
    return { ok: true, value: null }
  }

  const digitsOnly = trimmed.replace(/\D/g, "")
  let core = digitsOnly

  if (core.length === 11 && core.startsWith("1")) {
    core = core.slice(1)
  }

  if (core.length !== 10) {
    return { ok: false, value: null }
  }

  return { ok: true, value: trimmed }
}

export function digitsForTelHref(trimmedPhone) {
  if (!trimmedPhone) {
    return ""
  }

  let digits = String(trimmedPhone).replace(/\D/g, "")

  if (digits.length === 11 && digits.startsWith("1")) {
    digits = digits.slice(1)
  }

  if (digits.length !== 10) {
    return ""
  }

  return `+1${digits}`
}
