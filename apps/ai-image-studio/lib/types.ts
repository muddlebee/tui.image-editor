export type ViewState = "empty" | "loading" | "grid" | "single" | "inpaint";

export type AIModel = "flux-pro" | "flux-schnell";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  createdAt: number;
}

export interface GenerationSettings {
  model: AIModel;
  aspectRatio: "1:1" | "16:9" | "9:16";
}
