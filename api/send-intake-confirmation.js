export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST")
    return res.status(405).json({ error: "Method not allowed" })
  }

  return res.status(410).json({
    error: "This intake confirmation route is retired. Use POST /api/submit-intake.",
  })
}
