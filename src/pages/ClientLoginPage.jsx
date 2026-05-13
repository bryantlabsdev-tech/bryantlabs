import { useLocation } from "react-router-dom"
import { Check } from "lucide-react"
import ClientPortalPlaceholderPreview from "../components/client-portal/ClientPortalPlaceholderPreview"
import Button from "../components/ui/Button"
import GlassCard from "../components/ui/GlassCard"
import { usePageMeta } from "../hooks/usePageMeta"

const PAGE_TITLE = "Client Portal | Bryant Labs"
const PAGE_DESCRIPTION =
  "Preview of the upcoming Bryant Labs client workspace. Sign-in and project tools are not available yet on the public site."

const COMING_FEATURES = [
  "Project milestones",
  "Deliverables",
  "Build updates",
  "Shared assets",
  "Support requests",
  "Launch tracking",
]

export default function ClientLoginPage() {
  const { pathname } = useLocation()

  usePageMeta({
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    path: pathname,
    robots: "noindex, nofollow",
  })

  return (
    <section className="relative py-24 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan/80">
            Bryant Labs
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-[2.5rem]">
            Client Portal Coming Soon
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
            Bryant Labs is building a streamlined client workspace for project visibility,
            milestone tracking, communication, and delivery management.
          </p>
        </div>

        <GlassCard
          hover={false}
          className="mx-auto mt-10 max-w-3xl border border-amber-400/15 bg-amber-500/[0.06] px-5 py-4 sm:px-6 sm:py-5"
        >
          <p className="text-sm leading-relaxed text-white/80">
            <span className="font-medium text-amber-100/95">Heads up:</span> this page is a
            preview only. The client portal is not open for self-serve sign-in yet. It will be
            offered to{" "}
            <span className="text-white/95">
              active Bryant Labs clients during onboarding and rollout
            </span>
            , when your project is set up for it.
          </p>
        </GlassCard>

        <div className="mx-auto mt-14 max-w-5xl">
          <ClientPortalPlaceholderPreview />
        </div>

        <div className="mx-auto mt-14 grid gap-6 lg:grid-cols-2 lg:gap-8">
          <GlassCard hover={false} className="p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-white">Planned workspace areas</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Nothing below is live yet; this is the shape of what we are working toward for
              engaged projects.
            </p>
            <ul className="mt-6 space-y-3">
              {COMING_FEATURES.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm text-white/80"
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.04]">
                    <Check className="h-3.5 w-3.5 text-cyan-300/90" aria-hidden />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </GlassCard>

          <GlassCard hover={false} className="flex flex-col justify-between p-6 sm:p-8">
            <div>
              <h2 className="text-lg font-semibold text-white">New to Bryant Labs?</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                If you are exploring a build, start with the project intake. We will follow up
                by email and, when it makes sense, talk through how a future portal could fit
                your engagement.
              </p>
            </div>
            <div className="mt-8">
              <Button
                href="/#contact"
                variant="primary"
                className="w-full sm:w-auto"
                analyticsCta="Start a Project"
              >
                Start a Project
              </Button>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  )
}
