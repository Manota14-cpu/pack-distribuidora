"use client";

import { useState, type FormEvent } from "react";
import { Mail, MessageCircle, MapPin, Phone, Send, CheckCircle2 } from "lucide-react";
import { STORE_INFO } from "@/lib/content";

const HOURS_ROWS = [STORE_INFO.hours.weekdays, STORE_INFO.hours.saturday, STORE_INFO.hours.sunday].map(
  (line) => {
    const [day, time] = line.split(": ");
    return { day, time };
  }
);

const ASUNTO_OPTIONS = [
  { value: "consulta-general", label: "Consulta general" },
  { value: "pedido-mayorista", label: "Pedido mayorista" },
  { value: "pedido-minorista", label: "Pedido minorista" },
  { value: "envio", label: "Envío" },
  { value: "facturacion", label: "Facturación" },
  { value: "otro", label: "Otro" },
];

export default function ContactoPage() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [asunto, setAsunto] = useState("consulta-general");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSending(true);
    try {
      const type: string = asunto;
      const honey = new FormData(e.currentTarget).get("honey") ?? "";
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, telefono, asunto: type, mensaje, honey }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "No se pudo enviar el mensaje. Intentá de nuevo.");
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error inesperado.");
    } finally {
      setSending(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setError(null);
    setNombre("");
    setEmail("");
    setTelefono("");
    setAsunto("consulta-general");
    setMensaje("");
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text)]">
          Contactanos
        </h1>
        <p className="mt-3 text-[var(--text-muted)] max-w-xl mx-auto">
          ¿Tenés una consulta, querés hacer un pedido o necesitás información?
          Respondemos a la brevedad.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-10">
        {/* Formulario */}
        <div className="rounded-2xl border border-[var(--gray)] bg-[var(--white)] p-6 sm:p-8">
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <CheckCircle2 className="h-16 w-16 text-[var(--green-primary)]" />
              <h2 className="font-display text-2xl font-bold mt-5 text-[var(--text)]">
                ¡Mensaje enviado!
              </h2>
              <p className="mt-2 text-[var(--text-muted)] max-w-sm">
                Gracias por comunicarte. Te responderemos lo antes posible.
              </p>
              <button
                onClick={handleReset}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--green-primary)] text-white text-sm font-semibold px-6 py-3 hover:bg-[var(--green-primary-hover)] transition-colors"
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Nombre */}
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-[var(--text)] mb-1.5">
                  Nombre *
                </label>
                <input
                  id="nombre"
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full rounded-xl border border-[var(--gray)] bg-[var(--gray-light)] px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--green-primary)] focus:ring-2 focus:ring-[var(--green-primary)]/20 transition"
                />
              </div>

              {/* Email + Teléfono */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[var(--text)] mb-1.5">
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full rounded-xl border border-[var(--gray)] bg-[var(--gray-light)] px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--green-primary)] focus:ring-2 focus:ring-[var(--green-primary)]/20 transition"
                  />
                </div>
                <div>
                  <label htmlFor="telefono" className="block text-sm font-medium text-[var(--text)] mb-1.5">
                    Teléfono
                  </label>
                  <input
                    id="telefono"
                    type="tel"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="3492-518311"
                    className="w-full rounded-xl border border-[var(--gray)] bg-[var(--gray-light)] px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--green-primary)] focus:ring-2 focus:ring-[var(--green-primary)]/20 transition"
                  />
                </div>
              </div>

              {/* Asunto */}
              <div>
                <label htmlFor="asunto" className="block text-sm font-medium text-[var(--text)] mb-1.5">
                  Asunto
                </label>
                <select
                  id="asunto"
                  value={asunto}
                  onChange={(e) => setAsunto(e.target.value)}
                  className="w-full rounded-xl border border-[var(--gray)] bg-[var(--gray-light)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--green-primary)] focus:ring-2 focus:ring-[var(--green-primary)]/20 transition appearance-none"
                >
                  {ASUNTO_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mensaje */}
              <div>
                <label htmlFor="mensaje" className="block text-sm font-medium text-[var(--text)] mb-1.5">
                  Mensaje *
                </label>
                <textarea
                  id="mensaje"
                  required
                  rows={5}
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  placeholder="Escribí tu consulta acá..."
                  className="w-full rounded-xl border border-[var(--gray)] bg-[var(--gray-light)] px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--green-primary)] focus:ring-2 focus:ring-[var(--green-primary)]/20 transition resize-none"
                />
              </div>

              <input
                type="text"
                name="honey"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute -left-[9999px] h-0 w-0 opacity-0"
              />

              <button
                type="submit"
                disabled={sending}
                className="self-start inline-flex items-center gap-2 rounded-full bg-[var(--green-primary)] text-white text-sm font-semibold px-7 py-3.5 hover:bg-[var(--green-primary-hover)] disabled:opacity-60 transition-colors"
              >
                <Send size={16} />
                {sending ? "Enviando…" : "Enviar mensaje"}
              </button>
              {error && (
                <p role="alert" className="text-sm font-medium text-red-600">
                  {error}
                </p>
              )}
            </form>
          )}
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-5">
          {/* Datos de contacto */}
          <div className="rounded-2xl border border-[var(--gray)] bg-[var(--white)] p-6">
            <h3 className="font-display text-lg font-bold text-[var(--text)]">
              Datos de contacto
            </h3>
            <div className="mt-4 flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-[var(--green-primary)]" />
                <div>
                  <p className="text-sm font-medium">{STORE_INFO.location}</p>
                  <p className="text-xs text-[var(--text-muted)]">{STORE_INFO.country}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={18} className="mt-0.5 shrink-0 text-[var(--green-primary)]" />
                <p className="text-sm font-medium">{STORE_INFO.phone}</p>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={18} className="mt-0.5 shrink-0 text-[var(--green-primary)]" />
                <p className="text-sm font-medium">{STORE_INFO.email}</p>
              </div>
            </div>
          </div>

          {/* Mapa */}
          <div className="rounded-2xl border border-[var(--gray)] bg-[var(--white)] p-2 overflow-hidden">
            <iframe
              title={`Ubicación de ${STORE_INFO.name}`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                `${STORE_INFO.name}, ${STORE_INFO.location}, ${STORE_INFO.country}`
              )}&output=embed`}
              className="w-full h-56 rounded-xl border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* WhatsApp */}
          <div className="rounded-2xl bg-[var(--green-primary)] p-6 text-white">
            <div className="flex items-center gap-2.5 mb-2">
              <MessageCircle size={20} />
              <h3 className="font-display text-lg font-bold">WhatsApp</h3>
            </div>
            <p className="text-sm text-white/80 mb-4">
              ¿Necesitás una respuesta rápida? Escribinos por WhatsApp.
            </p>
            <a
              href={STORE_INFO.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white text-[var(--green-primary)] text-sm font-semibold px-6 py-3 shadow-[0_10px_24px_-10px_rgba(0,0,0,0.4)] hover:bg-white/95 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-10px_rgba(0,0,0,0.45)] transition-all"
            >
              <MessageCircle size={16} />
              Abrir WhatsApp
            </a>
          </div>

          {/* Horarios */}
          <div className="rounded-2xl border border-[var(--gray)] bg-[var(--white)] p-6">
            <h3 className="font-display text-lg font-bold text-[var(--text)]">
              Horarios de atención
            </h3>
            <div className="mt-4 flex flex-col gap-2 text-sm">
              {HOURS_ROWS.map(({ day, time }) => (
                <div key={day} className="flex justify-between gap-4">
                  <span className="text-[var(--text-muted)]">{day}</span>
                  <span className="font-medium text-right">{time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
