"use client";

import { useState, type FormEvent } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { wholesaleRegistrationSchema } from "@/lib/validation";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";

interface FormState {
  nombre: string;
  cuit: string;
  telefono: string;
  email: string;
}

const INITIAL: FormState = { nombre: "", cuit: "", telefono: "", email: "" };

const INPUT =
  "w-full rounded-xl border border-[var(--gray)] bg-[var(--gray-light)] px-4 py-3 text-sm outline-none focus:border-[var(--green-primary)] focus:bg-[var(--white)] transition-colors";

// Arma el mensaje prearmado que se manda por WhatsApp con el formato exacto pedido
function buildMessage(data: FormState): string {
  return [
    "Hola! Quiero registrarme como mayorista.",
    `Nombre: ${data.nombre}`,
    `CUIT: ${data.cuit}`,
    `Teléfono: ${data.telefono}`,
    `Email: ${data.email}`,
  ].join("\n");
}

export default function WholesaleForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [sent, setSent] = useState(false);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Validamos todo el formulario antes de permitir el envío
    const result = wholesaleRegistrationSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof FormState, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FormState;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    // No hay backend: el mensaje se arma acá y se abre WhatsApp con el texto listo,
    // el usuario confirma el envío desde su propia app/WhatsApp Web.
    const message = encodeURIComponent(buildMessage(form));
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank", "noopener,noreferrer");
    setSent(true);
  }

  if (sent) {
    return (
      <div
        role="status"
        className="mt-4 flex items-start gap-3 rounded-xl border border-[var(--green-primary)]/30 bg-[var(--green-primary)]/5 p-4"
      >
        <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-[var(--green-primary)]" />
        <div>
          <p className="text-sm font-semibold text-[var(--text)]">
            Te estamos redirigiendo a WhatsApp para enviar tus datos.
          </p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Si no se abrió automáticamente, revisá que tu navegador no haya bloqueado la
            ventana emergente. El mensaje ya está redactado — solo tenés que confirmarlo y
            enviarlo desde WhatsApp.
          </p>
          <button
            type="button"
            onClick={() => {
              setSent(false);
              setForm(INITIAL);
            }}
            className="mt-3 text-xs font-semibold text-[var(--green-primary)] hover:underline"
          >
            Completar otro registro
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-4 flex flex-col gap-4">
      <div>
        <label htmlFor="mayorista-nombre" className="block text-sm font-semibold mb-1.5">
          Nombre y apellido / Razón social *
        </label>
        <input
          type="text"
          id="mayorista-nombre"
          name="nombre"
          value={form.nombre}
          onChange={onChange}
          placeholder="Ej: Juan Pérez / Distribuidora JP S.R.L."
          className={INPUT}
          aria-invalid={!!errors.nombre}
          aria-describedby={errors.nombre ? "error-nombre" : undefined}
        />
        {errors.nombre && (
          <p id="error-nombre" role="alert" className="mt-1.5 text-xs font-medium text-red-600">
            {errors.nombre}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="mayorista-cuit" className="block text-sm font-semibold mb-1.5">
          CUIT *
        </label>
        <input
          type="text"
          id="mayorista-cuit"
          name="cuit"
          value={form.cuit}
          onChange={onChange}
          placeholder="20-12345678-9"
          inputMode="numeric"
          className={INPUT}
          aria-invalid={!!errors.cuit}
          aria-describedby={errors.cuit ? "error-cuit" : undefined}
        />
        {errors.cuit && (
          <p id="error-cuit" role="alert" className="mt-1.5 text-xs font-medium text-red-600">
            {errors.cuit}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="mayorista-telefono" className="block text-sm font-semibold mb-1.5">
          Teléfono *
        </label>
        <input
          type="tel"
          id="mayorista-telefono"
          name="telefono"
          value={form.telefono}
          onChange={onChange}
          placeholder="3492-518311"
          className={INPUT}
          aria-invalid={!!errors.telefono}
          aria-describedby={errors.telefono ? "error-telefono" : undefined}
        />
        {errors.telefono && (
          <p id="error-telefono" role="alert" className="mt-1.5 text-xs font-medium text-red-600">
            {errors.telefono}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="mayorista-email" className="block text-sm font-semibold mb-1.5">
          Correo electrónico *
        </label>
        <input
          type="email"
          id="mayorista-email"
          name="email"
          value={form.email}
          onChange={onChange}
          placeholder="tu@empresa.com"
          className={INPUT}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "error-email" : undefined}
        />
        {errors.email && (
          <p id="error-email" role="alert" className="mt-1.5 text-xs font-medium text-red-600">
            {errors.email}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--green-primary)] text-white text-sm font-bold py-3.5 hover:bg-[var(--green-primary-hover)] hover:-translate-y-0.5 transition-all"
      >
        <Send size={16} />
        Enviar por WhatsApp
      </button>
      <p className="text-[11px] text-[var(--text-muted)] text-center -mt-2">
        Se abre WhatsApp con tus datos ya escritos — vos confirmás el envío desde ahí.
      </p>
    </form>
  );
}
