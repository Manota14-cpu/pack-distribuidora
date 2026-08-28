import fs from "node:fs";
import path from "node:path";
import ImageCarousel from "./ImageCarousel";

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"];

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
    alt: `Fotografía ${path.basename(f, path.extname(f)).replace(/[-_]/g, " ")}`,
  }));

  return (
    <section className="py-16 md:py-20">
      <ImageCarousel slides={slides} />
    </section>
  );
}