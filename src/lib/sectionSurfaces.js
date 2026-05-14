/**
 * Shared, minimal section backgrounds for scroll rhythm.
 * Keep subtle — page body is already `bg-ink`.
 */
export const sectionSurface = {
  /** Default canvas (no extra fill). */
  base: "",
  /** Soft lift after hero / dark bands. */
  lift: "border-t border-white/[0.06] bg-gradient-to-b from-white/[0.035] via-white/[0.012] to-transparent",
  /** Neutral band between heavier content. */
  band: "border-t border-white/[0.05] bg-gradient-to-b from-transparent via-white/[0.02] to-transparent",
  /** Cool undertone before pricing. */
  cool: "border-t border-white/[0.05] bg-gradient-to-b from-indigo-950/25 via-transparent to-transparent",
  /** Calm utility strip (e.g. support). */
  muted: "border-t border-white/[0.06] bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(255,255,255,0.04),transparent_55%)]",
  /** Gentle close into contact. */
  settle: "border-t border-white/[0.06] bg-gradient-to-b from-white/[0.02] via-transparent to-white/[0.02]",
}
