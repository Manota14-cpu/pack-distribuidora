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

export default async function AdminDashboard() {
  const [products, activeProducts, categories, orders, leads, subscribers] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { active: true } }),
    prisma.category.count(),
    prisma.order.count(),
    prisma.lead.count(),
    prisma.newsletterSubscriber.count(),
  ]);

  const stats = [
    { label: "Productos activos", value: activeProducts, sub: `${products} en total` },
    { label: "Categorías", value: categories, sub: "Catálogo" },
    { label: "Pedidos recibidos", value: orders, sub: "Por WhatsApp" },
    { label: "Mensajes de contacto", value: leads, sub: "Leads" },
    { label: "Suscriptos al newsletter", value: subscribers, sub: "Emails" },
  ];

  return (
    <main className="flex flex-col gap-8">
      <div className="rounded-2xl bg-[var(--green-primary)] p-8 text-white flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Panel de administración</h1>
          <p className="text-white/80 text-sm mt-1">
            Gestioná stock, productos y el estado de la tienda desde acá.
          </p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="inline-flex items-center gap-2 self-start rounded-full bg-white px-5 py-3 text-sm font-bold text-[var(--green-primary)] hover:bg-white/90 transition-opacity"
        >
          <Package size={16} /> Nuevo producto
        </Link>
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
            <Layers size={18} className="text-[var(--green-primary)]" /> Gestionar productos, stock y etiquetas
          </span>
          <ArrowRight size={16} />
        </Link>
        <Link
          href="/admin/productos/nuevo"
          className="flex items-center justify-between rounded-xl border border-[var(--gray)] px-5 py-4 text-sm font-semibold hover:border-[var(--green-primary)] hover:text-[var(--green-primary)] transition-colors"
        >
          <span className="flex items-center gap-3">
            <ShoppingBag size={18} className="text-[var(--green-primary)]" /> Dar de alta un producto nuevo
          </span>
          <ArrowRight size={16} />
        </Link>
        <a
          href="/admin?tab=pedidos"
          className="flex items-center justify-between rounded-xl border border-[var(--gray)] px-5 py-4 text-sm font-semibold hover:border-[var(--green-primary)] hover:text-[var(--green-primary)] transition-colors opacity-60 cursor-not-allowed"
        >
          <span className="flex items-center gap-3">
            <Mail size={18} className="text-[var(--green-primary)]" /> Ver pedidos (próximamente)
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