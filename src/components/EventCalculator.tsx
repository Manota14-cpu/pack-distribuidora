"use client";

import { useMemo, useState } from "react";
import { Calculator, ShoppingCart, Minus, Plus } from "lucide-react";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-context";
import {
  EVENT_RATIOS,
  EVENT_CATEGORY_LABELS,
  buildCalculatorLines,
  type CalculatorLine,
} from "@/lib/calculator-utils";

type CategoryKey = keyof typeof EVENT_RATIOS;

export default function EventCalculator({
  productByCategory,
}: {
  productByCategory: Partial<Record<CategoryKey, Product>>;
}) {
  const { addItem } = useCart();
  const [personas, setPersonas] = useState(20);
  const [active, setActive] = useState<Set<CategoryKey>>(
    new Set(Object.keys(EVENT_RATIOS) as CategoryKey[])
  );
  const [added, setAdded] = useState(false);

  const lines = useMemo(
    () => buildCalculatorLines(personas, active, productByCategory),
    [personas, active, productByCategory]
  );
  const total = lines.reduce((sum, l) => sum + l.subtotal, 0);

  function toggleCategory(cat: CategoryKey) {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
    setAdded(false);
  }

  function handleAddAll() {
    for (const line of lines) {
      addItem(line.product, line.packsToBuy);
    }
    setAdded(true);
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
            Poné la cantidad de personas y te armamos los packs sugeridos.
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
        {(Object.keys(EVENT_RATIOS) as CategoryKey[]).map((cat) => (
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
          <div className="mt-6 flex flex-col gap-3">
            {lines.map((line) => (
              <CalculatorLineRow key={line.category} line={line} />
            ))}
          </div>

          <div className="tear-strip my-5" />

          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs text-[var(--text-muted)]">Total estimado</p>
              <p className="font-display text-2xl font-bold tabular-nums">
                ${total.toLocaleString("es-AR")}
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddAll}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--green-primary)] text-white text-sm font-bold px-6 py-3.5 hover:bg-[var(--green-primary-hover)] hover:-translate-y-0.5 transition-all"
            >
              <ShoppingCart size={16} />
              Agregar todo al carrito
            </button>
          </div>
          {added && (
            <p role="status" className="mt-3 text-sm font-medium text-[var(--green-primary)]">
              ¡Listo! Agregamos los productos sugeridos a tu carrito.
            </p>
          )}
          <p className="mt-3 text-xs text-[var(--text-muted)]">
            Cálculo orientativo (2 vasos, 1 plato, 1 set de cubiertos y 3 servilletas por
            persona). Ajustá las cantidades desde el carrito si lo necesitás.
          </p>
        </>
      )}
    </div>
  );
}

function CalculatorLineRow({ line }: { line: CalculatorLine }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-[var(--gray-light)] px-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-semibold truncate">{line.product.name}</p>
        <p className="text-xs text-[var(--text-muted)]">
          {line.neededUnits} unidades necesarias · paquetes de {line.packSize}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-bold tabular-nums">
          {line.packsToBuy} pack{line.packsToBuy !== 1 && "s"}
        </p>
        <p className="text-xs text-[var(--text-muted)] tabular-nums">
          ${line.subtotal.toLocaleString("es-AR")}
        </p>
      </div>
    </div>
  );
}
