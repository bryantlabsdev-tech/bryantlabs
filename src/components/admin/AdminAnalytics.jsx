import { motion } from "framer-motion"
import GlassCard from "../ui/GlassCard"

const metricCards = [
  { key: "visitsToday", label: "Visits today" },
  { key: "visitsLastSevenDays", label: "Visits last 7 days" },
  { key: "intakeStartCount", label: "Intake starts" },
  { key: "intakeSubmissionCount", label: "Intake submissions" },
  {
    key: "conversionRate",
    label: "Intake conversion",
    format: (value) => `${value}%`,
  },
  { key: "ctaClickCount", label: "CTA clicks" },
]

export default function AdminAnalytics({ summary, loading, error }) {
  if (loading) {
    return (
      <GlassCard hover={false} className="px-6 py-16 text-center text-sm text-muted">
        Loading analytics…
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
        {metricCards.map((card, index) => {
          const value = summary[card.key]
          const displayValue = card.format ? card.format(value) : value

          return (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, duration: 0.35 }}
            >
              <GlassCard hover={false} className="p-4 sm:p-5">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
                  {card.label}
                </p>
                <p className="mt-2 text-2xl font-semibold text-white sm:mt-3 sm:text-3xl">
                  {displayValue}
                </p>
              </GlassCard>
            </motion.div>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard hover={false} className="p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-white">Top pages</h2>
          <p className="mt-2 text-sm text-muted">
            Most viewed paths from the last 30 days of page views.
          </p>

          {summary.topPages.length === 0 ? (
            <p className="mt-6 text-sm text-muted">No page views recorded yet.</p>
          ) : (
            <ul className="mt-6 space-y-3">
              {summary.topPages.map((page) => (
                <li
                  key={page.pagePath}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
                >
                  <span className="min-w-0 break-all text-sm text-white/85">
                    {page.pagePath}
                  </span>
                  <span className="shrink-0 text-sm font-medium text-white">
                    {page.count}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </GlassCard>

        <GlassCard hover={false} className="p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-white">Recent events</h2>
          <p className="mt-2 text-sm text-muted">
            Latest lightweight events captured across the marketing site and admin
            workflow.
          </p>

          {summary.recentEvents.length === 0 ? (
            <p className="mt-6 text-sm text-muted">No events recorded yet.</p>
          ) : (
            <ul className="mt-6 space-y-3">
              {summary.recentEvents.map((event) => (
                <li
                  key={event.id}
                  className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-medium capitalize text-white">
                        {event.label}
                      </p>
                      {event.pagePath ? (
                        <p className="mt-1 break-all text-xs text-muted">
                          {event.pagePath}
                        </p>
                      ) : null}
                    </div>
                    <p className="shrink-0 text-xs text-muted">{event.timeLabel}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </GlassCard>
      </div>
    </div>
  )
}
