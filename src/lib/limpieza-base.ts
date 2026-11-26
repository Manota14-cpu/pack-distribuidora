import "server-only";
import { prisma } from "@/lib/db";

/**
 * Restos de la app anterior en la base: todo lo que hay en el esquema public
 * que la web ya no usa. La web solo guarda estas dos tablas.
 */
const TABLAS_DE_LA_WEB = ["Lead", "NewsletterSubscriber"];

export interface Resto {
  tipo: "tabla" | "vista" | "funcion";
  nombre: string;
  /** Para funciones: los tipos de sus argumentos, que DROP FUNCTION necesita. */
  argumentos?: string;
  filas?: number;
}

export async function buscarRestos(): Promise<Resto[]> {
  const relaciones = await prisma.$queryRaw<Array<{ nombre: string; tipo: string }>>`
    select table_name as nombre, table_type as tipo
    from information_schema.tables
    where table_schema = 'public'
    order by table_name
  `;
  // Las funciones que traen las extensiones (pgcrypto y demás) no se tocan.
  const funciones = await prisma.$queryRaw<Array<{ nombre: string; argumentos: string }>>`
    select p.proname as nombre, pg_get_function_identity_arguments(p.oid) as argumentos
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and not exists (select 1 from pg_depend d where d.objid = p.oid and d.deptype = 'e')
    order by p.proname
  `;

  const restos: Resto[] = [];
  for (const r of relaciones) {
    if (TABLAS_DE_LA_WEB.includes(r.nombre)) continue;
    if (r.tipo === "VIEW") {
      restos.push({ tipo: "vista", nombre: r.nombre });
      continue;
    }
    const [{ n }] = await prisma.$queryRawUnsafe<Array<{ n: bigint }>>(
      `select count(*) as n from ${comillas(r.nombre)}`
    );
    restos.push({ tipo: "tabla", nombre: r.nombre, filas: Number(n) });
  }
  for (const f of funciones) restos.push({ tipo: "funcion", nombre: f.nombre, argumentos: f.argumentos });
  return restos;
}

/** Identificador de Postgres entre comillas, a salvo de nombres raros. */
function comillas(nombre: string): string {
  return `"${nombre.replace(/"/g, '""')}"`;
}

/** Borra todos los restos en una sola transacción: o se va todo, o nada. */
export async function borrarRestos(restos: Resto[]): Promise<void> {
  const sentencias = [
    ...restos.filter((r) => r.tipo === "vista").map((r) => `drop view if exists ${comillas(r.nombre)} cascade`),
    ...restos.filter((r) => r.tipo === "tabla").map((r) => `drop table if exists ${comillas(r.nombre)} cascade`),
    ...restos
      .filter((r) => r.tipo === "funcion")
      .map((r) => `drop function if exists ${comillas(r.nombre)}(${r.argumentos ?? ""}) cascade`),
  ];
  await prisma.$transaction(sentencias.map((sql) => prisma.$executeRawUnsafe(sql)));
}
