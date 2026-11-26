"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X, SlidersHorizontal, Tag } from "lucide-react";
import { CATEGORIAS, categoriaPorSlug, type Catalogo, type Producto } from "@/lib/catalogo";
import ProductoCard from "./ProductoCard";

const POR_PAGINA = 24;

const ORDENES = {
  relevancia: "Destacados",
  "precio-asc": "Menor precio",
  "precio-desc": "Mayor precio",
  nombre: "Nombre (A-Z)",
} as const;
type Orden = keyof typeof ORDENES;

function sinTildes(t: string) {
  return t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

/** "Destacados": primero lo que tiene foto y stock, después el resto. */
function puntaje(p: Producto) {
  return (p.disponible && p.stock !== 0 ? 2 : 0) + (p.imagenes.length ? 1 : 0);
}

export default function ExplorarProductos({ catalogo }: { catalogo: Catalogo }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const categoria = categoriaPorSlug(params.get("categoria") ?? "")?.slug ?? "";
  const q = params.get("q") ?? "";
  const orden: Orden = (params.get("orden") as Orden) in ORDENES ? (params.get("orden") as Orden) : "relevancia";
  const soloStock = params.get("stock") === "1";
  const [visibles, setVisibles] = useState(POR_PAGINA);
  const [busqueda, setBusqueda] = useState(q);
  // Si la búsqueda cambia desde afuera (el buscador del encabezado), el campo
  // de acá la acompaña.
  const [qAnterior, setQAnterior] = useState(q);
  if (q !== qAnterior) {
    setQAnterior(q);
    setBusqueda(q);
  }

  function cambiar(cambios: Record<string, string | null>) {
    const nuevos = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(cambios)) {
      if (v) nuevos.set(k, v);
      else nuevos.delete(k);
    }
    setVisibles(POR_PAGINA);
    const qs = nuevos.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  // Lo que coincide con búsqueda y stock, antes de filtrar por categoría:
  // así los contadores de cada categoría dicen cuántos hay con la búsqueda actual.
  const base = useMemo(() => {
    const palabras = sinTildes(q).split(/\s+/).filter(Boolean);
    return catalogo.productos.filter((p) => {
      if (soloStock && (!p.disponible || p.stock === 0)) return false;
      if (!palabras.length) return true;
      const texto = sinTildes(`${p.nombre} ${categoriaPorSlug(p.categoria)?.nombre ?? ""}`);
      return palabras.every((w) => texto.includes(w));
    });
  }, [catalogo.productos, q, soloStock]);

  const conteo = useMemo(() => {
    const c: Record<string, number> = {};
    for (const p of base) c[p.categoria] = (c[p.categoria] ?? 0) + 1;
    return c;
  }, [base]);

  const lista = useMemo(() => {
    const filtrados = categoria ? base.filter((p) => p.categoria === categoria) : base;
    const ordenados = [...filtrados];
    if (orden === "precio-asc") ordenados.sort((a, b) => a.precio - b.precio);
    else if (orden === "precio-desc") ordenados.sort((a, b) => b.precio - a.precio);
    else if (orden === "nombre") ordenados.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
    else ordenados.sort((a, b) => puntaje(b) - puntaje(a) || a.nombre.localeCompare(b.nombre, "es"));
    return ordenados;
  }, [base, categoria, orden]);

  const categoriasConProductos = CATEGORIAS.filter((c) => catalogo.productos.some((p) => p.categoria === c.slug));
  const titulo = categoriaPorSlug(categoria)?.nombre ?? "Todos los productos";

  function buscar(e: React.FormEvent) {
    e.preventDefault();
    cambiar({ q: busqueda.trim() || null });
  }

  const botonCategoria = (slug: string, nombre: string, n: number) => {
    const activa = categoria === slug;
    return (
      <button
        key={slug || "todas"}
        type="button"
        onClick={() => cambiar({ categoria: slug || null })}
        aria-pressed={activa}
        className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
          activa
            ? "bg-[var(--green-primary)] font-semibold text-white"
            : "text-[var(--text)] hover:bg-[var(--green-primary)]/10"
        }`}
      >
        <span>{nombre}</span>
        <span className={`text-xs tabular-nums ${activa ? "text-white/80" : "text-[var(--text-muted)]"}`}>{n}</span>
      </button>
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
      {catalogo.promociones.length > 0 && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl bg-[var(--accent)] px-5 py-4 text-sm text-[var(--accent-ink)]">
          <Tag size={18} className="mt-0.5 shrink-0" />
          <p>
            <strong>Promociones: </strong>
            {catalogo.promociones.map((p) => `${p.nombre} (${p.resumen})`).join(" · ")}
          </p>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* Filtros — escritorio */}
        <aside className="hidden lg:block">
          <div className="sticky top-40 flex flex-col gap-6">
            <div>
              <h2 className="mb-2 px-3 text-xs font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                Categorías
              </h2>
              <div className="flex flex-col gap-0.5">
                {botonCategoria("", "Todas", base.length)}
                {categoriasConProductos.map((c) => botonCategoria(c.slug, c.nombre, conteo[c.slug] ?? 0))}
              </div>
            </div>
            <label className="flex cursor-pointer items-center gap-2 px-3 text-sm">
              <input
                type="checkbox"
                checked={soloStock}
                onChange={(e) => cambiar({ stock: e.target.checked ? "1" : null })}
                className="h-4 w-4 accent-[var(--green-primary)]"
              />
              Solo con stock
            </label>
          </div>
        </aside>

        <div className="min-w-0">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{titulo}</h1>
              <p className="mt-1 text-sm text-[var(--text-muted)]" aria-live="polite">
                {lista.length} {lista.length === 1 ? "producto" : "productos"}
                {q && <> para «{q}»</>}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <form onSubmit={buscar} className="relative flex-1" role="search">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="search"
                  value={busqueda}
                  onChange={(e) => {
                    setBusqueda(e.target.value);
                    if (!e.target.value) cambiar({ q: null });
                  }}
                  placeholder="Buscar en el catálogo… (ej: bandeja, vaso térmico)"
                  aria-label="Buscar en el catálogo"
                  className="w-full rounded-full border border-[var(--gray)] bg-white py-3 pl-11 pr-24 text-sm outline-none focus:border-[var(--green-primary)]"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-[var(--green-primary)] px-4 py-2 text-xs font-semibold text-white hover:bg-[var(--green-primary-hover)]"
                >
                  Buscar
                </button>
              </form>
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-[var(--text-muted)]" />
                <select
                  value={orden}
                  onChange={(e) => cambiar({ orden: e.target.value === "relevancia" ? null : e.target.value })}
                  aria-label="Ordenar"
                  className="rounded-full border border-[var(--gray)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--green-primary)]"
                >
                  {Object.entries(ORDENES).map(([valor, nombre]) => (
                    <option key={valor} value={valor}>
                      {nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filtros — celular y tablet */}
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:hidden [scrollbar-width:none]">
              {[{ slug: "", nombre: "Todas" }, ...categoriasConProductos].map((c) => {
                const activa = categoria === c.slug;
                return (
                  <button
                    key={c.slug || "todas"}
                    type="button"
                    onClick={() => cambiar({ categoria: c.slug || null })}
                    aria-pressed={activa}
                    className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                      activa
                        ? "border-transparent bg-[var(--green-primary)] text-white"
                        : "border-[var(--gray)] bg-white text-[var(--text)]"
                    }`}
                  >
                    {c.nombre}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => cambiar({ stock: soloStock ? null : "1" })}
                aria-pressed={soloStock}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium ${
                  soloStock ? "border-[var(--green-primary)] text-[var(--green-primary)]" : "border-[var(--gray)] bg-white"
                }`}
              >
                Solo con stock
              </button>
            </div>

            {(categoria || q || soloStock) && (
              <div className="flex flex-wrap items-center gap-2 text-sm">
                {categoria && (
                  <Filtro texto={titulo} onQuitar={() => cambiar({ categoria: null })} />
                )}
                {q && (
                  <Filtro
                    texto={`«${q}»`}
                    onQuitar={() => {
                      setBusqueda("");
                      cambiar({ q: null });
                    }}
                  />
                )}
                {soloStock && <Filtro texto="Con stock" onQuitar={() => cambiar({ stock: null })} />}
              </div>
            )}
          </div>

          {lista.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-dashed border-[var(--gray)] p-10 text-center">
              <p className="font-semibold">No encontramos productos con esos filtros.</p>
              <p className="mt-1 text-sm text-[var(--text-muted)]">Probá con otra palabra o mirá todas las categorías.</p>
              <button
                type="button"
                onClick={() => {
                  setBusqueda("");
                  router.replace(pathname, { scroll: false });
                }}
                className="mt-4 rounded-full bg-[var(--green-primary)] px-5 py-2.5 text-sm font-semibold text-white"
              >
                Ver todo el catálogo
              </button>
            </div>
          ) : (
            <>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
                {lista.slice(0, visibles).map((p, i) => (
                  <ProductoCard key={p.id} producto={p} priority={i < 4} />
                ))}
              </div>
              {visibles < lista.length && (
                <div className="mt-8 flex flex-col items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setVisibles((v) => v + POR_PAGINA)}
                    className="rounded-full border-2 border-[var(--green-primary)] px-6 py-3 text-sm font-semibold text-[var(--green-primary)] transition-colors hover:bg-[var(--green-primary)] hover:text-white"
                  >
                    Ver más productos
                  </button>
                  <p className="text-xs text-[var(--text-muted)]">
                    Mostrando {Math.min(visibles, lista.length)} de {lista.length}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Filtro({ texto, onQuitar }: { texto: string; onQuitar: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--green-primary)]/10 py-1 pl-3 pr-1 font-medium text-[var(--green-primary)]">
      {texto}
      <button
        type="button"
        onClick={onQuitar}
        aria-label={`Quitar filtro ${texto}`}
        className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-[var(--green-primary)]/15"
      >
        <X size={13} />
      </button>
    </span>
  );
}
