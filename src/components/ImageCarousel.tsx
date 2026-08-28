"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  src: string;
  alt: string;
}

export default function ImageCarousel({ slides }: { slides: Slide[] }) {
  const [current, setCurrent] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (index: number) => setCurrent(((index % slides.length) + slides.length) % slides.length),
    [slides.length]
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    timer.current = setInterval(next, 5000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [next]);

  if (slides.length === 1) {
    return (
      <div className="rounded-3xl overflow-hidden">
        <ImageCarouselSlide slide={slides[0]} priority />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="rounded-3xl overflow-hidden">
        <div className="flex" style={{ transform: `translateX(-${current * (100 / slides.length)}%)`, transition: "transform 0.6s ease" }}>
          {slides.map((slide, i) => (
            <ImageCarouselSlide key={slide.src} slide={slide} priority={i === current} />
          ))}
        </div>
      </div>

      <button
        onClick={prev}
        aria-label="Anterior"
        className="absolute left-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[var(--green-primary)] shadow-lg hover:bg-white transition-colors"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={next}
        aria-label="Siguiente"
        className="absolute right-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[var(--green-primary)] shadow-lg hover:bg-white transition-colors"
      >
        <ChevronRight size={22} />
      </button>

      <div className="mt-4 flex items-center justify-center gap-2">
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            onClick={() => goTo(i)}
            aria-label={`Ir a la imagen ${i + 1}`}
            className={`h-2.5 rounded-full transition-all ${
              i === current ? "w-7 bg-[var(--green-primary)]" : "w-2.5 bg-[var(--gray)]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function ImageCarouselSlide({ slide, priority }: { slide: Slide; priority?: boolean }) {
  return (
    <div className="relative w-full shrink-0" style={{ aspectRatio: "21 / 9" }}>
      <Image
        src={slide.src}
        alt={slide.alt}
        fill
        priority={priority}
        sizes="(min-width: 1280px) 1248px, 100vw"
        className="object-cover"
      />
    </div>
  );
}