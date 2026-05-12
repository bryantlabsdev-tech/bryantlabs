import { motion } from "framer-motion"

function hasTestFlightLink(project) {
  return project.links?.some((link) => link.href.includes("testflight.apple.com"))
}

export default function ProjectMockup({ project }) {
  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-black/30 p-4 sm:p-5">
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background: `radial-gradient(circle at 30% 20%, ${project.theme.glow}, transparent 55%)`,
        }}
      />
      <div className="relative space-y-4">
        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
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
          className={`overflow-hidden rounded-[1.35rem] bg-gradient-to-br ${project.theme.panel} p-4 shadow-2xl`}
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
        >
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                Product preview
              </p>
              <p className="mt-1 text-lg font-semibold text-white">
                {project.name}
              </p>
            </div>
            <div
              className={`shrink-0 rounded-2xl bg-gradient-to-r ${project.theme.gradient} px-3 py-1.5 text-xs font-medium text-white`}
            >
              {project.badge}
            </div>
          </div>

          {hasTestFlightLink(project) ? (
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.16em] text-cyan-200/80">
              Available on iOS TestFlight
            </p>
          ) : null}

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
                <div className="h-2 w-4/5 rounded-full bg-white/15" />
                <div className="h-2 w-3/5 rounded-full bg-white/10" />
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[11rem]">
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
        </motion.div>
      </div>
    </div>
  )
}
