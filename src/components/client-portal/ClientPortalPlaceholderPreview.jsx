/**
 * Decorative-only preview for /client-login.
 * Replace this subtree later with a real client dashboard without changing the page shell.
 */
export default function ClientPortalPlaceholderPreview() {
  return (
    <div
      className="pointer-events-none select-none"
      aria-hidden
    >
      <p className="mb-4 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-white/35">
        Interface preview
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:gap-5">
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03] p-4 sm:p-5 lg:col-span-7">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-cyan-500/5" />
          <div className="relative space-y-4 blur-[1.5px] opacity-[0.72]">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
              Milestones
            </p>
            <div className="space-y-3">
              {["Discovery wrap", "Design system", "Build sprint 2"].map((label, i) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-3 py-2.5"
                >
                  <span className="h-2 w-2 shrink-0 rounded-full bg-cyan-400/80" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-white/85">{label}</p>
                    <p className="text-[11px] text-white/35">
                      {i === 0 ? "Complete" : i === 1 ? "In progress" : "Queued"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/[0.04]" />
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03] p-4 sm:p-5 lg:col-span-5">
          <div className="relative space-y-5 blur-[1.5px] opacity-[0.72]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
                Overall progress
              </p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[58%] rounded-full bg-gradient-to-r from-indigo-400/90 to-cyan-400/80" />
              </div>
              <p className="mt-2 text-[11px] text-white/40">Placeholder progress</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
                Launch checklist
              </p>
              <ul className="mt-3 space-y-2 text-[13px] text-white/55">
                <li className="flex gap-2">
                  <span className="text-emerald-400/70">✓</span> QA pass
                </li>
                <li className="flex gap-2">
                  <span className="text-white/25">○</span> Store listing
                </li>
                <li className="flex gap-2">
                  <span className="text-white/25">○</span> Handoff call
                </li>
              </ul>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/[0.04]" />
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03] p-4 sm:p-5 lg:col-span-5">
          <div className="relative space-y-3 blur-[1.5px] opacity-[0.72]">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
              Recent updates
            </p>
            <div className="space-y-2 rounded-2xl border border-white/10 bg-black/25 p-3">
              <p className="text-[13px] leading-snug text-white/70">
                Build notes — placeholder copy for layout only.
              </p>
              <p className="text-[11px] text-white/35">Yesterday · Preview</p>
            </div>
            <div className="space-y-2 rounded-2xl border border-white/10 bg-black/25 p-3">
              <p className="text-[13px] leading-snug text-white/70">
                Shared assets — sample message row.
              </p>
              <p className="text-[11px] text-white/35">This week · Preview</p>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/[0.04]" />
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03] p-4 sm:p-5 lg:col-span-7">
          <div className="relative blur-[1.5px] opacity-[0.72]">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
              Sprint focus
            </p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[40, 72, 28].map((w) => (
                <div key={w} className="rounded-xl border border-white/10 bg-black/30 p-2">
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-indigo-400/70"
                      style={{ width: `${w}%` }}
                    />
                  </div>
                  <p className="mt-2 text-[10px] text-white/35">Widget</p>
                </div>
              ))}
            </div>
          </div>
          <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/[0.04]" />
        </div>
      </div>
    </div>
  )
}
