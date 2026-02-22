"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ChatMessage } from "@/lib/types";

interface ChatPanelProps {
  messages: ChatMessage[];
  onSubmit: (prompt: string) => void;
  isTyping?: boolean;
}

const formatTime = (timestamp: number) =>
  new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });

export function ChatPanel({ messages, onSubmit, isTyping = false }: ChatPanelProps) {
  const [prompt, setPrompt] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  /* Auto-scroll to latest message */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const submit = () => {
    const trimmed = prompt.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setPrompt("");
  };

  return (
    <aside className="flex h-full min-h-[28rem] flex-col rounded-2xl border border-panel-border bg-panel/60 backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-panel-border px-4 py-3">
        <div className="flex items-center gap-2">
          {/* Live dot */}
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-studio-emerald opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-studio-emerald" />
          </span>
          <h2 className="font-display text-xs font-600 uppercase tracking-[0.18em] text-foreground">
            Chat
          </h2>
        </div>
        <span className="font-mono text-[10px] text-muted-foreground">
          {messages.length} msg
        </span>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-3 py-3">
        {messages.length === 0 ? (
          <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-panel-border bg-surface/30 p-4 text-center text-xs text-muted-foreground">
            Messages will appear as you generate and refine images.
          </div>
        ) : null}

        <div className="space-y-3">
          {messages.map((message) => (
            <article
              key={message.id}
              className={`flex animate-fade-up ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {/* Assistant avatar dot */}
              {message.role === "assistant" && (
                <div className="mr-2 mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-studio-accent/20 ring-1 ring-studio-accent/30">
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M4 0.5L7.5 2.5V5.5L4 7.5L0.5 5.5V2.5L4 0.5Z" fill="currentColor" className="text-studio-accent" />
                  </svg>
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                  message.role === "user"
                    ? "rounded-tr-sm border border-studio-accent/30 bg-studio-accent/12 text-foreground"
                    : "rounded-tl-sm border border-panel-border bg-surface/80 text-foreground"
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                <p className="mt-1 font-mono text-[10px] text-muted-foreground/60">
                  {formatTime(message.createdAt)}
                </p>
              </div>
            </article>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <article className="flex justify-start animate-fade-in">
              <div className="mr-2 mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-studio-accent/20 ring-1 ring-studio-accent/30">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M4 0.5L7.5 2.5V5.5L4 7.5L0.5 5.5V2.5L4 0.5Z" fill="currentColor" className="text-studio-accent" />
                </svg>
              </div>
              <div className="rounded-xl rounded-tl-sm border border-panel-border bg-surface/80 px-3 py-2.5">
                <div className="flex items-center gap-1">
                  <span className="typing-dot h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                  <span className="typing-dot h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                  <span className="typing-dot h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                </div>
              </div>
            </article>
          )}

          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-panel-border p-3">
        <div className="flex gap-2 rounded-xl border border-panel-border bg-surface/80 p-1.5 transition focus-within:border-studio-accent/40">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            placeholder="Describe edits or a new concept..."
            className="w-full bg-transparent px-2 py-1.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/50"
          />
          <button
            type="button"
            onClick={submit}
            disabled={!prompt.trim()}
            className="shrink-0 rounded-lg bg-studio-accent px-3 py-1.5 text-xs font-500 text-white transition hover:bg-studio-accent/90 disabled:opacity-40"
          >
            Send
          </button>
        </div>
      </div>
    </aside>
  );
}
