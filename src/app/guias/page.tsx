import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { GUIAS } from "@/lib/guias-content";

export const metadata: Metadata = {
  title: "Guías",
  description: "Guías prácticas sobre envases, descartables y cómo elegirlos según el uso.",
  alternates: {
    canonical: "/guias",
  },
};

export default function GuiasPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="text-center mb-10">
        <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--green-primary)]">
          Guías
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold mt-3 tracking-tight text-balance text-[var(--text)]">
          Guías para elegir mejor
        </h1>
        <p className="mt-3 text-[var(--text-muted)] max-w-xl mx-auto">
          Notas prácticas para ayudarte a elegir envases y descartables según el uso que
          les vayas a dar.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {GUIAS.map((guia) => (
          <Link
            key={guia.slug}
            href={`/guias/${guia.slug}`}
            className="group rounded-2xl border border-[var(--gray)] bg-[var(--white)] p-6 transition-all duration-300 hover:border-transparent hover:shadow-[0_16px_34px_-14px_rgba(6,59,24,0.3)] hover:-translate-y-1"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-lg font-bold text-[var(--text)] group-hover:text-[var(--green-primary)] transition-colors">
                  {guia.title}
                </h2>
                <p className="mt-2 text-sm text-[var(--text-muted)] leading-relaxed">
                  {guia.excerpt}
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                  <Clock size={13} />
                  {guia.readTime} de lectura
                </div>
              </div>
              <ArrowRight
                size={18}
                className="shrink-0 mt-1 text-[var(--green-primary)] group-hover:translate-x-1 transition-transform"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
