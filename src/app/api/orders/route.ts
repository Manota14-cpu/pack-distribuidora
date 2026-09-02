import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { checkoutOrderSchema, orderItemsSchema } from "@/lib/validation";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/db";

/**
 * Saca del error de Postgres la explicación legible.
 *
 * `ajustar_stock` levanta una excepción que nombra el producto y las
 * cantidades ("Stock insuficiente de «Film PVC»: hay 3 y se intentan sacar
 * 10"). Prisma la envuelve; sin desenvolverla, el cliente vería un error
 * genérico que no le dice qué renglón corregir.
 */
function mensajeDeStock(error: unknown): string | null {
  const partes: string[] = [];
  if (error instanceof Error) partes.push(error.message);
  const meta = (error as { meta?: unknown })?.meta;
  if (meta) partes.push(JSON.stringify(meta));

  const m = partes.join(" ").match(/Stock insuficiente de "[^"]*": hay \d+ y se intentan sacar \d+/);
  return m ? m[0] : null;
}

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

  let order: { number: number };
  try {
    order = await prisma.$transaction(async (tx) => {
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

      // El stock baja de verdad y deja su movimiento en el historial. Antes se
      // sumaba a `stockReserved`, una columna que no leía nadie: se vendía y el
      // número que veía el cliente seguía intacto.
      //
      // `ajustar_stock` bloquea la fila y falla si no alcanza, así que dos
      // pedidos simultáneos por la última unidad no pueden pasar los dos, y el
      // pedido entero se deshace con la transacción.
      for (const item of items) {
        if (!item.productId) continue;
        await tx.$queryRaw`
          select ajustar_stock(
            ${item.productId}::text,
            ${-item.quantity}::int,
            ${`Pedido #${created.number}`}::text,
            'venta'::text
          )
        `;
      }

      return created;
    });
  } catch (error) {
    const falta = mensajeDeStock(error);
    if (falta) {
      // 409: el pedido está bien armado; lo que cambió es la disponibilidad.
      return NextResponse.json(
        { error: `${falta}. Ajustá la cantidad y volvé a intentar.` },
        { status: 409 }
      );
    }
    console.error("[api:orders]", error);
    return NextResponse.json(
      { error: "No pudimos registrar el pedido. Probá de nuevo en un momento." },
      { status: 500 }
    );
  }

  // El stock que se muestra acaba de cambiar: sin esto, la página seguiría
  // ofreciendo unidades que este mismo pedido ya se llevó.
  revalidatePath("/");
  revalidatePath("/productos");

  return NextResponse.json({ ok: true, number: order.number }, { status: 201 });
}
