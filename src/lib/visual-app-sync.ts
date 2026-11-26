/**
 * La parte de la importación de Visual App que lee y escribe la base.
 *
 * La usan el botón del panel (/admin/importar) y el script
 * `npm run db:import-visual`. Recibe el PrismaClient de afuera para que el
 * script, que corre fuera de Next, pueda pasar el suyo.
 *
 * El stock no se escribe directo: pasa por ajustar_stock(), igual que una
 * venta, así cada diferencia queda en el historial de movimientos. Los cambios
 * de precio dejan su renglón en PriceChange.
 */
import { Prisma, type PrismaClient } from "@prisma/client";
import { categories as categoriasBase } from "./products";
import {
  VISUAL_APP_FEED_URL,
  planificarImportacion,
  visualAppFeedSchema,
  type Alta,
  type Cambio,
  type PlanDeImportacion,
  type VisualAppFeed,
} from "./visual-app-import";

const MOTIVO = "Importado de Visual App";

/** Cuántos productos se escriben a la vez. */
const EN_PARALELO = 5;

export async function descargarFeed(url: string = VISUAL_APP_FEED_URL): Promise<VisualAppFeed> {
  const res = await fetch(url, { headers: { accept: "application/json" }, cache: "no-store" });
  if (!res.ok) throw new Error(`Visual App respondió ${res.status} al pedir los productos.`);
  return parsearFeed(await res.json());
}

export function parsearFeed(crudo: unknown): VisualAppFeed {
  const parsed = visualAppFeedSchema.safeParse(crudo);
  if (!parsed.success) {
    throw new Error(`La lista de Visual App no tiene el formato esperado: ${parsed.error.issues[0]?.message}`);
  }
  return parsed.data;
}

export interface Preparacion {
  plan: PlanDeImportacion;
  /** Categorías que hay que crear antes de dar de alta. */
  categoriasACrear: string[];
}

export async function prepararImportacion(prisma: PrismaClient, feed: VisualAppFeed): Promise<Preparacion> {
  const [categorias, existentes] = await Promise.all([
    prisma.category.findMany({ select: { slug: true } }),
    prisma.product.findMany({
      select: {
        id: true,
        slug: true,
        name: true,
        price: true,
        stockAvailable: true,
        active: true,
        images: { select: { url: true } },
      },
    }),
  ]);

  const plan = planificarImportacion(
    feed,
    existentes.map(({ images, ...p }) => ({ ...p, imageUrls: images.map((i) => i.url) }))
  );
  const enBase = new Set(categorias.map((c) => c.slug));
  const categoriasACrear = [...new Set(plan.altas.map((a) => a.categoria))].filter((s) => !enBase.has(s));
  return { plan, categoriasACrear };
}

function descripciones(alta: Alta) {
  const venta = alta.unit === "kg" ? "Se vende por kilo." : `Se vende por ${alta.unit}.`;
  return { description: venta, longDescription: `${alta.name}. ${venta}` };
}

async function crear(prisma: PrismaClient, alta: Alta, categoria: { id: string; icon: string }) {
  await prisma.$transaction(async (tx) => {
    await tx.product.create({
      data: {
        // El id de Visual App queda como id del producto: la próxima importación
        // lo encuentra por acá aunque le cambien el nombre.
        id: alta.feedId,
        slug: alta.slug,
        name: alta.name,
        categoryId: categoria.id,
        ...descripciones(alta),
        features: "[]",
        price: alta.price,
        stockAvailable: 0,
        unit: alta.unit,
        icon: categoria.icon,
        active: alta.active,
        images: {
          create: alta.imagenes.map((url, i) => ({ url, alt: alta.name, sortOrder: i })),
        },
      },
    });
    if (alta.stock > 0) {
      // $executeRaw y no $queryRaw: no importa qué devuelva la función.
      await tx.$executeRaw`
        select ajustar_stock(${alta.feedId}::text, ${alta.stock}::int, ${MOTIVO}::text, 'creacion'::text)
      `;
    }
  });
}

async function actualizar(prisma: PrismaClient, cambio: Cambio) {
  await prisma.$transaction(async (tx) => {
    const data: Prisma.ProductUpdateInput = {};
    if (cambio.name) data.name = cambio.name.despues;
    if (cambio.price) data.price = cambio.price.despues;
    if (cambio.active) data.active = cambio.active.despues;

    if (cambio.price) {
      const actual = await tx.product.findUniqueOrThrow({
        where: { id: cambio.id },
        select: { costPrice: true },
      });
      await tx.priceChange.create({
        data: {
          productId: cambio.id,
          oldPrice: cambio.price.antes,
          newPrice: cambio.price.despues,
          oldCostPrice: actual.costPrice,
          newCostPrice: actual.costPrice,
          reason: MOTIVO,
        },
      });
    }
    if (Object.keys(data).length) {
      await tx.product.update({ where: { id: cambio.id }, data });
    }
    if (cambio.imagenesNuevas.length) {
      const ultima = await tx.productImage.aggregate({
        where: { productId: cambio.id },
        _max: { sortOrder: true },
      });
      const desde = (ultima._max.sortOrder ?? -1) + 1;
      await tx.productImage.createMany({
        data: cambio.imagenesNuevas.map((url, i) => ({ productId: cambio.id, url, sortOrder: desde + i })),
      });
    }
    if (cambio.stock) {
      // La diferencia se calcula contra el stock de este momento, no contra el
      // de la vista previa: si entró una venta en el medio, igual termina en el
      // número de Visual App.
      const actual = await tx.product.findUniqueOrThrow({
        where: { id: cambio.id },
        select: { stockAvailable: true },
      });
      const delta = cambio.stock.despues - actual.stockAvailable;
      if (delta !== 0) {
        await tx.$executeRaw`
          select ajustar_stock(${cambio.id}::text, ${delta}::int, ${MOTIVO}::text, 'ajuste'::text)
        `;
      }
    }
  });
}

async function enTandas<T>(items: T[], fn: (item: T) => Promise<void>) {
  for (let i = 0; i < items.length; i += EN_PARALELO) {
    await Promise.all(items.slice(i, i + EN_PARALELO).map(fn));
  }
}

export interface ResultadoImportacion {
  altas: number;
  cambios: number;
  desactivados: number;
  errores: Array<{ producto: string; mensaje: string }>;
}

export async function aplicarImportacion(
  prisma: PrismaClient,
  { plan, categoriasACrear }: Preparacion,
  opciones: { desactivarFaltantes?: boolean } = {}
): Promise<ResultadoImportacion> {
  for (const slug of categoriasACrear) {
    const def = categoriasBase.find((c) => c.slug === slug);
    if (!def) throw new Error(`No sé cómo crear la categoría "${slug}".`);
    await prisma.category.upsert({
      where: { slug },
      update: {},
      create: { slug: def.slug, name: def.name, icon: def.icon, description: def.description },
    });
  }
  const categoriaPorSlug = new Map((await prisma.category.findMany()).map((c) => [c.slug, c]));

  const resultado: ResultadoImportacion = { altas: 0, cambios: 0, desactivados: 0, errores: [] };
  const anotarError = (producto: string, e: unknown) =>
    resultado.errores.push({ producto, mensaje: e instanceof Error ? e.message : String(e) });

  await enTandas(plan.altas, async (alta) => {
    try {
      await crear(prisma, alta, categoriaPorSlug.get(alta.categoria)!);
      resultado.altas++;
    } catch (e) {
      anotarError(alta.name, e);
    }
  });
  await enTandas(plan.cambios, async (cambio) => {
    try {
      await actualizar(prisma, cambio);
      resultado.cambios++;
    } catch (e) {
      anotarError(cambio.nombre, e);
    }
  });

  if (opciones.desactivarFaltantes) {
    const ids = plan.faltantes.filter((p) => p.active).map((p) => p.id);
    if (ids.length) {
      const { count } = await prisma.product.updateMany({ where: { id: { in: ids } }, data: { active: false } });
      resultado.desactivados = count;
    }
  }
  return resultado;
}
