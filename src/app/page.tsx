import Hero from "@/components/Hero";
import Beneficios from "@/components/Beneficios";
import HerramientasTeaser from "@/components/HerramientasTeaser";
import Wholesale from "@/components/Wholesale";
import Newsletter from "@/components/Newsletter";
import { STORE_INFO } from "@/lib/content";
import { getCatalogoSeguro } from "@/lib/catalogo-server";
import { CategoriasHome, DestacadosHome } from "@/components/tienda/SeccionesHome";

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: "Pack Distribuidora",
  description:
    "Vasos, platos, cubiertos, envases, bolsas y film descartables para hogar, comercio y eventos.",
  url: "https://packdistribuidora.com.ar",
  logo: "https://packdistribuidora.com.ar/logos/pack.png",
  image: "https://packdistribuidora.com.ar/logos/pack.png",
  sameAs: [STORE_INFO.whatsapp],
  priceRange: "$$",
  areaServed: "AR",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Rafaela",
    addressRegion: "Santa Fe",
    addressCountry: "AR",
  },
  makesOffer: {
    "@type": "Offer",
    itemOffered: {
      "@type": "Product",
      name: "Productos descartables para gastronomía",
    },
  },
};

// Los destacados y las categorías salen del catálogo de Visual App.
export const revalidate = 60;

export default async function Home() {
  const catalogo = await getCatalogoSeguro();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <Hero />
      <Beneficios />
      {catalogo && <CategoriasHome catalogo={catalogo} />}
      {catalogo && <DestacadosHome catalogo={catalogo} />}
      <HerramientasTeaser />
      <Wholesale />
      <Newsletter />
    </>
  );
}
