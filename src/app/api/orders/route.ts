import { NextRequest, NextResponse } from "next/server";
import { checkoutOrderSchema, orderItemsSchema } from "@/lib/validation";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const rl = rateLimit(`orders:${clientIp(req.headers)}`, { limit: 10, windowSeconds: 60 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Demasiados pedidos. Esperá un momento e intentá de nuevo." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido." }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  const parsedOrder = checkoutOrderSchema.safeParse(data);
  if (!parsedOrder.success) {
    const first = parsedOrder.error.issues[0];
    return NextResponse.json(
      { error: first?.message ?? "Datos del pedido inválidos." },
      { status: 400 }
    );
  }

  const parsedItems = orderItemsSchema.safeParse(data.items);
  if (!parsedItems.success) {
    return NextResponse.json({ error: "El carrito está vacío o es inválido." }, { status: 400 });
  }

  const items = parsedItems.data;
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const order = await prisma.$transaction(async (tx) => {
    const maxNumber = (await tx.order.aggregate({ _max: { number: true } }))._max.number ?? 0;
    const created = await tx.order.create({
      data: {
        number: maxNumber + 1,
        channel: "whatsapp",
        status: "pendiente",
        tipoCliente: parsedOrder.data.tipoCliente,
        nombre: parsedOrder.data.nombre,
        razonSocial: parsedOrder.data.razonSocial || null,
        dniCuit: parsedOrder.data.dniCuit,
        requiereFactura: parsedOrder.data.requiereFactura,
        telefono: parsedOrder.data.telefono,
        email: parsedOrder.data.email || null,
        direccion: parsedOrder.data.direccion,
        localidad: parsedOrder.data.localidad,
        provincia: parsedOrder.data.provincia,
        notas: parsedOrder.data.notas || null,
        total,
        items: {
          create: items.map((i) => ({
            productId: i.productId ?? null,
            name: i.name,
            unit: i.unit,
            price: i.price,
            quantity: i.quantity,
          })),
        },
      },
    });

    // Reserve stock so the same stock is not sold twice
    for (const item of items.filter((i) => i.productId)) {
      await tx.product.updateMany({
        where: { id: item.productId },
        data: { stockReserved: { increment: item.quantity } },
      });
    }

    return created;
  });

  return NextResponse.json({ ok: true, number: order.number }, { status: 201 });
}