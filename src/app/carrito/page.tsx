import { Suspense } from "react";
import type { Metadata } from "next";
import Checkout from "@/components/tienda/Checkout";

export const metadata: Metadata = {
  title: "Finalizar compra",
  robots: { index: false, follow: false },
};

export default function CarritoPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-[var(--text-muted)]">Cargando tu carrito…</div>}>
      <Checkout />
    </Suspense>
  );
}
