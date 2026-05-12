import { readIntakePayload, sendIntakeEmails } from "./_lib/intakeEmail.js"

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

  const payload = readIntakePayload(req.body ?? {})
  const missingFields = [
    "fullName",
    "email",
    "planningSession",
    "projectSummary",
    "platform",
    "budgetRange",
  ].filter((field) => !payload[field])

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: "Missing required intake fields.",
      missingFields,
    })
  }

  console.info("[Bryant Labs] Intake email dispatch started", {
    customerRecipient: payload.email,
    internalRecipient: emailUser,
    customerName: payload.fullName,
  })

  try {
    const emailResult = await sendIntakeEmails(payload)

    if (!emailResult.customerConfirmationSent) {
      return res.status(502).json({
        error: "Client confirmation email could not be sent.",
        customerConfirmationSent: false,
        internalNotificationSent: emailResult.internalNotificationSent,
      })
    }

    return res.status(200).json({
      success: true,
      customerConfirmationSent: true,
      internalNotificationSent: emailResult.internalNotificationSent,
    })
  } catch (error) {
    console.error("[Bryant Labs] Intake email dispatch failed", {
      error: error.message,
    })

    return res.status(502).json({
      error: "Client confirmation email could not be sent.",
      customerConfirmationSent: false,
      internalNotificationSent: false,
    })
  }
}
