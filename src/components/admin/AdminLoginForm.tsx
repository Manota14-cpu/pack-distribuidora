"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/admin/actions";

const INPUT =
  "w-full rounded-xl border border-[var(--gray)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--green-primary)] transition-colors";

export default function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, { error: undefined });

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {state.error}
        </p>
      )}
      <div>
        <label htmlFor="admin-password" className="block text-sm font-medium mb-1.5">
          Contraseña
        </label>
        <input
          id="admin-password"
          type="password"
          name="password"
          required
          autoFocus
          placeholder="••••••••"
          className={INPUT}
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-[var(--green-primary)] text-white text-sm font-semibold py-3 hover:bg-[var(--green-primary-hover)] disabled:opacity-60 transition-colors"
      >
        {pending ? "Ingresando…" : "Ingresar"}
      </button>
    </form>
  );
}