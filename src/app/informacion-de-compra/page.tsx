import type { Metadata } from "next";
import Link from "next/link";
import {
  CreditCard,
  FileText,
  ShoppingCart,
  Truck,
  RotateCcw,
  HelpCircle,
  MessageCircle,
  MapPin,
  Clock,
} from "lucide-react";
import {
  FACTURACION,
  FAQ_ITEMS,
  PAYMENT_METHODS,
  RETURN_POLICY,
  SHIPPING_INFO,
  SHOPPING_STEPS,
  STORE_INFO,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "Información de compra",
  description:
    "Medios de pago, proceso de compra, envíos, cambios y devoluciones, facturación y preguntas frecuentes de Pack Distribuidora.",
  alternates: {
    canonical: "/informacion-de-compra",
  },
  openGraph: {
    type: "website",
    url: "/informacion-de-compra",
    title: "Información de compra — Pack Distribuidora",
    description:
      "Medios de pago, proceso de compra, envíos, cambios y devoluciones, facturación y preguntas frecuentes de Pack Distribuidora.",
  },
  twitter: {
    title: "Información de compra — Pack Distribuidora",
    description:
      "Medios de pago, proceso de compra, envíos, cambios y devoluciones, facturación y preguntas frecuentes de Pack Distribuidora.",
  },
};

const SECTIONS = [
  { href: "#pagos", label: "Formas de pago" },
  { href: "#facturacion", label: "Facturación" },
  { href: "#proceso", label: "Proceso de compra" },
  { href: "#envios", label: "Envíos y retiro" },
  { href: "#devoluciones", label: "Cambios y devoluciones" },
  { href: "#faq", label: "Preguntas frecuentes" },
];

export default function InfoCompraPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="text-center mb-12">
        <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--green-primary)]">
          Ayuda
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold mt-3 text-[var(--text)]">
          Información de compra
        </h1>
        <p className="mt-3 text-[var(--text-muted)] max-w-xl mx-auto">
          Todo lo que necesitás saber para comprar en Pack Distribuidora: pagos, envíos,
          facturación, cambios y respuestas a las dudas más comunes.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-10">
        {/* Contenido */}
        <div className="flex flex-col gap-8">
          {/* Formas de pago */}
          <section id="pagos" className="scroll-mt-32 rounded-2xl border border-[var(--gray)] bg-[var(--white)] p-6 sm:p-8">
            <div className="flex items-center gap-2.5">
              <CreditCard size={20} className="text-[var(--green-primary)]" />
              <h2 className="font-display text-xl font-bold">Formas de pago</h2>
            </div>
            <div className="mt-5 grid sm:grid-cols-2 gap-4">
              {PAYMENT_METHODS.map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-xl border border-[var(--gray)] bg-[var(--gray-light)] p-4">
                  <div className="flex items-center gap-2.5">
                    <Icon size={18} className="text-[var(--green-primary)] shrink-0" />
                    <h3 className="font-semibold text-sm">{title}</h3>
                  </div>
                  <p className="mt-1.5 text-sm text-[var(--text-muted)] leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Facturación */}
          <section id="facturacion" className="scroll-mt-32 rounded-2xl border border-[var(--gray)] bg-[var(--white)] p-6 sm:p-8">
            <div className="flex items-center gap-2.5">
              <FileText size={20} className="text-[var(--green-primary)]" />
              <h2 className="font-display text-xl font-bold">Facturación</h2>
            </div>
            <p className="mt-3 text-sm text-[var(--text-muted)] leading-relaxed">
              Emitimos comprobantes con los datos que nos dejes en el pedido o la
              consulta. Así se clasifica tu facturación:
            </p>
            <ul className="mt-4 flex flex-col gap-2">
              {FACTURACION.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-[var(--text-muted)]">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--green-primary)] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Proceso de compra */}
          <section id="proceso" className="scroll-mt-32 rounded-2xl border border-[var(--gray)] bg-[var(--white)] p-6 sm:p-8">
            <div className="flex items-center gap-2.5">
              <ShoppingCart size={20} className="text-[var(--green-primary)]" />
              <h2 className="font-display text-xl font-bold">Proceso de compra</h2>
            </div>
            <ol className="mt-5 flex flex-col gap-4">
              {SHOPPING_STEPS.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--green-primary)] text-white text-sm font-bold">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-sm">{step.title}</h3>
                    <p className="mt-1 text-sm text-[var(--text-muted)] leading-relaxed">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Envíos */}
          <section id="envios" className="scroll-mt-32 rounded-2xl border border-[var(--gray)] bg-[var(--white)] p-6 sm:p-8">
            <div className="flex items-center gap-2.5">
              <Truck size={20} className="text-[var(--green-primary)]" />
              <h2 className="font-display text-xl font-bold">Envíos y retiro</h2>
            </div>
            <p className="mt-3 text-sm text-[var(--text-muted)] leading-relaxed">{SHIPPING_INFO.coverage}</p>
            <ul className="mt-4 flex flex-col gap-2">
              {SHIPPING_INFO.priorities.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-[var(--text-muted)]">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--green-primary)] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <ul className="mt-4 border-t border-[var(--gray)] pt-4 flex flex-col gap-2">
              {SHIPPING_INFO.notes.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-[var(--text-muted)]">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--green-lime)] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Cambios y devoluciones */}
          <section id="devoluciones" className="scroll-mt-32 rounded-2xl border border-[var(--gray)] bg-[var(--white)] p-6 sm:p-8">
            <div className="flex items-center gap-2.5">
              <RotateCcw size={20} className="text-[var(--green-primary)]" />
              <h2 className="font-display text-xl font-bold">Cambios y devoluciones</h2>
            </div>
            <ul className="mt-5 flex flex-col gap-2">
              {RETURN_POLICY.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-[var(--text-muted)]">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--green-primary)] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* FAQ */}
          <section id="faq" className="scroll-mt-32 rounded-2xl border border-[var(--gray)] bg-[var(--white)] p-6 sm:p-8">
            <div className="flex items-center gap-2.5">
              <HelpCircle size={20} className="text-[var(--green-primary)]" />
              <h2 className="font-display text-xl font-bold">Preguntas frecuentes</h2>
            </div>
            <div className="mt-4 flex flex-col gap-3">
              {FAQ_ITEMS.map((item) => (
                <details
                  key={item.question}
                  className="group rounded-xl border border-[var(--gray)] bg-[var(--gray-light)] open:border-[var(--green-primary)]/40 transition-colors"
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3.5 text-sm font-semibold marker:content-none">
                    {item.question}
                    <span className="text-[var(--green-primary)] transition-transform duration-200 group-open:rotate-45 shrink-0 text-lg leading-none">
                      +
                    </span>
                  </summary>
                  <p className="px-4 pb-4 text-sm text-[var(--text-muted)] leading-relaxed">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-5 lg:sticky lg:top-32 lg:self-start">
          <div className="rounded-2xl border border-[var(--gray)] bg-[var(--white)] p-6">
            <h3 className="font-display text-sm font-bold uppercase tracking-wide text-[var(--text-muted)]">
              En esta página
            </h3>
            <ul className="mt-3 flex flex-col gap-2">
              {SECTIONS.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className="text-sm font-medium text-[var(--text)] hover:text-[var(--green-primary)] transition-colors"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-[var(--green-deep)] p-6 text-white">
            <div className="flex items-center gap-2.5 mb-2">
              <MessageCircle size={20} />
              <h3 className="font-display text-lg font-bold">¿Alguna otra duda?</h3>
            </div>
            <p className="text-sm text-white/80 mb-4">
              Escribinos por WhatsApp y te respondemos a la brevedad.
            </p>
            <a
              href={STORE_INFO.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white text-[var(--green-primary)] text-sm font-semibold px-6 py-3 hover:bg-white/90 transition"
            >
              <MessageCircle size={16} /> Abrir WhatsApp
            </a>
          </div>

          <div className="rounded-2xl border border-[var(--gray)] bg-[var(--white)] p-6 flex flex-col gap-3 text-sm">
            <div className="flex items-center gap-2.5">
              <MapPin size={16} className="text-[var(--green-primary)] shrink-0" />
              <span className="text-[var(--text-muted)]">{STORE_INFO.location}, {STORE_INFO.country}</span>
            </div>
            <div className="flex items-start gap-2.5">
              <Clock size={16} className="text-[var(--green-primary)] shrink-0 mt-0.5" />
              <span className="text-[var(--text-muted)]">{STORE_INFO.hours.weekdays}</span>
            </div>
            <div className="flex items-start gap-2.5">
              <Clock size={16} className="text-[var(--green-primary)] shrink-0 mt-0.5" />
              <span className="text-[var(--text-muted)]">{STORE_INFO.hours.saturday}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}