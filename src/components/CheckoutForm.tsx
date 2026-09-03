"use client";

import { createContext, useCallback, useContext, useEffect, useState, type FormEvent } from "react";
import { X, Send, ArrowLeft } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useFocusTrap } from "@/lib/use-focus-trap";
import { buildWhatsAppMessage, WHATSAPP_NUMBER, type CheckoutFormData } from "@/lib/whatsapp";
import { trackBeginCheckout } from "@/lib/analytics";

const PROVINCIAS = [
  "Buenos Aires", "CABA", "Catamarca", "Chaco", "Chubut", "Córdoba",
  "Corrientes", "Entre Ríos", "Formosa", "Jujuy", "La Pampa", "La Rioja",
  "Mendoza", "Misiones", "Neuquén", "Río Negro", "Salta", "San Juan",
  "San Luis", "Santa Cruz", "Santa Fe", "Santiago del Estero",
  "Tierra del Fuego", "Tucumán",
];

const INITIAL_FORM: CheckoutFormData = {
  tipoCliente: "minorista",
  nombre: "",
  razonSocial: "",
  dniCuit: "",
  requiereFactura: false,
  telefono: "",
  email: "",
  direccion: "",
  localidad: "",
  provincia: "Santa Fe",
  notas: "",
};

// ---- Context ----

interface CheckoutCtx {
  openCheckout: () => void;
}

const CheckoutContext = createContext<CheckoutCtx | undefined>(undefined);

export function useCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error("useCheckout must be used within CheckoutProvider");
  return ctx;
}

// ---- Shared input class ----
const INPUT = "w-full rounded-xl border border-[var(--gray)] bg-[var(--gray-light)] px-4 py-3 text-sm outline-none focus:border-[var(--green-primary)] focus:bg-[var(--white)] transition-colors";

// ---- Provider ----

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const { items, subtotal, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<CheckoutFormData>(INITIAL_FORM);
  const trapRef = useFocusTrap(isOpen);

  const openCheckout = useCallback(() => {
    setError(null);
    setIsOpen(true);
    trackBeginCheckout(
      items.map((i) => ({
        item_id: i.product.id,
        item_name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
      })),
      subtotal
    );
  }, [items, subtotal]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  function onCheck(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.checked }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map(({ product, quantity }) => ({
            productId: product.id,
            name: product.name,
            unit: product.unit,
            price: product.price,
            quantity,
          })),
          subtotal,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "No se pudo registrar el pedido. Intentá de nuevo.");
      }
      const msg = buildWhatsAppMessage(form, items, subtotal);
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
      setSent(true);
      clearCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error inesperado.");
    } finally {
      setSubmitting(false);
    }
  }

  function close() {
    setIsOpen(false);
    setSent(false);
    setSubmitting(false);
    setError(null);
    setForm(INITIAL_FORM);
  }

  return (
    <CheckoutContext.Provider value={{ openCheckout }}>
      {children}

      {isOpen && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Finalizar pedido">
          <div className="absolute inset-0 bg-black/40" onClick={close} />
          <div ref={trapRef} className="absolute right-0 top-0 h-full w-full max-w-lg bg-[var(--white)] flex flex-col animate-fade-up overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--gray)] sticky top-0 bg-[var(--white)] z-10">
              <div className="flex items-center gap-3">
                <button onClick={close} aria-label="Volver" className="p-1">
                  {sent ? <X size={22} /> : <ArrowLeft size={22} />}
                </button>
                <h2 className="font-display text-lg font-bold">
                  {sent ? "Pedido enviado" : "Finalizar pedido"}
                </h2>
              </div>
              <button onClick={close} aria-label="Cerrar"><X size={22} /></button>
            </div>

            {sent ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center py-16">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--green-primary)]">
                  <Send size={24} className="text-white" />
                </div>
                <h3 className="font-display text-xl font-bold text-[var(--text)]">¡Pedido enviado por WhatsApp!</h3>
                <p className="text-[var(--text-muted)] max-w-sm">
                  Te abrimos WhatsApp con el resumen de tu pedido. Completá el mensaje y envialo para coordinar la entrega.
                </p>
                <button onClick={close} className="mt-2 rounded-full bg-[var(--green-primary)] text-white text-sm font-semibold px-6 py-3 hover:bg-[var(--green-primary-hover)] transition-colors">
                  Volver a la tienda
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                {/* Resumen */}
                <div className="px-5 py-4 bg-[var(--gray-light)]">
                  <h3 className="text-sm font-semibold mb-2">Resumen ({items.length} producto{items.length !== 1 && "s"})</h3>
                  <div className="flex flex-col gap-1.5 max-h-32 overflow-y-auto">
                    {items.map(({ product, quantity }) => (
                      <div key={product.id} className="flex justify-between text-xs text-[var(--text-muted)]">
                        <span className="truncate mr-2">{product.name} x{quantity}</span>
                        <span className="font-medium text-[var(--text)] shrink-0 tabular-nums">${(product.price * quantity).toLocaleString("es-AR")}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-sm font-bold mt-2 pt-2 border-t border-[var(--gray)]">
                    <span>Subtotal</span>
                    <span className="tabular-nums">${subtotal.toLocaleString("es-AR")}</span>
                  </div>
                </div>

                {/* Campos */}
                <div className="flex-1 px-5 py-5 flex flex-col gap-4">

                  {/* Tipo de cliente */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Tipo de cliente *</label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, tipoCliente: "minorista" }))}
                        className={`flex-1 rounded-xl border-2 py-3 text-sm font-semibold transition-colors ${
                          form.tipoCliente === "minorista"
                            ? "border-[var(--green-primary)] bg-[var(--green-primary)] text-white"
                            : "border-[var(--gray)] bg-[var(--white)] text-[var(--text-muted)] hover:border-[var(--green-primary)]/40"
                        }`}
                      >
                        Minorista
                      </button>
                      <button
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, tipoCliente: "mayorista" }))}
                        className={`flex-1 rounded-xl border-2 py-3 text-sm font-semibold transition-colors ${
                          form.tipoCliente === "mayorista"
                            ? "border-[var(--green-primary)] bg-[var(--green-primary)] text-white"
                            : "border-[var(--gray)] bg-[var(--white)] text-[var(--text-muted)] hover:border-[var(--green-primary)]/40"
                        }`}
                      >
                        Mayorista
                      </button>
                    </div>
                  </div>

                  {/* Nombre */}
                  <div>
                    <label htmlFor="co-nombre" className="block text-sm font-semibold mb-1.5">Nombre y apellido *</label>
                    <input type="text" id="co-nombre" name="nombre" required value={form.nombre} onChange={onChange} placeholder="Ej: Juan Pérez" className={INPUT} />
                  </div>

                  {/* DNI/CUIT */}
                  <div>
                    <label htmlFor="co-dni" className="block text-sm font-semibold mb-1.5">DNI / CUIT *</label>
                    <input type="text" id="co-dni" name="dniCuit" required value={form.dniCuit} onChange={onChange} placeholder="Ej: 20-12345678-9 o 12345678" className={INPUT} />
                  </div>

                  {/* Razón social + Factura */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="co-rs" className="block text-sm font-semibold mb-1.5">Razón social</label>
                      <input type="text" id="co-rs" name="razonSocial" value={form.razonSocial} onChange={onChange} placeholder="Solo si necesita factura" className={INPUT} />
                    </div>
                    <div className="flex items-end pb-1">
                      <label className="flex items-center gap-2.5 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          name="requiereFactura"
                          checked={form.requiereFactura}
                          onChange={onCheck}
                          className="h-4.5 w-4.5 rounded accent-[var(--green-primary)]"
                        />
                        <span className="text-sm font-semibold">Requiere factura</span>
                      </label>
                    </div>
                  </div>

                  {/* Tel + Email */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="co-tel" className="block text-sm font-semibold mb-1.5">Teléfono *</label>
                      <input type="tel" id="co-tel" name="telefono" required value={form.telefono} onChange={onChange} placeholder="3492-518311" className={INPUT} />
                    </div>
                    <div>
                      <label htmlFor="co-email" className="block text-sm font-semibold mb-1.5">Email</label>
                      <input type="email" id="co-email" name="email" value={form.email} onChange={onChange} placeholder="tu@email.com" className={INPUT} />
                    </div>
                  </div>

                  {/* Dirección */}
                  <div>
                    <label htmlFor="co-dir" className="block text-sm font-semibold mb-1.5">Dirección de envío *</label>
                    <input type="text" id="co-dir" name="direccion" required value={form.direccion} onChange={onChange} placeholder="Calle, número, piso, depto" className={INPUT} />
                  </div>

                  {/* Localidad + Provincia */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="co-localidad" className="block text-sm font-semibold mb-1.5">Localidad *</label>
                      <input type="text" id="co-localidad" name="localidad" required value={form.localidad} onChange={onChange} placeholder="Ciudad" className={INPUT} />
                    </div>
                    <div>
                      <label htmlFor="co-provincia" className="block text-sm font-semibold mb-1.5">Provincia *</label>
                      <select id="co-provincia" name="provincia" required value={form.provincia} onChange={onChange} className={INPUT}>
                        {PROVINCIAS.map((p) => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Notas */}
                  <div>
                    <label htmlFor="co-notas" className="block text-sm font-semibold mb-1.5">Notas adicionales</label>
                    <textarea id="co-notas" name="notas" rows={3} value={form.notas} onChange={onChange} placeholder="Horarios preferidos, referencias, etc." className={`${INPUT} resize-none`} />
                  </div>
                </div>

                {/* Footer */}
                <div className="px-5 py-4 border-t border-[var(--gray)] sticky bottom-0 bg-[var(--white)]">
                  <div className="flex items-center justify-between text-base font-bold mb-3">
                    <span>Total</span>
                    <span className="tabular-nums">${subtotal.toLocaleString("es-AR")}</span>
                  </div>
                  {error && (
                    <p role="alert" className="mb-3 text-xs font-medium text-red-600">
                      {error}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 rounded-full bg-[var(--green-primary)] text-white text-sm font-bold py-3.5 hover:bg-[var(--green-primary-hover)] disabled:opacity-60 transition-colors"
                  >
                    <Send size={16} />
                    {submitting ? "Registrando pedido…" : "Enviar pedido por WhatsApp"}
                  </button>
                  <p className="text-[11px] text-[var(--text-muted)] text-center mt-2">
                    Se abrirá WhatsApp con el resumen de tu pedido
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </CheckoutContext.Provider>
  );
}
