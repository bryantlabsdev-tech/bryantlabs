const toneClasses = {
  cyan: "border-cyan-400/25 bg-cyan-500/10 text-cyan-100",
  indigo: "border-indigo-400/25 bg-indigo-500/10 text-indigo-100",
  violet: "border-violet-400/25 bg-violet-500/10 text-violet-100",
  amber: "border-amber-400/25 bg-amber-500/10 text-amber-100",
  emerald: "border-emerald-400/25 bg-emerald-500/10 text-emerald-100",
  rose: "border-rose-400/25 bg-rose-500/10 text-rose-100",
  neutral: "border-white/10 bg-white/[0.05] text-white/60",
}

export default function LeadSurfaceBadges({ badges, className = "" }) {
  if (!badges?.length) {
    return null
  }

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {badges.map((badge) => (
        <span
          key={badge.key}
          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] ${
            toneClasses[badge.tone] ?? toneClasses.neutral
          }`}
        >
          {badge.label}
        </span>
      ))}
    </div>
  )
}
