import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Leaf, MessageCircle } from "lucide-react";
import { STORE_INFO } from "@/lib/content";
import flyer from "../../public/imagenes/pack-gastronomico.png";

const ATAJOS = [
  { href: "/productos?categoria=bolsas", label: "Bolsas" },
  { href: "/productos?categoria=bandejas-envases", label: "Bandejas y envases" },
  { href: "/productos?categoria=vasos", label: "Vasos" },
  { href: "/productos?categoria=eventos", label: "Cotillón" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[var(--green-primary)]">
      {/* Luz suave detrás de la imagen, para que no sea un verde plano. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-[36rem] w-[36rem] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--green-primary) 55%, white) 0%, transparent 70%)" }}
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 pb-16 pt-12 md:grid-cols-[1.1fr_0.9fr] md:pb-20 md:pt-16 lg:gap-16">
        <div className="animate-fade-up text-center md:text-left">
          <span className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-[var(--green-primary)]">
            <Leaf size={13} />
            Minorista y mayorista · Rafaela, Santa Fe
          </span>
          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-balance text-white sm:text-5xl lg:text-[3.6rem]">
            Soluciones descartables,{" "}
            <span className="text-[var(--accent)]">siempre a mano.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-md text-base text-white/85 sm:text-lg md:mx-0">
            Bandejas, bolsas, vasos, film y cotillón para tu comercio, tu casa o tu evento. Comprá online con
            precios y stock al día.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center md:justify-start">
            <Link
              href="/productos"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-7 py-4 text-base font-bold text-[var(--accent-ink)] shadow-[0_14px_30px_-12px_rgba(0,0,0,0.5)] transition-all hover:-translate-y-0.5 hover:bg-[var(--accent-hover)]"
            >
              Ver productos <ArrowRight size={18} />
            </Link>
            <a
              href={STORE_INFO.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/40 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
            >
              <MessageCircle size={18} /> Pedir por WhatsApp
            </a>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 md:justify-start">
            <span className="text-xs font-medium text-white/70">Lo más buscado:</span>
            {ATAJOS.map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white hover:text-[var(--green-primary)]"
              >
                {a.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm md:max-w-md">
          <div className="absolute -inset-3 rotate-3 rounded-[2rem] bg-[var(--accent)]/90" aria-hidden />
          <Image
            src={flyer}
            alt="Pack gastronómico de Pack Distribuidora: vasos, platos, tenedores y servilletas descartables"
            priority
            sizes="(min-width: 768px) 420px, 90vw"
            className="relative rounded-[1.75rem] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.55)]"
          />
        </div>
      </div>
      <div className="tear-strip" />
    </section>
  );
}
