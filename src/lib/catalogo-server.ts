import "server-only";
import { CATALOGO_URL, normalizarCatalogo, type Catalogo, type CatalogoVA } from "./catalogo";

/** Cada cuánto el servidor vuelve a pedirle el catálogo a Visual App. */
export const CATALOGO_REVALIDATE = 60;

/**
 * Catálogo para las páginas del servidor. Se guarda un minuto: alcanza para que
 * precios y stock estén al día sin pedirle la lista a Visual App en cada visita.
 * El carrito igual vuelve a consultar precios y stock antes de enviar el pedido.
 */
export async function getCatalogo(): Promise<Catalogo> {
  const res = await fetch(CATALOGO_URL, { next: { revalidate: CATALOGO_REVALIDATE } });
  if (!res.ok) throw new Error(`Visual App respondió ${res.status} al pedir el catálogo.`);
  return normalizarCatalogo((await res.json()) as CatalogoVA);
}

/** Igual que getCatalogo, pero si Visual App no responde devuelve null en vez de romper la página. */
export async function getCatalogoSeguro(): Promise<Catalogo | null> {
  try {
    return await getCatalogo();
  } catch (e) {
    console.error("[catalogo]", e);
    return null;
  }
}
