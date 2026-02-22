"use client";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { GeneratedImage } from "@/lib/types";

interface SingleViewProps {
  image: GeneratedImage;
  onBack: () => void;
  onInpaint: () => void;
  onUpscale: (image: GeneratedImage) => void;
  onVariation: (image: GeneratedImage) => void;
}

/* Download icon */
const DownloadIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="shrink-0">
    <path d="M6.5 1v7M3.5 5.5l3 3 3-3M1.5 10.5h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* Chevron left */
const ChevronLeft = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
    <path d="M7.5 2L4 6l3.5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function SingleView({ image, onBack, onInpaint, onUpscale, onVariation }: SingleViewProps) {
  return (
    <TooltipProvider delayDuration={400}>
      <section className="animate-scale-in rounded-2xl border border-panel-border bg-panel/60 p-4 backdrop-blur-md">
        {/* Top bar */}
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 rounded-lg border border-panel-border px-2.5 py-1.5 text-xs text-muted-foreground transition hover:border-border hover:text-foreground"
          >
            <ChevronLeft />
            Back to Grid
          </button>
          <span className="font-mono text-[10px] text-muted-foreground/60">
            Single View
          </span>
        </div>

        {/* Image */}
        <div className="overflow-hidden rounded-xl border border-panel-border bg-surface/60">
          <img
            src={image.url}
            alt={image.prompt}
            className="max-h-[68vh] w-full object-contain"
          />
        </div>

        {/* Prompt */}
        <p className="mt-3 rounded-lg border border-panel-border bg-surface/50 px-3 py-2.5 text-sm leading-relaxed text-muted-foreground">
          {image.prompt}
        </p>

        {/* Actions */}
        <div className="mt-3 flex flex-wrap gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpscale(image)}
                className="border-panel-border bg-transparent text-xs text-muted-foreground hover:border-border hover:text-foreground"
              >
                Upscale
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              Enhance resolution with AI upscaling
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onVariation(image)}
                className="border-panel-border bg-transparent text-xs text-muted-foreground hover:border-border hover:text-foreground"
              >
                Variation
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              Generate 4 variations of this image
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                onClick={onInpaint}
                className="bg-studio-accent/15 text-studio-accent border border-studio-accent/40 text-xs hover:bg-studio-accent/25"
                variant="outline"
              >
                Vary Region
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              Paint a mask to edit a specific area
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href={image.url}
                download={`ai-image-${image.id}.png`}
                className="inline-flex items-center gap-1.5 rounded-md border border-panel-border bg-transparent px-3 py-1.5 text-xs text-muted-foreground transition hover:border-studio-emerald/50 hover:text-studio-emerald"
              >
                <DownloadIcon />
                Download
              </a>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              Save image to your device
            </TooltipContent>
          </Tooltip>
        </div>
      </section>
    </TooltipProvider>
  );
}
