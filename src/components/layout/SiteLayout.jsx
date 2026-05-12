import { Outlet } from "react-router-dom"
import Background from "./Background"
import Footer from "./Footer"
import Navbar from "./Navbar"

export default function SiteLayout() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Background />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
