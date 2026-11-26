import { describe, expect, it } from "vitest";
import {
  CATEGORIAS,
  CATEGORIA_DE_VISUAL_APP,
  CATEGORIA_POR_DEFECTO,
  REGLAS_POR_NOMBRE,
  buscarPorSlug,
  cantidadTexto,
  categoriaPara,
  importe,
  maximo,
  normalizarCatalogo,
  paso,
  precioPor,
  quedanPocas,
  slugify,
  type ProductoVA,
} from "@/lib/catalogo";

function va(id: string, nombre: string, extra: Partial<ProductoVA> = {}): ProductoVA {
  return { id, nombre, categoria: "General", precio: 100, porPeso: false, unidad: "unidad", disponible: true, stock: 10, imagen: null, imagenes: [], ...extra };
}

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
    expect(categoriaPara({ nombre, categoria })).toBe(esperada);
  });

  it("sin regla usa la categoría de Visual App, y si no, la de defecto", () => {
    expect(categoriaPara({ nombre: "ALGO RARO", categoria: "Aluminio" })).toBe("bandejas-envases");
    expect(categoriaPara({ nombre: "ALGO RARO", categoria: "General" })).toBe(CATEGORIA_POR_DEFECTO);
  });

  it("todas las reglas mandan a categorías que existen", () => {
    const existen = new Set(CATEGORIAS.map((c) => c.slug));
    const destinos = [...REGLAS_POR_NOMBRE.map(([, s]) => s), ...Object.values(CATEGORIA_DE_VISUAL_APP), CATEGORIA_POR_DEFECTO];
    for (const d of destinos) expect(existen).toContain(d);
  });
});

describe("normalizarCatalogo", () => {
  it("arma slugs con el id, deja solo fotos https y saltea repetidos y rotos", () => {
    const c = normalizarCatalogo({
      negocio: "PACK",
      mercadopago: true,
      productos: [
        va("e0bc6bab6b944b268a242bb5cb5a44e4", "ADHESIVO LA GOTITA 2ML", {
          imagen: "https://x/a.jpg",
          imagenes: ["https://x/a.jpg", "http://inseguro/b.jpg", "https://x/c.jpg"],
        }),
        va("e0bc6bab6b944b268a242bb5cb5a44e4", "REPETIDO"),
        { id: "sin-precio", nombre: "X" } as unknown as ProductoVA,
        va("946554e3ce0b49c19e98dd3c1ee91667", "CAÑON PARTY  TIME", { disponible: false, stock: null }),
      ],
    });
    expect(c.mercadopago).toBe(true);
    expect(c.productos).toHaveLength(2);
    const [a, b] = c.productos;
    expect(a.slug).toBe("adhesivo-la-gotita-2ml-e0bc6bab");
    expect(a.imagenes).toEqual(["https://x/a.jpg", "https://x/c.jpg"]);
    expect(b.nombre).toBe("CAÑON PARTY TIME");
    expect(b.slug).toBe("canon-party-time-946554e3");
    expect(b.disponible).toBe(false);
    expect(b.stock).toBeNull();
  });

  it("encuentra el producto por la dirección, aunque el nombre haya cambiado", () => {
    const c = normalizarCatalogo({ productos: [va("e0bc6bab6b944b268a242bb5cb5a44e4", "NOMBRE NUEVO")] });
    expect(buscarPorSlug(c, "nombre-viejo-e0bc6bab")?.nombre).toBe("NOMBRE NUEVO");
    expect(buscarPorSlug(c, "otro-ffffffff")).toBeUndefined();
  });
});

describe("cantidades y precios", () => {
  const porUnidad = { porPeso: false, precio: 250, unidad: "unidad", stock: 5, disponible: true };
  const porKilo = { porPeso: true, precio: 4000, unidad: "kg", stock: 2500, disponible: true };

  it("por unidad: de a 1, precio por cantidad", () => {
    expect(paso(porUnidad)).toBe(1);
    expect(importe(porUnidad, 3)).toBe(750);
    expect(cantidadTexto(porUnidad, 3)).toBe("3");
    expect(precioPor(porUnidad)).toBe("por unidad");
  });

  it("por peso: de a 100 g, precio por kilo", () => {
    expect(paso(porKilo)).toBe(100);
    expect(importe(porKilo, 250)).toBe(1000);
    expect(cantidadTexto(porKilo, 250)).toBe("250 g");
    expect(cantidadTexto(porKilo, 1500)).toBe("1,5 kg");
    expect(precioPor(porKilo)).toBe("el kilo");
  });

  it("el stock pone el tope; sin stock informado no hay tope", () => {
    expect(maximo(porUnidad)).toBe(5);
    expect(maximo({ stock: null })).toBe(Infinity);
  });

  it("avisa últimas unidades con 10 o menos", () => {
    expect(quedanPocas(porUnidad)).toBe(true);
    expect(quedanPocas({ ...porUnidad, stock: 50 })).toBe(false);
    expect(quedanPocas({ ...porUnidad, stock: 0 })).toBe(false);
  });
});

describe("slugify", () => {
  it("saca tildes, eñes y signos", () => {
    expect(slugify("BAND. EXPANDIDO BANDEX L N° 615 x 100u")).toBe("band-expandido-bandex-l-n-615-x-100u");
    expect(slugify("RESALTADOR UTIL UNO PASTEL FINO ()")).toBe("resaltador-util-uno-pastel-fino");
  });
});
