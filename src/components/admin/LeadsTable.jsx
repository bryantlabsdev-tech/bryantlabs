import { Search } from "lucide-react"
import { useMemo, useState } from "react"
import { LEAD_STATUSES, normalizeLeadStatus } from "../../config/admin"
import {
  formatFollowUpLine,
  formatLastContactedLine,
  getLeadNextAction,
  getLeadSurfaceBadges,
} from "../../lib/crmLeadHelpers"
import Button from "../ui/Button"
import LeadSurfaceBadges from "./LeadSurfaceBadges"
import LeadsEmptyState from "./LeadsEmptyState"
import StatusSelect from "./StatusSelect"

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
})

function formatDate(value) {
  if (!value) {
    return "—"
  }

  return dateFormatter.format(new Date(value))
}

function truncateText(value, maxLength = 72) {
  if (!value) {
    return "—"
  }

  if (value.length <= maxLength) {
    return value
  }

  return `${value.slice(0, maxLength - 1)}…`
}

function matchesSearch(lead, query) {
  if (!query) {
    return true
  }

  const haystack = [
    lead.full_name,
    lead.email,
    lead.phone,
    lead.company_brand,
    lead.selected_session_name,
    lead.project_summary,
    lead.platform_needed,
    lead.budget_range,
    lead.desired_timeline,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()

  return haystack.includes(query)
}

function LeadCard({ lead, updatingLeadId, onLeadSelect, onStatusChange }) {
  const surfaceBadges = getLeadSurfaceBadges(lead)
  const nextAction = getLeadNextAction(lead)
  const followUpLine = formatFollowUpLine(lead)
  const lastContactedLine = formatLastContactedLine(lead)

  return (
    <button
      type="button"
      onClick={() => onLeadSelect(lead)}
      className="w-full rounded-3xl border border-white/10 bg-black/20 p-4 text-left transition hover:border-white/15 hover:bg-white/[0.04] sm:p-5"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-base font-semibold text-white">{lead.full_name}</p>
          <p className="mt-1 break-all text-sm text-muted">{lead.email}</p>
          <p className="mt-2 text-sm font-medium text-white/85">
            {lead.company_brand?.trim() ? lead.company_brand : "—"}
            <span className="ml-1.5 font-normal text-muted">· company</span>
          </p>
        </div>
        <p className="shrink-0 text-xs text-muted">{formatDate(lead.created_at)}</p>
      </div>

      <p className="mt-3 text-xs font-medium leading-snug text-cyan-100/90">{nextAction}</p>

      <div className="mt-2">
        <LeadSurfaceBadges badges={surfaceBadges} />
      </div>

      <div className="mt-4 grid gap-2 text-xs text-white/65">
        <p>
          <span className="text-muted">Follow-up:</span>{" "}
          <span className={followUpLine?.includes("overdue") ? "text-rose-200/90" : "text-white/80"}>
            {followUpLine ?? "Not set"}
          </span>
        </p>
        <p>
          <span className="text-muted">Last contact:</span>{" "}
          <span className="text-white/80">{lastContactedLine}</span>
        </p>
      </div>

      <div className="mt-4 grid gap-3 text-sm text-white/75">
        <p>
          <span className="text-muted">Session:</span> {lead.selected_session_name}
        </p>
        <p>
          <span className="text-muted">Summary:</span> {truncateText(lead.project_summary, 120)}
        </p>
      </div>

      <div className="mt-4" onClick={(event) => event.stopPropagation()}>
        <StatusSelect
          value={lead.status}
          disabled={updatingLeadId === lead.id}
          onChange={(nextStatus) => onStatusChange(lead, nextStatus)}
        />
      </div>
    </button>
  )
}

export default function LeadsTable({
  leads,
  hasMore,
  loadingMore,
  onLoadMore,
  updatingLeadId,
  onLeadSelect,
  onStatusChange,
}) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredLeads = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    return leads.filter((lead) => {
      const matchesStatus =
        statusFilter === "all" ||
        normalizeLeadStatus(lead.status) === statusFilter

      return matchesSearch(lead, normalizedQuery) && matchesStatus
    })
  }, [leads, searchQuery, statusFilter])

  const hasFilters = searchQuery.trim().length > 0 || statusFilter !== "all"

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative block min-w-0 w-full sm:max-w-md">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search leads by name, email, phone, company, or summary"
            className="w-full rounded-2xl border border-white/10 bg-black/20 py-3 pl-11 pr-4 text-base text-white outline-none transition placeholder:text-white/30 focus:border-indigo-400/50 sm:text-sm"
          />
        </label>

        <label className="flex w-full min-w-0 flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
          <span className="text-sm text-muted">Status</span>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="min-h-11 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-base text-white outline-none transition focus:border-indigo-400/50 sm:min-w-[12rem] sm:text-sm"
          >
            <option value="all" className="bg-elevated">
              All statuses
            </option>
            {LEAD_STATUSES.map((status) => (
              <option key={status.value} value={status.value} className="bg-elevated">
                {status.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {filteredLeads.length === 0 ? (
        <LeadsEmptyState hasFilters={hasFilters && leads.length > 0} />
      ) : (
        <>
          <div className="grid gap-4 md:hidden">
            {filteredLeads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                updatingLeadId={updatingLeadId}
                onLeadSelect={onLeadSelect}
                onStatusChange={onStatusChange}
              />
            ))}
          </div>

          <div className="hidden overflow-hidden rounded-3xl border border-white/10 bg-black/20 md:block">
            <div className="max-h-[70vh] overflow-x-auto overflow-y-auto overscroll-x-contain">
              <table className="min-w-[64rem] w-full divide-y divide-white/10 text-left text-sm">
                <thead className="sticky top-0 z-10 bg-elevated/95 text-xs uppercase tracking-[0.18em] text-muted backdrop-blur-xl">
                  <tr>
                    <th className="px-4 py-4 font-medium">Created</th>
                    <th className="px-4 py-4 font-medium">Name</th>
                    <th className="px-4 py-4 font-medium">Email</th>
                    <th className="px-4 py-4 font-medium">Company</th>
                    <th className="px-4 py-4 font-medium">Session</th>
                    <th className="px-4 py-4 font-medium">Summary</th>
                    <th className="px-4 py-4 font-medium">Platform</th>
                    <th className="px-4 py-4 font-medium">Timeline</th>
                    <th className="px-4 py-4 font-medium">Budget</th>
                    <th className="min-w-[11rem] px-4 py-4 font-medium">Pipeline</th>
                    <th className="min-w-[9rem] px-4 py-4 font-medium">Next action</th>
                    <th className="min-w-[10rem] px-4 py-4 font-medium">Touch</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/8">
                  {filteredLeads.map((lead) => {
                    const surfaceBadges = getLeadSurfaceBadges(lead)
                    const nextAction = getLeadNextAction(lead)
                    const followUpLine = formatFollowUpLine(lead)
                    const lastContactedLine = formatLastContactedLine(lead)

                    return (
                      <tr
                        key={lead.id}
                        onClick={() => onLeadSelect(lead)}
                        className="cursor-pointer transition hover:bg-white/[0.05]"
                      >
                        <td className="px-4 py-4 whitespace-nowrap text-muted">
                          {formatDate(lead.created_at)}
                        </td>
                        <td className="px-4 py-4 font-medium text-white">
                          {lead.full_name}
                        </td>
                        <td className="px-4 py-4 text-white/80">{lead.email}</td>
                        <td className="px-4 py-4 text-white/80">
                          {lead.company_brand || "—"}
                        </td>
                        <td className="px-4 py-4 text-white/80">
                          {lead.selected_session_name}
                        </td>
                        <td className="max-w-xs px-4 py-4 text-white/70">
                          {truncateText(lead.project_summary)}
                        </td>
                        <td className="px-4 py-4 text-white/80">
                          {lead.platform_needed || "—"}
                        </td>
                        <td className="px-4 py-4 text-white/80">
                          {lead.desired_timeline || "—"}
                        </td>
                        <td className="px-4 py-4 text-white/80">
                          {lead.budget_range || "—"}
                        </td>
                        <td className="px-4 py-4 align-top">
                          <div className="mb-2">
                            <LeadSurfaceBadges badges={surfaceBadges} />
                          </div>
                          <StatusSelect
                            value={lead.status}
                            disabled={updatingLeadId === lead.id}
                            onChange={(nextStatus) => onStatusChange(lead, nextStatus)}
                          />
                        </td>
                        <td className="px-4 py-4 align-top text-sm leading-snug text-cyan-100/85">
                          {nextAction}
                        </td>
                        <td className="px-4 py-4 align-top text-xs leading-relaxed">
                          <p
                            className={
                              followUpLine?.includes("overdue")
                                ? "font-medium text-rose-200/90"
                                : "text-white/75"
                            }
                          >
                            {followUpLine ?? "No follow-up set"}
                          </p>
                          <p className="mt-1.5 text-muted">{lastContactedLine}</p>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {hasMore ? (
        <div className="flex justify-center">
          <Button
            variant="secondary"
            type="button"
            onClick={() => void onLoadMore()}
            disabled={loadingMore}
            className="min-w-[10.5rem]"
          >
            {loadingMore ? "Loading…" : "Load more"}
          </Button>
        </div>
      ) : null}

      <p className="text-xs text-muted">
        {hasFilters ? (
          <>
            Showing {filteredLeads.length} matching of {leads.length} loaded
          </>
        ) : (
          <>Showing {filteredLeads.length} of {leads.length} loaded</>
        )}
        {hasMore ? " · more available" : " · end of list"}
        {" · "}
        <span className="text-white/35">Newest first</span>
      </p>
    </div>
  )
}
