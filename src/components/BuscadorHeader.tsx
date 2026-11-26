"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { CATALOGO_URL, normalizarCatalogo, plata, type CatalogoVA, type Producto } from "@/lib/catalogo";
import ProductoImagen from "./tienda/ProductoImagen";

// El catálogo se pide una sola vez por visita, recién cuando el cliente toca el buscador.
let pedido: Promise<Producto[]> | null = null;
function productos(): Promise<Producto[]> {
  pedido ??= fetch(CATALOGO_URL)
    .then((r) => r.json() as Promise<CatalogoVA>)
    .then((c) => normalizarCatalogo(c).productos)
    .catch(() => {
      pedido = null;
      return [];
    });
  return pedido;
}

function sinTildes(t: string) {
  return t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export default function BuscadorHeader({ variante }: { variante: "desktop" | "movil" }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [lista, setLista] = useState<Producto[]>([]);
  const [abierto, setAbierto] = useState(false);
  const caja = useRef<HTMLFormElement>(null);

  useEffect(() => {
    function fuera(e: MouseEvent) {
      if (caja.current && !caja.current.contains(e.target as Node)) setAbierto(false);
    }
    document.addEventListener("mousedown", fuera);
    return () => document.removeEventListener("mousedown", fuera);
  }, []);

  const sugerencias = useMemo(() => {
    const palabras = sinTildes(q).split(/\s+/).filter(Boolean);
    if (!palabras.length) return [];
    return lista.filter((p) => palabras.every((w) => sinTildes(p.nombre).includes(w))).slice(0, 6);
  }, [q, lista]);

  function cargar() {
    productos().then(setLista);
  }

  function buscar(e: React.FormEvent) {
    e.preventDefault();
    setAbierto(false);
    router.push(q.trim() ? `/productos?q=${encodeURIComponent(q.trim())}` : "/productos");
  }

  const movil = variante === "movil";

  return (
    <form ref={caja} onSubmit={buscar} role="search" className="relative w-full">
      <Search
        size={18}
        className={`absolute left-4 top-1/2 -translate-y-1/2 ${movil ? "text-[var(--text-muted)]" : "text-white/60"}`}
      />
      <input
        type="search"
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setAbierto(true);
        }}
        onFocus={() => {
          cargar();
          setAbierto(true);
        }}
        placeholder="¿Qué producto estás buscando?"
        aria-label="Buscar productos"
        className={
          movil
            ? "w-full rounded-full border border-white/20 bg-white py-2.5 pl-11 pr-4 text-sm outline-none"
            : "w-full rounded-full border border-white/20 bg-white/10 py-2.5 pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-white/60 focus:border-white/60 focus:bg-white/15"
        }
      />
      {abierto && sugerencias.length > 0 && (
        <div className="absolute top-full z-50 mt-2 w-full overflow-hidden rounded-2xl border border-[var(--gray)] bg-[var(--white)] shadow-lg">
          {sugerencias.map((p) => (
            <Link
              key={p.id}
              href={`/productos/${p.slug}`}
              onClick={() => {
                setAbierto(false);
                setQ("");
              }}
              className="flex items-center gap-3 px-3 py-2 transition-colors hover:bg-[var(--green-primary)]/10"
            >
              <ProductoImagen
                src={p.imagenes[0]}
                nombre={p.nombre}
                categoria={p.categoria}
                className="h-10 w-10 shrink-0 !rounded-lg"
                iconClassName="h-5 w-5"
                sizes="40px"
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-[var(--text)]">{p.nombre}</span>
                <span className="text-xs tabular-nums text-[var(--text-muted)]">{plata(p.precio)}</span>
              </span>
            </Link>
          ))}
          <button
            type="submit"
            className="block w-full border-t border-[var(--gray)] px-4 py-2.5 text-left text-sm font-semibold text-[var(--green-primary)] hover:bg-[var(--green-primary)]/5"
          >
            Ver todos los resultados para «{q.trim()}»
          </button>
        </div>
      )}
    </form>
  );
}
