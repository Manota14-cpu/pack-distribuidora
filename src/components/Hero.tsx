import Link from "next/link";
import { ArrowRight, Leaf } from "lucide-react";
import { TRUST_POINTS } from "@/lib/content";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[var(--green-primary)]">
      <div className="mx-auto max-w-7xl px-6 pt-14 pb-16 md:pt-20 md:pb-24 flex flex-col items-center text-center">
        <div className="animate-fade-up max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 border border-white/20 px-3 py-1.5 text-xs font-semibold text-[var(--green-primary)] mb-6">
            <Leaf size={13} className="text-[var(--green-primary)]" />
            Minorista y mayorista
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.4rem] font-bold leading-[1.05] tracking-tight text-balance text-white">
            Soluciones descartables,
            <br />
            siempre a mano.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-white/85 max-w-md mx-auto">
            Productos descartables de calidad para tu hogar, comercio o evento.
          </p>
          <div className="mt-9 flex justify-center">
            <Link
              href="/productos"
              className="inline-flex items-center gap-2 rounded-full bg-white text-[var(--green-primary)] text-base font-bold px-8 py-4 shadow-[0_14px_30px_-10px_rgba(0,0,0,0.45)] hover:bg-white/95 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-10px_rgba(0,0,0,0.5)] transition-all"
            >
              Ver todos los productos <ArrowRight size={18} />
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 max-w-md mx-auto">
            {TRUST_POINTS.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2.5 text-sm text-white">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <Icon size={15} className="text-white" />
                </span>
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="tear-strip" />
    </section>
  );
}
