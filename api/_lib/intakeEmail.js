import nodemailer from "nodemailer"

const smtpHost = "mail.privateemail.com"
const smtpPort = 587

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

function formatField(label, value) {
  const safeValue = escapeHtml(value || "Not provided")
  return `<p style="margin:0 0 12px;"><strong>${label}:</strong> ${safeValue}</p>`
}

function formatFieldIfValue(label, value) {
  const trimmed = String(value ?? "").trim()

  if (!trimmed) {
    return ""
  }

  return formatField(label, trimmed)
}

function buildClientEmailHtml(payload) {
  const greeting = escapeHtml(payload.fullName || "there")
  const isQuick = String(payload.intakeStage ?? "").trim() === "quick"

  const followUp = isQuick
    ? `<p style="margin:0 0 16px;">If we need more detail for a useful estimate, we’ll ask targeted questions first—before suggesting paid discovery or strategy.</p>`
    : `<p style="margin:0 0 16px;">Paid planning sessions are scheduled only after intake review. If you move forward with a build, those session fees are credited toward your project kickoff deposit.</p>`

  return `
    <div style="font-family:Inter,Segoe UI,sans-serif;line-height:1.6;color:#111827;max-width:640px;">
      <p style="margin:0 0 16px;">Hi ${greeting},</p>
      <p style="margin:0 0 16px;">Thank you for sending your project brief to Bryant Labs.</p>
      <p style="margin:0 0 16px;">Our team will review what you shared and follow up by email with next steps. We typically respond within one to two business days.</p>
      <p style="margin:0 0 16px;">If your project looks like a fit, we may suggest a short complimentary intro call—only when it helps align scope and sequencing.</p>
      ${followUp}
      <p style="margin:0 0 16px;">Development does not begin until proposal, milestones, and kickoff deposit are approved.</p>
      <p style="margin:0;">— Bryant Labs</p>
    </div>
  `
}

function buildInternalEmailHtml(payload) {
  return `
    <div style="font-family:Inter,Segoe UI,sans-serif;line-height:1.6;color:#111827;max-width:720px;">
      <h1 style="margin:0 0 16px;font-size:20px;">New Bryant Labs intake submitted</h1>
      ${formatFieldIfValue("Intake stage", payload.intakeStage)}
      ${formatFieldIfValue("Engagement shape", payload.intakeContext)}
      ${formatField("Name", payload.fullName)}
      ${formatField("Email", payload.email)}
      ${formatFieldIfValue("Phone", payload.phone)}
      ${formatField("Preferred next step", payload.planningSession)}
      ${formatField("Project summary", payload.projectSummary)}
      ${formatField("Platform", payload.platform)}
      ${formatField("Budget range", payload.budgetRange)}
      ${formatField("Timeline", payload.timeline)}
      ${formatField("Company or brand", payload.company)}
      ${formatField("Audience", payload.audience)}
      ${formatField("Core features", payload.coreFeatures)}
      ${formatField("Reference links", payload.referenceLinks)}
      ${formatField("Additional notes", payload.additionalNotes)}
      ${formatField("Submitted at", payload.submittedAt)}
      ${formatField("Lead status", payload.leadStatus || "new")}
    </div>
  `
}

export function readIntakePayload(body) {
  const planningSession =
    body.planningSession ||
    body.selectedPlanningSession ||
    body.sessionName ||
    ""

  return {
    fullName: String(body.fullName ?? "").trim(),
    email: String(body.email ?? "").trim(),
    planningSession: String(planningSession).trim(),
    projectSummary: String(body.projectSummary ?? "").trim(),
    platform: String(body.platform ?? body.platformNeeded ?? "").trim(),
    budgetRange: String(body.budgetRange ?? body.budget ?? "").trim(),
    timeline: String(body.timeline ?? "").trim(),
    company: String(body.company ?? "").trim(),
    phone: String(body.phone ?? "").trim(),
    audience: String(body.audience ?? "").trim(),
    coreFeatures: String(body.coreFeatures ?? "").trim(),
    referenceLinks: String(body.referenceLinks ?? body.references ?? "").trim(),
    additionalNotes: String(body.additionalNotes ?? body.notes ?? "").trim(),
    submittedAt: String(body.submittedAt ?? new Date().toISOString()).trim(),
    leadStatus: String(body.leadStatus ?? "new").trim(),
    sessionId: String(body.sessionId ?? "").trim(),
    sessionName: String(body.sessionName ?? planningSession).trim(),
    sessionPriceCents: Number(body.sessionPriceCents ?? 0),
    sessionPriceLabel: String(body.sessionPriceLabel ?? "").trim(),
    intakeStage: String(body.intakeStage ?? "full").trim(),
    intakeContext: String(body.intakeContext ?? "").trim(),
    websiteUrl: String(body.website_url ?? body.websiteUrl ?? "").trim(),
    turnstileToken: String(body.turnstileToken ?? "").trim(),
    analyticsSessionId: String(body.analyticsSessionId ?? "").trim(),
    analyticsDisabled: Boolean(body.analyticsDisabled),
  }
}

function omitUndefined(record) {
  return Object.fromEntries(
    Object.entries(record).filter(([, value]) => value !== undefined),
  )
}

/**
 * Columns included on the primary intake insert (canonical app shape).
 * CRM-only columns (last_contacted_at, next_follow_up_at, etc.) are never sent here.
 */
export const INTAKE_CONSULTATION_LEADS_INSERT_COLUMNS = [
  "full_name",
  "email",
  "phone",
  "intake_stage",
  "engagement_shape",
  "company_brand",
  "selected_session_id",
  "selected_session_name",
  "selected_session_price_cents",
  "selected_session_price_label",
  "project_summary",
  "audience",
  "core_features",
  "platform_needed",
  "desired_timeline",
  "budget_range",
  "reference_links",
  "additional_notes",
  "status",
  "stripe_customer_email",
]

export function mapIntakePayloadToLeadRow(payload) {
  const baseNotes = String(payload.additionalNotes ?? "").trim()
  const stageTag =
    String(payload.intakeStage ?? "").trim() === "quick"
      ? "[Stage 1: quick brief]\n"
      : ""
  const mergedNotes = (stageTag + baseNotes).trim()

  return omitUndefined({
    full_name: payload.fullName,
    email: payload.email,
    phone: payload.phone || null,
    intake_stage: payload.intakeStage || null,
    engagement_shape: payload.intakeContext || null,
    company_brand: payload.company || null,
    selected_session_id: payload.sessionId,
    selected_session_name: payload.sessionName,
    selected_session_price_cents: payload.sessionPriceCents,
    selected_session_price_label: payload.sessionPriceLabel,
    project_summary: payload.projectSummary,
    audience: payload.audience,
    core_features: payload.coreFeatures,
    platform_needed: payload.platform || null,
    desired_timeline: payload.timeline,
    budget_range: payload.budgetRange || null,
    reference_links: payload.referenceLinks || null,
    additional_notes: mergedNotes || null,
    status: "new",
    stripe_customer_email: payload.email,
  })
}

/** Intake without optional columns that older DBs often lack (phone, long text refs, Stripe mirror). */
export function mapIntakePayloadToReducedLeadRow(payload) {
  return omitUndefined({
    full_name: payload.fullName,
    email: payload.email,
    company_brand: payload.company || null,
    selected_session_id: payload.sessionId,
    selected_session_name: payload.sessionName,
    selected_session_price_cents: payload.sessionPriceCents,
    selected_session_price_label: payload.sessionPriceLabel,
    project_summary: payload.projectSummary,
    audience: payload.audience,
    core_features: payload.coreFeatures,
    platform_needed: payload.platform || null,
    desired_timeline: payload.timeline,
    budget_range: payload.budgetRange || null,
    status: "new",
  })
}

/** Ultra-narrow row for legacy schemas missing session / audience columns. */
export function mapIntakePayloadToMinimalLeadRow(payload) {
  return omitUndefined({
    full_name: payload.fullName,
    email: payload.email,
    company_brand: payload.company || null,
    project_summary: payload.projectSummary,
    platform_needed: payload.platform || null,
    budget_range: payload.budgetRange || null,
    status: "new",
  })
}

/** Last-resort capture: identity + summary only. */
export function mapIntakePayloadToBareLeadRow(payload) {
  return omitUndefined({
    full_name: payload.fullName,
    email: payload.email,
    project_summary: payload.projectSummary,
    status: "new",
  })
}

/**
 * Ordered insert attempts: fullest schema first, then progressively smaller
 * payloads when PostgREST reports missing / unknown columns (production drift).
 */
export function buildIntakeInsertAttemptRows(payload) {
  const rows = []
  const seen = new Set()

  const add = (row) => {
    const clean = omitUndefined(row)
    const signature = JSON.stringify(Object.keys(clean).sort())

    if (seen.has(signature)) {
      return
    }

    seen.add(signature)
    rows.push(clean)
  }

  const full = mapIntakePayloadToLeadRow(payload)
  add(full)

  const withoutStripe = { ...full }
  delete withoutStripe.stripe_customer_email
  add(withoutStripe)

  add(mapIntakePayloadToReducedLeadRow(payload))
  add(mapIntakePayloadToMinimalLeadRow(payload))
  add(mapIntakePayloadToBareLeadRow(payload))

  return rows
}

function createTransport() {
  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })
}

function summarizeSmtpResponse(info) {
  return {
    messageId: info.messageId,
    response: info.response,
    accepted: info.accepted,
    rejected: info.rejected,
  }
}

async function sendTrackedEmail(transporter, { type, to, mailOptions }) {
  console.info(`[Bryant Labs] Sending ${type} intake email`, {
    type,
    to,
    from: mailOptions.from,
    subject: mailOptions.subject,
  })

  try {
    const info = await transporter.sendMail({
      ...mailOptions,
      to,
    })

    console.info(`[Bryant Labs] ${type} intake email sent successfully`, {
      type,
      to,
      from: mailOptions.from,
      subject: mailOptions.subject,
      smtp: summarizeSmtpResponse(info),
    })

    return { success: true, info }
  } catch (error) {
    console.error(`[Bryant Labs] ${type} intake email failed`, {
      type,
      to,
      from: mailOptions.from,
      subject: mailOptions.subject,
      error: error.message,
    })

    return { success: false, error }
  }
}

export async function sendIntakeEmails(payload) {
  const emailUser = process.env.EMAIL_USER
  const emailPassword = process.env.EMAIL_PASSWORD

  if (!emailUser || !emailPassword) {
    throw new Error("Email service is not configured.")
  }

  const transporter = createTransport()
  const fromAddress = `Bryant Labs <${emailUser}>`
  const clientSubject =
    String(payload.intakeStage ?? "").trim() === "quick"
      ? "Your Bryant Labs brief was received"
      : "Your Bryant Labs project intake was received"
  const internalSubject = "New Bryant Labs intake submitted"

  const clientResult = await sendTrackedEmail(transporter, {
    type: "customer confirmation",
    to: payload.email,
    mailOptions: {
      from: fromAddress,
      replyTo: emailUser,
      subject: clientSubject,
      html: buildClientEmailHtml(payload),
    },
  })

  const internalResult = await sendTrackedEmail(transporter, {
    type: "internal notification",
    to: emailUser,
    mailOptions: {
      from: fromAddress,
      replyTo: payload.email,
      subject: internalSubject,
      html: buildInternalEmailHtml(payload),
    },
  })

  return {
    customerConfirmationSent: clientResult.success,
    internalNotificationSent: internalResult.success,
  }
}
