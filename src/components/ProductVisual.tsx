import { Package } from "lucide-react";
import { ILLUSTRATIONS } from "./illustrations";

export default function ProductVisual({
  icon,
  className = "",
  iconClassName = "",
  iconColor = "text-white",
}: {
  icon: string;
  className?: string;
  iconClassName?: string;
  iconColor?: string;
}) {
  const Illustration = ILLUSTRATIONS[icon];

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-2xl ${className}`}
      style={{
        background:
          "linear-gradient(155deg, color-mix(in srgb, var(--green-primary) 88%, white) 0%, var(--green-primary) 55%, color-mix(in srgb, var(--green-primary) 82%, black) 100%)",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 16%, color-mix(in srgb, var(--green-primary) 40%, white) 0%, transparent 45%)",
        }}
      />
      {Illustration ? (
        <Illustration className={`relative ${iconClassName}`} />
      ) : (
        <Package className={`relative ${iconColor} ${iconClassName}`} strokeWidth={1.5} />
      )}
    </div>
  );
}
