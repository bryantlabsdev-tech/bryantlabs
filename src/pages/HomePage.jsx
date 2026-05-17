import { Suspense, lazy } from "react"
import Contact from "../components/sections/Contact"
import Hero from "../components/sections/Hero"
import ProofStrip from "../components/sections/ProofStrip"
import StudioInspectionStrip from "../components/sections/StudioInspectionStrip"
import Services from "../components/sections/Services"
import ErrorBoundary from "../components/ui/ErrorBoundary"

const Portfolio = lazy(() => import("../components/sections/Portfolio"))
const Process = lazy(() => import("../components/sections/Process"))
const Pricing = lazy(() => import("../components/sections/Pricing"))
const Support = lazy(() => import("../components/sections/Support"))

function SectionLoadingFallback() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="h-20 rounded-2xl border border-white/10 bg-white/[0.03]" />
    </div>
  )
}

export default function HomePage() {
  return (
    <>
      <ErrorBoundary sectionName="Hero">
        <Hero />
      </ErrorBoundary>
      <ErrorBoundary sectionName="ProofStrip">
        <ProofStrip />
      </ErrorBoundary>
      <ErrorBoundary sectionName="StudioInspectionStrip">
        <StudioInspectionStrip />
      </ErrorBoundary>
      <ErrorBoundary sectionName="Services">
        <Services />
      </ErrorBoundary>
      <ErrorBoundary sectionName="Portfolio">
        <Suspense fallback={<SectionLoadingFallback />}>
          <Portfolio />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary sectionName="Process">
        <Suspense fallback={<SectionLoadingFallback />}>
          <Process />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary sectionName="Pricing">
        <Suspense fallback={<SectionLoadingFallback />}>
          <Pricing />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary sectionName="Support">
        <Suspense fallback={<SectionLoadingFallback />}>
          <Support />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary sectionName="Contact">
        <Contact />
      </ErrorBoundary>
    </>
  )
}
