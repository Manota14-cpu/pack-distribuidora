import type { Product } from "./types";

export type SortOption =
  | "relevancia"
  | "precio-menor"
  | "precio-mayor"
  | "mas-vendidos"
  | "novedades";

export const SORT_LABELS: Record<SortOption, string> = {
  relevancia: "Relevancia",
  "precio-menor": "Precio: menor a mayor",
  "precio-mayor": "Precio: mayor a menor",
  "mas-vendidos": "Más vendidos",
  novedades: "Novedades",
};

export interface FilterOptions {
  activeCategories: string[];
  maxPrice: number;
  offersOnly: boolean;
  wholesaleOnly: boolean;
}

/** Tope de reserva, solo para cuando todavía no hay productos que medir. */
export const DEFAULT_MAX_PRICE = 6000;

export interface RangoPrecios {
  min: number;
  max: number;
  paso: number;
}

/**
 * Rango del filtro de precio, calculado a partir del catálogo.
 *
 * Antes el tope era el número fijo 6000 y el filtro arrancaba aplicado con ese
 * valor: cualquier producto más caro quedaba invisible en la página de
 * Productos sin que nadie hubiera tocado el filtro. En el buscador sí aparecía,
 * porque ahí no se aplica — de ahí que el síntoma fuera "sale en el buscador
 * pero no en Productos". Derivarlo del catálogo evita que vuelva a pasar,
 * se carguen los precios que se carguen.
 */
export function rangoDePrecios(products: Product[]): RangoPrecios {
  const precios = products
    .map((p) => p.price)
    .filter((n) => typeof n === "number" && Number.isFinite(n) && n >= 0);

  if (precios.length === 0) return { min: 0, max: DEFAULT_MAX_PRICE, paso: 100 };

  const menor = Math.min(...precios);
  const mayor = Math.max(...precios);
  const amplitud = mayor - menor;

  // Un paso acorde a la amplitud: ni de a un peso, ni a saltos tan grandes que
  // el slider no pueda posarse cerca del producto más caro.
  const paso = amplitud > 20_000 ? 500 : amplitud > 5_000 ? 100 : 50;

  const piso = Math.floor(menor / paso) * paso;
  // Hacia arriba, para que el producto más caro entre siempre.
  const techo = Math.max(Math.ceil(mayor / paso) * paso, paso);

  return {
    // Si todos los productos valen lo mismo, piso y techo coincidirían y el
    // slider quedaría inmóvil: se abre un paso hacia abajo.
    min: piso === techo ? Math.max(0, piso - paso) : piso,
    max: techo,
    paso,
  };
}

export function isWholesalePack(unit: string): boolean {
  return /x(5\d|100|\d{3,})u/.test(unit) || unit === "combo";
}

export function filterAndSortProducts(
  products: Product[],
  options: FilterOptions,
  sort: SortOption
): Product[] {
  let list = products.filter((p) => p.price <= options.maxPrice);

  if (options.activeCategories.length > 0) {
    list = list.filter((p) => options.activeCategories.includes(p.category));
  }
  if (options.wholesaleOnly) {
    list = list.filter((p) => isWholesalePack(p.unit));
  }
  if (options.offersOnly) {
    list = list.filter((p) => p.discount);
  }

  const sorted = [...list];
  switch (sort) {
    case "precio-menor":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "precio-mayor":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "mas-vendidos":
      sorted.sort(
        (a, b) => Number(b.bestSeller) - Number(a.bestSeller) || b.rating - a.rating
      );
      break;
    case "novedades":
      sorted.sort((a, b) => Number(b.isNew) - Number(a.isNew));
      break;
    default:
      sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
  }
  return sorted;
}