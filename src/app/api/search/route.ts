import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { searchProducts } from "@/lib/data/products";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const querySchema = z.object({ q: z.string().trim().min(1).max(60) });

export async function GET(req: NextRequest) {
  const rl = rateLimit(`search:${clientIp(req.headers)}`, { limit: 60, windowSeconds: 60 });
  if (!rl.ok) {
    return NextResponse.json({ error: "Demasiadas consultas. Intentá de nuevo en unos segundos." }, { status: 429 });
  }

  const q = req.nextUrl.searchParams.get("q") ?? "";
  const parsed = querySchema.safeParse({ q });
  if (!parsed.success) {
    return NextResponse.json({ items: [] });
  }

  const items = await searchProducts(parsed.data.q, 5);
  return NextResponse.json(
    items.map((p) => ({ id: p.id, slug: p.slug, name: p.name, price: p.price }))
  );
}