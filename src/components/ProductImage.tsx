import Image from "next/image";
import type { Product } from "@/lib/types";
import ProductVisual from "./ProductVisual";

const BLUR =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

export default function ProductImage({
  product,
  className = "",
  iconClassName = "",
  priority = false,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw",
}: {
  product: Product;
  className?: string;
  iconClassName?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const first = product.images?.[0];
  if (!first) {
    return <ProductVisual icon={product.icon} className={className} iconClassName={iconClassName} />;
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      <Image
        src={first.url}
        alt={first.alt ?? product.name}
        fill
        sizes={sizes}
        priority={priority}
        placeholder="blur"
        blurDataURL={BLUR}
        className="object-cover"
      />
    </div>
  );
}