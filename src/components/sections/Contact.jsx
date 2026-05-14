import { useCallback, useMemo, useRef, useState } from "react"
import { Mail, Send } from "lucide-react"
import { introCallSchedulingCopy, introCallTitle } from "../../config/scheduling"
import { consultationEngagements } from "../../data/consultation"
import {
  intakeSubmitCta,
  sessionAfterSubmitCopy,
  sessionIntakeCopy,
  sessionIntakeExpectationsCopy,
  sessionSidebarNote,
  sessionSuccessMessage,
  sessionValueCopy,
  strategySessions,
} from "../../data/sessions"
import { sectionSurface } from "../../lib/sectionSurfaces"
import {
  SessionIntakeError,
  submitSessionIntake,
} from "../../lib/submitSessionIntake"
import { parseOptionalUsPhone } from "../../lib/optionalPhone"
import { trackIntakeStarted } from "../../lib/analytics"
import Button from "../ui/Button"
import TurnstileWidget from "../ui/TurnstileWidget"
import { isTurnstileConfigured } from "../../lib/turnstileConfig"
import {
  FormField,
  FormOptionGroup,
  FormSection,
  FormTextarea,
} from "../ui/FormField"
import GlassCard from "../ui/GlassCard"
import ScrollReveal from "../ui/ScrollReveal"
import SectionHeading from "../ui/SectionHeading"

const platformOptions = ["Mobile App", "Web App", "Both", "Not sure yet"]

const budgetOptions = ["Under $1k", "$1k–$3k", "$3k–$10k", "$10k+"]

const sessionOptions = strategySessions.map((session) => ({
  value: session.id,
  label: session.label,
}))

function validateIntakeSelections({ selectedSessionId, platform, budgetRange }) {
  const fieldErrors = {}

  if (!strategySessions.some((session) => session.id === selectedSessionId)) {
    fieldErrors.session = "Select a session to continue."
  }

  if (!platform) {
    fieldErrors.platform = "Select a platform to continue."
  }

  if (!budgetRange) {
    fieldErrors.budget = "Select a budget range to continue."
  }

  return fieldErrors
}

export default function Contact() {
  const [selectedSessionId, setSelectedSessionId] = useState(
    strategySessions[0].id,
  )
  const [platform, setPlatform] = useState("")
  const [budgetRange, setBudgetRange] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState("")
  const [turnstileResetSignal, setTurnstileResetSignal] = useState(0)
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitError, setSubmitError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const hasTrackedIntakeStart = useRef(false)

  const selectedSession = useMemo(
    () =>
      strategySessions.find((session) => session.id === selectedSessionId) ??
      strategySessions[0],
    [selectedSessionId],
  )

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

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitError("")
    setSuccessMessage("")

    const form = event.currentTarget
    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }

    const nextFieldErrors = validateIntakeSelections({
      selectedSessionId,
      platform,
      budgetRange,
    })

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors)
      setSubmitError("Complete the required selections before submitting.")
      return
    }

    if (isTurnstileConfigured() && !turnstileToken) {
      setSubmitError("Complete the verification check before submitting.")
      return
    }

    const formData = new FormData(form)
    const phoneRaw = String(formData.get("phone") ?? "").trim()
    const phoneCheck = parseOptionalUsPhone(phoneRaw)

    if (!phoneCheck.ok) {
      setSubmitError(
        "Phone number doesn’t look valid. Leave it blank or enter a 10-digit US number.",
      )
      return
    }

    setFieldErrors({})
    setIsSubmitting(true)

    try {
      const { success, checkoutUrl } = await submitSessionIntake({
        session: selectedSession,
        formData,
        turnstileToken,
      })

      console.log("Consultation lead saved:", success)

      setSuccessMessage(sessionSuccessMessage)

      // TODO: After intake review, email the intro-call Calendly link from scheduling
      // config. Later add paid Calendly or Stripe sessions for Discovery and Strategy.
      if (checkoutUrl) {
        window.location.assign(checkoutUrl)
      }
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
        "Something went wrong while submitting your project intake. Please try again.",
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
          eyebrow="Project intake"
          title="Tell us what you want to build."
          description={sessionValueCopy}
        />

        <ScrollReveal className="mt-6 sm:mt-7">
          <p className="max-w-3xl text-sm leading-relaxed text-muted sm:text-[0.9375rem]">
            {sessionIntakeExpectationsCopy}
          </p>
        </ScrollReveal>

        <div className="mt-8 grid gap-6 sm:mt-12 lg:grid-cols-[1.45fr_0.85fr]">
          <ScrollReveal>
            <GlassCard hover={false} className="p-5 sm:p-8">
              <p className="text-sm leading-relaxed text-muted">
                {sessionIntakeCopy} {sessionAfterSubmitCopy}
              </p>

              <form
                className="mt-8 space-y-6 sm:space-y-8"
                onSubmit={handleSubmit}
                onFocusCapture={handleIntakeInteraction}
                noValidate
              >
                <FormSection
                  title="Planning session preference"
                  description="If we proceed beyond the intro call, indicate which paid planning session you would prefer."
                >
                  <FormOptionGroup
                    label="Preferred planning session"
                    name="session"
                    options={sessionOptions}
                    columns={2}
                    value={selectedSessionId}
                    onChange={(value) => {
                      setSelectedSessionId(value)
                      setFieldErrors((current) => ({ ...current, session: "" }))
                    }}
                    required
                    error={fieldErrors.session}
                  />
                  <p className="text-sm text-white/70">
                    Selected: {selectedSession.name} — {selectedSession.priceLabel}
                  </p>
                </FormSection>

                <FormSection title="About you">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField
                      label="Full Name"
                      name="fullName"
                      placeholder="Alex Morgan"
                      required
                    />
                    <FormField
                      label="Email"
                      name="email"
                      type="email"
                      placeholder="you@email.com"
                      required
                    />
                  </div>
                  <div>
                    <FormField
                      label="Phone Number (Optional)"
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="(555) 555-5555"
                      optional
                    />
                    <p className="mt-1.5 text-xs leading-relaxed text-white/45">
                      For faster follow-up or intro call scheduling.
                    </p>
                  </div>
                  <FormField
                    label="Company or Brand"
                    name="company"
                    placeholder="Startup, studio, or personal brand"
                    optional
                  />
                </FormSection>

                <FormSection
                  title="Project overview"
                  description="A concise picture of what you want built and who it serves."
                >
                  <FormTextarea
                    label="What are you trying to build?"
                    name="projectSummary"
                    rows={3}
                    placeholder="Describe the product, workflow, or problem you want solved."
                    required
                  />
                  <FormTextarea
                    label="Who is this for?"
                    name="audience"
                    rows={2}
                    placeholder="Customers, members, internal team, or a specific audience."
                    required
                  />
                  <FormTextarea
                    label="Core features needed"
                    name="coreFeatures"
                    rows={3}
                    placeholder="Must-have flows, integrations, or capabilities for the first release."
                    required
                  />
                </FormSection>

                <FormSection title="Delivery details">
                  <input type="hidden" name="platform" value={platform} />
                  <input type="hidden" name="budget" value={budgetRange} />
                  <FormOptionGroup
                    label="Platform needed"
                    name="platformChoice"
                    options={platformOptions}
                    columns={4}
                    value={platform}
                    onChange={(value) => {
                      setPlatform(value)
                      setFieldErrors((current) => ({ ...current, platform: "" }))
                    }}
                    required
                    error={fieldErrors.platform}
                  />
                  <FormField
                    label="Desired timeline"
                    name="timeline"
                    placeholder="e.g. 4–6 weeks, launch by Q3"
                    required
                  />
                  <FormOptionGroup
                    label="Estimated budget range"
                    name="budgetChoice"
                    options={budgetOptions}
                    columns={4}
                    value={budgetRange}
                    onChange={(value) => {
                      setBudgetRange(value)
                      setFieldErrors((current) => ({ ...current, budget: "" }))
                    }}
                    required
                    error={fieldErrors.budget}
                  />
                </FormSection>

                <FormSection title="Final context">
                  <FormField
                    label="Reference links or inspiration"
                    name="references"
                    placeholder="Apps, sites, Figma links, or examples you admire"
                    optional
                  />
                  <FormTextarea
                    label="Additional notes"
                    name="notes"
                    rows={3}
                    placeholder="Constraints, existing stack, or anything else worth knowing."
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

                <TurnstileWidget
                  onTokenChange={handleTurnstileTokenChange}
                  resetSignal={turnstileResetSignal}
                />

                {submitError ? (
                  <p
                    className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100"
                    role="alert"
                  >
                    {submitError}
                  </p>
                ) : null}

                {successMessage ? (
                  <p
                    className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100"
                    role="status"
                  >
                    {successMessage}
                  </p>
                ) : null}

                <p className="text-sm leading-relaxed text-muted">
                  By submitting this form, you agree to our{" "}
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
                  {isSubmitting ? "Submitting project intake..." : intakeSubmitCta}
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </GlassCard>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <GlassCard className="h-full p-5 sm:p-8">
              <p className="text-sm font-medium text-white">What happens next</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {sessionValueCopy}
              </p>

              <div className="mt-6 space-y-3">
                {consultationEngagements.map((engagement) => (
                  <div
                    key={engagement.id}
                    className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white">
                          {engagement.name}
                        </p>
                        {engagement.duration ? (
                          <p className="mt-1 text-xs text-muted">
                            {engagement.duration}
                          </p>
                        ) : null}
                        <p className="mt-2 text-xs leading-relaxed text-muted">
                          {engagement.description}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-semibold text-white">
                        {engagement.priceLabel}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

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
