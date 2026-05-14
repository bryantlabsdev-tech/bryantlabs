import { motion } from "framer-motion"
import { trackCtaClick } from "../../lib/analytics"

const variants = {
  primary:
    "bg-white text-ink hover:bg-white/90 shadow-[0_0_40px_-12px_rgba(255,255,255,0.55)]",
  secondary:
    "glass text-white hover:border-white/20 hover:bg-white/[0.06]",
  ghost: "text-muted hover:text-white hover:bg-white/5",
}

export default function Button({
  children,
  variant = "primary",
  href,
  className = "",
  analyticsCta,
  onClick,
  ...props
}) {
  const classes = `inline-flex min-h-11 touch-manipulation items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45 focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`
  const isExternal = typeof href === "string" && /^https?:\/\//.test(href)
  const externalLinkProps = isExternal
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {}

  const handleClick = (event) => {
    if (analyticsCta) {
      void trackCtaClick(analyticsCta, { href })
    }

    onClick?.(event)
  }

  if (href) {
    return (
      <motion.a
        href={href}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        className={classes}
        onClick={handleClick}
        {...externalLinkProps}
        {...props}
      >
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button
      type="button"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={classes}
      onClick={handleClick}
      {...props}
    >
      {children}
    </motion.button>
  )
}
