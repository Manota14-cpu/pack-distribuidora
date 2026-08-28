import { PrismaClient } from "@prisma/client";
import { categories, products } from "../src/lib/products";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding categories...");
  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, icon: c.icon, description: c.description },
      create: { slug: c.slug, name: c.name, icon: c.icon, description: c.description },
    });
  }

  console.log("Seeding products...");
  for (const p of products) {
    const category = await prisma.category.findUnique({
      where: { slug: p.category },
    });
    if (!category) {
      console.warn(`  Skipping ${p.slug}: category ${p.category} not found`);
      continue;
    }
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        categoryId: category.id,
        description: p.description,
        longDescription: p.longDescription,
        features: JSON.stringify(p.features),
        price: p.price,
        oldPrice: p.oldPrice ?? null,
        discount: p.discount ?? null,
        stockAvailable: p.stock,
        unit: p.unit,
        featured: p.featured,
        bestSeller: p.bestSeller ?? false,
        isNew: p.isNew ?? false,
        rating: p.rating,
        icon: p.icon,
        active: true,
      },
      create: {
        slug: p.slug,
        name: p.name,
        categoryId: category.id,
        description: p.description,
        longDescription: p.longDescription,
        features: JSON.stringify(p.features),
        price: p.price,
        oldPrice: p.oldPrice ?? null,
        discount: p.discount ?? null,
        stockAvailable: p.stock,
        unit: p.unit,
        featured: p.featured,
        bestSeller: p.bestSeller ?? false,
        isNew: p.isNew ?? false,
        rating: p.rating,
        icon: p.icon,
        active: true,
      },
    });
  }

  const count = await prisma.product.count();
  console.log(`Done. ${count} products in DB.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });