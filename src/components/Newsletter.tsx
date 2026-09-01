"use client";

import { useState, type FormEvent } from "react";
import { Mail, Send } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSending(true);
    try {
      const honey = new FormData(e.currentTarget).get("honey") ?? "";
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, honey }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "No se pudo suscribir. Intentá de nuevo.");
      }
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error inesperado.");
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
      <div className="rounded-3xl bg-[var(--green-primary)] px-6 py-12 md:px-16 md:py-14 text-center flex flex-col items-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 mb-4">
          <Mail size={20} className="text-white" />
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
          ¡Enterate primero de nuestras ofertas!
        </h2>
        <p className="mt-2 text-white/85 max-w-md">
          Suscribite y recibí novedades, promociones y descuentos exclusivos.
        </p>
        <form
          onSubmit={handleSubmit}
          className="mt-6 flex w-full max-w-md flex-col sm:flex-row gap-3"
        >
          <input
            type="text"
            name="honey"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute -left-[9999px] h-0 w-0 opacity-0"
          />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Tu correo electrónico"
            className="flex-1 rounded-full border border-white/20 bg-white px-5 py-3 text-sm outline-none focus:border-white/60"
          />
          <button
            type="submit"
            disabled={sending}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-[var(--green-primary)] text-sm font-semibold px-6 py-3 shadow-[0_10px_24px_-10px_rgba(0,0,0,0.4)] hover:bg-white/95 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-10px_rgba(0,0,0,0.45)] disabled:opacity-60 disabled:translate-y-0 disabled:shadow-none transition-all"
          >
            {sent ? "¡Listo!" : sending ? "Suscribiendo…" : "Suscribirme"}
            {!sent && !sending && <Send size={15} />}
          </button>
        </form>
        {error && (
          <p role="alert" className="mt-3 text-sm font-medium text-red-400">
            {error}
          </p>
        )}
        {sent && (
          <p className="mt-3 text-sm font-medium text-white">
            ¡Estás suscrito! Vas a recibir nuestras novedades.
          </p>
        )}
      </div>
    </section>
  );
}
