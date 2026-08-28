import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const FONT_PATH = join(
  process.cwd(),
  "node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff"
);
const LOGO_PATH = join(process.cwd(), "public/logos/logo-mark.svg");

type BrandImageOptions = {
  title?: string;
  subtitle?: string;
};

export async function brandImageResponse({
  title = "Pack Distribuidora",
  subtitle = "Descartables para hogar, comercio y eventos",
}: BrandImageOptions = {}) {
  const [fontData, logoMark] = await Promise.all([
    readFile(FONT_PATH),
    readFile(LOGO_PATH),
  ]);
  const logoDataUri = `data:image/svg+xml;base64,${logoMark.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0e653b",
          fontFamily: "Space Grotesk",
          color: "#ffffff",
          padding: 64,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoDataUri}
          alt=""
          width={112}
          height={112}
          style={{ marginBottom: 24 }}
        />
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          {title}
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 28,
            fontWeight: 600,
            color: "rgba(255,255,255,0.85)",
            textAlign: "center",
          }}
        >
          {subtitle}
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