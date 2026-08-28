import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getProductBySlug } from "@/lib/data/products";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const formatPrice = (value: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 2,
  }).format(value);

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [fontData, logoMark] = await Promise.all([
    readFile(
      join(
        process.cwd(),
        "node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff"
      )
    ),
    readFile(join(process.cwd(), "public/logos/logo-mark.svg")),
  ]);
  const logoDataUri = `data:image/svg+xml;base64,${logoMark.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0e653b",
          fontFamily: "Space Grotesk",
          color: "#ffffff",
          padding: 72,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoDataUri}
          alt=""
          width={96}
          height={96}
          style={{ marginRight: 48 }}
        />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 44,
              fontWeight: 700,
              lineHeight: 1.15,
              maxWidth: 760,
            }}
          >
            {product.name}
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 40,
              fontWeight: 700,
              color: "#c9f29b",
            }}
          >
            {formatPrice(product.price)}{" "}
            <span style={{ fontSize: 24, color: "rgba(255,255,255,0.8)" }}>
              {product.unit}
            </span>
          </div>
          <div
            style={{
              marginTop: 12,
              fontSize: 20,
              color: "rgba(255,255,255,0.7)",
            }}
          >
            Pack Distribuidora · Descartables para hogar, comercio y eventos
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Space Grotesk",
          data: fontData,
          weight: 700,
          style: "normal",
        },
      ],
    }
  );
}