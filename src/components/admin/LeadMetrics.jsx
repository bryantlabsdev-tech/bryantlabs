import { motion } from "framer-motion"
import { buildLeadMetrics } from "../../config/admin"
import GlassCard from "../ui/GlassCard"

const metricCards = [
  { key: "total", label: "Total leads", accent: "from-white/10 to-white/[0.02]" },
  { key: "newCount", label: "New", accent: "from-cyan-500/15 to-cyan-500/5" },
  {
    key: "contactedCount",
    label: "Contacted",
    accent: "from-indigo-500/15 to-indigo-500/5",
  },
  {
    key: "closedWonCount",
    label: "Closed won",
    accent: "from-emerald-500/15 to-emerald-500/5",
  },
  {
    key: "conversionRate",
    label: "Conversion rate",
    accent: "from-amber-500/15 to-amber-500/5",
    format: (value) => `${value}%`,
  },
]

export default function LeadMetrics({ leads }) {
  const metrics = buildLeadMetrics(leads)

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {metricCards.map((card, index) => {
        const value = metrics[card.key]
        const displayValue = card.format ? card.format(value) : value

        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.35 }}
          >
            <GlassCard
              hover={false}
              className={`bg-gradient-to-br ${card.accent} p-5`}
            >
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
                {card.label}
              </p>
              <p className="mt-3 text-3xl font-semibold text-white">{displayValue}</p>
            </GlassCard>
          </motion.div>
        )
      })}
    </div>
  )
}
