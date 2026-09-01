import { z } from "zod";

export const contactSchema = z.object({
  nombre: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres").max(120),
  email: z.string().trim().email("Email inválido").max(200),
  telefono: z.string().trim().max(40).optional().or(z.literal("")),
  asunto: z.string().trim().max(80).optional().or(z.literal("")),
  mensaje: z.string().trim().min(10, "El mensaje debe tener al menos 10 caracteres").max(2000),
});

export const newsletterSchema = z.object({
  email: z.string().trim().email("Email inválido").max(200),
});

// Registro mayorista (formulario en /preguntas-frecuentes, envío directo por WhatsApp)
export const wholesaleRegistrationSchema = z.object({
  nombre: z.string().trim().min(3, "Ingresá tu nombre completo o razón social (mínimo 3 caracteres)"),
  cuit: z
    .string()
    .trim()
    .transform((v) => v.replace(/-/g, ""))
    .pipe(z.string().regex(/^\d{11}$/, "El CUIT debe tener exactamente 11 dígitos numéricos")),
  telefono: z
    .string()
    .trim()
    .transform((v) => v.replace(/\D/g, ""))
    .pipe(z.string().min(8, "Ingresá un teléfono válido (mínimo 8 dígitos)")),
  email: z.string().trim().email("Ingresá un email válido"),
});

export const checkoutOrderSchema = z.object({
  tipoCliente: z.enum(["minorista", "mayorista"]),
  nombre: z.string().trim().min(2).max(120),
  razonSocial: z.string().trim().max(120).default(""),
  dniCuit: z.string().trim().min(4, "Ingresá DNI o CUIT").max(20),
  requiereFactura: z.boolean().default(false),
  telefono: z.string().trim().min(6).max(40),
  email: z.string().trim().email().max(200).or(z.literal("")).default(""),
  direccion: z.string().trim().min(5).max(200),
  localidad: z.string().trim().min(2).max(120),
  provincia: z.string().trim().min(2).max(120),
  notas: z.string().trim().max(1000).default(""),
});

export const lineItemSchema = z.object({
  productId: z.string().optional(),
  name: z.string().trim().min(1).max(200),
  unit: z.string().trim().max(40),
  price: z.number().int().nonnegative(),
  quantity: z.number().int().positive(),
});

export const orderItemsSchema = z.array(lineItemSchema).min(1, "El carrito está vacío").max(100);

// ---- Admin helpers (form inputs arrive as strings / checkboxes) ----

const bool = z.preprocess((v) => v === "1" || v === "on" || v === "true", z.boolean());

const nonnegNumber = (fallback: number) =>
  z.preprocess(
    (v) => (v === "" || v == null ? fallback : Number.isFinite(Number(v)) ? Number(v) : fallback),
    z.number().int().min(0)
  );

const optionalNumber = z.preprocess(
  (v) => (v === "" || v == null ? undefined : Number.isFinite(Number(v)) ? Number(v) : undefined),
  z.number().int().min(0).optional()
);

const optionalString = z.preprocess(
  (v) => (v === "" || v == null ? undefined : String(v).trim()),
  z.string().max(300).optional()
);

const lineArray = z.preprocess(
  (v) =>
    typeof v === "string"
      ? v.split(/\r?\n/)
          .map((s) => s.trim())
          .filter(Boolean)
      : [],
  z.array(z.string().trim().min(1).max(500)).max(30)
);

export const adminProductSchema = z.object({
  slug: z.string().trim().min(2).max(200).regex(/^[a-z0-9-]+$/, "Slug inválido (solo minúsculas, números y guiones)"),
  name: z.string().trim().min(2).max(200),
  categorySlug: z.string().trim().min(1),
  description: z.string().trim().min(2).max(300),
  longDescription: z.string().trim().min(2).max(3000),
  features: lineArray,
  price: nonnegNumber(0),
  oldPrice: optionalNumber,
  discount: optionalNumber,
  stock: nonnegNumber(0),
  unit: z.string().trim().min(1).max(40),
  sku: optionalString,
  barcode: optionalString,
  weightGrams: optionalNumber,
  dimensions: optionalString,
  minWholesaleQty: optionalNumber,
  wholesalePrice: optionalNumber,
  metaTitle: optionalString,
  metaDescription: optionalString,
  icon: z.string().trim().max(60).default("Package"),
  featured: bool,
  bestSeller: bool,
  isNew: bool,
  active: bool,
  imageUrls: lineArray,
  imageAlts: lineArray,
});

export const adminLoginSchema = z.object({
  password: z.string().min(1, "Ingresá la contraseña"),
});