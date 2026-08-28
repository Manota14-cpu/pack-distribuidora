import { brandImageResponse } from "@/lib/og-image";

export const alt = "Pack Distribuidora — Descartables para hogar, comercio y eventos";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return brandImageResponse();
}