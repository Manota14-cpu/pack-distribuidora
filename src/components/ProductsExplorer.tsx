"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { useFocusTrap } from "@/lib/use-focus-trap";
import {
  DEFAULT_MAX_PRICE,
  filterAndSortProducts,
  SORT_LABELS,
  type SortOption,
} from "@/lib/products-utils";
import type { Category, CategorySlug, Product } from "@/lib/types";
import ProductCard from "./ProductCard";

export default function ProductsExplorer({
  initialProducts,
  initialCategories,
}: {
  initialProducts: Product[];
  initialCategories: Category[];
}) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("categoria") as CategorySlug | null;
  const onlyOffers = searchParams.get("ofertas") === "1";

  const [activeCategories, setActiveCategories] = useState<CategorySlug[]>(
    initialCategory ? [initialCategory] : []
  );
  const [maxPrice, setMaxPrice] = useState(DEFAULT_MAX_PRICE);
  const [wholesaleOnly, setWholesaleOnly] = useState(false);
  const [offersOnly, setOffersOnly] = useState(onlyOffers);
  const [sort, setSort] = useState<SortOption>("relevancia");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filterTrapRef = useFocusTrap(filtersOpen);

  useEffect(() => {
    if (filtersOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [filtersOpen]);

  function toggleCategory(slug: CategorySlug) {
    setActiveCategories((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]
    );
  }

  const filtered = useMemo(
    () =>
      filterAndSortProducts(
        initialProducts,
        { activeCategories, maxPrice, offersOnly, wholesaleOnly },
        sort
      ),
    [initialProducts, activeCategories, maxPrice, offersOnly, wholesaleOnly, sort]
  );

  const FiltersPanel = (
    <div className="flex flex-col gap-7">
      <div>
        <h3 className="text-sm font-semibold mb-3">Categoría</h3>
        <div className="flex flex-col gap-2">
          {initialCategories.map((c) => (
            <label key={c.slug} className="flex items-center gap-2.5 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={activeCategories.includes(c.slug)}
                onChange={() => toggleCategory(c.slug)}
                className="h-4 w-4 rounded accent-[var(--green-primary)]"
              />
              {c.name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Precio máximo</h3>
        <input
          type="range"
          min={400}
          max={6000}
          step={100}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-[var(--green-primary)]"
        />
        <p className="text-xs text-[var(--text-muted)] mt-1">Hasta ${maxPrice.toLocaleString("es-AR")}</p>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Disponibilidad</h3>
        <label className="flex items-center gap-2.5 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={offersOnly}
            onChange={(e) => setOffersOnly(e.target.checked)}
            className="h-4 w-4 rounded accent-[var(--green-primary)]"
          />
          Solo ofertas
        </label>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Packs Mayorista</h3>
        <label className="flex items-center gap-2.5 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={wholesaleOnly}
            onChange={(e) => setWholesaleOnly(e.target.checked)}
            className="h-4 w-4 rounded accent-[var(--green-primary)]"
          />
          Packs mayoristas
        </label>
      </div>

      {(activeCategories.length > 0 || offersOnly || wholesaleOnly || maxPrice < DEFAULT_MAX_PRICE) && (
        <button
          onClick={() => {
            setActiveCategories([]);
            setOffersOnly(false);
            setWholesaleOnly(false);
            setMaxPrice(DEFAULT_MAX_PRICE);
          }}
          className="text-xs font-semibold text-[var(--green-primary)] text-left"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 grid lg:grid-cols-[220px_1fr] gap-10">
      <aside className="hidden lg:block">{FiltersPanel}</aside>

      <div>
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div>
            <h1 className="font-display text-2xl font-bold text-[var(--text)]">
              Todos los productos
            </h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              {filtered.length} producto{filtered.length !== 1 && "s"} encontrado
              {filtered.length !== 1 && "s"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 rounded-full border border-[var(--gray)] px-4 py-2.5 text-sm font-semibold"
            >
              <SlidersHorizontal size={15} /> Filtrar productos
            </button>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="rounded-full border border-[var(--gray)] bg-[var(--white)] px-4 py-2.5 text-sm font-medium outline-none focus:border-[var(--green-primary)]"
            >
              {Object.entries(SORT_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--gray)] py-16 text-center text-[var(--text-muted)]">
            No encontramos productos con esos filtros. Probá ajustar la búsqueda.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filtros de productos">
          <div className="absolute inset-0 bg-black/40" onClick={() => setFiltersOpen(false)} />
          <div ref={filterTrapRef} className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-[var(--white)] p-6 overflow-y-auto animate-fade-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-lg font-bold">Filtros</h2>
              <button onClick={() => setFiltersOpen(false)} aria-label="Cerrar filtros">
                <X size={22} />
              </button>
            </div>
            {FiltersPanel}
            <button
              onClick={() => setFiltersOpen(false)}
              className="mt-8 w-full rounded-full bg-[var(--green-primary)] text-white text-sm font-semibold py-3"
            >
              Ver {filtered.length} resultados
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
