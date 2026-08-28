"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Search, ShoppingCart, Menu, X, ChevronDown } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useFocusTrap } from "@/lib/use-focus-trap";
import type { Category } from "@/lib/types";
import CartDrawer from "./CartDrawer";
import TopBar from "./TopBar";
import Logo from "./Logo";

interface MiniProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
}

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Productos" },
  { href: "/productos?ofertas=1", label: "Ofertas" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

function useDebounce(value: string, delay = 250) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function Header({ categories }: { categories: Category[] }) {
  const { totalItems, openCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<MiniProduct[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const menuTrapRef = useFocusTrap(mobileOpen);

  const debouncedQuery = useDebounce(query);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const q = debouncedQuery.trim();
    const response = q
      ? fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: controller.signal }).then((r) => {
          if (!r.ok) throw new Error("search failed");
          return r.json();
        })
      : Promise.resolve([]);
    response
      .then((data: MiniProduct[]) => {
        if (active) {
          setSuggestions(data);
          setShowSuggestions(data.length > 0);
        }
      })
      .catch(() => {
        if (active) {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [debouncedQuery]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

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
      <header className="sticky top-0 z-40 bg-[var(--green-header)]">
        {/* Top info bar — animated */}
        <TopBar />

        {/* Main header */}
        <div className="border-b border-white/10">
          <div className="mx-auto max-w-7xl px-4 md:px-6 py-3.5 flex items-center gap-4 md:gap-8">
            <Logo />

            {/* Search - desktop */}
            <div ref={searchRef} className="relative hidden md:block flex-1 max-w-xl">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                placeholder="¿Qué producto estás buscando?"
                className="w-full rounded-full border border-white/20 bg-white/10 py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-white/60 outline-none focus:border-white/60 focus:bg-white/15 transition-colors"
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full mt-2 w-full rounded-2xl border border-[var(--gray)] bg-[var(--white)] shadow-lg overflow-hidden animate-fade-up">
                  {suggestions.map((p) => (
                    <Link
                      key={p.id}
                      href={`/productos/${p.slug}`}
                      onClick={() => { setShowSuggestions(false); setQuery(""); }}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--green-primary)]/10 transition-colors"
                    >
                      <div className="h-9 w-9 rounded-lg bg-[var(--green-primary)]/10 flex items-center justify-center shrink-0">
                        <Search size={14} className="text-[var(--green-primary)]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{p.name}</p>
                        <p className="text-xs text-[var(--text-muted)]">
                          ${p.price.toLocaleString("es-AR")}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1 md:gap-2 ml-auto">
              <button
                onClick={openCart}
                className="relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white hover:text-white/80 transition-colors"
                aria-label="Carrito"
              >
                <ShoppingCart size={20} />
                <span className="hidden lg:inline">Carrito</span>
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 right-0 lg:right-auto lg:left-6 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-[var(--green-primary)]">
                    {totalItems}
                  </span>
                )}
              </button>
              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden p-2 text-white"
                aria-label="Abrir menú"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>

          {/* Search - mobile */}
          <div className="md:hidden px-4 pb-3">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="¿Qué producto estás buscando?"
                className="w-full rounded-full border border-[var(--gray)] bg-[var(--gray-light)] py-2.5 pl-11 pr-4 text-sm outline-none focus:border-[var(--green-primary)]"
              />
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="hidden md:block border-b border-[var(--gray)] bg-[var(--white)]">
          <div className="mx-auto max-w-7xl px-6 flex items-center gap-8">
            <div className="group relative">
              <Link
                href="/productos"
                className="flex items-center gap-1.5 bg-[var(--green-primary)] text-white text-sm font-semibold px-4 py-2.5 rounded-b-lg hover:bg-[var(--green-primary-hover)] transition-colors"
              >
                Categorías <ChevronDown size={16} />
              </Link>
              <div className="absolute left-0 top-full hidden group-hover:grid grid-cols-2 gap-1 w-96 bg-[var(--white)] border border-[var(--gray)] rounded-xl shadow-lg p-3 z-50">
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/productos?categoria=${c.slug}`}
                    className="px-3 py-2 rounded-lg text-sm hover:bg-[var(--green-primary)]/10 transition-colors"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
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
            <div className="tear-strip my-4" />
            <p className="px-3 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)] mb-2">
              Categorías
            </p>
            <div className="flex flex-col gap-1 overflow-y-auto">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/productos?categoria=${c.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm hover:bg-[var(--green-primary)]/10 transition-colors"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <CartDrawer />
    </>
  );
}
