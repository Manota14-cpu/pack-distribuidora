import Link from "next/link";
import { ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";
import { STORE_INFO } from "@/lib/content";

const BENEFITS = [
  "Precios diferenciales por volumen",
  "Asesoramiento comercial dedicado",
  "Reposición programada de stock",
  "Atención dedicada para tu negocio",
];

const PASOS = [
  { titulo: "Contanos qué necesitás", texto: "Por WhatsApp o desde el formulario de contacto." },
  { titulo: "Te armamos el presupuesto", texto: "Con precios según cantidades y frecuencia de compra." },
  { titulo: "Coordinamos la entrega", texto: "Retirás en Rafaela o te lo enviamos." },
];

export default function Wholesale() {
  return (
    <section className="relative overflow-hidden bg-[var(--green-primary)]">
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 md:grid-cols-2 md:py-20">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent)]">Mayoristas</span>
          <h2 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">¿Comprás en cantidad?</h2>
          <p className="mt-3 max-w-md text-white/85">
            Accedé a precios especiales, promociones y beneficios exclusivos para compras mayoristas.
          </p>
          <ul className="mt-6 flex flex-col gap-2.5">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-center gap-2.5 text-sm text-white/90">
                <CheckCircle2 size={16} className="shrink-0 text-[var(--accent)]" />
                {b}
              </li>
            ))}
          </ul>
          <Link
            href="/contacto"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3.5 text-sm font-bold text-[var(--accent-ink)] shadow-[0_10px_24px_-10px_rgba(0,0,0,0.4)] transition-all hover:-translate-y-0.5 hover:bg-[var(--accent-hover)]"
          >
            Quiero ser mayorista <ArrowRight size={16} />
          </Link>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.5)] sm:p-8">
          <h3 className="font-display text-lg font-bold">Cómo comprar por mayor</h3>
          <ol className="mt-5 flex flex-col gap-5">
            {PASOS.map((p, i) => (
              <li key={p.titulo} className="flex gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--green-soft)] font-display font-bold text-[var(--green-primary)]">
                  {i + 1}
                </span>
                <span>
                  <span className="block font-semibold">{p.titulo}</span>
                  <span className="text-sm text-[var(--text-muted)]">{p.texto}</span>
                </span>
              </li>
            ))}
          </ol>
          <a
            href={`${STORE_INFO.whatsapp}?text=${encodeURIComponent("Hola! Quiero comprar por mayor.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex items-center justify-center gap-2 rounded-full border-2 border-[var(--green-primary)] py-3 text-sm font-bold text-[var(--green-primary)] transition-colors hover:bg-[var(--green-primary)] hover:text-white"
          >
            <MessageCircle size={16} /> Escribinos por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
