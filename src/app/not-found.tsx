import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <div className="font-display text-8xl font-bold text-[var(--green-primary)] opacity-20">
        404
      </div>
      <h1 className="font-display text-2xl font-bold text-[var(--text)] -mt-4">
        Página no encontrada
      </h1>
      <p className="mt-2 text-[var(--text-muted)] max-w-md mx-auto">
        La página que buscás no existe o fue movida. Explorá nuestro catálogo de productos descartables.
      </p>
      <div className="mt-6 flex items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-[var(--green-primary)] text-white text-sm font-semibold px-6 py-3 hover:bg-[var(--green-primary-hover)] transition-colors"
        >
          Volver al inicio
        </Link>
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
