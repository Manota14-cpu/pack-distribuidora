"use client";

import { Minus, Plus } from "lucide-react";
import { cantidadTexto, maximo, paso, type Producto } from "@/lib/catalogo";

/** − cantidad + ; en los productos por peso la cantidad va de a 100 g. */
export default function CantidadControl({
  producto,
  cantidad,
  onChange,
  size = "md",
}: {
  producto: Pick<Producto, "porPeso" | "unidad" | "stock" | "nombre">;
  cantidad: number;
  onChange: (nueva: number) => void;
  size?: "sm" | "md";
}) {
  const s = paso(producto);
  const tope = maximo(producto);
  const boton =
    size === "sm"
      ? "h-8 w-8"
      : "h-10 w-10";
  return (
    <div className="inline-flex items-center rounded-full border border-[var(--gray)] bg-white">
      <button
        type="button"
        onClick={() => onChange(cantidad - s)}
        aria-label={`Quitar ${producto.porPeso ? "100 g" : "uno"} de ${producto.nombre}`}
        className={`${boton} flex items-center justify-center rounded-full text-[var(--text)] hover:bg-[var(--gray-light)] transition-colors`}
      >
        <Minus size={size === "sm" ? 14 : 16} />
      </button>
      <span
        className={`min-w-10 px-1 text-center font-bold tabular-nums ${size === "sm" ? "text-sm" : "text-base"}`}
        aria-live="polite"
      >
        {cantidadTexto(producto, cantidad)}
      </span>
      <button
        type="button"
        onClick={() => onChange(cantidad + s)}
        disabled={cantidad + s > tope}
        aria-label={`Sumar ${producto.porPeso ? "100 g" : "uno"} de ${producto.nombre}`}
        className={`${boton} flex items-center justify-center rounded-full text-[var(--text)] hover:bg-[var(--gray-light)] disabled:opacity-30 disabled:hover:bg-transparent transition-colors`}
      >
        <Plus size={size === "sm" ? 14 : 16} />
      </button>
    </div>
  );
}
