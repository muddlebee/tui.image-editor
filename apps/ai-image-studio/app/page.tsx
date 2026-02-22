"use client";

import { useEffect } from "react";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { HistoryStrip } from "@/components/history/HistoryStrip";
import { EmptyState } from "@/components/views/EmptyState";
import { GridView } from "@/components/views/GridView";
import { InpaintView } from "@/components/views/InpaintView";
import { LoadingState } from "@/components/views/LoadingState";
import { SingleView } from "@/components/views/SingleView";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "@/lib/store";
import type { GeneratedImage } from "@/lib/types";

interface ImageOperationResponse {
  images: string[];
  provider: string;
  model: string;
  error?: string;
}

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

const MODEL_LABELS = {
  "flux-schnell": "FLUX Schnell",
  "flux-pro": "FLUX Pro"
} as const;

const ASPECT_SIZES = {
  "1:1": [1024, 1024],
  "16:9": [1280, 720],
  "9:16": [720, 1280]
} as const;

/* Curated demo image seeds that look like real AI output */
const DEMO_SEEDS = [
  "cinematic-portrait-1", "editorial-fashion-2", "surreal-landscape-3",
  "product-shot-4", "abstract-art-5", "neon-cityscape-6",
  "minimal-architecture-7", "dreamy-nature-8"
];

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });

const postJson = async <TBody extends Record<string, unknown>>(
  url: string,
  payload: TBody
): Promise<ImageOperationResponse> => {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = (await response.json().catch(() => ({
    error: "Invalid server response."
  }))) as ImageOperationResponse;

  if (!response.ok) {
    throw new Error(data.error ?? "Image operation failed.");
  }

  return data;
};

const createGeneratedImages = (urls: string[], prompt: string): GeneratedImage[] =>
  urls.map((url) => ({
    id: crypto.randomUUID(),
    url,
    prompt,
    createdAt: Date.now()
  }));

const createDemoUrls = (
  prompt: string,
  aspectRatio: keyof typeof ASPECT_SIZES,
  count: number
) => {
  const [width, height] = ASPECT_SIZES[aspectRatio];
  return Array.from({ length: count }).map((_, index) => {
    const seedBase = DEMO_SEEDS[(index + Math.floor(Date.now() / 1000)) % DEMO_SEEDS.length];
    const seed = encodeURIComponent(`${seedBase}-${prompt.slice(0, 20)}-${index}`);
    return `https://picsum.photos/seed/${seed}/${width}/${height}`;
  });
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
  const setModel = useAppStore((state) => state.setModel);
  const setAspectRatio = useAppStore((state) => state.setAspectRatio);

  useEffect(() => {
    useAppStore.persist.rehydrate();
  }, []);

  const lastUserPrompt = [...messages].reverse().find((m) => m.role === "user")?.content;
  const selectedImage = currentImages.find((img) => img.id === selectedImageId) ?? null;
  const currentModelLabel = MODEL_LABELS[settings.model];

  /* Chat panel is only shown once images have been generated */
  const showChat = view !== "empty";
  const showHistory = history.length > 0;

  const runGeneration = async (prompt: string) => {
    submitPrompt(prompt);
    try {
      if (DEMO_MODE) {
        await wait(2800);
        const generatedImages = createGeneratedImages(
          createDemoUrls(prompt, settings.aspectRatio, 4),
          prompt
        );
        setGridImages(generatedImages, `Generated ${generatedImages.length} images · demo mode`);
        return;
      }

      const response = await postJson("/api/generate", {
        prompt,
        model: settings.model,
        aspectRatio: settings.aspectRatio
      });

      const generatedImages = createGeneratedImages(response.images, prompt);
      setGridImages(
        generatedImages,
        `Generated ${generatedImages.length} image(s) via ${response.provider} (${response.model})`
      );
    } catch (error) {
      setOperationError(error instanceof Error ? error.message : "Generation failed");
    }
  };

  const runVariation = async (image: GeneratedImage) => {
    const prompt = `Variation of: ${image.prompt}`;
    submitPrompt(prompt);
    try {
      if (DEMO_MODE) {
        await wait(1900);
        const demoImages = createGeneratedImages(
          createDemoUrls(prompt, settings.aspectRatio, 4),
          prompt
        );
        setGridImages(demoImages, "Generated 4 variations · demo mode");
        return;
      }

      const response = await postJson("/api/edit", {
        mode: "variation",
        prompt,
        imageUrl: image.url
      });
      const variationImages = createGeneratedImages(response.images, prompt);
      setGridImages(variationImages, `Variation set via ${response.provider} (${response.model})`);
    } catch (error) {
      setOperationError(error instanceof Error ? error.message : "Variation failed");
    }
  };

  const runUpscale = async (image: GeneratedImage) => {
    const prompt = `Upscaled: ${image.prompt}`;
    submitPrompt(prompt);
    try {
      if (DEMO_MODE) {
        await wait(1500);
        const demoSingle = createGeneratedImages(
          createDemoUrls(prompt, settings.aspectRatio, 1),
          prompt
        );
        setGridImages(demoSingle, "Upscale complete · demo mode");
        selectImage(demoSingle[0].id);
        return;
      }

      const response = await postJson("/api/upscale", { imageUrl: image.url });
      const upscaled = createGeneratedImages(response.images.slice(0, 1), prompt);
      if (upscaled.length === 0) throw new Error("Upscale did not return an image.");
      setGridImages(upscaled, `Upscaled via ${response.provider} (${response.model})`);
      selectImage(upscaled[0].id);
    } catch (error) {
      setOperationError(error instanceof Error ? error.message : "Upscale failed");
    }
  };

  const applyInpaint = async () => {
    if (!selectedImage) return;
    startLoading();
    try {
      if (DEMO_MODE) {
        await wait(1700);
        const demoEdited = createGeneratedImages(
          createDemoUrls(`inpaint-${selectedImage.prompt}`, settings.aspectRatio, 1),
          selectedImage.prompt
        );
        replaceSelectedImage(demoEdited[0], "Applied inpaint edit · demo mode");
        return;
      }

      const response = await postJson("/api/edit", {
        mode: "inpaint",
        prompt: "Refine selected region",
        imageUrl: selectedImage.url
      });

      const editedUrl = response.images[0];
      if (!editedUrl) throw new Error("Inpaint did not return an image.");
      replaceSelectedImage(
        { id: crypto.randomUUID(), url: editedUrl, prompt: selectedImage.prompt, createdAt: Date.now() },
        `Applied inpaint via ${response.provider} (${response.model})`
      );
    } catch (error) {
      setOperationError(error instanceof Error ? error.message : "Inpaint failed");
    }
  };

  const renderViewPanel = () => {
    if (view === "empty") {
      return <EmptyState onSubmit={(prompt) => void runGeneration(prompt)} />;
    }
    if (view === "loading") {
      return <LoadingState prompt={lastUserPrompt} />;
    }
    if (view === "grid") {
      return (
        <GridView
          images={currentImages}
          onSelect={selectImage}
          onUpscale={(image) => void runUpscale(image)}
          onVariation={(image) => void runVariation(image)}
        />
      );
    }
    if (view === "single" && selectedImage) {
      return (
        <SingleView
          image={selectedImage}
          onBack={backToGrid}
          onInpaint={enterInpaintMode}
          onUpscale={(image) => void runUpscale(image)}
          onVariation={(image) => void runVariation(image)}
        />
      );
    }
    if (view === "inpaint" && selectedImage) {
      return (
        <InpaintView
          imageUrl={selectedImage.url}
          onCancel={exitInpaintMode}
          onApply={() => void applyInpaint()}
        />
      );
    }
    return <EmptyState onSubmit={(prompt) => void runGeneration(prompt)} />;
  };

  if (!hydrated) {
    return <div className="min-h-screen bg-surface" />;
  }

  return (
    <main className="relative min-h-screen p-4 md:p-6">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4">

        {/* ── Header ── */}
        <header className="sticky top-4 z-20 flex items-center justify-between rounded-2xl border border-panel-border bg-panel/80 px-5 py-3 backdrop-blur-md">
          <div className="flex items-center gap-3">
            {/* Logo mark */}
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-studio-accent/20 ring-1 ring-studio-accent/40">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1L13 4V10L7 13L1 10V4L7 1Z" fill="currentColor" className="text-studio-accent" />
              </svg>
            </div>
            <span className="font-display text-sm font-600 tracking-wide text-foreground">AI Image Studio</span>

            {/* State badges — only when active */}
            {view !== "empty" && (
              <div className="flex items-center gap-1.5">
                <Badge variant="outline" className="font-mono text-[10px] text-muted-foreground border-panel-border">
                  {currentModelLabel}
                </Badge>
                <Badge variant="outline" className="font-mono text-[10px] text-muted-foreground border-panel-border">
                  {settings.aspectRatio}
                </Badge>
                {DEMO_MODE && (
                  <Badge className="bg-studio-amber/15 text-studio-amber border-studio-amber/30 text-[10px] font-mono">
                    demo
                  </Badge>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Settings popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 border-panel-border bg-transparent text-xs text-muted-foreground hover:text-foreground hover:border-border">
                  Settings
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 border-panel-border bg-panel p-4" align="end">
                <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Model</p>
                <div className="mb-4 flex gap-2">
                  {(["flux-schnell", "flux-pro"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setModel(m)}
                      className={`flex-1 rounded-lg border px-2 py-1.5 text-xs transition ${
                        settings.model === m
                          ? "border-studio-accent bg-studio-accent/15 text-studio-accent"
                          : "border-panel-border text-muted-foreground hover:border-border"
                      }`}
                    >
                      {MODEL_LABELS[m]}
                    </button>
                  ))}
                </div>
                <Separator className="mb-3 bg-panel-border" />
                <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Aspect Ratio</p>
                <div className="flex gap-2">
                  {(["1:1", "16:9", "9:16"] as const).map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setAspectRatio(ratio)}
                      className={`flex-1 rounded-lg border px-2 py-1.5 text-xs transition ${
                        settings.aspectRatio === ratio
                          ? "border-studio-accent bg-studio-accent/15 text-studio-accent"
                          : "border-panel-border text-muted-foreground hover:border-border"
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {view !== "empty" && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetSession}
                className="h-8 border-panel-border bg-transparent text-xs text-muted-foreground hover:text-foreground hover:border-border"
              >
                New
              </Button>
            )}
          </div>
        </header>

        {/* ── Main content ── */}
        {view === "empty" || view === "loading" ? (
          /* Full-width layout for empty + loading states */
          <div className="animate-fade-up">{renderViewPanel()}</div>
        ) : (
          /* Two-column layout once images exist */
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <div className="animate-scale-in">{renderViewPanel()}</div>
            {showChat && (
              <div className="animate-slide-in-right">
                <ChatPanel
                  messages={messages}
                  onSubmit={(prompt) => void runGeneration(prompt)}
                  isTyping={false}
                />
              </div>
            )}
          </div>
        )}

        {/* ── History strip ── */}
        {showHistory && (
          <div className="animate-fade-up">
            <HistoryStrip
              items={history}
              onSelect={(image) => {
                setGridImages([image], "Restored image from history");
                selectImage(image.id);
              }}
            />
          </div>
        )}
      </div>
    </main>
  );
}
