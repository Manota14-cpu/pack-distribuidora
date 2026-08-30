import type { Metadata, Viewport } from "next";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import "@fontsource/manrope/800.css";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { CheckoutProvider } from "@/components/CheckoutForm";
import { getCategories } from "@/lib/data/products";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";

export const metadata: Metadata = {
  title: {
    default: "Pack Distribuidora — Soluciones prácticas para el día a día",
    template: "%s — Pack Distribuidora",
  },
  description:
    "Vasos, platos, cubiertos, envases, bolsas y film descartables para hogar, comercio y eventos. Atención minorista y mayorista, envíos a todo el país.",
  metadataBase: new URL("https://packdistribuidora.com.ar"),
  applicationName: "Pack Distribuidora",
  category: "shopping",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Pack Distribuidora",
    url: "/",
    title: "Pack Distribuidora — Soluciones prácticas para el día a día",
    description:
      "Vasos, platos, cubiertos, envases, bolsas y film descartables para hogar, comercio y eventos.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pack Distribuidora — Soluciones prácticas para el día a día",
    description:
      "Vasos, platos, cubiertos, envases, bolsas y film descartables para hogar, comercio y eventos.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/logos/logo-mark.svg",
    apple: "/logos/pack.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0e653b",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const categories = await getCategories();
  return (
    <html lang="es" className="h-full antialiased" data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col bg-[var(--white)] text-[var(--text)]">
        <CartProvider>
          <CheckoutProvider>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-full focus:bg-[var(--green-primary)] focus:text-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
            >
              Saltar al contenido
            </a>
            <Header categories={categories} />
            <main id="main-content" className="flex-1">{children}</main>
            <Footer />
            <Analytics />
          </CheckoutProvider>
        </CartProvider>
      </body>
    </html>
  );
}
