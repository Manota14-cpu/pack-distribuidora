"use server";

import { revalidatePath } from "next/cache";
import { isAdminAuthed } from "@/lib/admin-auth";
import { borrarRestos, buscarRestos } from "@/lib/limpieza-base";

export type EstadoLimpieza =
  | { estado: "inicial" }
  | { estado: "error"; mensaje: string }
  | { estado: "ok"; borrados: number };

export async function borrarRestosAction(_prev: EstadoLimpieza, formData: FormData): Promise<EstadoLimpieza> {
  // Una Server Action se puede llamar desde afuera de la página: hay que
  // revisar la sesión acá también, no alcanza con el layout.
  if (!(await isAdminAuthed())) {
    return { estado: "error", mensaje: "Tu sesión venció. Volvé a ingresar al panel." };
  }
  if (String(formData.get("confirmacion") ?? "").trim().toUpperCase() !== "BORRAR") {
    return { estado: "error", mensaje: "Escribí BORRAR para confirmar." };
  }

  try {
    // La lista se vuelve a armar acá, con la base de este momento.
    const restos = await buscarRestos();
    if (restos.length) await borrarRestos(restos);
    revalidatePath("/admin", "layout");
    return { estado: "ok", borrados: restos.length };
  } catch (e) {
    console.error("[admin:limpiar]", e);
    return {
      estado: "error",
      mensaje: `No se pudo borrar. No se tocó nada. (${e instanceof Error ? e.message : "error desconocido"})`,
    };
  }
}
