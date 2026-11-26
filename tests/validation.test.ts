import { describe, expect, it } from "vitest";
import {
  contactSchema,
  newsletterSchema,
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

describe("adminLoginSchema", () => {
  it("requiere contraseña", () => {
    expect(adminLoginSchema.safeParse({ password: "" }).success).toBe(false);
    expect(adminLoginSchema.safeParse({ password: "x" }).success).toBe(true);
  });
});