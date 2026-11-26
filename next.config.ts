import type { NextConfig } from "next";

const production = process.env.NODE_ENV === "production";

// La tienda pide el catálogo y manda pedidos y arrepentimientos a Visual App
// desde el navegador. Sin este origen en connect-src, en producción el
// buscador y el checkout no andan.
const VISUAL_APP = "https://visual-app-licencias.visual-app-licencias.workers.dev";

const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https: http:",
  "font-src 'self' data:",
  `connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com ${VISUAL_APP}`,
  "frame-src 'self'",
  "worker-src 'self' blob:",
].join("; ");

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
  async headers() {
    if (!production) return [];
    return [
      {
        source: "/:path*",
        headers: [{ key: "Content-Security-Policy", value: csp }],
      },
    ];
  },
};

export default nextConfig;