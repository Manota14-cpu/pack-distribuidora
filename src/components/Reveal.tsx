"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Entrada única y coherente para grillas de cards (categorías, ofertas,
 * productos). Se activa una sola vez cuando la grilla entra en viewport;
 * cada hijo se anima con un pequeño delay escalonado según su índice.
 * `prefers-reduced-motion` ya lo neutraliza globalmente (ver globals.css).
 */
export default function Reveal({
  children,
  className = "",
}: {
  children: ReactNode[];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -80px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children.map((child, i) => (
        <div
          key={i}
          style={{
            transitionDelay: visible ? `${Math.min(i, 8) * 55}ms` : "0ms",
          }}
          className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
