"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import ProductoImagen from "./ProductoImagen";

export default function GaleriaProducto({
  imagenes,
  nombre,
  categoria,
}: {
  imagenes: string[];
  nombre: string;
  categoria: string;
}) {
  const [actual, setActual] = useState(0);
  const [ampliada, setAmpliada] = useState(false);
  const total = imagenes.length;
  const mover = (d: number) => setActual((i) => (i + d + total) % total);

  useEffect(() => {
    if (!ampliada) return;
    const teclas = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAmpliada(false);
      if (e.key === "ArrowRight") setActual((i) => (i + 1) % total);
      if (e.key === "ArrowLeft") setActual((i) => (i - 1 + total) % total);
    };
    document.addEventListener("keydown", teclas);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", teclas);
      document.body.style.overflow = "";
    };
  }, [ampliada, total]);

  if (total === 0) {
    return (
      <div className="flex flex-col gap-2">
        <ProductoImagen
          src={null}
          nombre={nombre}
          categoria={categoria}
          className="aspect-[4/3] w-full"
          iconClassName="h-24 w-24"
        />
        <p className="text-center text-xs text-[var(--text-muted)]">Foto ilustrativa de la categoría</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="group relative aspect-square w-full overflow-hidden rounded-2xl border border-[var(--gray)] bg-white">
        <button
          type="button"
          onClick={() => setAmpliada(true)}
          aria-label="Ver la foto en grande"
          className="absolute inset-0 cursor-zoom-in"
        >
          <Image
            src={imagenes[actual]}
            alt={`${nombre}${total > 1 ? ` — foto ${actual + 1}` : ""}`}
            fill
            priority
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          />
        </button>
        <span className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-[var(--text-muted)] shadow-sm">
          <ZoomIn size={13} /> Ampliar
        </span>
        {total > 1 && (
          <>
            <Flecha lado="izq" onClick={() => mover(-1)} />
            <Flecha lado="der" onClick={() => mover(1)} />
          </>
        )}
      </div>

      {total > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {imagenes.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActual(i)}
              aria-label={`Ver foto ${i + 1}`}
              aria-current={i === actual}
              className={`relative aspect-square overflow-hidden rounded-xl border-2 bg-white transition-colors ${
                i === actual ? "border-[var(--green-primary)]" : "border-[var(--gray)] hover:border-[var(--green-primary)]/50"
              }`}
            >
              <Image src={src} alt="" fill sizes="80px" className="object-contain p-1" />
            </button>
          ))}
        </div>
      )}

      {ampliada && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Fotos de ${nombre}`}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4"
          onClick={() => setAmpliada(false)}
        >
          <button
            type="button"
            onClick={() => setAmpliada(false)}
            aria-label="Cerrar"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
          >
            <X size={22} />
          </button>
          <div className="relative h-[85vh] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <Image src={imagenes[actual]} alt={nombre} fill sizes="100vw" className="object-contain" />
            {total > 1 && (
              <>
                <Flecha lado="izq" onClick={() => mover(-1)} oscuro />
                <Flecha lado="der" onClick={() => mover(1)} oscuro />
              </>
            )}
          </div>
          {total > 1 && (
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/80">
              {actual + 1} / {total}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function Flecha({ lado, onClick, oscuro = false }: { lado: "izq" | "der"; onClick: () => void; oscuro?: boolean }) {
  const Icono = lado === "izq" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={lado === "izq" ? "Foto anterior" : "Foto siguiente"}
      className={`absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full shadow-md transition-colors ${
        lado === "izq" ? "left-3" : "right-3"
      } ${oscuro ? "bg-white/15 text-white hover:bg-white/30" : "bg-white/95 text-[var(--text)] hover:bg-white"}`}
    >
      <Icono size={20} />
    </button>
  );
}
