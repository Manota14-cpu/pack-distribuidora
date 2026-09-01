import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Category } from "@/lib/types";
import ProductVisual from "./ProductVisual";

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/productos?categoria=${category.slug}`}
      className="group flex flex-col rounded-2xl border border-[var(--gray)] bg-[var(--white)] p-4 transition-all duration-300 hover:border-transparent hover:shadow-[0_16px_34px_-14px_rgba(6,59,24,0.3)] hover:-translate-y-1"
    >
      <ProductVisual
        icon={category.icon}
        className="aspect-square w-full transition-transform duration-300 group-hover:scale-[1.03]"
        iconClassName="h-12 w-12"
      />
      <h3 className="font-display font-semibold text-sm mt-3">{category.name}</h3>
      <p className="text-xs text-[var(--text-muted)] mt-0.5 leading-snug">
        {category.description}
      </p>
      <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[var(--green-primary)] group-hover:gap-1.5 transition-all">
        Ver productos <ArrowRight size={13} />
      </span>
    </Link>
  );
}
