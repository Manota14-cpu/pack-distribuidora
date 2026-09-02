import Link from "next/link";
import {
  Package,
  Layers,
  ShoppingBag,
  Mail,
  Users,
  ArrowRight,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { APPPACK_PEDIDOS, APPPACK_PRODUCTOS } from "@/lib/apppack";

export default async function AdminDashboard() {
  const [products, activeProducts, categories, orders, pendingOrders, leads, subscribers] =
    await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { active: true } }),
      prisma.category.count(),
      prisma.order.count(),
      prisma.order.count({ where: { status: { in: ["pendiente", "preparando"] } } }),
      prisma.lead.count(),
      prisma.newsletterSubscriber.count(),
    ]);

  const stats = [
    { label: "Productos activos", value: activeProducts, sub: `${products} en total` },
    { label: "Categorías", value: categories, sub: "Catálogo" },
    {
      label: "Pedidos recibidos",
      value: orders,
      sub: pendingOrders > 0 ? `${pendingOrders} sin entregar` : "Todos entregados",
    },
    { label: "Mensajes de contacto", value: leads, sub: "Leads" },
    { label: "Suscriptos al newsletter", value: subscribers, sub: "Emails" },
  ];

  return (
    <main className="flex flex-col gap-8">
      <div className="rounded-2xl bg-[var(--green-primary)] p-8 text-white flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Panel de administración</h1>
          <p className="text-white/80 text-sm mt-1">
            Consultá el catálogo, los pedidos y el estado de la tienda desde acá.
          </p>
        </div>
        <a
          href={APPPACK_PRODUCTOS}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 self-start rounded-full bg-white px-5 py-3 text-sm font-bold text-[var(--green-primary)] transition-opacity hover:bg-white/90"
        >
          <Package size={16} /> Administrar stock en AppPack
        </a>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
          href="/admin/productos"
          className="flex items-center justify-between rounded-xl border border-[var(--gray)] px-5 py-4 text-sm font-semibold hover:border-[var(--green-primary)] hover:text-[var(--green-primary)] transition-colors"
        >
          <span className="flex items-center gap-3">
            <Layers size={18} className="text-[var(--green-primary)]" /> Ver el catálogo y su stock
          </span>
          <ArrowRight size={16} />
        </Link>
        <a
          href={APPPACK_PRODUCTOS}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between rounded-xl border border-[var(--gray)] px-5 py-4 text-sm font-semibold transition-colors hover:border-[var(--green-primary)] hover:text-[var(--green-primary)]"
        >
          <span className="flex items-center gap-3">
            <ShoppingBag size={18} className="text-[var(--green-primary)]" /> Cargar productos y mover stock (AppPack)
          </span>
          <ArrowRight size={16} />
        </a>
        <a
          href={APPPACK_PEDIDOS}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between rounded-xl border border-[var(--gray)] px-5 py-4 text-sm font-semibold hover:border-[var(--green-primary)] hover:text-[var(--green-primary)] transition-colors"
        >
          <span className="flex items-center gap-3">
            <Mail size={18} className="text-[var(--green-primary)]" /> Gestionar pedidos (AppPack)
            {pendingOrders > 0 && (
              <span className="rounded-full bg-[var(--green-primary)] px-2 py-0.5 text-xs font-bold text-white">
                {pendingOrders}
              </span>
            )}
          </span>
          <ArrowRight size={16} />
        </a>
        <a
          href="/admin?tab=leads"
          className="flex items-center justify-between rounded-xl border border-[var(--gray)] px-5 py-4 text-sm font-semibold hover:border-[var(--green-primary)] hover:text-[var(--green-primary)] transition-colors opacity-60 cursor-not-allowed"
        >
          <span className="flex items-center gap-3">
            <Users size={18} className="text-[var(--green-primary)]" /> Ver mensajes de contacto (próximamente)
          </span>
          <ArrowRight size={16} />
        </a>
      </div>
    </main>
  );
}