type GtagWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

export function trackEvent(event: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  const w = window as GtagWindow;
  if (typeof w.gtag === "function") {
    w.gtag("event", event, params);
  } else if (Array.isArray(w.dataLayer)) {
    w.dataLayer.push(["event", event, params]);
  }
}

export interface GaItem {
  item_id: string;
  item_name: string;
  price: number;
  quantity: number;
}

export function trackAddToCart(item: GaItem): void {
  trackEvent("add_to_cart", {
    currency: "ARS",
    value: item.price * item.quantity,
    items: [item],
  });
}

export function trackBeginCheckout(items: GaItem[], value: number): void {
  trackEvent("begin_checkout", { currency: "ARS", value, items });
}

export function trackViewItem(item: GaItem): void {
  trackEvent("view_item", {
    currency: "ARS",
    value: item.price,
    items: [item],
  });
}