const controlClassName =
  "mt-2 min-h-11 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-base text-white outline-none transition placeholder:text-white/30 focus:border-indigo-400/50 sm:text-sm"

export function FormField({
  label,
  name,
  type = "text",
  placeholder,
  optional = false,
  className = "",
  ...props
}) {
  return (
    <label className={`block text-sm text-white/80 ${className}`}>
      <span className="flex items-baseline gap-2">
        <span>{label}</span>
        {optional ? (
          <span className="text-xs text-white/35">Optional</span>
        ) : null}
      </span>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        className={controlClassName}
        {...props}
      />
    </label>
  )
}

export function FormTextarea({
  label,
  name,
  placeholder,
  rows = 4,
  optional = false,
  className = "",
  ...props
}) {
  return (
    <label className={`block text-sm text-white/80 ${className}`}>
      <span className="flex items-baseline gap-2">
        <span>{label}</span>
        {optional ? (
          <span className="text-xs text-white/35">Optional</span>
        ) : null}
      </span>
      <textarea
        name={name}
        rows={rows}
        placeholder={placeholder}
        className={`${controlClassName} resize-none`}
        {...props}
      />
    </label>
  )
}

export function FormSection({ title, description, children, className = "" }) {
  return (
    <fieldset className={`space-y-4 ${className}`}>
      <legend className="mb-1 block w-full">
        <span className="text-sm font-medium text-white">{title}</span>
        {description ? (
          <span className="mt-1 block text-xs leading-relaxed text-muted">
            {description}
          </span>
        ) : null}
      </legend>
      {children}
    </fieldset>
  )
}

export function FormOptionGroup({
  label,
  name,
  options,
  columns = 2,
  value,
  onChange,
  required = false,
  error,
}) {
  const gridClass =
    columns === 4
      ? "grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4"
      : "grid grid-cols-1 gap-2 sm:grid-cols-2"

  const normalizedOptions = options.map((option) =>
    typeof option === "string" ? { value: option, label: option } : option,
  )
  const isControlled = value !== undefined

  return (
    <fieldset>
      <legend className="mb-3 block text-sm text-white/80">{label}</legend>
      <div className={gridClass}>
        {normalizedOptions.map((option, index) => (
          <label
            key={option.value}
            className={`group flex min-h-11 cursor-pointer items-center gap-3 rounded-2xl border bg-white/[0.03] px-4 py-3 text-sm text-white/80 transition hover:border-white/15 has-[:checked]:border-indigo-400/40 has-[:checked]:bg-indigo-500/10 has-[:checked]:text-white ${
              error ? "border-rose-400/40" : "border-white/10"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={isControlled ? value === option.value : undefined}
              onChange={
                isControlled ? () => onChange(option.value) : undefined
              }
              required={required && index === 0}
              className="h-4 w-4 border-white/20 bg-black/30 text-indigo-400 focus:ring-indigo-400/40"
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      {error ? (
        <p className="mt-2 text-sm text-rose-300/90" role="alert">
          {error}
        </p>
      ) : null}
    </fieldset>
  )
}
