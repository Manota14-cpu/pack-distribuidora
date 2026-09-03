import { Users, Truck, ShieldCheck } from "lucide-react";
import StatCounter from "./StatCounter";

const STATS = [
  { icon: Users, value: 1000, prefix: "+", label: "Clientes satisfechos" },
  { icon: Truck, value: 48, suffix: " hs", label: "Despacho de tu pedido" },
  { icon: ShieldCheck, value: 100, suffix: "%", label: "Compra segura" },
];

export default function TrustBanner() {
  return (
    <section className="bg-[var(--gray-light)]">
      <div className="mx-auto max-w-7xl px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        {STATS.map(({ icon: Icon, value, prefix, suffix, label }) => (
          <div key={label} className="flex items-center gap-4 justify-center sm:justify-start">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--green-primary)]">
              <Icon size={22} className="text-white" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-[var(--text)]">
                <StatCounter value={value} prefix={prefix} suffix={suffix} />
              </p>
              <p className="text-sm text-[var(--text-muted)]">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
