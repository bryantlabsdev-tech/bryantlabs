export class IntroLinkEmailError extends Error {
  constructor(message, options = {}) {
    super(message)
    this.name = "IntroLinkEmailError"
    this.status = options.status
    this.details = options.details
  }
}

export async function sendIntroLinkEmail({
  accessToken,
  leadId,
  fullName,
  email,
}) {
  if (!accessToken) {
    throw new IntroLinkEmailError("You must be signed in to send intro links.")
  }

  const response = await fetch("/api/send-intro-link", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      leadId,
      fullName,
      email,
    }),
  })

  const details = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new IntroLinkEmailError(
      details.error ?? "The intro call email could not be sent.",
      {
        status: response.status,
        details,
      },
    )
  }

  return details
}
