"use client";

import { useActionState } from "react";
import { CheckCircle2, Download, TriangleAlert } from "lucide-react";
import {
  importarVisualAppAction,
  type EstadoImportacion,
} from "@/app/admin/(protected)/importar/actions";

export default function ImportarVisualAppForm({
  hayCambios,
  faltantes,
}: {
  hayCambios: boolean;
  /** Productos activos de la tienda que no están en Visual App. */
  faltantes: number;
}) {
  const [state, formAction, pending] = useActionState<EstadoImportacion, FormData>(
    importarVisualAppAction,
    { estado: "inicial" }
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.estado === "ok" && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl bg-[var(--gray-light)] px-4 py-3 text-sm"
        >
          <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[var(--green-primary)]" />
          <div>
            <p className="font-semibold">
              Listo: {state.altas} productos nuevos, {state.cambios} actualizados
              {state.desactivados > 0 && `, ${state.desactivados} ocultados`}.
            </p>
            <p className="text-[var(--text-muted)]">Ya se ven en la tienda.</p>
            {state.errores.length > 0 && (
              <div className="mt-2 text-red-600">
                <p className="font-semibold">{state.errores.length} no se pudieron importar:</p>
                <ul className="mt-1 list-disc pl-5">
                  {state.errores.slice(0, 20).map((e) => (
                    <li key={e.producto}>
                      {e.producto}: {e.mensaje}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
      {state.estado === "error" && (
        <p role="alert" className="flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          <TriangleAlert size={16} className="mt-0.5 shrink-0" /> {state.mensaje}
        </p>
      )}

      {faltantes > 0 && (
        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" name="desactivarFaltantes" className="mt-1 h-4 w-4 accent-[var(--green-primary)]" />
          <span>
            Ocultar de la tienda los {faltantes} productos que no están en Visual App.
            <span className="block text-[var(--text-muted)]">No se borran: se pueden volver a activar desde AppPack.</span>
          </span>
        </label>
      )}

      <button
        type="submit"
        disabled={pending || (!hayCambios && faltantes === 0)}
        className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-[var(--green-primary)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--green-primary-hover)] disabled:opacity-60"
      >
        <Download size={16} />
        {pending ? "Importando… (puede tardar un minuto)" : "Aplicar importación"}
      </button>
    </form>
  );
}
