import type { Metadata } from "next";
import ArrepentimientoForm from "@/components/tienda/ArrepentimientoForm";

export const metadata: Metadata = {
  title: "Botón de arrepentimiento",
  description: "Revocá una compra hecha en la tienda online dentro de los 10 días corridos, sin costo.",
  alternates: { canonical: "/arrepentimiento" },
};

export default function ArrepentimientoPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--green-primary)]">Tus derechos</span>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">Botón de arrepentimiento</h1>
      <p className="mt-3 text-[var(--text-muted)]">
        Podés revocar una compra hecha en nuestra tienda online dentro de los 10 días corridos desde que la
        recibiste o retiraste, sin dar motivos y sin costo (Ley 24.240, art. 34, y Resolución 424/2020). Completá el
        formulario: te damos un código como constancia y te contactamos para coordinar la devolución.
      </p>
      <div className="mt-8 rounded-2xl border border-[var(--gray)] bg-white p-6">
        <ArrepentimientoForm />
      </div>
    </div>
  );
}
