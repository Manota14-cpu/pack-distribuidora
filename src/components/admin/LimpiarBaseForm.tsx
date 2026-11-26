"use client";

import { useActionState } from "react";
import { CheckCircle2, Trash2, TriangleAlert } from "lucide-react";
import { borrarRestosAction, type EstadoLimpieza } from "@/app/admin/(protected)/limpiar/actions";

export default function LimpiarBaseForm() {
  const [state, formAction, pending] = useActionState<EstadoLimpieza, FormData>(borrarRestosAction, {
    estado: "inicial",
  });

  if (state.estado === "ok") {
    return (
      <p role="status" className="flex items-start gap-2 rounded-xl bg-[var(--gray-light)] px-4 py-3 text-sm font-semibold">
        <CheckCircle2 size={18} className="shrink-0 text-[var(--green-primary)]" />
        Listo: se borraron {state.borrados} elementos. La base quedó solo con lo que usa la web.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      {state.estado === "error" && (
        <p role="alert" className="flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          <TriangleAlert size={16} className="mt-0.5 shrink-0" /> {state.mensaje}
        </p>
      )}
      <label htmlFor="confirmacion" className="text-sm font-medium">
        Para confirmar, escribí <strong>BORRAR</strong>
      </label>
      <input
        id="confirmacion"
        name="confirmacion"
        autoComplete="off"
        required
        className="w-full max-w-xs rounded-xl border border-[var(--gray)] bg-white px-4 py-3 text-sm outline-none focus:border-red-400"
      />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 self-start rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
      >
        <Trash2 size={16} /> {pending ? "Borrando…" : "Borrar todo para siempre"}
      </button>
    </form>
  );
}
