import { processSteps } from "../../data/process"
import ScrollReveal from "../ui/ScrollReveal"
import SectionHeading from "../ui/SectionHeading"

export default function Process() {
  return (
    <section id="process" className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Process"
          title="A delivery rhythm designed for momentum"
          description="We build the system for you from start to finish. You stay close to the vision and decisions that matter — not the day-to-day technical work."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-4">
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
      </div>
    </section>
  )
}
