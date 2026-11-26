import { describe, expect, it } from "vitest";
import {
  CATEGORIAS,
  CATEGORIA_DE_VISUAL_APP,
  CATEGORIA_POR_DEFECTO,
  REGLAS_POR_NOMBRE,
  buscarPorSlug,
  cantidadTexto,
  categoriaPara,
  datosDelNombre,
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

describe("datosDelNombre", () => {
  const datos = (nombre: string, categoria?: string) =>
    Object.fromEntries(
      datosDelNombre(nombre, categoria).map((d) => [d.etiqueta, d.valor])
    );

  it("presentación y medidas de bolsas", () => {
    expect(datos("BOLSA FB3 AZUL 12x7x24 X 50u")).toEqual({
      Presentación: "50 unidades",
      Medidas: "12 × 7 × 24",
      Color: "azul",
    });
    expect(datos("BOLSA BP2 C/MANIJA BLANCA 160X80X250MM")).toMatchObject({ Medidas: "160 × 80 × 250 mm", Color: "blanco" });
    expect(datos("CAMISETA 40 X 50 INPLA DUO 70U/PAQ.")).toMatchObject({ Presentación: "Paquete de 70 unidades", Medidas: "40 × 50" });
  });

  it("no confunde cantidad con medidas", () => {
    const d = datos("GLOBO BOMBUCHA PERLADO 9 X 25U CELESTE");
    expect(d.Presentación).toBe("25 unidades");
    expect(d.Medidas).toBeUndefined();
    expect(d.Color).toBe("celeste");
  });

  it("rollos: ancho y largo o peso", () => {
    expect(datos("FILM DE PVC NEW PACK 30CM X 30MT.")).toMatchObject({ Ancho: "30 cm", Largo: "30 m", Material: "PVC" });
    expect(datos("FILM DE ALUMINIO ROLLO 40CM X 1KG")).toMatchObject({ Ancho: "40 cm", Peso: "1 kg", Material: "aluminio" });
    expect(datos("CINTA PP TRANSPARENTE AUCA 48MM X 90M")).toMatchObject({ Ancho: "48 mm", Largo: "90 m", Color: "transparente" });
  });

  it("capacidad, número, paquetes y colores combinados", () => {
    expect(datos("VASO TERMICO ISOPOR 8D 240CC X 100U")).toMatchObject({
      Presentación: "100 unidades",
      Capacidad: "240 cc",
      Material: "poliestireno expandido",
    });
    expect(datos("BAND. EXPANDIDO BANDEX L N° 615 x 100u")).toMatchObject({ Número: "615", Presentación: "100 unidades" });
    expect(datos("CUCHARA SUNDAE PS BCA. KOVAL X 1000U (50U/PAQ.)")).toMatchObject({
      Presentación: "1000 unidades (en paquetes de 50)",
      Color: "blanco",
      Material: "poliestireno",
    });
    expect(datos("BANDERIN BLANCO/ORO FELIZ CUMPLE")).toMatchObject({ Color: "blanco / dorado" });
    expect(datos("BANDEJA CARTON DORADO 18 X 24CM (1/2KG)", "bandejas-envases")).toMatchObject({
      Medidas: "18 × 24 cm",
      Capacidad: "1/2 kg",
      Material: "cartón",
    });
  });
});

describe("datosDelNombre: casos raros del catálogo", () => {
  const datos = (nombre: string) => Object.fromEntries(datosDelNombre(nombre).map((d) => [d.etiqueta, d.valor]));
  it("número de modelo y cantidad sin U", () => {
    const d = datos("OBLEA EXPANDIDO BANDEX L N° 619 X 100");
    expect(d.Medidas).toBeUndefined();
    expect(d.Presentación).toBe("100 unidades");
    expect(datos("TAPA ENSALADERA PET BANDEX 445 X 100 (19X19)")).toMatchObject({ Medidas: "19 × 19", Presentación: "100 unidades" });
    expect(datos("ESCARBADIENTES ENSOB. 500U X 1")).toMatchObject({ Presentación: "500 unidades" });
  });
  it("peso al final y medidas en metros", () => {
    expect(datos("FOLEX LAMINA HAMBURGUESA INPLA 16X16 X 1 KG")).toMatchObject({ Medidas: "16 × 16", Peso: "1 kg" });
    expect(datos("CORTINA METALIZADA OVNI 2MT X 1MT ORO")).toMatchObject({ Medidas: "2 × 1 m", Color: "dorado" });
    expect(datos("BOBINA ARR. A.D. INPLA 15 X 20 300G.")).toMatchObject({ Medidas: "15 × 20", Peso: "300 g" });
    expect(datos("BOBINA ARR. A.D. INPLA DUO 20 X 30")).toEqual({ Medidas: "20 × 30" });
  });
});
