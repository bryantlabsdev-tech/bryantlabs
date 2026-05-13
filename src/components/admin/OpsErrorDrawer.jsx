import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"
import { AlertTriangle, Inbox, Mail, Server, Settings2, Shield, Sparkles, X } from "lucide-react"
import {
  deriveOpsCategory,
  deriveOpsErrorCode,
  extractAffectedIdentity,
  formatTimeAgo,
  routeLabelFromSource,
} from "../../lib/opsErrorPresentation"
import Button from "../ui/Button"
import OpsJsonBlock from "./OpsJsonBlock"

const categoryMeta = {
  intake: { label: "Intake", Icon: Inbox },
  email: { label: "Email", Icon: Mail },
  auth: { label: "Auth", Icon: Shield },
  config: { label: "Config", Icon: Settings2 },
  analytics: { label: "Analytics", Icon: Sparkles },
  crm: { label: "CRM", Icon: Server },
}

function Section({ eyebrow, title, children }) {
  return (
    <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 sm:p-5">
      {eyebrow ? (
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">{eyebrow}</p>
      ) : null}
      {title ? <h3 className="mt-1 text-sm font-semibold text-white">{title}</h3> : null}
      <div className={title || eyebrow ? "mt-4" : ""}>{children}</div>
    </section>
  )
}

function FieldRow({ label, value }) {
  if (value === null || value === undefined || value === "") {
    return null
  }

  return (
    <div className="flex flex-col gap-1 border-b border-white/[0.05] py-2.5 last:border-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
      <dt className="text-xs font-medium uppercase tracking-[0.14em] text-muted">{label}</dt>
      <dd className="min-w-0 break-words text-sm text-white/85 sm:text-right">{value}</dd>
    </div>
  )
}

function categoryIcon(category) {
  const meta = categoryMeta[category] ?? categoryMeta.config
  const Icon = meta.Icon
  return <Icon className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
}

export default function OpsErrorDrawer({
  entry,
  open,
  onClose,
  onResolve,
  resolving,
  formatErrorTime,
  resolveBanner = "",
}) {
  const [note, setNote] = useState("")

  useEffect(() => {
    if (open && entry) {
      queueMicrotask(() => {
        setNote("")
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset note when switching errors; entry object identity may churn
  }, [open, entry?.id])

  useEffect(() => {
    if (!open) {
      return undefined
    }

    const onKey = (event) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  if (!entry) {
    return null
  }

  const details = entry.details && typeof entry.details === "object" ? entry.details : {}
  const code = deriveOpsErrorCode(entry)
  const category = deriveOpsCategory(entry)
  const { email, emailDomain } = extractAffectedIdentity(entry)
  const route = routeLabelFromSource(entry.source)
  const hint = details.intakeInsertFailureHint
  const supabase = details.supabase && typeof details.supabase === "object" ? details.supabase : null
  const attemptLog = Array.isArray(details.intakeInsertAttemptLog) ? details.intakeInsertAttemptLog : null
  const cat = categoryMeta[category] ?? categoryMeta.config

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <motion.button
            type="button"
            aria-label="Close error details"
            className="absolute inset-0 bg-black/65 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.aside
            className="relative flex h-[100dvh] max-h-[100dvh] w-full max-w-full flex-col border-l border-white/10 bg-elevated/95 shadow-2xl backdrop-blur-2xl sm:max-w-lg lg:max-w-xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 360, damping: 34 }}
          >
            <div className="flex items-start justify-between gap-3 border-b border-white/10 px-4 py-4 sm:px-5">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-100/90">
                    {categoryIcon(category)}
                    {cat.label}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${
                      entry.severity === "warn"
                        ? "border border-amber-400/25 bg-amber-500/15 text-amber-100"
                        : "border border-rose-400/25 bg-rose-500/15 text-rose-100"
                    }`}
                  >
                    {entry.severity}
                  </span>
                  {entry.resolved ? (
                    <span className="rounded-full border border-emerald-400/25 bg-emerald-500/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-100">
                      Resolved
                    </span>
                  ) : null}
                </div>
                <p className="mt-3 font-mono text-xs font-semibold tracking-wide text-white/90">{code}</p>
                <p className="mt-1 text-xs text-muted">
                  {formatTimeAgo(entry.created_at)} · {formatErrorTime(entry.created_at)}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 text-muted transition hover:border-white/20 hover:text-white"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto overscroll-y-contain px-4 py-5 sm:px-5 sm:py-6">
              <Section eyebrow="Overview" title="Summary">
                <p className="text-sm leading-relaxed text-white/80">{entry.message}</p>
                <dl className="mt-4 space-y-0">
                  <FieldRow label="Route" value={route} />
                  <FieldRow label="Source" value={entry.source} />
                  <FieldRow label="Reason code" value={details.reason} />
                  <FieldRow label="Normalized code" value={code} />
                </dl>
              </Section>

              <Section eyebrow="Failure details" title="What broke">
                {hint && typeof hint === "object" ? (
                  <div className="mb-4 rounded-2xl border border-amber-400/15 bg-amber-500/[0.07] px-3 py-3">
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-amber-100/90">
                      <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
                      Failure hint
                    </p>
                    <p className="mt-2 text-sm text-white/85">
                      {hint.kind ? (
                        <>
                          <span className="font-mono text-cyan-200/90">{String(hint.kind)}</span>
                          {hint.column ? (
                            <span className="text-white/60">
                              {" "}
                              · column <span className="font-mono text-white/90">{hint.column}</span>
                            </span>
                          ) : null}
                        </>
                      ) : null}
                    </p>
                    {hint.summary ? (
                      <p className="mt-2 text-xs leading-relaxed text-white/55">{hint.summary}</p>
                    ) : null}
                  </div>
                ) : null}

                {supabase ? (
                  <dl className="space-y-0">
                    <FieldRow label="Supabase message" value={supabase.message} />
                    <FieldRow label="Supabase code" value={supabase.code} />
                    <FieldRow label="Details" value={supabase.details} />
                    <FieldRow label="Hint" value={supabase.hint} />
                  </dl>
                ) : (
                  <p className="text-sm text-muted">No Supabase payload on this event.</p>
                )}

                {attemptLog && attemptLog.length > 0 ? (
                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
                      Insert attempts
                    </p>
                    <ul className="mt-2 space-y-2">
                      {attemptLog.map((row) => (
                        <li
                          key={`${row.index}-${row.success}`}
                          className="rounded-xl border border-white/[0.06] bg-black/30 px-3 py-2 text-xs"
                        >
                          <span className="font-mono text-white/70">#{row.index}</span>{" "}
                          <span className={row.success ? "text-emerald-300/90" : "text-rose-200/90"}>
                            {row.success ? "ok" : "fail"}
                          </span>
                          {row.keys?.length ? (
                            <span className="mt-1 block text-[11px] text-muted">
                              keys: {row.keys.join(", ")}
                            </span>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </Section>

              <Section eyebrow="Request context" title="Affected flow">
                <dl className="space-y-0">
                  <FieldRow label="Email" value={email} />
                  <FieldRow label="Domain" value={emailDomain} />
                  <FieldRow label="Session id" value={details.sessionId} />
                  <FieldRow label="Request id" value={details.requestId} />
                  <FieldRow label="Environment" value={details.environment} />
                </dl>
              </Section>

              <Section eyebrow="Diagnostics" title="Structured fields">
                <dl className="space-y-0">
                  {Object.entries(details)
                    .filter(
                      ([key]) =>
                        ![
                          "intakeInsertAttemptLog",
                          "intakeInsertFailureHint",
                          "supabase",
                          "turnstileError",
                          "skipped",
                        ].includes(key),
                    )
                    .map(([key, value]) => (
                      <FieldRow
                        key={key}
                        label={key.replace(/_/g, " ")}
                        value={
                          value !== null && typeof value === "object"
                            ? JSON.stringify(value)
                            : String(value)
                        }
                      />
                    ))}
                </dl>
              </Section>

              <OpsJsonBlock data={details} title="Raw details JSON" defaultOpen={false} />

              {entry.resolved ? (
                <Section eyebrow="Resolution" title="Closed">
                  <FieldRow label="Resolved at" value={formatErrorTime(entry.resolved_at)} />
                  <FieldRow label="Note" value={entry.resolution_note} />
                </Section>
              ) : null}
            </div>

            {!entry.resolved ? (
              <div className="border-t border-white/10 px-4 py-4 sm:px-5">
                {resolveBanner ? (
                  <p
                    className="mb-3 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-100"
                    role="alert"
                  >
                    {resolveBanner}
                  </p>
                ) : null}
                <label className="block text-xs font-medium uppercase tracking-[0.16em] text-muted">
                  Resolution note (optional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  maxLength={500}
                  placeholder="e.g. Rotated SMTP password — retested intake OK"
                  className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-indigo-400/40"
                />
                <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:justify-end">
                  <Button variant="secondary" className="w-full sm:w-auto" onClick={onClose}>
                    Close
                  </Button>
                  <Button
                    className="w-full sm:w-auto"
                    disabled={resolving}
                    onClick={() => void onResolve(entry.id, note.trim() || undefined)}
                  >
                    {resolving ? "Marking resolved…" : "Mark resolved"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="border-t border-white/10 px-4 py-4 sm:px-5">
                <Button variant="secondary" className="w-full" onClick={onClose}>
                  Close
                </Button>
              </div>
            )}
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  )
}
