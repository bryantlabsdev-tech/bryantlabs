import { Check } from "lucide-react"
import {
  supportCapabilities,
  supportEngagementsPoints,
  supportEngagementsTitle,
  supportIntroCopy,
  supportPartnerCopy,
  supportPlans,
} from "../../data/support"
import { primaryCta } from "../../data/sessions"
import Button from "../ui/Button"
import GlassCard from "../ui/GlassCard"
import ScrollReveal from "../ui/ScrollReveal"
import SectionHeading from "../ui/SectionHeading"

export default function Support() {
  return (
    <section id="support" className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Ongoing Support"
          title="A technical partner after launch"
          description={`${supportIntroCopy} ${supportPartnerCopy}`}
        />

        <ScrollReveal className="mt-10 flex flex-wrap gap-2">
          {supportCapabilities.map((capability) => (
            <span
              key={capability}
              className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/75"
            >
              {capability}
            </span>
          ))}
        </ScrollReveal>

        <ScrollReveal className="mt-14">
          <GlassCard hover={false} className="p-6 sm:p-8">
            <h3 className="text-xl font-semibold text-white">
              {supportEngagementsTitle}
            </h3>
            <ul className="mt-6 grid gap-3 lg:grid-cols-3">
              {supportEngagementsPoints.map((point) => (
                <li
                  key={point}
                  className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 text-sm leading-relaxed text-white/75"
                >
                  {point}
                </li>
              ))}
            </ul>
          </GlassCard>
        </ScrollReveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {supportPlans.map((plan, index) => (
            <ScrollReveal key={plan.name} delay={index * 0.06}>
              <GlassCard
                hover={false}
                className={`flex h-full flex-col p-7 ${
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
