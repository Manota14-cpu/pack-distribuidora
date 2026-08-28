import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contactanos para consultas, pedidos mayoristas, envíos y más. Estamos en Rafaela, Santa Fe.",
  alternates: {
    canonical: "/contacto",
  },
  openGraph: {
    type: "website",
    url: "/contacto",
    title: "Contacto — Pack Distribuidora",
    description:
      "Contactanos para consultas, pedidos mayoristas, envíos y más. Estamos en Rafaela, Santa Fe.",
  },
  twitter: {
    title: "Contacto — Pack Distribuidora",
    description:
      "Contactanos para consultas, pedidos mayoristas, envíos y más. Estamos en Rafaela, Santa Fe.",
  },
};

export default function ContactoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
