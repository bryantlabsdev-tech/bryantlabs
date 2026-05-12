import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { getEnvStatus } from "./_lib/envCheck.js"

const appName = "Bryant Labs"

function readAppVersion() {
  try {
    const packagePath = join(dirname(fileURLToPath(import.meta.url)), "..", "package.json")
    const packageJson = JSON.parse(readFileSync(packagePath, "utf8"))
    return packageJson.version ?? null
  } catch {
    return null
  }
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET")
    return res.status(405).json({ error: "Method not allowed" })
  }

  const envConfigured = getEnvStatus()
  const ok = Object.values(envConfigured).every(Boolean)

  return res.status(200).json({
    ok,
    app: appName,
    timestamp: new Date().toISOString(),
    checks: {
      envConfigured,
    },
    version: readAppVersion(),
  })
}
