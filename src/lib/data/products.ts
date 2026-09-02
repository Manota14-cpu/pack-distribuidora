import "server-only";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { Category, CategorySlug, Product } from "@/lib/types";

export const PRODUCT_REVALIDATE = 60;

const productInclude = Prisma.validator<Prisma.ProductInclude>()({
  category: true,
  images: { orderBy: { sortOrder: "asc" } },
});

type ProductRow = Prisma.ProductGetPayload<{ include: typeof productInclude }>;

function parseFeatures(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((f) => typeof f === "string") : [];
  } catch {
    return [];
  }
}

export function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category.slug as CategorySlug,
    description: row.description,
    longDescription: row.longDescription,
    features: parseFeatures(row.features),
    price: row.price,
    oldPrice: row.oldPrice ?? undefined,
    discount: row.discount ?? undefined,
    icon: row.icon,
    stock: row.stockAvailable,
    unit: row.unit,
    featured: row.featured,
    bestSeller: row.bestSeller,
    isNew: row.isNew,
    rating: row.rating,
    sku: row.sku ?? undefined,
    barcode: row.barcode ?? undefined,
    weightGrams: row.weightGrams ?? undefined,
    dimensions: row.dimensions ?? undefined,
    minWholesaleQty: row.minWholesaleQty ?? undefined,
    wholesalePrice: row.wholesalePrice ?? undefined,
    metaTitle: row.metaTitle ?? undefined,
    metaDescription: row.metaDescription ?? undefined,
    images: row.images.length
      ? row.images.map((img) => ({
          url: img.url,
          alt: img.alt ?? undefined,
          sortOrder: img.sortOrder,
        }))
      : undefined,
  };
}

export async function getCategories(): Promise<Category[]> {
  const rows = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return rows.map((c) => ({
    slug: c.slug as CategorySlug,
    name: c.name,
    icon: c.icon,
    description: c.description,
  }));
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const row = await prisma.category.findUnique({ where: { slug } });
  if (!row) return undefined;
  return {
    slug: row.slug as CategorySlug,
    name: row.name,
    icon: row.icon,
    description: row.description,
  };
}

export async function getProducts(opts: { onlyActive?: boolean; includeInactive?: boolean } = {}): Promise<Product[]> {
  const { onlyActive = true } = opts;
  const rows = await prisma.product.findMany({
    where: onlyActive ? { active: true } : undefined,
    include: productInclude,
    orderBy: { createdAt: "asc" },
  });
  return rows.map(toProduct);
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { active: true, featured: true },
    include: productInclude,
    orderBy: { createdAt: "asc" },
    take: limit,
  });
  return rows.map(toProduct);
}

/**
 * Ficha pública de un producto.
 *
 * Filtra por `active`: sin eso, un producto dado de baja desaparecía del
 * listado pero su ficha seguía abierta para siempre a quien tuviera el enlace
 * (o llegara desde Google), con su botón de compra incluido. Ahora devuelve
 * undefined y la página responde 404.
 *
 * Es `findFirst` y no `findUnique` porque este último solo admite campos
 * únicos en el `where`.
 */
export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const row = await prisma.product.findFirst({
    where: { slug, active: true },
    include: productInclude,
  });
  if (!row) return undefined;
  return toProduct(row);
}

export async function getRelatedProducts(product: Product, count = 4): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { active: true, NOT: { id: product.id }, category: { slug: product.category } },
    include: productInclude,
    orderBy: { createdAt: "asc" },
    take: count,
  });
  return rows.map(toProduct);
}

export async function getPublicProductSlugs(): Promise<string[]> {
  const rows = await prisma.product.findMany({
    where: { active: true },
    select: { slug: true },
  });
  return rows.map((r) => r.slug);
}

export async function searchProducts(query: string, limit = 5): Promise<Product[]> {
  const q = query.trim();
  if (!q) return [];
  const rows = await prisma.product.findMany({
    where: { active: true, name: { contains: q } },
    include: productInclude,
    orderBy: { createdAt: "asc" },
    take: limit,
  });
  return rows.map(toProduct);
}