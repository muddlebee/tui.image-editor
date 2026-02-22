import { beforeEach, describe, expect, it } from "vitest";
import { useAppStore } from "@/lib/store";
import type { GeneratedImage } from "@/lib/types";

const makeImages = (prompt: string): GeneratedImage[] =>
  Array.from({ length: 4 }).map((_, index) => ({
    id: `${prompt}-${index}`,
    url: `https://example.com/${prompt}-${index}.png`,
    prompt,
    createdAt: Date.now()
  }));

beforeEach(() => {
  useAppStore.setState({
    view: "empty",
    messages: [],
    currentImages: [],
    selectedImageId: null,
    isGenerating: false,
    history: [],
    settings: { model: "flux-schnell", aspectRatio: "1:1" },
    hydrated: true
  });
});

describe("app store transitions", () => {
  it("moves to loading when prompt is submitted", () => {
    useAppStore.getState().submitPrompt("A mountain village at sunrise");
    const state = useAppStore.getState();

    expect(state.view).toBe("loading");
    expect(state.isGenerating).toBe(true);
    expect(state.messages.at(-1)?.role).toBe("user");
  });

  it("moves to grid with generated images", () => {
    const images = makeImages("cyberpunk");

    useAppStore.getState().submitPrompt("cyberpunk");
    useAppStore.getState().setGridImages(images);
    const state = useAppStore.getState();

    expect(state.view).toBe("grid");
    expect(state.currentImages).toHaveLength(4);
    expect(state.history).toHaveLength(4);
    expect(state.isGenerating).toBe(false);
  });

  it("enters single and inpaint views from grid", () => {
    const images = makeImages("portrait");
    const targetImageId = images[1].id;

    useAppStore.getState().setGridImages(images);
    useAppStore.getState().selectImage(targetImageId);
    useAppStore.getState().enterInpaintMode();
    expect(useAppStore.getState().view).toBe("inpaint");

    useAppStore.getState().exitInpaintMode();
    expect(useAppStore.getState().view).toBe("single");

    useAppStore.getState().backToGrid();
    expect(useAppStore.getState().view).toBe("grid");
  });

  it("replaces selected image after edit and stays in single view", () => {
    const images = makeImages("product-shot");
    useAppStore.getState().setGridImages(images);
    useAppStore.getState().selectImage(images[0].id);

    const edited: GeneratedImage = {
      id: "edited-1",
      url: "https://example.com/edited.png",
      prompt: "product-shot refined",
      createdAt: Date.now()
    };

    useAppStore.getState().replaceSelectedImage(edited);
    const state = useAppStore.getState();

    expect(state.view).toBe("single");
    expect(state.selectedImageId).toBe("edited-1");
    expect(state.currentImages[0].id).toBe("edited-1");
    expect(state.history[0].id).toBe("edited-1");
  });
});
