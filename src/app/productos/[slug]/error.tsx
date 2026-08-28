"use client";

import Link from "next/link";

export default function ProductDetailError({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 mx-auto mb-6">
        <span className="text-2xl">!</span>
      </div>
      <h1 className="font-display text-2xl font-bold text-[var(--text)]">
        Producto no disponible
      </h1>
      <p className="mt-2 text-[var(--text-muted)] max-w-md mx-auto">
        No pudimos cargar los detalles de este producto. Intentá de nuevo o explorá otros productos.
      </p>
      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          onClick={reset}
          className="rounded-full bg-[var(--green-primary)] text-white text-sm font-semibold px-6 py-3 hover:bg-[var(--green-primary-hover)] transition-colors"
        >
          Reintentar
        </button>
        <Link
          href="/productos"
          className="rounded-full border border-[var(--green-primary)] text-[var(--green-primary)] text-sm font-semibold px-6 py-3 hover:bg-[var(--green-primary)] hover:text-white transition-colors"
        >
          Ver productos
        </Link>
      </div>
    </div>
  );
}
