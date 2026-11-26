import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("loads successfully and shows hero", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveTitle(/Pack Distribuidora/);
    await expect(page.locator("h1")).toContainText("Soluciones descartables");
  });

  test("navigate to products page", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.getByRole("link", { name: /Ver todos los productos/ }).first().click();
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
    await page.locator("header").getByRole("link", { name: /Pack Distribuidora/i }).click();
    await expect(page).toHaveURL("/");
  });
});

test.describe("Tienda", () => {
  test("lista productos y filtra por categoría", async ({ page }) => {
    await page.goto("/productos?categoria=vasos");
    await expect(page.locator("h1")).toContainText("Vasos");
    await expect(page.locator("article").first()).toBeVisible();
  });

  test("la ficha de producto tiene precio y botón de compra", async ({ page }) => {
    await page.goto("/productos");
    const primero = page.locator("article h3").first();
    const nombre = await primero.textContent();
    await primero.click();
    await expect(page).toHaveURL(/\/productos\/.+-[0-9a-f]{8}$/);
    await expect(page.locator("h1")).toHaveText(nombre!.trim());
    await expect(page.getByRole("button", { name: "Agregar al carrito" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Migas de pan" })).toBeVisible();
  });

  test("agregar al carrito abre el carrito y lleva al checkout", async ({ page }) => {
    await page.goto("/productos?stock=1");
    await page.getByRole("button", { name: "Agregar" }).first().click();
    await page.getByRole("button", { name: /^Carrito/ }).click();
    const carrito = page.getByRole("dialog", { name: "Carrito de compras" });
    await expect(carrito).toBeVisible();
    await carrito.getByRole("link", { name: /Finalizar compra/ }).click();
    await expect(page.locator("h1")).toContainText("Finalizar compra");
    await expect(page.getByLabel("Nombre y apellido")).toBeVisible();
  });

  test("carrito vacío", async ({ page }) => {
    await page.goto("/carrito");
    await expect(page.getByText("Tu carrito está vacío")).toBeVisible();
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

});
