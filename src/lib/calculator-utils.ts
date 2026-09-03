import type { Product } from "./types";

// Cantidad estimada recomendada por persona (criterio general de gastronomía
// para eventos de medio día — se puede ajustar libremente en el resultado).
export const EVENT_RATIOS: Record<"vasos" | "platos" | "cubiertos" | "servilletas", number> = {
  vasos: 2,
  platos: 1,
  cubiertos: 1,
  servilletas: 3,
};

export const EVENT_CATEGORY_LABELS: Record<keyof typeof EVENT_RATIOS, string> = {
  vasos: "Vasos",
  platos: "Platos",
  cubiertos: "Cubiertos",
  servilletas: "Servilletas",
};

// Extrae la cantidad de unidades por paquete a partir del texto de la unidad
// (ej. "x50u" -> 50). Si no se puede interpretar, asume 1 (venta por unidad).
export function parsePackSize(unit: string): number {
  const match = unit.match(/x?(\d+)\s*u?/i);
  const n = match ? parseInt(match[1], 10) : NaN;
  return Number.isFinite(n) && n > 0 ? n : 1;
}

export interface CalculatorLine {
  category: keyof typeof EVENT_RATIOS;
  product: Product;
  neededUnits: number;
  packSize: number;
  packsToBuy: number;
  subtotal: number;
}

export function buildCalculatorLines(
  personas: number,
  activeCategories: Set<keyof typeof EVENT_RATIOS>,
  productByCategory: Partial<Record<keyof typeof EVENT_RATIOS, Product>>
): CalculatorLine[] {
  const lines: CalculatorLine[] = [];
  for (const category of Object.keys(EVENT_RATIOS) as (keyof typeof EVENT_RATIOS)[]) {
    if (!activeCategories.has(category)) continue;
    const product = productByCategory[category];
    if (!product) continue;
    const neededUnits = Math.max(1, personas) * EVENT_RATIOS[category];
    const packSize = parsePackSize(product.unit);
    const packsToBuy = Math.ceil(neededUnits / packSize);
    lines.push({
      category,
      product,
      neededUnits,
      packSize,
      packsToBuy,
      subtotal: packsToBuy * product.price,
    });
  }
  return lines;
}

// Elige el producto mas representativo de una categoria: preferimos el mas
// vendido, despues el destacado, y si no hay ninguno el primero disponible.
export function pickRepresentativeProduct(products: Product[]): Product | undefined {
  return (
    products.find((p) => p.bestSeller) ??
    products.find((p) => p.featured) ??
    products[0]
  );
}
