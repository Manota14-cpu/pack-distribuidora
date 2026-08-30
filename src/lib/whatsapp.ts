export interface CheckoutFormData {
  tipoCliente: "minorista" | "mayorista";
  nombre: string;
  razonSocial: string;
  dniCuit: string;
  requiereFactura: boolean;
  telefono: string;
  email: string;
  direccion: string;
  localidad: string;
  provincia: string;
  notas: string;
}

export interface WhatsappLineItem {
  product: { name: string; price: number; unit: string };
  quantity: number;
}

export const WHATSAPP_NUMBER = "543492518311";

export function buildWhatsAppMessage(
  data: CheckoutFormData,
  items: WhatsappLineItem[],
  subtotal: number
): string {
  const lines: string[] = [
    "🛒 *Nuevo pedido — Pack Distribuidora*",
    "",
    "👤 *Datos del cliente*",
    `• Tipo de cliente: ${data.tipoCliente === "mayorista" ? "Mayorista" : "Minorista"}`,
    `• Nombre y apellido: ${data.nombre}`,
  ];
  if (data.razonSocial) lines.push(`• Razón social: ${data.razonSocial}`);
  lines.push(`• DNI/CUIT: ${data.dniCuit}`);
  lines.push(`• Requiere factura: ${data.requiereFactura ? "Sí" : "No"}`);
  lines.push(
    `• Teléfono: ${data.telefono}`,
    `• Email: ${data.email}`,
    `• Dirección: ${data.direccion}`,
    `• Localidad: ${data.localidad}, ${data.provincia}`
  );
  if (data.notas) lines.push(`• Notas: ${data.notas}`);
  lines.push("", "📦 *Detalle del pedido*");
  for (const item of items) {
    lines.push(
      `• ${item.product.name} (${item.product.unit}) x${item.quantity} — $${(item.product.price * item.quantity).toLocaleString("es-AR")}`
    );
  }
  lines.push(
    "",
    `💰 *Subtotal: $${subtotal.toLocaleString("es-AR")}*`,
    "📝 Envío: A coordinar",
    "",
    "Gracias por tu compra 🙌"
  );
  return encodeURIComponent(lines.join("\n"));
}