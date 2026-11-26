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

export const adminLoginSchema = z.object({
  password: z.string().min(1, "Ingresá la contraseña"),
});