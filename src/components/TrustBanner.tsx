import { Users, Truck, PackageCheck } from "lucide-react";

const STATS = [
  { icon: Truck, value: "Todo el país", label: "Envíos a todo el país" },
  { icon: PackageCheck, value: "Stock", label: "Stock permanente" },
  { icon: Users, value: "Mayorista", label: "Atención mayorista y minorista" },
];

export default function TrustBanner() {
  return (
    <section className="bg-[var(--gray-light)]">
      <div className="mx-auto max-w-7xl px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        {STATS.map(({ icon: Icon, value, label }) => (
          <div key={label} className="flex items-center gap-4 justify-center sm:justify-start">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--green-primary)]">
              <Icon size={22} className="text-white" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-[var(--text)]">{value}</p>
              <p className="text-sm text-[var(--text-muted)]">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
