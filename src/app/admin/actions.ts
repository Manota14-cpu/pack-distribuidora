"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { adminLoginSchema, adminProductSchema } from "@/lib/validation";
import {
  ADMIN_COOKIE,
  getAdminPassword,
  hashPassword,
  isAdminAuthed,
  passwordMatches,
} from "@/lib/admin-auth";

export interface AdminActionState {
  error?: string;
}

async function requireAdmin() {
  if (!(await isAdminAuthed())) redirect("/admin/login");
}

function revalidateStore() {
  revalidatePath("/", "layout");
  revalidatePath("/productos");
  revalidatePath("/productos/[slug]");
  revalidatePath("/sitemap.xml");
}

function formToObject(formData: FormData): Record<string, string> {
  const obj: Record<string, string> = {};
  formData.forEach((value, key) => {
    obj[key] = String(value);
  });
  return obj;
}

// ---- Auth ----

export async function loginAction(
  _prev: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const password = String(formData.get("password") ?? "");
  const parsed = adminLoginSchema.safeParse({ password });
  const expected = getAdminPassword();

  if (!expected || !parsed.success || !passwordMatches(parsed.data.password, expected)) {
    return { error: "Contraseña incorrecta." };
  }

  const store = await cookies();
  store.set(ADMIN_COOKIE, hashPassword(parsed.data.password), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect("/admin");
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

// ---- Productos ----

export async function createProductAction(
  _prev: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  await requireAdmin();
  const parsed = adminProductSchema.safeParse(formToObject(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }
  const data = parsed.data;

  const category = await prisma.category.findUnique({ where: { slug: data.categorySlug } });
  if (!category) return { error: "Categoría inexistente." };

  const exists = await prisma.product.findUnique({ where: { slug: data.slug } });
  if (exists) return { error: "Ya existe un producto con ese slug." };

  const imageData = data.imageUrls.map((url, i) => ({
    url,
    alt: data.imageAlts[i] ?? null,
    sortOrder: i,
  }));

  await prisma.product.create({
    data: {
      slug: data.slug,
      name: data.name,
      categoryId: category.id,
      description: data.description,
      longDescription: data.longDescription,
      features: JSON.stringify(data.features),
      price: data.price,
      oldPrice: data.oldPrice ?? null,
      discount: data.discount ?? null,
      stockAvailable: data.stock,
      unit: data.unit,
      sku: data.sku ?? null,
      barcode: data.barcode ?? null,
      weightGrams: data.weightGrams ?? null,
      dimensions: data.dimensions ?? null,
      minWholesaleQty: data.minWholesaleQty ?? null,
      wholesalePrice: data.wholesalePrice ?? null,
      metaTitle: data.metaTitle ?? null,
      metaDescription: data.metaDescription ?? null,
      icon: data.icon,
      featured: data.featured,
      bestSeller: data.bestSeller,
      isNew: data.isNew,
      active: data.active,
      images: imageData.length ? { create: imageData } : undefined,
    },
  });

  revalidateStore();
  redirect("/admin/productos?msg=creado");
}

export async function updateProductAction(
  _prev: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Falta el id del producto." };

  const parsed = adminProductSchema.safeParse(formToObject(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }
  const data = parsed.data;

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return { error: "Producto no encontrado." };

  const category = await prisma.category.findUnique({ where: { slug: data.categorySlug } });
  if (!category) return { error: "Categoría inexistente." };

  const slugTaken = await prisma.product.findFirst({
    where: { slug: data.slug, NOT: { id } },
  });
  if (slugTaken) return { error: "Ya existe un producto con ese slug." };

  const imageData = data.imageUrls.map((url, i) => ({
    url,
    alt: data.imageAlts[i] ?? null,
    sortOrder: i,
  }));

  await prisma.$transaction(async (tx) => {
    await tx.productImage.deleteMany({ where: { productId: id } });
    if (imageData.length) {
      await tx.productImage.createMany({
        data: imageData.map((img) => ({ ...img, productId: id })),
      });
    }
    await tx.product.update({
      where: { id },
      data: {
        slug: data.slug,
        name: data.name,
        categoryId: category.id,
        description: data.description,
        longDescription: data.longDescription,
        features: JSON.stringify(data.features),
        price: data.price,
        oldPrice: data.oldPrice ?? null,
        discount: data.discount ?? null,
        stockAvailable: data.stock,
        unit: data.unit,
        sku: data.sku ?? null,
        barcode: data.barcode ?? null,
        weightGrams: data.weightGrams ?? null,
        dimensions: data.dimensions ?? null,
        minWholesaleQty: data.minWholesaleQty ?? null,
        wholesalePrice: data.wholesalePrice ?? null,
        metaTitle: data.metaTitle ?? null,
        metaDescription: data.metaDescription ?? null,
        icon: data.icon,
        featured: data.featured,
        bestSeller: data.bestSeller,
        isNew: data.isNew,
        active: data.active,
      },
    });
  });

  revalidateStore();
  redirect(`/admin/productos/${id}?msg=guardado`);
}

export async function setProductActiveAction(id: string, active: boolean) {
  await requireAdmin();
  await prisma.product.update({ where: { id }, data: { active } });
  revalidateStore();
}

export async function deleteProductAction(id: string) {
  await requireAdmin();
  await prisma.product.delete({ where: { id } }).catch(() => {});
  revalidateStore();
}