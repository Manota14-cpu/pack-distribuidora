"use server";

import { revalidatePath } from "next/cache";
import { isAdminAuthed } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import {
  aplicarImportacion,
  descargarFeed,
  prepararImportacion,
  type ResultadoImportacion,
} from "@/lib/visual-app-sync";

export type EstadoImportacion =
  | { estado: "inicial" }
  | { estado: "error"; mensaje: string }
  | ({ estado: "ok" } & ResultadoImportacion);

export async function importarVisualAppAction(
  _prev: EstadoImportacion,
  formData: FormData
): Promise<EstadoImportacion> {
  // Una Server Action se puede llamar desde afuera de la página: el layout
  // protegido no alcanza, hay que revisar la sesión acá también.
  if (!(await isAdminAuthed())) {
    return { estado: "error", mensaje: "Tu sesión venció. Volvé a ingresar al panel." };
  }

  try {
    // El plan se vuelve a armar acá, con la lista y la base de este momento,
    // en vez de confiar en lo que mostraba la vista previa.
    const feed = await descargarFeed();
    const preparacion = await prepararImportacion(prisma, feed);
    const resultado = await aplicarImportacion(prisma, preparacion, {
      desactivarFaltantes: formData.get("desactivarFaltantes") === "on",
    });

    // Toda la tienda muestra productos (home, listado, fichas, sitemap).
    revalidatePath("/", "layout");
    return { estado: "ok", ...resultado };
  } catch (e) {
    console.error("[admin:importar]", e);
    return {
      estado: "error",
      mensaje: e instanceof Error ? e.message : "No se pudo importar. Probá de nuevo en un rato.",
    };
  }
}
