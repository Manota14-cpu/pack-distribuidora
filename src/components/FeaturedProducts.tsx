import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFeaturedProducts } from "@/lib/data/products";
import ProductCard from "./ProductCard";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

export default async function FeaturedProducts() {
  const featured = await getFeaturedProducts(8);

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <SectionHeading
          eyebrow="Lo más elegido"
          title="Productos destacados"
          subtitle="Los favoritos de nuestros clientes minoristas y mayoristas."
        />
        <Link
          href="/productos"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--green-primary)] hover:gap-2 transition-all"
        >
          Ver todos <ArrowRight size={15} />
        </Link>
      </div>
      <Reveal className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
        {featured.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </Reveal>
    </section>
  );
}
