import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { trackAddToCart, trackBeginCheckout, trackViewItem } from "@/lib/analytics";

type Gtag = (...args: unknown[]) => void;

let calls: unknown[][] = [];

function fakeWindow(withGtag: boolean) {
  const dataLayer: unknown[] = [];
  const gtag: Gtag = (...args) => calls.push(args);
  (globalThis as { window?: unknown }).window = {
    dataLayer,
    gtag: withGtag ? gtag : undefined,
  };
  return dataLayer;
}

function restoreWindow() {
  delete (globalThis as { window?: unknown }).window;
}

beforeEach(() => {
  calls = [];
});

afterEach(restoreWindow);

describe("analytics (track helpers)", () => {
  it("add_to_cart emite con currency ARS y value", () => {
    fakeWindow(true);
    trackAddToCart({ item_id: "p1", item_name: "Vaso 500cc", price: 1250, quantity: 2 });
    expect(calls).toHaveLength(1);
    const [event, name, params] = calls[0];
    expect(event).toBe("event");
    expect(name).toBe("add_to_cart");
    expect(params).toMatchObject({ currency: "ARS", value: 2500 });
  });

  it("begin_checkout emite items y value", () => {
    fakeWindow(true);
    trackBeginCheckout(
      [{ item_id: "p1", item_name: "Vaso", price: 500, quantity: 3 }],
      1500
    );
    const [, name, params] = calls[0];
    expect(name).toBe("begin_checkout");
    expect(params).toMatchObject({ value: 1500, items: [{ quantity: 3 }] });
  });

  it("view_item emite el item", () => {
    fakeWindow(true);
    trackViewItem({ item_id: "p9", item_name: "Film", price: 800, quantity: 1 });
    const [, name, params] = calls[0];
    expect(name).toBe("view_item");
    expect(params).toMatchObject({ value: 800 });
  });

  it("hace push al dataLayer si no hay gtag", () => {
    const dataLayer = fakeWindow(false);
    trackAddToCart({ item_id: "p1", item_name: "A", price: 100, quantity: 1 });
    expect(dataLayer).toHaveLength(1);
    expect(dataLayer[0]).toHaveLength(3);
  });
});