"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart, Zap } from "lucide-react";
import { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-context";

export default function ProductDetailActions({ product }: { product: Product }) {
  const { addItem, openCart } = useCart();
  const [qty, setQty] = useState(1);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold">Cantidad</span>
        <div className="flex items-center gap-1 border border-[var(--gray)] rounded-full px-1.5 py-1">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-[var(--green-primary)]/10 hover:text-[var(--green-primary)] transition-colors"
            aria-label="Restar cantidad"
          >
            <Minus size={15} />
          </button>
          <span className="w-6 text-center font-semibold tabular-nums">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
            className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-[var(--green-primary)]/10 hover:text-[var(--green-primary)] transition-colors"
            aria-label="Sumar cantidad"
          >
            <Plus size={15} />
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => addItem(product, qty)}
          disabled={product.stock === 0}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border-2 border-[var(--green-primary)] text-[var(--green-primary)] text-sm font-bold py-3.5 hover:bg-[var(--green-primary)] hover:text-white hover:-translate-y-0.5 disabled:opacity-40 disabled:translate-y-0 transition-all"
        >
          <ShoppingCart size={17} /> Agregar al carrito
        </button>
        <button
          onClick={() => {
            addItem(product, qty);
            openCart();
          }}
          disabled={product.stock === 0}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--green-primary)] text-white text-sm font-bold py-3.5 shadow-[0_10px_24px_-12px_rgba(6,59,24,0.5)] hover:bg-[var(--green-primary-hover)] hover:-translate-y-0.5 hover:shadow-[0_14px_28px_-12px_rgba(6,59,24,0.55)] disabled:opacity-40 disabled:translate-y-0 disabled:shadow-none transition-all"
        >
          <Zap size={17} /> Comprar ahora
        </button>
      </div>
    </div>
  );
}
