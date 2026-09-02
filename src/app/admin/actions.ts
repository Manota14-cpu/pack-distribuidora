"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { adminLoginSchema } from "@/lib/validation";
import {
  ADMIN_COOKIE,
  getAdminPassword,
  hashPassword,
  passwordMatches,
} from "@/lib/admin-auth";

export interface AdminActionState {
  error?: string;
}

// ---- Auth ----

export async function loginAction(
  _prev: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const password = String(formData.get("password") ?? "");
  const parsed = adminLoginSchema.safeParse({ password });
  const expected = getAdminPassword();

  if (!expected || !parsed.success || !passwordMatches(parsed.data.password, expected)) {
    return { error: "Contraseña incorrecta." };
  }

  const store = await cookies();
  store.set(ADMIN_COOKIE, hashPassword(parsed.data.password), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect("/admin");
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

// Las acciones de productos vivían acá. El catálogo y el stock ahora se
// administran desde AppPack, que trabaja sobre la misma tabla Product:
// tener dos editores era la vía segura para que los números se contradijeran.
