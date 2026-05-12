import {
  projectForwardIntro,
  projectForwardSteps,
  projectForwardTitle,
} from "../../data/consultation"
import ScrollReveal from "../ui/ScrollReveal"
import SectionHeading from "../ui/SectionHeading"

export default function Process() {
  return (
    <section id="process" className="py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Engagement path"
          title={projectForwardTitle}
          description={projectForwardIntro}
        />

        <div className="mt-10 grid gap-4 sm:mt-12 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projectForwardSteps.map((step, index) => (
            <ScrollReveal key={step.step} delay={index * 0.05}>
              <div className="h-full rounded-3xl border border-white/8 bg-white/[0.03] p-5 sm:p-6">
                <p className="text-sm font-semibold text-cyan-300/90">
                  {step.step}
                </p>
                <h3 className="mt-3 text-lg font-semibold text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
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
