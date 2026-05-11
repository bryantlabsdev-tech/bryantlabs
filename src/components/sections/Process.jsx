import {
  billingIntro,
  billingPhases,
  billingTitle,
} from "../../data/billing"
import {
  consultationFlowIntro,
  consultationFlowTitle,
} from "../../data/consultation"
import { processSteps } from "../../data/process"
import GlassCard from "../ui/GlassCard"
import ScrollReveal from "../ui/ScrollReveal"
import SectionHeading from "../ui/SectionHeading"

export default function Process() {
  return (
    <section id="process" className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Consultation flow"
          title={consultationFlowTitle}
          description={consultationFlowIntro}
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {processSteps.map((step, index) => (
            <ScrollReveal key={step.step} delay={index * 0.06}>
              <div className="relative h-full rounded-3xl border border-white/8 bg-white/[0.03] p-6">
                <p className="text-sm font-semibold text-cyan-300/90">
                  {step.step}
                </p>
                <h3 className="mt-4 text-xl font-semibold text-white">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {step.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="mt-14">
          <GlassCard hover={false} className="p-6 sm:p-8">
            <h3 className="text-xl font-semibold text-white">{billingTitle}</h3>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
              {billingIntro}
            </p>
            <ol className="mt-8 grid gap-4 lg:grid-cols-3">
              {billingPhases.map((phase, index) => (
                <li
                  key={phase.title}
                  className="rounded-2xl border border-white/8 bg-white/[0.03] p-5"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300/80">
                    Step {index + 1}
                  </p>
                  <h4 className="mt-3 text-base font-semibold text-white">
                    {phase.title}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-white/75">
                    {phase.description}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {phase.detail}
                  </p>
                </li>
              ))}
            </ol>
          </GlassCard>
        </ScrollReveal>
      </div>
    </section>
  )
}
