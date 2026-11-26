// Cantidad estimada recomendada por persona (criterio general de gastronomía
// para eventos de medio día — se puede ajustar libremente en el resultado).
export const EVENT_RATIOS: Record<"vasos" | "platos" | "cubiertos" | "servilletas", number> = {
  vasos: 2,
  platos: 1,
  cubiertos: 1,
  servilletas: 3,
};

export type EventCategory = keyof typeof EVENT_RATIOS;

export const EVENT_CATEGORY_LABELS: Record<EventCategory, string> = {
  vasos: "Vasos",
  platos: "Platos",
  cubiertos: "Cubiertos",
  servilletas: "Servilletas",
};

export interface CalculatorLine {
  category: EventCategory;
  units: number;
}

/**
 * Unidades sugeridas por categoría. Ya no elige productos ni arma el carrito:
 * el catálogo vive en la tienda de Visual App, así que la calculadora dice
 * cuánto hace falta y el cliente elige ahí la presentación.
 */
export function buildCalculatorLines(personas: number, activeCategories: Set<EventCategory>): CalculatorLine[] {
  return (Object.keys(EVENT_RATIOS) as EventCategory[])
    .filter((category) => activeCategories.has(category))
    .map((category) => ({ category, units: Math.max(1, personas) * EVENT_RATIOS[category] }));
}

/** Mensaje de WhatsApp con el cálculo, para pedir que lo armen. */
export function calculatorWhatsAppText(personas: number, lines: CalculatorLine[]): string {
  const detalle = lines.map((l) => `• ${EVENT_CATEGORY_LABELS[l.category]}: ${l.units}`).join("\n");
  return `Hola! Quiero armar un pedido para un evento de ${personas} personas:\n${detalle}`;
}
