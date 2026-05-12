import { ExternalLink } from "lucide-react"
import { projects } from "../../data/projects"
import ProjectMockup from "../portfolio/ProjectMockup"
import Button from "../ui/Button"
import ScrollReveal from "../ui/ScrollReveal"
import SectionHeading from "../ui/SectionHeading"

function hasTestFlightLink(project) {
  return project.links.some((link) => link.href.includes("testflight.apple.com"))
}

export default function Portfolio() {
  return (
    <section id="work" className="py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Most Recent Builds"
          description="Explore live Bryant Labs products across web, mobile, and iOS TestFlight — alongside active internal studio builds."
        />

        <div className="mt-10 space-y-6 sm:mt-14 sm:space-y-10">
          {projects.map((project, index) => (
            <ScrollReveal key={project.name} delay={index * 0.06}>
              <article className="grid items-center gap-6 rounded-[1.5rem] border border-white/8 bg-white/[0.02] p-4 sm:gap-8 sm:rounded-[2rem] sm:p-6 lg:grid-cols-2 lg:p-8">
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
                  <div className="mt-6 flex flex-wrap gap-2">
                    {project.stack.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/70"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                  {hasTestFlightLink(project) ? (
                    <p className="mt-4 text-xs font-medium uppercase tracking-[0.16em] text-cyan-300/80">
                      Available on iOS TestFlight
                    </p>
                  ) : null}
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    {project.links.length > 0 ? (
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
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
