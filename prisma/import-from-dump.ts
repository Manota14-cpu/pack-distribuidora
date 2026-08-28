import { PrismaClient } from "@prisma/client";
import { readFileSync } from "node:fs";
import type {
  Category,
  Lead,
  NewsletterSubscriber,
  Order,
  OrderItem,
  Product,
  ProductImage,
  Prisma,
} from "@prisma/client";

const prisma = new PrismaClient();

type Dump = {
  categories: Category[];
  products: Product[];
  productImages: ProductImage[];
  leads: Lead[];
  newsletterSubscribers: NewsletterSubscriber[];
  orders: Order[];
  orderItems: OrderItem[];
};

async function main() {
  const dump = JSON.parse(readFileSync("prisma/devdb-dump.json", "utf-8")) as Dump;

  await prisma.category.createMany({
    data: dump.categories as Prisma.CategoryCreateManyInput[],
    skipDuplicates: true,
  });
  console.log(`categories: ${dump.categories.length}`);

  await prisma.product.createMany({
    data: dump.products as Prisma.ProductCreateManyInput[],
    skipDuplicates: true,
  });
  console.log(`products: ${dump.products.length}`);

  await prisma.productImage.createMany({
    data: dump.productImages as Prisma.ProductImageCreateManyInput[],
    skipDuplicates: true,
  });
  console.log(`productImages: ${dump.productImages.length}`);

  await prisma.order.createMany({
    data: dump.orders as Prisma.OrderCreateManyInput[],
    skipDuplicates: true,
  });
  console.log(`orders: ${dump.orders.length}`);

  await prisma.orderItem.createMany({
    data: dump.orderItems as Prisma.OrderItemCreateManyInput[],
    skipDuplicates: true,
  });
  console.log(`orderItems: ${dump.orderItems.length}`);

  await prisma.lead.createMany({
    data: dump.leads as Prisma.LeadCreateManyInput[],
    skipDuplicates: true,
  });
  console.log(`leads: ${dump.leads.length}`);

  await prisma.newsletterSubscriber.createMany({
    data: dump.newsletterSubscribers as Prisma.NewsletterSubscriberCreateManyInput[],
    skipDuplicates: true,
  });
  console.log(`newsletterSubscribers: ${dump.newsletterSubscribers.length}`);

  console.log("Import done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });