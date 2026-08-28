import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCategories, getProductById } from "@/lib/data/products";
import { updateProductAction } from "../../../actions";
import AdminProductForm, { type AdminProductInitial } from "@/components/admin/AdminProductForm";

export const revalidate = 0;

export default async function AdminEditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ msg?: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([getProductById(id), getCategories()]);
  if (!product) notFound();

  const initial: AdminProductInitial = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: product.category,
    description: product.description,
    longDescription: product.longDescription,
    features: product.features.join("\n"),
    price: product.price,
    oldPrice: product.oldPrice ?? null,
    discount: product.discount ?? null,
    stock: product.stock,
    unit: product.unit,
    sku: product.sku ?? null,
    barcode: product.barcode ?? null,
    weightGrams: product.weightGrams ?? null,
    dimensions: product.dimensions ?? null,
    minWholesaleQty: product.minWholesaleQty ?? null,
    wholesalePrice: product.wholesalePrice ?? null,
    metaTitle: product.metaTitle ?? null,
    metaDescription: product.metaDescription ?? null,
    icon: product.icon,
    featured: product.featured,
    bestSeller: product.bestSeller ?? false,
    isNew: product.isNew ?? false,
    active: true,
    imageUrls: (product.images ?? []).map((i) => i.url).join("\n"),
    imageAlts: (product.images ?? []).map((i) => i.alt ?? "").join("\n"),
  };

  const { msg } = await searchParams;

  return (
    <main className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/productos"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--gray)] bg-white text-[var(--text-muted)] hover:text-[var(--green-primary)] transition-colors"
            aria-label="Volver a productos"
          >
            <ArrowLeft size={16} />
          </Link>
          <h1 className="font-display text-xl font-bold">Editar producto</h1>
        </div>
      </div>

      {msg === "guardado" && (
        <p className="rounded-xl bg-[var(--green-primary)]/10 px-4 py-3 text-sm font-semibold text-[var(--green-primary)]">
          Cambios guardados correctamente.
        </p>
      )}

      <div className="rounded-2xl border border-[var(--gray)] bg-white p-6 sm:p-8">
        <AdminProductForm
          categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
          initial={initial}
          action={updateProductAction}
        />
      </div>
    </main>
  );
}