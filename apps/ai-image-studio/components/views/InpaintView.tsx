"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";

interface InpaintViewProps {
  imageUrl: string;
  onCancel: () => void;
  onApply: () => void;
}

interface Stroke {
  x: number;
  y: number;
  r: number;
}

type ToolMode = "brush" | "eraser";

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export function InpaintView({ imageUrl, onCancel, onApply }: InpaintViewProps) {
  const areaRef = useRef<HTMLDivElement>(null);
  const [tool, setTool] = useState<ToolMode>("brush");
  const [brushSize, setBrushSize] = useState(34);
  const [painting, setPainting] = useState(false);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [cursor, setCursor] = useState<{ x: number; y: number; visible: boolean }>({
    x: 0,
    y: 0,
    visible: false
  });
  const [areaSize, setAreaSize] = useState({ width: 1, height: 1 });

  useEffect(() => {
    const update = () => {
      const rect = areaRef.current?.getBoundingClientRect();
      if (!rect) return;
      setAreaSize({ width: rect.width, height: rect.height });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const toLocalPoint = (clientX: number, clientY: number) => {
    const rect = areaRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return {
      x: clamp(clientX - rect.left, 0, rect.width),
      y: clamp(clientY - rect.top, 0, rect.height)
    };
  };

  const drawAt = (clientX: number, clientY: number) => {
    const point = toLocalPoint(clientX, clientY);
    if (!point) return;

    setCursor({ x: point.x, y: point.y, visible: true });
    if (!painting) return;

    if (tool === "eraser") {
      setStrokes((prev) =>
        prev.filter((s) => Math.hypot(s.x - point.x, s.y - point.y) > brushSize * 1.1)
      );
      return;
    }

    setStrokes((prev) => [...prev, { ...point, r: brushSize / 2 }]);
  };

  const hasMask = useMemo(() => strokes.length > 0, [strokes]);

  return (
    <section className="rounded-2xl border border-panel-border bg-panel/60 p-5 backdrop-blur-md">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Inpaint Mode
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground/60">
            Paint a mask over the area you want to edit
          </p>
        </div>
        {hasMask && (
          <span className="rounded-full border border-studio-rose/40 bg-studio-rose/10 px-2.5 py-1 font-mono text-[10px] text-studio-rose">
            {strokes.length} strokes
          </span>
        )}
      </div>

      {/* Canvas area */}
      <div
        ref={areaRef}
        className="relative mb-4 overflow-hidden rounded-xl border border-panel-border bg-surface/60"
        style={{ aspectRatio: "4 / 3", cursor: "none" }}
        onPointerDown={(e) => {
          setPainting(true);
          drawAt(e.clientX, e.clientY);
        }}
        onPointerMove={(e) => drawAt(e.clientX, e.clientY)}
        onPointerUp={() => setPainting(false)}
        onPointerLeave={() => {
          setPainting(false);
          setCursor((prev) => ({ ...prev, visible: false }));
        }}
      >
        <img src={imageUrl} alt="Inpaint target" className="h-full w-full object-cover" />

        {/* Mask strokes */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox={`0 0 ${areaSize.width} ${areaSize.height}`}
          preserveAspectRatio="none"
        >
          {strokes.map((stroke, index) => (
            <circle
              key={`${stroke.x}-${stroke.y}-${index}`}
              cx={stroke.x}
              cy={stroke.y}
              r={stroke.r}
              fill="rgba(244, 63, 94, 0.38)"
            />
          ))}
        </svg>

        {/* Custom brush cursor */}
        {cursor.visible && (
          <div
            className={`pointer-events-none absolute rounded-full border-2 transition-none ${
              tool === "brush"
                ? "border-studio-rose bg-studio-rose/15"
                : "border-white/60 bg-white/8"
            }`}
            style={{
              width: `${brushSize}px`,
              height: `${brushSize}px`,
              left: `${cursor.x - brushSize / 2}px`,
              top: `${cursor.y - brushSize / 2}px`
            }}
          />
        )}

        {/* Hint badge */}
        {!hasMask && (
          <div className="absolute left-3 top-3 rounded-lg border border-panel-border/60 bg-surface/80 px-2.5 py-1.5 text-xs text-muted-foreground backdrop-blur-sm">
            Click and drag to paint mask
          </div>
        )}
      </div>

      {/* Tool controls */}
      <div className="mb-4 rounded-xl border border-panel-border bg-surface/40 p-3">
        {/* Tool buttons */}
        <div className="mb-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setTool("brush")}
            className={`rounded-lg border px-3 py-1.5 text-xs transition ${
              tool === "brush"
                ? "border-studio-accent bg-studio-accent/15 text-studio-accent"
                : "border-panel-border text-muted-foreground hover:border-border"
            }`}
          >
            Brush
          </button>
          <button
            type="button"
            onClick={() => setTool("eraser")}
            className={`rounded-lg border px-3 py-1.5 text-xs transition ${
              tool === "eraser"
                ? "border-studio-accent bg-studio-accent/15 text-studio-accent"
                : "border-panel-border text-muted-foreground hover:border-border"
            }`}
          >
            Eraser
          </button>

          <Separator orientation="vertical" className="h-7 bg-panel-border" />

          <button
            type="button"
            onClick={() => setStrokes((prev) => prev.slice(0, -1))}
            disabled={strokes.length === 0}
            className="rounded-lg border border-panel-border px-3 py-1.5 text-xs text-muted-foreground transition hover:border-border disabled:opacity-40"
          >
            Undo
          </button>
          <button
            type="button"
            onClick={() => setStrokes([])}
            disabled={strokes.length === 0}
            className="rounded-lg border border-panel-border px-3 py-1.5 text-xs text-muted-foreground transition hover:border-studio-rose/50 hover:text-studio-rose disabled:opacity-40"
          >
            Clear
          </button>
        </div>

        {/* Brush size */}
        <div className="flex items-center gap-3">
          <span className="w-8 font-mono text-[10px] text-muted-foreground">Size</span>
          <Slider
            min={10}
            max={90}
            step={2}
            value={[brushSize]}
            onValueChange={([val]) => setBrushSize(val)}
            className="flex-1"
          />
          <span className="w-10 text-right font-mono text-[10px] text-muted-foreground">
            {brushSize}px
          </span>
        </div>
      </div>

      {/* Apply / Cancel */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onCancel}
          className="border-panel-border bg-transparent text-xs text-muted-foreground hover:border-border"
        >
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={onApply}
          disabled={!hasMask}
          className="bg-studio-accent text-xs text-white hover:bg-studio-accent/90 disabled:opacity-40"
        >
          Apply Mask
        </Button>
      </div>
    </section>
  );
}
