"use client";

import type { GeneratedImage } from "@/lib/types";

interface GridViewProps {
  images: GeneratedImage[];
  onSelect: (imageId: string) => void;
  onUpscale: (image: GeneratedImage) => void;
  onVariation: (image: GeneratedImage) => void;
}

export function GridView({ images, onSelect, onUpscale, onVariation }: GridViewProps) {
  return (
    <section className="rounded-2xl border border-panel-border bg-panel/60 p-4 backdrop-blur-md">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Grid View
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground/60">
            {images.length} image{images.length !== 1 ? "s" : ""} · hover to interact
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 stagger-children">
        {images.map((image, idx) => (
          <article
            key={image.id}
            className="animate-scale-in group relative cursor-pointer overflow-hidden rounded-xl border border-panel-border bg-surface transition-all duration-200 hover:border-studio-accent/50 hover:shadow-lg hover:shadow-studio-accent/8"
          >
            <img
              src={image.url}
              alt={image.prompt}
              className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              loading="lazy"
            />

            {/* Hover overlay */}
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <div className="p-3">
                <p className="mb-2.5 line-clamp-2 text-xs leading-relaxed text-white/85">
                  {image.prompt}
                </p>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onUpscale(image); }}
                    className="rounded-lg border border-white/20 bg-white/15 py-1.5 text-[11px] font-500 text-white backdrop-blur-sm transition hover:bg-white/25"
                  >
                    U{idx + 1}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onVariation(image); }}
                    className="rounded-lg border border-white/20 bg-white/15 py-1.5 text-[11px] font-500 text-white backdrop-blur-sm transition hover:bg-white/25"
                  >
                    V{idx + 1}
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelect(image.id)}
                    className="rounded-lg border border-studio-accent/70 bg-studio-accent/80 py-1.5 text-[11px] font-600 text-white backdrop-blur-sm transition hover:bg-studio-accent"
                  >
                    Open
                  </button>
                </div>
              </div>
            </div>

            {/* Index badge */}
            <div className="absolute left-2 top-2 rounded border border-white/10 bg-black/50 px-1.5 py-0.5 font-mono text-[9px] text-white/60 backdrop-blur-sm transition group-hover:opacity-0">
              {idx + 1}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
