import { useEffect, useRef, useState } from "react"
import { Navigate, useLocation } from "react-router-dom"
import AdminLayout from "../../components/admin/AdminLayout"
import Button from "../../components/ui/Button"
import GlassCard from "../../components/ui/GlassCard"
import { FormField } from "../../components/ui/FormField"
import { CLIENT_ADMIN_EMAIL, isApprovedAdminEmail } from "../../config/admin"
import { useAdminAuth } from "../../hooks/useAdminAuth"
import { usePageMeta } from "../../hooks/usePageMeta"

const loginErrorMessages = {
  invalid_email:
    "Use your approved Bryant Labs admin email. This address is not authorized for admin access.",
  magic_link_failed:
    "We could not send a sign-in link. Confirm the email is approved for admin access and try again.",
  access_denied:
    "Access denied. This account is not authorized for the Bryant Labs admin dashboard.",
  session_expired:
    "Your admin session expired. Sign in again with your approved Bryant Labs admin email.",
  misconfigured:
    "Admin sign-in is not configured. Set VITE_ADMIN_EMAIL in the deployment environment.",
}

function resolveLoginError(reason) {
  if (!reason) {
    return ""
  }

  return loginErrorMessages[reason] ?? loginErrorMessages.magic_link_failed
}

export default function AdminLoginPage() {
  usePageMeta({
    title: "Admin Sign In | Bryant Labs",
    description: "Private Bryant Labs admin access.",
    path: "/admin/login",
    robots: "noindex, nofollow",
  })

  const location = useLocation()
  const {
    loading,
    isAuthenticated,
    isApprovedAdmin,
    signInWithMagicLink,
    signOut,
    authNotice,
    clearAuthNotice,
  } = useAdminAuth()
  const [email, setEmail] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [linkSent, setLinkSent] = useState(false)
  const [formErrorReason, setFormErrorReason] = useState("")
  const denyAccessRef = useRef(false)

  useEffect(() => {
    if (authNotice) {
      clearAuthNotice()
    }
  }, [authNotice, clearAuthNotice])

  useEffect(() => {
    if (loading || !isAuthenticated || isApprovedAdmin || denyAccessRef.current) {
      return undefined
    }

    denyAccessRef.current = true

    void signOut()
  }, [isApprovedAdmin, isAuthenticated, loading, signOut])

  if (!loading && isAuthenticated && isApprovedAdmin) {
    return <Navigate to="/admin" replace />
  }

  const noticeReason = location.state?.reason ?? authNotice
  const errorReason = formErrorReason || noticeReason
  const errorMessage = resolveLoginError(errorReason)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setLinkSent(false)
    setFormErrorReason("")

    const normalizedEmail = email.trim()

    if (!CLIENT_ADMIN_EMAIL) {
      setFormErrorReason("misconfigured")
      setSubmitting(false)
      return
    }

    if (!isApprovedAdminEmail(normalizedEmail)) {
      setFormErrorReason("invalid_email")
      setSubmitting(false)
      return
    }

    try {
      await signInWithMagicLink(normalizedEmail)
      setLinkSent(true)
    } catch {
      setFormErrorReason("magic_link_failed")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AdminLayout>
      <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 sm:py-16">
        <GlassCard hover={false} className="glow-ring w-full max-w-md p-6 sm:p-8">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-cyan/80">
            Bryant Labs
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-gradient">Admin</h1>
          <p className="mt-2 text-sm text-muted">Admin access only.</p>
          <p className="mt-1 text-sm text-muted">
            Use your approved Bryant Labs admin email.
          </p>

          {loading ? (
            <p className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-muted">
              Checking admin session…
            </p>
          ) : null}

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <FormField
              label="Admin email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="projects@bryantlabs.dev"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={submitting || loading || linkSent}
            />

            {linkSent ? (
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                <p className="font-medium">Check your inbox</p>
                <p className="mt-2 leading-relaxed">
                  We sent a Bryant Labs admin sign-in link to {email.trim()}. Open it on this
                  device to continue to the dashboard.
                </p>
              </div>
            ) : null}

            {errorMessage ? (
              <p
                className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100"
                role="alert"
              >
                {errorMessage}
              </p>
            ) : null}

            <Button
              type="submit"
              className="w-full"
              disabled={submitting || loading || linkSent}
            >
              {submitting ? "Sending magic link…" : "Email magic link"}
            </Button>
          </form>
        </GlassCard>
      </div>
    </AdminLayout>
  )
}
