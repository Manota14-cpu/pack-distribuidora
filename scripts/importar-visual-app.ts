/**
 * Trae el catálogo de Visual App a la base de la tienda (la misma de AppPack).
 *
 *   npm run db:import-visual                 → muestra qué cambiaría, no escribe nada
 *   npm run db:import-visual -- --apply      → aplica los cambios
 *
 * Opciones:
 *   --apply                  escribe en la base. Sin esto es solo una vista previa.
 *   --desactivar-faltantes   da de baja (active = false) los productos de la base
 *                            que no están en el feed. No borra nada.
 *   --archivo=<ruta>         lee el JSON de un archivo en vez de la URL.
 *   --url=<url>              otra URL de feed.
 *
 * El stock no se escribe directo: pasa por ajustar_stock(), igual que una venta,
 * así cada diferencia queda en el historial de movimientos. Los cambios de
 * precio dejan su renglón en PriceChange.
 */
import { readFile } from "node:fs/promises";
import { Prisma, PrismaClient } from "@prisma/client";
import { categories as categoriasBase } from "../src/lib/products";
import {
  VISUAL_APP_FEED_URL,
  planificarImportacion,
  visualAppFeedSchema,
  type Alta,
  type Cambio,
} from "../src/lib/visual-app-import";

const MOTIVO = "Importado de Visual App";

function opcion(nombre: string): string | undefined {
  const pref = `--${nombre}=`;
  return process.argv.find((a) => a.startsWith(pref))?.slice(pref.length);
}
const aplicar = process.argv.includes("--apply");
const desactivarFaltantes = process.argv.includes("--desactivar-faltantes");

async function leerFeed() {
  const archivo = opcion("archivo");
  let crudo: unknown;
  if (archivo) {
    crudo = JSON.parse(await readFile(archivo, "utf8"));
  } else {
    const url = opcion("url") ?? VISUAL_APP_FEED_URL;
    const res = await fetch(url, { headers: { accept: "application/json" } });
    if (!res.ok) throw new Error(`El feed respondió ${res.status} (${url})`);
    crudo = await res.json();
  }
  const parsed = visualAppFeedSchema.safeParse(crudo);
  if (!parsed.success) {
    throw new Error(`El feed no tiene el formato esperado: ${parsed.error.issues[0]?.message}`);
  }
  return parsed.data;
}

const prisma = new PrismaClient();

function descripciones(alta: Alta) {
  const venta = alta.unit === "kg" ? "Se vende por kilo." : `Se vende por ${alta.unit}.`;
  return { description: venta, longDescription: `${alta.name}. ${venta}` };
}

async function crear(alta: Alta, categoria: { id: string; icon: string }) {
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
      await tx.$executeRaw`
        select ajustar_stock(${alta.feedId}::text, ${alta.stock}::int, ${MOTIVO}::text, 'creacion'::text)
      `;
    }
  });
}

async function actualizar(cambio: Cambio) {
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
        data: cambio.imagenesNuevas.map((url, i) => ({
          productId: cambio.id,
          url,
          sortOrder: desde + i,
        })),
      });
    }
    if (cambio.stock) {
      // La diferencia se calcula contra el stock de este momento, no contra el
      // de la vista previa: si entró una venta en el medio, igual termina en el
      // número del feed.
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

function linea(c: Cambio): string {
  const partes: string[] = [];
  if (c.name) partes.push(`nombre "${c.name.antes}" → "${c.name.despues}"`);
  if (c.price) partes.push(`precio ${c.price.antes} → ${c.price.despues}`);
  if (c.stock) partes.push(`stock ${c.stock.antes} → ${c.stock.despues}`);
  if (c.active) partes.push(c.active.despues ? "se reactiva" : "se da de baja");
  if (c.imagenesNuevas.length) partes.push(`+${c.imagenesNuevas.length} foto(s)`);
  const via = c.coincidencia === "nombre" ? " (encontrado por nombre)" : "";
  return `  ~ ${c.id}${via}: ${partes.join(", ")}`;
}

async function main() {
  const feed = await leerFeed();
  console.log(`Feed: ${feed.negocio ?? "sin nombre"}, ${feed.productos.length} productos.`);

  const [categorias, existentes] = await Promise.all([
    prisma.category.findMany(),
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
    existentes.map((p) => ({ ...p, imageUrls: p.images.map((i) => i.url) }))
  );

  // Categorías que hacen falta y no están en la base.
  const faltan = [...new Set(plan.altas.map((a) => a.categoria))].filter(
    (slug) => !categorias.some((c) => c.slug === slug)
  );

  console.log(`\nAltas: ${plan.altas.length}`);
  const porCategoria = new Map<string, number>();
  for (const a of plan.altas) porCategoria.set(a.categoria, (porCategoria.get(a.categoria) ?? 0) + 1);
  for (const [slug, n] of [...porCategoria].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${slug.padEnd(18)} ${n}`);
  }
  const sinRegla = plan.altas.filter((a) => a.categoriaOrigen === "defecto");
  if (sinRegla.length) {
    console.log(`  (${sinRegla.length} sin regla, van a la categoría por defecto:)`);
    for (const a of sinRegla) console.log(`    - ${a.name}`);
  }
  console.log(`Cambios: ${plan.cambios.length}`);
  for (const c of plan.cambios) console.log(linea(c));
  console.log(`Sin cambios: ${plan.sinCambios}`);
  if (faltan.length) console.log(`Categorías a crear: ${faltan.join(", ")}`);
  for (const d of plan.descartados) console.log(`Ignorado: ${d.nombre} (${d.motivo})`);

  const faltantesActivos = plan.faltantes.filter((p) => p.active);
  if (faltantesActivos.length) {
    console.log(
      `\n${faltantesActivos.length} producto(s) activos de la base no están en el feed` +
        (desactivarFaltantes ? " y se darán de baja:" : " (se dejan como están; --desactivar-faltantes los da de baja):")
    );
    for (const p of faltantesActivos) console.log(`  - ${p.name}`);
  }

  if (!aplicar) {
    console.log("\nVista previa: no se escribió nada. Para aplicar: npm run db:import-visual -- --apply");
    return;
  }

  for (const slug of faltan) {
    const def = categoriasBase.find((c) => c.slug === slug);
    if (!def) throw new Error(`No sé cómo crear la categoría "${slug}"`);
    await prisma.category.create({
      data: { slug: def.slug, name: def.name, icon: def.icon, description: def.description },
    });
  }
  const categoriaPorSlug = new Map((await prisma.category.findMany()).map((c) => [c.slug, c]));

  let errores = 0;
  for (const alta of plan.altas) {
    try {
      await crear(alta, categoriaPorSlug.get(alta.categoria)!);
    } catch (e) {
      errores++;
      console.error(`✗ Alta de "${alta.name}":`, e instanceof Error ? e.message : e);
    }
  }
  for (const cambio of plan.cambios) {
    try {
      await actualizar(cambio);
    } catch (e) {
      errores++;
      console.error(`✗ Cambio de ${cambio.id}:`, e instanceof Error ? e.message : e);
    }
  }
  if (desactivarFaltantes && faltantesActivos.length) {
    await prisma.product.updateMany({
      where: { id: { in: faltantesActivos.map((p) => p.id) } },
      data: { active: false },
    });
  }

  console.log(
    `\nListo: ${plan.altas.length} altas y ${plan.cambios.length} cambios intentados, ${errores} con error.` +
      " La tienda lo muestra en hasta un minuto."
  );
  if (errores) process.exitCode = 1;
}

main()
  .catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
