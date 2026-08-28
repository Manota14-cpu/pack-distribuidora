# Pack Distribuidora

E-commerce para la venta de descartables (vasos, platos, cubiertos, envases, bolsas, film, gastronomía y eventos), hecho con **Next.js 16 + React 19 + TypeScript + Tailwind CSS v4 + Prisma (SQLite)**.

## Requisitos

- Node.js 20 o superior
- npm

## Puesta en marcha

```bash
npm install

# crear la base SQLite y sembrarla con datos de ejemplo
npm run db:push
npm run db:seed

# desarrollo
npm run dev
```

Abrí http://localhost:3000

Build de producción:

```bash
npm run build
npm run start
```

## Configuración (.env)

Copiá las variables de `.env` (ya existe con valores locales para desarrollo):

| Variable | Uso |
| --- | --- |
| `DATABASE_URL` | Conexión a la base (por defecto SQLite `file:./dev.db`) |
| `ADMIN_PASSWORD` | Contraseña del panel de administración (ver `/admin/login`) |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 (opcional) |
| `MERCADOPAGO_*` / `RESEND_API_KEY` | Pendientes de integración (comentadas) |

## Qué incluye

- **Tienda**: home con hero, categorías, mayorista, destacados y newsletter; catálogo `/productos` con filtros (categoría, precio, ofertas, mayorista) y orden; detalle `/productos/[slug]` con galería, stock, cantidad y relacionados; carrito en drawer + página `/carrito` persistido en `localStorage`.
- **Checkout**: formulario que crea la orden en la base (`/api/orders`) y arma el envío por WhatsApp con el resumen del pedido.
- **Panel de admin** (`/admin`): protegido con login por contraseña (`ADMIN_PASSWORD`). Dashboard con métricas, alta/edición de productos, stock, etiquetas, precios mayoristas e imágenes. Los cambios revalidan la tienda al instante.
- **Formularios**: `/contacto` (guarda leads en `DB`) y newsletter (`/api/newsletter`).
- **Búsqueda**: `/api/search` con sugerencias en el header.
- **Analytics**: eventos `add_to_cart`, `begin_checkout` y `view_item` para GA4 (se activan configurando `NEXT_PUBLIC_GA_MEASUREMENT_ID`).
- **Imágenes**: `src/components/ProductImage.tsx` muestra fotos reales (`next/image`) cuando el producto tiene imágenes, con fallback a ícono ilustrado (`ProductVisual`). La galería del detalle es `ProductGallery`.

## Base de datos

Modelos en `prisma/schema.prisma`: `Category`, `Product`, `ProductImage`, `Lead`, `NewsletterSubscriber`, `Order`, `OrderItem`. La capa de datos vive en `src/lib/data/` y expone productos/categorías a la UI; la semilla con 26 productos está en `prisma/seed.ts`.

## Comandos útiles

```bash
npm run dev          # desarrollo
npm run build        # build de producción
npm run lint         # eslint
npm run typecheck    # tsc --noEmit
npm test             # tests unitarios (vitest)
npm run test:e2e     # tests e2e (Playwright, requiere DB sembrada + puerto 3000)
npm run db:push      # sincroniza el esquema con la base
npm run db:seed      # reinserta los datos de ejemplo
```

## Estructura

```
src/
  app/            # rutas (App Router), acciones de servidor y API routes
  components/     # componentes de UI y admin
  lib/            # datos (Prisma), utilidades, validación, analytics, carrito
prisma/           # schema + seed
e2e/              # tests de extremo a extremo (Playwright)
tests/            # tests unitarios (Vitest)
```

## Roadmap (fase 2/3)

- Panel de pedidos, mensajes de contacto y suscriptos del newsletter (los datos ya se persisten).
- Pago en línea (Mercado Pago) y email transaccional.
- Fotos reales de producto (el admin ya permite cargar URLs de imágenes).