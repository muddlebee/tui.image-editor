"use client";

import { useEffect } from "react";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { HistoryStrip } from "@/components/history/HistoryStrip";
import { EmptyState } from "@/components/views/EmptyState";
import { GridView } from "@/components/views/GridView";
import { InpaintView } from "@/components/views/InpaintView";
import { LoadingState } from "@/components/views/LoadingState";
import { SingleView } from "@/components/views/SingleView";
import { useAppStore } from "@/lib/store";
import type { GeneratedImage } from "@/lib/types";

interface ImageOperationResponse {
  images: string[];
  provider: string;
  model: string;
  error?: string;
}

const postJson = async <TBody extends Record<string, unknown>>(url: string, payload: TBody): Promise<ImageOperationResponse> => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = (await response.json().catch(() => ({ error: "Invalid server response." }))) as ImageOperationResponse;
  if (!response.ok) {
    throw new Error(data.error ?? "Image operation failed.");
  }

  return data;
};

export default function HomePage() {
  const view = useAppStore((state) => state.view);
  const hydrated = useAppStore((state) => state.hydrated);
  const messages = useAppStore((state) => state.messages);
  const currentImages = useAppStore((state) => state.currentImages);
  const selectedImageId = useAppStore((state) => state.selectedImageId);
  const history = useAppStore((state) => state.history);
  const submitPrompt = useAppStore((state) => state.submitPrompt);
  const setGridImages = useAppStore((state) => state.setGridImages);
  const selectImage = useAppStore((state) => state.selectImage);
  const backToGrid = useAppStore((state) => state.backToGrid);
  const enterInpaintMode = useAppStore((state) => state.enterInpaintMode);
  const exitInpaintMode = useAppStore((state) => state.exitInpaintMode);
  const startLoading = useAppStore((state) => state.startLoading);
  const replaceSelectedImage = useAppStore((state) => state.replaceSelectedImage);
  const resetSession = useAppStore((state) => state.resetSession);
  const setOperationError = useAppStore((state) => state.setOperationError);
  const settings = useAppStore((state) => state.settings);

  useEffect(() => {
    useAppStore.persist.rehydrate();
  }, []);

  const lastUserPrompt = [...messages].reverse().find((message) => message.role === "user")?.content;
  const selectedImage = currentImages.find((image) => image.id === selectedImageId) ?? null;

  const runGeneration = async (prompt: string) => {
    submitPrompt(prompt);
    try {
      const response = await postJson("/api/generate", {
        prompt,
        model: settings.model,
        aspectRatio: settings.aspectRatio
      });

      const generatedImages: GeneratedImage[] = response.images.map((url) => ({
        id: crypto.randomUUID(),
        url,
        prompt,
        createdAt: Date.now()
      }));

      setGridImages(generatedImages, `Generated ${generatedImages.length} image(s) via ${response.provider} (${response.model})`);
    } catch (error) {
      const detail = error instanceof Error ? error.message : "Generation failed";
      setOperationError(detail);
    }
  };

  const applyInpaint = async () => {
    if (!selectedImage) {
      return;
    }

    startLoading();
    try {
      const response = await postJson("/api/edit", {
        mode: "inpaint",
        prompt: "Refine selected region",
        imageUrl: selectedImage.url
      });

      const editedUrl = response.images[0];
      if (!editedUrl) {
        throw new Error("Inpaint did not return an image.");
      }

      replaceSelectedImage(
        {
          id: crypto.randomUUID(),
          url: editedUrl,
          prompt: selectedImage.prompt,
          createdAt: Date.now()
        },
        `Applied inpaint via ${response.provider} (${response.model})`
      );
    } catch (error) {
      const detail = error instanceof Error ? error.message : "Inpaint failed";
      setOperationError(detail);
    }
  };

  if (!hydrated) {
    return <main className="min-h-screen bg-surface p-6" />;
  }

  return (
    <main className="min-h-screen p-4 md:p-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
        <header className="flex items-center justify-between rounded-xl border border-border bg-panel/70 px-4 py-3 backdrop-blur">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400">MVP Milestone 1</p>
            <h1 className="text-lg font-semibold">AI Image Studio</h1>
          </div>
          <button
            type="button"
            onClick={resetSession}
            className="rounded border border-border px-3 py-1.5 text-xs text-slate-300 transition hover:border-slate-500"
          >
            New
          </button>
        </header>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div>
            {view === "empty" ? <EmptyState onSubmit={(prompt) => void runGeneration(prompt)} /> : null}
            {view === "loading" ? <LoadingState prompt={lastUserPrompt} /> : null}
            {view === "grid" ? <GridView images={currentImages} onSelect={selectImage} /> : null}
            {view === "single" && selectedImage ? (
              <SingleView image={selectedImage} onBack={backToGrid} onInpaint={enterInpaintMode} />
            ) : null}
            {view === "inpaint" ? <InpaintView onCancel={exitInpaintMode} onApply={() => void applyInpaint()} /> : null}
          </div>

          <ChatPanel messages={messages} />
        </div>

        <HistoryStrip items={history} />
      </div>
    </main>
  );
}
