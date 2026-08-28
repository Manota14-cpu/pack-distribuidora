import SkeletonCard from "./SkeletonCard";

export default function FeaturedProductsSkeleton() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-2">
          <div className="h-3 w-24 rounded bg-[var(--gray-light)] animate-pulse" />
          <div className="h-7 w-48 rounded bg-[var(--gray-light)] animate-pulse" />
          <div className="h-4 w-64 rounded bg-[var(--gray-light)] animate-pulse" />
        </div>
      </div>
      <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
        {[...Array(8)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </section>
  );
}
