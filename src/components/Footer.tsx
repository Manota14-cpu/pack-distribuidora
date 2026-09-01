import Link from "next/link";
import { MessageCircle, Mail, MapPin, Camera } from "lucide-react";
import { getCategories } from "@/lib/data/products";
import { HELP_LINKS, STORE_INFO } from "@/lib/content";
import Logo from "./Logo";

export default async function Footer() {
  const categories = await getCategories();
  return (
    <footer id="contacto" className="bg-[var(--green-primary)]">
      <div className="mx-auto max-w-7xl px-6 py-14 grid sm:grid-cols-2 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2">
          <Logo compact />
          <p className="mt-3 text-sm text-white/80 max-w-xs">
            Soluciones prácticas para el día a día.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a
              href="https://instagram.com/packdistribuidora.raf"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white hover:text-[var(--green-primary)] hover:scale-105 transition-all"
            >
              <Camera size={18} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-4 text-white">Navegación</h4>
          <ul className="flex flex-col gap-2.5 text-sm text-white/80">
            <li><Link href="/" className="transition-colors hover:text-white">Inicio</Link></li>
            <li><Link href="/productos" className="transition-colors hover:text-white">Productos</Link></li>
            <li><Link href="/productos?ofertas=1" className="transition-colors hover:text-white">Ofertas</Link></li>
            <li><Link href="/nosotros" className="transition-colors hover:text-white">Nosotros</Link></li>
            <li><Link href="/contacto" className="transition-colors hover:text-white">Contacto</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-4 text-white">Categorías</h4>
          <ul className="flex flex-col gap-2.5 text-sm text-white/80">
            {categories.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link href={`/productos?categoria=${c.slug}`} className="transition-colors hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-4 text-white">Ayuda</h4>
          <ul className="flex flex-col gap-2.5 text-sm text-white/80">
            {HELP_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-4 text-white">Contacto</h4>
          <ul className="flex flex-col gap-3 text-sm text-white/80">
            <li className="flex items-center gap-2">
              <MessageCircle size={15} className="text-white/70 shrink-0" />
              <a
                href={STORE_INFO.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                WhatsApp
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={15} className="text-white/70 shrink-0" />
              <a href={`mailto:${STORE_INFO.email}`} className="hover:text-white transition-colors">
                {STORE_INFO.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={15} className="text-white/70 shrink-0" /> {STORE_INFO.location}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="mx-auto max-w-7xl px-6 py-5 text-xs text-white/60 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} Pack Distribuidora. Todos los derechos reservados.</span>
          <span>Hecho para comercios y hogares de todo el país.</span>
        </div>
      </div>
    </footer>
  );
}
