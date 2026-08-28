"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Product } from "./types";
import {
  addItemToCart,
  removeItemFromCart,
  setQuantityInCart,
  computeTotalItems,
  computeSubtotal,
} from "./cart-utils";
import { trackAddToCart } from "./analytics";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = "packdistribuidora:cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let alive = true;
    queueMicrotask(() => {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (alive && raw) setItems(JSON.parse(raw));
      } catch {
        // ignore malformed storage
      } finally {
        if (alive) setHydrated(true);
      }
    });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  useEffect(() => {
    function onStorageChange(e: StorageEvent) {
      if (e.key !== STORAGE_KEY) return;
      try {
        setItems(e.newValue ? JSON.parse(e.newValue) : []);
      } catch {
        // ignore malformed storage
      }
    }
    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, []);

  const addItem = useCallback((product: Product, quantity = 1) => {
    setItems((prev) => addItemToCart(prev, product, quantity));
    setIsOpen(true);
    trackAddToCart({
      item_id: product.id,
      item_name: product.name,
      price: product.price,
      quantity,
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => removeItemFromCart(prev, productId));
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) => setQuantityInCart(prev, productId, quantity));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const totalItems = useMemo(() => computeTotalItems(items), [items]);
  const subtotal = useMemo(() => computeSubtotal(items), [items]);

  const value: CartContextValue = {
    items,
    isOpen,
    openCart,
    closeCart,
    addItem,
    removeItem,
    setQuantity,
    clearCart,
    totalItems,
    subtotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
