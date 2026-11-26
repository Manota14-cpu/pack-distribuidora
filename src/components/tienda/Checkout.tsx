"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Handshake,
  Loader2,
  MessageCircle,
  ShoppingCart,
  Store,
  Trash2,
  Truck,
} from "lucide-react";
import { CATALOGO_URL, importe, normalizarCatalogo, plata, type Catalogo, type CatalogoVA } from "@/lib/catalogo";
import { useCarrito, type CambioDeCarrito } from "@/lib/carrito";
import { enviarPedido, mensajeVueltaDePago, POLITICA_PRIVACIDAD_URL, type RespuestaPedido } from "@/lib/pedidos";
import { STORE_INFO } from "@/lib/content";
import ProductoImagen from "./ProductoImagen";
import CantidadControl from "./CantidadControl";

/** Datos del cliente guardados en su navegador para la próxima compra. */
const CLAVE_DATOS = "pack-datos-cliente";

interface Datos {
  cliente: string;
  telefono: string;
  entrega: "retiro" | "envio";
  direccion: string;
  pago: "mercadopago" | "acordar";
  notas: string;
}

const VACIO: Datos = { cliente: "", telefono: "", entrega: "retiro", direccion: "", pago: "mercadopago", notas: "" };

/**
 * Datos de la compra anterior, si el cliente ya compró desde este navegador.
 * En el servidor no hay navegador: arranca vacío. El formulario recién se
 * muestra cuando el carrito está cargado (ya en el navegador), así que lo leído
 * acá nunca choca con lo que dibujó el servidor.
 */
function datosGuardados(): Datos {
  if (typeof window === "undefined") return VACIO;
  try {
    const guardados = JSON.parse(localStorage.getItem(CLAVE_DATOS) ?? "null");
    return guardados ? { ...VACIO, ...guardados, notas: "" } : VACIO;
  } catch {
    return VACIO;
  }
}

async function catalogoFresco(): Promise<Catalogo> {
  const r = await fetch(CATALOGO_URL, { cache: "no-cache" });
  if (!r.ok) throw new Error("No pudimos consultar precios y stock. Probá de nuevo en un momento.");
  return normalizarCatalogo((await r.json()) as CatalogoVA);
}

const INPUT =
  "w-full rounded-xl border border-[var(--gray)] bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--green-primary)]";

export default function Checkout() {
  const params = useSearchParams();
  const vueltaDePago = mensajeVueltaDePago(params);
  const { cargado, renglones, subtotal, setCantidad, quitar, vaciar, sincronizar } = useCarrito();

  const [catalogo, setCatalogo] = useState<Catalogo | null>(null);
  const [cambios, setCambios] = useState<CambioDeCarrito[]>([]);
  const [datos, setDatos] = useState<Datos>(datosGuardados);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [listo, setListo] = useState<RespuestaPedido | null>(null);

  // Al entrar: precios y stock al momento.
  // Espera a que el carrito guardado esté leído: sincronizar sobre un carrito
  // todavía vacío lo dejaría vacío.
  useEffect(() => {
    if (!cargado) return;
    let vivo = true;
    catalogoFresco()
      .then((c) => {
        if (!vivo) return;
        setCatalogo(c);
        setCambios(sincronizar(c));
      })
      .catch(() => {});
    return () => {
      vivo = false;
    };
  }, [cargado, sincronizar]);

  const conMercadoPago = Boolean(catalogo?.mercadopago);
  const pagaAhora = conMercadoPago && datos.pago === "mercadopago";
  const campo = (k: keyof Datos) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setDatos((d) => ({ ...d, [k]: e.target.value }));

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setEnviando(true);
    try {
      // Última consulta antes de mandar: si algo cambió, el cliente lo ve antes de confirmar.
      const fresco = await catalogoFresco();
      setCatalogo(fresco);
      const nuevos = sincronizar(fresco);
      if (nuevos.length) {
        setCambios(nuevos);
        setError("Algunos productos cambiaron. Revisá el pedido y volvé a confirmar.");
        return;
      }
      const res = await enviarPedido({
        cliente: datos.cliente.trim(),
        telefono: datos.telefono.trim(),
        entrega: datos.entrega,
        direccion: datos.entrega === "envio" ? datos.direccion.trim() : "",
        notas: datos.notas.trim(),
        items: renglones.map((r) => ({ id: r.producto.id, cantidad: r.cantidad })),
        ...(fresco.mercadopago ? { pago: datos.pago, vuelta: `${window.location.origin}/carrito` } : {}),
      });
      try {
        const { cliente, telefono, entrega, direccion, pago } = datos;
        localStorage.setItem(CLAVE_DATOS, JSON.stringify({ cliente, telefono, entrega, direccion, pago }));
      } catch {}
      vaciar();
      setListo(res);
      window.scrollTo({ top: 0 });
      if (res.pagar) setTimeout(() => window.location.assign(res.pagar!), 900);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo enviar el pedido.");
    } finally {
      setEnviando(false);
    }
  }

  const whatsapp = catalogo?.whatsapp ? `https://wa.me/${catalogo.whatsapp}` : STORE_INFO.whatsapp;

  if (!cargado) {
    return (
      <div className="flex justify-center py-24 text-[var(--text-muted)]">
        <Loader2 className="animate-spin" aria-label="Cargando tu carrito" />
      </div>
    );
  }

  if (listo) {
    return (
      <div className="mx-auto max-w-xl px-6 py-16 text-center">
        {listo.pagar ? (
          <>
            <Loader2 size={44} className="mx-auto animate-spin text-[var(--green-primary)]" />
            <h1 className="mt-4 font-display text-2xl font-bold">Pedido #{listo.numero} anotado</h1>
            <p className="mt-2 text-[var(--text-muted)]">Te llevamos a Mercado Pago para pagar {plata(listo.total)}…</p>
            <a href={listo.pagar} className="mt-6 inline-flex rounded-full bg-[var(--green-primary)] px-6 py-3 text-sm font-semibold text-white">
              Ir a Mercado Pago
            </a>
          </>
        ) : (
          <>
            <CheckCircle2 size={52} className="mx-auto text-[var(--green-primary)]" />
            <h1 className="mt-4 font-display text-3xl font-bold">¡Pedido #{listo.numero} enviado!</h1>
            <p className="mt-2 text-[var(--text-muted)]">
              Total {plata(listo.total)}. {listo.errorPago || "Te vamos a escribir por WhatsApp para confirmarlo."}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={`${whatsapp}?text=${encodeURIComponent(`Hola! Hice el pedido #${listo.numero} en la página.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--green-primary)] px-6 py-3 text-sm font-semibold text-white"
              >
                <MessageCircle size={16} /> Avisar por WhatsApp
              </a>
              <Link href="/productos" className="text-sm font-semibold text-[var(--green-primary)] hover:underline">
                Seguir comprando
              </Link>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10">
      {vueltaDePago && (
        <div
          role="status"
          className={`mb-6 flex items-start gap-3 rounded-2xl px-5 py-4 text-sm font-medium ${
            vueltaDePago.ok ? "bg-[var(--green-primary)] text-white" : "bg-amber-50 text-amber-800"
          }`}
        >
          {vueltaDePago.ok ? <CheckCircle2 size={18} className="shrink-0" /> : <AlertTriangle size={18} className="shrink-0" />}
          {vueltaDePago.texto}
        </div>
      )}

      <Link href="/productos" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--green-primary)] hover:underline">
        <ArrowLeft size={15} /> Seguir comprando
      </Link>
      <h1 className="mt-3 flex items-center gap-3 font-display text-2xl font-bold sm:text-3xl">
        <ShoppingCart size={26} /> Finalizar compra
      </h1>

      {renglones.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-[var(--gray)] p-12 text-center">
          <p className="font-semibold">Tu carrito está vacío.</p>
          <Link
            href="/productos"
            className="mt-4 inline-flex rounded-full bg-[var(--green-primary)] px-6 py-3 text-sm font-semibold text-white"
          >
            Ver productos
          </Link>
        </div>
      ) : (
        <form onSubmit={enviar} className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px]">
          <div className="flex flex-col gap-6">
            {cambios.length > 0 && (
              <div className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-900" role="status">
                <p className="flex items-center gap-2 font-semibold">
                  <AlertTriangle size={16} /> Actualizamos tu carrito con los precios y el stock de hoy:
                </p>
                <ul className="mt-2 list-disc pl-6">
                  {cambios.map((c, i) => (
                    <li key={i}>
                      <strong>{c.nombre}</strong> {c.detalle}.
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <section className="rounded-2xl border border-[var(--gray)] bg-white">
              <h2 className="border-b border-[var(--gray)] px-5 py-4 font-display text-lg font-bold">
                Tu pedido ({renglones.length} {renglones.length === 1 ? "producto" : "productos"})
              </h2>
              <ul className="divide-y divide-[var(--gray)]">
                {renglones.map(({ producto, cantidad }) => (
                  <li key={producto.id} className="flex gap-4 p-5">
                    <Link href={`/productos/${producto.slug}`} className="shrink-0">
                      <ProductoImagen
                        src={producto.imagen}
                        nombre={producto.nombre}
                        categoria={producto.categoria}
                        className="h-20 w-20 border border-[var(--gray)]"
                        iconClassName="h-8 w-8"
                        sizes="80px"
                      />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <Link
                          href={`/productos/${producto.slug}`}
                          className="line-clamp-2 text-sm font-semibold hover:text-[var(--green-primary)]"
                        >
                          {producto.nombre}
                        </Link>
                        <p className="text-xs text-[var(--text-muted)]">{plata(producto.precio)} c/u</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <CantidadControl
                          producto={producto}
                          cantidad={cantidad}
                          onChange={(c) => setCantidad(producto.id, c)}
                          size="sm"
                        />
                        <span className="w-24 text-right font-bold tabular-nums">{plata(importe(producto, cantidad))}</span>
                        <button
                          type="button"
                          onClick={() => quitar(producto.id)}
                          aria-label={`Quitar ${producto.nombre}`}
                          className="rounded-full p-1.5 text-[var(--text-muted)] hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="flex flex-col gap-4 rounded-2xl border border-[var(--gray)] bg-white p-5">
              <h2 className="font-display text-lg font-bold">Tus datos</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5 text-sm font-medium">
                  Nombre y apellido
                  <input required autoComplete="name" value={datos.cliente} onChange={campo("cliente")} className={INPUT} />
                </label>
                <label className="flex flex-col gap-1.5 text-sm font-medium">
                  Teléfono (WhatsApp)
                  <input
                    required
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="Ej: 3492 51-8311"
                    value={datos.telefono}
                    onChange={campo("telefono")}
                    className={INPUT}
                  />
                </label>
              </div>

              <fieldset className="flex flex-col gap-2">
                <legend className="mb-2 text-sm font-medium">¿Cómo lo recibís?</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Opcion
                    nombre="entrega"
                    activa={datos.entrega === "retiro"}
                    onClick={() => setDatos((d) => ({ ...d, entrega: "retiro" }))}
                    icono={Store}
                    titulo="Retiro en el local"
                    texto={`Sin cargo, en ${STORE_INFO.address}, Rafaela.`}
                  />
                  <Opcion
                    nombre="entrega"
                    activa={datos.entrega === "envio"}
                    onClick={() => setDatos((d) => ({ ...d, entrega: "envio" }))}
                    icono={Truck}
                    titulo="Envío a domicilio"
                    texto="El costo se coordina según el destino."
                  />
                </div>
              </fieldset>
              {datos.entrega === "envio" && (
                <label className="flex flex-col gap-1.5 text-sm font-medium">
                  Dirección de entrega
                  <input
                    required
                    autoComplete="street-address"
                    placeholder="Calle, número, localidad"
                    value={datos.direccion}
                    onChange={campo("direccion")}
                    className={INPUT}
                  />
                </label>
              )}

              {conMercadoPago && (
                <fieldset className="flex flex-col gap-2">
                  <legend className="mb-2 text-sm font-medium">¿Cómo pagás?</legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Opcion
                      nombre="pago"
                      activa={datos.pago === "mercadopago"}
                      onClick={() => setDatos((d) => ({ ...d, pago: "mercadopago" }))}
                      icono={CreditCard}
                      titulo="Mercado Pago, ahora"
                      texto="Tarjeta, débito o dinero en cuenta."
                    />
                    <Opcion
                      nombre="pago"
                      activa={datos.pago === "acordar"}
                      onClick={() => setDatos((d) => ({ ...d, pago: "acordar" }))}
                      icono={Handshake}
                      titulo="Al retirar o al recibir"
                      texto="Efectivo o transferencia."
                    />
                  </div>
                </fieldset>
              )}

              <label className="flex flex-col gap-1.5 text-sm font-medium">
                <span>
                  Notas <span className="font-normal text-[var(--text-muted)]">(opcional)</span>
                </span>
                <textarea
                  rows={2}
                  value={datos.notas}
                  onChange={campo("notas")}
                  placeholder="Horario para recibir, si necesitás factura, etc."
                  className={INPUT}
                />
              </label>
            </section>
          </div>

          <aside className="lg:sticky lg:top-40 lg:self-start">
            <div className="flex flex-col gap-4 rounded-2xl border border-[var(--gray)] bg-white p-5">
              <h2 className="font-display text-lg font-bold">Resumen</h2>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-muted)]">Productos</span>
                <span className="tabular-nums">{plata(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-muted)]">Envío</span>
                <span>{datos.entrega === "retiro" ? "Sin cargo" : "A coordinar"}</span>
              </div>
              {(catalogo?.promociones.length ?? 0) > 0 && (
                <p className="text-xs text-[var(--green-primary)]">Las promociones que correspondan se descuentan al enviar el pedido.</p>
              )}
              <div className="flex items-baseline justify-between border-t border-[var(--gray)] pt-4">
                <span className="font-semibold">Total</span>
                <span className="font-display text-3xl font-bold tabular-nums">{plata(subtotal)}</span>
              </div>

              {error && (
                <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={enviando}
                className="flex items-center justify-center gap-2 rounded-full bg-[var(--green-primary)] py-4 text-sm font-bold text-white transition-colors hover:bg-[var(--green-primary-hover)] disabled:opacity-60"
              >
                {enviando ? (
                  <>
                    <Loader2 size={17} className="animate-spin" /> Enviando…
                  </>
                ) : pagaAhora ? (
                  <>
                    <CreditCard size={17} /> Pagar con Mercado Pago
                  </>
                ) : (
                  "Enviar pedido"
                )}
              </button>
              <p className="text-xs leading-relaxed text-[var(--text-muted)]">
                Usamos tu nombre, teléfono y dirección solo para preparar y entregar el pedido. Los datos pasan por
                el sistema de Visual Solution hasta llegarnos y ahí se borran. Si pagás con Mercado Pago, el pago lo
                maneja Mercado Pago.{" "}
                <a href={POLITICA_PRIVACIDAD_URL} target="_blank" rel="noopener" className="underline">
                  Política de privacidad
                </a>
                . Podés arrepentirte dentro de los 10 días:{" "}
                <Link href="/arrepentimiento" className="underline">
                  botón de arrepentimiento
                </Link>
                .
              </p>
            </div>
          </aside>
        </form>
      )}
    </div>
  );
}

function Opcion({
  nombre,
  activa,
  onClick,
  icono: Icono,
  titulo,
  texto,
}: {
  nombre: string;
  activa: boolean;
  onClick: () => void;
  icono: typeof Store;
  titulo: string;
  texto: string;
}) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-colors ${
        activa ? "border-[var(--green-primary)] bg-[var(--green-primary)]/5" : "border-[var(--gray)] hover:border-[var(--green-primary)]/40"
      }`}
    >
      <input type="radio" name={nombre} checked={activa} onChange={onClick} className="sr-only" />
      <Icono size={20} className={activa ? "text-[var(--green-primary)]" : "text-[var(--text-muted)]"} />
      <span className="text-sm">
        <span className="block font-semibold">{titulo}</span>
        <span className="text-[var(--text-muted)]">{texto}</span>
      </span>
    </label>
  );
}
