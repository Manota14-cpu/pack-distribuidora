export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  light = false,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
}) {
  return (
    <div className={align === "center" ? "text-center mx-auto max-w-2xl" : ""}>
      {eyebrow && (
        <span
          className={`text-xs font-bold uppercase tracking-[0.14em] ${
            light ? "text-white/80" : "text-[var(--green-primary)]"
          }`}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={`font-display text-2xl sm:text-3xl font-bold mt-2 ${
          light ? "text-white" : "text-[var(--text)]"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-2 text-sm sm:text-base ${light ? "text-white/70" : "text-[var(--text-muted)]"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
