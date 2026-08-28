"use client";

import { useEffect, useState } from "react";
import { Truck, Package, Star, Clock, ShieldCheck } from "lucide-react";

const MESSAGES = [
  { icon: Truck, text: "Envíos a todo el país" },
  { icon: Package, text: "Atención mayorista y minorista" },
  { icon: Star, text: "+1000 clientes satisfechos" },
  { icon: Clock, text: "Despacho en 24/48 hs" },
  { icon: ShieldCheck, text: "Compra 100% segura" },
];

const INTERVAL = 3000;

export default function TopBar() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const cycle = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % MESSAGES.length);
        setVisible(true);
      }, 300);
    }, INTERVAL);
    return () => clearInterval(cycle);
  }, []);

  const { icon: Icon, text } = MESSAGES[index];

  return (
    <div className="hidden md:block bg-white border-b border-[var(--green-primary)]/15 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 py-2 flex items-center justify-center text-xs font-medium tracking-wide text-[var(--green-primary)]">
        <span
          className={`flex items-center gap-1.5 transition-all duration-300 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
          }`}
        >
          <Icon size={14} /> {text}
        </span>
      </div>
    </div>
  );
}
