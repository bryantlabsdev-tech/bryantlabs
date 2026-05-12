import { sendIntakeConfirmationEmail } from "./sendIntakeConfirmationEmail"
import { getSupabaseClient } from "./supabaseClient"

export class SessionIntakeError extends Error {
  constructor(message, options = {}) {
    super(message)
    this.name = "SessionIntakeError"
    this.cause = options.cause
  }
}

function buildIntakePayload(session, formData) {
  return {
    session: {
      id: session.id,
      name: session.name,
      priceLabel: session.priceLabel,
      priceCents: session.priceCents,
    },
    fullName: String(formData.get("fullName") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    company: String(formData.get("company") ?? "").trim(),
    projectSummary: String(formData.get("projectSummary") ?? "").trim(),
    audience: String(formData.get("audience") ?? "").trim(),
    coreFeatures: String(formData.get("coreFeatures") ?? "").trim(),
    platform: String(formData.get("platform") ?? "").trim(),
    timeline: String(formData.get("timeline") ?? "").trim(),
    budget: String(formData.get("budget") ?? "").trim(),
    references: String(formData.get("references") ?? "").trim(),
    notes: String(formData.get("notes") ?? "").trim(),
    submittedAt: new Date().toISOString(),
  }
}

function mapIntakeToLeadRow(intake, session) {
  return {
    full_name: intake.fullName,
    email: intake.email,
    company_brand: intake.company || null,
    selected_session_id: session.id,
    selected_session_name: session.name,
    selected_session_price_cents: session.priceCents,
    selected_session_price_label: session.priceLabel,
    project_summary: intake.projectSummary,
    audience: intake.audience,
    core_features: intake.coreFeatures,
    platform_needed: intake.platform || null,
    desired_timeline: intake.timeline,
    budget_range: intake.budget || null,
    reference_links: intake.references || null,
    additional_notes: intake.notes || null,
    stripe_customer_email: intake.email,
  }
}

export async function submitSessionIntake({ session, formData }) {
  const intake = buildIntakePayload(session, formData)
  const supabase = getSupabaseClient()

  const { error } = await supabase
    .from("consultation_leads")
    .insert([mapIntakeToLeadRow(intake, session)])

  if (error) {
    throw new SessionIntakeError(
      "We could not save your intake request. Please try again in a moment.",
      { cause: error },
    )
  }

  await sendIntakeConfirmationEmail(intake)

  // TODO: After intake review, email the complimentary intro-call Calendly link from
  // scheduling config instead of exposing public self-serve booking on the site.
  // TODO: Store Calendly event URLs in config (or env) for intro, Discovery, and
  // Product Strategy sessions.
  // TODO: Add paid Calendly or Stripe-backed scheduling for Discovery and Product
  // Strategy once payments are integrated.

  return {
    success: true,
    intake,
    checkoutUrl: null,
  }
}
