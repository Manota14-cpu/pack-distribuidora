"use client";

export default function ContactoError({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 mx-auto mb-6">
        <span className="text-2xl">!</span>
      </div>
      <h1 className="font-display text-2xl font-bold text-[var(--text)]">
        Error al cargar contacto
      </h1>
      <p className="mt-2 text-[var(--text-muted)] max-w-md mx-auto">
        No pudimos cargar la página de contacto. Intentá de nuevo más tarde.
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-full bg-[var(--green-primary)] text-white text-sm font-semibold px-6 py-3 hover:bg-[var(--green-primary-hover)] transition-colors"
      >
        Reintentar
      </button>
    </div>
  );
}
