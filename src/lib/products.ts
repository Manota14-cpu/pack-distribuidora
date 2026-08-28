import { Category, Product } from "./types";

export const categories: Category[] = [
  { slug: "vasos", name: "Vasos", icon: "CupSoda", description: "Descartables y térmicos, todas las medidas" },
  { slug: "platos", name: "Platos", icon: "Disc", description: "Playos, hondos y para postre" },
  { slug: "cubiertos", name: "Cubiertos", icon: "Utensils", description: "Tenedores, cuchillos y cucharas" },
  { slug: "bandejas-envases", name: "Bandejas y envases", icon: "Package", description: "Con y sin tapa, aptos para freezer" },
  { slug: "bolsas", name: "Bolsas", icon: "ShoppingBag", description: "Camiseta, residuo y consorcio" },
  { slug: "film-envoltorios", name: "Film y envoltorios", icon: "Layers", description: "PVC, aluminio y papel manteca" },
  { slug: "servilletas", name: "Servilletas", icon: "StickyNote", description: "Cocktail, cenador y rollo" },
  { slug: "gastronomia", name: "Productos para gastronomía", icon: "ChefHat", description: "Todo para tu local" },
  { slug: "eventos", name: "Productos para eventos", icon: "PartyPopper", description: "Fiestas, cumpleaños y celebraciones" },
  { slug: "limpieza", name: "Productos de limpieza", icon: "SprayCan", description: "Descartables para higiene diaria" },
];

export const products: Product[] = [
  {
    id: "1", slug: "vaso-plastico-500cc-x50", name: "Vaso plástico descartable 500cc",
    category: "vasos", description: "Pack x50 unidades, ideal para gaseosa y cerveza.",
    longDescription: "Vaso plástico descartable de 500cc fabricado en PP cristal, resistente y transparente. Ideal para eventos, comercios gastronómicos y uso hogareño. Apto para bebidas frías.",
    features: ["Capacidad 500cc", "PP cristal transparente", "Apto bebidas frías", "Pack x50 unidades"],
    price: 1250, oldPrice: 1600, discount: 22, icon: "CupSoda", stock: 340, unit: "x50u", featured: true, bestSeller: true, rating: 4.8,
  },
  {
    id: "2", slug: "vaso-plastico-300cc-x50", name: "Vaso plástico descartable 300cc",
    category: "vasos", description: "Pack x50 unidades, tamaño individual.",
    longDescription: "Vaso descartable de 300cc, medida estándar para agua, jugo y bebidas individuales. Liviano, resistente y económico.",
    features: ["Capacidad 300cc", "PP cristal", "Pack x50 unidades", "Ideal oficinas y eventos"],
    price: 890, icon: "CupSoda", stock: 512, unit: "x50u", featured: false, rating: 4.6,
  },
  {
    id: "3", slug: "vaso-termico-8oz-x25", name: "Vaso térmico 8oz",
    category: "vasos", description: "Pack x25 unidades, ideal para café y bebidas calientes.",
    longDescription: "Vaso térmico de papel biodegradable con doble pared, mantiene la temperatura sin quemar las manos. Perfecto para cafeterías y kioscos.",
    features: ["Capacidad 8oz (240ml)", "Doble pared térmica", "Apto bebidas calientes", "Pack x25 unidades"],
    price: 1780, icon: "CupSoda", stock: 180, unit: "x25u", featured: false, isNew: true, rating: 4.7,
  },
  {
    id: "4", slug: "pack-vasos-x100", name: "Pack vasos 300cc",
    category: "vasos", description: "Pack ahorro x100 unidades.",
    longDescription: "Pack ahorro de 100 vasos plásticos de 300cc, pensado para comercios y eventos de gran volumen. Mejor precio por unidad.",
    features: ["Capacidad 300cc", "Pack ahorro x100", "Precio mayorista", "PP cristal"],
    price: 1590, oldPrice: 1890, discount: 16, icon: "CupSoda", stock: 220, unit: "x100u", featured: false, rating: 4.9,
  },
  {
    id: "5", slug: "plato-playo-x25", name: "Plato plástico descartable playo",
    category: "platos", description: "Pack x25 unidades, 21cm de diámetro.",
    longDescription: "Plato playo descartable de 21cm, resistente y liviano. Apto para comidas frías y calientes de baja temperatura. Ideal para casa, oficina y eventos.",
    features: ["Diámetro 21cm", "Resistente", "Apto microondas (uso breve)", "Pack x25 unidades"],
    price: 980, icon: "Disc", stock: 410, unit: "x25u", featured: true, bestSeller: true, rating: 4.7,
  },
  {
    id: "6", slug: "plato-hondo-x25", name: "Plato plástico descartable hondo",
    category: "platos", description: "Pack x25 unidades, ideal para sopas y guisos.",
    longDescription: "Plato hondo descartable con buena capacidad, pensado para comidas con salsa, sopas y guisos. Base firme y bordes reforzados.",
    features: ["Capacidad ampliada", "Bordes reforzados", "Base antiderrame", "Pack x25 unidades"],
    price: 1050, icon: "Disc", stock: 260, unit: "x25u", featured: false, rating: 4.6,
  },
  {
    id: "7", slug: "plato-postre-x25", name: "Plato plástico descartable postre",
    category: "platos", description: "Pack x25 unidades, 15cm de diámetro.",
    longDescription: "Plato chico ideal para postres, entradas y bocadillos. Medida compacta que optimiza espacio en la mesa.",
    features: ["Diámetro 15cm", "Liviano", "Ideal cumpleaños", "Pack x25 unidades"],
    price: 720, icon: "Disc", stock: 300, unit: "x25u", featured: false, rating: 4.5,
  },
  {
    id: "8", slug: "cubiertos-combo-x50", name: "Cubiertos plásticos combo",
    category: "cubiertos", description: "Pack x50 (tenedor, cuchillo y cuchara).",
    longDescription: "Combo de cubiertos descartables: tenedores, cuchillos y cucharas en un mismo pack. Resistentes, no se quiebran con comidas firmes.",
    features: ["Incluye tenedor, cuchillo y cuchara", "Resistentes", "Pack x50 unidades", "Uso gastronómico"],
    price: 1150, icon: "Utensils", stock: 380, unit: "x50u", featured: true, bestSeller: true, rating: 4.8,
  },
  {
    id: "9", slug: "tenedor-x50", name: "Tenedor plástico descartable",
    category: "cubiertos", description: "Pack x50 unidades.",
    longDescription: "Tenedores plásticos descartables individuales, ideales para reponer stock específico sin comprar combos.",
    features: ["Pack x50 unidades", "Resistente", "Color blanco"],
    price: 480, icon: "Utensils", stock: 500, unit: "x50u", featured: false, rating: 4.5,
  },
  {
    id: "10", slug: "cuchara-postre-x50", name: "Cuchara de postre descartable",
    category: "cubiertos", description: "Pack x50 unidades, tamaño chico.",
    longDescription: "Cucharitas de postre ideales para helado, flan y dulces. Tamaño compacto y resistente.",
    features: ["Tamaño postre", "Pack x50 unidades", "Resistente"],
    price: 420, icon: "Utensils", stock: 420, unit: "x50u", featured: false, rating: 4.4,
  },
  {
    id: "11", slug: "envase-rectangular-tapa-x10", name: "Envase rectangular con tapa",
    category: "bandejas-envases", description: "Pack x10 unidades, apto vianda y freezer.",
    longDescription: "Envase rectangular con tapa hermética, apto para freezer y microondas. Ideal para viandas, delivery y conservación de alimentos.",
    features: ["Con tapa hermética", "Apto freezer y microondas", "Apto delivery", "Pack x10 unidades"],
    price: 2300, icon: "Package", stock: 190, unit: "x10u", featured: true, bestSeller: true, rating: 4.9,
  },
  {
    id: "12", slug: "bandeja-telgopor-x20", name: "Bandeja de telgopor",
    category: "bandejas-envases", description: "Pack x20 unidades, ideal carnicería.",
    longDescription: "Bandeja de telgopor liviana y resistente, ideal para carnicerías, verdulerías y fiambrerías.",
    features: ["Liviana", "Absorbente", "Uso comercial", "Pack x20 unidades"],
    price: 1340, icon: "Package", stock: 260, unit: "x20u", featured: false, rating: 4.6,
  },
  {
    id: "13", slug: "envase-redondo-sopa-x10", name: "Envase redondo para sopa",
    category: "bandejas-envases", description: "Pack x10 unidades, con tapa.",
    longDescription: "Envase redondo con tapa, ideal para sopas, guisos y comidas líquidas. Cierre seguro antiderrame.",
    features: ["Con tapa antiderrame", "Apto líquidos", "Pack x10 unidades"],
    price: 1980, icon: "Package", stock: 150, unit: "x10u", featured: false, isNew: true, rating: 4.7,
  },
  {
    id: "14", slug: "bolsa-camiseta-x100", name: "Bolsa camiseta",
    category: "bolsas", description: "Pack x100 unidades, medida comercio.",
    longDescription: "Bolsas camiseta reforzadas para comercios, kioscos y almacenes. Resistentes al peso y de fácil manipulación.",
    features: ["Reforzada", "Medida comercio", "Pack x100 unidades", "Ideal mostrador"],
    price: 1990, icon: "ShoppingBag", stock: 600, unit: "x100u", featured: true, bestSeller: true, rating: 4.8,
  },
  {
    id: "15", slug: "bolsa-residuo-negra-x20", name: "Bolsa de residuo negra",
    category: "bolsas", description: "Pack x20 unidades, 90x120cm.",
    longDescription: "Bolsas de residuo negras de alta resistencia, ideales para uso doméstico y comercial intensivo.",
    features: ["Medida 90x120cm", "Alta resistencia", "Pack x20 unidades"],
    price: 2150, icon: "ShoppingBag", stock: 340, unit: "x20u", featured: false, rating: 4.6,
  },
  {
    id: "16", slug: "bolsa-consorcio-reforzada-x10", name: "Bolsa consorcio reforzada",
    category: "bolsas", description: "Pack x10 unidades, extra resistente.",
    longDescription: "Bolsa de consorcio reforzada, pensada para grandes volúmenes de residuos en edificios y comercios.",
    features: ["Extra resistente", "Gran capacidad", "Pack x10 unidades"],
    price: 2680, icon: "ShoppingBag", stock: 210, unit: "x10u", featured: false, rating: 4.7,
  },
  {
    id: "17", slug: "film-pvc-300m", name: "Film PVC 300m",
    category: "film-envoltorios", description: "Rollo x1 unidad, uso profesional.",
    longDescription: "Film PVC de 300 metros para conservación de alimentos, apto uso doméstico y gastronómico intensivo.",
    features: ["300 metros", "Adherencia profesional", "Uso gastronómico", "1 unidad"],
    price: 2850, icon: "Layers", stock: 140, unit: "x1u", featured: true, bestSeller: true, rating: 4.8,
  },
  {
    id: "18", slug: "papel-aluminio-30m", name: "Papel aluminio 30m",
    category: "film-envoltorios", description: "Rollo x1 unidad.",
    longDescription: "Papel aluminio resistente para cocción y conservación. Ideal para hornear, envolver y conservar alimentos.",
    features: ["30 metros", "Resistente al calor", "1 unidad"],
    price: 1990, icon: "Layers", stock: 190, unit: "x1u", featured: false, rating: 4.6,
  },
  {
    id: "19", slug: "servilleta-cocktail-x50", name: "Servilleta cocktail",
    category: "servilletas", description: "Pack x50 unidades.",
    longDescription: "Servilletas de cocktail suaves y absorbentes, tamaño compacto ideal para eventos y bares.",
    features: ["Tamaño cocktail", "Absorbente", "Pack x50 unidades"],
    price: 640, icon: "StickyNote", stock: 480, unit: "x50u", featured: false, rating: 4.5,
  },
  {
    id: "20", slug: "servilleta-cenador-x100", name: "Servilleta cenador",
    category: "servilletas", description: "Pack x100 unidades.",
    longDescription: "Servilletas de cenador de doble hoja, resistentes y absorbentes. Ideales para restaurantes y comedores.",
    features: ["Doble hoja", "Alta absorción", "Pack x100 unidades"],
    price: 1290, icon: "StickyNote", stock: 320, unit: "x100u", featured: false, rating: 4.6,
  },
  {
    id: "21", slug: "pack-gastronomico", name: "Pack gastronómico completo",
    category: "gastronomia", description: "Platos, vasos, cubiertos y servilletas.",
    longDescription: "Combo pensado para comercios gastronómicos: incluye platos, vasos, cubiertos y servilletas en cantidades balanceadas para arrancar el día sin faltantes.",
    features: ["Incluye platos, vasos, cubiertos y servilletas", "Ahorro combinado", "Ideal locales gastronómicos"],
    price: 5950, oldPrice: 7000, discount: 15, icon: "ChefHat", stock: 90, unit: "combo", featured: true, bestSeller: true, rating: 4.9,
  },
  {
    id: "22", slug: "guantes-descartables-x100", name: "Guantes descartables",
    category: "gastronomia", description: "Pack x100 unidades, talle único.",
    longDescription: "Guantes descartables de polietileno para manipulación de alimentos, uso gastronómico y limpieza.",
    features: ["Talle único", "Uso alimentario", "Pack x100 unidades"],
    price: 1450, icon: "ChefHat", stock: 260, unit: "x100u", featured: false, rating: 4.5,
  },
  {
    id: "23", slug: "vela-cumpleanos-numero-x1", name: "Kit de vasos y platos temáticos",
    category: "eventos", description: "Pack x10 vasos + x10 platos temáticos.",
    longDescription: "Kit temático para cumpleaños con vasos y platos de diseño, ideal para darle color a la mesa sin perder practicidad.",
    features: ["Diseño temático", "Incluye vasos y platos", "Pack x10 c/u"],
    price: 2450, icon: "PartyPopper", stock: 130, unit: "kit", featured: false, isNew: true, rating: 4.7,
  },
  {
    id: "24", slug: "manteles-descartables-x10", name: "Mantel descartable",
    category: "eventos", description: "Pack x10 unidades, 1.20 x 1.80m.",
    longDescription: "Manteles descartables resistentes al agua, ideales para eventos, cumpleaños y celebraciones.",
    features: ["Medida 1.20 x 1.80m", "Resistente a líquidos", "Pack x10 unidades"],
    price: 1890, icon: "PartyPopper", stock: 160, unit: "x10u", featured: false, rating: 4.6,
  },
  {
    id: "25", slug: "rollo-cocina-x3", name: "Rollo de cocina absorbente",
    category: "limpieza", description: "Pack x3 unidades.",
    longDescription: "Rollo de cocina de alta absorción, resistente a la humedad. Ideal para uso doméstico y comercial.",
    features: ["Alta absorción", "Pack x3 unidades", "Uso diario"],
    price: 1590, icon: "SprayCan", stock: 300, unit: "x3u", featured: false, rating: 4.6,
  },
  {
    id: "26", slug: "trapo-piso-x1", name: "Trapo de piso descartable",
    category: "limpieza", description: "Pack x5 unidades.",
    longDescription: "Trapos de piso descartables de alta resistencia, ideales para limpieza rápida en comercios y hogares.",
    features: ["Alta resistencia", "Pack x5 unidades"],
    price: 990, icon: "SprayCan", stock: 220, unit: "x5u", featured: false, rating: 4.4,
  },
];

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function getRelatedProducts(product: Product, count = 4) {
  return products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, count);
}
