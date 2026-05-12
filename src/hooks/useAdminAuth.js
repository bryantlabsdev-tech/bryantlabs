import { useCallback, useEffect, useRef, useState } from "react"
import { isApprovedAdminEmail } from "../config/admin"
import { getSupabaseClient } from "../lib/supabaseClient"

function isSessionExpired(session) {
  if (!session?.expires_at) {
    return false
  }

  return Date.now() >= session.expires_at * 1000
}

export function useAdminAuth() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authNotice, setAuthNotice] = useState(null)
  const hadSessionRef = useRef(false)

  const clearSession = useCallback(() => {
    setSession(null)
    hadSessionRef.current = false
  }, [])

  const signOut = useCallback(async () => {
    const supabase = getSupabaseClient()

    try {
      const { error } = await supabase.auth.signOut({ scope: "global" })

      if (error) {
        throw error
      }
    } catch {
      try {
        await supabase.auth.signOut({ scope: "local" })
      } catch {
        // Local cleanup is best-effort when global sign-out fails.
      }
    } finally {
      clearSession()
    }
  }, [clearSession])

  const signInWithMagicLink = useCallback(async (email) => {
    const supabase = getSupabaseClient()
    const redirectTo = `${window.location.origin}/admin`

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: redirectTo,
        shouldCreateUser: false,
      },
    })

    if (error) {
      throw error
    }
  }, [])

  useEffect(() => {
    const supabase = getSupabaseClient()
    let active = true

    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) {
        return
      }

      const nextSession = data.session ?? null

      if (error || isSessionExpired(nextSession)) {
        clearSession()
        setAuthNotice(error || isSessionExpired(nextSession) ? "session_expired" : null)
        setLoading(false)
        return
      }

      setSession(nextSession)
      hadSessionRef.current = Boolean(nextSession)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!active) {
        return
      }

      if (event === "SIGNED_OUT" && hadSessionRef.current) {
        setAuthNotice("session_expired")
      }

      if (event === "TOKEN_REFRESHED" && isSessionExpired(nextSession)) {
        void signOut()
        setAuthNotice("session_expired")
        setLoading(false)
        return
      }

      if (isSessionExpired(nextSession)) {
        void signOut()
        setAuthNotice("session_expired")
        setLoading(false)
        return
      }

      setSession(nextSession)
      hadSessionRef.current = Boolean(nextSession)
      setLoading(false)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [clearSession, signOut])

  useEffect(() => {
    if (!session?.expires_at) {
      return undefined
    }

    const timeoutMs = Math.max(session.expires_at * 1000 - Date.now(), 0)

    const timeoutId = window.setTimeout(() => {
      void signOut()
      setAuthNotice("session_expired")
    }, timeoutMs)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [session, signOut])

  const userEmail = session?.user?.email ?? ""
  const isAuthenticated = Boolean(session)
  const isApprovedAdmin = isApprovedAdminEmail(userEmail)

  const clearAuthNotice = useCallback(() => {
    setAuthNotice(null)
  }, [])

  return {
    session,
    userEmail,
    loading,
    authNotice,
    isAuthenticated,
    isApprovedAdmin,
    signInWithMagicLink,
    signOut,
    clearAuthNotice,
  }
}
