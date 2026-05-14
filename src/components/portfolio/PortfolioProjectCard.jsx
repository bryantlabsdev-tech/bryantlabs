import { Check, ExternalLink } from "lucide-react"
import {
  isPortfolioProjectPrivateOnly,
  portfolioShowsTestFlightUi,
} from "../../lib/portfolioVisibility"
import ProjectMockup from "./ProjectMockup"
import Button from "../ui/Button"
import ScrollReveal from "../ui/ScrollReveal"

function projectStackKey(project) {
  return project.slug ?? project.name
}

const FEATURED_DESKTOP_STACK = 7
const FEATURED_MOBILE_STACK = 4
const SUPPORTING_DESKTOP_STACK = 4
const SUPPORTING_MOBILE_STACK = 2

export default function PortfolioProjectCard({
  project,
  variant,
  visualIndex,
  delay,
  stackExpanded,
  toggleStack,
}) {
  const isFeatured = variant === "featured"
  const stackKey = projectStackKey(project)
  const stack = project.stack ?? []
  const isStackExpanded = stackExpanded[stackKey]

  const mobileCap = isFeatured ? FEATURED_MOBILE_STACK : SUPPORTING_MOBILE_STACK
  const desktopCap = isFeatured ? FEATURED_DESKTOP_STACK : SUPPORTING_DESKTOP_STACK

  const mobileHidden = Math.max(0, stack.length - mobileCap)
  const desktopHidden = Math.max(0, stack.length - desktopCap)

  const mobileSlice = isStackExpanded ? stack : stack.slice(0, mobileCap)
  const desktopSlice = isStackExpanded ? stack : stack.slice(0, desktopCap)

  const showMobileToggle = mobileHidden > 0
  const showDesktopToggle = desktopHidden > 0

  const mockupOrder =
    !isFeatured && visualIndex % 2 === 1 ? "lg:order-2" : ""
  const copyOrder =
    !isFeatured && visualIndex % 2 === 1 ? "lg:order-1" : ""

  const articleFeatured =
    "relative overflow-hidden rounded-[2rem] border border-white/[0.11] bg-gradient-to-br from-white/[0.055] via-white/[0.028] to-white/[0.018] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:p-8 lg:p-10"
  const articleSupporting =
    "rounded-2xl border border-white/[0.07] bg-white/[0.02] p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:p-3.5 lg:p-4"

  const gridFeatured =
    "grid items-start gap-5 sm:gap-8 lg:grid-cols-12 lg:gap-10 lg:items-center"
  const gridSupporting =
    "grid items-center gap-3 sm:gap-4 lg:grid-cols-2 lg:gap-5"

  return (
    <ScrollReveal delay={delay}>
      <article
        className={`${isFeatured ? articleFeatured : articleSupporting} ${
          isFeatured ? gridFeatured : gridSupporting
        }`}
      >
        {isFeatured ? (
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/25 to-transparent"
            aria-hidden
          />
        ) : null}

        <div className={isFeatured ? "lg:col-span-5" : `${mockupOrder} min-w-0`}>
          <ProjectMockup project={project} compact={!isFeatured} />
        </div>

        <div
          className={`min-w-0 ${isFeatured ? "lg:col-span-7" : copyOrder}`}
        >
          <div className="flex flex-wrap items-center gap-2">
            {isFeatured ? (
              <span className="rounded-full border border-indigo-300/25 bg-indigo-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-indigo-200/90">
                Flagship build
              </span>
            ) : null}
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-300/80">
              {project.category}
            </p>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-white/70">
              {project.badge}
            </span>
          </div>

          <h3
            className={
              isFeatured
                ? "mt-3 text-2xl font-semibold leading-[1.15] tracking-tight text-white sm:mt-4 sm:text-4xl lg:text-[2.35rem]"
                : "mt-2 text-lg font-semibold leading-tight text-white sm:mt-2.5 sm:text-xl lg:text-2xl"
            }
          >
            {project.name}
          </h3>

          <p
            className={
              isFeatured
                ? "mt-2 text-base leading-snug text-white/85 sm:mt-3 sm:text-lg lg:text-xl"
                : "mt-1.5 text-sm leading-snug text-white/80 max-sm:line-clamp-2 sm:text-base"
            }
          >
            {project.tagline}
          </p>

          <p
            title={!isFeatured ? project.description : undefined}
            className={
              isFeatured
                ? "mt-3 text-sm leading-relaxed text-muted max-sm:line-clamp-5 sm:mt-4 sm:text-base lg:max-w-none lg:leading-relaxed"
                : "mt-2.5 text-sm leading-relaxed text-muted line-clamp-3 sm:mt-3"
            }
          >
            {project.description}
          </p>

          {project.highlights?.length ? (
            <ul
              className={
                isFeatured
                  ? "mt-5 space-y-2.5 border-t border-white/[0.08] pt-5 sm:mt-6 sm:space-y-3 sm:pt-6"
                  : "mt-3.5 space-y-1.5 border-t border-white/[0.06] pt-3.5 sm:mt-4 sm:space-y-2 sm:pt-4"
              }
            >
              {project.highlights.map((item) => (
                <li
                  key={item}
                  className={`flex items-start gap-2.5 leading-snug text-white/85 ${
                    isFeatured ? "text-sm sm:text-[0.9375rem]" : "text-[13px] sm:text-sm"
                  }`}
                >
                  <Check
                    className={`mt-0.5 shrink-0 text-cyan-400/75 ${
                      isFeatured ? "h-4 w-4" : "h-3.5 w-3.5 sm:h-4 sm:w-4"
                    }`}
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : null}

          {stack.length > 0 ? (
            <div
              className={
                isFeatured
                  ? "mt-6 border-t border-white/[0.08] pt-6 sm:mt-7 sm:pt-7"
                  : "mt-4 border-t border-white/[0.06] pt-4 sm:mt-4 sm:pt-4"
              }
            >
              <p
                className={`mb-2 font-semibold uppercase tracking-[0.2em] text-white/38 ${
                  isFeatured ? "text-[10px] sm:mb-2.5" : "text-[9px] sm:text-[10px]"
                }`}
              >
                {project.stackLabel ?? (isFeatured ? "Architecture & workflows" : "Systems & tooling")}
              </p>

              <div className="hidden sm:block">
                <div className="flex flex-wrap gap-1.5">
                  {desktopSlice.map((item) => (
                    <span
                      key={item}
                      className={`rounded-full border border-white/[0.07] bg-white/[0.025] font-medium leading-snug text-white/60 ${
                        isFeatured
                          ? "px-3 py-1 text-xs"
                          : "px-2.5 py-0.5 text-[11px] sm:px-2.5 sm:py-1 sm:text-xs"
                      }`}
                    >
                      {item}
                    </span>
                  ))}
                </div>
                {showDesktopToggle ? (
                  <button
                    type="button"
                    onClick={() => toggleStack(stackKey)}
                    className="mt-2 min-h-9 text-left text-xs font-medium text-cyan-300/90 underline decoration-cyan-400/30 underline-offset-4 transition-colors hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                  >
                    {isStackExpanded
                      ? "Show fewer tags"
                      : `+${desktopHidden} more`}
                  </button>
                ) : null}
              </div>

              <div className="sm:hidden">
                <div className="flex flex-wrap gap-1.5">
                  {mobileSlice.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/[0.07] bg-white/[0.025] px-2.5 py-1 text-[11px] font-medium leading-snug text-white/60"
                    >
                      {item}
                    </span>
                  ))}
                </div>
                {showMobileToggle ? (
                  <button
                    type="button"
                    onClick={() => toggleStack(stackKey)}
                    className="mt-2 min-h-10 rounded-lg px-1 text-left text-xs font-medium text-cyan-300/90 underline decoration-cyan-400/30 underline-offset-4 transition-colors hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                  >
                    {isStackExpanded
                      ? "Show fewer tags"
                      : `+${mobileHidden} more`}
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}

          {portfolioShowsTestFlightUi(project) ? (
            <p
              className={`text-xs font-medium uppercase tracking-[0.16em] text-cyan-300/80 ${
                isFeatured ? "mt-4 sm:mt-5" : "mt-2.5 sm:mt-3"
              }`}
            >
              Available on iOS TestFlight
            </p>
          ) : null}

          {isPortfolioProjectPrivateOnly(project) ? (
            <p
              className={`rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm leading-relaxed text-muted ${
                isFeatured
                  ? "mt-4 px-4 py-3 sm:mt-5 sm:px-5 sm:py-3.5"
                  : "mt-2.5 px-3 py-2.5 sm:mt-3 sm:px-3.5 sm:py-2.5"
              }`}
            >
              {project.privateCaseStudyFootnote ?? "Private internal case study"}
            </p>
          ) : (
            <div
              className={
                isFeatured
                  ? "mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:flex-wrap sm:gap-3"
                  : "mt-2.5 flex flex-col gap-2 sm:mt-3 sm:flex-row sm:flex-wrap sm:gap-2.5"
              }
            >
              {project.links?.length > 0 ? (
                project.links.map((link) => (
                  <Button
                    key={`${project.name}-${link.label}`}
                    href={link.href}
                    variant="secondary"
                    className={`w-full sm:w-auto ${isFeatured ? "" : "min-h-10 text-sm"}`}
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
  )
}
