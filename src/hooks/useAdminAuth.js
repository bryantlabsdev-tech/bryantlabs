import { useCallback, useEffect, useState } from "react"
import { isApprovedAdminEmail } from "../config/admin"
import { getSupabaseClient } from "../lib/supabaseClient"

export function useAdminAuth() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = getSupabaseClient()
    let active = true

    supabase.auth.getSession().then(({ data }) => {
      if (active) {
        setSession(data.session ?? null)
        setLoading(false)
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setLoading(false)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  const userEmail = session?.user?.email ?? ""
  const isAuthenticated = Boolean(session)
  const isApprovedAdmin = isApprovedAdminEmail(userEmail)

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

  const signOut = useCallback(async () => {
    const supabase = getSupabaseClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
      throw error
    }
  }, [])

  return {
    session,
    userEmail,
    loading,
    isAuthenticated,
    isApprovedAdmin,
    signInWithMagicLink,
    signOut,
  }
}
