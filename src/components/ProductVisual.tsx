import { Package } from "lucide-react";
import { ILLUSTRATIONS } from "./illustrations";

/**
 * Ilustración de categoría.
 * - "verde": blanco sobre el verde de marca (secciones institucionales).
 * - "suave": verde sobre verde muy claro. Es la que usan los productos sin
 *   foto: una grilla entera de cuadrados verde fuerte se veía como una pared.
 */
export default function ProductVisual({
  icon,
  className = "",
  iconClassName = "",
  variante = "verde",
}: {
  icon: string;
  className?: string;
  iconClassName?: string;
  variante?: "verde" | "suave";
}) {
  const Illustration = ILLUSTRATIONS[icon];
  const suave = variante === "suave";

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-2xl ${className}`}
      style={
        suave
          ? ({
              background: "linear-gradient(160deg, #f4f8f5 0%, var(--green-soft) 100%)",
              "--ilus-fg": "color-mix(in srgb, var(--green-primary) 70%, white)",
              "--ilus-bg": "var(--green-soft)",
            } as React.CSSProperties)
          : {
              background:
                "linear-gradient(155deg, color-mix(in srgb, var(--green-primary) 88%, white) 0%, var(--green-primary) 55%, color-mix(in srgb, var(--green-primary) 82%, black) 100%)",
            }
      }
    >
      {!suave && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 18% 16%, color-mix(in srgb, var(--green-primary) 40%, white) 0%, transparent 45%)",
          }}
        />
      )}
      {Illustration ? (
        <Illustration className={`relative ${iconClassName}`} />
      ) : (
        <Package
          className={`relative ${suave ? "text-[var(--green-primary)]/60" : "text-white"} ${iconClassName}`}
          strokeWidth={1.5}
        />
      )}
    </div>
  );
}
