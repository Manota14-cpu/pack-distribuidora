import Link from "next/link";
import { Plus, ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import ProductAdminTable from "@/components/admin/ProductAdminTable";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ msg?: string; tab?: string }>;
}) {
  const rows = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "asc" },
  });
  const { msg } = await searchParams;

  const products = rows.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.price,
    stock: p.stockAvailable,
    featured: p.featured,
    bestSeller: p.bestSeller,
    isNew: p.isNew,
    active: p.active,
    category: { name: p.category.name },
  }));

  return (
    <main className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--gray)] bg-white text-[var(--text-muted)] hover:text-[var(--green-primary)] transition-colors"
            aria-label="Volver al panel"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="font-display text-xl font-bold">Productos</h1>
            <p className="text-sm text-[var(--text-muted)]">{products.length} en el catálogo</p>
          </div>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="inline-flex items-center gap-2 rounded-full bg-[var(--green-primary)] text-white text-sm font-semibold px-5 py-2.5 hover:bg-[var(--green-primary-hover)] transition-colors"
        >
          <Plus size={16} /> Nuevo producto
        </Link>
      </div>

      {msg === "creado" && (
        <p className="rounded-xl bg-[var(--green-primary)]/10 px-4 py-3 text-sm font-semibold text-[var(--green-primary)]">
          Producto creado correctamente.
        </p>
      )}

      <ProductAdminTable products={products} />

      <p className="text-xs text-[var(--text-muted)]">
        Los cambios se reflejan en la tienda en segundos (ISR).
      </p>
    </main>
  );
}