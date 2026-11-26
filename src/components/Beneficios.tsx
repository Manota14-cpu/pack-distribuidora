import { Headset, Store, Tags, Truck } from "lucide-react";

/**
 * Por qué comprarnos, una sola vez y corto. Reemplaza al carrusel de arriba de
 * todo, los contadores y las insignias del banner, que repetían lo mismo.
 */
const BENEFICIOS = [
  { icon: Truck, titulo: "Envíos a todo el país", texto: "Despachamos en 24/48 hs hábiles" },
  { icon: Store, titulo: "Retiro sin cargo", texto: "En nuestro local de Rafaela" },
  { icon: Tags, titulo: "Precios mayoristas", texto: "Mejores precios por volumen" },
  { icon: Headset, titulo: "Atención personalizada", texto: "Te asesoramos por WhatsApp" },
];

export default function Beneficios() {
  return (
    <section className="border-b border-[var(--gray)] bg-white">
      <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-6 px-6 py-8 md:grid-cols-4 md:py-10">
        {BENEFICIOS.map(({ icon: Icon, titulo, texto }) => (
          <li key={titulo} className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--green-soft)] text-[var(--green-primary)]">
              <Icon size={20} />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold leading-tight">{titulo}</span>
              <span className="block text-xs text-[var(--text-muted)]">{texto}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
