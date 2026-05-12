export function getServerAdminEmail() {
  return String(process.env.ADMIN_EMAIL ?? "")
    .trim()
    .toLowerCase()
}

export function isServerApprovedAdminEmail(email) {
  const approvedEmail = getServerAdminEmail()

  if (!approvedEmail || !email) {
    return false
  }

  return String(email).trim().toLowerCase() === approvedEmail
}
