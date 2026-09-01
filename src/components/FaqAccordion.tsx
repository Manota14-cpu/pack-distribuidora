"use client";

import { useState } from "react";
import { Plus, Mail, Camera, MessageCircle } from "lucide-react";
import type { FaqMayoristaItem } from "@/lib/content";
import { MAYORISTA_REQUISITOS, STORE_INFO } from "@/lib/content";
import WholesaleForm from "./WholesaleForm";

// Acordeón accesible: botón real (Enter/Espacio funcionan nativos), aria-expanded
// y aria-controls explícitos, y todas las preguntas cerradas al cargar.
export default function FaqAccordion({ items }: { items: FaqMayoristaItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => {
        const isOpen = openId === item.id;
        const triggerId = `faq-trigger-${item.id}`;
        const panelId = `faq-panel-${item.id}`;

        return (
          <div
            key={item.id}
            className={`rounded-2xl border bg-[var(--white)] transition-colors ${
              isOpen ? "border-[var(--green-primary)]/40" : "border-[var(--gray)]"
            }`}
          >
            <h3 className="m-0">
              <button
                type="button"
                id={triggerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="text-sm sm:text-base font-semibold text-[var(--text)]">
                  {item.question}
                </span>
                <Plus
                  size={18}
                  className={`shrink-0 text-[var(--green-primary)] transition-transform duration-200 ${
                    isOpen ? "rotate-45" : ""
                  }`}
                />
              </button>
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateRows: isOpen ? "1fr" : "0fr",
                transition: "grid-template-rows 300ms ease",
              }}
            >
              <div className="overflow-hidden">
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  className="px-5 pb-5 text-sm text-[var(--text-muted)] leading-relaxed"
                >
                  {item.special === "mayorista" ? (
                    <MayoristaAnswer />
                  ) : item.special === "contacto" ? (
                    <ContactoAnswer />
                  ) : (
                    <p>{item.answer}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ContactoAnswer() {
  const CHANNELS = [
    {
      icon: Mail,
      label: "Mail",
      value: STORE_INFO.email,
      href: `mailto:${STORE_INFO.email}`,
    },
    {
      icon: Camera,
      label: "Instagram",
      value: STORE_INFO.instagramDisplay,
      href: STORE_INFO.instagram,
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: STORE_INFO.whatsappDisplay,
      href: STORE_INFO.whatsapp,
    },
  ];

  return (
    <div>
      <p>Te podés comunicar con nosotros por estas vías y te responderemos a la brevedad:</p>
      <ul className="mt-3 flex flex-col gap-2.5">
        {CHANNELS.map(({ icon: Icon, label, value, href }) => (
          <li key={label}>
            <a
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="flex items-center gap-3 rounded-xl border border-[var(--gray)] bg-[var(--gray-light)] px-4 py-3 hover:border-[var(--green-primary)]/40 transition-colors"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--green-primary)]">
                <Icon size={16} className="text-white" />
              </span>
              <span>
                <span className="block text-xs text-[var(--text-muted)]">{label}</span>
                <span className="block text-sm font-semibold text-[var(--text)]">{value}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MayoristaAnswer() {
  return (
    <div>
      <ul className="flex flex-col gap-2">
        {MAYORISTA_REQUISITOS.map((req) => (
          <li key={req} className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--green-primary)] shrink-0" />
            {req}
          </li>
        ))}
      </ul>
      <p className="mt-4 font-semibold text-[var(--text)]">
        Si querés ser mayorista, completá tus datos y te contactamos.
      </p>
      <WholesaleForm />
    </div>
  );
}
