"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Tags,
  Truck,
  Headset,
  Heart,
  Handshake,
  type LucideIcon,
} from "lucide-react";

interface Slide {
  icon: LucideIcon;
  title: string;
  text: string;
  cta: { label: string; href: string };
}

// Por qué elegirnos — antes vivía en /nosotros, ahora es el contenido del
// carrusel principal de la home.
const SLIDES: Slide[] = [
  {
    icon: LayoutGrid,
    title: "Amplia variedad",
    text: "Todo lo que necesitás, en un solo lugar.",
    cta: { label: "Ver productos", href: "/productos" },
  },
  {
    icon: Tags,
    title: "Precios competitivos",
    text: "Buscamos ofrecerte los mejores precios para acompañar tu negocio.",
    cta: { label: "Ver ofertas", href: "/productos?ofertas=1" },
  },
  {
    icon: Truck,
    title: "Envíos",
    text: "Llevamos tus pedidos hasta donde estés, de forma rápida y segura.",
    cta: { label: "Cómo enviamos", href: "/informacion-de-compra#envios" },
  },
  {
    icon: Headset,
    title: "Atención personalizada",
    text: "Te conocemos, escuchamos, asesoramos, como nos gusta que nos atiendan a nosotros.",
    cta: { label: "Conocenos", href: "/nosotros" },
  },
  {
    icon: Heart,
    title: "Empatía",
    text: "Conocemos tus necesidades y trabajamos con vos para encontrar siempre la mejor solución.",
    cta: { label: "Contactanos", href: "/contacto" },
  },
  {
    icon: Handshake,
    title: "Compromiso",
    text: "Trabajamos con dedicación y compromiso para acompañarte siempre.",
    cta: { label: "Quiero ser mayorista", href: "/contacto" },
  },
];

const AUTOPLAY_MS = 5500;

export default function PromoCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (index: number) => setCurrent(((index % SLIDES.length) + SLIDES.length) % SLIDES.length),
    []
  );
  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    if (paused) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    timer.current = setInterval(next, AUTOPLAY_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [next, paused]);

  return (
    <section
      aria-label="Por qué elegirnos"
      className="relative bg-[var(--gray-light)] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="mx-auto max-w-7xl">
        <div className="relative h-80 sm:h-56 md:h-64 overflow-hidden">
          <div
            className="flex h-full"
            style={{
              transform: `translateX(-${current * 100}%)`,
              transition: "transform 0.6s cubic-bezier(0.65,0,0.35,1)",
            }}
          >
            {SLIDES.map((slide, i) => (
              <PromoSlide key={slide.title} slide={slide} active={i === current} />
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={prev}
        aria-label="Anterior"
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[var(--green-primary)] shadow-md hover:bg-[var(--green-primary)] hover:text-white transition-colors"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        aria-label="Siguiente"
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[var(--green-primary)] shadow-md hover:bg-[var(--green-primary)] hover:text-white transition-colors"
      >
        <ChevronRight size={20} />
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.title}
            onClick={() => goTo(i)}
            aria-label={`Ir al slide ${i + 1}: ${slide.title}`}
            aria-current={i === current}
            className={`h-2.5 rounded-full transition-all ${
              i === current ? "w-7 bg-[var(--green-primary)]" : "w-2.5 bg-[var(--green-primary)]/25 hover:bg-[var(--green-primary)]/50"
            }`}
          />
        ))}
      </div>

      <div className="tear-strip absolute bottom-0 left-0 right-0" />
    </section>
  );
}

function PromoSlide({ slide, active }: { slide: Slide; active: boolean }) {
  const Icon = slide.icon;
  return (
    <div
      className="flex h-full w-full shrink-0 items-center gap-6 px-14 sm:px-12 md:px-16 pb-6 sm:pb-0"
      aria-hidden={!active}
    >
      <div
        className="hidden sm:flex h-28 w-28 md:h-32 md:w-32 shrink-0 items-center justify-center rounded-3xl"
        style={{
          background:
            "linear-gradient(155deg, color-mix(in srgb, var(--green-primary) 88%, white) 0%, var(--green-primary) 55%, color-mix(in srgb, var(--green-primary) 82%, black) 100%)",
        }}
      >
        <Icon className="text-white" size={48} strokeWidth={1.5} />
      </div>

      <div className="flex flex-col items-start gap-2 max-w-md">
        <div
          className="flex sm:hidden h-12 w-12 items-center justify-center rounded-2xl mb-1"
          style={{
            background:
              "linear-gradient(155deg, color-mix(in srgb, var(--green-primary) 88%, white) 0%, var(--green-primary) 55%, color-mix(in srgb, var(--green-primary) 82%, black) 100%)",
          }}
        >
          <Icon className="text-white" size={22} strokeWidth={1.5} />
        </div>
        <h2 className="font-display text-xl sm:text-2xl font-bold text-[var(--text)] tracking-tight text-balance">
          {slide.title}
        </h2>
        <p className="text-sm text-[var(--text-muted)] leading-snug">{slide.text}</p>
        <Link
          href={slide.cta.href}
          tabIndex={active ? 0 : -1}
          className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[var(--green-primary)] text-white text-sm font-semibold px-5 py-2.5 hover:bg-[var(--green-primary-hover)] hover:-translate-y-0.5 transition-all"
        >
          {slide.cta.label}
        </Link>
      </div>
    </div>
  );
}
