"use client";

import type { GeneratedImage } from "@/lib/types";

interface SingleViewProps {
  image: GeneratedImage;
  onBack: () => void;
  onInpaint: () => void;
}

export function SingleView({ image, onBack, onInpaint }: SingleViewProps) {
  return (
    <section className="rounded-xl border border-border bg-panel/70 p-4 backdrop-blur">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm uppercase tracking-wider text-slate-400">Single View</p>
        <button
          type="button"
          onClick={onBack}
          className="rounded border border-border px-2 py-1 text-xs text-slate-300 transition hover:border-slate-500"
        >
          Back to Grid
        </button>
      </div>
      <div className="aspect-[4/3] rounded-lg border border-border bg-cover bg-center" style={{ backgroundImage: `url(${image.url})` }} />
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className="rounded border border-border bg-surface px-3 py-1.5 text-xs text-slate-200">
          Upscale
        </button>
        <button type="button" className="rounded border border-border bg-surface px-3 py-1.5 text-xs text-slate-200">
          Variation
        </button>
        <button
          type="button"
          onClick={onInpaint}
          className="rounded border border-accent/70 bg-accent/20 px-3 py-1.5 text-xs text-accent"
        >
          Vary Region
        </button>
      </div>
    </section>
  );
}
