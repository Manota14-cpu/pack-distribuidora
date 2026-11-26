"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, MessageCircle, Share2, ShoppingCart, Zap } from "lucide-react";
import { importe, paso, plata, type Producto } from "@/lib/catalogo";
import { useCarrito } from "@/lib/carrito";
import { STORE_INFO } from "@/lib/content";
import CantidadControl from "./CantidadControl";

export default function AccionesProducto({ producto }: { producto: Producto }) {
  const router = useRouter();
  const { agregar, cantidadDe, abrir } = useCarrito();
  const [cantidad, setCantidad] = useState(paso(producto));
  const [compartido, setCompartido] = useState(false);
  const enCarrito = cantidadDe(producto.id);
  const sinStock = !producto.disponible || producto.stock === 0;

  function alCarrito() {
    agregar(producto, cantidad);
    abrir();
  }

  function comprarAhora() {
    agregar(producto, cantidad);
    router.push("/carrito");
  }

  async function compartir() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: producto.nombre, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCompartido(true);
      setTimeout(() => setCompartido(false), 2500);
    } catch {
      // El cliente canceló el menú de compartir: no pasa nada.
    }
  }

  const consulta = `${STORE_INFO.whatsapp}?text=${encodeURIComponent(
    `Hola! Quería consultar por: ${producto.nombre}`
  )}`;

  return (
    <div className="flex flex-col gap-4">
      {sinStock ? (
        <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">
          <p className="font-semibold">Sin stock por ahora.</p>
          <p className="mt-1">Escribinos y te avisamos cuando vuelva a entrar.</p>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-4">
            <CantidadControl producto={producto} cantidad={cantidad} onChange={(c) => setCantidad(Math.max(paso(producto), c))} />
            <p className="text-sm text-[var(--text-muted)]">
              Subtotal <strong className="text-[var(--text)] tabular-nums">{plata(importe(producto, cantidad))}</strong>
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={alCarrito}
              className="flex items-center justify-center gap-2 rounded-full bg-[var(--green-primary)] px-6 py-3.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[var(--green-primary-hover)]"
            >
              <ShoppingCart size={17} /> Agregar al carrito
            </button>
            <button
              type="button"
              onClick={comprarAhora}
              className="flex items-center justify-center gap-2 rounded-full border-2 border-[var(--green-primary)] px-6 py-3 text-sm font-bold text-[var(--green-primary)] transition-colors hover:bg-[var(--green-primary)]/5"
            >
              <Zap size={17} /> Comprar ahora
            </button>
          </div>
          {enCarrito > 0 && (
            <p className="flex items-center gap-1.5 text-sm font-medium text-[var(--green-primary)]">
              <Check size={16} /> Ya tenés este producto en el carrito.
            </p>
          )}
        </>
      )}

      <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
        <a
          href={consulta}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-semibold text-[var(--green-primary)] hover:underline"
        >
          <MessageCircle size={16} /> Consultar por WhatsApp
        </a>
        <button
          type="button"
          onClick={compartir}
          className="inline-flex items-center gap-1.5 font-semibold text-[var(--text-muted)] hover:text-[var(--green-primary)]"
        >
          {compartido ? <Check size={16} /> : <Share2 size={16} />}
          {compartido ? "Link copiado" : "Compartir"}
        </button>
      </div>
    </div>
  );
}
