import ScrollReveal from "./ScrollReveal"

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className = "",
}) {
  const alignment =
    align === "left"
      ? "items-start text-left"
      : "items-center text-center mx-auto max-w-3xl"

  return (
    <ScrollReveal className={`flex flex-col gap-4 ${alignment} ${className}`}>
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-300/80">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          {description}
        </p>
      ) : null}
    </ScrollReveal>
  )
}
