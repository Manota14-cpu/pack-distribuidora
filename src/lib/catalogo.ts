/**
 * El catálogo de la tienda, tal como lo publica Visual App, ya ordenado para
 * mostrarlo con el diseño de la web.
 *
 * Visual App sigue siendo el sistema de fondo: de ahí salen productos, precios
 * y stock, y ahí llegan los pedidos (ver `pedidos.ts`). Este archivo no toca la
 * red: solo transforma, así lo pueden usar el servidor y el navegador.
 */
import { VISUAL_APP_ORIGIN, VISUAL_APP_TIENDA } from "./visual-app";

export const CATALOGO_URL = `${VISUAL_APP_ORIGIN}/tienda/${VISUAL_APP_TIENDA}/productos.json`;

/** Un producto como viene de Visual App. */
export interface ProductoVA {
  id: string;
  nombre: string;
  categoria?: string | null;
  precio: number;
  porPeso?: boolean | null;
  unidad?: string | null;
  disponible?: boolean | null;
  stock?: number | null;
  imagen?: string | null;
  imagenes?: string[] | null;
}

export interface CatalogoVA {
  negocio?: string | null;
  whatsapp?: string | null;
  mercadopago?: boolean | null;
  promociones?: Array<{ nombre: string; resumen: string }> | null;
  productos: ProductoVA[];
}

export interface Producto {
  id: string;
  slug: string;
  nombre: string;
  categoria: string;
  precio: number;
  /** Se vende por peso (o por metro / litro): la cantidad va en gramos. */
  porPeso: boolean;
  unidad: string;
  disponible: boolean;
  /** null cuando Visual App no informa stock (sin límite). */
  stock: number | null;
  imagenes: string[];
}

export interface Catalogo {
  negocio: string;
  whatsapp: string | null;
  mercadopago: boolean;
  promociones: Array<{ nombre: string; resumen: string }>;
  productos: Producto[];
}

export interface Categoria {
  slug: string;
  nombre: string;
  /** Nombre de la ilustración (ver components/illustrations.tsx). */
  icono: string;
  descripcion: string;
}

export const CATEGORIAS: Categoria[] = [
  { slug: "bandejas-envases", nombre: "Bandejas y envases", icono: "Package", descripcion: "Bandejas, potes, cajas y estuches" },
  { slug: "bolsas", nombre: "Bolsas", icono: "ShoppingBag", descripcion: "Camiseta, papel, panadería y bobinas" },
  { slug: "vasos", nombre: "Vasos", icono: "CupSoda", descripcion: "Plásticos y térmicos" },
  { slug: "platos", nombre: "Platos", icono: "Disc", descripcion: "Plásticos y de aluminio" },
  { slug: "cubiertos", nombre: "Cubiertos", icono: "Utensils", descripcion: "Tenedores y cucharas" },
  { slug: "film-envoltorios", nombre: "Film y envoltorios", icono: "Layers", descripcion: "PVC, aluminio, stretch y papeles" },
  { slug: "gastronomia", nombre: "Gastronomía y repostería", icono: "ChefHat", descripcion: "Moldes, pirotines, blondas y más" },
  { slug: "eventos", nombre: "Cotillón y eventos", icono: "PartyPopper", descripcion: "Globos, bengalas, manteles y moños" },
  { slug: "servilletas", nombre: "Servilletas", icono: "StickyNote", descripcion: "Para mesa y mostrador" },
  { slug: "limpieza", nombre: "Higiene y limpieza", icono: "SprayCan", descripcion: "Papel higiénico y toallas" },
  { slug: "libreria", nombre: "Librería y comercio", icono: "PenLine", descripcion: "Etiquetas, cintas y marcadores" },
];

export function categoriaPorSlug(slug: string): Categoria | undefined {
  return CATEGORIAS.find((c) => c.slug === slug);
}

/** Mayúsculas, sin tildes ni eñes, espacios simples. */
function normalizarTexto(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function slugify(texto: string): string {
  return normalizarTexto(texto)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70)
    .replace(/-+$/g, "");
}

/**
 * Reglas por nombre, en orden: gana la primera que coincide (contra el nombre
 * sin tildes: CAÑON → CANON, MOÑO → MONO). Hacen falta porque Visual App tiene
 * casi todo en "General", que no le sirve a nadie para buscar.
 */
export const REGLAS_POR_NOMBRE: Array<[RegExp, string]> = [
  [/^(BANDERIN|BENGALA|CANON|CONFETI|CORTINA|GLOBO|GORRO|MANTEL|MONO|PORRA|SET GLOBOS|TOPPER|CINTA PARA ARCO|HOJA MURESCO|PORTABOTELLA)\b/, "eventos"],
  [/^(ADHESIVO|ALFILERES|APRIETA|BOLIGRAFO|CHINCHES|CLIPS|MARCADOR|RESALTADOR|LIBRETA|TALONARIO|CINTA PP|PILAS|CARTEL|ETIQUETA)\b/, "libreria"],
  [/^VASO\b/, "vasos"],
  [/^PLATO\b/, "platos"],
  [/^(CUCHARA|CUCHARITA|TENEDOR|CUCHILLO|CUBIERTO)/, "cubiertos"],
  [/^SERVILLETA/, "servilletas"],
  [/^(PAPEL HIG|TOALLA|TRAPO|REJILLA|ESPONJA|LAVANDINA|DETERGENTE)/, "limpieza"],
  [/^(FILM|FOLEX|ROLLO PAPEL|PAPEL (ALUMINIO|MANTECA|HAMBURGUESA|KRAFT|PRENSA))\b/, "film-envoltorios"],
  [/^(BOLSA|CAMISETA|BOBINA)/, "bolsas"],
  [/^(BAND\.|BANDEJA|BASE ENSALADERA|TAPA|POTE|CONJ\. POTE|ENVASE|ESTUCHE|ENSALADERA|TORTERA|CAJA|MALETIN|CONO|PANCHERA|DISCO CARTON|OBLEA)/, "bandejas-envases"],
  [/^(MOLDE|PIROTIN|BLONDA|FAJAS?|TRIPODES?|PALITO|PINCHO|AGITADOR|SORBETE|ESCARBADIENTES|GUANTES)\b/, "gastronomia"],
];

/** Si ninguna regla por nombre coincide, se usa la categoría de Visual App. */
export const CATEGORIA_DE_VISUAL_APP: Record<string, string> = {
  "VASOS PLASTICOS": "vasos",
  "BOLSAS PANADERIA": "bolsas",
  ALUMINIO: "bandejas-envases",
  "CAJAS CARTON": "bandejas-envases",
  LIBRERIA: "libreria",
};

export const CATEGORIA_POR_DEFECTO = "gastronomia";

export function categoriaPara(p: Pick<ProductoVA, "nombre" | "categoria">): string {
  const nombre = normalizarTexto(p.nombre);
  for (const [regla, slug] of REGLAS_POR_NOMBRE) if (regla.test(nombre)) return slug;
  return CATEGORIA_DE_VISUAL_APP[normalizarTexto(p.categoria ?? "")] ?? CATEGORIA_POR_DEFECTO;
}

/**
 * Dirección de la ficha: nombre legible + el comienzo del id de Visual App.
 * Lo que manda es el id; si cambia el nombre, el enlace viejo sigue andando.
 */
export function slugDeProducto(p: Pick<ProductoVA, "id" | "nombre">): string {
  return `${slugify(p.nombre) || "producto"}-${p.id.slice(0, 8)}`;
}

export function idCortoDeSlug(slug: string): string {
  return slug.slice(slug.lastIndexOf("-") + 1);
}

function imagenesDe(p: ProductoVA): string[] {
  const todas = [p.imagen, ...(p.imagenes ?? [])].filter(
    (u): u is string => typeof u === "string" && /^https:\/\//.test(u)
  );
  return [...new Set(todas)];
}

export function normalizarCatalogo(crudo: CatalogoVA): Catalogo {
  const productos: Producto[] = [];
  const vistos = new Set<string>();
  for (const p of crudo.productos ?? []) {
    if (!p || typeof p.id !== "string" || typeof p.nombre !== "string" || vistos.has(p.id)) continue;
    if (typeof p.precio !== "number" || !Number.isFinite(p.precio)) continue;
    vistos.add(p.id);
    productos.push({
      id: p.id,
      slug: slugDeProducto(p),
      nombre: p.nombre.replace(/\s+/g, " ").trim(),
      categoria: categoriaPara(p),
      precio: p.precio,
      porPeso: Boolean(p.porPeso),
      unidad: p.unidad?.trim() || "unidad",
      disponible: p.disponible !== false,
      stock: typeof p.stock === "number" ? p.stock : null,
      imagenes: imagenesDe(p),
    });
  }
  return {
    negocio: crudo.negocio?.trim() || "Pack Distribuidora",
    whatsapp: crudo.whatsapp || null,
    mercadopago: Boolean(crudo.mercadopago),
    promociones: crudo.promociones ?? [],
    productos,
  };
}

export function buscarPorSlug(catalogo: Catalogo, slug: string): Producto | undefined {
  const corto = idCortoDeSlug(slug);
  return corto ? catalogo.productos.find((p) => p.id.startsWith(corto)) : undefined;
}

// ---- Cantidades y precios (las mismas cuentas que hace Visual App) ----

const UNIDADES_CC = ["litro", "litros", "l", "lt", "lts", "cc", "ml"];
const UNIDADES_MM = ["metro", "metros", "m", "mt", "mts", "mm"];

/** Cuánto se suma con cada "+": 100 g en los productos por peso, 1 en el resto. */
export function paso(p: Pick<Producto, "porPeso">): number {
  return p.porPeso ? 100 : 1;
}

/** Tope de cantidad según el stock (en gramos si es por peso). */
export function maximo(p: Pick<Producto, "stock">): number {
  return typeof p.stock === "number" ? Math.max(0, p.stock) : Infinity;
}

/** Precio de una cantidad: en los productos por peso el precio es por kilo. */
export function importe(p: Pick<Producto, "precio" | "porPeso">, cantidad: number): number {
  return p.porPeso ? Math.round((p.precio * cantidad) / 1000) : p.precio * cantidad;
}

export function plata(n: number): string {
  return "$" + Math.round(n).toLocaleString("es-AR");
}

/** Cantidad para mostrar: "3", o "1,5 kg" / "250 g" en los productos por peso. */
export function cantidadTexto(p: Pick<Producto, "porPeso" | "unidad">, cantidad: number): string {
  if (!p.porPeso) return String(cantidad);
  const u = p.unidad.toLowerCase();
  const [chica, grande] = UNIDADES_MM.includes(u) ? ["mm", "m"] : UNIDADES_CC.includes(u) ? ["cc", "L"] : ["g", "kg"];
  return cantidad >= 1000
    ? `${(cantidad / 1000).toLocaleString("es-AR", { maximumFractionDigits: 2 })} ${grande}`
    : `${cantidad} ${chica}`;
}

/** "el kilo", "el metro", "el litro" o la unidad de venta. */
export function precioPor(p: Pick<Producto, "porPeso" | "unidad">): string {
  if (!p.porPeso) return p.unidad === "unidad" ? "por unidad" : `por ${p.unidad}`;
  const u = p.unidad.toLowerCase();
  return UNIDADES_MM.includes(u) ? "el metro" : UNIDADES_CC.includes(u) ? "el litro" : "el kilo";
}

/** Pocas unidades: se avisa "Últimas unidades". */
export function quedanPocas(p: Pick<Producto, "stock" | "porPeso" | "disponible">): boolean {
  return p.disponible && typeof p.stock === "number" && !p.porPeso && p.stock > 0 && p.stock <= 10;
}
