import { Truck, HeartHandshake, Tags, PackageCheck, Landmark, CreditCard, Banknote, Building2, Boxes, MapPin, ReceiptText } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const STORE_INFO = {
  name: "Pack Distribuidora",
  whatsapp: "https://wa.me/543492518311",
  whatsappDisplay: "+54 3492 51-8311",
  phone: "+54 3492 51-8311",
  email: "contacto@packdistribuidora.com.ar",
  location: "Rafaela, Santa Fe",
  country: "Argentina",
  hours: {
    weekdays: "Lunes a viernes: 8:00 – 18:00",
    saturday: "Sábados: 9:00 – 13:00",
    closed: "Domingos y feriados: cerrado",
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
      "Sí, el retiro es sin cargo en nuestro local de Rafaela, Santa Fe, de lunes a viernes de 8 a 18 y sábados de 9 a 13.",
  },
  {
    question: "¿Cómo hago para ser mayorista?",
    answer:
      "Escribinos por WhatsApp o por el formulario de contacto. Coordinamos precios por volumen, reposición programada de stock y facturación A.",
  },
];

export const HELP_LINKS = [
  { href: "/informacion-de-compra#faq", label: "Preguntas frecuentes" },
  { href: "/informacion-de-compra#envios", label: "Envíos" },
  { href: "/informacion-de-compra#devoluciones", label: "Cambios y devoluciones" },
  { href: "/informacion-de-compra#pagos", label: "Formas de pago" },
];

export const COMPANY_HISTORY =
  "Somos una distribuidora de descartables con foco en el buen servicio: surtido completo, stock permanente y atención directa con cada cliente.";

export const COMPANY_VALUES: TrustPoint[] = [
  { icon: Boxes, label: "Surtido siempre disponible" },
  { icon: ReceiptText, label: "Facturación clara y en tiempo" },
  { icon: MapPin, label: "Radicados en Rafaela, Santa Fe" },
  ...TRUST_POINTS,
];