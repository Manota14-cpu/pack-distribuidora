import { Truck, HeartHandshake, Tags, PackageCheck, Landmark, CreditCard, Banknote, Building2, Boxes, MapPin, ReceiptText } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const STORE_INFO = {
  name: "Pack Distribuidora",
  whatsapp: "https://wa.me/543492518311",
  whatsappDisplay: "+54 3492 51-8311",
  phone: "+54 3492 51-8311",
  email: "packdistribuidora@gmail.com",
  instagram: "https://instagram.com/packdistribuidora.raf",
  instagramDisplay: "@packdistribuidora.raf",
  location: "Rafaela, Santa Fe",
  country: "Argentina",
  hours: {
    weekdays: "Lunes a viernes: 8:30 – 12:00 y 15:30 – 19:30",
    saturday: "Sábados: 9:00 – 12:00 y 16:00 – 20:00",
    sunday: "Domingos: 10:00 – 12:00",
  },
};

export interface TrustPoint {
  icon: LucideIcon;
  label: string;
}

export const TRUST_POINTS: TrustPoint[] = [
  { icon: Truck, label: "Envíos a todo el país" },
  { icon: HeartHandshake, label: "Atención personalizada" },
  { icon: Tags, label: "Precios mayoristas" },
  { icon: PackageCheck, label: "Stock permanente" },
];

export interface ShoppingStep {
  title: string;
  text: string;
}

export const SHOPPING_STEPS: ShoppingStep[] = [
  {
    title: "Sumá tus productos",
    text: "Elegí lo que necesitás y agregalo al carrito. Sin registración previa.",
  },
  {
    title: "Completá tus datos",
    text: "Cargá nombre, dirección y datos de contacto en el checkout.",
  },
  {
    title: "Enviá el pedido por WhatsApp",
    text: "Se abre WhatsApp con el resumen. Confirmás el mensaje y listo.",
  },
  {
    title: "Recibí tu compra",
    text: "Coordinamos el envío o el retiro y recibís todo en el día acordado.",
  },
];

export interface PaymentMethod {
  icon: LucideIcon;
  title: string;
  text: string;
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    icon: Banknote,
    title: "Efectivo",
    text: "Pago directo al recibir tu pedido, coordinado con anticipación.",
  },
  {
    icon: Landmark,
    title: "Transferencia bancaria",
    text: "Te pasamos nuestros datos bancarios y acreditás el pedido por transferencia.",
  },
  {
    icon: CreditCard,
    title: "Tarjetas de débito y crédito",
    text: "Próximamente. Estamos integrando nuevos medios de pago online (Mercado Pago).",
  },
  {
    icon: Building2,
    title: "Cuenta corriente (mayoristas)",
    text: "Para clientes mayoristas con facturación, coordinamos condiciones especiales.",
  },
];

export const SHIPPING_INFO = {
  coverage: "Enviamos a todo el país.",
  priorities: [
    "CABA, GBA y Santa Fe: entregas prioritarias y rápidas.",
    "Resto del país: envíos por transporte y correo.",
    "Retiro sin cargo en nuestro local de Rafaela, Santa Fe.",
  ],
  notes: [
    "Despachamos tu pedido en 24/48 hs hábiles.",
    "El costo de envío se coordina por WhatsApp según destino y volumen.",
    "Para compras mayoristas coordinamos logística especial.",
  ],
};

export const RETURN_POLICY = [
  "Podés cambiar o devolver un producto dentro de los 10 días corridos desde la compra.",
  "El producto debe estar en su envase original, sin abrir y en buen estado.",
  "Necesitás presentar el ticket o comprobante de la compra.",
  "Los cambios se coordinan por WhatsApp. Si es por defecto de fábrica, nos hacemos cargo del envío.",
];

export const FACTURACION = [
  "Factura B: consumidor final (minorista).",
  "Factura A: para responsables inscriptos, solicitándola al momento de la compra.",
  "Para clasificar tu facturación necesitamos tu CUIT y razón social (o datos) en el pedido.",
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "¿Hacen envíos a todo el país?",
    answer:
      "Sí, realizamos envíos a todo el país. Priorizamos CABA, GBA y Santa Fe con entregas rápidas; el resto se envía por transporte o correo. El costo y los tiempos se coordinan por WhatsApp.",
  },
  {
    question: "¿Cuánto tarda el despacho?",
    answer: "Despachamos tu pedido en 24/48 horas hábiles desde la confirmación.",
  },
  {
    question: "¿Cómo puedo pagar mi pedido?",
    answer:
      "Efectivo, transferencia bancaria o depósito. En compras mayoristas podemos coordinar cuenta corriente. Las tarjetas de débito y crédito están próximas a sumarse.",
  },
  {
    question: "¿Hay un mínimo de compra?",
    answer: "No tenemos mínimo de compra. Trabajamos tanto con minoristas como con mayoristas.",
  },
  {
    question: "¿Puedo retirar mi pedido en el local?",
    answer:
      "Sí, el retiro es sin cargo en nuestro local de Rafaela, Santa Fe, de lunes a viernes de 8:30 a 12 y de 15:30 a 19:30, sábados de 9 a 12 y de 16 a 20, y domingos de 10 a 12.",
  },
  {
    question: "¿Cómo hago para ser mayorista?",
    answer:
      "Escribinos por WhatsApp o por el formulario de contacto. Coordinamos precios por volumen y reposición programada de stock.",
  },
];

export const HELP_LINKS = [
  { href: "/preguntas-frecuentes", label: "Preguntas frecuentes" },
  { href: "/informacion-de-compra#envios", label: "Envíos" },
  { href: "/informacion-de-compra#devoluciones", label: "Cambios y devoluciones" },
  { href: "/informacion-de-compra#pagos", label: "Formas de pago" },
];

// ---- Preguntas frecuentes (envíos + registro mayorista) ----

export interface FaqMayoristaItem {
  id: string;
  question: string;
  answer: string;
  /** "mayorista" muestra el listado + formulario. "contacto" muestra los canales con íconos. */
  special?: "mayorista" | "contacto";
}

export const FAQ_MAYORISTA_ITEMS: FaqMayoristaItem[] = [
  {
    id: "envio-otra-provincia",
    question: "¿Puedo adquirir sus productos si vivo en otra provincia?",
    answer:
      "Por supuesto que se puede, podés abonar con cualquier medio de pago electrónico (tarjeta de débito, tarjeta de crédito u otros medios electrónicos). Se envía por Transporte Andreani.",
  },
  {
    id: "costo-envio",
    question: "¿Qué costo tiene el envío?",
    answer:
      "Dentro de la ciudad de Rafaela y alrededores, es sin cargo, con una compra mínima de $50.000. Envíos al resto del país se realizan por transporte a convenir, que cotiza en el momento de la compra.",
  },
  {
    id: "costo-envio-menor",
    question: "¿Qué costo tiene el envío si la compra es menor a $50.000?",
    answer:
      "Te podés comunicar con nosotros por mail a packdistribuidora@gmail.com, por Instagram @packdistribuidora.raf o por WhatsApp al +54 3492 51-8311, y te responderemos a la brevedad.",
    special: "contacto",
  },
  {
    id: "transporte",
    question: "¿Cuál es el transporte utilizado para el envío?",
    answer:
      "Dentro de la ciudad de Rafaela y alrededores utilizamos nuestro propio reparto. Al resto del país el transporte es a convenir.",
  },
  {
    id: "formas-plazos",
    question: "¿Cuáles son las formas de envío y plazos de entrega?",
    answer:
      "El plazo de entrega comienza a contar a partir de la validación del pago y varía de acuerdo con el producto adquirido, el método de pago utilizado y la dirección de entrega. El envío puede tardar entre 2 y 7 días hábiles aproximadamente. Al enviarse tu compra te llega un mail con el número de guía correspondiente. Los días feriados, sábados y/o de paro no son considerados días hábiles para los envíos. Al recibir tu compra asegurate de que el embalaje no esté adulterado ni roto.",
  },
  {
    id: "requisitos-mayorista",
    question: "¿Cuáles son los requisitos para compra mayorista?",
    answer:
      "Contar con CUIT activo y condición fiscal de Responsable Inscripto o Monotributista. Compra mínima inicial de $150.000. Compra mínima en pedidos siguientes de $80.000. Registrate completando el formulario para que te contactemos.",
    special: "mayorista",
  },
];

export const MAYORISTA_REQUISITOS = [
  "Contar con CUIT activo y condición fiscal de Responsable Inscripto o Monotributista.",
  "Compra mínima inicial de $150.000.",
  "Compra mínima en pedidos siguientes de $80.000.",
  "Registrarte completando el formulario que aparece más abajo.",
];

export const COMPANY_HISTORY =
  "Somos una distribuidora de descartables con foco en el buen servicio: surtido completo, stock permanente y atención directa con cada cliente.";

export const COMPANY_VALUES: TrustPoint[] = [
  { icon: Boxes, label: "Surtido siempre disponible" },
  { icon: ReceiptText, label: "Facturación clara y en tiempo" },
  { icon: MapPin, label: "Radicados en Rafaela, Santa Fe" },
  ...TRUST_POINTS,
];