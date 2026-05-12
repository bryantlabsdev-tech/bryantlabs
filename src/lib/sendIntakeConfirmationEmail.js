export async function sendIntakeConfirmationEmail(intake) {
  try {
    const response = await fetch("/api/send-intake-confirmation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName: intake.fullName,
        email: intake.email,
        planningSession: intake.session.name,
        projectSummary: intake.projectSummary,
        platform: intake.platform,
        budgetRange: intake.budget,
        timeline: intake.timeline,
        company: intake.company,
        audience: intake.audience,
        coreFeatures: intake.coreFeatures,
        referenceLinks: intake.references,
        additionalNotes: intake.notes,
        submittedAt: intake.submittedAt,
        leadStatus: "intake_submitted",
      }),
    })

    if (!response.ok) {
      const details = await response.json().catch(() => ({}))
      console.error("[Bryant Labs] Intake confirmation email failed:", {
        customerEmail: intake.email,
        details,
      })
      return
    }

    const details = await response.json().catch(() => ({}))
    console.info("[Bryant Labs] Intake confirmation email dispatch completed", {
      customerEmail: intake.email,
      customerConfirmationSent: details.customerConfirmationSent,
      internalNotificationSent: details.internalNotificationSent,
    })
  } catch (error) {
    console.error("[Bryant Labs] Intake confirmation email failed:", error)
  }
}
