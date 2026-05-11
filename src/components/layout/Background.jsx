import { motion } from "framer-motion"

export default function Background() {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.16),transparent_42%),radial-gradient(circle_at_80%_20%,rgba(34,211,238,0.08),transparent_30%),linear-gradient(180deg,#050508_0%,#0a0a12_45%,#050508_100%)]" />
      <div className="absolute left-1/2 top-[-12rem] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
      <motion.div
        className="absolute bottom-[-10rem] right-[-6rem] h-[24rem] w-[24rem] rounded-full bg-cyan-400/10 blur-3xl"
        animate={{ opacity: [0.45, 0.75, 0.45], scale: [1, 1.05, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]" />
    </motion.div>
  )
}
