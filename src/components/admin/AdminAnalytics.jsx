import { motion } from "framer-motion"
import GlassCard from "../ui/GlassCard"

function KpiCard({ label, value, hint, delay = 0, valueClassName = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
    >
      <GlassCard
        hover={false}
        className="border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6"
      >
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/45">
          {label}
        </p>
        <p
          className={`mt-3 font-semibold tracking-tight text-white sm:mt-3.5 ${valueClassName || "text-3xl sm:text-4xl"}`}
        >
          {value}
        </p>
        {hint ? <p className="mt-2 text-xs leading-relaxed text-white/40">{hint}</p> : null}
      </GlassCard>
    </motion.div>
  )
}

function FunnelStep({ label, value, subtitle }) {
  return (
    <div className="min-w-0 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-4 text-center sm:px-5 sm:py-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-200/70">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold tabular-nums text-white sm:text-3xl">{value}</p>
      {subtitle ? (
        <p className="mt-1.5 text-[11px] leading-snug text-white/40">{subtitle}</p>
      ) : null}
    </div>
  )
}

export default function AdminAnalytics({ summary, loading, error, leadsCaptured = 0 }) {
  if (loading) {
    return (
      <GlassCard
        hover={false}
        className="border border-white/[0.06] px-8 py-20 text-center"
      >
        <p className="text-sm text-white/50">Loading your studio overview…</p>
      </GlassCard>
    )
  }

  if (error) {
    return (
      <p
        className="rounded-2xl border border-rose-400/15 bg-rose-500/10 px-5 py-4 text-sm text-rose-100"
        role="alert"
      >
        {error}
      </p>
    )
  }

  const { funnel, sectionTraffic } = summary
  const maxSectionVisits = sectionTraffic[0]?.count ?? 0
  const funnelSteps = [
    {
      key: "visitors",
      label: "Visitors",
      value: funnel.visitors,
      subtitle: "Unique sessions (page views)",
    },
    {
      key: "intakeStarted",
      label: "Intake started",
      value: funnel.intakeStarted,
      subtitle: "Form opened",
    },
    {
      key: "intakeSubmitted",
      label: "Intake submitted",
      value: funnel.intakeSubmitted,
      subtitle: "Completed send",
    },
    {
      key: "introCallSent",
      label: "Intro call sent",
      value: funnel.introCallSent,
      subtitle: "From admin CRM",
    },
  ]

  return (
    <div className="space-y-8 sm:space-y-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/40">
            Last 30 days · first-party only
          </p>
          <h2 className="mt-1 text-xl font-semibold text-white sm:text-2xl">Studio overview</h2>
        </div>
      </div>

      {!summary.hasAnyEvents ? (
        <GlassCard
          hover={false}
          className="border border-white/[0.06] bg-gradient-to-br from-white/[0.04] to-transparent px-8 py-14 text-center"
        >
          <p className="text-lg font-medium text-white">No analytics yet</p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/50">
            Traffic will appear here once visitors browse the marketing site. Intake and CRM
            milestones show up as people move through your funnel.
          </p>
          {leadsCaptured > 0 ? (
            <p className="mt-6 text-sm text-cyan-200/80">
              You already have{" "}
              <span className="font-semibold text-white">{leadsCaptured}</span> lead
              {leadsCaptured === 1 ? "" : "s"} in CRM — analytics will fill in as the site gets
              traffic.
            </p>
          ) : (
            <p className="mt-6 text-sm text-white/40">No leads yet — CRM stays ready.</p>
          )}
        </GlassCard>
      ) : null}

      {summary.hasAnyEvents ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
          <KpiCard
            label="Visits today"
            value={summary.visitsToday}
            hint="Homepage and section views since midnight (local time)"
            delay={0}
          />
          <KpiCard
            label="Intake starts"
            value={summary.intakeStartCount}
            hint="Someone opened the qualification form"
            delay={0.04}
          />
          <KpiCard
            label="Intake submissions"
            value={summary.intakeSubmissionCount}
            hint="Completed intakes in this window"
            delay={0.08}
          />
          <KpiCard
            label="Leads captured"
            value={leadsCaptured}
            hint="Total rows in CRM (all time)"
            delay={0.12}
          />
          <KpiCard
            label="Most active section"
            value={summary.mostActiveSection}
            hint="Where people spend time on the site"
            delay={0.16}
            valueClassName="text-xl leading-snug sm:text-2xl"
          />
          <KpiCard
            label="Returning visitors"
            value={summary.returningVisitorsEstimate}
            hint="Sessions that viewed 2+ different sections (estimate)"
            delay={0.2}
          />
        </div>
      ) : null}

      {summary.hasAnyEvents ? (
        <GlassCard
          hover={false}
          className="border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8"
        >
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
            <h3 className="text-lg font-semibold text-white">Funnel</h3>
            <p className="text-xs text-white/45">How attention turns into pipeline</p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
            {funnelSteps.map((step) => (
              <FunnelStep
                key={step.key}
                label={step.label}
                value={step.value}
                subtitle={step.subtitle}
              />
            ))}
          </div>

          {!summary.hasIntakeActivity && funnel.introCallSent === 0 ? (
            <p className="mt-6 rounded-2xl border border-white/[0.06] bg-black/20 px-4 py-3 text-center text-sm text-white/45">
              No recent intake activity in this window yet.
            </p>
          ) : null}
        </GlassCard>
      ) : null}

      {summary.hasAnyEvents ? (
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          <GlassCard
            hover={false}
            className="border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8"
          >
            <h3 className="text-lg font-semibold text-white">Where people go</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/45">
              Sections and pages grouped for quick reading — not raw URLs.
            </p>

            {!summary.hasPageViews ? (
              <p className="mt-10 text-center text-sm text-white/45">
                Traffic will appear here once visitors load the site.
              </p>
            ) : (
              <ul className="mt-8 space-y-5">
                {sectionTraffic.map((row, index) => {
                  const widthPct =
                    maxSectionVisits > 0
                      ? Math.round((row.count / maxSectionVisits) * 100)
                      : 0

                  return (
                    <li key={row.label}>
                      <div className="flex items-end justify-between gap-3">
                        <span className="min-w-0 text-sm font-medium text-white/90">
                          {row.label}
                        </span>
                        <span className="shrink-0 text-sm tabular-nums text-white/70">
                          {row.count} {row.count === 1 ? "visit" : "visits"}
                        </span>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-500/70 to-indigo-500/60"
                          initial={{ width: 0 }}
                          animate={{ width: `${widthPct}%` }}
                          transition={{ delay: index * 0.05, duration: 0.45, ease: "easeOut" }}
                        />
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </GlassCard>

          <GlassCard
            hover={false}
            className="border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8"
          >
            <h3 className="text-lg font-semibold text-white">Recent activity</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/45">
              Plain-language timeline — no session IDs or debug fields.
            </p>

            {summary.activityFeed.length === 0 ? (
              <p className="mt-10 text-center text-sm text-white/45">
                No recent intake activity to show yet.
              </p>
            ) : (
              <ul className="mt-8 space-y-1">
                {summary.activityFeed.map((item) => (
                  <li
                    key={item.id}
                    className="flex gap-4 rounded-2xl border border-transparent px-3 py-3 transition hover:border-white/[0.06] hover:bg-white/[0.02]"
                  >
                    <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-cyan-400/50" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm leading-snug text-white/90">{item.description}</p>
                      <p className="mt-1 text-xs text-white/35">{item.timeLabel}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </GlassCard>
        </div>
      ) : null}
    </div>
  )
}
