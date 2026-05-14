import { motion } from "framer-motion"
import {
  isPortfolioProjectPrivateOnly,
  portfolioShowsTestFlightUi,
} from "../../lib/portfolioVisibility"

function StatusChip({ children, tone }) {
  const tones = {
    neutral: "border-white/10 bg-white/[0.06] text-white/55",
    progress: "border-amber-400/20 bg-amber-400/10 text-amber-100/90",
    live: "border-emerald-400/25 bg-emerald-500/12 text-emerald-200/90",
    hold: "border-rose-400/20 bg-rose-500/10 text-rose-200/85",
  }
  return (
    <span
      className={`inline-flex max-w-full truncate rounded-md border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] sm:text-[10px] ${tones[tone]}`}
    >
      {children}
    </span>
  )
}

function StacklessOperationsSurface({ compact }) {
  const rows = [
    { id: "JOB-2041", customer: "Commercial HVAC", status: "En route", tone: "progress", window: "08:00–10:00" },
    { id: "JOB-2042", customer: "Residential electrical", status: "On site", tone: "live", window: "09:30–12:00" },
    { id: "JOB-2043", customer: "Emergency plumbing", status: "Scheduled", tone: "neutral", window: "PM block" },
    { id: "JOB-2040", customer: "Flatwork concrete", status: "Blocked", tone: "hold", window: "Awaiting parts" },
  ]

  const navItems = ["Jobs", "Crew", "Schedule", "Customers"]
  const shell = compact
    ? "rounded-xl border border-white/10 bg-gradient-to-b from-slate-950/90 to-black/60 p-2"
    : "rounded-2xl border border-white/10 bg-gradient-to-b from-slate-950/95 via-slate-950/80 to-black/70 p-2.5 shadow-inner sm:p-3.5"

  return (
    <div className={`${shell} font-sans`} aria-hidden>
      <div className="flex items-center justify-between gap-2 border-b border-white/[0.07] pb-2">
        <div className="min-w-0 flex-1 truncate rounded-md bg-black/40 px-2 py-1 text-[9px] text-white/40 ring-1 ring-inset ring-white/[0.06] sm:text-[10px]">
          <span className="text-white/25">https://</span>
          stack-less.vercel.app<span className="text-white/25">/dispatch</span>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/90 shadow-[0_0_8px_rgba(52,211,153,0.45)]" />
          <span className="hidden text-[9px] font-medium uppercase tracking-[0.14em] text-emerald-300/85 sm:inline">
            Synced
          </span>
        </div>
      </div>

      <div className={`mt-2 grid gap-2 ${compact ? "grid-cols-1" : "sm:grid-cols-[minmax(0,5.5rem)_1fr]"}`}>
        <nav className="hidden sm:flex sm:flex-col sm:gap-1">
          {navItems.map((label, i) => (
            <span
              key={label}
              className={`rounded-lg px-2 py-1 text-[10px] font-medium ${
                i === 0
                  ? "bg-white/[0.08] text-white/90 ring-1 ring-white/10"
                  : "text-white/40"
              }`}
            >
              {label}
            </span>
          ))}
        </nav>

        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
              Dispatch board
            </p>
            <div className="flex items-center gap-2">
              <span className="hidden h-6 w-24 rounded-md bg-white/[0.05] ring-1 ring-white/[0.06] sm:block" />
              <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[9px] font-medium text-white/50">
                Today
              </span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-white/[0.08] bg-black/35">
            <div className="min-w-[17.5rem]">
              <div className="grid grid-cols-[minmax(0,4.2fr)_minmax(0,2.4fr)_minmax(0,1.6fr)_minmax(0,2fr)] gap-0 border-b border-white/[0.06] bg-white/[0.03] px-2 py-1.5 text-[8px] font-semibold uppercase tracking-[0.14em] text-white/35 sm:px-2.5 sm:text-[9px]">
                <span>Job</span>
                <span className="hidden sm:inline">Customer</span>
                <span>Status</span>
                <span className="text-right">Window</span>
              </div>
              <div className="divide-y divide-white/[0.05]">
                {rows.map((row) => (
                  <div
                    key={row.id}
                    className="grid grid-cols-[minmax(0,4.2fr)_minmax(0,2.4fr)_minmax(0,1.6fr)_minmax(0,2fr)] items-center gap-0 px-2 py-1.5 sm:px-2.5 sm:py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-mono text-[9px] text-cyan-200/75 sm:text-[10px]">{row.id}</p>
                      <p className="truncate text-[9px] text-white/45 sm:hidden">{row.customer}</p>
                    </div>
                    <p className="hidden min-w-0 truncate text-[10px] text-white/55 sm:block">{row.customer}</p>
                    <div className="min-w-0">
                      <StatusChip tone={row.tone}>{row.status}</StatusChip>
                    </div>
                    <p className="truncate text-right font-mono text-[8px] text-white/40 sm:text-[9px]">{row.window}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {!compact ? (
            <div className="flex flex-wrap gap-2 border-t border-white/[0.06] pt-2">
              <div className="h-7 min-w-[6rem] flex-1 rounded-lg bg-white/[0.04] ring-1 ring-inset ring-white/[0.06]" />
              <div className="flex gap-1.5">
                <span className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1 text-[9px] font-medium text-white/45">
                  Assign crew
                </span>
                <span className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1 text-[9px] font-medium text-white/45">
                  Log visit
                </span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default function ProjectMockup({ project, compact = false }) {
  const shell = compact
    ? "rounded-[1.35rem] border border-white/10 bg-black/30 p-3 sm:p-3.5"
    : "rounded-[1.75rem] border border-white/10 bg-black/30 p-4 sm:p-5"
  const innerGap = compact ? "space-y-3" : "space-y-4"
  const panelPad = compact ? "p-3" : "p-4"
  const nameSize = compact ? "text-base font-semibold" : "text-lg font-semibold"
  const phoneMax = compact ? "max-w-[10rem]" : "max-w-[11rem]"

  return (
    <div className={`relative overflow-hidden ${shell}`}>
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background: `radial-gradient(circle at 30% 20%, ${project.theme.glow}, transparent 55%)`,
        }}
      />
      <div className={`relative ${innerGap}`}>
        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2.5 sm:px-4 sm:py-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          </div>
          <span className="rounded-full bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/60">
            {project.category}
          </span>
        </div>

        <motion.div
          className={`overflow-hidden rounded-[1.2rem] bg-gradient-to-br ${project.theme.panel} ${panelPad} shadow-2xl sm:rounded-[1.35rem]`}
          whileHover={{ y: compact ? -2 : -4 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
        >
          <div className={`${compact ? "mb-3" : "mb-4"} flex items-start justify-between gap-3`}>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                {isPortfolioProjectPrivateOnly(project)
                  ? "Schematic layout (no client data)"
                  : project.slug === "stackless"
                    ? "Dispatch console (preview)"
                    : "Product preview"}
              </p>
              <p className={`mt-1 text-white ${nameSize}`}>
                {project.name}
              </p>
            </div>
            <div
              className={`shrink-0 rounded-2xl bg-gradient-to-r ${project.theme.gradient} px-2.5 py-1 text-[11px] font-medium text-white sm:px-3 sm:py-1.5 sm:text-xs`}
            >
              {project.badge}
            </div>
          </div>

          {portfolioShowsTestFlightUi(project) ? (
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.16em] text-cyan-200/80">
              Available on iOS TestFlight
            </p>
          ) : null}

          {isPortfolioProjectPrivateOnly(project) ? (
            <div className="space-y-3 rounded-2xl border border-white/10 bg-black/25 p-4">
              <p className="text-[11px] font-medium leading-relaxed tracking-normal text-white/50 normal-case">
                {project.privateCaseStudyFootnote ?? "Private internal case study"}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.highlights.map((highlight) => (
                  <span
                    key={highlight}
                    className="rounded-full border border-white/8 bg-white/[0.04] px-2.5 py-1 text-[11px] text-white/65"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="space-y-2 rounded-xl border border-white/8 bg-white/[0.03] p-3">
                  <div className="h-2 w-12 rounded-full bg-white/15" />
                  <div className="h-16 rounded-lg bg-white/8" />
                  <div className="h-2 rounded-full bg-white/10" />
                </div>
                <div className="space-y-2 rounded-xl border border-white/8 bg-white/[0.03] p-3">
                  <div className="h-2 w-10 rounded-full bg-white/15" />
                  <div className="h-16 rounded-lg bg-white/8" />
                  <div className="h-2 w-[80%] rounded-full bg-white/10" />
                </div>
                <div className="space-y-2 rounded-xl border border-white/8 bg-white/[0.03] p-3 sm:col-span-1">
                  <div className="h-2 w-14 rounded-full bg-white/15" />
                  <div className="h-16 rounded-lg bg-white/8" />
                  <div className="h-2 w-[60%] rounded-full bg-white/10" />
                </div>
              </div>
            </div>
          ) : project.slug === "stackless" ? (
            <StacklessOperationsSurface compact={compact} />
          ) : (
            <div className="grid gap-3 sm:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-3 rounded-2xl border border-white/10 bg-black/25 p-3">
                <div className="h-2 w-24 rounded-full bg-white/20" />
                <div className="flex flex-wrap gap-2">
                  {project.highlights.map((highlight) => (
                    <span
                      key={highlight}
                      className="rounded-full border border-white/8 bg-white/[0.04] px-2.5 py-1 text-[11px] text-white/70"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
                <div className="space-y-2">
                  <div className="h-2 rounded-full bg-white/10" />
                  <div className="h-2 w-[80%] rounded-full bg-white/15" />
                  <div className="h-2 w-[60%] rounded-full bg-white/10" />
                </div>
              </div>

              <div className={`relative mx-auto w-full ${phoneMax}`}>
                <div className="absolute inset-x-6 top-0 h-5 rounded-b-2xl bg-black/80" />
                <div className="overflow-hidden rounded-[1.6rem] border border-white/15 bg-slate-950 p-2 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)]">
                  <div
                    className={`rounded-[1.2rem] bg-gradient-to-b ${project.theme.gradient} p-[1px]`}
                  >
                    <div className="rounded-[1.15rem] bg-slate-950 p-3">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-[10px] text-white/50">09:41</span>
                        <span className="text-[10px] text-white/50">5G</span>
                      </div>
                      <div className="space-y-2">
                        <div className="h-8 rounded-xl bg-white/10" />
                        <div className="grid grid-cols-2 gap-2">
                          <div className="h-14 rounded-xl bg-white/8" />
                          <div className="h-14 rounded-xl bg-white/8" />
                        </div>
                        <div className="h-20 rounded-xl bg-white/6" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
