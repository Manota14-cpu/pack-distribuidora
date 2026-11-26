import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ChevronRight, CreditCard, RotateCcw, Store, Truck } from "lucide-react";
import { getCatalogo } from "@/lib/catalogo-server";
import { buscarPorSlug, categoriaPorSlug, plata, precioPor, type Producto } from "@/lib/catalogo";
import GaleriaProducto from "@/components/tienda/GaleriaProducto";
import AccionesProducto from "@/components/tienda/AccionesProducto";
import StockEtiqueta from "@/components/tienda/StockEtiqueta";
import ProductoCard from "@/components/tienda/ProductoCard";

export const revalidate = 60;

const BASE_URL = "https://packdistribuidora.com.ar";

type Props = { params: Promise<{ slug: string }> };

async function cargar(slug: string) {
  const catalogo = await getCatalogo();
  const producto = buscarPorSlug(catalogo, slug);
  return { catalogo, producto };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { producto } = await cargar(slug).catch(() => ({ producto: undefined }));
  if (!producto) return { title: "Producto no encontrado" };
  const categoria = categoriaPorSlug(producto.categoria)?.nombre ?? "Productos";
  const descripcion = `${producto.nombre} a ${plata(producto.precio)} ${precioPor(producto)}. ${categoria} en Pack Distribuidora: comprá online con precios y stock al día.`;
  return {
    title: producto.nombre,
    description: descripcion,
    alternates: { canonical: `/productos/${producto.slug}` },
    openGraph: {
      type: "website",
      url: `/productos/${producto.slug}`,
      title: `${producto.nombre} — Pack Distribuidora`,
      description: descripcion,
      ...(producto.imagenes[0] ? { images: [{ url: producto.imagenes[0] }] } : {}),
    },
  };
}

/** Primero los de la misma categoría con stock y foto. */
function relacionados(todos: Producto[], producto: Producto): Producto[] {
  return todos
    .filter((p) => p.categoria === producto.categoria && p.id !== producto.id && p.disponible && p.stock !== 0)
    .sort((a, b) => b.imagenes.length - a.imagenes.length)
    .slice(0, 4);
}

export default async function ProductoPage({ params }: Props) {
  const { slug } = await params;
  const { catalogo, producto } = await cargar(slug);
  if (!producto) notFound();
  // Si cambió el nombre en Visual App, el enlace viejo lleva a la dirección nueva.
  if (producto.slug !== slug) permanentRedirect(`/productos/${producto.slug}`);

  const categoria = categoriaPorSlug(producto.categoria);
  const otros = relacionados(catalogo.productos, producto);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: producto.nombre,
    sku: producto.id,
    category: categoria?.nombre,
    ...(producto.imagenes.length ? { image: producto.imagenes } : {}),
    brand: { "@type": "Brand", name: "Pack Distribuidora" },
    offers: {
      "@type": "Offer",
      url: `${BASE_URL}/productos/${producto.slug}`,
      priceCurrency: "ARS",
      price: producto.precio,
      availability:
        producto.disponible && producto.stock !== 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: "Pack Distribuidora" },
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav aria-label="Migas de pan" className="mb-6 flex flex-wrap items-center gap-1 text-sm text-[var(--text-muted)]">
        <Link href="/" className="hover:text-[var(--green-primary)]">Inicio</Link>
        <ChevronRight size={14} />
        <Link href="/productos" className="hover:text-[var(--green-primary)]">Productos</Link>
        {categoria && (
          <>
            <ChevronRight size={14} />
            <Link href={`/productos?categoria=${categoria.slug}`} className="hover:text-[var(--green-primary)]">
              {categoria.nombre}
            </Link>
          </>
        )}
      </nav>

      <div className="grid gap-8 md:grid-cols-2 lg:gap-14">
        <GaleriaProducto imagenes={producto.imagenes} nombre={producto.nombre} categoria={producto.categoria} />

        <div className="flex flex-col gap-5">
          <div>
            {categoria && (
              <Link
                href={`/productos?categoria=${categoria.slug}`}
                className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--green-primary)] hover:underline"
              >
                {categoria.nombre}
              </Link>
            )}
            <h1 className="mt-2 font-display text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
              {producto.nombre}
            </h1>
          </div>

          <div className="flex flex-col gap-1">
            <p className="flex items-baseline gap-2">
              <span className="font-display text-4xl font-bold tabular-nums tracking-tight">{plata(producto.precio)}</span>
              <span className="text-sm text-[var(--text-muted)]">{precioPor(producto)}</span>
            </p>
            <StockEtiqueta producto={producto} className="text-sm" />
          </div>

          <AccionesProducto producto={producto} />

          <ul className="mt-2 grid gap-3 rounded-2xl border border-[var(--gray)] p-5 text-sm sm:grid-cols-2">
            <Beneficio icono={Truck} titulo="Envíos a todo el país" texto="Despachamos en 24/48 hs hábiles." href="/informacion-de-compra#envios" />
            <Beneficio icono={Store} titulo="Retiro sin cargo" texto="En nuestro local de Rafaela." href="/informacion-de-compra#envios" />
            <Beneficio
              icono={CreditCard}
              titulo="Pagá como quieras"
              texto={catalogo.mercadopago ? "Mercado Pago, o al retirar / recibir." : "Al retirar o al recibir el pedido."}
              href="/informacion-de-compra#pagos"
            />
            <Beneficio icono={RotateCcw} titulo="Botón de arrepentimiento" texto="Tenés 10 días para revocar la compra." href="/arrepentimiento" />
          </ul>
        </div>
      </div>

      {otros.length > 0 && (
        <section className="mt-16">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-xl font-bold sm:text-2xl">También te puede servir</h2>
            {categoria && (
              <Link
                href={`/productos?categoria=${categoria.slug}`}
                className="text-sm font-semibold text-[var(--green-primary)] hover:underline"
              >
                Ver más de {categoria.nombre.toLowerCase()}
              </Link>
            )}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {otros.map((p) => (
              <ProductoCard key={p.id} producto={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Beneficio({
  icono: Icono,
  titulo,
  texto,
  href,
}: {
  icono: typeof Truck;
  titulo: string;
  texto: string;
  href: string;
}) {
  return (
    <li>
      <Link href={href} className="flex items-start gap-3 rounded-xl p-1 transition-colors hover:bg-[var(--gray-light)]">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--green-primary)]/10 text-[var(--green-primary)]">
          <Icono size={17} />
        </span>
        <span>
          <span className="block font-semibold">{titulo}</span>
          <span className="text-[var(--text-muted)]">{texto}</span>
        </span>
      </Link>
    </li>
  );
}
