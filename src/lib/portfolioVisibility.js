/**
 * Portfolio projects that must never show TestFlight, download, or external CTAs.
 * TrackoraHQ is a private internal case study only (belt-and-suspenders vs. data alone).
 */
export function isPortfolioProjectPrivateOnly(project) {
  if (!project) return false
  if (project.privateCaseStudy === true) return true
  if (project.publicLinksAllowed === false) return true
  if (project.slug === "trackora-hq") return true
  return false
}

/** True only when the UI may show TestFlight promo lines or TestFlight link buttons. */
export function portfolioShowsTestFlightUi(project) {
  if (isPortfolioProjectPrivateOnly(project)) return false
  return project.links?.some((link) => link.href?.includes("testflight.apple.com")) ?? false
}

