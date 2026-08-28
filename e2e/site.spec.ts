import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("loads successfully and shows hero", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveTitle(/Pack Distribuidora/);
    await expect(page.locator("h1")).toContainText("Soluciones descartables");
  });

  test("displays categories section", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { level: 2, name: "Categorías" })).toBeVisible();
  });

  test("displays featured products", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { level: 2, name: "Productos destacados" })).toBeVisible();
  });

  test("navigate to products page", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.getByRole("link", { name: "Ver todos los productos" }).click();
    await expect(page).toHaveURL(/\/productos/);
    await expect(page.locator("h1")).toContainText("Todos los productos");
  });
});

test.describe("Navigation", () => {
  test("header navigation links work", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.locator("nav").getByRole("link", { name: "Productos", exact: true }).click();
    await expect(page).toHaveURL(/\/productos/);
  });

  test("logo links to homepage", async ({ page }) => {
    await page.goto("/productos");
    await page.waitForLoadState("networkidle");
    await page.locator("header").getByRole("link", { name: /Pack Distribuidora/ }).click();
    await expect(page).toHaveURL("/");
  });
});

test.describe("Products Page", () => {
  test("shows product cards", async ({ page }) => {
    await page.goto("/productos");
    await page.waitForLoadState("networkidle");
    const cards = page.locator("[class*='rounded-2xl'][class*='border']");
    await expect(cards.first()).toBeVisible();
  });

  test("category filter works", async ({ page }) => {
    await page.goto("/productos?categoria=vasos");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("h1")).toContainText("Todos los productos");
  });

  test("sort dropdown exists", async ({ page }) => {
    await page.goto("/productos");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("select")).toBeVisible();
  });
});

test.describe("Product Detail", () => {
  test("shows product info", async ({ page }) => {
    await page.goto("/productos/vaso-plastico-500cc-x50");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("h1")).toContainText("Vaso plástico descartable 500cc");
  });

  test("shows price", async ({ page }) => {
    await page.goto("/productos/vaso-plastico-500cc-x50");
    await page.waitForLoadState("networkidle");
    await expect(page.getByText("$1.250").first()).toBeVisible();
  });

  test("shows features list", async ({ page }) => {
    await page.goto("/productos/vaso-plastico-500cc-x50");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { level: 2, name: "Características" })).toBeVisible();
  });

  test("shows breadcrumb navigation", async ({ page }) => {
    await page.goto("/productos/vaso-plastico-500cc-x50");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("navigation", { name: "Migas de pan" })).toBeVisible();
  });

  test("add to cart button exists", async ({ page }) => {
    await page.goto("/productos/vaso-plastico-500cc-x50");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("button", { name: "Agregar al carrito" })).toBeVisible();
  });

  test("buy now button exists", async ({ page }) => {
    await page.goto("/productos/vaso-plastico-500cc-x50");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("button", { name: "Comprar ahora" })).toBeVisible();
  });
});

test.describe("Cart", () => {
  test("add item opens cart drawer", async ({ page }) => {
    await page.goto("/productos/vaso-plastico-500cc-x50");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "Agregar al carrito" }).click();
    await expect(page.locator('[role="dialog"][aria-label="Carrito de compras"]')).toBeVisible();
  });

  test("empty cart shows message", async ({ page }) => {
    await page.goto("/carrito");
    await page.waitForLoadState("networkidle");
    await expect(page.getByText("Tu carrito está vacío")).toBeVisible();
  });

  test("cart page shows products link when empty", async ({ page }) => {
    await page.goto("/carrito");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("link", { name: "Ver productos" })).toBeVisible();
  });
});

test.describe("Contact Page", () => {
  test("loads contact form", async ({ page }) => {
    await page.goto("/contacto");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("h1")).toContainText("Contactanos");
    await expect(page.getByLabel("Nombre")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Mensaje")).toBeVisible();
  });

  test("form submission shows success state", async ({ page }) => {
    await page.goto("/contacto");
    await page.waitForLoadState("networkidle");
    await page.getByLabel("Nombre").fill("Juan");
    await page.getByLabel("Email").fill("juan@test.com");
    await page.getByLabel("Mensaje").fill("Hola, quiero hacer un pedido");
    await page.getByRole("button", { name: "Enviar mensaje" }).click();
    await expect(page.getByText("¡Mensaje enviado!")).toBeVisible();
  });

  test("shows contact info sidebar", async ({ page }) => {
    await page.goto("/contacto");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { level: 3, name: "Datos de contacto" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 3, name: "Horarios de atención" })).toBeVisible();
  });
});

test.describe("404 Page", () => {
  test("shows custom 404 for unknown routes", async ({ page }) => {
    await page.goto("/ruta-que-no-existe", { waitUntil: "networkidle" });
    await expect(page.getByText("Página no encontrada")).toBeVisible();
  });

  test("404 has link back to home", async ({ page }) => {
    await page.goto("/ruta-que-no-existe", { waitUntil: "networkidle" });
    await expect(page.getByRole("link", { name: "Volver al inicio" })).toBeVisible();
  });
});

test.describe("SEO & Accessibility", () => {
  test("homepage has lang attribute", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
  });

  test("has skip-to-content link", async ({ page }) => {
    await page.goto("/");
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toHaveClass(/sr-only/);
  });

  test("main content has id for skip link", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#main-content")).toBeVisible();
  });

  test("JSON-LD is present on homepage", async ({ page }) => {
    await page.goto("/");
    const jsonLd = page.locator('script[type="application/ld+json"]');
    await expect(jsonLd).toBeAttached();
  });

  test("JSON-LD is present on product page", async ({ page }) => {
    await page.goto("/productos/vaso-plastico-500cc-x50");
    const jsonLd = page.locator('script[type="application/ld+json"]');
    await expect(jsonLd).toBeAttached();
  });
});
