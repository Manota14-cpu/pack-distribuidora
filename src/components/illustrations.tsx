import type { SVGProps } from "react";

/**
 * Ilustraciones vectoriales propias por categoría — reemplazo provisorio de
 * fotografía real de producto. Estilo consistente: formas blancas planas a
 * dos opacidades (100% / 55%) sobre el fondo verde de marca, sin trazos.
 * Cuando haya fotos reales cargadas por producto, ProductImage las prioriza
 * automáticamente y estas ilustraciones dejan de usarse.
 */

type IllustrationProps = SVGProps<SVGSVGElement>;

function Vasos(props: IllustrationProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" {...props}>
      <path d="M40 20h14l-2.5 26a4 4 0 0 1-4 3.6H46a4 4 0 0 1-4-3.6L40 20Z" fill="#fff" opacity={0.55} />
      <path d="M12 16h24l-3 30a4.5 4.5 0 0 1-4.5 4.1h-9a4.5 4.5 0 0 1-4.5-4.1L12 16Z" fill="#fff" />
      <path d="M12 16h24" stroke="var(--green-primary)" strokeWidth={2.5} strokeLinecap="round" />
      <path d="M30 10c2 1.5 2 3.5 0 5" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" opacity={0.85} />
    </svg>
  );
}

function Platos(props: IllustrationProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" {...props}>
      <ellipse cx="32" cy="44" rx="20" ry="6" fill="#fff" opacity={0.4} />
      <ellipse cx="32" cy="37" rx="20" ry="6" fill="#fff" opacity={0.55} />
      <ellipse cx="32" cy="28" rx="21" ry="7" fill="#fff" />
      <ellipse cx="32" cy="28" rx="11" ry="3.7" fill="var(--green-primary)" opacity={0.5} />
    </svg>
  );
}

function Cubiertos(props: IllustrationProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" {...props}>
      <path d="M18 8c-1.5 6-1.5 12 0 16l1.5 24a2.5 2.5 0 0 0 5 0L26 24c1.5-4 1.5-10 0-16" stroke="#fff" strokeWidth={3} strokeLinecap="round" opacity={0.6} transform="rotate(-16 32 32)" />
      <path d="M32 8v14a5 5 0 0 0 10 0V8" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" />
      <path d="M37 8v40" stroke="#fff" strokeWidth={3} strokeLinecap="round" />
      <path d="M48 8c3 5 3 11 0 15-1.6 1.8-1.6 4 0 6l0 19" stroke="#fff" strokeWidth={3} strokeLinecap="round" fill="none" transform="rotate(14 48 32)" />
    </svg>
  );
}

function Bandejas(props: IllustrationProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" {...props}>
      <rect x="10" y="34" width="44" height="17" rx="3" fill="#fff" opacity={0.5} />
      <rect x="10" y="29" width="44" height="10" rx="3" fill="#fff" />
      <rect x="16" y="15" width="32" height="15" rx="3" fill="#fff" transform="rotate(-9 32 22)" />
      <rect x="20" y="19" width="24" height="3" rx="1.5" fill="var(--green-primary)" opacity={0.55} transform="rotate(-9 32 22)" />
    </svg>
  );
}

function Bolsas(props: IllustrationProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" {...props}>
      <path d="M15 20h34l-3.2 32a4.5 4.5 0 0 1-4.5 4H22.7a4.5 4.5 0 0 1-4.5-4L15 20Z" fill="#fff" />
      <rect x="19" y="14" width="6" height="12" rx="3" fill="#fff" />
      <rect x="39" y="14" width="6" height="12" rx="3" fill="#fff" />
      <rect x="15" y="18" width="34" height="5" rx="2.5" fill="var(--green-primary)" opacity={0.55} />
    </svg>
  );
}

function Film(props: IllustrationProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" {...props}>
      <rect x="10" y="16" width="10" height="32" rx="5" fill="#fff" />
      <rect x="13.5" y="16" width="3" height="32" rx="1.5" fill="var(--green-primary)" opacity={0.55} />
      <path
        d="M20 20c9 1 20 3 27 1.5-3 4-3 9 0 13-8-1.5-19 .5-27 1.5"
        fill="#fff"
        opacity={0.85}
      />
      <path
        d="M20 34c9 1 20 3 27 1.5-3 4-3 9 0 13-8-1.5-19 .5-27 1.5"
        fill="#fff"
        opacity={0.45}
      />
    </svg>
  );
}

function Servilletas(props: IllustrationProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" {...props}>
      <rect x="13" y="30" width="34" height="20" rx="3" fill="#fff" opacity={0.5} />
      <rect x="17" y="22" width="34" height="20" rx="3" fill="#fff" />
      <path d="M51 22v20L39 22Z" fill="var(--green-primary)" opacity={0.5} />
    </svg>
  );
}

function Gastronomia(props: IllustrationProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" {...props}>
      <circle cx="21" cy="20" r="7.5" fill="#fff" opacity={0.85} />
      <circle cx="32" cy="15" r="9.5" fill="#fff" />
      <circle cx="43" cy="20" r="7.5" fill="#fff" opacity={0.85} />
      <rect x="19" y="19" width="26" height="9" rx="2" fill="#fff" />
      <rect x="14" y="40" width="36" height="12" rx="3" fill="#fff" />
      <rect x="14" y="40" width="36" height="4" rx="2" fill="var(--green-primary)" opacity={0.55} />
    </svg>
  );
}

function Eventos(props: IllustrationProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" {...props}>
      <path d="M16 34 40 46a5 5 0 0 1-2.2 6.7L18 42.4 16 34Z" fill="#fff" opacity={0.85} />
      <path d="M12 26 38 40a5.5 5.5 0 0 1-2.4 7.4L10 36 12 26Z" fill="#fff" />
      <circle cx="46" cy="16" r="2.6" fill="#fff" opacity={0.85} />
      <circle cx="53" cy="24" r="2" fill="#fff" opacity={0.6} />
      <circle cx="52" cy="35" r="2.3" fill="#fff" opacity={0.75} />
      <circle cx="41" cy="12" r="1.8" fill="#fff" opacity={0.55} />
      <path d="M38 24c3-5 8-9 14-10M40 32c5-2 10-1 14 2" stroke="#fff" strokeWidth={2} strokeLinecap="round" opacity={0.45} />
    </svg>
  );
}

function Limpieza(props: IllustrationProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" {...props}>
      <rect x="24" y="20" width="16" height="32" rx="5" fill="#fff" />
      <rect x="28" y="10" width="8" height="12" rx="2" fill="#fff" opacity={0.7} />
      <path d="M40 16h6l3 4-3 4h-6" fill="#fff" opacity={0.55} />
      <path d="M48 12l4-3M50 18h5M48 24l4 3" stroke="#fff" strokeWidth={2} strokeLinecap="round" opacity={0.6} />
      <rect x="28" y="30" width="8" height="14" rx="2" fill="var(--green-primary)" opacity={0.45} />
    </svg>
  );
}

export const ILLUSTRATIONS: Record<string, (props: IllustrationProps) => React.JSX.Element> = {
  CupSoda: Vasos,
  Disc: Platos,
  Utensils: Cubiertos,
  Package: Bandejas,
  ShoppingBag: Bolsas,
  Layers: Film,
  StickyNote: Servilletas,
  ChefHat: Gastronomia,
  PartyPopper: Eventos,
  SprayCan: Limpieza,
};
