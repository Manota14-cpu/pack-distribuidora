/**
 * Trae el catálogo de Visual App a la base de la tienda (la misma de AppPack).
 * Hace lo mismo que el botón de /admin/importar, para quien prefiera la terminal.
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
 */
import { readFile } from "node:fs/promises";
import { PrismaClient } from "@prisma/client";
import type { Cambio } from "../src/lib/visual-app-import";
import {
  aplicarImportacion,
  descargarFeed,
  parsearFeed,
  prepararImportacion,
} from "../src/lib/visual-app-sync";

function opcion(nombre: string): string | undefined {
  const pref = `--${nombre}=`;
  return process.argv.find((a) => a.startsWith(pref))?.slice(pref.length);
}
const aplicar = process.argv.includes("--apply");
const desactivarFaltantes = process.argv.includes("--desactivar-faltantes");

const prisma = new PrismaClient();

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
  const archivo = opcion("archivo");
  const feed = archivo
    ? parsearFeed(JSON.parse(await readFile(archivo, "utf8")))
    : await descargarFeed(opcion("url"));
  console.log(`Feed: ${feed.negocio ?? "sin nombre"}, ${feed.productos.length} productos.`);

  const preparacion = await prepararImportacion(prisma, feed);
  const { plan, categoriasACrear } = preparacion;

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
  if (categoriasACrear.length) console.log(`Categorías a crear: ${categoriasACrear.join(", ")}`);
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

  const r = await aplicarImportacion(prisma, preparacion, { desactivarFaltantes });
  for (const e of r.errores) console.error(`✗ ${e.producto}: ${e.mensaje}`);
  console.log(
    `\nListo: ${r.altas} altas, ${r.cambios} cambios, ${r.desactivados} dados de baja, ${r.errores.length} con error.` +
      " La tienda lo muestra en hasta un minuto."
  );
  if (r.errores.length) process.exitCode = 1;
}

main()
  .catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
