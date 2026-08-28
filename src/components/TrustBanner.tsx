import { Users, Package, ShieldCheck } from "lucide-react";

const STATS = [
  { icon: Users, value: "+1000", label: "Clientes felices" },
  { icon: Package, value: "+500", label: "Productos disponibles" },
  { icon: ShieldCheck, value: "100%", label: "Compra segura — pago protegido" },
];

export default function TrustBanner() {
  return (
    <section className="bg-[var(--gray-light)]">
      <div className="mx-auto max-w-7xl px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        {STATS.map(({ icon: Icon, value, label }) => (
          <div key={label} className="flex items-center gap-4 justify-center sm:justify-start">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--green-light)]">
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
