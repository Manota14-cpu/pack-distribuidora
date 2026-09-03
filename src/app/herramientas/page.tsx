import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { getProducts } from "@/lib/data/products";
import { pickRepresentativeProduct, EVENT_RATIOS } from "@/lib/calculator-utils";
import type { Product } from "@/lib/types";
import EventCalculator from "@/components/EventCalculator";
import RubroSelector from "@/components/RubroSelector";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Herramientas",
  description:
    "Calculá cuánto necesitás para tu evento y encontrá el pack armado para tu rubro.",
  alternates: {
    canonical: "/herramientas",
  },
};

const RUBRO_SLUGS = [
  "pack-verduleria",
  "pack-carniceria",
  "pack-panaderia",
  "pack-kiosco-almacen",
  "pack-cumpleanos",
  "pack-resto-rubros",
];

export default async function HerramientasPage() {
  const products = await getProducts({ onlyActive: true });

  const productByCategory: Partial<Record<keyof typeof EVENT_RATIOS, Product>> = {
    vasos: pickRepresentativeProduct(products.filter((p) => p.category === "vasos")),
    platos: pickRepresentativeProduct(products.filter((p) => p.category === "platos")),
    cubiertos: pickRepresentativeProduct(products.filter((p) => p.category === "cubiertos")),
    servilletas: pickRepresentativeProduct(products.filter((p) => p.category === "servilletas")),
  };

  const packsBySlug: Record<string, Product> = {};
  for (const slug of RUBRO_SLUGS) {
    const product = products.find((p) => p.slug === slug);
    if (product) packsBySlug[slug] = product;
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="text-center mb-10">
        <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--green-primary)]">
          Herramientas
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold mt-3 tracking-tight text-balance text-[var(--text)]">
          Te ayudamos a elegir
        </h1>
        <p className="mt-3 text-[var(--text-muted)] max-w-xl mx-auto">
          Dos formas rápidas de armar tu pedido: calculá cantidades para un evento o
          encontrá el pack pensado para tu rubro.
        </p>
      </div>

      <div id="calculadora" className="scroll-mt-24">
        <EventCalculator productByCategory={productByCategory} />
      </div>

      <div id="tu-rubro" className="scroll-mt-24 mt-8">
        <RubroSelector packsBySlug={packsBySlug} />
      </div>

      <div className="mt-10 flex items-center justify-center gap-2 text-sm text-[var(--text-muted)]">
        <BookOpen size={16} className="text-[var(--green-primary)]" />
        <span>
          ¿Querés saber más sobre envases y descartables?{" "}
          <Link href="/guias" className="font-semibold text-[var(--green-primary)] hover:underline">
            Mirá nuestras guías
          </Link>
        </span>
      </div>
    </div>
  );
}
