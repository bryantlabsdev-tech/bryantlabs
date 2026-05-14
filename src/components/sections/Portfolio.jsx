import { useCallback, useMemo, useState } from "react"
import { projects } from "../../data/projects"
import { sectionSurface } from "../../lib/sectionSurfaces"
import PortfolioProjectCard from "../portfolio/PortfolioProjectCard"
import ScrollReveal from "../ui/ScrollReveal"
import SectionHeading from "../ui/SectionHeading"

export default function Portfolio() {
  const [stackExpanded, setStackExpanded] = useState({})

  const toggleStack = useCallback((key) => {
    setStackExpanded((prev) => ({ ...prev, [key]: !prev[key] }))
  }, [])

  const { featuredProject, supportingProjects } = useMemo(() => {
    const featured = projects.find((p) => p.featured === true) ?? null
    const supporting = projects.filter((p) => p.featured !== true)
    return { featuredProject: featured, supportingProjects: supporting }
  }, [])

  return (
    <section
      id="work"
      className={`relative py-12 sm:py-20 lg:py-24 ${sectionSurface.band}`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Platforms & systems we've shipped"
          description="Stackless leads as the flagship contractor operations build; Ummah, TrackoraAI, and TrackoraHQ sit alongside it at the same engineering bar—social, subscription SaaS, and private internal tooling. Public web, mobile, and TestFlight links only where a build is shared publicly."
        />

        {featuredProject ? (
          <div className="mt-8 sm:mt-14">
            <PortfolioProjectCard
              project={featuredProject}
              variant="featured"
              visualIndex={0}
              delay={0.04}
              stackExpanded={stackExpanded}
              toggleStack={toggleStack}
            />
          </div>
        ) : null}

        {supportingProjects.length > 0 ? (
          <div className="mt-8 sm:mt-10">
            <ScrollReveal>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/38">
                Supporting builds
              </p>
              <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted sm:text-sm">
                Same delivery discipline—compressed layout for faster scanning.
              </p>
            </ScrollReveal>

            <div className="mt-4 space-y-4 sm:mt-5 sm:space-y-5">
              {supportingProjects.map((project, index) => (
                <PortfolioProjectCard
                  key={project.name}
                  project={project}
                  variant="supporting"
                  visualIndex={index}
                  delay={0.05 + index * 0.05}
                  stackExpanded={stackExpanded}
                  toggleStack={toggleStack}
                />
              ))}
            </div>
          </div>
        ) : null}

        <ScrollReveal className="mt-10 sm:mt-16">
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] px-4 py-4 sm:px-7 sm:py-6">
            <div className="pointer-events-none absolute -right-16 -top-20 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-indigo-300/75">
              What happens next
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
              After you explore recent builds, here is the typical Bryant Labs
              workflow—from intake through milestones—so you know how engagements
              move forward before pricing and support options.
            </p>
            <p className="mt-3 text-xs font-medium text-white/50">
              Continue to{" "}
              <a
                href="/#process"
                className="text-cyan-300/90 underline decoration-cyan-400/30 underline-offset-4 transition-colors hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                engagement path
              </a>{" "}
              below.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
