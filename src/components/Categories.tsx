import { getCategories } from "@/lib/data/products";
import CategoryCard from "./CategoryCard";
import SectionHeading from "./SectionHeading";

export default async function Categories() {
  const categories = await getCategories();
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
      <SectionHeading
        eyebrow="Catálogo"
        title="Categorías"
        subtitle="Encontrá lo que necesitás organizado por tipo de producto."
      />
      <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map((c) => (
          <CategoryCard key={c.slug} category={c} />
        ))}
      </div>
    </section>
  );
}
