interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

function sweep() {
  if (buckets.size < 1000) return;
  const now = Date.now();
  for (const [key, b] of buckets) {
    if (b.resetAt <= now) buckets.delete(key);
  }
}

export function rateLimit(
  key: string,
  { limit = 10, windowSeconds = 60 }: { limit?: number; windowSeconds?: number } = {}
): { ok: boolean; remaining: number; retryAfterSeconds?: number } {
  sweep();
  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || entry.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return { ok: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return {
      ok: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  entry.count += 1;
  return { ok: true, remaining: limit - entry.count };
}

export function clientIp(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "unknown";
}