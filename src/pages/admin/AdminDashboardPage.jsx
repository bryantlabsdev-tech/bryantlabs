import { useState } from "react"
import { useAdminAuth } from "../../hooks/useAdminAuth"
import { useConsultationLeads } from "../../hooks/useConsultationLeads"
import LeadDetailDrawer from "../../components/admin/LeadDetailDrawer"
import LeadMetrics from "../../components/admin/LeadMetrics"
import LeadsEmptyState from "../../components/admin/LeadsEmptyState"
import LeadsTable from "../../components/admin/LeadsTable"
import Button from "../../components/ui/Button"
import GlassCard from "../../components/ui/GlassCard"

export default function AdminDashboardPage() {
  const { userEmail, signOut } = useAdminAuth()
  const {
    leads,
    loading,
    error,
    reloadLeads,
    updateLeadStatus,
    updateLeadNotes,
  } = useConsultationLeads()
  const [selectedLead, setSelectedLead] = useState(null)
  const [updatingLeadId, setUpdatingLeadId] = useState(null)
  const [savingNotesLeadId, setSavingNotesLeadId] = useState(null)
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

  const handleSaveNotes = async (lead, adminNotes) => {
    setSavingNotesLeadId(lead.id)

    try {
      const updatedLead = await updateLeadNotes(lead.id, adminNotes)
      setSelectedLead((current) =>
        current?.id === updatedLead.id ? updatedLead : current,
      )
    } finally {
      setSavingNotesLeadId(null)
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
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-cyan/80">
            Bryant Labs Admin
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-gradient sm:text-4xl">
            Consultation leads
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Track intake submissions, update pipeline status, and keep private
            follow-up notes in one place.
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

      <div className="mt-8 space-y-6">
        {!loading ? <LeadMetrics leads={leads} /> : null}

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
        ) : leads.length === 0 ? (
          <LeadsEmptyState />
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
        onStatusChange={handleStatusChange}
        onSaveNotes={handleSaveNotes}
        updatingStatus={updatingLeadId === selectedLead?.id}
        savingNotes={savingNotesLeadId === selectedLead?.id}
      />
    </div>
  )
}
