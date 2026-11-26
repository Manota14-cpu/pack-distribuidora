import Link from "next/link";
import { ArrowRight, Mail, ShoppingBag, Trash2, Users } from "lucide-react";
import { prisma } from "@/lib/db";
import { buscarRestos } from "@/lib/limpieza-base";

export default async function AdminDashboard() {
  const [leads, subscribers, restos] = await Promise.all([
    prisma.lead.count(),
    prisma.newsletterSubscriber.count(),
    buscarRestos(),
  ]);

  const stats = [
    { label: "Mensajes de contacto", value: leads, sub: "Desde el formulario de la web" },
    { label: "Suscriptos al newsletter", value: subscribers, sub: "Emails" },
  ];

  return (
    <main className="flex flex-col gap-8">
      <div className="rounded-2xl bg-[var(--green-primary)] p-8 text-white">
        <h1 className="font-display text-2xl font-bold">Panel de administración</h1>
        <p className="text-white/80 text-sm mt-1">
          Los productos, el stock, los pedidos y los cobros se manejan en Visual App. Acá quedan los
          contactos que llegan por la web.
        </p>
      </div>

      {restos.length > 0 && (
        <Link
          href="/admin/limpiar"
          className="flex items-center justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-sm text-red-700 transition-colors hover:border-red-400"
        >
          <span className="flex items-center gap-3">
            <Trash2 size={18} className="shrink-0" />
            <span>
              <strong className="block">Quedan datos de la app anterior en la base</strong>
              Pedidos, caja, gastos y productos viejos que la web ya no usa. Tocá acá para borrarlos.
            </span>
          </span>
          <ArrowRight size={16} className="shrink-0" />
        </Link>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-[var(--gray)] bg-white p-6">
            <p className="text-sm font-semibold text-[var(--text-muted)]">{s.label}</p>
            <p className="font-display text-3xl font-bold mt-2">{s.value}</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-[var(--gray)] bg-white p-6 flex flex-col gap-3">
        <h2 className="font-display text-lg font-bold">Accesos rápidos</h2>
        <Link
          href="/productos"
          target="_blank"
          className="flex items-center justify-between rounded-xl border border-[var(--gray)] px-5 py-4 text-sm font-semibold hover:border-[var(--green-primary)] hover:text-[var(--green-primary)] transition-colors"
        >
          <span className="flex items-center gap-3">
            <ShoppingBag size={18} className="text-[var(--green-primary)]" /> Ver la tienda online
          </span>
          <ArrowRight size={16} />
        </Link>
        {/* Los mensajes de contacto no tienen pantalla propia: con un puñado
            de consultas, una lista sería una pantalla que nadie abre. Se
            muestra el número acá y se lee el detalle en la base cuando haga
            falta — mejor eso que un enlace apagado que promete algo. */}
        <div className="flex items-center justify-between rounded-xl border border-[var(--gray)] px-5 py-4 text-sm">
          <span className="flex items-center gap-3 font-semibold">
            <Users size={18} className="text-[var(--green-primary)]" /> Mensajes de contacto
          </span>
          <span className="text-[var(--text-muted)]">
            {leads === 0 ? "Ninguno todavía" : `${leads} ${leads === 1 ? "recibido" : "recibidos"}`}
          </span>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-[var(--gray)] px-5 py-4 text-sm">
          <span className="flex items-center gap-3 font-semibold">
            <Mail size={18} className="text-[var(--green-primary)]" /> Newsletter
          </span>
          <span className="text-[var(--text-muted)]">
            {subscribers === 0 ? "Sin suscriptos todavía" : `${subscribers} suscriptos`}
          </span>
        </div>
      </div>
    </main>
  );
}
