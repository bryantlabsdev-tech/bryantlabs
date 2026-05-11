import { projects } from "../../data/projects"
import ProjectMockup from "../portfolio/ProjectMockup"
import ScrollReveal from "../ui/ScrollReveal"
import SectionHeading from "../ui/SectionHeading"

export default function Portfolio() {
  return (
    <section id="work" className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Selected work"
          title="Recent products with real operational impact"
          description="A sample of mobile apps, business systems, and modern digital products built for speed, polish, and long-term maintainability."
        />

        <div className="mt-14 space-y-10">
          {projects.map((project, index) => (
            <ScrollReveal key={project.name} delay={index * 0.06}>
              <article className="grid items-center gap-8 rounded-[2rem] border border-white/8 bg-white/[0.02] p-6 lg:grid-cols-2 lg:p-8">
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <ProjectMockup project={project} />
                </div>
                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-300/80">
                    {project.category}
                  </p>
                  <h3 className="mt-3 text-3xl font-semibold text-white">
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
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
