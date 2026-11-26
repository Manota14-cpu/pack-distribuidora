import type { Metadata } from "next";
import VisualAppTienda from "@/components/VisualAppTienda";

export const metadata: Metadata = {
  title: "Productos",
  description: "Comprá online los productos descartables de Pack Distribuidora, con precios y stock al día.",
  alternates: {
    canonical: "/productos",
  },
  openGraph: {
    type: "website",
    url: "/productos",
    title: "Productos — Pack Distribuidora",
    description: "Comprá online los productos descartables de Pack Distribuidora, con precios y stock al día.",
  },
  twitter: {
    title: "Productos — Pack Distribuidora",
    description: "Comprá online los productos descartables de Pack Distribuidora, con precios y stock al día.",
  },
};

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-10">
      <div className="mb-6">
        <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--green-primary)]">
          Tienda online
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold mt-2 tracking-tight text-[var(--text)]">
          Productos
        </h1>
        <p className="mt-2 text-[var(--text-muted)] max-w-2xl">
          Elegí lo que necesitás, armá tu pedido y pagalo con Mercado Pago o al retirar. Los precios y el
          stock están siempre al día.
        </p>
      </div>
      <VisualAppTienda />
    </div>
  );
}
