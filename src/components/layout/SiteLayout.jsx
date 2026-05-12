import { Outlet, useLocation } from "react-router-dom"
import AnalyticsPageTracker from "../analytics/AnalyticsPageTracker"
import MarketingStructuredData from "../seo/MarketingStructuredData"
import { siteSeo } from "../../config/seo"
import { usePageMeta } from "../../hooks/usePageMeta"
import Background from "./Background"
import Footer from "./Footer"
import Navbar from "./Navbar"

export default function SiteLayout() {
  const { pathname } = useLocation()
  const isHomeRoute = pathname === "/"

  usePageMeta({
    title: siteSeo.title,
    description: siteSeo.description,
    path: pathname,
    enabled: isHomeRoute,
  })

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <MarketingStructuredData />
      <Background />
      <AnalyticsPageTracker />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
