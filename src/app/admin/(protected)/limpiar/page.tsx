import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { buscarRestos } from "@/lib/limpieza-base";
import LimpiarBaseForm from "@/components/admin/LimpiarBaseForm";

const TIPO = { tabla: "Tabla", vista: "Vista", funcion: "Función" } as const;

/**
 * Borrado de lo que dejó la app anterior en la base (pedidos, caja, gastos,
 * productos, stock...). Lo que hay que conservar ya se pasó a Visual App.
 * Cuando no queda nada, la página lo dice y el panel deja de mostrar el enlace.
 */
export default async function LimpiarPage() {
  const restos = await buscarRestos();

  return (
    <main className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--gray)] bg-white text-[var(--text-muted)] transition-colors hover:text-[var(--green-primary)]"
          aria-label="Volver al panel"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="font-display text-xl font-bold">Borrar datos de la app anterior</h1>
          <p className="text-sm text-[var(--text-muted)]">
            Se conservan los mensajes de contacto y los suscriptos al newsletter.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--gray)] bg-white p-6 flex flex-col gap-5">
        {restos.length === 0 ? (
          <p className="flex items-center gap-2 text-sm font-semibold">
            <CheckCircle2 size={18} className="text-[var(--green-primary)]" />
            No queda nada de la app anterior en la base.
          </p>
        ) : (
          <>
            <div>
              <p className="text-sm font-semibold mb-2">Se van a borrar para siempre:</p>
              <ul className="grid gap-1 text-sm sm:grid-cols-2">
                {restos.map((r) => (
                  <li
                    key={`${r.tipo}-${r.nombre}-${r.argumentos ?? ""}`}
                    className="flex justify-between gap-3 rounded-lg bg-[var(--gray-light)] px-3 py-1.5"
                  >
                    <span>
                      <span className="text-[var(--text-muted)]">{TIPO[r.tipo]}</span> {r.nombre}
                    </span>
                    {r.filas !== undefined && (
                      <span className="tabular-nums text-[var(--text-muted)]">
                        {r.filas} {r.filas === 1 ? "registro" : "registros"}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              No se puede deshacer. Hacelo solo si ya pasaste a Visual App todo lo que querías guardar.
            </p>
            <LimpiarBaseForm />
          </>
        )}
      </div>
    </main>
  );
}
