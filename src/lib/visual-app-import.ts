/**
 * Importación del catálogo publicado por Visual App.
 *
 * Visual App publica la lista de productos del local como JSON
 * (`/tienda/<negocio>/productos.json`). Acá vive la parte pura de la
 * importación: leer ese JSON, decidir a qué categoría de la tienda va cada
 * producto y comparar contra lo que ya hay en la base. No toca la base; eso lo
 * hace `scripts/importar-visual-app.ts`, que usa este plan.
 *
 * Qué manda el feed y qué no:
 * - El feed manda nombre, precio, stock, disponibilidad y fotos. Cada vez que
 *   se importa, esos campos se ponen como dice el feed.
 * - Categoría, descripciones, destacados, mayorista y SEO se completan solo al
 *   crear el producto. Si después se corrigen en AppPack, una nueva importación
 *   no los pisa.
 * - Las fotos solo se agregan: una foto cargada a mano no se borra.
 */
import { z } from "zod";

export const VISUAL_APP_FEED_URL =
  "https://visual-app-licencias.visual-app-licencias.workers.dev/tienda/pack-distriuidora/productos.json";

const feedProductSchema = z.object({
  id: z.string().min(1),
  nombre: z.string().min(1),
  categoria: z.string().nullish(),
  precio: z.number().nonnegative(),
  porPeso: z.boolean().nullish(),
  unidad: z.string().nullish(),
  disponible: z.boolean().nullish(),
  stock: z.number().nullish(),
  imagen: z.string().nullish(),
  imagenes: z.array(z.string()).nullish(),
});

export const visualAppFeedSchema = z.object({
  negocio: z.string().nullish(),
  productos: z.array(feedProductSchema),
});

export type VisualAppFeed = z.infer<typeof visualAppFeedSchema>;
export type VisualAppProduct = z.infer<typeof feedProductSchema>;

/** Mayúsculas, sin tildes ni eñes, espacios simples. Para comparar nombres. */
export function normalizarNombre(nombre: string): string {
  return nombre
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function slugify(texto: string): string {
  return normalizarNombre(texto)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

/**
 * Reglas por nombre, en orden: gana la primera que coincide. Se comparan contra
 * el nombre normalizado (sin tildes: CAÑON → CANON, MOÑO → MONO).
 *
 * Hacen falta porque el feed tiene casi todo en "General" (238 de 322), que no
 * le sirve a nadie para buscar. Cada slug tiene que estar en `categories` de
 * src/lib/products.ts: de ahí saca el script nombre e ícono si tiene que
 * crear la categoría ("libreria" se sumó para este catálogo).
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

/** Si ninguna regla por nombre coincide, se usa la categoría del feed. */
export const CATEGORIA_DEL_FEED: Record<string, string> = {
  "VASOS PLASTICOS": "vasos",
  "BOLSAS PANADERIA": "bolsas",
  ALUMINIO: "bandejas-envases",
  "CAJAS CARTON": "bandejas-envases",
  LIBRERIA: "libreria",
};

export const CATEGORIA_POR_DEFECTO = "gastronomia";

export function categoriaPara(producto: Pick<VisualAppProduct, "nombre" | "categoria">): {
  slug: string;
  origen: "nombre" | "feed" | "defecto";
} {
  const nombre = normalizarNombre(producto.nombre);
  for (const [regla, slug] of REGLAS_POR_NOMBRE) {
    if (regla.test(nombre)) return { slug, origen: "nombre" };
  }
  const delFeed = CATEGORIA_DEL_FEED[normalizarNombre(producto.categoria ?? "")];
  if (delFeed) return { slug: delFeed, origen: "feed" };
  return { slug: CATEGORIA_POR_DEFECTO, origen: "defecto" };
}

export function imagenesDe(producto: VisualAppProduct): string[] {
  const todas = [producto.imagen, ...(producto.imagenes ?? [])].filter(
    (url): url is string => typeof url === "string" && /^https?:\/\//.test(url)
  );
  return [...new Set(todas)];
}

export function unidadDe(producto: VisualAppProduct): string {
  if (producto.porPeso) return "kg";
  return producto.unidad?.trim() || "unidad";
}

/** Lo que el plan necesita saber de un producto que ya está en la base. */
export interface ProductoExistente {
  id: string;
  slug: string;
  name: string;
  price: number;
  stockAvailable: number;
  active: boolean;
  imageUrls: string[];
}

export interface Alta {
  feedId: string;
  slug: string;
  name: string;
  categoria: string;
  categoriaOrigen: "nombre" | "feed" | "defecto";
  price: number;
  stock: number;
  unit: string;
  active: boolean;
  imagenes: string[];
}

export interface Cambio {
  id: string;
  feedId: string;
  /** Cómo se encontró el producto en la base. */
  coincidencia: "id" | "nombre";
  name?: { antes: string; despues: string };
  price?: { antes: number; despues: number };
  stock?: { antes: number; despues: number };
  active?: { antes: boolean; despues: boolean };
  imagenesNuevas: string[];
}

export interface PlanDeImportacion {
  altas: Alta[];
  cambios: Cambio[];
  sinCambios: number;
  /** Productos de la base que no vinieron en el feed. */
  faltantes: ProductoExistente[];
  /** Renglones del feed que se ignoran (ids repetidos). */
  descartados: Array<{ feedId: string; nombre: string; motivo: string }>;
}

function tieneCambios(c: Cambio): boolean {
  return Boolean(c.name || c.price || c.stock || c.active || c.imagenesNuevas.length);
}

/**
 * Compara el feed con la base y arma la lista de altas y cambios.
 *
 * Un producto del feed se busca primero por id (los que dio de alta esta
 * importación guardan el id de Visual App) y, si no está, por nombre: así un
 * producto que ya se había cargado a mano en AppPack se actualiza en vez de
 * duplicarse.
 */
export function planificarImportacion(
  feed: VisualAppFeed,
  existentes: ProductoExistente[]
): PlanDeImportacion {
  const porId = new Map(existentes.map((p) => [p.id, p]));
  const porNombre = new Map<string, ProductoExistente>();
  for (const p of existentes) {
    const clave = normalizarNombre(p.name);
    if (!porNombre.has(clave)) porNombre.set(clave, p);
  }
  const slugsOcupados = new Set(existentes.map((p) => p.slug));

  const plan: PlanDeImportacion = { altas: [], cambios: [], sinCambios: 0, faltantes: [], descartados: [] };
  const vistos = new Set<string>();
  const usados = new Set<string>();

  for (const item of feed.productos) {
    if (vistos.has(item.id)) {
      plan.descartados.push({ feedId: item.id, nombre: item.nombre, motivo: "id repetido en el feed" });
      continue;
    }
    vistos.add(item.id);

    const name = item.nombre.replace(/\s+/g, " ").trim();
    const price = Math.round(item.precio);
    const stock = Math.max(0, Math.round(item.stock ?? 0));
    const active = item.disponible ?? true;
    const imagenes = imagenesDe(item);

    let existente: ProductoExistente | undefined = porId.get(item.id);
    let coincidencia: Cambio["coincidencia"] = "id";
    if (!existente) {
      const candidato = porNombre.get(normalizarNombre(name));
      // Un producto de la base se empareja con un solo renglón del feed.
      if (candidato && !usados.has(candidato.id)) {
        existente = candidato;
        coincidencia = "nombre";
      }
    }

    if (existente) {
      usados.add(existente.id);
      const fotosActuales = existente.imageUrls;
      const cambio: Cambio = {
        id: existente.id,
        feedId: item.id,
        coincidencia,
        imagenesNuevas: imagenes.filter((url) => !fotosActuales.includes(url)),
      };
      if (existente.name !== name) cambio.name = { antes: existente.name, despues: name };
      if (existente.price !== price) cambio.price = { antes: existente.price, despues: price };
      if (existente.stockAvailable !== stock) cambio.stock = { antes: existente.stockAvailable, despues: stock };
      if (existente.active !== active) cambio.active = { antes: existente.active, despues: active };
      if (tieneCambios(cambio)) plan.cambios.push(cambio);
      else plan.sinCambios++;
      continue;
    }

    const base = slugify(name) || `producto-${item.id.slice(0, 8)}`;
    let slug = base;
    for (let n = 2; slugsOcupados.has(slug); n++) slug = `${base}-${n}`;
    slugsOcupados.add(slug);

    const categoria = categoriaPara(item);
    plan.altas.push({
      feedId: item.id,
      slug,
      name,
      categoria: categoria.slug,
      categoriaOrigen: categoria.origen,
      price,
      stock,
      unit: unidadDe(item),
      active,
      imagenes,
    });
  }

  plan.faltantes = existentes.filter((p) => !usados.has(p.id));
  return plan;
}
