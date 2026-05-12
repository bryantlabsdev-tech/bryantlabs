import { legalLinks, navLinks } from "../../data/navigation"
import { useDeveloperAnalyticsOptOutGesture } from "../../hooks/useDeveloperAnalyticsOptOutGesture"

export default function Footer() {
  const handleDeveloperGesture = useDeveloperAnalyticsOptOutGesture()

  return (
    <footer className="border-t border-white/8 bg-black/20">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 sm:py-10 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white">Bryant Labs</p>
            <p className="mt-2 max-w-sm text-sm text-muted">
              Custom software for mobile, web, and business systems—built with
              premium craft and supported long after launch.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:gap-5">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="min-h-11 text-sm text-muted transition hover:text-white sm:min-h-0 sm:inline-flex sm:items-center"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 border-t border-white/8 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:gap-5">
            {legalLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="min-h-11 text-sm text-muted transition hover:text-white sm:min-h-0 sm:inline-flex sm:items-center"
              >
                {link.label}
              </a>
            ))}
          </div>
          <p
            className="text-sm text-muted"
            onClick={handleDeveloperGesture}
            title="Bryant Labs"
          >
            © {new Date().getFullYear()} Bryant Labs. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
