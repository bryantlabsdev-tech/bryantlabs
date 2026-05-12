import { Inbox } from "lucide-react"
import GlassCard from "../ui/GlassCard"

export default function LeadsEmptyState({ hasFilters = false }) {
  return (
    <GlassCard
      hover={false}
      className="flex flex-col items-center justify-center px-6 py-20 text-center"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-cyan/80">
        <Inbox className="h-6 w-6" aria-hidden />
      </div>
      <h2 className="mt-5 text-xl font-semibold text-white">
        {hasFilters ? "No leads match your filters" : "No consultation leads yet"}
      </h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
        {hasFilters
          ? "Try clearing the search or status filter to see the full pipeline."
          : "New intake submissions will appear here as soon as clients complete the consultation form."}
      </p>
    </GlassCard>
  )
}
