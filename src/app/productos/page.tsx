import { Suspense } from "react";
import type { Metadata } from "next";
import { getCategories, getProducts } from "@/lib/data/products";
import ProductsExplorer from "@/components/ProductsExplorer";

export const metadata: Metadata = {
  title: "Todos los productos",
  description: "Explorá el catálogo completo de productos descartables de Pack Distribuidora.",
  alternates: {
    canonical: "/productos",
  },
  openGraph: {
    type: "website",
    url: "/productos",
    title: "Todos los productos — Pack Distribuidora",
    description: "Explorá el catálogo completo de productos descartables de Pack Distribuidora.",
  },
  twitter: {
    title: "Todos los productos — Pack Distribuidora",
    description: "Explorá el catálogo completo de productos descartables de Pack Distribuidora.",
  },
};

export const revalidate = 60;

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Productos descartables de Pack Distribuidora",
    numberOfItems: products.length,
    itemListElement: products.map((p, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: p.name,
      url: `https://packdistribuidora.com.ar/productos/${p.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />
      <Suspense fallback={<div className="mx-auto max-w-7xl px-6 py-20 text-center text-sm text-[var(--text-muted)]">Cargando productos…</div>}>
        <ProductsExplorer initialProducts={products} initialCategories={categories} />
      </Suspense>
    </>
  );
}