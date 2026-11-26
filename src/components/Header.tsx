"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useFocusTrap } from "@/lib/use-focus-trap";
import TopBar from "./TopBar";
import Logo from "./Logo";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Productos" },
  { href: "/herramientas", label: "Herramientas" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/preguntas-frecuentes", label: "Preguntas frecuentes" },
  { href: "/contacto", label: "Contacto" },
];

// La búsqueda, el carrito y las categorías ahora están dentro de la tienda de
// Visual App (/productos); el encabezado solo lleva hasta ahí.
export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuTrapRef = useFocusTrap(mobileOpen);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 bg-[var(--green-primary)]">
        {/* Top info bar — animated */}
        <TopBar />

        {/* Main header */}
        <div className="border-b border-white/10">
          <div className="mx-auto max-w-7xl px-4 md:px-6 py-3.5 flex items-center gap-4 md:gap-8">
            <Logo />

            <div className="flex items-center gap-1 md:gap-2 ml-auto">
              <Link
                href="/productos"
                className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--green-primary)] hover:bg-white/90 transition-colors"
              >
                <ShoppingBag size={18} />
                <span className="sm:hidden">Tienda</span>
                <span className="hidden sm:inline">Comprar online</span>
              </Link>
              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden p-2 text-white"
                aria-label="Abrir menú"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="hidden md:block border-b border-[var(--gray)] bg-[var(--white)]">
          <div className="mx-auto max-w-7xl px-6 flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium py-3 text-[var(--text)] hover:text-[var(--green-primary)] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      {/* Mobile menu drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Menú de navegación">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div ref={menuTrapRef} className="absolute right-0 top-0 h-full w-[82%] max-w-sm bg-[var(--white)] p-5 flex flex-col animate-fade-up">
            <div className="flex items-center justify-between mb-6">
              <span className="font-display text-lg font-bold text-[var(--text)]">
                Menú
              </span>
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
                  className="px-3 py-3 rounded-lg text-base font-medium hover:bg-[var(--green-primary)]/10 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
