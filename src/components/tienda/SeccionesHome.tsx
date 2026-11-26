import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CATEGORIAS, type Catalogo, type Producto } from "@/lib/catalogo";
import ProductVisual from "../ProductVisual";
import SectionHeading from "../SectionHeading";
import ProductoCard from "./ProductoCard";

export function CategoriasHome({ catalogo }: { catalogo: Catalogo }) {
  const conteo: Record<string, number> = {};
  for (const p of catalogo.productos) conteo[p.categoria] = (conteo[p.categoria] ?? 0) + 1;
  const categorias = CATEGORIAS.filter((c) => conteo[c.slug]);

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading eyebrow="Catálogo" title="Comprá por categoría" subtitle="Encontrá rápido lo que necesitás para tu negocio, tu casa o tu evento." />
        <Link href="/productos" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--green-primary)] transition-all hover:gap-2">
          Ver todo el catálogo <ArrowRight size={15} />
        </Link>
      </div>
      <div className="mt-8 grid grid-cols-3 gap-2.5 sm:gap-4 lg:grid-cols-6 md:mt-10">
        {categorias.map((c) => (
          <Link
            key={c.slug}
            href={`/productos?categoria=${c.slug}`}
            className="group flex flex-col rounded-2xl border border-[var(--gray)] bg-[var(--white)] p-2 sm:p-3 transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-[0_16px_34px_-14px_rgba(6,59,24,0.3)]"
          >
            <ProductVisual
              icon={c.icono}
              className="aspect-[4/3] w-full transition-transform duration-300 group-hover:scale-[1.03]"
              iconClassName="h-10 w-10"
              variante="suave"
            />
            <h3 className="mt-2 font-display text-xs font-semibold leading-tight sm:mt-3 sm:text-sm">{c.nombre}</h3>
            <p className="mt-0.5 text-[11px] text-[var(--text-muted)] sm:text-xs">{conteo[c.slug]} productos</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

/** Destacados: los que tienen foto y stock (son los que mejor se ven). */
export function destacados(catalogo: Catalogo, cuantos = 8): Producto[] {
  return catalogo.productos
    .filter((p) => p.disponible && p.stock !== 0)
    .sort((a, b) => b.imagenes.length - a.imagenes.length || a.nombre.localeCompare(b.nombre, "es"))
    .slice(0, cuantos);
}

export function DestacadosHome({ catalogo }: { catalogo: Catalogo }) {
  const lista = destacados(catalogo);
  if (!lista.length) return null;
  return (
    <section className="bg-[var(--gray-light)]">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Tienda online" title="Productos destacados" subtitle={`Precios y stock al día. ${catalogo.mercadopago ? "Pagás con Mercado Pago o al retirar." : "Retirás en el local o te lo enviamos."}`} />
          <Link href="/productos" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--green-primary)] transition-all hover:gap-2">
            Ver todos los productos <ArrowRight size={15} />
          </Link>
        </div>
        {/* En celular se desliza de costado: 8 tarjetas en dos columnas eran cuatro pantallas. */}
        <div className="-mx-6 mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-2 [scrollbar-width:none] md:mx-0 md:mt-10 md:grid md:grid-cols-4 md:gap-4 md:overflow-visible md:px-0 md:pb-0">
          {lista.map((p) => (
            <div key={p.id} className="w-[62%] shrink-0 snap-start sm:w-[40%] md:w-auto">
              <ProductoCard producto={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
