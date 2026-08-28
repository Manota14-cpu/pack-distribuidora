import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCategories } from "@/lib/data/products";
import { createProductAction } from "../../../actions";
import AdminProductForm from "@/components/admin/AdminProductForm";

export default async function AdminNewProductPage() {
  const categories = await getCategories();

  return (
    <main className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/productos"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--gray)] bg-white text-[var(--text-muted)] hover:text-[var(--green-primary)] transition-colors"
          aria-label="Volver a productos"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="font-display text-xl font-bold">Nuevo producto</h1>
          <p className="text-sm text-[var(--text-muted)]">Completá los datos para darlo de alta.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--gray)] bg-white p-6 sm:p-8">
        <AdminProductForm
          categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
          initial={null}
          action={createProductAction}
        />
      </div>
    </main>
  );
}