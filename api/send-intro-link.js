import { createClient } from "@supabase/supabase-js"
import nodemailer from "nodemailer"
import { getServerAdminEmail, isServerApprovedAdminEmail } from "./_lib/adminIdentity.js"
import { logMissingEnvForRoute, routeEnvRequirements } from "./_lib/envCheck.js"
import { logAppError } from "./_lib/logError.js"

const smtpHost = "mail.privateemail.com"
const smtpPort = 587
const introEmailSubject = "Schedule your Bryant Labs intro call"

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

function getApprovedAdminEmail() {
  return getServerAdminEmail()
}

function getSupabaseConfig() {
  return {
    url: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY,
  }
}

function readAccessToken(req) {
  const authHeader = String(req.headers.authorization ?? "")

  if (!authHeader.startsWith("Bearer ")) {
    return ""
  }

  return authHeader.slice(7).trim()
}

function readPayload(body) {
  const fullName = String(body.fullName ?? body.name ?? "").trim()
  const email = String(body.email ?? "").trim()
  const leadId = String(body.leadId ?? body.lead_id ?? "").trim()

  return {
    leadId,
    fullName,
    email,
  }
}

function buildIntroEmailHtml({ fullName, calendlyUrl }) {
  const greeting = escapeHtml(fullName || "there")
  const safeCalendlyUrl = escapeHtml(calendlyUrl)

  return `
    <div style="font-family:Inter,Segoe UI,sans-serif;line-height:1.6;color:#111827;max-width:640px;">
      <p style="margin:0 0 16px;">Hi ${greeting},</p>
      <p style="margin:0 0 16px;">Thank you for sharing your project details with Bryant Labs.</p>
      <p style="margin:0 0 16px;">We reviewed your intake and would like to schedule a short complimentary intro call to better understand your goals, timeline, and next steps.</p>
      <p style="margin:0 0 16px;">You can choose a time here:<br><a href="${safeCalendlyUrl}">${safeCalendlyUrl}</a></p>
      <p style="margin:0 0 16px;">This intro call is free and focused on fit, scope, and next steps. If deeper planning is needed, we’ll recommend a paid discovery or product strategy session afterward.</p>
      <p style="margin:0;">— Bryant Labs</p>
    </div>
  `
}

function buildIntroEmailText({ fullName, calendlyUrl }) {
  const greeting = fullName || "there"

  return `Hi ${greeting},

Thank you for sharing your project details with Bryant Labs.

We reviewed your intake and would like to schedule a short complimentary intro call to better understand your goals, timeline, and next steps.

You can choose a time here:
${calendlyUrl}

This intro call is free and focused on fit, scope, and next steps. If deeper planning is needed, we’ll recommend a paid discovery or product strategy session afterward.

— Bryant Labs`
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

async function verifyAdminRequest(req) {
  const accessToken = readAccessToken(req)

  if (!accessToken) {
    await logAppError({
      source: "send-intro-link",
      severity: "warn",
      message: "Intro link request missing admin access token.",
      details: { reason: "missing_access_token" },
    })

    return { ok: false, status: 401, error: "Unauthorized" }
  }

  const { url, anonKey } = getSupabaseConfig()

  if (!url || !anonKey) {
    await logAppError({
      source: "send-intro-link",
      message: "Intro link auth environment is not configured.",
      details: { reason: "supabase_auth_env_missing" },
    })

    return { ok: false, status: 503, error: "Auth service is not configured." }
  }

  const adminEmail = getApprovedAdminEmail()

  if (!adminEmail) {
    await logAppError({
      source: "send-intro-link",
      message: "Approved admin email is not configured.",
      details: { reason: "admin_email_missing" },
    })

    return { ok: false, status: 503, error: "Admin access is not configured." }
  }

  const supabase = createClient(url, anonKey)
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(accessToken)

  if (error || !user?.email) {
    await logAppError({
      source: "send-intro-link",
      severity: "warn",
      message: "Intro link admin authentication failed.",
      details: {
        reason: "admin_auth_failed",
        error: error?.message ?? "missing_user_email",
      },
    })

    return { ok: false, status: 401, error: "Unauthorized" }
  }

  if (!isServerApprovedAdminEmail(user.email)) {
    await logAppError({
      source: "send-intro-link",
      severity: "warn",
      message: "Intro link request rejected for non-approved admin.",
      details: {
        reason: "admin_forbidden",
        adminEmail,
      },
    })

    return { ok: false, status: 403, error: "Forbidden" }
  }

  return { ok: true, user }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST")
    return res.status(405).json({ error: "Method not allowed" })
  }

  const authResult = await verifyAdminRequest(req)

  if (!authResult.ok) {
    return res.status(authResult.status).json({ error: authResult.error })
  }

  const missingEnv = await logMissingEnvForRoute({
    source: "send-intro-link",
    keys: routeEnvRequirements["send-intro-link"],
  })

  if (missingEnv.includes("EMAIL_USER") || missingEnv.includes("EMAIL_PASSWORD")) {
    return res.status(503).json({ error: "Email service is not configured." })
  }

  if (missingEnv.includes("CALENDLY_INTRO_URL")) {
    return res.status(503).json({ error: "Calendly intro link is not configured." })
  }

  const emailUser = process.env.EMAIL_USER
  const calendlyIntroUrl = process.env.CALENDLY_INTRO_URL

  const payload = readPayload(req.body ?? {})
  const missingFields = ["leadId", "fullName", "email"].filter((field) => !payload[field])

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: "Missing required lead fields.",
      missingFields,
    })
  }

  const transporter = createTransport()
  const fromAddress = `Bryant Labs <${emailUser}>`

  console.info("[Bryant Labs] Intro link email dispatch started", {
    leadId: payload.leadId,
    recipient: payload.email,
    adminEmail: authResult.user.email,
  })

  try {
    const info = await transporter.sendMail({
      from: fromAddress,
      replyTo: emailUser,
      to: payload.email,
      subject: introEmailSubject,
      text: buildIntroEmailText({
        fullName: payload.fullName,
        calendlyUrl: calendlyIntroUrl,
      }),
      html: buildIntroEmailHtml({
        fullName: payload.fullName,
        calendlyUrl: calendlyIntroUrl,
      }),
    })

    console.info("[Bryant Labs] Intro link email sent successfully", {
      leadId: payload.leadId,
      recipient: payload.email,
      adminEmail: authResult.user.email,
      smtp: summarizeSmtpResponse(info),
    })

    return res.status(200).json({
      success: true,
      leadId: payload.leadId,
      introLinkSent: true,
    })
  } catch (error) {
    await logAppError({
      source: "send-intro-link",
      message: "Intro link email failed to send.",
      details: {
        reason: "smtp_dispatch_failed",
        error: error.message,
        leadId: payload.leadId,
        email: payload.email,
      },
    })

    return res.status(502).json({
      error: "Intro call email could not be sent.",
      introLinkSent: false,
    })
  }
}
