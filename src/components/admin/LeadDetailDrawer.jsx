import { AnimatePresence, motion } from "framer-motion"
import { Calendar, Check, Copy, Mail, X } from "lucide-react"
import { useEffect, useState } from "react"
import { getLeadStatusLabel } from "../../config/admin"
import Button from "../ui/Button"
import StatusSelect from "./StatusSelect"

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "full",
  timeStyle: "short",
})

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

function LeadDetailDrawerPanel({
  lead,
  onClose,
  onStatusChange,
  onSaveNotes,
  onSendIntroLink,
  updatingStatus,
  savingNotes,
  sendingIntroLink,
}) {
  const [notes, setNotes] = useState(lead.admin_notes ?? "")
  const [notesMessage, setNotesMessage] = useState("")
  const [notesError, setNotesError] = useState("")
  const [introLinkMessage, setIntroLinkMessage] = useState("")
  const [introLinkError, setIntroLinkError] = useState("")
  const [copiedEmail, setCopiedEmail] = useState(false)

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
    } catch (saveError) {
      setNotesError(saveError?.message ?? "We could not save these notes.")
    }
  }

  const handleSendIntroLink = async () => {
    setIntroLinkMessage("")
    setIntroLinkError("")

    try {
      await onSendIntroLink(lead)
      setIntroLinkMessage("Intro call link sent successfully.")
    } catch (sendError) {
      setIntroLinkError(
        sendError?.message ?? "We could not send the intro call link.",
      )
    }
  }

  const introLinkSentAt = lead.intro_link_sent_at
    ? dateFormatter.format(new Date(lead.intro_link_sent_at))
    : null

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
        className="relative flex h-full w-full max-w-xl flex-col border-l border-white/10 bg-elevated/95 shadow-2xl backdrop-blur-2xl"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-cyan/80">
              Lead detail
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              {lead.full_name}
            </h2>
            <p className="mt-1 text-sm text-muted">{lead.email}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 p-2 text-muted transition hover:border-white/20 hover:text-white"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="flex flex-wrap gap-3">
            <Button
              variant="secondary"
              className="px-4 py-2 text-sm"
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
              className="px-4 py-2 text-sm"
              href={`mailto:${encodeURIComponent(lead.email)}?subject=${encodeURIComponent(
                `Bryant Labs consultation follow-up - ${lead.full_name}`,
              )}`}
            >
              <Mail className="h-4 w-4" />
              Email lead
            </Button>
          </div>

          <div className="mt-6">
            <label className="block text-xs font-medium uppercase tracking-[0.18em] text-muted">
              Pipeline status
            </label>
            <div className="mt-2 max-w-xs">
              <StatusSelect
                value={lead.status}
                disabled={updatingStatus}
                onChange={(nextStatus) => onStatusChange(lead, nextStatus)}
              />
            </div>
            <p className="mt-2 text-xs text-muted">
              Current status: {getLeadStatusLabel(lead.status)}
            </p>
          </div>

          <dl className="mt-8 space-y-6">
            <DetailField
              label="Created"
              value={
                lead.created_at
                  ? dateFormatter.format(new Date(lead.created_at))
                  : "—"
              }
            />
            <DetailField label="Company / brand" value={lead.company_brand} />
            <DetailField
              label="Selected session"
              value={`${lead.selected_session_name} (${lead.selected_session_price_label})`}
            />
            <DetailField label="Platform needed" value={lead.platform_needed} />
            <DetailField label="Budget range" value={lead.budget_range} />
            <DetailField label="Desired timeline" value={lead.desired_timeline} />
            <DetailField
              label="Project summary"
              value={lead.project_summary}
              multiline
            />
            <DetailField label="Audience" value={lead.audience} multiline />
            <DetailField
              label="Core features"
              value={lead.core_features}
              multiline
            />
            <DetailField
              label="Inspiration / reference links"
              value={lead.reference_links}
              multiline
            />
            <DetailField
              label="Additional notes"
              value={lead.additional_notes}
              multiline
            />
            <DetailField label="Payment status" value={lead.payment_status} />
          </dl>

          <div className="mt-8 rounded-3xl border border-indigo-400/20 bg-indigo-500/10 p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-cyan/80">
                <Calendar className="h-5 w-5" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan/80">
                  Intro call workflow
                </p>
                <h3 className="mt-2 text-lg font-semibold text-white">
                  Send a qualified intro call link
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  Email this lead a complimentary Bryant Labs intro call scheduling
                  link after you have reviewed their intake.
                </p>
              </div>
            </div>

            {introLinkSentAt ? (
              <p className="mt-4 text-sm text-white/75">
                Intro call link sent at: {introLinkSentAt}
              </p>
            ) : null}

            {introLinkMessage ? (
              <p
                className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100"
                role="status"
              >
                {introLinkMessage}
              </p>
            ) : null}

            {introLinkError ? (
              <p
                className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100"
                role="alert"
              >
                {introLinkError}
              </p>
            ) : null}

            <Button
              className="mt-5 w-full"
              onClick={handleSendIntroLink}
              disabled={!lead.email || sendingIntroLink}
            >
              <Calendar className="h-4 w-4" />
              {sendingIntroLink ? "Sending intro call link…" : "Send Intro Call Link"}
            </Button>

            {!lead.email ? (
              <p className="mt-3 text-xs text-muted">
                This lead needs an email address before an intro call link can be
                sent.
              </p>
            ) : null}
          </div>

          <div className="mt-8 rounded-3xl border border-white/10 bg-black/20 p-5">
            <label className="block text-xs font-medium uppercase tracking-[0.18em] text-muted">
              Admin notes
            </label>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              Private notes for Bryant Labs only. These are not visible to the
              client.
            </p>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={6}
              placeholder="Follow-up context, call notes, next steps…"
              className="mt-4 w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-indigo-400/50"
            />

            {notesMessage ? (
              <p className="mt-3 text-sm text-emerald-100">{notesMessage}</p>
            ) : null}

            {notesError ? (
              <p className="mt-3 text-sm text-rose-100" role="alert">
                {notesError}
              </p>
            ) : null}

            <Button
              className="mt-4 w-full"
              onClick={handleSaveNotes}
              disabled={savingNotes}
            >
              {savingNotes ? "Saving notes…" : "Save notes"}
            </Button>
          </div>
        </div>

        <div className="border-t border-white/10 px-6 py-5">
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
  updatingStatus = false,
  savingNotes = false,
  sendingIntroLink = false,
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
            updatingStatus={updatingStatus}
            savingNotes={savingNotes}
            sendingIntroLink={sendingIntroLink}
          />
        </div>
      ) : null}
    </AnimatePresence>
  )
}
