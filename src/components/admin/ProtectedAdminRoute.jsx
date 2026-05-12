import { useEffect, useRef } from "react"
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom"
import { useAdminAuth } from "../../hooks/useAdminAuth"
import AdminLayout from "./AdminLayout"
import Button from "../ui/Button"
import GlassCard from "../ui/GlassCard"
import { usePageMeta } from "../../hooks/usePageMeta"

function AdminLoadingState() {
  usePageMeta({
    title: "Admin | Bryant Labs",
    description: "Private Bryant Labs admin access.",
    path: "/admin",
    robots: "noindex, nofollow",
  })

  return (
    <AdminLayout>
      <div className="flex min-h-screen items-center justify-center px-6">
        <GlassCard hover={false} className="glow-ring px-8 py-10 text-center">
          <p className="text-sm text-muted">Checking admin session…</p>
        </GlassCard>
      </div>
    </AdminLayout>
  )
}

function AdminAccessDenied({ userEmail, onSignOut, signingOut, message }) {
  usePageMeta({
    title: "Access Denied | Bryant Labs Admin",
    description: "Private Bryant Labs admin access.",
    path: "/admin",
    robots: "noindex, nofollow",
  })

  return (
    <AdminLayout>
      <div className="flex min-h-screen items-center justify-center px-6 py-16">
        <GlassCard hover={false} className="glow-ring w-full max-w-lg p-8 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-cyan/80">
            Bryant Labs Admin
          </p>
          <h1 className="mt-4 text-2xl font-semibold text-white">Access denied</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {message ??
              (userEmail
                ? `${userEmail} is not authorized for this dashboard.`
                : "This account is not authorized for this dashboard.")}
          </p>
          <div className="mt-8">
            <Button onClick={onSignOut} disabled={signingOut} variant="secondary">
              {signingOut ? "Signing out…" : "Return to sign in"}
            </Button>
          </div>
        </GlassCard>
      </div>
    </AdminLayout>
  )
}

export default function ProtectedAdminRoute() {
  const {
    loading,
    isAuthenticated,
    isApprovedAdmin,
    userEmail,
    signOut,
    authNotice,
    clearAuthNotice,
  } = useAdminAuth()
  const location = useLocation()
  const navigate = useNavigate()
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
    let active = true

    const denyAccess = async () => {
      try {
        await signOut()
      } catch {
        // Best-effort sign-out before returning to login.
      }

      if (!active) {
        return
      }

      navigate("/admin/login", {
        replace: true,
        state: {
          reason: "access_denied",
          email: userEmail,
        },
      })
    }

    void denyAccess()

    return () => {
      active = false
    }
  }, [isApprovedAdmin, isAuthenticated, loading, navigate, signOut, userEmail])

  if (loading) {
    return <AdminLoadingState />
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{
          reason:
            authNotice === "session_expired"
              ? "session_expired"
              : location.state?.reason,
        }}
      />
    )
  }

  if (!isApprovedAdmin) {
    return (
      <AdminAccessDenied
        userEmail={userEmail}
        signingOut
        onSignOut={() => {}}
        message="This account is not authorized for the Bryant Labs admin dashboard."
      />
    )
  }

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  )
}
