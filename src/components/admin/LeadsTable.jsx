import { LEAD_STATUSES } from "../../config/admin"

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

function StatusSelect({ value, onChange, disabled }) {
  const options = LEAD_STATUSES.some((status) => status.value === value)
    ? LEAD_STATUSES
    : [{ value, label: value }, ...LEAD_STATUSES]

  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onClick={(event) => event.stopPropagation()}
      disabled={disabled}
      className="w-full min-w-[10rem] rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none transition focus:border-indigo-400/50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {options.map((status) => (
        <option key={status.value} value={status.value} className="bg-elevated">
          {status.label}
        </option>
      ))}
    </select>
  )
}

export default function LeadsTable({
  leads,
  updatingLeadId,
  onLeadSelect,
  onStatusChange,
}) {
  if (!leads.length) {
    return (
      <div className="rounded-3xl border border-dashed border-white/10 px-6 py-16 text-center text-sm text-muted">
        No consultation leads yet.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/20">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10 text-left text-sm">
          <thead className="bg-white/[0.03] text-xs uppercase tracking-[0.18em] text-muted">
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
              <th className="px-4 py-4 font-medium">Status</th>
              <th className="px-4 py-4 font-medium">Payment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/8">
            {leads.map((lead) => (
              <tr
                key={lead.id}
                onClick={() => onLeadSelect(lead)}
                className="cursor-pointer transition hover:bg-white/[0.04]"
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
                <td className="px-4 py-4">
                  <StatusSelect
                    value={lead.status}
                    disabled={updatingLeadId === lead.id}
                    onChange={(nextStatus) => onStatusChange(lead, nextStatus)}
                  />
                </td>
                <td className="px-4 py-4 text-white/80">
                  {lead.payment_status || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
