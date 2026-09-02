import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { clientIp, rateLimit } from "@/lib/rate-limit";

/**
 * AppPack avisa por acá que el catálogo cambió.
 *
 * Sin este aviso, las páginas de productos se sirven cacheadas hasta 60
 * segundos y, por el revalidado en segundo plano de Vercel, la primera visita
 * después de un cambio todavía devuelve la copia vieja: había que refrescar
 * dos veces para ver un precio nuevo. Con el aviso se ve en el próximo reload.
 *
 * Se autentica con un secreto compartido en la cabecera. No lleva datos: solo
 * dice "esto cambió", y la tienda vuelve a leer de la base por su cuenta.
 */
export async function POST(req: NextRequest) {
  const secreto = process.env.REVALIDATE_SECRET;
  if (!secreto) {
    return NextResponse.json({ error: "Revalidación no configurada." }, { status: 501 });
  }

  // El endpoint es público: sin límite, sirve para hacer trabajar al servidor
  // de arriba abajo con un bucle de peticiones.
  const rl = rateLimit(`revalidate:${clientIp(req.headers)}`, { limit: 60, windowSeconds: 60 });
  if (!rl.ok) {
    return NextResponse.json({ error: "Demasiadas peticiones." }, { status: 429 });
  }

  if (req.headers.get("x-apppack-secret") !== secreto) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  let slugs: string[] = [];
  try {
    const body: unknown = await req.json();
    const crudos = (body as { slugs?: unknown })?.slugs;
    if (Array.isArray(crudos)) {
      slugs = crudos
        .filter((s): s is string => typeof s === "string")
        // Un slug es un segmento de URL: cualquier cosa con barras o puntos
        // sería un intento de salirse de /productos/.
        .filter((s) => /^[a-z0-9-]{1,120}$/.test(s))
        .slice(0, 50);
    }
  } catch {
    // Un cuerpo vacío o mal formado igual revalida el listado: es lo que más
    // se mira y no hay motivo para rechazar el aviso por eso.
  }

  revalidatePath("/");
  revalidatePath("/productos");
  for (const slug of slugs) revalidatePath(`/productos/${slug}`);

  return NextResponse.json({ ok: true, revalidadas: 2 + slugs.length });
}
