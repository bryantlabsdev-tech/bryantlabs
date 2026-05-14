import ScrollReveal from "./ScrollReveal"

/**
 * One-line narrative handoff between major sections. Keep copy short.
 */
export default function SectionBridge({ children, className = "" }) {
  return (
    <ScrollReveal className={className}>
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3.5 sm:px-5 sm:py-4">
        {children}
      </div>
    </ScrollReveal>
  )
}
