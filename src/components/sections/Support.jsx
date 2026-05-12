import { Check } from "lucide-react"
import { supportIntroCopy, supportPlans } from "../../data/support"
import { primaryCta } from "../../data/sessions"
import Button from "../ui/Button"
import GlassCard from "../ui/GlassCard"
import ScrollReveal from "../ui/ScrollReveal"
import SectionHeading from "../ui/SectionHeading"

export default function Support() {
  return (
    <section id="support" className="py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Ongoing support"
          title="A technical partner after launch"
          description={supportIntroCopy}
        />

        <div className="mt-10 grid gap-5 sm:mt-12 sm:gap-6 lg:grid-cols-3">
          {supportPlans.map((plan, index) => (
            <ScrollReveal key={plan.name} delay={index * 0.06}>
              <GlassCard
                hover={false}
                className={`flex h-full flex-col p-6 sm:p-7 ${
                  plan.highlighted
                    ? "glow-ring border-indigo-400/30 bg-gradient-to-b from-indigo-500/10 to-white/[0.03]"
                    : ""
                }`}
              >
                <h3 className="text-2xl font-semibold text-white">{plan.name}</h3>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  {plan.description}
                </p>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-white/80"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  href="/#contact"
                  variant={plan.highlighted ? "primary" : "secondary"}
                  className="mt-8 w-full"
                  analyticsCta={primaryCta}
                >
                  {primaryCta}
                </Button>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
