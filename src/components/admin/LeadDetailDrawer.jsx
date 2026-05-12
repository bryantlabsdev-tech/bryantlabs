import { X } from "lucide-react"
import Button from "../ui/Button"

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

export default function LeadDetailDrawer({ lead, onClose }) {
  if (!lead) {
    return null
  }

  const createdAt = lead.created_at
    ? dateFormatter.format(new Date(lead.created_at))
    : "—"

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close lead details"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <aside className="relative flex h-full w-full max-w-xl flex-col border-l border-white/10 bg-elevated/95 shadow-2xl backdrop-blur-2xl">
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
          <dl className="space-y-6">
            <DetailField label="Created" value={createdAt} />
            <DetailField label="Company / brand" value={lead.company_brand} />
            <DetailField
              label="Selected session"
              value={`${lead.selected_session_name} (${lead.selected_session_price_label})`}
            />
            <DetailField label="Payment status" value={lead.payment_status} />
            <DetailField label="Status" value={lead.status} />
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
            <DetailField label="Platform needed" value={lead.platform_needed} />
            <DetailField label="Desired timeline" value={lead.desired_timeline} />
            <DetailField label="Budget range" value={lead.budget_range} />
            <DetailField
              label="Reference links"
              value={lead.reference_links}
              multiline
            />
            <DetailField
              label="Additional notes"
              value={lead.additional_notes}
              multiline
            />
          </dl>
        </div>

        <div className="border-t border-white/10 px-6 py-5">
          <Button variant="secondary" className="w-full" onClick={onClose}>
            Close
          </Button>
        </div>
      </aside>
    </div>
  )
}
