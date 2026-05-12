import { Check } from "lucide-react"
import { pricingPaymentNote } from "../../data/billing"
import { pricingIntro, pricingTiers } from "../../data/pricing"
import { primaryCta } from "../../data/sessions"
import Button from "../ui/Button"
import GlassCard from "../ui/GlassCard"
import ScrollReveal from "../ui/ScrollReveal"
import SectionHeading from "../ui/SectionHeading"

export default function Pricing() {
  return (
    <section id="pricing" className="py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Pricing"
          title="Milestone-based engagements, scoped to your build"
          description={pricingIntro}
        />

        <div className="mt-10 grid gap-5 sm:mt-12 sm:gap-6 lg:grid-cols-3">
          {pricingTiers.map((tier, index) => (
            <ScrollReveal key={tier.name} delay={index * 0.06}>
              <GlassCard
                hover={false}
                className={`flex h-full flex-col p-6 sm:p-7 ${
                  tier.highlighted
                    ? "glow-ring border-indigo-400/30 bg-gradient-to-b from-indigo-500/10 to-white/[0.03]"
                    : ""
                }`}
              >
                <p className="text-sm font-medium text-indigo-300/85">
                  {tier.priceNote}
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-white">
                  {tier.name}
                </h3>
                <p className="mt-4 text-4xl font-semibold tracking-tight text-white">
                  {tier.price}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  {tier.description}
                </p>
                <ul className="mt-6 space-y-3">
                  {tier.features.map((feature) => (
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
                  variant={tier.highlighted ? "primary" : "secondary"}
                  className="mt-8 w-full"
                  analyticsCta={primaryCta}
                >
                  {primaryCta}
                </Button>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="mt-8 sm:mt-10">
          <p className="max-w-3xl text-sm leading-relaxed text-muted">
            {pricingPaymentNote}
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}
