import { motion } from "framer-motion"
import {
  isPortfolioProjectPrivateOnly,
  portfolioShowsTestFlightUi,
} from "../../lib/portfolioVisibility"

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
