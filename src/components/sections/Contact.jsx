import { useCallback, useEffect, useRef, useState } from "react"
import { Check, Mail, Send } from "lucide-react"
import { introCallSchedulingCopy, introCallTitle } from "../../config/scheduling"
import {
  intakeContextOptions,
  intakeSubmitCta,
  sessionCreditCopy,
  sessionIntakeContextDescription,
  sessionIntakeContextTitle,
  sessionIntakeExpectationsCopy,
  sessionIntakeReciprocalCopy,
  sessionIntakeSectionDescription,
  sessionIntakeSectionEyebrow,
  sessionIntakeSectionTitle,
  sessionPathAfterBriefLines,
  sessionPostSuccessFooterHint,
  sessionPostSuccessIntro,
  sessionPostSuccessSteps,
  sessionPostSuccessTitle,
  sessionSendAnotherBriefHint,
  sessionSendAnotherBriefLabel,
  sessionSidebarFlowIntro,
  sessionSidebarNote,
  sessionSidebarWhatNextTitle,
  sessionSuccessMessage,
  sessionTurnstileHelperCopy,
  stageOneSessionPayload,
} from "../../data/sessions"
import { sectionSurface } from "../../lib/sectionSurfaces"
import {
  SessionIntakeError,
  submitSessionIntake,
} from "../../lib/submitSessionIntake"
import { trackIntakeStarted } from "../../lib/analytics"
import Button from "../ui/Button"
import TurnstileWidget from "../ui/TurnstileWidget"
import { isTurnstileConfigured } from "../../lib/turnstileConfig"
import { FormField, FormOptionGroup, FormSection, FormTextarea } from "../ui/FormField"
import GlassCard from "../ui/GlassCard"
import ScrollReveal from "../ui/ScrollReveal"
import SectionHeading from "../ui/SectionHeading"

const budgetOptions = [
  "$1k–$3k",
  "$3k–$7.5k",
  "$7.5k–$15k",
  "$15k+",
  "Not sure yet",
  "Prefer to align in email",
]

function validateStageOne({ budgetRange }) {
  const fieldErrors = {}

  if (!budgetRange) {
    fieldErrors.budget = "Pick a planning range to continue."
  }

  return fieldErrors
}

export default function Contact() {
  const [budgetRange, setBudgetRange] = useState("")
  const [intakeContext, setIntakeContext] = useState("")
  const [intakeSucceeded, setIntakeSucceeded] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState("")
  const [turnstileResetSignal, setTurnstileResetSignal] = useState(0)
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitError, setSubmitError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const hasTrackedIntakeStart = useRef(false)
  const successPanelRef = useRef(null)

  const resetIntakeSuccess = useCallback(() => {
    setIntakeSucceeded(false)
    setSuccessMessage("")
    setSubmitError("")
    setFieldErrors({})
    setBudgetRange("")
    setIntakeContext("")
    setTurnstileToken("")
    setTurnstileResetSignal((current) => current + 1)
    window.requestAnimationFrame(() => {
      document.getElementById("contact")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    })
  }, [])

  const handleIntakeInteraction = () => {
    if (hasTrackedIntakeStart.current) {
      return
    }

    hasTrackedIntakeStart.current = true
    void trackIntakeStarted()
  }

  const handleTurnstileTokenChange = useCallback((token) => {
    setTurnstileToken(token)
  }, [])

  useEffect(() => {
    if (!intakeSucceeded || !successPanelRef.current) {
      return
    }

    successPanelRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }, [intakeSucceeded])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitError("")
    setSuccessMessage("")
    setIntakeSucceeded(false)

    const form = event.currentTarget
    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }

    const nextFieldErrors = validateStageOne({
      budgetRange,
    })

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors)
      setSubmitError("One quick selection still needs your input.")
      return
    }

    if (isTurnstileConfigured() && !turnstileToken) {
      setSubmitError("Complete the quick verification check to continue.")
      return
    }

    const formData = new FormData(form)

    setFieldErrors({})
    setIsSubmitting(true)

    try {
      const { success, checkoutUrl } = await submitSessionIntake({
        session: stageOneSessionPayload,
        formData,
        turnstileToken,
      })

      console.log("Consultation lead saved:", success)

      setSuccessMessage(sessionSuccessMessage)

      if (checkoutUrl) {
        window.location.assign(checkoutUrl)
        return
      }

      setIntakeSucceeded(true)
    } catch (error) {
      if (error instanceof SessionIntakeError) {
        setSubmitError(error.message)

        if (error.code === "turnstile_failed") {
          setTurnstileToken("")
          setTurnstileResetSignal((current) => current + 1)
        }

        console.error("Consultation intake failed:", error.cause ?? error)
        return
      }

      setSubmitError(
        "Something went wrong while sending your brief. Please try again.",
      )
      console.error("Consultation intake failed:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      id="contact"
      className={`py-16 sm:py-20 lg:py-24 ${sectionSurface.settle}`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={sessionIntakeSectionEyebrow}
          title={sessionIntakeSectionTitle}
          description={sessionIntakeSectionDescription}
        />

        <ScrollReveal className="mt-5 sm:mt-6">
          <p className="max-w-3xl text-xs leading-relaxed text-white/50 sm:text-sm">
            {sessionIntakeExpectationsCopy}
          </p>
        </ScrollReveal>

        <div className="mt-8 grid gap-6 sm:mt-12 lg:grid-cols-[1.45fr_0.85fr]">
          <ScrollReveal className="order-2 lg:order-1">
            {intakeSucceeded ? (
              <GlassCard hover={false} className="p-5 sm:p-8">
                <div ref={successPanelRef}>
                  <div
                    role="status"
                    aria-live="polite"
                    className="rounded-2xl border border-emerald-400/25 bg-emerald-500/[0.08] px-4 py-3 text-sm leading-relaxed text-emerald-50"
                  >
                    {successMessage}
                  </div>
                  <h2 className="mt-6 text-lg font-semibold text-white sm:text-xl">
                    {sessionPostSuccessTitle}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted sm:text-[0.9375rem]">
                    {sessionPostSuccessIntro}
                  </p>
                  <ul className="mt-5 space-y-3">
                    {sessionPostSuccessSteps.map((step) => (
                      <li
                        key={step}
                        className="flex gap-3 text-sm leading-relaxed text-white/85 sm:text-[0.9375rem]"
                      >
                        <Check
                          className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400/80"
                          aria-hidden
                        />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 text-sm leading-relaxed text-white/70">
                    {sessionPostSuccessFooterHint}
                  </p>
                  <a
                    href="mailto:projects@bryantlabs.dev"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-cyan-200 underline-offset-4 transition hover:text-cyan-100 hover:underline"
                  >
                    <Mail className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                    projects@bryantlabs.dev
                  </a>

                  <div className="mt-8 border-t border-white/[0.08] pt-6">
                    <Button
                      type="button"
                      variant="secondary"
                      className="w-full sm:w-auto"
                      analyticsCta={sessionSendAnotherBriefLabel}
                      onClick={resetIntakeSuccess}
                    >
                      {sessionSendAnotherBriefLabel}
                    </Button>
                    <p className="mt-3 max-w-xl text-xs leading-relaxed text-white/45 sm:text-sm">
                      {sessionSendAnotherBriefHint}
                    </p>
                  </div>
                </div>
              </GlassCard>
            ) : (
              <GlassCard hover={false} className="p-5 sm:p-8">
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5 sm:px-5 sm:py-4">
                  <p className="text-sm leading-relaxed text-white/85 sm:text-[0.9375rem]">
                    {sessionIntakeReciprocalCopy}
                  </p>
                </div>

                <form
                  className="mt-6 space-y-6 sm:mt-8 sm:space-y-7"
                  onSubmit={handleSubmit}
                  onFocusCapture={handleIntakeInteraction}
                  noValidate
                  aria-busy={isSubmitting}
                >
                  <input type="hidden" name="intakeStage" value="quick" />
                  <input type="hidden" name="platform" value="Stage 1 — to be clarified if needed" />
                  <input type="hidden" name="audience" value="Stage 1 — to be clarified if needed" />
                  <input type="hidden" name="coreFeatures" value="Stage 1 — to be clarified if needed" />
                  <input type="hidden" name="phone" value="" />
                  <input type="hidden" name="company" value="" />

                  <FormSection title="Contact">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <FormField
                        label="Name"
                        name="fullName"
                        placeholder="Alex Morgan"
                        autoComplete="name"
                        required
                      />
                      <FormField
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="you@company.com"
                        autoComplete="email"
                        inputMode="email"
                        required
                      />
                    </div>
                  </FormSection>

                  <FormSection
                    title="What you’re solving"
                    description="A few sentences is enough—we’ll follow up with sharp questions if needed."
                  >
                    <FormTextarea
                      label="What are you building—or what problem should this solve?"
                      name="projectSummary"
                      rows={4}
                      placeholder="Product, workflow, internal system, or change you need. Links can go in references below."
                      required
                    />
                  </FormSection>

                  <FormSection title="Planning range" description="Rough is fine—helps us respond realistically.">
                    <input type="hidden" name="budget" value={budgetRange} />
                    <FormOptionGroup
                      label="Estimated budget band"
                      name="budgetChoice"
                      options={budgetOptions}
                      columns={2}
                      value={budgetRange}
                      onChange={(value) => {
                        setBudgetRange(value)
                        setFieldErrors((current) => ({ ...current, budget: "" }))
                      }}
                      required
                      error={fieldErrors.budget}
                    />
                  </FormSection>

                  <FormSection title="Timing">
                    <FormField
                      label="Target timing"
                      name="timeline"
                      placeholder="e.g. 4–6 weeks, Q3, or “flexible”"
                      required
                    />
                  </FormSection>

                  <FormSection
                    title={sessionIntakeContextTitle}
                    description={sessionIntakeContextDescription}
                  >
                    <FormOptionGroup
                      label="Pick the closest fit—skip if unsure"
                      name="intakeContext"
                      options={intakeContextOptions}
                      columns={1}
                      value={intakeContext}
                      onChange={setIntakeContext}
                      required={false}
                    />
                  </FormSection>

                  <FormSection title="Optional context">
                    <FormField
                      label="Reference link"
                      name="references"
                      placeholder="Figma, Loom, doc, or live product URL"
                      optional
                    />
                    <FormTextarea
                      label="Notes (optional)"
                      name="notes"
                      rows={2}
                      placeholder="Stack, constraints, or anything else worth a heads-up."
                      optional
                    />
                  </FormSection>

                  <div className="sr-only" aria-hidden="true">
                    <label htmlFor="website_url">Website</label>
                    <input
                      id="website_url"
                      name="website_url"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  <div>
                    <TurnstileWidget
                      onTokenChange={handleTurnstileTokenChange}
                      resetSignal={turnstileResetSignal}
                    />
                    <p className="mt-2 text-xs leading-relaxed text-white/45 sm:text-sm">
                      {sessionTurnstileHelperCopy}
                    </p>
                  </div>

                  {submitError ? (
                    <p
                      className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100"
                      role="alert"
                      aria-live="polite"
                    >
                      {submitError}
                    </p>
                  ) : null}

                  <p className="text-sm leading-relaxed text-muted">
                    By sending this brief, you agree to our{" "}
                    <a
                      href="/privacy"
                      className="text-white/80 underline underline-offset-4 transition hover:text-white"
                    >
                      Privacy Policy
                    </a>{" "}
                    and{" "}
                    <a
                      href="/terms"
                      className="text-white/80 underline underline-offset-4 transition hover:text-white"
                    >
                      Terms
                    </a>
                    .
                  </p>

                  <Button
                    type="submit"
                    className="w-full sm:w-auto"
                    disabled={
                      isSubmitting ||
                      (isTurnstileConfigured() && !turnstileToken)
                    }
                    analyticsCta={intakeSubmitCta}
                  >
                    {isSubmitting ? "Sending…" : intakeSubmitCta}
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </GlassCard>
            )}
          </ScrollReveal>

          <ScrollReveal delay={0.08} className="order-1 lg:order-2">
            <GlassCard className="h-full p-5 sm:p-8">
              <p className="text-sm font-medium text-white">{sessionSidebarWhatNextTitle}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {sessionSidebarFlowIntro}
              </p>

              <ul className="mt-4 space-y-2.5 text-xs leading-relaxed text-white/70 sm:text-sm">
                {sessionPathAfterBriefLines.map((line) => (
                  <li key={line} className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan-400/60" aria-hidden />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-5 text-xs leading-relaxed text-white/55 sm:text-sm">
                {sessionCreditCopy}
              </p>

              <div className="mt-8 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">
                <p className="text-sm font-medium text-white">{introCallTitle}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {introCallSchedulingCopy}
                </p>
              </div>

              <div className="mt-8 flex items-start gap-4">
                <div className="rounded-2xl bg-white/[0.05] p-3">
                  <Mail className="h-5 w-5 text-cyan-300" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/45">
                    Email
                  </p>
                  <a
                    href="mailto:projects@bryantlabs.dev"
                    className="mt-1 block text-base text-white transition hover:text-cyan-200"
                  >
                    projects@bryantlabs.dev
                  </a>
                </div>
              </div>

              <p className="mt-8 text-sm text-white/75">{sessionSidebarNote}</p>
            </GlassCard>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
