import Link from "next/link";
import Image from "next/image";

export default function Logo({
  compact = false,
  className = "",
}: {
  compact?: boolean;
  className?: string;
}) {
  const size = compact ? "h-14 w-14" : "h-16 w-16";

  return (
    <Link href="/" className={`flex items-center shrink-0 ${className}`} aria-label="PACK Distribuidora — inicio">
      <Image
        src="/logos/LOGOPACKDISTRIBUIDORA.png"
        alt=""
        width={64}
        height={64}
        priority
        className={`shrink-0 ${size}`}
      />
    </Link>
  );
}