import { AnimatePresence, motion } from "framer-motion"
import { Calendar, Check, Copy, Mail, Phone, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useLeadActivities } from "../../hooks/useLeadActivities"
import {
  formatFollowUpLine,
  formatLastContactedLine,
  formatUpdatedAtLine,
  getLeadNextAction,
  getLeadSurfaceBadges,
} from "../../lib/crmLeadHelpers"
import { digitsForTelHref } from "../../lib/optionalPhone"
import Button from "../ui/Button"
import LeadSurfaceBadges from "./LeadSurfaceBadges"
import StatusSelect from "./StatusSelect"

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "full",
  timeStyle: "short",
})

function toDateInputValue(iso) {
  if (!iso) {
    return ""
  }

  const d = new Date(iso)

  if (Number.isNaN(d.getTime())) {
    return ""
  }

  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")

  return `${y}-${m}-${day}`
}

function Section({ eyebrow, title, description, children, className = "" }) {
  return (
    <section className={`rounded-3xl border border-white/[0.06] bg-white/[0.02] p-4 sm:p-5 ${className}`}>
      {eyebrow ? (
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
          {eyebrow}
        </p>
      ) : null}
      {title ? <h3 className="mt-1 text-base font-semibold text-white">{title}</h3> : null}
      {description ? (
        <p className="mt-2 text-xs leading-relaxed text-white/50">{description}</p>
      ) : null}
      {children ? <div className={title || description ? "mt-4" : ""}>{children}</div> : null}
    </section>
  )
}

function DetailField({ label, value, multiline = false }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
        {label}
      </dt>
      <dd
        className={`mt-2 text-sm text-white/85 ${
          multiline ? "whitespace-pre-wrap leading-relaxed" : ""
        }`}
      >
        {value || "—"}
      </dd>
    </div>
  )
}

function PhoneDetailField({ phone }) {
  const display = String(phone ?? "").trim()
  const telHref = display ? digitsForTelHref(display) : ""

  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
        Phone
      </dt>
      <dd className="mt-2 text-sm text-white/85">
        {display ? (
          telHref ? (
            <a
              href={telHref}
              className="inline-flex items-center gap-2 text-cyan-200/90 underline decoration-white/20 underline-offset-4 transition hover:text-white"
            >
              <Phone className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
              {display}
            </a>
          ) : (
            display
          )
        ) : (
          "—"
        )}
      </dd>
    </div>
  )
}

function LeadDetailDrawerPanel({
  lead,
  onClose,
  onStatusChange,
  onSaveNotes,
  onSendIntroLink,
  onSaveFollowUp,
  updatingStatus,
  savingNotes,
  sendingIntroLink,
  savingFollowUp,
}) {
  const { items: activities, loading: activitiesLoading, reloadActivities } =
    useLeadActivities(lead?.id, lead?.updated_at)
  const [notes, setNotes] = useState(lead.admin_notes ?? "")
  const [followUpDate, setFollowUpDate] = useState(toDateInputValue(lead.next_follow_up_at))
  const [followUpNote, setFollowUpNote] = useState(lead.follow_up_note ?? "")
  const [notesMessage, setNotesMessage] = useState("")
  const [notesError, setNotesError] = useState("")
  const [followUpMessage, setFollowUpMessage] = useState("")
  const [followUpError, setFollowUpError] = useState("")
  const [introLinkMessage, setIntroLinkMessage] = useState("")
  const [introLinkError, setIntroLinkError] = useState("")
  const [copiedEmail, setCopiedEmail] = useState(false)

  useEffect(() => {
    queueMicrotask(() => {
      setNotes(lead.admin_notes ?? "")
      setFollowUpDate(toDateInputValue(lead.next_follow_up_at))
      setFollowUpNote(lead.follow_up_note ?? "")
      setNotesMessage("")
      setNotesError("")
      setFollowUpMessage("")
      setFollowUpError("")
      setIntroLinkMessage("")
      setIntroLinkError("")
    })
  }, [lead.id, lead.admin_notes, lead.next_follow_up_at, lead.follow_up_note])

  const handleCopyEmail = async () => {
    if (!lead.email) {
      return
    }

    try {
      await navigator.clipboard.writeText(lead.email)
      setCopiedEmail(true)
      window.setTimeout(() => setCopiedEmail(false), 1800)
    } catch {
      setNotesError("Could not copy the email address.")
    }
  }

  const handleSaveNotes = async () => {
    setNotesMessage("")
    setNotesError("")

    try {
      await onSaveNotes(lead, notes)
      setNotesMessage("Notes saved.")
      void reloadActivities()
    } catch (saveError) {
      setNotesError(saveError?.message ?? "We could not save these notes.")
    }
  }

  const handleSaveFollowUp = async () => {
    setFollowUpMessage("")
    setFollowUpError("")

    try {
      await onSaveFollowUp(lead, {
        nextFollowUpDate: followUpDate.trim(),
        followUpNote,
      })
      setFollowUpMessage("Follow-up saved.")
      void reloadActivities()
    } catch (saveError) {
      setFollowUpError(saveError?.message ?? "We could not save follow-up.")
    }
  }

  const handleSendIntroLink = async () => {
    setIntroLinkMessage("")
    setIntroLinkError("")

    try {
      await onSendIntroLink(lead)
      setIntroLinkMessage("Intro link sent.")
      void reloadActivities()
    } catch (sendError) {
      setIntroLinkError(sendError?.message ?? "We could not send the intro link.")
    }
  }

  const introLinkSentAt = lead.intro_link_sent_at
    ? dateFormatter.format(new Date(lead.intro_link_sent_at))
    : null

  const surfaceBadges = getLeadSurfaceBadges(lead)
  const nextAction = getLeadNextAction(lead)
  const updatedLine = formatUpdatedAtLine(lead)

  return (
    <>
      <motion.button
        type="button"
        aria-label="Close lead details"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      <motion.aside
        className="relative flex h-[100dvh] max-h-[100dvh] w-full max-w-full flex-col border-l border-white/10 bg-elevated/95 shadow-2xl backdrop-blur-2xl sm:max-w-xl"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-4 py-4 sm:px-6 sm:py-5">
          <div className="min-w-0 pr-2">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-cyan/80">
              Lead
            </p>
            <h2 className="mt-2 break-words text-xl font-semibold text-white sm:text-2xl">
              {lead.full_name}
            </h2>
            <p className="mt-1 break-all text-sm text-muted">{lead.email}</p>
            <div className="mt-3">
              <LeadSurfaceBadges badges={surfaceBadges} />
            </div>
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

        <div className="flex-1 space-y-6 overflow-y-auto overscroll-y-contain px-4 py-5 sm:px-6 sm:py-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button
              variant="secondary"
              className="w-full px-4 py-2 text-sm sm:w-auto"
              onClick={handleCopyEmail}
            >
              {copiedEmail ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy email
                </>
              )}
            </Button>
            <Button
              variant="secondary"
              className="w-full px-4 py-2 text-sm sm:w-auto"
              href={`mailto:${encodeURIComponent(lead.email)}?subject=${encodeURIComponent(
                `Bryant Labs consultation follow-up - ${lead.full_name}`,
              )}`}
            >
              <Mail className="h-4 w-4" />
              Email lead
            </Button>
          </div>

          <Section
            eyebrow="Operations"
            title="Status & next step"
            description="Pipeline position and the single best next action for this lead."
          >
            <p className="text-sm font-medium text-cyan-100/90">{nextAction}</p>
            <div className="mt-4">
              <label className="block text-xs font-medium uppercase tracking-[0.18em] text-muted">
                Pipeline status
              </label>
              <div className="mt-2 max-w-full">
                <StatusSelect
                  value={lead.status}
                  disabled={updatingStatus}
                  onChange={(nextStatus) => onStatusChange(lead, nextStatus)}
                />
              </div>
            </div>
            <dl className="mt-4 space-y-2 text-xs text-white/50">
              <div className="flex flex-wrap justify-between gap-2">
                <dt>Last contacted</dt>
                <dd className="text-white/70">{formatLastContactedLine(lead)}</dd>
              </div>
              {formatFollowUpLine(lead) ? (
                <div className="flex flex-wrap justify-between gap-2">
                  <dt>Follow-up</dt>
                  <dd className="text-white/70">{formatFollowUpLine(lead)}</dd>
                </div>
              ) : null}
              {updatedLine ? (
                <div className="flex flex-wrap justify-between gap-2">
                  <dt>Record</dt>
                  <dd className="text-white/55">{updatedLine}</dd>
                </div>
              ) : null}
            </dl>
          </Section>

          <Section
            eyebrow="Follow-up"
            title="Reminder date"
            description="Optional. Pick a day to revisit this lead — no external calendar sync."
          >
            <label className="block text-xs font-medium uppercase tracking-[0.18em] text-muted">
              Next follow-up date
            </label>
            <input
              type="date"
              value={followUpDate}
              onChange={(event) => setFollowUpDate(event.target.value)}
              className="mt-2 min-h-11 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400/50"
            />
            <label className="mt-4 block text-xs font-medium uppercase tracking-[0.18em] text-muted">
              Short note (optional)
            </label>
            <input
              type="text"
              value={followUpNote}
              onChange={(event) => setFollowUpNote(event.target.value)}
              placeholder="e.g. Call after they review proposal"
              className="mt-2 min-h-11 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-indigo-400/50"
            />
            {followUpMessage ? (
              <p className="mt-3 text-sm text-emerald-100" role="status">
                {followUpMessage}
              </p>
            ) : null}
            {followUpError ? (
              <p className="mt-3 text-sm text-rose-100" role="alert">
                {followUpError}
              </p>
            ) : null}
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Button
                className="w-full sm:flex-1"
                onClick={handleSaveFollowUp}
                disabled={savingFollowUp}
              >
                {savingFollowUp ? "Saving…" : "Save follow-up"}
              </Button>
              <Button
                variant="secondary"
                className="w-full sm:flex-1"
                onClick={() => {
                  setFollowUpDate("")
                  setFollowUpNote("")
                }}
                disabled={savingFollowUp}
                type="button"
              >
                Clear fields
              </Button>
            </div>
            <p className="mt-2 text-[11px] text-white/35">
              Clear fields and save to remove a scheduled follow-up.
            </p>
          </Section>

          <Section
            eyebrow="Intro"
            title="Intro link"
            description="After you review their intake, send the intro call link by email."
          >
            {introLinkSentAt ? (
              <p className="text-sm text-white/75">
                Sent: <span className="text-white/90">{introLinkSentAt}</span>
              </p>
            ) : (
              <p className="text-sm text-white/55">Intro link not sent yet.</p>
            )}
            {introLinkMessage ? (
              <p
                className="mt-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100"
                role="status"
              >
                {introLinkMessage}
              </p>
            ) : null}
            {introLinkError ? (
              <p
                className="mt-3 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100"
                role="alert"
              >
                {introLinkError}
              </p>
            ) : null}
            <Button
              className="mt-4 w-full"
              onClick={handleSendIntroLink}
              disabled={!lead.email || sendingIntroLink}
            >
              <Calendar className="h-4 w-4" />
              {sendingIntroLink ? "Sending…" : "Send intro link"}
            </Button>
            {!lead.email ? (
              <p className="mt-2 text-xs text-muted">Add an email on the lead before sending.</p>
            ) : null}
          </Section>

          <Section eyebrow="Intake" title="Project details" description="What they submitted.">
            <dl className="space-y-5">
              <DetailField
                label="Submitted"
                value={
                  lead.created_at
                    ? dateFormatter.format(new Date(lead.created_at))
                    : "—"
                }
              />
              <DetailField label="Company / brand" value={lead.company_brand} />
              <PhoneDetailField phone={lead.phone} />
              <DetailField
                label="Planning session"
                value={`${lead.selected_session_name} (${lead.selected_session_price_label})`}
              />
              <DetailField label="Platform" value={lead.platform_needed} />
              <DetailField label="Budget" value={lead.budget_range} />
              <DetailField label="Timeline" value={lead.desired_timeline} />
              <DetailField label="Summary" value={lead.project_summary} multiline />
              <DetailField label="Audience" value={lead.audience} multiline />
              <DetailField label="Core features" value={lead.core_features} multiline />
              <DetailField label="References" value={lead.reference_links} multiline />
              <DetailField label="Their notes" value={lead.additional_notes} multiline />
              {lead.payment_status ? (
                <DetailField label="Payment status" value={lead.payment_status} />
              ) : null}
            </dl>
          </Section>

          <Section eyebrow="Activity" title="Timeline" description="Recent CRM actions for this lead.">
            {activitiesLoading ? (
              <p className="text-sm text-muted">Loading activity…</p>
            ) : activities.length === 0 ? (
              <p className="text-sm text-muted">No logged activity yet.</p>
            ) : (
              <ul className="space-y-3">
                {activities.map((entry) => (
                  <li
                    key={entry.id}
                    className="rounded-2xl border border-white/[0.06] bg-black/25 px-3 py-3"
                  >
                    <p className="text-sm text-white/90">{entry.summary}</p>
                    <p className="mt-1 text-xs text-white/40">
                      {new Intl.DateTimeFormat(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(new Date(entry.created_at))}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <Section
            eyebrow="Notes"
            title="Private admin notes"
            description="Not visible to the client. Saving updates last contacted."
          >
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={5}
              placeholder="Call notes, objections, internal context…"
              className="w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-indigo-400/50"
            />
            {notesMessage ? (
              <p className="mt-3 text-sm text-emerald-100" role="status">
                {notesMessage}
              </p>
            ) : null}
            {notesError ? (
              <p className="mt-3 text-sm text-rose-100" role="alert">
                {notesError}
              </p>
            ) : null}
            <Button className="mt-4 w-full" onClick={handleSaveNotes} disabled={savingNotes}>
              {savingNotes ? "Saving…" : "Save notes"}
            </Button>
          </Section>
        </div>

        <div className="border-t border-white/10 px-4 py-4 pb-[max(env(safe-area-inset-bottom),1rem)] sm:px-6 sm:py-5">
          <Button variant="secondary" className="w-full" onClick={onClose}>
            Close
          </Button>
        </div>
      </motion.aside>
    </>
  )
}

export default function LeadDetailDrawer({
  lead,
  onClose,
  onStatusChange,
  onSaveNotes,
  onSendIntroLink,
  onSaveFollowUp,
  updatingStatus = false,
  savingNotes = false,
  sendingIntroLink = false,
  savingFollowUp = false,
}) {
  useEffect(() => {
    if (!lead) {
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [lead, onClose])

  return (
    <AnimatePresence>
      {lead ? (
        <div className="fixed inset-0 z-50 flex justify-end">
          <LeadDetailDrawerPanel
            key={lead.id}
            lead={lead}
            onClose={onClose}
            onStatusChange={onStatusChange}
            onSaveNotes={onSaveNotes}
            onSendIntroLink={onSendIntroLink}
            onSaveFollowUp={onSaveFollowUp}
            updatingStatus={updatingStatus}
            savingNotes={savingNotes}
            sendingIntroLink={sendingIntroLink}
            savingFollowUp={savingFollowUp}
          />
        </div>
      ) : null}
    </AnimatePresence>
  )
}
