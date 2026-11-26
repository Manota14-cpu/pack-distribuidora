import Link from "next/link";
import { ArrowLeft, Info, TriangleAlert } from "lucide-react";
import { prisma } from "@/lib/db";
import { categories as categoriasBase } from "@/lib/products";
import { descargarFeed, prepararImportacion, type Preparacion } from "@/lib/visual-app-sync";
import type { Cambio } from "@/lib/visual-app-import";
import ImportarVisualAppForm from "@/components/admin/ImportarVisualAppForm";

// Dar de alta cientos de productos puede llevar más que el límite por defecto.
// Vale también para la Server Action del botón.
export const maxDuration = 300;

function detalle(c: Cambio): string {
  const partes: string[] = [];
  if (c.name) partes.push(`nombre: ${c.name.despues}`);
  if (c.price) partes.push(`precio $${c.price.antes.toLocaleString("es-AR")} → $${c.price.despues.toLocaleString("es-AR")}`);
  if (c.stock) partes.push(`stock ${c.stock.antes} → ${c.stock.despues}`);
  if (c.active) partes.push(c.active.despues ? "vuelve a mostrarse" : "se oculta (no disponible)");
  if (c.imagenesNuevas.length) partes.push(`${c.imagenesNuevas.length} foto(s) nueva(s)`);
  return partes.join(" · ");
}

const CARD = "rounded-2xl border border-[var(--gray)] bg-white p-6";

export default async function ImportarPage() {
  let preparacion: Preparacion | null = null;
  let error: string | null = null;
  try {
    preparacion = await prepararImportacion(prisma, await descargarFeed());
  } catch (e) {
    error = e instanceof Error ? e.message : "No se pudo leer la lista de Visual App.";
  }

  const categorias = await prisma.category.findMany({ select: { slug: true, name: true } });
  const nombreCategoria = (slug: string) =>
    categorias.find((c) => c.slug === slug)?.name ?? categoriasBase.find((c) => c.slug === slug)?.name ?? slug;

  const plan = preparacion?.plan;
  const porCategoria = new Map<string, number>();
  for (const a of plan?.altas ?? []) porCategoria.set(a.categoria, (porCategoria.get(a.categoria) ?? 0) + 1);
  const faltantes = plan?.faltantes.filter((p) => p.active) ?? [];
  const hayCambios = Boolean(plan && (plan.altas.length || plan.cambios.length));

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
          <h1 className="font-display text-xl font-bold">Importar de Visual App</h1>
          <p className="text-sm text-[var(--text-muted)]">
            Trae los productos, precios, stock y fotos del sistema del local.
          </p>
        </div>
      </div>

      {error && (
        <p role="alert" className="flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          <TriangleAlert size={16} className="mt-0.5 shrink-0" /> {error}
        </p>
      )}

      {plan && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className={CARD}>
              <p className="text-sm font-semibold text-[var(--text-muted)]">Productos nuevos</p>
              <p className="font-display text-3xl font-bold mt-2">{plan.altas.length}</p>
            </div>
            <div className={CARD}>
              <p className="text-sm font-semibold text-[var(--text-muted)]">Para actualizar</p>
              <p className="font-display text-3xl font-bold mt-2">{plan.cambios.length}</p>
            </div>
            <div className={CARD}>
              <p className="text-sm font-semibold text-[var(--text-muted)]">Ya al día</p>
              <p className="font-display text-3xl font-bold mt-2">{plan.sinCambios}</p>
            </div>
          </div>

          <div className={`${CARD} flex flex-col gap-5`}>
            <h2 className="font-display text-lg font-bold">Qué va a pasar</h2>

            {!hayCambios && faltantes.length === 0 && (
              <p className="text-sm text-[var(--text-muted)]">
                La tienda ya está igual que Visual App. No hay nada para importar.
              </p>
            )}

            {plan.altas.length > 0 && (
              <div>
                <p className="text-sm font-semibold mb-2">Se crean {plan.altas.length} productos, en estas categorías:</p>
                <ul className="grid gap-1 text-sm sm:grid-cols-2">
                  {[...porCategoria]
                    .sort((a, b) => b[1] - a[1])
                    .map(([slug, n]) => (
                      <li key={slug} className="flex justify-between rounded-lg bg-[var(--gray-light)] px-3 py-1.5">
                        <span>{nombreCategoria(slug)}</span>
                        <span className="font-semibold tabular-nums">{n}</span>
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {plan.cambios.length > 0 && (
              <details className="text-sm" open={plan.cambios.length <= 10}>
                <summary className="cursor-pointer font-semibold">Se actualizan {plan.cambios.length} productos</summary>
                <ul className="mt-2 flex flex-col gap-1">
                  {plan.cambios.map((c) => (
                    <li key={c.id} className="rounded-lg bg-[var(--gray-light)] px-3 py-1.5">
                      <span className="font-medium">{c.name?.antes ?? c.nombre}</span>
                      <span className="block text-[var(--text-muted)]">{detalle(c)}</span>
                    </li>
                  ))}
                </ul>
              </details>
            )}

            {faltantes.length > 0 && (
              <details className="text-sm">
                <summary className="cursor-pointer font-semibold">
                  {faltantes.length} productos de la tienda no están en Visual App
                </summary>
                <ul className="mt-2 list-disc pl-5 text-[var(--text-muted)]">
                  {faltantes.map((p) => (
                    <li key={p.id}>{p.name}</li>
                  ))}
                </ul>
              </details>
            )}

            <p className="flex items-start gap-2 rounded-xl bg-[var(--gray-light)] p-3 text-sm text-[var(--text-muted)]">
              <Info size={16} className="mt-0.5 shrink-0 text-[var(--green-primary)]" />
              <span>
                El stock queda como dice Visual App. Si vendiste algo por la web y no lo descontaste allá,
                al importar vuelve al número de Visual App. Las descripciones y categorías que cambies en
                AppPack no se pisan.
              </span>
            </p>

            <ImportarVisualAppForm hayCambios={hayCambios} faltantes={faltantes.length} />
          </div>
        </>
      )}
    </main>
  );
}
