import { useMemo, useState } from "react"
import { Mail, Send } from "lucide-react"
import { introCallSchedulingCopy, introCallTitle } from "../../config/scheduling"
import { consultationEngagements } from "../../data/consultation"
import {
  intakeSubmitCta,
  sessionAfterSubmitCopy,
  sessionCreditCopy,
  sessionIntakeCopy,
  sessionSidebarNote,
  sessionSuccessMessage,
  sessionValueCopy,
  strategySessions,
} from "../../data/sessions"
import {
  SessionIntakeError,
  submitSessionIntake,
} from "../../lib/submitSessionIntake"
import Button from "../ui/Button"
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
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitError, setSubmitError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const selectedSession = useMemo(
    () =>
      strategySessions.find((session) => session.id === selectedSessionId) ??
      strategySessions[0],
    [selectedSessionId],
  )

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

    setFieldErrors({})
    setIsSubmitting(true)

    try {
      const formData = new FormData(form)
      const { success, checkoutUrl } = await submitSessionIntake({
        session: selectedSession,
        formData,
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
    <section id="contact" className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Getting started"
          title="Submit your free project intake."
          description={sessionValueCopy}
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.45fr_0.85fr]">
          <ScrollReveal>
            <GlassCard hover={false} className="p-6 sm:p-8">
              <div className="space-y-2">
                <p className="text-sm leading-relaxed text-muted">
                  {sessionCreditCopy}
                </p>
                <p className="text-sm leading-relaxed text-white/70">
                  {sessionIntakeCopy} {sessionAfterSubmitCopy}
                </p>
                <p className="text-sm leading-relaxed text-muted">
                  Share the essentials below so Bryant Labs can review your
                  project, schedule your intro call, and recommend the right
                  planning session if we move forward together.
                </p>
              </div>

              <form className="mt-8 space-y-8" onSubmit={handleSubmit} noValidate>
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

                <Button
                  type="submit"
                  className="w-full sm:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting project intake..." : intakeSubmitCta}
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </GlassCard>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <GlassCard className="h-full p-6 sm:p-8">
              <p className="text-sm font-medium text-white">
                Consultation flow
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {sessionValueCopy}
              </p>

              <div className="mt-6 space-y-3">
                {consultationEngagements.map((engagement) => (
                  <div
                    key={engagement.id}
                    className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
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

              <p className="mt-6 text-sm leading-relaxed text-muted">
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

              <p className="mt-8 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/75">
                {sessionSidebarNote}
              </p>
            </GlassCard>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
