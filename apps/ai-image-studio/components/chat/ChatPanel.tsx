"use client";

import type { ChatMessage } from "@/lib/types";

interface ChatPanelProps {
  messages: ChatMessage[];
}

export function ChatPanel({ messages }: ChatPanelProps) {
  return (
    <aside className="flex h-full min-h-[20rem] flex-col rounded-xl border border-border bg-panel/70 p-4 backdrop-blur">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-300">Chat</h2>
      <div className="flex-1 space-y-3 overflow-auto pr-1">
        {messages.length === 0 ? (
          <p className="text-sm text-slate-400">Messages will appear here as you generate or edit images.</p>
        ) : null}
        {messages.map((message) => (
          <article key={message.id} className="rounded-lg border border-border/80 bg-surface/80 p-3 text-sm">
            <p className="mb-1 text-xs uppercase tracking-wider text-slate-400">{message.role}</p>
            <p>{message.content}</p>
          </article>
        ))}
      </div>
    </aside>
  );
}
