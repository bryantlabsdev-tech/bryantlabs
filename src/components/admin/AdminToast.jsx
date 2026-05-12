import { useEffect } from "react"

export default function AdminToast({ message, onDismiss }) {
  useEffect(() => {
    if (!message) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      onDismiss()
    }, 3200)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [message, onDismiss])

  if (!message) {
    return null
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4">
      <p
        className="rounded-full border border-emerald-400/20 bg-emerald-500/15 px-5 py-3 text-sm text-emerald-100 shadow-[0_20px_60px_-30px_rgba(16,185,129,0.8)]"
        role="status"
        aria-live="polite"
      >
        {message}
      </p>
    </div>
  )
}
