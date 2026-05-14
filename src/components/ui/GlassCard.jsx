import { motion } from "framer-motion"

export default function GlassCard({
  children,
  className = "",
  hover = true,
  ...props
}) {
  const Component = hover ? motion.div : "div"
  const motionProps = hover
    ? {
        whileHover: { y: -6, scale: 1.01 },
        transition: { type: "spring", stiffness: 320, damping: 24 },
      }
    : {}

  return (
    <Component
      className={`glass rounded-3xl transition-[border-color,box-shadow] duration-300 hover:border-white/15 ${className}`}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  )
}
