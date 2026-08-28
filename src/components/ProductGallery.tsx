"use client";

import { useState } from "react";
import Image from "next/image";
import type { Product } from "@/lib/types";
import ProductVisual from "./ProductVisual";

const BLUR =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

export default function ProductGallery({ product }: { product: Product }) {
  const images = product.images ?? [];
  const slides = images.length > 0 ? images : [{ url: "", alt: undefined }];
  const [selected, setSelected] = useState(0);
  const current = slides[Math.min(selected, slides.length - 1)];

  return (
    <div>
      {current.url ? (
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
          <Image
            src={current.url}
            alt={current.alt ?? product.name}
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            placeholder="blur"
            blurDataURL={BLUR}
            className="object-cover"
          />
        </div>
      ) : (
        <ProductVisual icon={product.icon} className="aspect-square w-full" iconClassName="h-32 w-32" />
      )}

      {slides.length > 1 && (
        <div className="grid grid-cols-4 gap-3 mt-3">
          {slides.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              aria-label={`Ver imagen ${i + 1}`}
              className={`relative aspect-square overflow-hidden rounded-xl border-2 transition-colors ${
                i === selected ? "border-[var(--green-primary)]" : "border-transparent"
              }`}
            >
              {img.url ? (
                <Image
                  src={img.url}
                  alt={img.alt ?? `${product.name} ${i + 1}`}
                  fill
                  sizes="25vw"
                  className="object-cover"
                />
              ) : (
                <ProductVisual icon={product.icon} className="h-full w-full" iconClassName="h-8 w-8" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}