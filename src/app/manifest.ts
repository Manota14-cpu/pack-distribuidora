import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pack Distribuidora — Descartables para hogar, comercio y eventos",
    short_name: "Pack Distribuidora",
    description:
      "Vasos, platos, cubiertos, envases, bolsas y film descartables para hogar, comercio y eventos. Atención minorista y mayorista.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0e653b",
    icons: [
      {
        src: "/logos/logo-mark.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/logos/pack.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}