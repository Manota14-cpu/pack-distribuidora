import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronRight, Clock, ArrowRight } from "lucide-react";
import { GUIAS, getGuiaBySlug } from "@/lib/guias-content";

export async function generateStaticParams() {
  return GUIAS.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guia = getGuiaBySlug(slug);
  if (!guia) return { title: "Guía no encontrada" };
  return {
    title: guia.title,
    description: guia.excerpt,
    alternates: { canonical: `/guias/${guia.slug}` },
  };
}

export default async function GuiaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guia = getGuiaBySlug(slug);
  if (!guia) notFound();

  const otras = GUIAS.filter((g) => g.slug !== guia.slug).slice(0, 2);

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <nav aria-label="Migas de pan" className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mb-6 flex-wrap">
        <Link href="/" className="hover:text-[var(--green-primary)]">Inicio</Link>
        <ChevronRight size={12} />
        <Link href="/guias" className="hover:text-[var(--green-primary)]">Guías</Link>
        <ChevronRight size={12} />
        <span className="text-[var(--text)]">{guia.title}</span>
      </nav>

      <span className="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
        <Clock size={13} />
        {guia.readTime} de lectura
      </span>
      <h1 className="font-display text-3xl font-bold mt-3 tracking-tight text-balance text-[var(--text)]">
        {guia.title}
      </h1>
      <p className="mt-3 text-[var(--text-muted)] leading-relaxed">{guia.excerpt}</p>

      <div className="tear-strip my-8" />

      <div className="flex flex-col gap-8">
        {guia.secciones.map((seccion) => (
          <div key={seccion.heading}>
            <h2 className="font-display text-lg font-bold text-[var(--text)] mb-2">
              {seccion.heading}
            </h2>
            {seccion.paragraphs.map((p, i) => (
              <p key={i} className="text-sm text-[var(--text-muted)] leading-relaxed mt-2">
                {p}
              </p>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl bg-[var(--gray-light)] p-6 text-center">
        <p className="text-sm text-[var(--text-muted)] mb-3">
          ¿Necesitás ayuda para elegir los productos justos para tu negocio o evento?
        </p>
        <Link
          href="/herramientas"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--green-primary)] hover:gap-2 transition-all"
        >
          Probá nuestras herramientas <ArrowRight size={15} />
        </Link>
      </div>

      {otras.length > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-lg font-bold text-[var(--text)] mb-4">
            Otras guías
          </h2>
          <div className="flex flex-col gap-3">
            {otras.map((g) => (
              <Link
                key={g.slug}
                href={`/guias/${g.slug}`}
                className="rounded-xl border border-[var(--gray)] px-4 py-3 text-sm font-medium hover:border-[var(--green-primary)]/40 transition-colors"
              >
                {g.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
