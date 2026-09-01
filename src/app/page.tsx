import Hero from "@/components/Hero";
import PromoCarousel from "@/components/PromoCarousel";
import TrustBanner from "@/components/TrustBanner";
import Categories from "@/components/Categories";
import Wholesale from "@/components/Wholesale";
import FeaturedOffer from "@/components/FeaturedOffer";
import FeaturedProducts from "@/components/FeaturedProducts";
import ImageCarouselSection from "@/components/ImageCarouselSection";
import Newsletter from "@/components/Newsletter";

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: "Pack Distribuidora",
  description:
    "Vasos, platos, cubiertos, envases, bolsas y film descartables para hogar, comercio y eventos.",
  url: "https://packdistribuidora.com.ar",
  logo: "https://packdistribuidora.com.ar/logos/pack.png",
  image: "https://packdistribuidora.com.ar/logos/pack.png",
  sameAs: ["https://wa.me/543492518311"],
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

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <PromoCarousel />
      <Hero />
      <TrustBanner />
      <Categories />
      <Wholesale />
      <FeaturedOffer />
      <FeaturedProducts />
      <ImageCarouselSection />
      <Newsletter />
    </>
  );
}
