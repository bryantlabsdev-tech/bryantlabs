import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import { primaryCta, secondaryCta } from "../../data/sessions"
import Button from "../ui/Button"
import ScrollReveal from "../ui/ScrollReveal"

const stats = [
  { title: "Custom Software", subtitle: "Tailored product builds" },
  { title: "Digital Products", subtitle: "Mobile & web experiences" },
  { title: "SaaS Platforms", subtitle: "Launch-ready foundations" },
]

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-36 lg:pb-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <ScrollReveal>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/80">
                <Sparkles className="h-4 w-4 text-cyan-300" />
                Full-cycle builds, managed for you
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.05}>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl lg:leading-[1.02]">
                Modern Apps &amp; Systems{" "}
                <span className="text-gradient">Built Fast</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
                We build modern software products — from mobile apps and
                dashboards to SaaS platforms, automation workflows, and AI-powered
                tools.
              </p>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/70">
                We handle the entire process — from planning and design to
                development and launch — so you can stay focused on the vision,
                not the technical work.
              </p>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
                No technical background required. You bring the idea — we handle
                the execution.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.15} className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button href="#contact">{primaryCta}</Button>
              <Button href="#work" variant="secondary">
                {secondaryCta}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </ScrollReveal>

            <ScrollReveal delay={0.2} className="mt-12 grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.title}
                  className="glass rounded-2xl px-4 py-4 text-left"
                >
                  <p className="text-2xl font-semibold text-white">{stat.title}</p>
                  <p className="mt-1 text-sm text-muted">{stat.subtitle}</p>
                </div>
              ))}
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.12} className="relative">
            <div className="glow-ring relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.22),transparent_55%)]" />
              <div className="relative space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-white/45">
                      Studio snapshot
                    </p>
                    <p className="mt-1 text-xl font-semibold text-white">
                      Shipping lane
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-medium text-emerald-300">
                    Active builds
                  </span>
                </div>

                <div className="grid gap-3">
                  {[
                    "Custom product scoping",
                    "Mobile MVP sprint",
                    "Dashboard build-out",
                  ].map((item, index) => (
                    <motion.div
                      key={item}
                      className="flex items-center justify-between rounded-2xl border border-white/8 bg-black/25 px-4 py-3"
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 + index * 0.12 }}
                    >
                      <span className="text-sm text-white/85">{item}</span>
                      <span className="text-xs text-cyan-300">In progress</span>
                    </motion.div>
                  ))}
                </div>

                <div className="rounded-2xl border border-white/8 bg-gradient-to-br from-indigo-500/15 to-cyan-400/10 p-4">
                  <p className="text-sm text-white/75">
                    From concept to launch, planning, design, development, and
                    rollout are managed for you — with room to refine as the
                    product takes shape.
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
