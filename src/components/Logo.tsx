import Link from "next/link";
import Image from "next/image";

export default function Logo({
  compact = false,
  className = "",
}: {
  compact?: boolean;
  className?: string;
}) {
  const heightClass = compact ? "h-11" : "h-14";

  return (
    <Link
      href="/"
      className={`flex items-center shrink-0 ${heightClass} ${className}`}
      aria-label="PACK Distribuidora — inicio"
    >
      <Image
        src="/logos/pack-wordmark.png"
        alt=""
        width={1350}
        height={690}
        priority
        className="h-full w-auto object-contain"
      />
    </Link>
  );
}
