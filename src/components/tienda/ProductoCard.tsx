"use client";

import Link from "next/link";
import { ExternalLink, ShoppingCart, Check } from "lucide-react";
import { categoriaPorSlug, plata, precioPor, type Producto } from "@/lib/catalogo";
import { useCarrito } from "@/lib/carrito";
import ProductoImagen from "./ProductoImagen";
import CantidadControl from "./CantidadControl";
import StockEtiqueta from "./StockEtiqueta";

export default function ProductoCard({ producto, priority = false }: { producto: Producto; priority?: boolean }) {
  const { agregar, cantidadDe, setCantidad } = useCarrito();
  const enCarrito = cantidadDe(producto.id);
  const href = `/productos/${producto.slug}`;
  const sinStock = !producto.disponible || producto.stock === 0;

  return (
    <article className="group relative flex flex-col rounded-2xl border border-[var(--gray)] bg-[var(--white)] transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-[0_16px_34px_-14px_rgba(6,59,24,0.3)]">
      <Link href={href} className="block p-3 pb-0" aria-label={producto.nombre}>
        <ProductoImagen
          src={producto.imagenes[0]}
          nombre={producto.nombre}
          categoria={producto.categoria}
          priority={priority}
          className={`aspect-square w-full transition-transform duration-300 group-hover:scale-[1.02] ${sinStock ? "opacity-60" : ""}`}
        />
      </Link>

      {/* Abrir la ficha en otra pestaña, para comparar sin perder la lista. */}
      <a
        href={href}
        target="_blank"
        rel="noopener"
        title="Abrir en otra pestaña"
        aria-label={`Abrir ${producto.nombre} en otra pestaña`}
        className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[var(--text-muted)] shadow-sm opacity-100 transition-opacity hover:text-[var(--green-primary)] md:opacity-0 md:group-hover:opacity-100 focus-visible:opacity-100"
      >
        <ExternalLink size={15} />
      </a>

      <div className="flex flex-1 flex-col gap-1 p-4 pt-3">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
          {categoriaPorSlug(producto.categoria)?.nombre}
        </span>
        <Link href={href}>
          <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug transition-colors hover:text-[var(--green-primary)]">
            {producto.nombre}
          </h3>
        </Link>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="font-display text-xl font-bold tabular-nums tracking-tight">{plata(producto.precio)}</span>
          <span className="text-xs text-[var(--text-muted)]">{precioPor(producto)}</span>
        </div>
        <StockEtiqueta producto={producto} />

        <div className="mt-auto pt-3">
          {sinStock ? (
            <Link
              href={href}
              className="flex items-center justify-center rounded-full border border-[var(--gray)] py-2.5 text-sm font-semibold text-[var(--text-muted)]"
            >
              Ver producto
            </Link>
          ) : enCarrito > 0 ? (
            <div className="flex items-center justify-between gap-2">
              <CantidadControl producto={producto} cantidad={enCarrito} onChange={(c) => setCantidad(producto.id, c)} size="sm" />
              <span className="flex items-center gap-1 text-xs font-semibold text-[var(--green-primary)]">
                <Check size={14} /> En el carrito
              </span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => agregar(producto)}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--green-primary)] py-2.5 text-sm font-semibold text-white transition-all hover:bg-[var(--green-primary-hover)] hover:shadow-[0_10px_20px_-10px_rgba(6,59,24,0.6)]"
            >
              <ShoppingCart size={15} /> Agregar
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
