import type { MetadataRoute } from "next";
import { getPublicProductSlugs } from "@/lib/data/products";
import { GUIAS } from "@/lib/guias-content";

const BASE_URL = "https://packdistribuidora.com.ar";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/productos`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/nosotros`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/informacion-de-compra`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/preguntas-frecuentes`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/herramientas`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/guias`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/contacto`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];

  const guiaPages: MetadataRoute.Sitemap = GUIAS.map((g) => ({
    url: `${BASE_URL}/guias/${g.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  let productSlugs: string[] = [];
  try {
    productSlugs = await getPublicProductSlugs();
  } catch {
    productSlugs = [];
  }

  const productPages: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: `${BASE_URL}/productos/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticPages, ...guiaPages, ...productPages];
}