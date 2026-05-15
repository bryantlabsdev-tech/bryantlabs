import { Check } from "lucide-react"
import { pricingPaymentNote } from "../../data/billing"
import {
  pricingBandsDisclaimer,
  pricingEngagementNote,
  pricingFirstReplyEyebrow,
  pricingFirstReplyPromise,
  pricingIntro,
  pricingMilestoneAlignmentEyebrow,
  pricingMilestoneExampleIntro,
  pricingMilestoneExamplePhases,
  pricingMilestoneExampleTitle,
  pricingPrimaryPathBody,
  pricingPrimaryPathTitle,
  pricingReferenceBandsTitle,
  pricingSectionEyebrow,
  pricingSectionTitle,
  pricingToIntakeBridge,
  pricingTiers,
} from "../../data/pricing"
import { primaryCta } from "../../data/sessions"
import Button from "../ui/Button"
import GlassCard from "../ui/GlassCard"
import ScrollReveal from "../ui/ScrollReveal"
import SectionHeading from "../ui/SectionHeading"

export default function Pricing() {
  const buildTiers = pricingTiers.filter((t) => t.variant === "build")
  const retainerTier = pricingTiers.find((t) => t.variant === "retainer")

  return (
    <section
      id="pricing"
      className="relative overflow-hidden border-t border-white/[0.07] bg-gradient-to-b from-white/[0.02] via-transparent to-transparent py-16 sm:py-20 lg:py-24"
    >
      <div className="pointer-events-none absolute inset-x-0 top-12 h-72 bg-[radial-gradient(circle_at_50%_20%,rgba(129,140,248,0.14),transparent_65%)] blur-3xl" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={pricingSectionEyebrow}
          title={pricingSectionTitle}
          description={pricingIntro}
        />

        <ScrollReveal className="mx-auto mt-8 max-w-3xl sm:mt-10">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5 sm:px-5 sm:py-4">
            <p className="text-center text-xs font-medium uppercase tracking-[0.14em] text-white/45">
              {pricingMilestoneAlignmentEyebrow}
            </p>
            <p className="mt-2 text-center text-sm leading-relaxed text-muted sm:text-[0.9375rem]">
              {pricingEngagementNote}
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal className="mx-auto mt-5 max-w-3xl sm:mt-6">
          <p className="text-center text-sm leading-relaxed text-muted sm:text-[0.9375rem]">
            {pricingToIntakeBridge}
          </p>
        </ScrollReveal>

        <ScrollReveal className="mt-8 sm:mt-10">
          <GlassCard
            hover={false}
            className="relative mx-auto max-w-4xl overflow-hidden border border-indigo-300/20 bg-gradient-to-b from-[#1a1530]/88 via-[#12101f]/92 to-[#0c0a14]/95 p-6 shadow-[0_22px_70px_-40px_rgba(99,102,241,0.55)] sm:p-8 lg:p-10"
          >
            <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-indigo-100/10" />
            <div className="pointer-events-none absolute -left-16 -top-12 h-40 w-40 rounded-full bg-violet-500/14 blur-3xl" />
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300/85">
                {pricingPrimaryPathTitle}
              </p>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
                {pricingPrimaryPathBody}
              </p>

              <div className="mt-6 rounded-2xl border border-cyan-400/12 bg-gradient-to-br from-cyan-500/[0.07] via-transparent to-transparent px-4 py-3.5 sm:px-5 sm:py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300/85">
                  {pricingFirstReplyEyebrow}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/85 sm:text-[0.9375rem]">
                  {pricingFirstReplyPromise}
                </p>
              </div>

              <div className="mt-8 space-y-4 border-t border-white/[0.08] pt-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
                  {pricingReferenceBandsTitle}
                </p>
                <div className="mt-5 divide-y divide-white/[0.08]">
                  {buildTiers.map((tier) => (
                    <div
                      key={tier.id}
                      className={`grid gap-4 py-5 first:pt-0 last:pb-0 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start sm:gap-6 ${
                        tier.highlighted
                          ? "relative before:absolute before:left-0 before:top-5 before:h-[calc(100%-2.5rem)] before:w-px before:rounded-full before:bg-indigo-400/50 sm:pl-5 sm:before:left-1"
                          : ""
                      }`}
                    >
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/45">
                          {tier.priceNote}
                        </p>
                        <p className="mt-1 text-lg font-semibold text-white sm:text-xl">{tier.name}</p>
                        <p className="mt-2 text-sm leading-relaxed text-muted">{tier.description}</p>
                        {tier.features?.length ? (
                          <ul className="mt-3 space-y-1.5 text-xs leading-snug text-white/55 sm:text-[0.8125rem]">
                            {tier.features.map((feature) => (
                              <li key={feature} className="flex gap-2">
                                <Check
                                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-400/55"
                                  aria-hidden
                                />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                      <p className="text-2xl font-semibold tracking-tight text-white sm:pt-6 sm:text-right sm:text-3xl">
                        {tier.price}
                      </p>
                    </div>
                  ))}
                </div>

                {retainerTier ? (
                  <div className="rounded-2xl border border-white/[0.09] bg-white/[0.025] p-4 sm:p-5">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/45">
                          {retainerTier.priceNote}
                        </p>
                        <p className="mt-1 text-lg font-semibold text-white sm:text-xl">{retainerTier.name}</p>
                      </div>
                      <p className="text-xl font-semibold text-white sm:text-2xl">{retainerTier.price}</p>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{retainerTier.description}</p>
                    {retainerTier.features?.length ? (
                      <ul className="mt-3 space-y-1.5 text-xs leading-snug text-white/55 sm:text-[0.8125rem]">
                        {retainerTier.features.map((feature) => (
                          <li key={feature} className="flex gap-2">
                            <Check
                              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-400/55"
                              aria-hidden
                            />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                <p className="max-w-xl text-xs leading-relaxed text-white/50 sm:text-sm">
                  {pricingBandsDisclaimer}
                </p>
                <Button
                  href="/#contact"
                  variant="primary"
                  className="w-full shrink-0 sm:w-auto"
                  analyticsCta={primaryCta}
                >
                  {primaryCta}
                </Button>
              </div>
            </div>
          </GlassCard>
        </ScrollReveal>

        <ScrollReveal className="mt-8 sm:mt-10">
          <div className="mx-auto max-w-3xl rounded-2xl border border-white/[0.07] bg-white/[0.02] px-4 py-4 sm:px-6 sm:py-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
              {pricingMilestoneExampleTitle}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted sm:text-sm">
              {pricingMilestoneExampleIntro}
            </p>
            <ul className="mt-4 space-y-2.5 text-sm leading-snug text-white/80 sm:text-[0.9375rem]">
              {pricingMilestoneExamplePhases.map((line) => (
                <li key={line} className="flex gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400/70" aria-hidden />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>

        <ScrollReveal className="mt-7 sm:mt-9">
          <p className="max-w-3xl text-sm leading-relaxed text-muted">
            {pricingPaymentNote}
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}
