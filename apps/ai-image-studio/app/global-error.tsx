"use client";

export default function GlobalError({ error, reset }: Readonly<{ error: Error; reset: () => void }>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-surface p-6 text-slate-100">
        <div className="max-w-md rounded-xl border border-border bg-panel/70 p-6 text-center backdrop-blur">
          <p className="text-xs uppercase tracking-wider text-slate-400">Something went wrong</p>
          <h1 className="mt-2 text-lg font-semibold">{error.message || "Unexpected error"}</h1>
          <button
            type="button"
            onClick={() => reset()}
            className="mt-4 rounded border border-accent/70 bg-accent/20 px-3 py-1.5 text-sm text-accent"
          >
            Retry
          </button>
        </div>
      </body>
    </html>
  );
}
