"use client";

import { useEffect, useRef } from "react";
import type { Product } from "@/lib/types";
import { trackViewItem } from "@/lib/analytics";

export default function ProductViewTracker({ product }: { product: Product }) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    trackViewItem({
      item_id: product.id,
      item_name: product.name,
      price: product.price,
      quantity: 1,
    });
  }, [product]);
  return null;
}