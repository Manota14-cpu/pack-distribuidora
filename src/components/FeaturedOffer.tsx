import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getProductBySlug } from "@/lib/data/products";
import ProductVisual from "./ProductVisual";

export default async function FeaturedOffer() {
  const pack = await getProductBySlug("pack-gastronomico");
  if (!pack) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-4">
      <div className="rounded-3xl bg-[var(--green-primary)] overflow-hidden grid md:grid-cols-2 items-center">
        <div className="p-8 md:p-12">
          <span className="inline-block rounded-full bg-white/15 text-white text-xs font-bold px-3 py-1.5">
            {pack.discount}% OFF
          </span>
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mt-4">
            Pack gastronómico
          </h3>
          <p className="text-white/90 mt-2 max-w-sm">
            Todo lo que necesitás para tu negocio: platos, vasos, cubiertos y servilletas
            en un solo combo.
          </p>
          <Link
            href={`/productos/${pack.slug}`}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white text-[var(--green-primary)] text-sm font-bold px-6 py-3.5 hover:bg-white/85 transition-colors"
          >
            Comprar pack <ArrowRight size={16} />
          </Link>
        </div>
        <div className="p-8 md:p-10 grid grid-cols-2 gap-4">
          {["Disc", "CupSoda", "Utensils", "StickyNote"].map((icon) => (
            <ProductVisual
              key={icon}
              icon={icon}
              className="aspect-square bg-white/95"
              iconClassName="h-10 w-10"
              iconColor="text-[var(--green-primary)]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
