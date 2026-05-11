import Background from "./components/layout/Background"
import Footer from "./components/layout/Footer"
import Navbar from "./components/layout/Navbar"
import Contact from "./components/sections/Contact"
import Hero from "./components/sections/Hero"
import Portfolio from "./components/sections/Portfolio"
import Pricing from "./components/sections/Pricing"
import Process from "./components/sections/Process"
import Support from "./components/sections/Support"
import Services from "./components/sections/Services"
import Testimonials from "./components/sections/Testimonials"

export default function App() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Background />
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Portfolio />
        <Process />
        <Pricing />
        <Support />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
