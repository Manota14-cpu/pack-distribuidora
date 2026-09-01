import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import { FAQ_MAYORISTA_ITEMS, STORE_INFO } from "@/lib/content";
import FaqAccordion from "@/components/FaqAccordion";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description:
    "Envíos, plazos de entrega, transportes y requisitos para compra mayorista en Pack Distribuidora.",
  alternates: {
    canonical: "/preguntas-frecuentes",
  },
  openGraph: {
    type: "website",
    url: "/preguntas-frecuentes",
    title: "Preguntas frecuentes — Pack Distribuidora",
    description:
      "Envíos, plazos de entrega, transportes y requisitos para compra mayorista en Pack Distribuidora.",
  },
  twitter: {
    title: "Preguntas frecuentes — Pack Distribuidora",
    description:
      "Envíos, plazos de entrega, transportes y requisitos para compra mayorista en Pack Distribuidora.",
  },
};

export default function PreguntasFrecuentesPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_MAYORISTA_ITEMS.map((item) => ({
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
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--green-primary)]">
            Ayuda
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold mt-3 tracking-tight text-balance text-[var(--text)]">
            Preguntas frecuentes
          </h1>
          <p className="mt-3 text-[var(--text-muted)] max-w-xl mx-auto">
            Envíos, plazos de entrega y requisitos para compra mayorista. Si no encontrás
            lo que buscás, escribinos por WhatsApp.
          </p>
        </div>

        <FaqAccordion items={FAQ_MAYORISTA_ITEMS} />

        <div className="mt-10 rounded-2xl bg-[var(--green-primary)] p-6 sm:p-8 text-center text-white">
          <div className="flex items-center justify-center gap-2.5 mb-2">
            <MessageCircle size={20} />
            <h2 className="font-display text-lg font-bold">¿Alguna otra duda?</h2>
          </div>
          <p className="text-sm text-white/80 mb-4 max-w-sm mx-auto">
            Escribinos por WhatsApp y te respondemos a la brevedad.
          </p>
          <a
            href={STORE_INFO.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-[var(--green-primary)] text-sm font-semibold px-6 py-3 shadow-[0_10px_24px_-10px_rgba(0,0,0,0.4)] hover:bg-white/95 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-10px_rgba(0,0,0,0.45)] transition-all"
          >
            <MessageCircle size={16} /> Abrir WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}
