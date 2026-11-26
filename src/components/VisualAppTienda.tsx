"use client";

import { useEffect } from "react";
import { VISUAL_APP_SCRIPT, VISUAL_APP_TIENDA } from "@/lib/visual-app";

/**
 * La tienda de Visual App dentro de la página.
 *
 * El script de Visual App busca los `[data-visual-app]` una sola vez, cuando
 * se ejecuta. En una navegación interna de Next (ir a otra página y volver a
 * Productos) el script ya cargado no vería el div nuevo, así que se vuelve a
 * insertar cada vez que se monta este componente. No duplica nada: el script
 * marca cada div que ya armó (`data-va-montada`) y lo saltea.
 */
export default function VisualAppTienda() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = VISUAL_APP_SCRIPT;
    script.async = true;
    document.body.appendChild(script);
    return () => script.remove();
  }, []);

  return (
    <div
      data-visual-app={VISUAL_APP_TIENDA}
      // El verde de la marca (--green-primary) para botones y categorías.
      data-color="#0e653b"
      className="min-h-[60vh]"
    />
  );
}
