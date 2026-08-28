import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const rl = rateLimit(`contact:${clientIp(req.headers)}`, { limit: 5, windowSeconds: 60 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Demasiados mensajes. Esperá un momento e intentá de nuevo." },
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
  if (typeof data.honey === "string" && data.honey.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const parsed = contactSchema.safeParse(data);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { error: first?.message ?? "Datos inválidos." },
      { status: 400 }
    );
  }

  await prisma.lead.create({
    data: {
      nombre: parsed.data.nombre,
      email: parsed.data.email,
      telefono: parsed.data.telefono || null,
      asunto: parsed.data.asunto || null,
      mensaje: parsed.data.mensaje,
    },
  });

  return NextResponse.json({ ok: true });
}