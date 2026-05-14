import { Check, ExternalLink } from "lucide-react"
import { projects } from "../../data/projects"
import {
  isPortfolioProjectPrivateOnly,
  portfolioShowsTestFlightUi,
} from "../../lib/portfolioVisibility"
import { sectionSurface } from "../../lib/sectionSurfaces"
import ProjectMockup from "../portfolio/ProjectMockup"
import Button from "../ui/Button"
import ScrollReveal from "../ui/ScrollReveal"
import SectionHeading from "../ui/SectionHeading"

export default function Portfolio() {
  return (
    <section
      id="work"
      className={`relative py-14 sm:py-20 lg:py-24 ${sectionSurface.band}`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Platforms & systems we've shipped"
          description="Production-grade social platforms, AI workflow products, sales operations tooling, and contractor systems—public web, mobile, and TestFlight links only where a build is shared publicly."
        />

        <div className="mt-10 space-y-6 sm:mt-14 sm:space-y-10">
          {projects.map((project, index) => (
            <ScrollReveal key={project.name} delay={index * 0.06}>
              <article className="grid items-center gap-6 rounded-[1.5rem] border border-white/[0.09] bg-white/[0.025] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:gap-8 sm:rounded-[2rem] sm:p-6 lg:grid-cols-2 lg:p-8">
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <ProjectMockup project={project} />
                </div>
                <div className={`min-w-0 ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-300/80">
                      {project.category}
                    </p>
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-white/70">
                      {project.badge}
                    </span>
                  </div>
                  <h3 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
                    {project.name}
                  </h3>
                  <p className="mt-2 text-lg text-white/80">{project.tagline}</p>
                  <p className="mt-4 text-sm leading-relaxed text-muted">
                    {project.description}
                  </p>
                  {project.highlights?.length ? (
                    <ul className="mt-5 space-y-2.5 border-t border-white/[0.06] pt-5">
                      {project.highlights.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2.5 text-sm leading-snug text-white/85"
                        >
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400/75" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {project.stack?.length ? (
                    <div className="mt-6 border-t border-white/[0.06] pt-6">
                      <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/38">
                        {project.stackLabel ?? "Tech stack"}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {project.stack.map((item) => (
                          <span
                            key={item}
                            className="rounded-full border border-white/[0.07] bg-white/[0.025] px-2.5 py-0.5 text-[11px] font-medium leading-snug text-white/60 sm:px-3 sm:py-1 sm:text-xs"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  {portfolioShowsTestFlightUi(project) ? (
                    <p className="mt-4 text-xs font-medium uppercase tracking-[0.16em] text-cyan-300/80">
                      Available on iOS TestFlight
                    </p>
                  ) : null}
                  {isPortfolioProjectPrivateOnly(project) ? (
                    <p className="mt-4 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm leading-relaxed text-muted">
                      {project.privateCaseStudyFootnote ??
                        "Private internal case study"}
                    </p>
                  ) : (
                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                      {project.links?.length > 0 ? (
                        project.links.map((link) => (
                          <Button
                            key={`${project.name}-${link.label}`}
                            href={link.href}
                            variant="secondary"
                            className="w-full sm:w-auto"
                            analyticsCta={`${project.name}: ${link.label}`}
                          >
                            {link.label}
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        ))
                      ) : (
                        <Button variant="secondary" className="w-full sm:w-auto" disabled>
                          Case Study Coming Soon
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="mt-12 sm:mt-16">
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] px-5 py-5 sm:px-7 sm:py-6">
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
                className="text-cyan-300/90 underline decoration-cyan-400/30 underline-offset-4 transition-colors hover:text-cyan-200"
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
