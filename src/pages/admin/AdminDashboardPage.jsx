import { useState } from "react"
import AdminAnalytics from "../../components/admin/AdminAnalytics"
import LeadDetailDrawer from "../../components/admin/LeadDetailDrawer"
import LeadMetrics from "../../components/admin/LeadMetrics"
import LeadsEmptyState from "../../components/admin/LeadsEmptyState"
import LeadsTable from "../../components/admin/LeadsTable"
import Button from "../../components/ui/Button"
import GlassCard from "../../components/ui/GlassCard"
import { useAdminAuth } from "../../hooks/useAdminAuth"
import { useConsultationLeads } from "../../hooks/useConsultationLeads"
import { usePageMeta } from "../../hooks/usePageMeta"
import { useSiteAnalytics } from "../../hooks/useSiteAnalytics"
import { trackIntroLinkSent, trackLeadStatusUpdated } from "../../lib/analytics"
import { sendIntroLinkEmail } from "../../lib/sendIntroLinkEmail"

const dashboardTabs = [
  { id: "leads", label: "Leads" },
  { id: "analytics", label: "Analytics" },
]

export default function AdminDashboardPage() {
  usePageMeta({
    title: "Admin Dashboard | Bryant Labs",
    description: "Private Bryant Labs admin dashboard.",
    path: "/admin",
    robots: "noindex, nofollow",
  })

  const { session, userEmail, signOut } = useAdminAuth()
  const {
    leads,
    loading,
    error,
    reloadLeads,
    updateLeadStatus,
    updateLeadNotes,
    markIntroLinkScheduled,
  } = useConsultationLeads()
  const {
    summary,
    loading: analyticsLoading,
    error: analyticsError,
    reloadAnalytics,
  } = useSiteAnalytics()
  const [activeTab, setActiveTab] = useState("leads")
  const [selectedLead, setSelectedLead] = useState(null)
  const [updatingLeadId, setUpdatingLeadId] = useState(null)
  const [savingNotesLeadId, setSavingNotesLeadId] = useState(null)
  const [sendingIntroLinkLeadId, setSendingIntroLinkLeadId] = useState(null)
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
      void trackLeadStatusUpdated({
        lead_id: lead.id,
        previous_status: lead.status,
        next_status: nextStatus,
      })
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

  const handleSendIntroLink = async (lead) => {
    const accessToken = session?.access_token

    if (!accessToken) {
      throw new Error("You must be signed in to send intro links.")
    }

    if (!lead.email) {
      throw new Error("This lead does not have an email address.")
    }

    setSendingIntroLinkLeadId(lead.id)

    try {
      await sendIntroLinkEmail({
        accessToken,
        leadId: lead.id,
        fullName: lead.full_name,
        email: lead.email,
      })

      const updatedLead = await markIntroLinkScheduled(lead.id)
      setSelectedLead((current) =>
        current?.id === updatedLead.id ? updatedLead : current,
      )
      void trackIntroLinkSent({ lead_id: lead.id })
    } finally {
      setSendingIntroLinkLeadId(null)
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

  const handleRefresh = () => {
    if (activeTab === "analytics") {
      reloadAnalytics()
      return
    }

    reloadLeads()
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-cyan/80">
            Bryant Labs Admin
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-gradient sm:text-4xl">
            {activeTab === "analytics" ? "Site analytics" : "Consultation leads"}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            {activeTab === "analytics"
              ? "Review lightweight first-party traffic, intake funnel activity, and recent conversion events."
              : "Track intake submissions, update pipeline status, and keep private follow-up notes in one place."}
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
          <GlassCard hover={false} className="w-full px-4 py-3 text-sm text-white/80 sm:w-auto">
            Signed in as{" "}
            <span className="break-all text-white sm:break-normal">{userEmail}</span>
          </GlassCard>
          <Button
            variant="secondary"
            onClick={handleRefresh}
            disabled={activeTab === "analytics" ? analyticsLoading : loading}
            className="w-full sm:w-auto"
          >
            Refresh
          </Button>
          <Button
            onClick={handleSignOut}
            disabled={signingOut}
            className="w-full sm:w-auto"
          >
            {signingOut ? "Signing out…" : "Sign out"}
          </Button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {dashboardTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`min-h-11 rounded-full px-4 py-2 text-sm font-medium transition ${
              activeTab === tab.id
                ? "bg-white text-ink"
                : "border border-white/10 bg-white/[0.04] text-white/75 hover:border-white/20 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "analytics" ? (
        <div className="mt-8">
          <AdminAnalytics
            summary={summary}
            loading={analyticsLoading}
            error={analyticsError}
          />
        </div>
      ) : (
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
      )}

      <LeadDetailDrawer
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
        onStatusChange={handleStatusChange}
        onSaveNotes={handleSaveNotes}
        onSendIntroLink={handleSendIntroLink}
        updatingStatus={updatingLeadId === selectedLead?.id}
        savingNotes={savingNotesLeadId === selectedLead?.id}
        sendingIntroLink={sendingIntroLinkLeadId === selectedLead?.id}
      />
    </div>
  )
}
