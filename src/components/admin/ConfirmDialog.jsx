import Button from "../ui/Button"
import GlassCard from "../ui/GlassCard"

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
  onCancel,
  onConfirm,
}) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
        disabled={loading}
      />
      <div
        className="relative z-10 w-full max-w-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <GlassCard hover={false} className="p-6 sm:p-8">
          <h2 id="confirm-dialog-title" className="text-xl font-semibold text-white">
            {title}
          </h2>
          <p
            id="confirm-dialog-description"
            className="mt-3 text-sm leading-relaxed text-muted"
          >
            {description}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={onCancel}
              disabled={loading}
            >
              {cancelLabel}
            </Button>
            <Button className="w-full sm:w-auto" onClick={onConfirm} disabled={loading}>
              {loading ? "Working…" : confirmLabel}
            </Button>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
