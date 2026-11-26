import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import EventCalculator from "@/components/EventCalculator";
import RubroSelector from "@/components/RubroSelector";

export const metadata: Metadata = {
  title: "Herramientas",
  description:
    "Calculá cuánto necesitás para tu evento y encontrá el pack armado para tu rubro.",
  alternates: {
    canonical: "/herramientas",
  },
};

export default function HerramientasPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="text-center mb-10">
        <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--green-primary)]">
          Herramientas
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold mt-3 tracking-tight text-balance text-[var(--text)]">
          Te ayudamos a elegir
        </h1>
        <p className="mt-3 text-[var(--text-muted)] max-w-xl mx-auto">
          Dos formas rápidas de armar tu pedido: calculá cantidades para un evento o
          pedí un pack armado para tu rubro.
        </p>
      </div>

      <div id="calculadora" className="scroll-mt-24">
        <EventCalculator />
      </div>

      <div id="tu-rubro" className="scroll-mt-24 mt-8">
        <RubroSelector />
      </div>

      <div className="mt-10 flex items-center justify-center gap-2 text-sm text-[var(--text-muted)]">
        <BookOpen size={16} className="text-[var(--green-primary)]" />
        <span>
          ¿Querés saber más sobre envases y descartables?{" "}
          <Link href="/guias" className="font-semibold text-[var(--green-primary)] hover:underline">
            Mirá nuestras guías
          </Link>
        </span>
      </div>
    </div>
  );
}
