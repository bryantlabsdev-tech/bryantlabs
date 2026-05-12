import Button from "../ui/Button"
import GlassCard from "../ui/GlassCard"

export default function AdminOps({
  errors,
  unresolvedCount,
  loading,
  error,
  resolvingErrorId,
  onResolveError,
  formatErrorTime,
}) {
  if (loading) {
    return (
      <GlassCard hover={false} className="px-6 py-16 text-center text-sm text-muted">
        Loading system errors…
      </GlassCard>
    )
  }

  if (error) {
    return (
      <p
        className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100"
        role="alert"
      >
        {error}
      </p>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <GlassCard hover={false} className="p-4 sm:p-5">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
            Unresolved errors
          </p>
          <p className="mt-2 text-2xl font-semibold text-white sm:mt-3 sm:text-3xl">
            {unresolvedCount}
          </p>
        </GlassCard>
        <GlassCard hover={false} className="p-4 sm:p-5">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
            Recent errors shown
          </p>
          <p className="mt-2 text-2xl font-semibold text-white sm:mt-3 sm:text-3xl">
            {errors.length}
          </p>
        </GlassCard>
      </div>

      <GlassCard hover={false} className="p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-white">Recent system errors</h2>
        <p className="mt-2 text-sm text-muted">
          Latest intake, email, auth, and configuration failures recorded by the API.
        </p>

        {errors.length === 0 ? (
          <p className="mt-6 text-sm text-muted">No operational errors recorded yet.</p>
        ) : (
          <ul className="mt-6 space-y-3">
            {errors.map((entry) => (
              <li
                key={entry.id}
                className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-white/75">
                        {entry.source}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs ${
                          entry.severity === "warn"
                            ? "border border-amber-400/20 bg-amber-500/10 text-amber-100"
                            : "border border-rose-400/20 bg-rose-500/10 text-rose-100"
                        }`}
                      >
                        {entry.severity}
                      </span>
                      {entry.resolved ? (
                        <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-100">
                          Resolved
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-3 text-sm text-white/90">{entry.message}</p>
                    <p className="mt-2 text-xs text-muted">
                      {formatErrorTime(entry.created_at)}
                    </p>
                  </div>

                  {!entry.resolved ? (
                    <Button
                      variant="secondary"
                      className="w-full shrink-0 px-4 py-2.5 text-xs sm:w-auto"
                      disabled={resolvingErrorId === entry.id}
                      onClick={() => onResolveError(entry.id)}
                    >
                      {resolvingErrorId === entry.id ? "Marking resolved…" : "Mark resolved"}
                    </Button>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </GlassCard>
    </div>
  )
}
