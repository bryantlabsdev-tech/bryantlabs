import { useState } from "react"
import { useAdminAuth } from "../../hooks/useAdminAuth"
import { useConsultationLeads } from "../../hooks/useConsultationLeads"
import LeadDetailDrawer from "../../components/admin/LeadDetailDrawer"
import LeadsTable from "../../components/admin/LeadsTable"
import Button from "../../components/ui/Button"
import GlassCard from "../../components/ui/GlassCard"

export default function AdminDashboardPage() {
  const { userEmail, signOut } = useAdminAuth()
  const { leads, loading, error, reloadLeads, updateLeadStatus } =
    useConsultationLeads()
  const [selectedLead, setSelectedLead] = useState(null)
  const [updatingLeadId, setUpdatingLeadId] = useState(null)
  const [statusError, setStatusError] = useState("")
  const [signingOut, setSigningOut] = useState(false)

  const handleStatusChange = async (lead, nextStatus) => {
    if (lead.status === nextStatus) {
      return
    }

    setUpdatingLeadId(lead.id)
    setStatusError("")

    try {
      const updatedLead = await updateLeadStatus(lead.id, nextStatus)
      setSelectedLead((current) =>
        current?.id === updatedLead.id ? updatedLead : current,
      )
    } catch (updateError) {
      setStatusError(
        updateError?.message ?? "We could not update this lead status.",
      )
    } finally {
      setUpdatingLeadId(null)
    }
  }

  const handleSignOut = async () => {
    setSigningOut(true)

    try {
      await signOut()
    } finally {
      setSigningOut(false)
    }
  }

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-10 lg:px-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-cyan/80">
            Bryant Labs Admin
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-gradient">
            Consultation leads
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Review intake submissions, update pipeline status, and open a lead
            for full project details.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <GlassCard hover={false} className="px-4 py-3 text-sm text-white/80">
            Signed in as <span className="text-white">{userEmail}</span>
          </GlassCard>
          <Button
            variant="secondary"
            onClick={reloadLeads}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button onClick={handleSignOut} disabled={signingOut}>
            {signingOut ? "Signing out…" : "Sign out"}
          </Button>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {error ? (
          <p
            className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        {statusError ? (
          <p
            className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100"
            role="alert"
          >
            {statusError}
          </p>
        ) : null}

        {loading ? (
          <GlassCard hover={false} className="px-6 py-16 text-center text-sm text-muted">
            Loading leads…
          </GlassCard>
        ) : (
          <LeadsTable
            leads={leads}
            updatingLeadId={updatingLeadId}
            onLeadSelect={setSelectedLead}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>

      <LeadDetailDrawer
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
      />
    </div>
  )
}
