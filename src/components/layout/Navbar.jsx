import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import { navLinks } from "../../data/navigation"
import { primaryCta } from "../../data/sessions"
import Button from "../ui/Button"

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 pt-[max(env(safe-area-inset-top),0px)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        <a href="/" className="group flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-sm font-bold text-white shadow-[0_0_30px_-8px_rgba(99,102,241,0.8)]">
            BL
          </span>
          <span className="flex min-w-0 flex-col leading-none">
            <span className="truncate text-sm font-semibold text-white">Bryant Labs</span>
            <span className="hidden text-xs text-muted sm:block">Custom Software Studio</span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <motion.div className="hidden md:block" whileHover={{ y: -2 }}>
          <Button href="/#contact" variant="primary" className="px-4 py-2.5 text-xs sm:text-sm" analyticsCta={primaryCta}>
            {primaryCta}
          </Button>
        </motion.div>

        <button
          type="button"
          className="glass inline-flex h-11 w-11 items-center justify-center rounded-2xl text-white md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="glass-strong mx-4 mb-4 max-h-[calc(100dvh-5.5rem)] overflow-y-auto rounded-3xl border border-white/10 p-4 md:hidden"
          >
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-4 py-3 text-sm text-white/90 transition hover:bg-white/5 min-h-11 flex items-center"
                >
                  {link.label}
                </a>
              ))}
              <Button
                href="/#contact"
                variant="primary"
                className="mt-2 w-full"
                analyticsCta={primaryCta}
                onClick={() => setOpen(false)}
              >
                {primaryCta}
              </Button>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
