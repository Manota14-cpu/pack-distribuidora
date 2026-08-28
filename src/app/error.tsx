"use client";

import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 mx-auto mb-6">
        <span className="text-2xl">!</span>
      </div>
      <h1 className="font-display text-2xl font-bold text-[var(--text)]">
        Algo salió mal
      </h1>
      <p className="mt-2 text-[var(--text-muted)] max-w-md mx-auto">
        Ocurrió un error inesperado. Por favor, intentá de nuevo o volvé al inicio.
      </p>
      {error.digest && (
        <p className="mt-3 text-xs text-[var(--text-muted)]">
          Error ID: {error.digest}
        </p>
      )}
      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          onClick={reset}
          className="rounded-full bg-[var(--green-primary)] text-white text-sm font-semibold px-6 py-3 hover:bg-[var(--green-primary-hover)] transition-colors"
        >
          Intentar de nuevo
        </button>
        <Link
          href="/"
          className="rounded-full border border-[var(--green-primary)] text-[var(--green-primary)] text-sm font-semibold px-6 py-3 hover:bg-[var(--green-primary)] hover:text-white transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
