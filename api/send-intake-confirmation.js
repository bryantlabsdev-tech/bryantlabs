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

function buildClientEmailHtml({ fullName }) {
  const greeting = escapeHtml(fullName || "there")

  return `
    <div style="font-family:Inter,Segoe UI,sans-serif;line-height:1.6;color:#111827;max-width:640px;">
      <p style="margin:0 0 16px;">Hi ${greeting},</p>
      <p style="margin:0 0 16px;">Thank you for submitting your project intake to Bryant Labs.</p>
      <p style="margin:0 0 16px;">Our team will review your details and follow up by email with next steps. We typically respond within one to two business days.</p>
      <p style="margin:0 0 16px;">Every engagement begins with qualification and planning. If your project looks like a fit, we will schedule a short complimentary intro call before any paid discovery or strategy session.</p>
      <p style="margin:0 0 16px;">Paid planning sessions are scheduled only after intake review. If you move forward with a build, those session fees are credited toward your project kickoff deposit.</p>
      <p style="margin:0 0 16px;">Development does not begin until proposal, milestones, and kickoff deposit are approved.</p>
      <p style="margin:0;">— Bryant Labs</p>
    </div>
  `
}

function buildInternalEmailHtml(payload) {
  return `
    <div style="font-family:Inter,Segoe UI,sans-serif;line-height:1.6;color:#111827;max-width:720px;">
      <h1 style="margin:0 0 16px;font-size:20px;">New Bryant Labs intake submitted</h1>
      ${formatField("Name", payload.fullName)}
      ${formatField("Email", payload.email)}
      ${formatField("Planning session preference", payload.planningSession)}
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
      ${formatField("Lead status", payload.leadStatus || "intake_submitted")}
    </div>
  `
}

function readPayload(body) {
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
    audience: String(body.audience ?? "").trim(),
    coreFeatures: String(body.coreFeatures ?? "").trim(),
    referenceLinks: String(body.referenceLinks ?? body.references ?? "").trim(),
    additionalNotes: String(body.additionalNotes ?? body.notes ?? "").trim(),
    submittedAt: String(body.submittedAt ?? new Date().toISOString()).trim(),
    leadStatus: String(body.leadStatus ?? "intake_submitted").trim(),
  }
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

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST")
    return res.status(405).json({ error: "Method not allowed" })
  }

  const emailUser = process.env.EMAIL_USER
  const emailPassword = process.env.EMAIL_PASSWORD

  if (!emailUser || !emailPassword) {
    console.error("[Bryant Labs] Intake email env is not configured.")
    return res.status(503).json({ error: "Email service is not configured." })
  }

  const payload = readPayload(req.body ?? {})
  const missingFields = ["fullName", "email", "planningSession", "projectSummary", "platform", "budgetRange"].filter(
    (field) => !payload[field],
  )

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: "Missing required intake fields.",
      missingFields,
    })
  }

  const transporter = createTransport()
  const fromAddress = `Bryant Labs <${emailUser}>`
  const clientSubject = "Your Bryant Labs project intake was received"
  const internalSubject = "New Bryant Labs intake submitted"

  console.info("[Bryant Labs] Intake email dispatch started", {
    customerRecipient: payload.email,
    internalRecipient: emailUser,
    customerName: payload.fullName,
  })

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

  if (!clientResult.success) {
    return res.status(502).json({
      error: "Client confirmation email could not be sent.",
      customerConfirmationSent: false,
      internalNotificationSent: internalResult.success,
    })
  }

  return res.status(200).json({
    success: true,
    customerConfirmationSent: true,
    internalNotificationSent: internalResult.success,
  })
}
