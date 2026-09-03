export interface GuiaSeccion {
  heading: string;
  paragraphs: string[];
}

export interface Guia {
  slug: string;
  title: string;
  excerpt: string;
  readTime: string;
  secciones: GuiaSeccion[];
}

export const GUIAS: Guia[] = [
  {
    slug: "como-elegir-envase-para-delivery",
    title: "Cómo elegir el envase correcto para delivery",
    excerpt:
      "Qué mirar antes de elegir un envase para comida para llevar: hermeticidad, resistencia al calor y tamaño según el tipo de plato.",
    readTime: "4 min",
    secciones: [
      {
        heading: "Pensá primero en el tipo de comida",
        paragraphs: [
          "No es lo mismo envasar una sopa que una porción de pizza. Los líquidos y las comidas con salsa necesitan un envase con buen sellado en la tapa para evitar derrames durante el traslado; las comidas secas o crocantes (frituras, empanadas) se conservan mejor en envases con algo de ventilación, para que el vapor no las ablande en el camino.",
        ],
      },
      {
        heading: "Resistencia al calor y microondas",
        paragraphs: [
          "Si el cliente va a recalentar la comida en el mismo envase, conviene un envase apto microondas. No todos los plásticos lo son: los envases de PP (polipropileno) suelen resistir mejor el calor que otros plásticos más económicos, que pueden deformarse.",
        ],
      },
      {
        heading: "Elegí el tamaño según la porción, no al revés",
        paragraphs: [
          "Un envase demasiado grande hace que la comida se mueva y se desarme en el traslado; uno muy justo dificulta cerrarlo bien. Tené a mano más de un tamaño (chico, mediano, grande) para no forzar siempre la misma opción.",
          "Como referencia general: para porciones individuales de comida armada (viandas, platos únicos) suele alcanzar con un envase de 500 a 750 cc; para guarniciones o salsas aparte, uno chico de 250 cc evita que se mezclen sabores.",
        ],
      },
      {
        heading: "Tapa hermética vs. tapa simple",
        paragraphs: [
          "Para líquidos, salsas o cualquier cosa que viaje en una mochila o bolso de delivery, priorizá siempre una tapa con cierre hermético o a presión. Ahorra reclamos y devoluciones por derrames.",
        ],
      },
    ],
  },
  {
    slug: "cuanto-comprar-para-tu-evento",
    title: "Guía rápida: cuánto comprar para tu evento",
    excerpt:
      "Cantidades orientativas de vasos, platos, cubiertos y servilletas según la cantidad de invitados, para no quedarte corto ni comprar de más.",
    readTime: "3 min",
    secciones: [
      {
        heading: "Un cálculo simple por persona",
        paragraphs: [
          "Como punto de partida general para un evento de medio día (cumpleaños, reunión, evento social), estas cantidades por persona suelen funcionar bien: 2 vasos (uno se rompe, se pierde o se cambia de bebida), 1 plato principal, 1 set de cubiertos y 3 servilletas.",
          "Si el evento dura todo el día o incluye varias comidas (por ejemplo, un asado largo), conviene duplicar la cantidad de vasos y servilletas.",
        ],
      },
      {
        heading: "Sumá un margen extra",
        paragraphs: [
          "Siempre es preferible que sobren unidades a que falten a mitad de evento. Un margen del 10-15% sobre el cálculo por persona cubre imprevistos sin significar un gasto grande, sobre todo en productos económicos como vasos y servilletas.",
        ],
      },
      {
        heading: "Usá nuestra calculadora",
        paragraphs: [
          "Si querés que te armemos las cantidades automáticamente según tu número de invitados, podés usar nuestra calculadora de eventos y agregar todo al carrito de una vez.",
        ],
      },
    ],
  },
  {
    slug: "plastico-carton-o-biodegradable",
    title: "Plástico, cartón o biodegradable: cuál conviene según el uso",
    excerpt:
      "Diferencias prácticas entre los materiales más comunes de descartables y en qué situación rinde mejor cada uno.",
    readTime: "4 min",
    secciones: [
      {
        heading: "Plástico (PP/PS)",
        paragraphs: [
          "Es el material más resistente a líquidos y grasas, y en general el más económico. Funciona bien para comidas con salsa, bebidas frías y cualquier uso donde la resistencia al agua sea prioridad. Su punto débil es el calor: no todos los plásticos toleran microondas o líquidos muy calientes sin deformarse.",
        ],
      },
      {
        heading: "Cartón / papel encerado",
        paragraphs: [
          "Buena opción para alimentos secos o de temperatura media (sándwiches, panificados, porciones de torta). Es liviano y se percibe como una opción más prolija para eventos, aunque pierde resistencia si se moja o se satura de grasa por mucho tiempo.",
        ],
      },
      {
        heading: "Biodegradable / compostable",
        paragraphs: [
          "Pensado para reducir el impacto ambiental del descarte. Suele usarse en fibra de caña de azúcar (bagazo) o almidón de maíz, y tolera bien tanto líquidos como calor moderado. Es una buena alternativa cuando la sustentabilidad es parte de la propuesta del comercio, aunque normalmente tiene un costo algo mayor que el plástico convencional.",
        ],
      },
      {
        heading: "En la práctica",
        paragraphs: [
          "Muchos comercios combinan materiales según el producto: plástico para bebidas y comidas con salsa, cartón para panificados y biodegradable para diferenciarse en la propuesta. Si no estás seguro de qué combinación te conviene para tu rubro, escribinos y te asesoramos.",
        ],
      },
    ],
  },
];

export function getGuiaBySlug(slug: string): Guia | undefined {
  return GUIAS.find((g) => g.slug === slug);
}
