import { ExternalLink } from "lucide-react"
import {
  studioInspectionEyebrow,
  studioInspectionIntro,
  studioInspectionLinks,
  studioOperatingDefaults,
} from "../../data/studioInspection"
import ScrollReveal from "../ui/ScrollReveal"

export default function StudioInspectionStrip() {
  return (
    <section
      aria-label="Public surfaces and operating defaults"
      className="border-b border-white/[0.06] bg-[radial-gradient(ellipse_at_50%_0%,rgba(99,102,241,0.06),transparent_55%)] py-7 sm:py-8"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:px-6 sm:py-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
              <div className="min-w-0 lg:max-w-md">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-indigo-300/75">
                  {studioInspectionEyebrow}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted sm:text-[0.9375rem]">
                  {studioInspectionIntro}
                </p>
                <ul className="mt-3 space-y-1.5 border-t border-white/[0.06] pt-3">
                  {studioOperatingDefaults.map((line) => (
                    <li
                      key={line}
                      className="border-l-2 border-cyan-400/25 pl-3 text-[11px] leading-snug text-white/55 sm:text-xs sm:leading-relaxed"
                    >
                      {line}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-2.5 lg:items-end lg:pt-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35 lg:text-right">
                  Live surfaces
                </p>
                <div className="flex flex-wrap gap-2 lg:justify-end">
                  {studioInspectionLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-9 items-center gap-1.5 rounded-xl border border-white/[0.09] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-cyan-200/90 transition-colors hover:border-cyan-400/25 hover:bg-white/[0.05] hover:text-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                    >
                      {link.label}
                      <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
