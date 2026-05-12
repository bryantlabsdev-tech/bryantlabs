import { Outlet } from "react-router-dom"
import AnalyticsPageTracker from "../analytics/AnalyticsPageTracker"
import Background from "./Background"
import Footer from "./Footer"
import Navbar from "./Navbar"

export default function SiteLayout() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
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
