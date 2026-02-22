"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onSubmit: (prompt: string) => void;
}

const quickPrompts = [
  "Cinematic portrait with rim lighting",
  "Modern product shot on glossy surface",
  "Surreal landscape with floating islands",
  "Editorial fashion scene in Tokyo at night",
  "Abstract geometric art, deep indigo palette",
  "Minimal architecture, golden hour"
];

export function EmptyState({ onSubmit }: EmptyStateProps) {
  const [prompt, setPrompt] = useState("");

  const submit = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  };

  return (
    <section className="relative overflow-hidden rounded-2xl border border-panel-border bg-panel/60 backdrop-blur-md">
      {/* Ambient glow blobs */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-studio-accent/10 blur-[80px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-studio-emerald/6 blur-[80px]" />

      <div className="relative px-8 py-16 md:px-16 md:py-20">
        {/* Eyebrow */}
        <p
          className="animate-fade-up mb-4 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground"
          style={{ animationDelay: "0ms" }}
        >
          AI Image Studio
        </p>

        {/* Headline */}
        <h1
          className="animate-fade-up mb-4 font-display text-4xl font-700 leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl"
          style={{ animationDelay: "60ms" }}
        >
          What will you
          <br />
          <span className="text-studio-accent">create today?</span>
        </h1>

        {/* Subline */}
        <p
          className="animate-fade-up mb-10 max-w-lg text-base text-muted-foreground"
          style={{ animationDelay: "120ms" }}
        >
          Generate cinematic concept boards, product visuals, and stylized scenes
          using prompt-driven image workflows.
        </p>

        {/* Prompt input */}
        <div
          className="animate-fade-up mb-8 max-w-2xl"
          style={{ animationDelay: "180ms" }}
        >
          <div className="flex gap-2 rounded-xl border border-panel-border bg-surface/80 p-2 ring-1 ring-transparent transition focus-within:border-studio-accent/50 focus-within:ring-studio-accent/20">
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit(prompt);
              }}
              placeholder="Describe your image in detail..."
              className="w-full bg-transparent px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
              autoFocus
            />
            <Button
              type="button"
              onClick={() => submit(prompt)}
              disabled={!prompt.trim()}
              className="shrink-0 bg-studio-accent px-5 text-sm font-500 text-white hover:bg-studio-accent/90 disabled:opacity-40"
            >
              Generate
            </Button>
          </div>
        </div>

        {/* Quick prompts */}
        <div
          className="animate-fade-up"
          style={{ animationDelay: "240ms" }}
        >
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
            Quick Start
          </p>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => submit(item)}
                className="rounded-full border border-panel-border bg-surface/60 px-3.5 py-1.5 text-xs text-muted-foreground transition hover:border-studio-accent/40 hover:bg-studio-accent/8 hover:text-foreground"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
