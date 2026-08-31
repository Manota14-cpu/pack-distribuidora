"use client";

import Link from "next/link";
import { ShoppingCart, Star } from "lucide-react";
import { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-context";
import ProductImage from "./ProductImage";

export default function ProductCard({ product, onGreen = false }: { product: Product; onGreen?: boolean }) {
  const { addItem } = useCart();
  const lowStock = product.stock > 0 && product.stock < 50;

  return (
    <div
      className={`group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 ${
        onGreen
          ? "bg-white border border-white/30 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.35)] hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.5)]"
          : "bg-[var(--white)] border border-[var(--gray)] hover:shadow-[0_12px_30px_-12px_rgba(6,59,24,0.25)] hover:-translate-y-1"
      }`}
    >
      {(product.discount || product.isNew || product.bestSeller) && (
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
          {product.discount && (
            <span className="rounded-full bg-[var(--green-deep)] text-white text-[11px] font-bold px-2.5 py-1">
              -{product.discount}%
            </span>
          )}
          {product.bestSeller && (
            <span className="rounded-full bg-[var(--green-primary)] text-white text-[11px] font-bold px-2.5 py-1">
              Más vendido
            </span>
          )}
          {product.isNew && (
            <span className="rounded-full bg-white text-[var(--green-primary)] text-[11px] font-bold px-2.5 py-1">
              Nuevo
            </span>
          )}
        </div>
      )}

      <Link href={`/productos/${product.slug}`} className="block p-4">
        <ProductImage
          product={product}
          className="aspect-square w-full transition-transform duration-300 group-hover:scale-[1.03]"
          iconClassName="h-14 w-14"
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        />
      </Link>

      <div className="flex flex-col flex-1 px-4 pb-4 gap-1.5">
        <Link href={`/productos/${product.slug}`}>
          <h3 className="text-sm font-semibold leading-snug line-clamp-2 hover:text-[var(--green-primary)] transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-[var(--text-muted)]">{product.unit}</p>

        <div className="flex items-center gap-1 text-[var(--green-primary)]">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={11}
              fill={i < Math.round(product.rating) ? "currentColor" : "none"}
              strokeWidth={1.5}
            />
          ))}
          <span className="text-[11px] text-[var(--text-muted)] ml-1">
            ({product.rating.toFixed(1)})
          </span>
        </div>

        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-lg font-bold font-display">
            ${product.price.toLocaleString("es-AR")}
          </span>
          {product.oldPrice && (
            <span className="text-xs text-[var(--text-muted)] line-through">
              ${product.oldPrice.toLocaleString("es-AR")}
            </span>
          )}
        </div>

        <p
          className={`text-[11px] font-medium ${
            product.stock === 0
              ? "text-red-500"
              : lowStock
              ? "text-amber-600"
              : "text-[var(--green-primary)]"
          }`}
        >
          {product.stock === 0
            ? "Sin stock"
            : lowStock
            ? `Últimas unidades (${product.stock})`
            : "En stock"}
        </p>

        <button
          onClick={() => addItem(product)}
          disabled={product.stock === 0}
          className="mt-2 flex items-center justify-center gap-2 rounded-full bg-[var(--green-primary)] text-white text-sm font-semibold py-2.5 opacity-90 group-hover:opacity-100 hover:bg-[var(--green-primary-hover)] disabled:bg-[var(--gray)] disabled:text-[var(--text-muted)] transition-colors"
        >
          <ShoppingCart size={15} />
          Agregar
        </button>
      </div>
    </div>
  );
}
