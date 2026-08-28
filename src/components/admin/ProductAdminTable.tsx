"use client";

import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { deleteProductAction, setProductActiveAction } from "@/app/admin/actions";

export interface AdminProductRow {
  id: string;
  slug: string;
  name: string;
  price: number;
  stock: number;
  featured: boolean;
  bestSeller: boolean;
  isNew: boolean;
  active: boolean;
  category: { name: string };
}

export default function ProductAdminTable({ products }: { products: AdminProductRow[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function toggleActive(id: string, active: boolean) {
    startTransition(async () => {
      await setProductActiveAction(id, active);
      router.refresh();
    });
  }

  function remove(id: string) {
    if (!window.confirm("¿Eliminar este producto definitivamente?")) return;
    startTransition(async () => {
      await deleteProductAction(id);
      router.refresh();
    });
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-[var(--gray)] bg-white">
      <table className="w-full text-sm min-w-[720px]">
        <thead>
          <tr className="border-b border-[var(--gray)] text-left text-xs uppercase tracking-wide text-[var(--text-muted)]">
            <th className="px-4 py-3">Producto</th>
            <th className="px-4 py-3">Categoría</th>
            <th className="px-4 py-3">Precio</th>
            <th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3">Etiquetas</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b border-[var(--gray)] last:border-0 hover:bg-[var(--gray-light)]/60">
              <td className="px-4 py-3">
                <p className="font-semibold">{p.name}</p>
                <p className="text-xs text-[var(--text-muted)]">{p.slug}</p>
              </td>
              <td className="px-4 py-3 text-[var(--text-muted)]">{p.category.name}</td>
              <td className="px-4 py-3 font-medium">${p.price.toLocaleString("es-AR")}</td>
              <td className="px-4 py-3">
                <span className={p.stock === 0 ? "text-red-600 font-semibold" : "font-medium"}>{p.stock}</span>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {p.featured && (
                    <span className="rounded-full bg-[var(--green-primary)]/15 px-2 py-0.5 text-[11px] font-bold text-[var(--green-primary)]">
                      Destacado
                    </span>
                  )}
                  {p.bestSeller && (
                    <span className="rounded-full bg-[var(--green-primary)] px-2 py-0.5 text-[11px] font-bold text-white">
                      Best seller
                    </span>
                  )}
                  {p.isNew && (
                    <span className="rounded-full bg-[var(--green-primary)] px-2 py-0.5 text-[11px] font-bold text-white">
                      Nuevo
                    </span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => toggleActive(p.id, p.active)}
                  disabled={pending}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold transition-colors ${
                    p.active
                      ? "bg-[var(--green-primary)] text-white hover:bg-[var(--green-primary-hover)]"
                      : "bg-[var(--gray)] text-[var(--text-muted)] hover:bg-red-50 hover:text-red-600"
                  }`}
                  aria-label={p.active ? "Despublicar" : "Publicar"}
                >
                  {p.active ? <Eye size={12} /> : <EyeOff size={12} />}
                  {p.active ? "Publicado" : "Oculto"}
                </button>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/productos/${p.id}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--gray)] text-[var(--text-muted)] hover:border-[var(--green-primary)] hover:text-[var(--green-primary)] transition-colors"
                    aria-label={`Editar ${p.name}`}
                  >
                    <Pencil size={14} />
                  </Link>
                  <button
                    onClick={() => remove(p.id)}
                    disabled={pending}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--gray)] text-[var(--text-muted)] hover:border-red-300 hover:text-red-600 transition-colors"
                    aria-label={`Eliminar ${p.name}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}