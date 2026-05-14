import { Boxes, Gauge, Layers, ShieldCheck } from "lucide-react"
import { proofStripEyebrow, proofStripItems } from "../../data/proofStrip"
import ScrollReveal from "../ui/ScrollReveal"

const icons = [Boxes, Gauge, Layers, ShieldCheck]

export default function ProofStrip() {
  return (
    <section
      aria-label="Production credibility"
      className="border-b border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-transparent py-8 sm:py-9 lg:py-10"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <p className="text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40">
            {proofStripEyebrow}
          </p>
        </ScrollReveal>

        <div className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-3.5">
          {proofStripItems.map((item, index) => {
            const Icon = icons[index % icons.length]
            return (
              <ScrollReveal key={item.title} delay={index * 0.04}>
                <div className="flex h-full flex-col rounded-2xl border border-white/[0.07] bg-white/[0.02] px-3.5 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:px-4 sm:py-4">
                  <div className="flex items-start gap-2.5">
                    <span className="mt-0.5 inline-flex rounded-lg border border-white/[0.08] bg-white/[0.03] p-1.5">
                      <Icon className="h-3.5 w-3.5 shrink-0 text-cyan-400/70" aria-hidden />
                    </span>
                    <h3 className="min-w-0 text-sm font-semibold leading-snug text-white sm:text-[0.9375rem]">
                      {item.title}
                    </h3>
                  </div>
                  <p className="mt-2 flex-1 text-xs leading-relaxed text-muted sm:text-[13px]">
                    {item.body}
                  </p>
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
