import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, ArrowRight } from "lucide-react";
import WhyUs from "@/components/WhyUs";
import {
  COMPANY_HISTORY,
  COMPANY_VALUES,
  STORE_INFO,
  TRUST_POINTS,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Conocé Pack Distribuidora, la distribuidora de descartables de Rafaela con servicio minorista y mayorista, envíos a todo el país y stock permanente.",
  alternates: {
    canonical: "/nosotros",
  },
  openGraph: {
    type: "website",
    url: "/nosotros",
    title: "Nosotros — Pack Distribuidora",
    description:
      "Conocé Pack Distribuidora, la distribuidora de descartables de Rafaela con servicio minorista y mayorista, envíos a todo el país y stock permanente.",
  },
  twitter: {
    title: "Nosotros — Pack Distribuidora",
    description:
      "Conocé Pack Distribuidora, la distribuidora de descartables de Rafaela con servicio minorista y mayorista, envíos a todo el país y stock permanente.",
  },
};

export default function NosotrosPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[var(--green-primary)]">
        <div className="mx-auto max-w-7xl px-6 pt-14 pb-12 md:pt-20 md:pb-16 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-white/80">
            Quiénes somos
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold mt-3 text-white">
            Tu distribuidora de descartables de confianza
          </h1>
          <p className="mt-4 text-white/85 max-w-2xl mx-auto">
            En Pack Distribuidora ayudamos a comercios, hogares y organizadores de eventos a
            resolver el día a día con productos descartables de calidad y un servicio
            cercano.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/productos"
              className="inline-flex items-center gap-2 rounded-full bg-white text-[var(--green-primary)] text-sm font-semibold px-6 py-3.5 shadow-[0_10px_24px_-10px_rgba(0,0,0,0.4)] hover:bg-white/95 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-10px_rgba(0,0,0,0.45)] transition-all"
            >
              Ver productos <ArrowRight size={16} />
            </Link>
            <a
              href={STORE_INFO.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/80 text-white text-sm font-semibold px-6 py-3.5 hover:bg-white hover:text-[var(--green-primary)] transition-colors"
            >
              <MessageCircle size={16} /> Escribinos
            </a>
          </div>
        </div>
        <div className="tear-strip" />
      </section>

      {/* Historia */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--green-primary)]">
              Nuestra historia
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold mt-3 text-[var(--text)]">
              Nacimos para simplificar la compra de descartables
            </h2>
            <p className="mt-4 text-[var(--text-muted)] leading-relaxed">
              {COMPANY_HISTORY}
            </p>
            <p className="mt-3 text-[var(--text-muted)] leading-relaxed">
              Sabemos que para un local gastronómico o un hogar, quedarse sin vasos o
              bolsas no es una opción. Por eso mantenemos un surtido amplio, con stock
              permanente y repuestos que llegan rápido.
            </p>
            <div className="mt-6 flex flex-col gap-2.5">
              {TRUST_POINTS.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2.5 text-sm text-[var(--text)]">
                  <Icon size={17} className="text-[var(--green-primary)] shrink-0" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {COMPANY_VALUES.slice(0, 4).map(({ icon: Icon, label }, i) => (
              <div
                key={label}
                className={`rounded-2xl border border-[var(--gray)] bg-[var(--white)] p-6 flex flex-col items-start gap-3 ${
                  i % 2 === 1 ? "sm:translate-y-6" : ""
                }`}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--green-primary)]/15">
                  <Icon size={20} className="text-[var(--green-primary)]" strokeWidth={1.75} />
                </div>
                <h3 className="font-display font-semibold text-sm">{label}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Por qué elegirnos */}
      <WhyUs />

      {/* Misión + CTA */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="rounded-3xl bg-[var(--green-primary)] p-8 md:p-12 text-center flex flex-col items-center overflow-hidden relative">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(circle at 80% 20%, var(--green-primary) 0%, transparent 45%)",
            }}
          />
          <div className="relative">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              ¿Querés saber más o hacer un pedido?
            </h2>
            <p className="mt-2 text-white/85 max-w-lg mx-auto">
              Respondemos consultas, armamos presupuestos y coordinamos envíos a todo el
              país.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <a
                href={STORE_INFO.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white text-[var(--green-primary)] text-sm font-bold px-6 py-3.5 shadow-[0_10px_24px_-10px_rgba(0,0,0,0.4)] hover:bg-white/95 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-10px_rgba(0,0,0,0.45)] transition-all"
              >
                <MessageCircle size={16} /> Chatear por WhatsApp
              </a>
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 rounded-full border border-white/50 text-white text-sm font-bold px-6 py-3.5 hover:bg-white/10 transition-colors"
              >
                Formulario de contacto
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}