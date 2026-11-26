import { Suspense } from "react";
import type { Metadata } from "next";
import { getCatalogoSeguro } from "@/lib/catalogo-server";
import { STORE_INFO } from "@/lib/content";
import ExplorarProductos from "@/components/tienda/ExplorarProductos";

// Igual que el catálogo (catalogo-server.ts): precios y stock de hace un minuto como mucho.
export const revalidate = 60;

const DESCRIPCION =
  "Comprá online descartables, bandejas, bolsas, vasos, film y artículos de cotillón. Precios y stock al día, retiro en Rafaela o envío a todo el país.";

export const metadata: Metadata = {
  title: "Productos",
  description: DESCRIPCION,
  alternates: { canonical: "/productos" },
  openGraph: { type: "website", url: "/productos", title: "Productos — Pack Distribuidora", description: DESCRIPCION },
  twitter: { title: "Productos — Pack Distribuidora", description: DESCRIPCION },
};

export default async function ProductosPage() {
  const catalogo = await getCatalogoSeguro();

  if (!catalogo) {
    return (
      <div className="mx-auto max-w-xl px-6 py-20 text-center">
        <h1 className="font-display text-2xl font-bold">La tienda no está disponible en este momento</h1>
        <p className="mt-2 text-[var(--text-muted)]">
          Probá de nuevo en unos minutos o hacé tu pedido por WhatsApp.
        </p>
        <a
          href={STORE_INFO.whatsapp}
          className="mt-6 inline-flex rounded-full bg-[var(--green-primary)] px-6 py-3 text-sm font-semibold text-white"
        >
          Pedir por WhatsApp
        </a>
      </div>
    );
  }

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Productos de Pack Distribuidora",
    numberOfItems: catalogo.productos.length,
    itemListElement: catalogo.productos.slice(0, 100).map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.nombre,
      url: `https://packdistribuidora.com.ar/productos/${p.slug}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <Suspense
        fallback={<div className="py-20 text-center text-sm text-[var(--text-muted)]">Cargando productos…</div>}
      >
        <ExplorarProductos catalogo={catalogo} />
      </Suspense>
    </>
  );
}
