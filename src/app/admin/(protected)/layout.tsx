import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { isAdminAuthed } from "@/lib/admin-auth";
import { logoutAction } from "../actions";

export const metadata: Metadata = {
  title: "Panel de administración",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdminAuthed())) redirect("/admin/login");

  return (
    <div className="min-h-[80vh] bg-[var(--gray-light)]">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <header className="flex items-center justify-between gap-4 flex-wrap mb-8">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-display text-xl font-bold text-[var(--green-dark)]">
              Pack <span className="text-[var(--green-primary)]">Distribuidora</span> admin
            </Link>
            <nav className="flex items-center gap-3 text-sm">
              <Link
                href="/admin"
                className="font-semibold text-[var(--text)] hover:text-[var(--green-primary)] transition-colors"
              >
                Panel
              </Link>
              <Link
                href="/admin/productos"
                className="font-semibold text-[var(--text)] hover:text-[var(--green-primary)] transition-colors"
              >
                Productos
              </Link>
              <Link
                href="/"
                target="_blank"
                className="font-semibold text-[var(--text-muted)] hover:text-[var(--green-primary)] transition-colors"
              >
                Ver tienda ↗
              </Link>
            </nav>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-full border border-[var(--gray)] bg-white px-4 py-2 text-sm font-semibold text-[var(--text)] hover:border-red-300 hover:text-red-600 transition-colors"
            >
              Cerrar sesión
            </button>
          </form>
        </header>
        {children}
      </div>
    </div>
  );
}