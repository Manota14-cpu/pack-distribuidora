import SkeletonCard from "@/components/SkeletonCard";

export default function ProductsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10 grid lg:grid-cols-[220px_1fr] gap-10 animate-pulse">
      <aside className="hidden lg:block">
        <div className="h-5 w-24 rounded bg-[var(--gray-light)] mb-4" />
        <div className="flex flex-col gap-3">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-4 w-full rounded bg-[var(--gray-light)]" />
          ))}
        </div>
        <div className="h-5 w-28 rounded bg-[var(--gray-light)] mt-6 mb-4" />
        <div className="h-3 w-full rounded bg-[var(--gray-light)]" />
      </aside>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="h-7 w-48 rounded bg-[var(--gray-light)]" />
            <div className="h-4 w-32 rounded bg-[var(--gray-light)] mt-2" />
          </div>
          <div className="h-10 w-40 rounded-full bg-[var(--gray-light)]" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
          {[...Array(8)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
