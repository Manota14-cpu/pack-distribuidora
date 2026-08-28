import { LayoutGrid, Tags, Truck, Headset } from "lucide-react";

const REASONS = [
  {
    icon: LayoutGrid,
    title: "Amplia variedad",
    text: "Todo lo que necesitás en un solo lugar.",
  },
  {
    icon: Tags,
    title: "Precios competitivos",
    text: "Los mejores precios del mercado.",
  },
  {
    icon: Truck,
    title: "Envíos",
    text: "Llegamos a donde estés.",
  },
  {
    icon: Headset,
    title: "Atención personalizada",
    text: "Te asesoramos en todo lo que necesites.",
  },
];

export default function WhyUs() {
  return (
    <section className="bg-[var(--gray-light)]">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="text-center mx-auto max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--green-primary)]">
            Por qué elegirnos
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold mt-2 text-[var(--text)]">
            ¿Por qué Pack Distribuidora?
          </h2>
        </div>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {REASONS.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl bg-[var(--white)] border border-[var(--gray)] p-6 flex flex-col items-start gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--green-primary)]/15">
                <Icon size={20} className="text-[var(--green-primary)]" strokeWidth={1.75} />
              </div>
              <h3 className="font-display font-semibold">{title}</h3>
              <p className="text-sm text-[var(--text-muted)]">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
