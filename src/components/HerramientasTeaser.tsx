import Link from "next/link";
import { Calculator, Store, ArrowRight } from "lucide-react";

const CARDS = [
  {
    href: "/herramientas#calculadora",
    icon: Calculator,
    title: "¿Cuánto necesito?",
    text: "Calculá vasos, platos, cubiertos y servilletas según la cantidad de invitados.",
    cta: "Usar calculadora",
  },
  {
    href: "/herramientas#tu-rubro",
    icon: Store,
    title: "Armá tu rubro",
    text: "Elegí tu tipo de negocio y encontrá el pack pensado para vos.",
    cta: "Elegir mi rubro",
  },
];

export default function HerramientasTeaser() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-4">
      <div className="grid sm:grid-cols-2 gap-4">
        {CARDS.map(({ href, icon: Icon, title, text, cta }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-center gap-4 rounded-2xl border border-[var(--gray)] bg-[var(--white)] p-5 transition-all duration-300 hover:border-transparent hover:shadow-[0_16px_34px_-14px_rgba(6,59,24,0.3)] hover:-translate-y-1"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--green-primary)]">
              <Icon size={22} className="text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-display font-bold text-[var(--text)]">{title}</h3>
              <p className="text-sm text-[var(--text-muted)] mt-0.5">{text}</p>
              <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[var(--green-primary)] group-hover:gap-1.5 transition-all">
                {cta} <ArrowRight size={13} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
