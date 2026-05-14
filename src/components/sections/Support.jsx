import { Check } from "lucide-react"
import { supportIntroCopy, supportPlans } from "../../data/support"
import { primaryCta } from "../../data/sessions"
import { sectionSurface } from "../../lib/sectionSurfaces"
import Button from "../ui/Button"
import ScrollReveal from "../ui/ScrollReveal"
import SectionHeading from "../ui/SectionHeading"

export default function Support() {
  return (
    <section
      id="support"
      className={`relative py-16 sm:py-20 lg:py-24 ${sectionSurface.muted}`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Ongoing support"
          title="A technical partner after launch"
          description={supportIntroCopy}
        />

        <div className="mt-10 sm:mt-12">
          <div className="divide-y divide-white/[0.07] rounded-2xl border border-white/[0.08] bg-white/[0.02]">
            {supportPlans.map((plan, index) => (
              <ScrollReveal key={plan.name} delay={index * 0.05}>
                <div
                  className={`flex flex-col gap-6 px-5 py-8 sm:px-7 sm:py-9 lg:flex-row lg:items-start lg:gap-10 ${
                    plan.highlighted
                      ? "bg-white/[0.03] lg:border-l-2 lg:border-l-indigo-400/35"
                      : ""
                  }`}
                >
                  <div className="min-w-0 lg:w-[min(280px,32%)] lg:shrink-0">
                    <h3 className="text-xl font-semibold text-white sm:text-2xl">
                      {plan.name}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted">
                      {plan.description}
                    </p>
                  </div>
                  <ul className="grid flex-1 gap-x-8 gap-y-2.5 sm:grid-cols-2">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2.5 text-sm text-white/75"
                      >
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/35" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex shrink-0 lg:w-44 lg:flex-col lg:items-stretch lg:justify-center">
                    <Button
                      href="/#contact"
                      variant={plan.highlighted ? "primary" : "secondary"}
                      className="w-full"
                      analyticsCta={primaryCta}
                    >
                      {primaryCta}
                    </Button>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
