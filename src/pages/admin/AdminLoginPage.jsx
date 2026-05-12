import { useState } from "react"
import { Navigate } from "react-router-dom"
import { ADMIN_EMAIL } from "../../config/admin"
import { useAdminAuth } from "../../hooks/useAdminAuth"
import AdminLayout from "../../components/admin/AdminLayout"
import Button from "../../components/ui/Button"
import GlassCard from "../../components/ui/GlassCard"
import { FormField } from "../../components/ui/FormField"

export default function AdminLoginPage() {
  const { loading, isAuthenticated, signInWithMagicLink } = useAdminAuth()
  const [email, setEmail] = useState(ADMIN_EMAIL)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  if (!loading && isAuthenticated) {
    return <Navigate to="/admin" replace />
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setMessage("")
    setError("")

    try {
      await signInWithMagicLink(email)
      setMessage("Check your inbox for the Bryant Labs admin sign-in link.")
    } catch (submitError) {
      setError(
        submitError?.message ??
          "We could not send a sign-in link. Confirm the email is approved for admin access.",
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AdminLayout>
      <div className="flex min-h-screen items-center justify-center px-6 py-16">
        <GlassCard hover={false} className="glow-ring w-full max-w-md p-8">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-cyan/80">
            Bryant Labs
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-gradient">Admin</h1>
          <p className="mt-2 text-sm text-muted">Admin access only.</p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <FormField
              label="Admin email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@bryantlabs.dev"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            {message ? (
              <p className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                {message}
              </p>
            ) : null}

            {error ? (
              <p
                className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100"
                role="alert"
              >
                {error}
              </p>
            ) : null}

            <Button
              type="submit"
              className="w-full"
              disabled={submitting || loading}
            >
              {submitting ? "Sending link…" : "Email magic link"}
            </Button>
          </form>
        </GlassCard>
      </div>
    </AdminLayout>
  )
}
