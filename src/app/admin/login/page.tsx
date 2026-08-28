import Link from "next/link";
import type { Metadata } from "next";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export const metadata: Metadata = {
  title: "Panel de administración",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLoginPage() {
  return (
    <div className="mx-auto max-w-sm min-h-[70vh] flex flex-col justify-center px-6 py-16">
      <div className="text-center mb-8">
        <h1 className="font-display text-2xl font-bold text-[var(--text)]">
          Panel de administración
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-2">
          Ingresá la contraseña de administrador para continuar.
        </p>
      </div>
      <AdminLoginForm />
      <Link
        href="/"
        className="mt-8 text-center text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--green-primary)] transition-colors"
      >
        ← Volver a la tienda
      </Link>
    </div>
  );
}