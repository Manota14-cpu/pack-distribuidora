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

export const DEFAULT_MAX_PRICE = 6000;

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