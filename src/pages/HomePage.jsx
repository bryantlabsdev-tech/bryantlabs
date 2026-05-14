import Contact from "../components/sections/Contact"
import Hero from "../components/sections/Hero"
import ProofStrip from "../components/sections/ProofStrip"
import Portfolio from "../components/sections/Portfolio"
import Pricing from "../components/sections/Pricing"
import Process from "../components/sections/Process"
import Support from "../components/sections/Support"
import Services from "../components/sections/Services"
import ErrorBoundary from "../components/ui/ErrorBoundary"

export default function HomePage() {
  return (
    <>
      <ErrorBoundary sectionName="Hero">
        <Hero />
      </ErrorBoundary>
      <ErrorBoundary sectionName="ProofStrip">
        <ProofStrip />
      </ErrorBoundary>
      <ErrorBoundary sectionName="Services">
        <Services />
      </ErrorBoundary>
      <ErrorBoundary sectionName="Portfolio">
        <Portfolio />
      </ErrorBoundary>
      <ErrorBoundary sectionName="Process">
        <Process />
      </ErrorBoundary>
      <ErrorBoundary sectionName="Pricing">
        <Pricing />
      </ErrorBoundary>
      <ErrorBoundary sectionName="Support">
        <Support />
      </ErrorBoundary>
      <ErrorBoundary sectionName="Contact">
        <Contact />
      </ErrorBoundary>
    </>
  )
}
