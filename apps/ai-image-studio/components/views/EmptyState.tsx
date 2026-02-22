"use client";

import { useState } from "react";

interface EmptyStateProps {
  onSubmit: (prompt: string) => void;
}

const quickPrompts = [
  "Cinematic portrait with rim lighting",
  "Modern product shot on glossy background",
  "Surreal landscape with floating islands",
  "Editorial fashion scene in Tokyo at night"
];

export function EmptyState({ onSubmit }: EmptyStateProps) {
  const [prompt, setPrompt] = useState("");

  const submit = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      return;
    }
    onSubmit(trimmed);
  };

  return (
    <section className="flex h-full flex-col items-center justify-center rounded-xl border border-border bg-panel/70 p-8 text-center backdrop-blur">
      <p className="mb-3 text-sm uppercase tracking-widest text-slate-400">AI Image Studio</p>
      <h1 className="mb-6 text-3xl font-semibold">What will you create today?</h1>
      <div className="w-full max-w-xl space-y-4">
        <input
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              submit(prompt);
            }
          }}
          placeholder="Describe your image..."
          className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm outline-none transition focus:border-accent"
        />
        <button
          type="button"
          onClick={() => submit(prompt)}
          className="rounded-lg border border-accent/70 bg-accent/20 px-4 py-2 text-sm font-medium text-accent transition hover:bg-accent/30"
        >
          Generate
        </button>
        <div className="flex flex-wrap justify-center gap-2">
          {quickPrompts.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => submit(item)}
              className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-slate-300 transition hover:border-slate-500"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
