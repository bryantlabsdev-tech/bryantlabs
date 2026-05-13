import { useCallback, useMemo, useState } from "react"
import { Check, Copy } from "lucide-react"
import Button from "../ui/Button"

const SENSITIVE_KEY = /password|secret|token|authorization|apikey|api_key|smtp|email_password/i

function redactForDisplay(value, depth = 0) {
  if (depth > 12) {
    return "[max depth]"
  }

  if (value === null || value === undefined) {
    return value
  }

  if (typeof value !== "object") {
    return value
  }

  if (Array.isArray(value)) {
    return value.map((item) => redactForDisplay(item, depth + 1))
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, val]) => {
      if (SENSITIVE_KEY.test(key)) {
        return [key, "[redacted]"]
      }

      return [key, redactForDisplay(val, depth + 1)]
    }),
  )
}

function JsonScalar({ value }) {
  if (value === null) {
    return <span className="text-violet-300/90">null</span>
  }

  if (typeof value === "boolean") {
    return <span className="text-amber-200/90">{String(value)}</span>
  }

  if (typeof value === "number") {
    return <span className="text-cyan-200/90">{value}</span>
  }

  if (typeof value === "string") {
    const safe = value.length > 240 ? `${value.slice(0, 240)}…` : value
    return <span className="text-emerald-200/85">{JSON.stringify(safe)}</span>
  }

  return <span className="text-white/50">{String(value)}</span>
}

function JsonTree({ value, depth = 0 }) {
  const pad = { paddingLeft: depth * 12 }

  if (value === null || value === undefined || typeof value !== "object") {
    return (
      <span style={pad}>
        <JsonScalar value={value} />
      </span>
    )
  }

  if (Array.isArray(value)) {
    return (
      <div style={pad} className="space-y-1">
        <span className="text-white/40">[</span>
        {value.map((item, i) => (
          <div key={i} className="border-l border-white/10 pl-2">
            <JsonTree value={item} depth={depth + 1} />
          </div>
        ))}
        <span className="text-white/40">]</span>
      </div>
    )
  }

  return (
    <div style={pad} className="space-y-1 text-[13px] leading-relaxed">
      <span className="text-white/40">{"{"}</span>
      {Object.entries(value).map(([key, val]) => (
        <div key={key} className="border-l border-white/10 pl-2">
          <span className="text-cyan-200/80">{JSON.stringify(key)}</span>
          <span className="text-white/35">: </span>
          {val !== null && typeof val === "object" ? (
            <JsonTree value={val} depth={depth + 1} />
          ) : (
            <JsonScalar value={val} />
          )}
        </div>
      ))}
      <span className="text-white/40">{"}"}</span>
    </div>
  )
}

export default function OpsJsonBlock({ data, title = "JSON", defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  const [copied, setCopied] = useState(false)

  const safe = useMemo(() => redactForDisplay(data ?? {}), [data])

  const text = useMemo(() => JSON.stringify(safe, null, 2), [safe])

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }, [text])

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-black/35">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium text-white/90 transition hover:bg-white/[0.04]"
      >
        <span>{title}</span>
        <span className="text-xs text-muted">{open ? "Hide" : "Show"}</span>
      </button>
      {open ? (
        <div className="border-t border-white/[0.06] px-3 py-3 sm:px-4 sm:py-4">
          <div className="mb-3 flex justify-end">
            <Button
              type="button"
              variant="secondary"
              className="gap-2 px-3 py-2 text-xs"
              onClick={() => void handleCopy()}
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy JSON
                </>
              )}
            </Button>
          </div>
          <div className="max-h-[min(50vh,22rem)] overflow-auto rounded-xl bg-black/40 p-3 font-mono text-[12px] sm:text-[13px]">
            <JsonTree value={safe} />
          </div>
        </div>
      ) : null}
    </div>
  )
}
