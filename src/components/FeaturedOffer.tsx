import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getProducts } from "@/lib/data/products";
import ProductCard from "./ProductCard";
import Reveal from "./Reveal";

export default async function FeaturedOffer() {
  const allProducts = await getProducts({ onlyActive: true });
  const packs = allProducts.filter(
    (p) =>
      p.slug.startsWith("pack-") &&
      p.discount &&
      p.discount > 0
  );

  if (packs.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-4">
      <div className="rounded-3xl bg-[var(--green-primary)] overflow-hidden p-8 md:p-12">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-white/70">
              Ofertas
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
              Packs con descuento
            </h2>
            <p className="text-white/80 mt-1 text-sm">
              Combos pensados para tu negocio con precios especiales.
            </p>
          </div>
          <Link
            href="/productos?ofertas=1"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:text-white/80 transition-colors"
          >
            Ver todas las ofertas <ArrowRight size={15} />
          </Link>
        </div>
        <Reveal className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {packs.map((p) => (
            <ProductCard key={p.id} product={p} onGreen />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
