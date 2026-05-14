import { services } from "../../data/services"
import { sectionSurface } from "../../lib/sectionSurfaces"
import GlassCard from "../ui/GlassCard"
import ScrollReveal from "../ui/ScrollReveal"
import SectionBridge from "../ui/SectionBridge"
import SectionHeading from "../ui/SectionHeading"

export default function Services() {
  return (
    <section
      id="services"
      className={`relative py-14 sm:py-20 lg:py-24 ${sectionSurface.lift}`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Capabilities"
          title="Systems and surfaces we design, build, and run"
          description="SaaS foundations, internal operations, field workflows, and AI-assisted products—milestone delivery, scoped engagements, and deploy-ready handoffs. Best with teams that value implementation fit over slide-deckware."
        />

        <div className="mt-8 grid gap-3.5 sm:mt-12 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <ScrollReveal key={service.title} delay={index * 0.05}>
                <GlassCard className="group h-full p-4 sm:p-6">
                  <div
                    className={`mb-4 inline-flex rounded-2xl bg-gradient-to-br ${service.accent} p-3 transition-transform duration-300 group-hover:scale-[1.02] sm:mb-5`}
                  >
                    <Icon className="h-5 w-5 text-white" aria-hidden />
                  </div>
                  <h3 className="text-lg font-semibold leading-snug text-white sm:text-xl">
                    {service.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted sm:mt-3">
                    {service.description}
                  </p>
                </GlassCard>
              </ScrollReveal>
            )
          })}
        </div>

        <SectionBridge className="mt-9 sm:mt-11">
          <p className="text-center text-sm leading-relaxed text-muted sm:text-left">
            <span className="font-medium text-white/85">Shipped systems below</span>{" "}
            show how those capabilities land in production—milestone-ready web and
            mobile surfaces, plus private internal tooling where appropriate.
          </p>
          <p className="mt-2.5 text-center sm:text-left">
            <a
              href="/#work"
              className="inline-flex min-h-10 items-center justify-center text-sm font-medium text-cyan-300/90 underline decoration-cyan-400/35 underline-offset-4 transition-colors hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40 focus-visible:ring-offset-2 focus-visible:ring-offset-ink sm:min-h-0 sm:justify-start"
            >
              View portfolio →
            </a>
          </p>
        </SectionBridge>
      </div>
    </section>
  )
}
