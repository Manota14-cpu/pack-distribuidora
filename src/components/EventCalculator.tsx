"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Calculator, ShoppingBag, MessageCircle, Minus, Plus } from "lucide-react";
import { STORE_INFO } from "@/lib/content";
import {
  EVENT_RATIOS,
  EVENT_CATEGORY_LABELS,
  buildCalculatorLines,
  calculatorWhatsAppText,
  type EventCategory,
} from "@/lib/calculator-utils";

export default function EventCalculator() {
  const [personas, setPersonas] = useState(20);
  const [active, setActive] = useState<Set<EventCategory>>(
    new Set(Object.keys(EVENT_RATIOS) as EventCategory[])
  );

  const lines = useMemo(() => buildCalculatorLines(personas, active), [personas, active]);

  function toggleCategory(cat: EventCategory) {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  return (
    <div className="rounded-3xl border border-[var(--gray)] bg-[var(--white)] p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--green-primary)]">
          <Calculator size={20} className="text-white" />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold text-[var(--text)]">
            ¿Cuánto necesito para mi evento?
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            Poné la cantidad de personas y te decimos cuánto necesitás.
          </p>
        </div>
      </div>

      {/* Cantidad de personas */}
      <div className="mt-6">
        <label htmlFor="personas" className="block text-sm font-semibold mb-2">
          Cantidad de personas
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPersonas((p) => Math.max(1, p - 5))}
            aria-label="Restar 5 personas"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--gray)] hover:border-[var(--green-primary)] transition-colors"
          >
            <Minus size={16} />
          </button>
          <input
            id="personas"
            type="number"
            min={1}
            value={personas}
            onChange={(e) => setPersonas(Math.max(1, Number(e.target.value) || 1))}
            className="w-24 rounded-xl border border-[var(--gray)] bg-[var(--gray-light)] px-3 py-2.5 text-center text-lg font-bold tabular-nums outline-none focus:border-[var(--green-primary)]"
          />
          <button
            type="button"
            onClick={() => setPersonas((p) => p + 5)}
            aria-label="Sumar 5 personas"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--gray)] hover:border-[var(--green-primary)] transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Categorías a incluir */}
      <div className="mt-5 flex flex-wrap gap-2">
        {(Object.keys(EVENT_RATIOS) as EventCategory[]).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => toggleCategory(cat)}
            aria-pressed={active.has(cat)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
              active.has(cat)
                ? "border-[var(--green-primary)] bg-[var(--green-primary)] text-white"
                : "border-[var(--gray)] text-[var(--text-muted)] hover:border-[var(--green-primary)]/40"
            }`}
          >
            {EVENT_CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Resultado */}
      {lines.length === 0 ? (
        <p className="mt-6 text-sm text-[var(--text-muted)]">
          Elegí al menos una categoría para ver la sugerencia.
        </p>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {lines.map((line) => (
              <Link
                key={line.category}
                href={`/productos?categoria=${line.category}`}
                className="rounded-xl bg-[var(--gray-light)] px-4 py-3 transition-colors hover:bg-[var(--green-primary)]/10"
              >
                <p className="text-xs text-[var(--text-muted)]">{EVENT_CATEGORY_LABELS[line.category]}</p>
                <p className="font-display text-2xl font-bold tabular-nums">{line.units}</p>
                <p className="text-xs font-semibold text-[var(--green-primary)]">Ver opciones →</p>
              </Link>
            ))}
          </div>

          <div className="tear-strip my-5" />

          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href="/productos"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--green-primary)] text-white text-sm font-bold px-6 py-3.5 hover:bg-[var(--green-primary-hover)] hover:-translate-y-0.5 transition-all"
            >
              <ShoppingBag size={16} />
              Elegir los productos
            </Link>
            <a
              href={`${STORE_INFO.whatsapp}?text=${encodeURIComponent(calculatorWhatsAppText(personas, lines))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--green-primary)] text-[var(--green-primary)] text-sm font-bold px-6 py-3.5 hover:bg-[var(--green-primary)]/5 transition-colors"
            >
              <MessageCircle size={16} />
              Pedir que me lo armen
            </a>
          </div>
          <p className="mt-3 text-xs text-[var(--text-muted)]">
            Cálculo orientativo (2 vasos, 1 plato, 1 set de cubiertos y 3 servilletas por
            persona). En la tienda elegís la presentación que más te convenga.
          </p>
        </>
      )}
    </div>
  );
}
