export interface CartItemLike {
  product: { id: string; price?: number };
  quantity: number;
}

export function addItemToCart<T extends CartItemLike>(
  items: T[],
  product: { id: string },
  quantity = 1
): T[] {
  if (quantity <= 0) return items;
  const existing = items.find((i) => i.product.id === product.id);
  if (existing) {
    return items.map((i) =>
      i.product.id === product.id
        ? { ...i, quantity: i.quantity + quantity }
        : i
    );
  }
  return [...items, { product, quantity } as T];
}

export function removeItemFromCart<T extends CartItemLike>(
  items: T[],
  productId: string
): T[] {
  return items.filter((i) => i.product.id !== productId);
}

export function setQuantityInCart<T extends CartItemLike>(
  items: T[],
  productId: string,
  quantity: number
): T[] {
  const clampedQuantity = Math.max(1, quantity);
  return items
    .map((i) =>
      i.product.id === productId ? { ...i, quantity: clampedQuantity } : i
    )
    .filter((i) => i.quantity > 0);
}

export function clampQuantity(quantity: number, max: number | undefined): number {
  const min = 1;
  const q = Math.max(min, Math.floor(quantity));
  if (max === undefined || max <= 0) return q;
  return Math.min(max, q);
}

export function computeTotalItems<T extends CartItemLike>(items: T[]): number {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}

export function computeSubtotal<T extends CartItemLike>(items: T[]): number {
  return items.reduce((sum, i) => sum + i.quantity * (i.product.price ?? 0), 0);
}