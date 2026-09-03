import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Truck, ShieldCheck, RotateCcw, ChevronRight } from "lucide-react";
import {
  getProductBySlug,
  getRelatedProducts,
  getCategoryBySlug,
  getPublicProductSlugs,
} from "@/lib/data/products";
import ProductGallery from "@/components/ProductGallery";
import ProductCard from "@/components/ProductCard";
import ProductDetailActions from "@/components/ProductDetailActions";
import ProductViewTracker from "@/components/ProductViewTracker";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const slugs = await getPublicProductSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Producto no encontrado" };
  const canonical = `/productos/${product.slug}`;
  const description =
    product.metaDescription ??
    `${product.name} — ${product.description} ${product.unit}. Precio mayorista y minorista en Pack Distribuidora, envíos a todo el país.`;
  return {
    title: product.metaTitle ?? product.name,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: product.metaTitle ?? product.name,
      description: product.longDescription,
      type: "website",
      url: canonical,
    },
    twitter: {
      title: product.metaTitle ?? product.name,
      description: product.longDescription,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [category, related] = await Promise.all([
    getCategoryBySlug(product.category),
    getRelatedProducts(product),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.longDescription,
    sku: product.sku ?? product.id,
    category: category?.name,
    brand: {
      "@type": "Brand",
      name: "Pack Distribuidora",
    },
    image: product.images?.[0]?.url
      ? `https://packdistribuidora.com.ar${product.images[0].url.startsWith("/") ? "" : "/"}${product.images[0].url}`
      : "https://packdistribuidora.com.ar/logos/pack.png",
    offers: {
      "@type": "Offer",
      url: `https://packdistribuidora.com.ar/productos/${product.slug}`,
      price: product.price,
      priceCurrency: "ARS",
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: "https://packdistribuidora.com.ar",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Productos",
        item: "https://packdistribuidora.com.ar/productos",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `https://packdistribuidora.com.ar/productos/${product.slug}`,
      },
    ],
  };

  return (
    <>
      <ProductViewTracker product={product} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="mx-auto max-w-7xl px-6 py-8">
      <nav aria-label="Migas de pan" className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mb-6 flex-wrap">
        <Link href="/" className="hover:text-[var(--green-primary)]">Inicio</Link>
        <ChevronRight size={12} />
        <Link href="/productos" className="hover:text-[var(--green-primary)]">Productos</Link>
        {category && (
          <>
            <ChevronRight size={12} />
            <Link
              href={`/productos?categoria=${category.slug}`}
              className="hover:text-[var(--green-primary)]"
            >
              {category.name}
            </Link>
          </>
        )}
        <ChevronRight size={12} />
        <span className="text-[var(--text)]">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
        <ProductGallery product={product} />

        <div>
          {product.bestSeller && (
            <span className="inline-block rounded-full bg-[var(--green-primary)] text-white text-xs font-bold px-3 py-1 mb-3">
              Más vendido
            </span>
          )}
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text)]">
            {product.name}
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">{product.unit}</p>

          <div className="flex items-baseline gap-3 mt-5">
            <span className="font-display text-3xl font-bold tabular-nums tracking-tight">
              ${product.price.toLocaleString("es-AR")}
            </span>
            {product.oldPrice && (
              <span className="text-base text-[var(--text-muted)] line-through tabular-nums">
                Antes ${product.oldPrice.toLocaleString("es-AR")}
              </span>
            )}
            {product.discount && (
              <span className="rounded-full bg-[var(--green-primary)] text-white text-xs font-bold px-2.5 py-1">
                -{product.discount}%
              </span>
            )}
          </div>

          <p
            className={`mt-2 text-sm font-semibold ${
              product.stock === 0 ? "text-red-500" : "text-[var(--green-primary)]"
            }`}
          >
            {product.stock === 0 ? "Sin stock" : `En stock (${product.stock} disponibles)`}
          </p>

          <p className="mt-4 text-sm text-[var(--text-muted)] leading-relaxed">
            {product.longDescription}
          </p>

          <div className="tear-strip my-6" />

          <ProductDetailActions product={product} />

          <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="flex items-center gap-2 text-[var(--text-muted)]">
              <Truck size={16} className="text-[var(--green-primary)]" /> Envíos a todo el país
            </div>
            <div className="flex items-center gap-2 text-[var(--text-muted)]">
              <ShieldCheck size={16} className="text-[var(--green-primary)]" /> Compra segura
            </div>
            <div className="flex items-center gap-2 text-[var(--text-muted)]">
              <RotateCcw size={16} className="text-[var(--green-primary)]" /> Cambios sin cargo
            </div>
          </div>
        </div>
      </div>

      <div className="tear-strip my-12" />

      <div className="grid sm:grid-cols-2 gap-10">
        <div>
          <h2 className="font-display text-lg font-bold mb-3">Características</h2>
          <ul className="flex flex-col gap-2">
            {product.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-[var(--text-muted)]">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--green-primary)] shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-display text-lg font-bold mb-3">Información de envío</h2>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            Realizamos envíos a todo el país. Los tiempos de entrega varían según la
            localidad. Para compras mayoristas, coordinamos logística especial y
            facturación. Consultanos por WhatsApp para conocer el costo y tiempo
            estimado de envío a tu domicilio.
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display text-xl font-bold text-[var(--text)] mb-6">
            Productos relacionados
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
      </div>
    </>
  );
}