"use client";

import { useState } from "react";
import {
  Carrot,
  Beef,
  Croissant,
  Store,
  PartyPopper,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

interface Rubro {
  key: string;
  label: string;
  icon: LucideIcon;
  slug: string;
}

const RUBROS: Rubro[] = [
  { key: "verduleria", label: "Verdulería", icon: Carrot, slug: "pack-verduleria" },
  { key: "carniceria", label: "Carnicería", icon: Beef, slug: "pack-carniceria" },
  { key: "panaderia", label: "Panadería", icon: Croissant, slug: "pack-panaderia" },
  { key: "kiosco", label: "Kiosco / almacén", icon: Store, slug: "pack-kiosco-almacen" },
  { key: "eventos", label: "Eventos y cumpleaños", icon: PartyPopper, slug: "pack-cumpleanos" },
  { key: "otro", label: "Otro rubro gastronómico", icon: UtensilsCrossed, slug: "pack-resto-rubros" },
];

export default function RubroSelector({ packsBySlug }: { packsBySlug: Record<string, Product> }) {
  const [selected, setSelected] = useState<Rubro | null>(null);
  const selectedProduct = selected ? packsBySlug[selected.slug] : undefined;

  return (
    <div className="rounded-3xl border border-[var(--gray)] bg-[var(--white)] p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--green-primary)]">
          <Store size={20} className="text-white" />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold text-[var(--text)]">
            Armá tu rubro
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            Elegí tu tipo de negocio y te mostramos el pack pensado para vos.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {RUBROS.map((rubro) => {
          const Icon = rubro.icon;
          const isSelected = selected?.key === rubro.key;
          return (
            <button
              key={rubro.key}
              type="button"
              onClick={() => setSelected(rubro)}
              aria-pressed={isSelected}
              className={`flex flex-col items-center gap-2 rounded-2xl border-2 px-3 py-4 text-center transition-colors ${
                isSelected
                  ? "border-[var(--green-primary)] bg-[var(--green-primary)]/5"
                  : "border-[var(--gray)] hover:border-[var(--green-primary)]/40"
              }`}
            >
              <Icon
                size={22}
                className={isSelected ? "text-[var(--green-primary)]" : "text-[var(--text-muted)]"}
              />
              <span className="text-xs font-semibold leading-tight">{rubro.label}</span>
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="mt-6">
          <div className="tear-strip mb-5" />
          {selectedProduct ? (
            <div>
              <p className="text-sm font-semibold text-[var(--green-primary)] mb-3">
                Recomendado para {selected.label.toLowerCase()}
              </p>
              <div className="max-w-xs">
                <ProductCard product={selectedProduct} />
              </div>
            </div>
          ) : (
            <p className="text-sm text-[var(--text-muted)]">
              Por ahora no tenemos un pack armado para este rubro — escribinos por
              WhatsApp y te armamos uno a medida.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
