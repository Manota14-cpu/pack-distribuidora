"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingCart, Menu, X, ChevronDown } from "lucide-react";
import { useFocusTrap } from "@/lib/use-focus-trap";
import { useCarrito } from "@/lib/carrito";
import { CATEGORIAS } from "@/lib/catalogo";
import TopBar from "./TopBar";
import Logo from "./Logo";
import BuscadorHeader from "./BuscadorHeader";
import CarritoDrawer from "./tienda/CarritoDrawer";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Productos" },
  { href: "/herramientas", label: "Herramientas" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/preguntas-frecuentes", label: "Preguntas frecuentes" },
  { href: "/contacto", label: "Contacto" },
];

export default function Header() {
  const { cantidadProductos, abrir } = useCarrito();
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuTrapRef = useFocusTrap(mobileOpen);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 bg-[var(--green-primary)]">
        <TopBar />

        <div className="border-b border-white/10">
          <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3.5 md:gap-8 md:px-6">
            <Logo />

            <div className="hidden max-w-xl flex-1 md:block">
              <BuscadorHeader variante="desktop" />
            </div>

            <div className="ml-auto flex items-center gap-1 md:gap-2">
              <button
                onClick={abrir}
                className="relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white transition-colors hover:text-white/80"
                aria-label={`Carrito${cantidadProductos ? `: ${cantidadProductos} productos` : ""}`}
              >
                <ShoppingCart size={22} />
                <span className="hidden lg:inline">Carrito</span>
                {cantidadProductos > 0 && (
                  <span className="absolute -top-0.5 right-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--accent)] px-1 text-[11px] font-bold text-[var(--accent-ink)] lg:left-6 lg:right-auto">
                    {cantidadProductos}
                  </span>
                )}
              </button>
              <button onClick={() => setMobileOpen(true)} className="p-2 text-white md:hidden" aria-label="Abrir menú">
                <Menu size={24} />
              </button>
            </div>
          </div>

          <div className="px-4 pb-3 md:hidden">
            <BuscadorHeader variante="movil" />
          </div>
        </div>

        <nav className="hidden border-b border-[var(--gray)] bg-[var(--white)] md:block">
          <div className="mx-auto flex max-w-7xl items-center gap-8 px-6">
            <div className="group relative">
              <Link
                href="/productos"
                className="flex items-center gap-1.5 rounded-b-lg bg-[var(--green-primary)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--green-primary-hover)]"
              >
                Categorías <ChevronDown size={16} />
              </Link>
              <div className="absolute left-0 top-full z-50 hidden w-[28rem] grid-cols-2 gap-1 rounded-xl border border-[var(--gray)] bg-[var(--white)] p-3 shadow-lg group-focus-within:grid group-hover:grid">
                {CATEGORIAS.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/productos?categoria=${c.slug}`}
                    className="rounded-lg px-3 py-2 transition-colors hover:bg-[var(--green-primary)]/10"
                  >
                    <span className="block text-sm font-medium">{c.nombre}</span>
                    <span className="block text-xs text-[var(--text-muted)]">{c.descripcion}</span>
                  </Link>
                ))}
              </div>
            </div>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="py-3 text-sm font-medium text-[var(--text)] transition-colors hover:text-[var(--green-primary)]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Menú de navegación">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div
            ref={menuTrapRef}
            className="absolute right-0 top-0 flex h-full w-[82%] max-w-sm flex-col bg-[var(--white)] p-5 animate-fade-up"
          >
            <div className="mb-6 flex items-center justify-between">
              <span className="font-display text-lg font-bold text-[var(--text)]">Menú</span>
              <button onClick={() => setMobileOpen(false)} aria-label="Cerrar menú">
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-[var(--green-primary)]/10"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="tear-strip my-4" />
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Categorías</p>
            <div className="flex flex-col gap-1 overflow-y-auto">
              {CATEGORIAS.map((c) => (
                <Link
                  key={c.slug}
                  href={`/productos?categoria=${c.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-[var(--green-primary)]/10"
                >
                  {c.nombre}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <CarritoDrawer />
    </>
  );
}
