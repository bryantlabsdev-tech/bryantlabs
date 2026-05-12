import { useCallback, useEffect, useState } from "react"
import { getSupabaseClient } from "../lib/supabaseClient"

const errorTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
})

function formatErrorTime(value) {
  return errorTimeFormatter.format(new Date(value))
}

async function fetchAppErrors() {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("app_errors")
    .select("id, created_at, source, severity, message, details, resolved, resolved_at")
    .order("created_at", { ascending: false })
    .limit(10)

  if (error) {
    throw error
  }

  return data ?? []
}

async function fetchUnresolvedErrorCount() {
  const supabase = getSupabaseClient()
  const { count, error } = await supabase
    .from("app_errors")
    .select("id", { count: "exact", head: true })
    .eq("resolved", false)

  if (error) {
    throw error
  }

  return count ?? 0
}

export function useAppErrors() {
  const [errors, setErrors] = useState([])
  const [unresolvedCount, setUnresolvedCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [resolvingErrorId, setResolvingErrorId] = useState(null)

  const loadErrors = useCallback(async ({ showLoading = true } = {}) => {
    if (showLoading) {
      setLoading(true)
    }

    setError("")

    try {
      const [nextErrors, nextUnresolvedCount] = await Promise.all([
        fetchAppErrors(),
        fetchUnresolvedErrorCount(),
      ])

      setErrors(nextErrors)
      setUnresolvedCount(nextUnresolvedCount)
    } catch (loadError) {
      setError(loadError?.message ?? "We could not load operational errors right now.")
      setErrors([])
      setUnresolvedCount(0)
    } finally {
      if (showLoading) {
        setLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    let active = true

    async function loadInitialErrors() {
      try {
        const [nextErrors, nextUnresolvedCount] = await Promise.all([
          fetchAppErrors(),
          fetchUnresolvedErrorCount(),
        ])

        if (!active) {
          return
        }

        setErrors(nextErrors)
        setUnresolvedCount(nextUnresolvedCount)
        setError("")
      } catch (loadError) {
        if (!active) {
          return
        }

        setError(
          loadError?.message ?? "We could not load operational errors right now.",
        )
        setErrors([])
        setUnresolvedCount(0)
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void loadInitialErrors()

    return () => {
      active = false
    }
  }, [])

  const resolveError = useCallback(async (errorId) => {
    setResolvingErrorId(errorId)

    try {
      const supabase = getSupabaseClient()
      const resolvedAt = new Date().toISOString()
      const { data, error: updateError } = await supabase
        .from("app_errors")
        .update({
          resolved: true,
          resolved_at: resolvedAt,
        })
        .eq("id", errorId)
        .select("id, created_at, source, severity, message, details, resolved, resolved_at")
        .single()

      if (updateError) {
        throw updateError
      }

      setErrors((current) =>
        current.map((entry) => (entry.id === data.id ? data : entry)),
      )
      setUnresolvedCount((current) => Math.max(0, current - 1))
    } finally {
      setResolvingErrorId(null)
    }
  }, [])

  return {
    errors,
    unresolvedCount,
    loading,
    error,
    resolvingErrorId,
    reloadErrors: () => loadErrors({ showLoading: true }),
    resolveError,
    formatErrorTime,
  }
}
