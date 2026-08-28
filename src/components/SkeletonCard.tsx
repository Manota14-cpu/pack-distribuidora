export default function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-2xl border border-[var(--gray)] bg-[var(--white)] overflow-hidden animate-pulse">
      <div className="aspect-square w-full bg-[var(--gray-light)]" />
      <div className="flex flex-col flex-1 px-4 pb-4 gap-2.5 pt-3">
        <div className="h-4 w-3/4 rounded bg-[var(--gray-light)]" />
        <div className="h-3 w-1/3 rounded bg-[var(--gray-light)]" />
        <div className="flex gap-1 mt-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-3 w-3 rounded bg-[var(--gray-light)]" />
          ))}
        </div>
        <div className="h-5 w-1/2 rounded bg-[var(--gray-light)] mt-1" />
        <div className="h-8 w-full rounded-full bg-[var(--gray-light)] mt-2" />
      </div>
    </div>
  );
}
