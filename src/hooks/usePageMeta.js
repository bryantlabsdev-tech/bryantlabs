import { useEffect } from "react"

const defaultTitle = "Bryant Labs — Custom Software Studio"
const defaultDescription =
  "Bryant Labs builds modern software systems for businesses—from mobile apps and dashboards to automation workflows and AI-powered tools."

export function usePageMeta({ title, description }) {
  useEffect(() => {
    const previousTitle = document.title
    const meta = document.querySelector('meta[name="description"]')
    const previousDescription = meta?.getAttribute("content") ?? defaultDescription

    document.title = title

    if (meta && description) {
      meta.setAttribute("content", description)
    }

    return () => {
      document.title = previousTitle || defaultTitle

      if (meta) {
        meta.setAttribute("content", previousDescription)
      }
    }
  }, [title, description])
}
