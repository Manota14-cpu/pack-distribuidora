import Link from "next/link";
import Image from "next/image";

export default function Logo({
  compact = false,
  className = "",
}: {
  compact?: boolean;
  className?: string;
}) {
  const size = compact ? "h-20 w-20" : "h-24 w-24";

  return (
    <Link href="/" className={`flex items-center shrink-0 ${className}`} aria-label="PACK Distribuidora — inicio">
      <Image
        src="/logos/pack.png"
        alt=""
        width={96}
        height={96}
        priority
        className={`shrink-0 ${size}`}
      />
    </Link>
  );
}