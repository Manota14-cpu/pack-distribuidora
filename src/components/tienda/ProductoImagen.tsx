"use client";

import { useState } from "react";
import Image from "next/image";
import { categoriaPorSlug } from "@/lib/catalogo";
import ProductVisual from "../ProductVisual";

/**
 * Foto del producto o, si no tiene, la ilustración de su categoría. Las fotos
 * van con `contain` sobre blanco: son fotos de producto y no se pueden recortar.
 */
export default function ProductoImagen({
  src,
  nombre,
  categoria,
  className = "",
  iconClassName = "h-14 w-14",
  sizes = "(min-width: 1024px) 22vw, (min-width: 640px) 33vw, 50vw",
  priority = false,
}: {
  src: string | null | undefined;
  nombre: string;
  categoria: string;
  className?: string;
  iconClassName?: string;
  sizes?: string;
  priority?: boolean;
}) {
  // Si la foto no carga, se muestra la ilustración en vez de un recuadro vacío.
  const [rota, setRota] = useState(false);
  if (!src || rota) {
    return (
      <ProductVisual
        icon={categoriaPorSlug(categoria)?.icono ?? "Package"}
        className={className}
        iconClassName={iconClassName}
      />
    );
  }
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-white ${className}`}>
      <Image src={src} alt={nombre} fill sizes={sizes} priority={priority} onError={() => setRota(true)} className="object-contain p-2" />
    </div>
  );
}
