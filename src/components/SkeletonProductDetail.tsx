export default function SkeletonProductDetail() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8 animate-pulse">
      <div className="flex items-center gap-2 mb-6">
        <div className="h-3 w-12 rounded bg-[var(--gray-light)]" />
        <div className="h-3 w-3 rounded bg-[var(--gray-light)]" />
        <div className="h-3 w-16 rounded bg-[var(--gray-light)]" />
      </div>
      <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
        <div>
          <div className="aspect-square w-full rounded-2xl bg-[var(--gray-light)]" />
          <div className="grid grid-cols-4 gap-3 mt-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square rounded-xl bg-[var(--gray-light)]" />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="h-6 w-24 rounded-full bg-[var(--gray-light)]" />
          <div className="h-8 w-3/4 rounded bg-[var(--gray-light)]" />
          <div className="h-4 w-16 rounded bg-[var(--gray-light)]" />
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 w-4 rounded bg-[var(--gray-light)]" />
            ))}
          </div>
          <div className="h-10 w-1/2 rounded bg-[var(--gray-light)] mt-2" />
          <div className="h-4 w-32 rounded bg-[var(--gray-light)]" />
          <div className="flex flex-col gap-2 mt-2">
            <div className="h-4 w-full rounded bg-[var(--gray-light)]" />
            <div className="h-4 w-5/6 rounded bg-[var(--gray-light)]" />
            <div className="h-4 w-2/3 rounded bg-[var(--gray-light)]" />
          </div>
          <div className="flex gap-3 mt-4">
            <div className="h-12 flex-1 rounded-full bg-[var(--gray-light)]" />
            <div className="h-12 flex-1 rounded-full bg-[var(--gray-light)]" />
          </div>
        </div>
      </div>
    </div>
  );
}
