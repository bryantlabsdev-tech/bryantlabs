import { Check } from "lucide-react"
import { pricingPaymentNote } from "../../data/billing"
import {
  pricingEngagementNote,
  pricingIntro,
  pricingTiers,
} from "../../data/pricing"
import { primaryCta } from "../../data/sessions"
import Button from "../ui/Button"
import GlassCard from "../ui/GlassCard"
import ScrollReveal from "../ui/ScrollReveal"
import SectionHeading from "../ui/SectionHeading"

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="relative overflow-hidden border-t border-white/[0.07] bg-gradient-to-b from-white/[0.02] via-transparent to-transparent py-16 sm:py-20 lg:py-24"
    >
      <div className="pointer-events-none absolute inset-x-0 top-12 h-72 bg-[radial-gradient(circle_at_50%_20%,rgba(129,140,248,0.14),transparent_65%)] blur-3xl" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Engagements"
          title="How Bryant Labs structures investments in your build"
          description={pricingIntro}
        />

        <ScrollReveal className="mx-auto mt-8 max-w-3xl sm:mt-10">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5 sm:px-5 sm:py-4">
            <p className="text-center text-xs font-medium uppercase tracking-[0.14em] text-white/45">
              How estimates work
            </p>
            <p className="mt-2 text-center text-sm leading-relaxed text-muted sm:text-[0.9375rem]">
              {pricingEngagementNote}
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-8 grid gap-5 sm:mt-10 sm:gap-6 lg:grid-cols-3">
          {pricingTiers.map((tier, index) => {
            const isRetainer = tier.variant === "retainer"
            const isHighlighted = tier.highlighted && !isRetainer

            return (
              <ScrollReveal key={tier.id ?? tier.name} delay={index * 0.06}>
                <GlassCard
                  hover={false}
                  className={
                    isRetainer
                      ? "group relative flex h-full flex-col overflow-hidden border border-white/[0.09] bg-gradient-to-b from-white/[0.04] to-white/[0.02] p-6 shadow-none sm:p-7"
                      : `group relative flex h-full flex-col overflow-hidden border border-indigo-300/22 bg-gradient-to-b from-[#1a1530]/92 via-[#151126]/94 to-[#100d1d]/96 p-6 shadow-[0_18px_60px_-36px_rgba(99,102,241,0.55)] transition-all duration-300 hover:border-indigo-300/40 hover:shadow-[0_24px_74px_-34px_rgba(129,140,248,0.78)] sm:p-7 ${
                          isHighlighted
                            ? "glow-ring border-indigo-200/45 bg-gradient-to-b from-[#251e47]/95 via-[#1a1433]/96 to-[#120f23]/97 shadow-[0_30px_92px_-36px_rgba(129,140,248,0.95)]"
                            : ""
                        }`
                  }
                >
                  {!isRetainer ? (
                    <>
                      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-indigo-100/10" />
                      <div className="pointer-events-none absolute -left-10 -top-8 h-36 w-36 rounded-full bg-violet-500/18 blur-3xl" />
                      <div className="pointer-events-none absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-indigo-400/16 blur-3xl" />
                      <div
                        className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                          isHighlighted
                            ? "bg-[radial-gradient(circle_at_top,rgba(167,139,250,0.30),transparent_62%)]"
                            : "bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.2),transparent_65%)]"
                        }`}
                      />
                      {isHighlighted ? (
                        <>
                          <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-indigo-300/30 blur-3xl" />
                          <div className="pointer-events-none absolute left-6 top-6 h-20 w-20 rounded-full bg-violet-300/18 blur-2xl" />
                        </>
                      ) : null}
                    </>
                  ) : (
                    <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/[0.06]" />
                  )}

                  <div className="relative">
                    <p
                      className={
                        isRetainer
                          ? "text-xs font-semibold uppercase tracking-[0.16em] text-white/50"
                          : "text-sm font-medium text-indigo-300/85"
                      }
                    >
                      {tier.priceNote}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold leading-snug text-white sm:text-2xl">
                      {tier.name}
                    </h3>
                    <p
                      className={`mt-3 font-semibold tracking-tight text-white ${
                        isRetainer
                          ? "text-2xl sm:text-3xl"
                          : tier.price.length > 24
                            ? "text-2xl leading-tight sm:text-3xl"
                            : "text-3xl sm:text-4xl"
                      }`}
                    >
                      {tier.price}
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-muted">
                      {tier.description}
                    </p>
                    <ul className="mt-6 space-y-3">
                      {tier.features.map((feature) => (
                        <li
                          key={feature}
                          className={`flex items-start gap-3 text-sm ${
                            isRetainer ? "text-white/75" : "text-white/80"
                          }`}
                        >
                          <Check
                            className={`mt-0.5 h-4 w-4 shrink-0 ${
                              isRetainer ? "text-white/35" : "text-cyan-300"
                            }`}
                          />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      href="/#contact"
                      variant={isHighlighted ? "primary" : "secondary"}
                      className="mt-8 w-full"
                      analyticsCta={primaryCta}
                    >
                      {primaryCta}
                    </Button>
                  </div>
                </GlassCard>
              </ScrollReveal>
            )
          })}
        </div>

        <ScrollReveal className="mt-7 sm:mt-9">
          <p className="max-w-3xl text-sm leading-relaxed text-muted">
            {pricingPaymentNote}
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}
