"use client";

interface LoadingStateProps {
  prompt?: string;
}

export function LoadingState({ prompt }: LoadingStateProps) {
  return (
    <section className="rounded-xl border border-border bg-panel/70 p-8 backdrop-blur">
      <p className="mb-6 text-sm uppercase tracking-wider text-slate-400">Generating</p>
      <div className="mb-5 grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="aspect-square animate-pulse rounded-lg border border-border bg-gradient-to-br from-slate-800 to-slate-900"
          />
        ))}
      </div>
      <div className="h-2 w-full rounded bg-slate-800">
        <div className="h-2 w-1/2 animate-pulse rounded bg-accent" />
      </div>
      {prompt ? <p className="mt-4 text-sm text-slate-300">Prompt: {prompt}</p> : null}
    </section>
  );
}
