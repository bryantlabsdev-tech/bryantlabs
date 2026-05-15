export const primaryCta = "Open quick brief"
export const discoveryRequestCta = "Open quick brief"
export const intakeSubmitCta = "Send brief for review"
export const secondaryCta = "View Projects"

/** Post–intake-review planning options (reference / CRM). */
export const strategySessions = [
  {
    id: "discovery-30",
    name: "Paid Discovery Session",
    label: "Paid Discovery Session — $50",
    priceLabel: "$50",
    priceCents: 5000,
    duration: "30 minutes",
    stripePriceId: null,
    description:
      "Focused planning for workflows, requirements, and recommendations.",
  },
  {
    id: "strategy-60",
    name: "Product Strategy Session",
    label: "Product Strategy Session — $100",
    priceLabel: "$100",
    priceCents: 10000,
    duration: "60 minutes",
    stripePriceId: null,
    description:
      "Architecture, roadmap prioritization, scaling, and implementation strategy.",
  },
]

export const sessionIntakeSectionEyebrow = "Stage 1 · Quick brief"

export const sessionIntakeSectionTitle = "Start with a short brief"

export const sessionIntakeSectionDescription =
  "Rough notes are fine. This first step is only for context and fit—nothing here commits you to paid work."

/** Reciprocal next-step promise (near form). */
export const sessionIntakeReciprocalCopy =
  "Submit a short brief first. We’ll review it and reply with the best next step—targeted clarification questions, a quick intro call when helpful, or a scoped discovery path only if the work needs deeper planning before an estimate."

/** @deprecated Prefer sessionIntakeSectionDescription. */
export const sessionIntakeHeadingDescription = sessionIntakeSectionDescription

/** @deprecated Alias. */
export const sessionValueCopy = sessionIntakeSectionDescription

/** Single line; detail lives in reciprocal + sidebar. */
export const sessionIntakeExpectationsCopy =
  "Paid discovery or strategy is introduced only after this review—never as a surprise step."

/** Optional routing signal for ops—empty value allowed. */
export const sessionIntakeContextTitle = "Engagement shape (optional)"

export const sessionIntakeContextDescription =
  "Rough label is enough—helps us route internally before we reply."

export const intakeContextOptions = [
  { value: "", label: "Prefer not to say yet" },
  { value: "New product or MVP", label: "New product or MVP" },
  { value: "Internal ops / systems", label: "Internal ops or systems" },
  { value: "Improve existing product", label: "Improve existing product" },
  { value: "Ongoing / retainer", label: "Ongoing or retainer" },
]

/** Sidebar path — compact, low visual noise. */
export const sessionSidebarFlowIntro = "After your brief:"

export const sessionSidebarWhatNextTitle = "What happens next"

export const sessionPathAfterBriefLines = [
  "We read what you sent and reply by email (typically 1–2 business days).",
  "We may ask a few sharp questions—or suggest a short intro call—before any paid planning.",
  "Estimates follow milestone alignment; deeper scoping is stage 2, not a wall of fields up front.",
]

export const sessionPostSubmitBullets = sessionPathAfterBriefLines

export const sessionCreditCopy =
  "Paid discovery or strategy credits toward kickoff if you proceed with a build."

export const sessionSuccessMessage = "Received—we’ll reply by email with clear next steps."

/** Rich post-submit panel (replaces form after success). */
export const sessionPostSuccessTitle = "Brief received"

export const sessionPostSuccessIntro =
  "You’re in the queue. Here’s how Bryant Labs typically follows up—no template wall, no surprise paid steps."

export const sessionPostSuccessSteps = [
  "A human reads what you sent (not an auto-responder closing the loop).",
  "You get a direct email reply, usually within one to two business days, with specific next actions.",
  "That reply is usually a fit read plus a few clarifying questions—or a short intro invite when it genuinely helps.",
  "Stage 2 is deeper scoping only if estimates need it: async follow-ups first; paid discovery only if we both agree before a quote.",
]

export const sessionPostSuccessFooterHint =
  "Need to add detail? Reply on the same email thread—you don’t need another form submission."

/** Secondary action after success (resets the Stage 1 form). */
export const sessionSendAnotherBriefLabel = "Send another brief"

export const sessionSendAnotherBriefHint =
  "Use this only if you’re starting a separate thread—a reply on the original email is usually faster."

export const sessionTurnstileHelperCopy =
  "One quick check—keeps the inbox human-scale so first replies stay thoughtful."

export const sessionSidebarNote =
  "For teams who want product-grade software without running an in-house engineering org."

/** Stage 1 defaults to fit review first in CRM. */
export const intakePreferredNextSteps = [
  {
    id: "review-first",
    label: "Review my brief first, then advise",
  },
  {
    id: "paid-discovery-if-needed",
    label: "Open to paid discovery if you recommend it",
  },
  {
    id: "not-sure",
    label: "Not sure—guide me",
  },
]

export function getIntakeSessionPayloadFromPreferredStep(stepId) {
  const step =
    intakePreferredNextSteps.find((s) => s.id === stepId) ??
    intakePreferredNextSteps[0]

  return {
    id: step.id,
    name: step.label,
    priceCents: 0,
    priceLabel: "—",
  }
}

/** Stage 1 submissions always use default fit-review signal. */
export const stageOneSessionPayload = getIntakeSessionPayloadFromPreferredStep(
  intakePreferredNextSteps[0].id,
)
