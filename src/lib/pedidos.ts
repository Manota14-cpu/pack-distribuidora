/**
 * Envío de pedidos y de arrepentimientos a Visual App, desde el navegador.
 * Es lo mismo que hacía la tienda de Visual App embebida: mismos datos, mismo
 * lugar. Visual App descuenta el stock, avisa al negocio y, si el cliente
 * elige Mercado Pago, devuelve el link de pago.
 */
import { VISUAL_APP_ORIGIN, VISUAL_APP_TIENDA } from "./visual-app";

const BASE = `${VISUAL_APP_ORIGIN}/tienda/${VISUAL_APP_TIENDA}`;

export const POLITICA_PRIVACIDAD_URL = `${VISUAL_APP_ORIGIN}/legal/privacidad`;

export interface DatosPedido {
  cliente: string;
  telefono: string;
  entrega: "retiro" | "envio";
  direccion?: string;
  /** Solo si la tienda tiene Mercado Pago activo. */
  pago?: "mercadopago" | "acordar";
  notas?: string;
  items: Array<{ id: string; cantidad: number }>;
  /** Adónde vuelve el cliente después de pagar con Mercado Pago. */
  vuelta?: string;
}

export interface RespuestaPedido {
  numero: number;
  total: number;
  /** Link de Mercado Pago, si eligió pagar ahora. */
  pagar?: string;
  /** Si Mercado Pago falló, el pedido igual queda anotado y viene el motivo. */
  errorPago?: string;
}

async function enviar<T>(ruta: string, datos: unknown, errorPorDefecto: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE}/${ruta}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // `sitio` es el campo trampa contra bots que espera Visual App: va vacío.
      body: JSON.stringify({ ...(datos as object), sitio: "" }),
    });
  } catch {
    throw new Error("No hay conexión. Revisá internet y probá de nuevo.");
  }
  const cuerpo = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) throw new Error(cuerpo.error || errorPorDefecto);
  return cuerpo as T;
}

export function enviarPedido(datos: DatosPedido): Promise<RespuestaPedido> {
  return enviar<RespuestaPedido>("pedido", datos, "No se pudo enviar el pedido. Probá de nuevo.");
}

export interface DatosArrepentimiento {
  cliente: string;
  telefono: string;
  pedido?: string;
  motivo?: string;
}

export function enviarArrepentimiento(datos: DatosArrepentimiento): Promise<{ codigo: string }> {
  return enviar<{ codigo: string }>("arrepentimiento", datos, "No se pudo enviar. Probá de nuevo.");
}

/** Mensaje para el cliente al volver de Mercado Pago (según los parámetros de la URL). */
export function mensajeVueltaDePago(params: URLSearchParams): { ok: boolean; texto: string } | null {
  const estado = params.get("collection_status") || (params.get("external_reference") ? params.get("status") : null);
  if (!estado) return null;
  if (estado === "approved") return { ok: true, texto: "¡Listo! Tu pago quedó aprobado y ya estamos preparando tu pedido." };
  if (estado === "pending" || estado === "in_process") {
    return { ok: true, texto: "Tu pago quedó pendiente. Cuando Mercado Pago lo apruebe, lo vemos y te avisamos." };
  }
  return { ok: false, texto: "El pago no se completó. Tu pedido quedó anotado: te escribimos para coordinar el cobro." };
}
