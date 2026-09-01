import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import ProductVisual from "./ProductVisual";

const BENEFITS = [
  "Precios diferenciales por volumen",
  "Asesoramiento comercial dedicado",
  "Reposición programada de stock",
  "Atención dedicada para tu negocio",
];

export default function Wholesale() {
  return (
    <section className="bg-[var(--green-primary)] relative overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-white/80">
            Mayoristas
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold mt-2 text-white">
            ¿Comprás en cantidad?
          </h2>
          <p className="mt-3 text-white/85 max-w-md">
            Accedé a precios especiales, promociones y beneficios exclusivos para compras
            mayoristas.
          </p>
          <ul className="mt-6 flex flex-col gap-2.5">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-center gap-2.5 text-sm text-white/90">
                <CheckCircle2 size={16} className="text-white/90 shrink-0" />
                {b}
              </li>
            ))}
          </ul>
          <Link
            href="/contacto"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-white text-[var(--green-primary)] text-sm font-bold px-6 py-3.5 shadow-[0_10px_24px_-10px_rgba(0,0,0,0.4)] hover:bg-white/95 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-10px_rgba(0,0,0,0.45)] transition-all"
          >
            Quiero ser mayorista <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {["Package", "ShoppingBag", "Layers", "CupSoda", "Disc", "ChefHat"].map((icon, i) => (
            <ProductVisual
              key={icon + i}
              icon={icon}
              className={`aspect-square ${i % 3 === 1 ? "translate-y-4" : ""}`}
              iconClassName="h-9 w-9"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
