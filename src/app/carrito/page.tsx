"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useCheckout } from "@/components/CheckoutForm";
import ProductVisual from "@/components/ProductVisual";
import ProductImage from "@/components/ProductImage";

export default function CartPage() {
  const { items, removeItem, setQuantity, subtotal } = useCart();
  const { openCheckout } = useCheckout();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center flex flex-col items-center">
        <ProductVisual icon="Package" className="h-24 w-24" iconClassName="h-10 w-10" />
        <h1 className="font-display text-2xl font-bold mt-6">Tu carrito está vacío</h1>
        <p className="text-[var(--text-muted)] mt-2">
          Explorá el catálogo y encontrá lo que necesitás para tu hogar, comercio o evento.
        </p>
        <Link
          href="/productos"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--green-primary)] text-white text-sm font-semibold px-6 py-3.5 hover:bg-[var(--green-primary-hover)] transition-colors"
        >
          Ver productos <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text)] flex items-center gap-2.5">
        <ShoppingBag size={26} /> Tu carrito
      </h1>

      <div className="mt-8 grid lg:grid-cols-[1fr_320px] gap-10">
        <div className="flex flex-col divide-y divide-[var(--gray)]">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="flex gap-4 py-5">
              <Link href={`/productos/${product.slug}`}>
                <ProductImage
                  product={product}
                  className="h-24 w-24 shrink-0"
                  iconClassName="h-10 w-10"
                  sizes="96px"
                />
              </Link>
              <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                <div>
                  <Link href={`/productos/${product.slug}`} className="font-semibold text-sm hover:text-[var(--green-primary)]">
                    {product.name}
                  </Link>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{product.unit}</p>
                  <p className="text-sm font-bold mt-1.5 tabular-nums">
                    ${product.price.toLocaleString("es-AR")}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 border border-[var(--gray)] rounded-full px-1.5 py-1">
                    <button
                      onClick={() => setQuantity(product.id, quantity - 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-[var(--green-primary)]/10 hover:text-[var(--green-primary)] transition-colors"
                      aria-label="Restar"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-5 text-center font-medium text-sm tabular-nums">{quantity}</span>
                    <button
                      onClick={() => setQuantity(product.id, quantity + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-[var(--green-primary)]/10 hover:text-[var(--green-primary)] transition-colors"
                      aria-label="Sumar"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="font-bold text-sm w-20 text-right tabular-nums">
                    ${(product.price * quantity).toLocaleString("es-AR")}
                  </span>
                  <button
                    onClick={() => removeItem(product.id)}
                    className="text-[var(--text-muted)] hover:text-red-500 transition-colors"
                    aria-label="Eliminar"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-2xl border border-[var(--gray)] p-6 flex flex-col gap-4">
          <h2 className="font-display font-bold text-lg">Resumen</h2>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--text-muted)]">Subtotal</span>
            <span className="font-semibold tabular-nums">${subtotal.toLocaleString("es-AR")}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--text-muted)]">Envío</span>
            <span className="font-semibold">A calcular</span>
          </div>
          <div className="flex items-center justify-between text-base font-bold pt-3 border-t border-dashed border-[var(--gray)]">
            <span>Total</span>
            <span className="tabular-nums">${subtotal.toLocaleString("es-AR")}</span>
          </div>
          <button
            onClick={openCheckout}
            className="mt-2 rounded-full bg-[var(--green-primary)] text-white text-sm font-bold py-3.5 shadow-[0_10px_24px_-12px_rgba(6,59,24,0.5)] hover:bg-[var(--green-primary-hover)] hover:-translate-y-0.5 hover:shadow-[0_14px_28px_-12px_rgba(6,59,24,0.55)] transition-all"
          >
            Finalizar pedido
          </button>
          <Link
            href="/productos"
            className="text-center text-sm font-semibold text-[var(--green-primary)] hover:underline"
          >
            Continuar comprando
          </Link>
        </div>
      </div>
    </div>
  );
}
