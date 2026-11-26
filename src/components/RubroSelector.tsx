"use client";

import { useState } from "react";
import {
  Carrot,
  Beef,
  Croissant,
  Store,
  PartyPopper,
  UtensilsCrossed,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";
import { STORE_INFO } from "@/lib/content";

interface Rubro {
  key: string;
  label: string;
  icon: LucideIcon;
}

const RUBROS: Rubro[] = [
  { key: "verduleria", label: "Verdulería", icon: Carrot },
  { key: "carniceria", label: "Carnicería", icon: Beef },
  { key: "panaderia", label: "Panadería", icon: Croissant },
  { key: "kiosco", label: "Kiosco / almacén", icon: Store },
  { key: "eventos", label: "Eventos y cumpleaños", icon: PartyPopper },
  { key: "otro", label: "Otro rubro gastronómico", icon: UtensilsCrossed },
];

// Los packs armados por rubro eran productos de la tienda propia. Con el
// catálogo en Visual App, el pack se arma a pedido por WhatsApp.
export default function RubroSelector() {
  const [selected, setSelected] = useState<Rubro | null>(null);

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
            Elegí tu tipo de negocio y te armamos un pack a medida.
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
          <p className="text-sm text-[var(--text-muted)]">
            Contanos qué vendés y cuánto movés por semana, y te armamos el pack para{" "}
            {selected.label.toLowerCase()} con lo que más te conviene.
          </p>
          <a
            href={`${STORE_INFO.whatsapp}?text=${encodeURIComponent(
              `Hola! Quiero que me armen un pack para ${selected.label.toLowerCase()}.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--green-primary)] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[var(--green-primary-hover)]"
          >
            <MessageCircle size={16} /> Pedir mi pack por WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}
