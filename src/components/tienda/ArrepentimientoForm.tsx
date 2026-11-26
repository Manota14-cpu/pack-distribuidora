"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { enviarArrepentimiento } from "@/lib/pedidos";

const INPUT =
  "w-full rounded-xl border border-[var(--gray)] bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--green-primary)]";

export default function ArrepentimientoForm() {
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [codigo, setCodigo] = useState<string | null>(null);

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setEnviando(true);
    setError("");
    try {
      const res = await enviarArrepentimiento({
        cliente: String(f.get("cliente") ?? "").trim(),
        telefono: String(f.get("telefono") ?? "").trim(),
        pedido: String(f.get("pedido") ?? "").trim(),
        motivo: String(f.get("motivo") ?? "").trim(),
      });
      setCodigo(res.codigo);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo enviar.");
    } finally {
      setEnviando(false);
    }
  }

  if (codigo) {
    return (
      <div role="status" className="rounded-2xl bg-[var(--gray-light)] p-6 text-center">
        <CheckCircle2 size={40} className="mx-auto text-[var(--green-primary)]" />
        <p className="mt-3 font-semibold">Recibimos tu pedido de arrepentimiento.</p>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Tu código de constancia es <strong className="text-[var(--text)]">{codigo}</strong>. Guardalo: te vamos a
          contactar para coordinar la devolución.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Nombre y apellido
          <input name="cliente" required autoComplete="name" className={INPUT} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Teléfono (WhatsApp)
          <input name="telefono" required type="tel" inputMode="tel" autoComplete="tel" className={INPUT} />
        </label>
      </div>
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        <span>
          Número de pedido <span className="font-normal text-[var(--text-muted)]">(si lo tenés)</span>
        </span>
        <input name="pedido" inputMode="numeric" className={INPUT} />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        <span>
          Motivo <span className="font-normal text-[var(--text-muted)]">(opcional)</span>
        </span>
        <textarea name="motivo" rows={3} className={INPUT} />
      </label>
      {error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={enviando}
        className="flex items-center justify-center gap-2 self-start rounded-full bg-[var(--green-primary)] px-6 py-3 text-sm font-bold text-white hover:bg-[var(--green-primary-hover)] disabled:opacity-60"
      >
        {enviando && <Loader2 size={16} className="animate-spin" />} Enviar solicitud
      </button>
    </form>
  );
}
