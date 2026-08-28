import { describe, expect, it } from "vitest";
import {
  addItemToCart,
  removeItemFromCart,
  setQuantityInCart,
  clampQuantity,
  computeTotalItems,
  computeSubtotal,
} from "@/lib/cart-utils";

interface Item {
  product: { id: string; price?: number };
  quantity: number;
}

const base: Item = { product: { id: "a", price: 100 }, quantity: 1 };

describe("addItemToCart", () => {
  it("agrega un producto nuevo", () => {
    const next = addItemToCart<Item>([], { id: "a" });
    expect(next).toHaveLength(1);
    expect(next[0]).toMatchObject({ product: { id: "a" }, quantity: 1 });
  });

  it("incrementa la cantidad si ya existe", () => {
    const next = addItemToCart<Item>([base], { id: "a" }, 3);
    expect(next).toHaveLength(1);
    expect(next[0].quantity).toBe(4);
  });

  it("no agrega con cantidad <= 0", () => {
    const next = addItemToCart<Item>([base], { id: "b" }, 0);
    expect(next).toHaveLength(1);
    expect(next).toEqual([{ product: { id: "a", price: 100 }, quantity: 1 }]);
  });
});

describe("removeItemFromCart", () => {
  it("quita el producto indicado", () => {
    const next = removeItemFromCart<Item>([base, { product: { id: "b" }, quantity: 2 }], "a");
    expect(next).toHaveLength(1);
    expect(next[0].product.id).toBe("b");
  });
});

describe("setQuantityInCart", () => {
  it("actualiza la cantidad", () => {
    const next = setQuantityInCart<Item>([base], "a", 5);
    expect(next[0].quantity).toBe(5);
  });

  it("limita a mínimo 1", () => {
    const next = setQuantityInCart<Item>([base], "a", 0);
    expect(next[0].quantity).toBe(1);
  });
});

describe("clampQuantity", () => {
  it("mínimo 1 y entero", () => {
    expect(clampQuantity(0, undefined)).toBe(1);
    expect(clampQuantity(2.9, undefined)).toBe(2);
  });
  it("respeta el máximo", () => {
    expect(clampQuantity(10, 5)).toBe(5);
  });
  it("máximo inválido se ignora", () => {
    expect(clampQuantity(6, 0)).toBe(6);
  });
});

describe("computeTotalItems y computeSubtotal", () => {
  const items: Item[] = [
    { product: { id: "a", price: 100 }, quantity: 2 },
    { product: { id: "b", price: 50 }, quantity: 3 },
  ];
  it("suma cantidades", () => {
    expect(computeTotalItems(items)).toBe(5);
  });
  it("suma subtotal", () => {
    expect(computeSubtotal(items)).toBe(2 * 100 + 3 * 50);
  });
  it("producto sin precio suma 0", () => {
    expect(computeSubtotal([{ product: { id: "x" }, quantity: 4 }])).toBe(0);
  });
});