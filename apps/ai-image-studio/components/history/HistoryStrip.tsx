"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import type { GeneratedImage } from "@/lib/types";

interface HistoryStripProps {
  items: GeneratedImage[];
  onSelect: (image: GeneratedImage) => void;
}

export function HistoryStrip({ items, onSelect }: HistoryStripProps) {
  if (items.length === 0) return null;

  return (
    <footer className="animate-fade-up rounded-2xl border border-panel-border bg-panel/60 p-3 backdrop-blur-md">
      <div className="mb-2.5 flex items-center justify-between">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          Recent
        </h2>
        <span className="font-mono text-[10px] text-muted-foreground/50">
          {Math.min(items.length, 20)} saved · click to restore
        </span>
      </div>

      <ScrollArea className="w-full">
        <div className="flex gap-2 pb-1">
          {items.slice(0, 20).map((image, idx) => (
            <button
              key={image.id}
              type="button"
              onClick={() => onSelect(image)}
              title={image.prompt}
              className="group relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-panel-border bg-surface transition-all hover:border-studio-accent/60 hover:shadow-md hover:shadow-studio-accent/10"
              style={{ animationDelay: `${idx * 30}ms` }}
            >
              <img
                src={image.url}
                alt={image.prompt}
                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-110"
                loading="lazy"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-studio-accent/20 opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="h-1.5" />
      </ScrollArea>
    </footer>
  );
}
