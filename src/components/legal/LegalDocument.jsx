import { useLocation } from "react-router-dom"
import { usePageMeta } from "../../hooks/usePageMeta"
import GlassCard from "../ui/GlassCard"

export default function LegalDocument({
  title,
  metaTitle,
  metaDescription,
  updatedAt,
  sections,
}) {
  const { pathname } = useLocation()

  usePageMeta({
    title: metaTitle,
    description: metaDescription,
    path: pathname,
  })

  return (
    <section className="py-28 sm:py-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <GlassCard hover={false} className="p-6 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-300/80">
            Bryant Labs
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted">
            {metaDescription}
          </p>
          <p className="mt-3 text-sm text-white/50">Last updated: {updatedAt}</p>

          <div className="mt-10 space-y-10">
            {sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-xl font-semibold text-white">{section.heading}</h2>
                <div className="mt-4 space-y-4 text-sm leading-relaxed text-white/75 sm:text-base">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </GlassCard>
      </div>
    </section>
  )
}
