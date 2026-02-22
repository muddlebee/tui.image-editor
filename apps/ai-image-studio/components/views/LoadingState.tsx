"use client";

import { useEffect, useState } from "react";

interface LoadingStateProps {
  prompt?: string;
}

const PROGRESS_STEPS = [
  { target: 18, delay: 0 },
  { target: 42, delay: 400 },
  { target: 65, delay: 900 },
  { target: 82, delay: 1600 },
  { target: 91, delay: 2200 }
];

export function LoadingState({ prompt }: LoadingStateProps) {
  const [progress, setProgress] = useState(4);

  useEffect(() => {
    setProgress(4);
    const timers: number[] = [];

    PROGRESS_STEPS.forEach(({ target, delay }) => {
      const t = window.setTimeout(() => {
        setProgress(target);
      }, delay);
      timers.push(t);
    });

    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [prompt]);

  return (
    <section className="rounded-2xl border border-panel-border bg-panel/60 p-6 backdrop-blur-md md:p-8">
      {/* Header */}
      <div className="mb-6">
        <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          Generating
        </p>
        <h2 className="font-display text-xl font-600 text-foreground">
          Crafting your image set
        </h2>
        {prompt && (
          <p className="mt-2 line-clamp-1 text-sm text-muted-foreground">
            &ldquo;{prompt}&rdquo;
          </p>
        )}
      </div>

      {/* Shimmer skeleton grid */}
      <div className="mb-6 grid grid-cols-2 gap-3 stagger-children">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="animate-scale-in relative overflow-hidden rounded-xl border border-panel-border bg-surface/80"
            style={{ aspectRatio: "1 / 1" }}
          >
            <div className="shimmer-bg absolute inset-0" />
            {/* Corner label */}
            <div className="absolute left-2 top-2 rounded border border-panel-border/60 bg-surface/60 px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground/60 backdrop-blur-sm">
              {idx + 1} / 4
            </div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Model is generating options&hellip;</span>
          <span className="font-mono tabular-nums">{progress}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface">
          <div
            className="h-full rounded-full bg-studio-accent transition-[width] duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </section>
  );
}
