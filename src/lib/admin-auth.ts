import { cookies } from "next/headers";
import { createHash, timingSafeEqual } from "crypto";

export const ADMIN_COOKIE = "admin_session";

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "";
}

export function hashPassword(pw: string): string {
  return createHash("sha256").update(pw).digest("hex");
}

export function passwordMatches(input: string, expected: string): boolean {
  if (!expected) return false;
  const a = Buffer.from(hashPassword(input), "utf8");
  const b = Buffer.from(hashPassword(expected), "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function cookieMatches(input: string | undefined, expected: string): boolean {
  if (!input || !expected) return false;
  const a = Buffer.from(input, "utf8");
  const b = Buffer.from(hashPassword(expected), "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function isAdminAuthed(): Promise<boolean> {
  const expected = getAdminPassword();
  if (!expected) return false;
  const store = await cookies();
  return cookieMatches(store.get(ADMIN_COOKIE)?.value, expected);
}