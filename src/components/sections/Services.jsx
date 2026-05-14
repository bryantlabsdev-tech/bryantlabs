import { services } from "../../data/services"
import { sectionSurface } from "../../lib/sectionSurfaces"
import GlassCard from "../ui/GlassCard"
import ScrollReveal from "../ui/ScrollReveal"
import SectionHeading from "../ui/SectionHeading"

export default function Services() {
  return (
    <section
      id="services"
      className={`relative py-16 sm:py-20 lg:py-24 ${sectionSurface.lift}`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Services"
          title="Software that removes friction from how you operate"
          description="From mobile apps and dashboards to automation workflows and AI-powered tools—software shaped around how your business runs."
        />

        <div className="mt-10 grid gap-4 sm:mt-14 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <ScrollReveal key={service.title} delay={index * 0.05}>
                <GlassCard className="group h-full p-5 sm:p-6">
                  <div
                    className={`mb-5 inline-flex rounded-2xl bg-gradient-to-br ${service.accent} p-3`}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {service.description}
                  </p>
                </GlassCard>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
