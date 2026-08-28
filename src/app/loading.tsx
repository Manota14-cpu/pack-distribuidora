export default function HomeLoading() {
  return (
    <div className="animate-pulse">
      <section className="relative bg-[var(--green-light)]">
        <div className="mx-auto max-w-7xl px-6 pt-14 pb-16 md:pt-20 md:pb-24 grid md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-4">
            <div className="h-6 w-36 rounded-full bg-[var(--white)]/50" />
            <div className="h-12 w-3/4 rounded bg-[var(--white)]/50" />
            <div className="h-5 w-2/3 rounded bg-[var(--white)]/50" />
            <div className="flex gap-3 mt-2">
              <div className="h-12 w-44 rounded-full bg-[var(--white)]/50" />
              <div className="h-12 w-36 rounded-full bg-[var(--white)]/50" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`aspect-square rounded-2xl bg-[var(--white)]/35 ${i === 1 || i === 2 ? "translate-y-6" : ""}`} />
            ))}
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="h-7 w-48 rounded bg-[var(--gray-light)] mx-auto" />
        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col rounded-2xl border border-[var(--gray)] bg-[var(--white)] overflow-hidden">
              <div className="aspect-square w-full bg-[var(--gray-light)]" />
              <div className="px-4 pb-4 pt-3 flex flex-col gap-2">
                <div className="h-4 w-3/4 rounded bg-[var(--gray-light)]" />
                <div className="h-5 w-1/2 rounded bg-[var(--gray-light)]" />
                <div className="h-8 w-full rounded-full bg-[var(--gray-light)]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
