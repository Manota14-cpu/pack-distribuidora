import Link from "next/link";
import { ArrowLeft, ExternalLink, Info } from "lucide-react";
import { prisma } from "@/lib/db";

/**
 * Vista de solo lectura del catálogo.
 *
 * El catálogo y el stock se administran desde AppPack, que trabaja sobre esta
 * misma tabla `Product`. Editar desde dos lugares distintos era la vía segura
 * para que los números se contradijeran, así que acá quedó solo la consulta.
 */
export default async function AdminProductsPage() {
  const rows = await prisma.product.findMany({
    include: { category: true },
    orderBy: { name: "asc" },
  });

  const sinStock = rows.filter((p) => p.stockAvailable === 0).length;
  const porReponer = rows.filter((p) => p.stockAvailable > 0 && p.stockAvailable <= p.minStock).length;

  return (
    <main className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--gray)] bg-white text-[var(--text-muted)] transition-colors hover:text-[var(--green-primary)]"
          aria-label="Volver al panel"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="font-display text-xl font-bold">Productos</h1>
          <p className="text-sm text-[var(--text-muted)]">
            {rows.length} en el catálogo
            {porReponer > 0 && ` · ${porReponer} por reponer`}
            {sinStock > 0 && ` · ${sinStock} sin stock`}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-[var(--gray)] bg-[var(--gray-light)] p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-start gap-2 text-sm text-[var(--text-muted)]">
          <Info size={16} className="mt-0.5 shrink-0 text-[var(--green-primary)]" />
          <span>
            El catálogo y el stock se editan desde <strong className="text-[var(--text)]">AppPack</strong>.
            Los cambios aparecen acá en menos de un minuto.
          </span>
        </p>
        <a
          href="http://localhost:3101/productos"
          target="_blank"
          rel="noreferrer"
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[var(--green-primary)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--green-primary-hover)]"
        >
          Abrir AppPack <ExternalLink size={14} />
        </a>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[var(--gray)] bg-white">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-[var(--gray)] text-left text-xs uppercase tracking-wide text-[var(--text-muted)]">
              <th className="px-4 py-3 font-semibold">Producto</th>
              <th className="px-4 py-3 font-semibold">Categoría</th>
              <th className="px-4 py-3 text-right font-semibold">Precio</th>
              <th className="px-4 py-3 text-right font-semibold">Stock</th>
              <th className="px-4 py-3 font-semibold">Estado</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => {
              const agotado = p.stockAvailable === 0;
              const bajo = !agotado && p.stockAvailable <= p.minStock;
              return (
                <tr key={p.id} className="border-b border-[var(--gray)] last:border-0">
                  <td className="px-4 py-3">
                    <span className="font-medium">{p.name}</span>
                    {p.sku && <span className="ml-2 text-xs text-[var(--text-muted)]">{p.sku}</span>}
                  </td>
                  <td className="px-4 py-3 text-[var(--text-muted)]">{p.category.name}</td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    ${p.price.toLocaleString("es-AR")}
                  </td>
                  <td
                    className={`px-4 py-3 text-right font-medium tabular-nums ${
                      agotado ? "text-red-600" : bajo ? "text-amber-600" : ""
                    }`}
                  >
                    {p.stockAvailable}
                  </td>
                  <td className="px-4 py-3">
                    {!p.active ? (
                      <span className="text-xs text-[var(--text-muted)]">Oculto</span>
                    ) : agotado ? (
                      <span className="text-xs font-semibold text-red-600">Sin stock</span>
                    ) : bajo ? (
                      <span className="text-xs font-semibold text-amber-600">Por reponer</span>
                    ) : (
                      <span className="text-xs text-[var(--green-primary)]">En stock</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
