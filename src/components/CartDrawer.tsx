"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X, Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useFocusTrap } from "@/lib/use-focus-trap";
import { useCheckout } from "@/components/CheckoutForm";
import ProductVisual from "./ProductVisual";
import ProductImage from "./ProductImage";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, setQuantity, subtotal } = useCart();
  const { openCheckout } = useCheckout();
  const trapRef = useFocusTrap(isOpen);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Carrito de compras">
      <div className="absolute inset-0 bg-black/40" onClick={closeCart} />
      <div ref={trapRef} className="absolute right-0 top-0 h-full w-full max-w-md bg-[var(--white)] flex flex-col animate-fade-up">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--gray)]">
          <h2 className="font-display text-lg font-bold flex items-center gap-2">
            <ShoppingCart size={20} /> Tu carrito
          </h2>
          <button onClick={closeCart} aria-label="Cerrar carrito">
            <X size={22} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center">
            <ProductVisual icon="Package" className="h-20 w-20" iconClassName="h-9 w-9" />
            <p className="font-medium">Tu carrito está vacío</p>
            <p className="text-sm text-[var(--text-muted)]">
              Sumá productos y los vas a ver reflejados acá.
            </p>
            <Link
              href="/productos"
              onClick={closeCart}
              className="mt-2 rounded-full bg-[var(--green-primary)] text-white text-sm font-semibold px-5 py-2.5 hover:bg-[var(--green-primary-hover)] transition-colors"
            >
              Ver productos
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-3">
                  <ProductImage
                    product={product}
                    className="h-16 w-16 shrink-0"
                    iconClassName="h-7 w-7"
                    sizes="64px"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{product.name}</p>
                    <p className="text-xs text-[var(--text-muted)] mb-2">{product.unit}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 border border-[var(--gray)] rounded-full px-1">
                        <button
                          onClick={() => setQuantity(product.id, quantity - 1)}
                          className="p-1 hover:text-[var(--green-primary)]"
                          aria-label="Restar"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-sm font-medium w-4 text-center">{quantity}</span>
                        <button
                          onClick={() => setQuantity(product.id, quantity + 1)}
                          className="p-1 hover:text-[var(--green-primary)]"
                          aria-label="Sumar"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="text-sm font-bold">
                        ${(product.price * quantity).toLocaleString("es-AR")}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(product.id)}
                    className="self-start text-[var(--text-muted)] hover:text-red-500 transition-colors"
                    aria-label="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-[var(--gray)] px-5 py-4 flex flex-col gap-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-muted)]">Subtotal</span>
                <span className="font-semibold">${subtotal.toLocaleString("es-AR")}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-muted)]">Envío</span>
                <span className="font-semibold">A calcular</span>
              </div>
              <div className="flex items-center justify-between text-base font-bold pt-1 border-t border-dashed border-[var(--gray)]">
                <span>Total</span>
                <span>${subtotal.toLocaleString("es-AR")}</span>
              </div>
              <Link
                href="/carrito"
                onClick={closeCart}
                className="mt-1 text-center rounded-full border border-[var(--green-primary)] text-[var(--green-primary)] text-sm font-semibold py-2.5 hover:bg-[var(--green-primary)] hover:text-white transition-colors"
              >
                Ver carrito
              </Link>
              <button
                onClick={() => { closeCart(); openCheckout(); }}
                className="rounded-full bg-[var(--green-primary)] text-white text-sm font-semibold py-3 hover:bg-[var(--green-primary-hover)] transition-colors"
              >
                Finalizar pedido
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
