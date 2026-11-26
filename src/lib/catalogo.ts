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

// ---- Datos que se pueden leer del nombre ----
//
// Visual App no tiene descripción ni ficha técnica: todo lo que se sabe de un
// producto está en el nombre ("BOLSA FB3 AZUL 12x7x24 X 50u"). Esto saca de
// ahí lo que se puede afirmar sin adivinar, para la tabla de características.

export interface Dato {
  etiqueta: string;
  valor: string;
}

const COLORES: Array<[RegExp, string]> = [
  [/^(BLANCO|BLANCA|BCO|BCA)$/, "blanco"],
  [/^(NEGRO|NEGRA|NEGR)$/, "negro"],
  [/^(ROJO|ROJA)$/, "rojo"],
  [/^AZUL$/, "azul"],
  [/^CELESTE$/, "celeste"],
  [/^(DORADO|DORADA|DORADAS|ORO)$/, "dorado"],
  [/^(PLATA|PLATEADO)$/, "plateado"],
  [/^ROSA$/, "rosa"],
  [/^VERDE$/, "verde"],
  [/^AMARILLO$/, "amarillo"],
  [/^FUCSIA$/, "fucsia"],
  [/^LILA$/, "lila"],
  [/^NARANJA$/, "naranja"],
  [/^VIOLETA$/, "violeta"],
  [/^GRIS$/, "gris"],
  [/^MAGENTA$/, "magenta"],
  [/^BEIGE$/, "beige"],
  [/^(TRANSPARENTE|CRISTAL)$/, "transparente"],
  [/^SURTIDO$/, "surtido"],
];

const MATERIALES: Array<[RegExp, string]> = [
  [/\bPET\b/, "PET"],
  [/\bPVC\b/, "PVC"],
  [/\b(PP|POLIPROPILENO)\b/, "polipropileno"],
  [/\bPS\b/, "poliestireno"],
  [/\bPOLIETILENO\b/, "polietileno"],
  [/\bNITRILO\b/, "nitrilo"],
  [/\bALUMINIO\b/, "aluminio"],
  [/\b(EXPANDIDO|ISOPOR|TELGOPOR)\b/, "poliestireno expandido"],
  [/\bKRAFT\b/, "papel kraft"],
  [/\bCARTULINA\b/, "cartulina"],
  [/\bCARTON\b/, "cartón"],
  [/\bBAMBU\b/, "bambú"],
  [/\bTELA\b/, "tela"],
  [/\bPAPEL\b/, "papel"],
  [/\bPLAST\b/, "plástico"],
];

const num = (t: string) => t.replace(".", ",");
const u = (t?: string) => {
  if (!t) return "";
  const x = t.toUpperCase();
  if (x === "MM") return " mm";
  if (x === "CM") return " cm";
  if (/^MTS?$|^M$/.test(x)) return " m";
  if (x === "KG") return " kg";
  if (/^GR?$/.test(x)) return " g";
  return "";
};

export function datosDelNombre(nombre: string, categoria?: string): Dato[] {
  const n = normalizarTexto(nombre).replace(/º/g, "°");
  const datos: Dato[] = [];
  const poner = (etiqueta: string, valor: string) => {
    if (valor && !datos.some((d) => d.etiqueta === etiqueta)) datos.push({ etiqueta, valor });
  };

  // Presentación: "X 100U", "X 1000 U.", "X 4 UN.", y "(50U/PAQ.)" / "80U/PAQ."
  const total = n.match(/\bX\s*(\d+)\s*(?:U|UN|UNID|UNIDADES)\b/);
  const porPaquete = n.match(/(\d+)\s*U\s*\/\s*PAQ/);
  if (total && porPaquete && total[1] !== porPaquete[1]) {
    poner("Presentación", `${total[1]} unidades (en paquetes de ${porPaquete[1]})`);
  } else if (total) {
    poner("Presentación", `${total[1]} unidades`);
  } else if (porPaquete) {
    poner("Presentación", `Paquete de ${porPaquete[1]} unidades`);
  }

  // Rollos: "30CM X 30MT", "12MM X 30M", "40CM X 1KG"
  const rollo = n.match(/(\d+(?:[.,]\d+)?)\s*(MM|CM)\s*X\s*(\d+(?:[.,]\d+)?)\s*(MTS?|M|KG)\b/);
  if (rollo) {
    poner("Ancho", `${num(rollo[1])}${u(rollo[2])}`);
    poner(rollo[4] === "KG" ? "Peso" : "Largo", `${num(rollo[3])}${u(rollo[4])}`);
  }

  // Medidas en metros: "2MT X 1MT"
  const metros = n.match(/(\d+(?:[.,]\d+)?)\s*MTS?\s*X\s*(\d+(?:[.,]\d+)?)\s*MTS?\b/);
  if (metros) poner("Medidas", `${num(metros[1])} × ${num(metros[2])} m`);

  // Medidas "20 X 30", "12x7x24", "160X80X250MM", "1.2X1.8MT". Si hay unas entre
  // paréntesis, son esas ("BANDEX 445 X 100 (19X19)": 445 es el modelo).
  // No cuentan "9 X 25U" (cantidad), "N° 619 X 100" (número) ni el "X 1 KG" del final.
  let medidasSueltas = false;
  if (!rollo && !metros) {
    const re = /(\d+(?:[.,]\d+)?)\s*X\s*(\d+(?:[.,]\d+)?)(?:\s*X\s*(\d+(?:[.,]\d+)?)(?!\s*(?:KG|GR?|U|UN)\b))?\s*(MM|CM|MTS?|M)?\b/g;
    const candidatos = [...n.matchAll(re)].filter((m) => {
      const antes = n.slice(0, m.index ?? 0);
      const resto = n.slice((m.index ?? 0) + m[0].length);
      if (/N\s*°\s*$/.test(antes)) return false;
      if (/^\s*(U|UN|UNID|UNIDADES)\b/.test(resto) || /^(U|UN)\b/.test(resto)) return false;
      return true;
    });
    const entreParentesis = candidatos.find((m) => /\($/.test(n.slice(0, m.index ?? 0)));
    const elegido = entreParentesis ?? candidatos[0];
    medidasSueltas = Boolean(elegido && !entreParentesis);
    if (elegido) {
      const partes = [elegido[1], elegido[2], elegido[3]].filter(Boolean).map((x) => num(x as string));
      poner("Medidas", partes.join(" × ") + u(elegido[4]));
    }
  }

  // Cantidad sin "U": "N° 619 X 100", "445 X 100 (19X19)", "500U X 1".
  // No si ese "X 30" es el final de unas medidas ("BOBINA 20 X 30").
  if (!datos.some((d) => d.etiqueta === "Presentación") && !medidasSueltas) {
    const suelta = n.match(/\bX\s*(\d{2,})\s*(?:\(|$)/) ?? n.match(/\s(\d{2,})\s*U\b/);
    if (suelta) poner("Presentación", `${suelta[1]} unidades`);
  }

  // Medida suelta: "24CM", "50MM", "RED. 30CM"
  if (!datos.some((d) => d.etiqueta === "Medidas" || d.etiqueta === "Ancho")) {
    const m = n.match(/(?<![X\d.,])\s?(\d+(?:[.,]\d+)?)\s*(MM|CM)\b/);
    if (m) poner("Medida", `${num(m[1])}${u(m[2])}`);
  }

  // Largo suelto: "X 5MT", "X 1000M", "2MT X 1MT" ya quedó en medidas.
  if (!datos.some((d) => ["Medidas", "Largo"].includes(d.etiqueta))) {
    const m = n.match(/\bX\s*(\d+(?:[.,]\d+)?)\s*(MTS?|M)\b/);
    if (m) poner("Largo", `${num(m[1])}${u(m[2])}`);
  }

  const cap = n.match(/(\d+(?:[.,]\d+)?)\s*(CC|ML)\b/);
  if (cap) poner("Capacidad", `${num(cap[1])} ${cap[2].toLowerCase()}`);

  // Peso / capacidad en kilos o gramos: "300G.", "X 500GR", "(1/2KG)", "2 KG."
  if (!datos.some((d) => d.etiqueta === "Peso")) {
    const peso = n.match(/(\d+\/\d+|\d+(?:[.,]\d+)?(?:\s+\d\/\d)?)\s*(KG|GR|G)\b/);
    if (peso) {
      const envase = categoria === "bandejas-envases" || categoria === "gastronomia";
      poner(envase ? "Capacidad" : "Peso", `${num(peso[1])}${u(peso[2])}`);
    }
  }

  const nro = n.match(/N\s*°\s*([0-9A-Z]+)/);
  if (nro) poner("Número", nro[1]);

  const palabras = n.split(/[\s/().,-]+/);
  const colores: string[] = [];
  for (const w of palabras) {
    const c = COLORES.find(([re]) => re.test(w));
    if (c && !colores.includes(c[1])) colores.push(c[1]);
  }
  if (colores.length) poner("Color", colores.join(" / ") + (/\bPASTEL\b/.test(n) ? " pastel" : ""));

  const material = MATERIALES.find(([re]) => re.test(n));
  if (material) poner("Material", material[1]);

  return datos;
}
