import { describe, expect, it } from "vitest";
import {
  DEFAULT_MAX_PRICE,
  filterAndSortProducts,
  rangoDePrecios,
} from "@/lib/products-utils";
import type { Product } from "@/lib/types";

/** Producto mínimo: solo importan el precio y la categoría para estas pruebas. */
function producto(name: string, price: number, extra: Partial<Product> = {}): Product {
  return {
    id: name,
    slug: name,
    name,
    category: "bolsas",
    description: "",
    longDescription: "",
    features: [],
    price,
    icon: "Package",
    stock: 10,
    unit: "unidad",
    featured: false,
    rating: 0,
    ...extra,
  } as Product;
}

describe("rangoDePrecios", () => {
  it("el tope cubre siempre al producto más caro", () => {
    const r = rangoDePrecios([producto("a", 800), producto("b", 23_423)]);
    expect(r.max).toBeGreaterThanOrEqual(23_423);
  });

  it("no esconde productos caros al abrir la página", () => {
    // Este era el bug: el tope fijo de 6000 dejaba fuera todo lo más caro,
    // aunque el usuario no hubiera tocado el filtro.
    const catalogo = [producto("barato", 800), producto("caro", 23_423)];
    const r = rangoDePrecios(catalogo);
    const visibles = filterAndSortProducts(
      catalogo,
      { activeCategories: [], maxPrice: r.max, offersOnly: false, wholesaleOnly: false },
      "relevancia"
    );
    expect(visibles).toHaveLength(2);
  });

  it("el piso no deja afuera al más barato", () => {
    const r = rangoDePrecios([producto("a", 430), producto("b", 5000)]);
    expect(r.min).toBeLessThanOrEqual(430);
  });

  it("usa un paso más grande cuando el catálogo abarca mucho", () => {
    const chico = rangoDePrecios([producto("a", 100), producto("b", 900)]);
    const grande = rangoDePrecios([producto("a", 100), producto("b", 90_000)]);
    expect(grande.paso).toBeGreaterThan(chico.paso);
  });

  it("con catálogo vacío devuelve el tope de reserva", () => {
    const r = rangoDePrecios([]);
    expect(r.max).toBe(DEFAULT_MAX_PRICE);
  });

  it("con un solo producto el rango sigue siendo usable", () => {
    const r = rangoDePrecios([producto("único", 12_000)]);
    expect(r.max).toBeGreaterThanOrEqual(12_000);
    expect(r.paso).toBeGreaterThan(0);
    expect(r.max).toBeGreaterThan(r.min);
  });

  it("ignora precios inválidos en vez de romperse", () => {
    const r = rangoDePrecios([
      producto("ok", 500),
      producto("nan", Number.NaN),
      producto("negativo", -100),
    ]);
    expect(Number.isFinite(r.max)).toBe(true);
    expect(r.max).toBeGreaterThanOrEqual(500);
  });
});

describe("filterAndSortProducts — filtro de precio", () => {
  const catalogo = [producto("a", 500), producto("b", 5_000), producto("c", 20_000)];

  it("deja pasar solo lo que entra en el tope", () => {
    const r = filterAndSortProducts(
      catalogo,
      { activeCategories: [], maxPrice: 5_000, offersOnly: false, wholesaleOnly: false },
      "relevancia"
    );
    expect(r.map((p) => p.name)).toEqual(["a", "b"]);
  });

  it("incluye el producto cuyo precio es exactamente el tope", () => {
    const r = filterAndSortProducts(
      catalogo,
      { activeCategories: [], maxPrice: 500, offersOnly: false, wholesaleOnly: false },
      "relevancia"
    );
    expect(r.map((p) => p.name)).toEqual(["a"]);
  });
});
