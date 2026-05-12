import { useState } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { useAdminAuth } from "../../hooks/useAdminAuth"
import AdminLayout from "./AdminLayout"
import Button from "../ui/Button"
import GlassCard from "../ui/GlassCard"

function AdminLoadingState() {
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

function AdminAccessDenied({ userEmail, onSignOut, signingOut }) {
  return (
    <AdminLayout>
      <div className="flex min-h-screen items-center justify-center px-6 py-16">
        <GlassCard hover={false} className="glow-ring w-full max-w-lg p-8 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-cyan/80">
            Bryant Labs Admin
          </p>
          <h1 className="mt-4 text-2xl font-semibold text-white">Access denied</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {userEmail
              ? `${userEmail} is not authorized for this dashboard.`
              : "This account is not authorized for this dashboard."}
          </p>
          <div className="mt-8">
            <Button onClick={onSignOut} disabled={signingOut} variant="secondary">
              {signingOut ? "Signing out…" : "Sign out"}
            </Button>
          </div>
        </GlassCard>
      </div>
    </AdminLayout>
  )
}

export default function ProtectedAdminRoute() {
  const { loading, isAuthenticated, isApprovedAdmin, userEmail, signOut } =
    useAdminAuth()
  const [signingOut, setSigningOut] = useState(false)

  if (loading) {
    return <AdminLoadingState />
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  if (!isApprovedAdmin) {
    const handleSignOut = async () => {
      setSigningOut(true)

      try {
        await signOut()
      } finally {
        setSigningOut(false)
      }
    }

    return (
      <AdminAccessDenied
        userEmail={userEmail}
        onSignOut={handleSignOut}
        signingOut={signingOut}
      />
    )
  }

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  )
}
