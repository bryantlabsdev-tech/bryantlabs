import {
  projectForwardIntro,
  projectForwardSteps,
  projectForwardTitle,
} from "../../data/consultation"
import { sectionSurface } from "../../lib/sectionSurfaces"
import ScrollReveal from "../ui/ScrollReveal"
import SectionBridge from "../ui/SectionBridge"
import SectionHeading from "../ui/SectionHeading"

function DashboardVignette() {
  return (
    <div
      className="rounded-2xl border border-white/10 bg-black/35 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
      aria-hidden
    >
      <div className="flex items-center justify-between gap-2 border-b border-white/8 pb-2">
        <div className="h-2 w-16 rounded-full bg-white/15" />
        <div className="flex gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
        </div>
      </div>
      <div className="mt-3">
        <div className="flex h-20 items-end gap-1.5">
          {[32, 52, 36, 64, 44].map((h, i) => (
            <div
              key={i}
              className="w-2 rounded-sm bg-gradient-to-t from-indigo-500/40 to-cyan-400/50"
              style={{ height: `${h}px` }}
            />
          ))}
        </div>
        <div className="space-y-1.5 pt-1">
          <div className="h-1.5 w-full rounded-full bg-white/10" />
          <div className="h-1.5 w-[85%] rounded-full bg-white/8" />
          <div className="h-1.5 w-[60%] rounded-full bg-white/6" />
        </div>
      </div>
    </div>
  )
}

function PipelineVignette() {
  return (
    <div
      className="rounded-2xl border border-white/10 bg-black/35 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
      aria-hidden
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
        Milestone lane
      </p>
      <div className="mt-3 space-y-2">
        {["Intake", "Scope", "Build", "Ship"].map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold ${
                i < 2
                  ? "border-cyan-400/35 bg-cyan-400/10 text-cyan-200/90"
                  : "border-white/10 bg-white/[0.04] text-white/45"
              }`}
            >
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-white/80">{label}</p>
              <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-400/70 to-cyan-300/60"
                  style={{ width: i < 2 ? "100%" : i === 2 ? "42%" : "0%" }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Process() {
  return (
    <section
      id="process"
      className={`relative py-16 sm:py-20 lg:py-24 ${sectionSurface.cool}`}
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-indigo-950/10 to-transparent blur-2xl" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionBridge className="mb-8 sm:mb-10">
          <p className="text-sm leading-relaxed text-muted">
            Above: shipped systems and live surfaces. Below: how Bryant Labs
            sequences work—intake alignment, scoped milestones, and approvals
            between phases—before you reach pricing or support options.
          </p>
        </SectionBridge>

        <SectionHeading
          eyebrow="Engagement path"
          title={projectForwardTitle}
          description={projectForwardIntro}
        />

        <div className="mt-10 lg:mt-14 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(200px,260px)] lg:items-start lg:gap-12 xl:gap-16">
          <div className="relative max-w-3xl lg:max-w-none">
            <div
              className="absolute left-[0.65rem] top-2 bottom-2 w-px bg-gradient-to-b from-cyan-400/35 via-white/12 to-white/5 sm:left-[0.85rem]"
              aria-hidden
            />
            <ul className="relative space-y-8 sm:space-y-10">
              {projectForwardSteps.map((item, index) => (
                <ScrollReveal key={item.step} delay={index * 0.05}>
                  <li className="relative flex gap-5 sm:gap-6 pl-9 sm:pl-11">
                    <span
                      className="absolute left-0 top-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-cyan-400/40 bg-ink text-[10px] font-bold text-cyan-200/95 shadow-[0_0_0_4px_rgba(5,5,8,0.85)] sm:left-0.5 sm:top-1 sm:h-7 sm:w-7 sm:text-[11px]"
                      aria-hidden
                    >
                      {item.step}
                    </span>
                    <div className="min-w-0 flex-1 rounded-2xl border border-white/8 bg-white/[0.025] px-4 py-4 sm:px-5 sm:py-5">
                      <h3 className="text-lg font-semibold text-white sm:text-xl">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">
                        {item.description}
                      </p>
                    </div>
                  </li>
                </ScrollReveal>
              ))}
            </ul>
          </div>

          <div className="mt-10 space-y-4 lg:sticky lg:top-28 lg:mt-0">
            <ScrollReveal>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
                Studio preview
              </p>
              <p className="mt-1 text-sm text-muted">
                Lightweight views of how milestones and reporting typically look
                in active engagements.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.06}>
              <DashboardVignette />
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <PipelineVignette />
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  )
}
