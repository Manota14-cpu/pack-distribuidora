import {
  CupSoda,
  Disc,
  Utensils,
  Package,
  ShoppingBag,
  Layers,
  StickyNote,
  ChefHat,
  PartyPopper,
  SprayCan,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  CupSoda,
  Disc,
  Utensils,
  Package,
  ShoppingBag,
  Layers,
  StickyNote,
  ChefHat,
  PartyPopper,
  SprayCan,
};

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
  const Icon = ICONS[icon] ?? Package;
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-[var(--green-primary)] ${className}`}
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, var(--green-lime) 0%, transparent 45%)",
        }}
      />
      <Icon
        className={`relative ${iconColor} ${iconClassName}`}
        strokeWidth={1.5}
      />
    </div>
  );
}
