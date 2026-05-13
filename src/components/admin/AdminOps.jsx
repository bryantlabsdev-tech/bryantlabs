import { useMemo, useState } from "react"
import {
  deriveOpsCategory,
  deriveOpsErrorCode,
  extractAffectedIdentity,
  formatTimeAgo,
  lastIntakeIssueSummary,
  summarizeOpsHealth,
} from "../../lib/opsErrorPresentation"
import GlassCard from "../ui/GlassCard"
import OpsErrorDrawer from "./OpsErrorDrawer"

const STATUS_FILTERS = [
  { id: "unresolved", label: "Unresolved" },
  { id: "all", label: "All" },
  { id: "resolved", label: "Resolved" },
]

const SEVERITY_FILTERS = [
  { id: "all", label: "All severities" },
  { id: "error", label: "Errors" },
  { id: "warn", label: "Warnings" },
]

const CATEGORY_FILTERS = [
  { id: "all", label: "All areas" },
  { id: "intake", label: "Intake" },
  { id: "email", label: "Email" },
  { id: "auth", label: "Auth" },
  { id: "config", label: "Config" },
  { id: "analytics", label: "Analytics" },
  { id: "crm", label: "CRM" },
]

function chipClass(active) {
  return `min-h-10 rounded-full border px-3.5 py-2 text-xs font-medium transition sm:text-[13px] ${
    active
      ? "border-white/25 bg-white/[0.12] text-white"
      : "border-white/10 bg-white/[0.03] text-white/65 hover:border-white/18 hover:text-white/90"
  }`
}

function severityStripe(severity) {
  if (severity === "warn") {
    return "bg-amber-400/80"
  }

  return "bg-rose-400/80"
}

export default function AdminOps({
  errors,
  unresolvedCount,
  loading,
  error,
  resolvingErrorId,
  onResolveError,
  formatErrorTime,
}) {
  const [statusFilter, setStatusFilter] = useState("unresolved")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [drawerEntry, setDrawerEntry] = useState(null)
  const [resolveFlash, setResolveFlash] = useState("")

  const health = useMemo(
    () => summarizeOpsHealth({ unresolvedCount }),
    [unresolvedCount],
  )

  const intakePulse = useMemo(() => lastIntakeIssueSummary(errors), [errors])

  const filtered = useMemo(() => {
    return errors.filter((entry) => {
      if (statusFilter === "unresolved" && entry.resolved) {
        return false
      }

      if (statusFilter === "resolved" && !entry.resolved) {
        return false
      }

      if (severityFilter !== "all" && entry.severity !== severityFilter) {
        return false
      }

      if (categoryFilter !== "all" && deriveOpsCategory(entry) !== categoryFilter) {
        return false
      }

      return true
    })
  }, [errors, statusFilter, severityFilter, categoryFilter])

  const handleResolve = async (id, resolutionNote) => {
    setResolveFlash("")

    try {
      await onResolveError(id, resolutionNote)
      setDrawerEntry((current) => (current?.id === id ? null : current))
    } catch (resolveErr) {
      setResolveFlash(
        resolveErr?.message ??
          "Could not mark resolved. Run supabase/app_errors_resolution_note.sql if the column is missing.",
      )
    }
  }

  if (loading) {
    return (
      <GlassCard hover={false} className="px-6 py-16 text-center text-sm text-muted">
        Loading operational signals…
      </GlassCard>
    )
  }

  if (error) {
    return (
      <p
        className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100"
        role="alert"
      >
        {error}
      </p>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <GlassCard
        hover={false}
        className={`border p-5 sm:p-6 ${
          health.tone === "ok"
            ? "border-emerald-400/15 bg-emerald-500/[0.06]"
            : "border-amber-400/15 bg-amber-500/[0.06]"
        }`}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
          Operational summary
        </p>
        <h2 className="mt-2 text-lg font-semibold text-white sm:text-xl">{health.headline}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/75">{health.subline}</p>
        {intakePulse ? (
          <p className="mt-4 text-xs leading-relaxed text-white/55">
            Last logged intake event:{" "}
            <span className="font-mono text-white/80">{intakePulse.code}</span> ·{" "}
            <span className="text-white/70">{intakePulse.ago}</span>
            {intakePulse.resolved ? (
              <span className="text-emerald-200/80"> · since resolved</span>
            ) : unresolvedCount > 0 ? (
              <span className="text-amber-200/85"> · review if issues persist</span>
            ) : null}
          </p>
        ) : (
          <p className="mt-4 text-xs text-white/45">No intake-tagged events in the current window.</p>
        )}
      </GlassCard>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <GlassCard hover={false} className="p-4 sm:p-5">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">Unresolved</p>
          <p className="mt-2 text-2xl font-semibold text-white sm:text-3xl">{unresolvedCount}</p>
          <p className="mt-1 text-[11px] text-white/40">Across all time (not only this list)</p>
        </GlassCard>
        <GlassCard hover={false} className="p-4 sm:p-5">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">Loaded events</p>
          <p className="mt-2 text-2xl font-semibold text-white sm:text-3xl">{errors.length}</p>
          <p className="mt-1 text-[11px] text-white/40">Most recent batch from the server</p>
        </GlassCard>
        <GlassCard hover={false} className="p-4 sm:p-5">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">Matching filters</p>
          <p className="mt-2 text-2xl font-semibold text-white sm:text-3xl">{filtered.length}</p>
          <p className="mt-1 text-[11px] text-white/40">Shown in the list below</p>
        </GlassCard>
      </div>

      <GlassCard hover={false} className="p-4 sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Operational issues</h2>
            <p className="mt-1 text-sm text-muted">
              Tap a row for the full cockpit: hints, Supabase context, and raw JSON.
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/40">Status</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {STATUS_FILTERS.map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  className={chipClass(statusFilter === chip.id)}
                  onClick={() => setStatusFilter(chip.id)}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/40">Severity</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {SEVERITY_FILTERS.map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  className={chipClass(severityFilter === chip.id)}
                  onClick={() => setSeverityFilter(chip.id)}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/40">Area</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {CATEGORY_FILTERS.map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  className={chipClass(categoryFilter === chip.id)}
                  onClick={() => setCategoryFilter(chip.id)}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-white/[0.06] bg-black/25 px-4 py-10 text-center sm:px-6">
            <p className="text-sm font-medium text-white/90">
              {statusFilter === "unresolved"
                ? "No unresolved operational issues in this view."
                : "No events match these filters."}
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted">
              {unresolvedCount === 0 && statusFilter === "unresolved"
                ? "All monitored intake routes are clear in the unresolved queue. Keep using test intakes after deploys."
                : "Try clearing filters or loading more from the database if you expect older rows."}
            </p>
          </div>
        ) : (
          <ul className="mt-8 space-y-3">
            {filtered.map((entry) => {
              const code = deriveOpsErrorCode(entry)
              const category = deriveOpsCategory(entry)
              const { email, emailDomain } = extractAffectedIdentity(entry)
              const who = email ?? (emailDomain ? `@${emailDomain}` : null)

              return (
                <li key={entry.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setResolveFlash("")
                      setDrawerEntry(entry)
                    }}
                    className="flex w-full rounded-2xl border border-white/10 bg-black/25 text-left transition hover:border-white/18 hover:bg-white/[0.04]"
                  >
                    <div className={`w-1 shrink-0 rounded-l-2xl ${severityStripe(entry.severity)}`} />
                    <div className="min-w-0 flex-1 px-4 py-4 sm:px-5 sm:py-4">
                      <div className="flex flex-wrap items-center gap-2 gap-y-2">
                        <span className="font-mono text-[11px] font-semibold uppercase tracking-wide text-cyan-200/90 sm:text-xs">
                          {code}
                        </span>
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-white/60 sm:text-[11px]">
                          {category}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] sm:text-[11px] ${
                            entry.severity === "warn"
                              ? "border border-amber-400/20 bg-amber-500/10 text-amber-100"
                              : "border border-rose-400/20 bg-rose-500/10 text-rose-100"
                          }`}
                        >
                          {entry.severity}
                        </span>
                        {entry.resolved ? (
                          <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-emerald-100 sm:text-[11px]">
                            Resolved
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm leading-snug text-white/88">{entry.message}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted sm:text-xs">
                        <span>{formatTimeAgo(entry.created_at)}</span>
                        <span className="text-white/45">{formatErrorTime(entry.created_at)}</span>
                        {who ? <span className="truncate text-cyan-200/70">Lead: {who}</span> : null}
                      </div>
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </GlassCard>

      <OpsErrorDrawer
        entry={drawerEntry}
        open={Boolean(drawerEntry)}
        onClose={() => {
          setResolveFlash("")
          setDrawerEntry(null)
        }}
        onResolve={handleResolve}
        resolving={resolvingErrorId === drawerEntry?.id}
        formatErrorTime={formatErrorTime}
        resolveBanner={resolveFlash}
      />
    </div>
  )
}
