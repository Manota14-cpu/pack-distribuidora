export default function ContactoLoading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 animate-pulse">
      <div className="text-center mb-12">
        <div className="h-10 w-48 rounded bg-[var(--gray-light)] mx-auto" />
        <div className="h-5 w-80 rounded bg-[var(--gray-light)] mx-auto mt-3" />
      </div>
      <div className="grid lg:grid-cols-[1fr_360px] gap-10">
        <div className="rounded-2xl border border-[var(--gray)] bg-[var(--white)] p-6 sm:p-8">
          <div className="flex flex-col gap-5">
            <div className="h-4 w-16 rounded bg-[var(--gray-light)]" />
            <div className="h-12 w-full rounded-xl bg-[var(--gray-light)]" />
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <div className="h-4 w-12 rounded bg-[var(--gray-light)] mb-1.5" />
                <div className="h-12 w-full rounded-xl bg-[var(--gray-light)]" />
              </div>
              <div>
                <div className="h-4 w-16 rounded bg-[var(--gray-light)] mb-1.5" />
                <div className="h-12 w-full rounded-xl bg-[var(--gray-light)]" />
              </div>
            </div>
            <div className="h-4 w-12 rounded bg-[var(--gray-light)]" />
            <div className="h-12 w-full rounded-xl bg-[var(--gray-light)]" />
            <div className="h-4 w-16 rounded bg-[var(--gray-light)]" />
            <div className="h-28 w-full rounded-xl bg-[var(--gray-light)]" />
            <div className="h-12 w-40 rounded-full bg-[var(--gray-light)]" />
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <div className="rounded-2xl border border-[var(--gray)] bg-[var(--white)] p-6 h-48" />
          <div className="rounded-2xl bg-[var(--green-primary)] p-6 h-40" />
          <div className="rounded-2xl border border-[var(--gray)] bg-[var(--white)] p-6 h-40" />
        </div>
      </div>
    </div>
  );
}
