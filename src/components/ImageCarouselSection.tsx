import fs from "node:fs";
import path from "node:path";
import ImageCarousel from "./ImageCarousel";

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"];

// Alt text descriptivo por archivo. Si sumás una foto nueva a public/imagenes
// y no la agregás acá, se usa un texto genérico derivado del nombre de archivo.
const ALT_OVERRIDES: Record<string, string> = {
  "pack-gastronomico.png": "Pack de productos descartables para gastronomía: vasos, platos y cubiertos",
};

export default function ImageCarouselSection() {
  const dir = path.join(process.cwd(), "public", "imagenes");

  let files: string[] = [];
  try {
    files = fs
      .readdirSync(dir)
      .filter((f) => IMAGE_EXTENSIONS.includes(path.extname(f).toLowerCase()))
      .sort();
  } catch {
    files = [];
  }

  if (files.length === 0) return null;

  const slides = files.map((f) => ({
    src: `/imagenes/${f}`,
    alt:
      ALT_OVERRIDES[f] ??
      `Productos Pack Distribuidora — ${path.basename(f, path.extname(f)).replace(/[-_]/g, " ")}`,
  }));

  return (
    <section className="py-16 md:py-20">
      <ImageCarousel slides={slides} />
    </section>
  );
}