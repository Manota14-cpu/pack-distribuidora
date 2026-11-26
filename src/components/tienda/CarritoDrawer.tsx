"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ShoppingCart, Trash2, X } from "lucide-react";
import { importe, plata } from "@/lib/catalogo";
import { useCarrito } from "@/lib/carrito";
import { useFocusTrap } from "@/lib/use-focus-trap";
import ProductoImagen from "./ProductoImagen";
import CantidadControl from "./CantidadControl";

export default function CarritoDrawer() {
  const { renglones, abierto, cerrar, setCantidad, quitar, subtotal } = useCarrito();
  const trapRef = useFocusTrap(abierto);

  useEffect(() => {
    if (!abierto) return;
    document.body.style.overflow = "hidden";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && cerrar();
    document.addEventListener("keydown", esc);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", esc);
    };
  }, [abierto, cerrar]);

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Carrito de compras">
      <div className="absolute inset-0 bg-black/40" onClick={cerrar} />
      <div
        ref={trapRef}
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-[var(--white)] shadow-2xl animate-fade-up"
      >
        <div className="flex items-center justify-between border-b border-[var(--gray)] px-5 py-4">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold">
            <ShoppingCart size={20} /> Tu carrito
            {renglones.length > 0 && (
              <span className="text-sm font-medium text-[var(--text-muted)]">({renglones.length})</span>
            )}
          </h2>
          <button onClick={cerrar} aria-label="Cerrar carrito" className="rounded-full p-1 hover:bg-[var(--gray-light)]">
            <X size={22} />
          </button>
        </div>

        {renglones.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingCart size={40} className="text-[var(--gray)]" />
            <p className="font-semibold">Tu carrito está vacío</p>
            <p className="text-sm text-[var(--text-muted)]">Sumá productos y los vas a ver acá.</p>
            <Link
              href="/productos"
              onClick={cerrar}
              className="mt-2 rounded-full bg-[var(--green-primary)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--green-primary-hover)]"
            >
              Ver productos
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex flex-1 flex-col divide-y divide-[var(--gray)] overflow-y-auto px-5">
              {renglones.map(({ producto, cantidad }) => (
                <li key={producto.id} className="flex gap-3 py-4">
                  <Link href={`/productos/${producto.slug}`} onClick={cerrar} className="shrink-0">
                    <ProductoImagen
                      src={producto.imagen}
                      nombre={producto.nombre}
                      categoria={producto.categoria}
                      className="h-20 w-20 border border-[var(--gray)]"
                      iconClassName="h-8 w-8"
                      sizes="80px"
                    />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/productos/${producto.slug}`}
                        onClick={cerrar}
                        className="line-clamp-2 text-sm font-semibold leading-snug hover:text-[var(--green-primary)]"
                      >
                        {producto.nombre}
                      </Link>
                      <button
                        onClick={() => quitar(producto.id)}
                        aria-label={`Quitar ${producto.nombre}`}
                        className="shrink-0 rounded-full p-1 text-[var(--text-muted)] hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <CantidadControl
                        producto={producto}
                        cantidad={cantidad}
                        onChange={(c) => setCantidad(producto.id, c)}
                        size="sm"
                      />
                      <span className="font-bold tabular-nums">{plata(importe(producto, cantidad))}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-3 border-t border-[var(--gray)] px-5 py-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-muted)]">Subtotal</span>
                <span className="font-display text-2xl font-bold tabular-nums">{plata(subtotal)}</span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">El envío se coordina según el destino. Retiro en el local sin cargo.</p>
              <Link
                href="/carrito"
                onClick={cerrar}
                className="flex items-center justify-center gap-2 rounded-full bg-[var(--green-primary)] py-3.5 text-sm font-bold text-white hover:bg-[var(--green-primary-hover)]"
              >
                Finalizar compra <ArrowRight size={16} />
              </Link>
              <button onClick={cerrar} className="text-sm font-semibold text-[var(--green-primary)] hover:underline">
                Seguir comprando
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
