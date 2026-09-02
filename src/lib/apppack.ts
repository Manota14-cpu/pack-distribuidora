/**
 * Dónde vive AppPack, el panel con el que se administran el catálogo y el stock.
 *
 * AppPack trabaja sobre la misma tabla `Product` que muestra esta tienda, así
 * que lo que se cambia allá es lo que ve el cliente acá (con hasta un minuto de
 * demora por el cacheo de las páginas).
 *
 * Se puede sobrescribir con NEXT_PUBLIC_APPPACK_URL si algún día cambia el
 * dominio, sin tocar código.
 */
export const APPPACK_URL =
  process.env.NEXT_PUBLIC_APPPACK_URL?.replace(/\/$/, "") ?? "https://apppack.vercel.app";

export const APPPACK_PRODUCTOS = `${APPPACK_URL}/productos`;

/** Gestión de pedidos: estados, datos del cliente y descuento de stock. */
export const APPPACK_PEDIDOS = `${APPPACK_URL}/pedidos`;
