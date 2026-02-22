"use client";

import type { GeneratedImage } from "@/lib/types";

interface HistoryStripProps {
  items: GeneratedImage[];
}

export function HistoryStrip({ items }: HistoryStripProps) {
  return (
    <footer className="rounded-xl border border-border bg-panel/70 p-3 backdrop-blur">
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-300">Recent</h2>
      {items.length === 0 ? (
        <p className="text-sm text-slate-400">Your creations will appear here.</p>
      ) : (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {items.slice(0, 10).map((image) => (
            <div
              key={image.id}
              className="h-14 w-14 shrink-0 rounded-md border border-border bg-surface bg-cover bg-center"
              style={{ backgroundImage: `url(${image.url})` }}
              title={image.prompt}
            />
          ))}
        </div>
      )}
    </footer>
  );
}
