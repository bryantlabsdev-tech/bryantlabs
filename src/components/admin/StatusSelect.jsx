import {
  getLeadStatusLabel,
  getLeadStatusStyles,
  LEAD_STATUSES,
  normalizeLeadStatus,
} from "../../config/admin"

export default function StatusSelect({ value, onChange, disabled, className = "" }) {
  const normalizedValue = normalizeLeadStatus(value)
  const options = LEAD_STATUSES.some((status) => status.value === normalizedValue)
    ? LEAD_STATUSES
    : [
        {
          value: normalizedValue,
          label: getLeadStatusLabel(value),
        },
        ...LEAD_STATUSES,
      ]

  return (
    <select
      value={normalizedValue}
      onChange={(event) => onChange(event.target.value)}
      onClick={(event) => event.stopPropagation()}
      disabled={disabled}
      aria-label="Lead status"
      className={`w-full min-w-[9.5rem] rounded-xl border px-3 py-2 text-sm font-medium outline-none transition focus:border-indigo-400/50 disabled:cursor-not-allowed disabled:opacity-60 ${getLeadStatusStyles(
        normalizedValue,
        "select",
      )} ${className}`}
    >
      {options.map((status) => (
        <option key={status.value} value={status.value} className="bg-elevated text-white">
          {status.label}
        </option>
      ))}
    </select>
  )
}
