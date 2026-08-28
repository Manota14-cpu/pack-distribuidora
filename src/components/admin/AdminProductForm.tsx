"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { AdminActionState } from "@/app/admin/actions";

export interface AdminProductInitial {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  longDescription: string;
  features: string;
  price: number;
  oldPrice: number | null;
  discount: number | null;
  stock: number;
  unit: string;
  sku: string | null;
  barcode: string | null;
  weightGrams: number | null;
  dimensions: string | null;
  minWholesaleQty: number | null;
  wholesalePrice: number | null;
  metaTitle: string | null;
  metaDescription: string | null;
  icon: string;
  featured: boolean;
  bestSeller: boolean;
  isNew: boolean;
  active: boolean;
  imageUrls: string;
  imageAlts: string;
}

export interface AdminProductFormProps {
  categories: { slug: string; name: string }[];
  initial?: AdminProductInitial | null;
  action: (prev: AdminActionState, formData: FormData) => Promise<AdminActionState>;
}

const INPUT =
  "w-full rounded-xl border border-[var(--gray)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--green-primary)] transition-colors";
const LABEL = "block text-sm font-medium mb-1.5";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className={LABEL}>
        {label}
      </label>
      {children}
    </div>
  );
}

export default function AdminProductForm({ categories, initial, action }: AdminProductFormProps) {
  const [state, formAction, pending] = useActionState(action, { error: undefined });

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {initial && <input type="hidden" name="id" value={initial.id} />}

      {state.error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {state.error}
        </p>
      )}

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Nombre *" htmlFor="f-name">
          <input id="f-name" name="name" required defaultValue={initial?.name} className={INPUT} />
        </Field>
        <Field label="Slug * (solo minúsculas y guiones)" htmlFor="f-slug">
          <input
            id="f-slug"
            name="slug"
            required
            pattern="[a-z0-9-]+"
            defaultValue={initial?.slug}
            className={INPUT}
          />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Categoría *" htmlFor="f-category">
          <select id="f-category" name="categorySlug" required defaultValue={initial?.category} className={INPUT}>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Unidad * (ej: x50u)" htmlFor="f-unit">
          <input id="f-unit" name="unit" required defaultValue={initial?.unit} className={INPUT} />
        </Field>
      </div>

      <Field label="Descripción corta *" htmlFor="f-description">
        <input
          id="f-description"
          name="description"
          required
          defaultValue={initial?.description}
          className={INPUT}
        />
      </Field>

      <Field label="Descripción larga *" htmlFor="f-long">
        <textarea
          id="f-long"
          name="longDescription"
          required
          rows={4}
          defaultValue={initial?.longDescription}
          className={`${INPUT} resize-none`}
        />
      </Field>

      <Field label="Características (una por línea)" htmlFor="f-features">
        <textarea
          id="f-features"
          name="features"
          rows={4}
          defaultValue={initial?.features}
          className={`${INPUT} resize-none`}
        />
      </Field>

      <div className="grid sm:grid-cols-3 gap-5">
        <Field label="Precio * (ARS)" htmlFor="f-price">
          <input id="f-price" name="price" type="number" min={0} required defaultValue={initial?.price} className={INPUT} />
        </Field>
        <Field label="Precio anterior" htmlFor="f-oldprice">
          <input
            id="f-oldprice"
            name="oldPrice"
            type="number"
            min={0}
            defaultValue={initial?.oldPrice ?? ""}
            className={INPUT}
          />
        </Field>
        <Field label="Descuento (%)" htmlFor="f-discount">
          <input
            id="f-discount"
            name="discount"
            type="number"
            min={0}
            max={99}
            defaultValue={initial?.discount ?? ""}
            className={INPUT}
          />
        </Field>
      </div>

      <div className="grid sm:grid-cols-3 gap-5">
        <Field label="Stock disponible *" htmlFor="f-stock">
          <input id="f-stock" name="stock" type="number" min={0} required defaultValue={initial?.stock} className={INPUT} />
        </Field>
        <Field label="Peso (gramos)" htmlFor="f-weight">
          <input id="f-weight" name="weightGrams" type="number" min={0} defaultValue={initial?.weightGrams ?? ""} className={INPUT} />
        </Field>
        <Field label="Dimensiones (ej: 30x20x10)" htmlFor="f-dims">
          <input id="f-dims" name="dimensions" defaultValue={initial?.dimensions ?? ""} className={INPUT} />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="SKU" htmlFor="f-sku">
          <input id="f-sku" name="sku" defaultValue={initial?.sku ?? ""} className={INPUT} />
        </Field>
        <Field label="Código de barras" htmlFor="f-barcode">
          <input id="f-barcode" name="barcode" defaultValue={initial?.barcode ?? ""} className={INPUT} />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Cantidad mínima mayorista" htmlFor="f-minqty">
          <input id="f-minqty" name="minWholesaleQty" type="number" min={0} defaultValue={initial?.minWholesaleQty ?? ""} className={INPUT} />
        </Field>
        <Field label="Precio mayorista (ARS)" htmlFor="f-wholesale">
          <input id="f-wholesale" name="wholesalePrice" type="number" min={0} defaultValue={initial?.wholesalePrice ?? ""} className={INPUT} />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Meta título (SEO)" htmlFor="f-meta-title">
          <input id="f-meta-title" name="metaTitle" defaultValue={initial?.metaTitle ?? ""} className={INPUT} />
        </Field>
        <Field label="Meta descripción (SEO)" htmlFor="f-meta-desc">
          <input id="f-meta-desc" name="metaDescription" defaultValue={initial?.metaDescription ?? ""} className={INPUT} />
        </Field>
      </div>

      <Field label="URLs de imágenes (una por línea)" htmlFor="f-images">
        <textarea id="f-images" name="imageUrls" rows={3} defaultValue={initial?.imageUrls} className={`${INPUT} resize-none`} />
      </Field>

      <Field label="Alt de cada imagen (una por línea, en el mismo orden)" htmlFor="f-imagealts">
        <textarea id="f-imagealts" name="imageAlts" rows={3} defaultValue={initial?.imageAlts} className={`${INPUT} resize-none`} />
      </Field>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Icono fallback (lucide)" htmlFor="f-icon">
          <input
            id="f-icon"
            name="icon"
            defaultValue={initial?.icon ?? "Package"}
            className={INPUT}
            placeholder="Package, CupSoda, Disc…"
          />
        </Field>
      </div>

      <div className="flex flex-wrap gap-6 rounded-2xl border border-[var(--gray)] bg-[var(--gray-light)] p-5">
        {(
          [
            ["featured", "Destacado", initial?.featured ?? false],
            ["bestSeller", "Más vendido", initial?.bestSeller ?? false],
            ["isNew", "Nuevo", initial?.isNew ?? false],
            ["active", "Publicado", initial?.active ?? true],
          ] as const
        ).map(([name, label, checked]) => (
          <label key={name} className="flex items-center gap-2 text-sm font-medium cursor-pointer">
            <input
              type="checkbox"
              name={name}
              value="1"
              defaultChecked={checked}
              className="h-4 w-4 rounded accent-[var(--green-primary)]"
            />
            {label}
          </label>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-[var(--green-primary)] text-white text-sm font-semibold px-7 py-3 hover:bg-[var(--green-primary-hover)] disabled:opacity-60 transition-colors"
        >
          {pending ? "Guardando…" : initial ? "Guardar cambios" : "Crear producto"}
        </button>
        <Link
          href="/admin/productos"
          className="text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--green-primary)] transition-colors"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}