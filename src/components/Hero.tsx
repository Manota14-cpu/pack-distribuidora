import Link from "next/link";
import { ArrowRight, Leaf } from "lucide-react";
import { TRUST_POINTS } from "@/lib/content";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[var(--green-light)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, #ffffff 0 8px, transparent 9px), radial-gradient(circle at 80% 20%, #ffffff 0 14px, transparent 15px), radial-gradient(circle at 70% 80%, #ffffff 0 10px, transparent 11px), radial-gradient(circle at 30% 70%, #ffffff 0 6px, transparent 7px), radial-gradient(circle at 90% 60%, #ffffff 0 9px, transparent 10px), radial-gradient(circle at 10% 85%, #ffffff 0 12px, transparent 13px)",
          backgroundSize: "340px 340px, 420px 420px, 380px 380px, 300px 300px, 360px 360px, 320px 320px",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-6 pt-14 pb-16 md:pt-20 md:pb-24 flex flex-col items-center text-center">
        <div className="animate-fade-up max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 border border-white/20 px-3 py-1.5 text-xs font-semibold text-[var(--green-primary)] mb-6">
            <Leaf size={13} className="text-[var(--green-primary)]" />
            Minorista y mayorista
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.4rem] font-bold leading-[1.05] text-white">
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

          <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-3 max-w-md mx-auto">
            {TRUST_POINTS.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm text-white">
                <Icon size={16} className="text-white/80 shrink-0" />
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
