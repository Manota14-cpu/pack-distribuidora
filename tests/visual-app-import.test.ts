import { describe, expect, it } from "vitest";
import { categories } from "@/lib/products";
import {
  CATEGORIA_DEL_FEED,
  CATEGORIA_POR_DEFECTO,
  REGLAS_POR_NOMBRE,
  categoriaPara,
  planificarImportacion,
  slugify,
  visualAppFeedSchema,
  type ProductoExistente,
  type VisualAppFeed,
} from "@/lib/visual-app-import";

function item(id: string, nombre: string, extra: Partial<VisualAppFeed["productos"][number]> = {}) {
  return {
    id,
    nombre,
    categoria: "General",
    precio: 100,
    porPeso: false,
    unidad: "unidad",
    disponible: true,
    stock: 10,
    imagen: null,
    imagenes: [],
    ...extra,
  };
}

function existente(id: string, name: string, extra: Partial<ProductoExistente> = {}): ProductoExistente {
  return { id, slug: slugify(name), name, price: 100, stockAvailable: 10, active: true, imageUrls: [], ...extra };
}

describe("slugify", () => {
  it("saca tildes, eñes y signos", () => {
    expect(slugify("CAÑON PARTY TIME 30CM CONFETI DORADO")).toBe("canon-party-time-30cm-confeti-dorado");
    expect(slugify("BAND. EXPANDIDO BANDEX L N° 615 x 100u")).toBe("band-expandido-bandex-l-n-615-x-100u");
    expect(slugify("RESALTADOR UTIL UNO PASTEL FINO ()")).toBe("resaltador-util-uno-pastel-fino");
  });
});

describe("categoriaPara", () => {
  it.each([
    ["VASO TERMICO ISOPOR 8D 240CC X 100U", "General", "vasos"],
    ["PLATO ALUMINIO VASSOI P20 x 100 u.", "Aluminio", "platos"],
    ["TENEDOR BLANCO KOVALPLAST X 1000U (50U/PAQ.)", "General", "cubiertos"],
    ["CAMISETA 40 X 50 INPLA DUO 70U/PAQ.", "General", "bolsas"],
    ["FILM DE ALUMINIO NEW PACK 30CM X 5MT.", "Aluminio", "film-envoltorios"],
    ["BAND. BLONDA PLAST. RECT. 2 KG.", "General", "bandejas-envases"],
    ["BLONDA CALADA BCA 12CM X 100 U.", "General", "gastronomia"],
    ["MOÑO GRANDE RAPIDO ROJO LISO X 50U.", "General", "eventos"],
    ["CINTA PP TRANSPARENTE AUCA 48MM X 40M", "General", "libreria"],
    ["CINTA PARA ARCO ORGANICA X 5MT", "General", "eventos"],
    ["TOALLA INT. 3P. BLANCA ELITE X 2000U (6300)", "General", "limpieza"],
  ])("%s → %s", (nombre, categoria, esperada) => {
    expect(categoriaPara({ nombre, categoria }).slug).toBe(esperada);
  });

  it("sin regla por nombre usa la categoría del feed, y si no, la de defecto", () => {
    expect(categoriaPara({ nombre: "ALGO RARO", categoria: "Aluminio" })).toEqual({
      slug: "bandejas-envases",
      origen: "feed",
    });
    expect(categoriaPara({ nombre: "ALGO RARO", categoria: "General" })).toEqual({
      slug: CATEGORIA_POR_DEFECTO,
      origen: "defecto",
    });
  });

  it("solo manda a categorías que el script sabe crear", () => {
    const destinos = new Set([
      ...REGLAS_POR_NOMBRE.map(([, slug]) => slug),
      ...Object.values(CATEGORIA_DEL_FEED),
      CATEGORIA_POR_DEFECTO,
    ]);
    const conocidas = new Set(categories.map((c) => c.slug as string));
    for (const slug of destinos) expect(conocidas).toContain(slug);
  });
});

describe("planificarImportacion", () => {
  it("da de alta lo nuevo con slugs únicos", () => {
    const feed = visualAppFeedSchema.parse({
      productos: [item("a", "BOLSA FB3 AZUL"), item("b", "Bolsa FB3 azul!"), item("c", "VASO X")],
    });
    const plan = planificarImportacion(feed, [existente("z", "Vaso viejo", { slug: "vaso-x" })]);
    expect(plan.altas.map((a) => a.slug)).toEqual(["bolsa-fb3-azul", "bolsa-fb3-azul-2", "vaso-x-2"]);
    expect(plan.faltantes.map((p) => p.id)).toEqual(["z"]);
  });

  it("actualiza por id o por nombre y detalla qué cambia", () => {
    const feed = visualAppFeedSchema.parse({
      productos: [
        item("a", "BOLSA FB3 AZUL", { precio: 250, stock: 3, imagen: "https://x/1.jpg", imagenes: ["https://x/1.jpg"] }),
        item("b", "Vaso Térmico", { disponible: false }),
        item("c", "IGUAL"),
      ],
    });
    const plan = planificarImportacion(feed, [
      existente("a", "BOLSA FB3 AZUL"),
      existente("viejo", "VASO TERMICO"),
      existente("c", "IGUAL"),
    ]);
    expect(plan.altas).toEqual([]);
    expect(plan.sinCambios).toBe(1);
    expect(plan.cambios).toEqual([
      {
        id: "a",
        feedId: "a",
        coincidencia: "id",
        price: { antes: 100, despues: 250 },
        stock: { antes: 10, despues: 3 },
        imagenesNuevas: ["https://x/1.jpg"],
      },
      {
        id: "viejo",
        feedId: "b",
        coincidencia: "nombre",
        name: { antes: "VASO TERMICO", despues: "Vaso Térmico" },
        active: { antes: true, despues: false },
        imagenesNuevas: [],
      },
    ]);
  });

  it("ignora ids repetidos", () => {
    const feed = visualAppFeedSchema.parse({ productos: [item("a", "UNO"), item("a", "UNO BIS")] });
    const plan = planificarImportacion(feed, []);
    expect(plan.altas).toHaveLength(1);
    expect(plan.descartados).toHaveLength(1);
  });
});
