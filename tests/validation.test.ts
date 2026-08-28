import { describe, expect, it } from "vitest";
import {
  contactSchema,
  newsletterSchema,
  checkoutOrderSchema,
  orderItemsSchema,
  adminProductSchema,
  adminLoginSchema,
} from "@/lib/validation";

describe("contactSchema", () => {
  const valid = {
    nombre: "Juan",
    email: "juan@test.com",
    mensaje: "Hola, quiero hacer un pedido grande",
  };

  it("acepta datos válidos (telefono/asunto opcionales)", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
    expect(
      contactSchema.safeParse({ ...valid, telefono: "11 5555 5555", asunto: "Mayorista" }).success
    ).toBe(true);
  });

  it("rechaza nombre corto", () => {
    const res = contactSchema.safeParse({ ...valid, nombre: "J" });
    expect(res.success).toBe(false);
  });

  it("rechaza email inválido", () => {
    const res = contactSchema.safeParse({ ...valid, email: "no-es-un-email" });
    expect(res.success).toBe(false);
  });

  it("rechaza mensaje corto", () => {
    expect(contactSchema.safeParse({ ...valid, mensaje: "corto" }).success).toBe(false);
  });
});

describe("newsletterSchema", () => {
  it("acepta un email válido", () => {
    expect(newsletterSchema.safeParse({ email: " a@b.com " }).success).toBe(true);
  });
  it("rechaza un email inválido", () => {
    expect(newsletterSchema.safeParse({ email: "abc" }).success).toBe(false);
  });
});

describe("checkoutOrderSchema", () => {
  const valid = {
    tipoCliente: "minorista",
    nombre: "Juan Pérez",
    dniCuit: "30111222333",
    telefono: "1155555555",
    direccion: "Av. Siempre Viva 123",
    localidad: "CABA",
    provincia: "Buenos Aires",
  };

  it("acepta un pedido válido sin extras", () => {
    expect(checkoutOrderSchema.safeParse(valid).success).toBe(true);
  });

  it("rechaza DNI/CUIT de menos de 4 caracteres", () => {
    const r = checkoutOrderSchema.safeParse({ ...valid, dniCuit: "12" });
    expect(r.success).toBe(false);
  });

  it("rechaza tipoCliente inválido", () => {
    const r = checkoutOrderSchema.safeParse({ ...valid, tipoCliente: "turista" });
    expect(r.success).toBe(false);
  });
});

describe("orderItemsSchema", () => {
  const line = {
    productId: "abc",
    name: "Vaso 500cc x50",
    unit: "pack x50",
    price: 1250,
    quantity: 2,
  };

  it("rechaza carrito vacío", () => {
    expect(orderItemsSchema.safeParse([]).success).toBe(false);
  });

  it("acepta al menos un item", () => {
    expect(orderItemsSchema.safeParse([line]).success).toBe(true);
  });

  it("rechaza cantidades no positivas", () => {
    expect(orderItemsSchema.safeParse([{ ...line, quantity: 0 }]).success).toBe(false);
  });
});

describe("adminProductSchema (formulario: strings y checkboxes)", () => {
  const base = {
    slug: "vaso-500cc",
    name: "Vaso plástico 500cc x50",
    categorySlug: "vasos",
    description: "Descripción corta",
    longDescription: "Descripción larga para la ficha del producto",
    features: "Liviano\nResistente\nDescartable",
    price: "1250",
    oldPrice: "",
    discount: "",
    stock: "50",
    unit: "pack x50",
    sku: "",
    barcode: "",
    weightGrams: "",
    dimensions: "",
    minWholesaleQty: "",
    wholesalePrice: "",
    metaTitle: "",
    metaDescription: "",
    icon: "",
    featured: "1",
    bestSeller: "on",
    isNew: "",
    active: "true",
    imageUrls: "",
    imageAlts: "",
  };

  it("parsea strings y checkboxes", () => {
    const r = adminProductSchema.safeParse(base);
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.price).toBe(1250);
      expect(r.data.stock).toBe(50);
      expect(r.data.features).toEqual(["Liviano", "Resistente", "Descartable"]);
      expect(r.data.featured).toBe(true);
      expect(r.data.bestSeller).toBe(true);
      expect(r.data.isNew).toBe(false);
      expect(r.data.active).toBe(true);
      expect(r.data.oldPrice).toBeUndefined();
    }
  });

  it("rechaza slug con mayúsculas o espacios", () => {
    const r = adminProductSchema.safeParse({ ...base, slug: "Vaso 500" });
    expect(r.success).toBe(false);
  });

  it("no valida si falta la categoría", () => {
    expect(adminProductSchema.safeParse({ ...base, categorySlug: "" }).success).toBe(false);
  });
});

describe("adminLoginSchema", () => {
  it("requiere contraseña", () => {
    expect(adminLoginSchema.safeParse({ password: "" }).success).toBe(false);
    expect(adminLoginSchema.safeParse({ password: "x" }).success).toBe(true);
  });
});