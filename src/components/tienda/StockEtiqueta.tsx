import { cantidadTexto, quedanPocas, type Producto } from "@/lib/catalogo";

export default function StockEtiqueta({
  producto,
  className = "",
}: {
  producto: Pick<Producto, "disponible" | "stock" | "porPeso" | "unidad">;
  className?: string;
}) {
  if (!producto.disponible || producto.stock === 0) {
    return <span className={`text-xs font-semibold text-red-600 ${className}`}>Sin stock</span>;
  }
  if (quedanPocas(producto)) {
    return (
      <span className={`text-xs font-semibold text-amber-700 ${className}`}>
        ¡Últimas {producto.stock} unidades!
      </span>
    );
  }
  return (
    <span className={`text-xs font-medium text-[var(--green-primary)] ${className}`}>
      En stock
      {typeof producto.stock === "number" && producto.porPeso && ` · ${cantidadTexto(producto, producto.stock)}`}
    </span>
  );
}
