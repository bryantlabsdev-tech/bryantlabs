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
      <p style="margin:0 0 16px;">We will review your details and follow up by email with next steps.</p>
      <p style="margin:0 0 16px;">If your project looks like a fit, the next step is a short complimentary intro call to discuss goals, timeline, and whether a deeper planning session makes sense.</p>
      <p style="margin:0 0 16px;">Paid discovery and product strategy sessions are scheduled only after intake review. If you move forward with a build, those session fees are credited toward your project kickoff deposit.</p>
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

  let clientEmailError = null
  let internalEmailError = null

  try {
    await transporter.sendMail({
      from: fromAddress,
      to: payload.email,
      replyTo: emailUser,
      subject: clientSubject,
      html: buildClientEmailHtml(payload),
    })
  } catch (error) {
    clientEmailError = error
    console.error("[Bryant Labs] Client intake confirmation email failed:", error)
  }

  try {
    await transporter.sendMail({
      from: fromAddress,
      to: emailUser,
      replyTo: payload.email,
      subject: internalSubject,
      html: buildInternalEmailHtml(payload),
    })
  } catch (error) {
    internalEmailError = error
    console.error("[Bryant Labs] Internal intake notification email failed:", error)
  }

  if (clientEmailError) {
    return res.status(502).json({
      error: "Client confirmation email could not be sent.",
      internalNotificationSent: !internalEmailError,
    })
  }

  return res.status(200).json({
    success: true,
    internalNotificationSent: !internalEmailError,
  })
}
