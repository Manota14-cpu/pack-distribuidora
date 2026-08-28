import Link from "next/link";
import { ArrowRight, Leaf } from "lucide-react";
import ProductVisual from "./ProductVisual";
import { TRUST_POINTS } from "@/lib/content";

const FLOAT_ICONS = ["CupSoda", "Disc", "Utensils", "ShoppingBag"];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[var(--green-light)]">
      <div className="mx-auto max-w-7xl px-6 pt-14 pb-16 md:pt-20 md:pb-24 grid md:grid-cols-2 gap-12 items-center">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 border border-white/20 px-3 py-1.5 text-xs font-semibold text-[var(--green-primary)] mb-6">
            <Leaf size={13} className="text-[var(--green-primary)]" />
            Minorista y mayorista
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.4rem] font-bold leading-[1.05] text-white">
            Soluciones descartables,
            <br />
            siempre a mano.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-white/85 max-w-md">
            Productos descartables de calidad para tu hogar, comercio o evento.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/productos"
              className="inline-flex items-center gap-2 rounded-full bg-white text-[var(--green-primary)] text-sm font-semibold px-6 py-3.5 hover:bg-white/90 transition-colors"
            >
              Ver todos los productos <ArrowRight size={16} />
            </Link>
            <Link
              href="/nosotros"
              className="inline-flex items-center gap-2 rounded-full border border-white/80 text-white text-sm font-semibold px-6 py-3.5 hover:bg-white hover:text-[var(--green-primary)] transition-colors"
            >
              Conocer más
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-3 max-w-md">
            {TRUST_POINTS.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm text-white">
                <Icon size={16} className="text-white/80 shrink-0" />
                {label}
              </div>
            ))}
          </div>
        </div>

        <div className="relative animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <div className="grid grid-cols-2 gap-4">
            {FLOAT_ICONS.map((icon, i) => (
              <ProductVisual
                key={icon}
                icon={icon}
                className={`aspect-square shadow-sm ${i === 1 || i === 2 ? "translate-y-6" : ""}`}
                iconClassName="h-16 w-16 md:h-20 md:w-20"
              />
            ))}
          </div>
          <div className="absolute -bottom-4 -left-4 hidden sm:flex items-center gap-2 rounded-xl bg-[var(--white)] shadow-lg px-4 py-3 border border-[var(--gray)]">
            <span className="h-2 w-2 rounded-full bg-[var(--green-primary)] animate-pulse" />
            <span className="text-xs font-semibold text-[var(--text)]">+500 productos disponibles</span>
          </div>
        </div>
      </div>
      <div className="tear-strip" />
    </section>
  );
}
