import { Truck, ShieldCheck } from "lucide-react";
import StatCounter from "./StatCounter";

const STATS = [
  { icon: Truck, value: 48, suffix: " hs", label: "Despacho de tu pedido" },
  { icon: ShieldCheck, value: 100, suffix: "%", label: "Compra segura" },
];

export default function TrustBanner() {
  return (
    <section className="bg-[var(--gray-light)]">
      <div className="mx-auto max-w-xl px-6 py-10 grid grid-cols-2 gap-8">
        {STATS.map(({ icon: Icon, value, suffix, label }) => (
          <div key={label} className="flex items-center gap-4 justify-center">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--green-primary)]">
              <Icon size={22} className="text-white" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-[var(--text)]">
                <StatCounter value={value} suffix={suffix} />
              </p>
              <p className="text-sm text-[var(--text-muted)]">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
