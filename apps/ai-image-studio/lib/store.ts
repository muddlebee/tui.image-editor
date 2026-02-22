import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";
import type { AIModel, ChatMessage, GeneratedImage, GenerationSettings, ViewState } from "./types";

interface AppState {
  view: ViewState;
  messages: ChatMessage[];
  currentImages: GeneratedImage[];
  selectedImageId: string | null;
  isGenerating: boolean;
  history: GeneratedImage[];
  settings: GenerationSettings;
  hydrated: boolean;
  setHydrated: (value: boolean) => void;
  addAssistantMessage: (content: string) => void;
  setModel: (model: AIModel) => void;
  setAspectRatio: (aspectRatio: GenerationSettings["aspectRatio"]) => void;
  submitPrompt: (prompt: string) => void;
  startLoading: () => void;
  setGridImages: (images: GeneratedImage[], assistantMessage?: string) => void;
  selectImage: (imageId: string) => void;
  enterInpaintMode: () => void;
  exitInpaintMode: () => void;
  backToGrid: () => void;
  replaceSelectedImage: (image: GeneratedImage, assistantMessage?: string) => void;
  setOperationError: (message: string) => void;
  resetSession: () => void;
}

const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {}
};

const now = () => Date.now();

const createMessage = (role: ChatMessage["role"], content: string): ChatMessage => ({
  id: crypto.randomUUID(),
  role,
  content,
  createdAt: now()
});

const ensureSelection = (images: GeneratedImage[], selectedImageId: string | null) => {
  if (images.length === 0) {
    return null;
  }

  return images.some((image) => image.id === selectedImageId) ? selectedImageId : images[0].id;
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      view: "empty",
      messages: [],
      currentImages: [],
      selectedImageId: null,
      isGenerating: false,
      history: [],
      settings: {
        model: "flux-schnell",
        aspectRatio: "1:1"
      },
      hydrated: false,
      setHydrated: (value) => set({ hydrated: value }),
      addAssistantMessage: (content) =>
        set((state) => ({
          messages: [...state.messages, createMessage("assistant", content)]
        })),
      setModel: (model) =>
        set((state) => ({
          settings: {
            ...state.settings,
            model
          }
        })),
      setAspectRatio: (aspectRatio) =>
        set((state) => ({
          settings: {
            ...state.settings,
            aspectRatio
          }
        })),
      submitPrompt: (prompt) => {
        set((state) => ({
          isGenerating: true,
          view: "loading",
          messages: [...state.messages, createMessage("user", prompt)]
        }));
      },
      startLoading: () => set({ isGenerating: true, view: "loading" }),
      setGridImages: (images, assistantMessage = "Generated 4 images") => {
        set((state) => ({
          currentImages: images,
          selectedImageId: ensureSelection(images, state.selectedImageId),
          history: [...images, ...state.history].slice(0, 60),
          isGenerating: false,
          view: images.length > 0 ? "grid" : "empty",
          messages: [...state.messages, createMessage("assistant", assistantMessage)]
        }));
      },
      selectImage: (imageId) => {
        const image = get().currentImages.find((entry) => entry.id === imageId);
        if (!image) {
          return;
        }

        set({
          selectedImageId: imageId,
          view: "single"
        });
      },
      enterInpaintMode: () => {
        if (get().selectedImageId) {
          set({ view: "inpaint" });
        }
      },
      exitInpaintMode: () => {
        if (get().selectedImageId) {
          set({ view: "single" });
        } else {
          set({ view: "grid" });
        }
      },
      backToGrid: () => {
        if (get().currentImages.length > 0) {
          set({ view: "grid" });
        } else {
          set({ view: "empty" });
        }
      },
      replaceSelectedImage: (image, assistantMessage = "Applied inpaint edit") => {
        set((state) => {
          const selectedId = state.selectedImageId;
          if (!selectedId) {
            return state;
          }

          const currentImages = state.currentImages.map((entry) => (entry.id === selectedId ? image : entry));

          return {
            currentImages,
            selectedImageId: image.id,
            history: [image, ...state.history].slice(0, 60),
            messages: [...state.messages, createMessage("assistant", assistantMessage)],
            isGenerating: false,
            view: "single" as const
          };
        });
      },
      setOperationError: (message) =>
        set((state) => ({
          isGenerating: false,
          view: state.selectedImageId ? "single" : state.currentImages.length > 0 ? "grid" : "empty",
          messages: [...state.messages, createMessage("assistant", `Error: ${message}`)]
        })),
      resetSession: () =>
        set({
          view: "empty",
          currentImages: [],
          selectedImageId: null,
          isGenerating: false
        })
    }),
    {
      name: "ai-image-studio-store",
      partialize: (state) => ({
        history: state.history,
        settings: state.settings,
        messages: state.messages
      }),
      storage: createJSONStorage(() => (typeof window !== "undefined" ? localStorage : noopStorage)),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      }
    }
  )
);
