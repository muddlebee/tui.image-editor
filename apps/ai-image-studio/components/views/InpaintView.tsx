"use client";

interface InpaintViewProps {
  onCancel: () => void;
  onApply: () => void;
}

export function InpaintView({ onCancel, onApply }: InpaintViewProps) {
  return (
    <section className="rounded-xl border border-border bg-panel/80 p-5 backdrop-blur">
      <p className="mb-3 text-sm uppercase tracking-wider text-slate-400">Inpaint Mode</p>
      <div className="mb-4 aspect-[4/3] rounded-lg border border-border bg-gradient-to-br from-slate-900 to-slate-800 p-3">
        <div className="flex h-full items-center justify-center rounded border border-dashed border-rose-400/60 bg-rose-400/10 text-sm text-rose-200">
          Mask overlay placeholder
        </div>
      </div>
      <div className="mb-4 flex flex-wrap gap-2 text-xs">
        <span className="rounded border border-border bg-surface px-2 py-1">Brush</span>
        <span className="rounded border border-border bg-surface px-2 py-1">Eraser</span>
        <span className="rounded border border-border bg-surface px-2 py-1">Size</span>
        <span className="rounded border border-border bg-surface px-2 py-1">Undo</span>
        <span className="rounded border border-border bg-surface px-2 py-1">Clear</span>
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={onCancel} className="rounded border border-border px-3 py-1.5 text-xs text-slate-300">
          Cancel
        </button>
        <button type="button" onClick={onApply} className="rounded border border-accent bg-accent/20 px-3 py-1.5 text-xs text-accent">
          Apply
        </button>
      </div>
    </section>
  );
}
