"use client";

import type { GeneratedImage } from "@/lib/types";

interface GridViewProps {
  images: GeneratedImage[];
  onSelect: (imageId: string) => void;
}

export function GridView({ images, onSelect }: GridViewProps) {
  return (
    <section className="rounded-xl border border-border bg-panel/70 p-4 backdrop-blur">
      <p className="mb-3 text-sm uppercase tracking-wider text-slate-400">Grid View</p>
      <div className="grid grid-cols-2 gap-3">
        {images.map((image, idx) => (
          <button
            key={image.id}
            type="button"
            onClick={() => onSelect(image.id)}
            className="group rounded-lg border border-border bg-surface text-left transition hover:border-accent/60"
          >
            <div className="aspect-square rounded-t-lg bg-cover bg-center" style={{ backgroundImage: `url(${image.url})` }} />
            <div className="flex items-center justify-between px-3 py-2 text-xs text-slate-300">
              <span>Image {idx + 1}</span>
              <span className="space-x-1">
                <span className="rounded border border-border px-1 py-0.5">U{idx + 1}</span>
                <span className="rounded border border-border px-1 py-0.5">V{idx + 1}</span>
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
