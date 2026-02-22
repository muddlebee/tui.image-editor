import type { AIModel } from "@/lib/types";
import { runFalModel } from "@/lib/ai/fal";
import { getModelRegistry, type ModelConfig } from "@/lib/ai/models";
import { runReplicateModel } from "@/lib/ai/replicate";

export interface ImageOperationResult {
  images: string[];
  provider: "fal" | "replicate";
  model: string;
}

interface GenerateRequest {
  prompt: string;
  model: AIModel;
  aspectRatio: string;
}

interface EditRequest {
  prompt?: string;
  imageUrl: string;
  maskUrl?: string;
  mode: "variation" | "inpaint" | "outpaint";
}

interface BaseToolRequest {
  imageUrl: string;
}

const modelInput = (payload: Record<string, unknown>) => ({
  ...payload
});

const runModel = async (config: ModelConfig, input: Record<string, unknown>): Promise<ImageOperationResult> => {
  const images =
    config.provider === "fal"
      ? await runFalModel({ endpoint: config.id, input })
      : await runReplicateModel({ model: config.id, input });

  return {
    images,
    provider: config.provider,
    model: config.id
  };
};

export const generateImages = async ({ prompt, model, aspectRatio }: GenerateRequest): Promise<ImageOperationResult> => {
  const registry = getModelRegistry();
  const selectedModel = model === "flux-pro" ? registry.generate.fluxPro : registry.generate.fluxSchnell;
  const input = modelInput({
    prompt,
    aspect_ratio: aspectRatio,
    num_outputs: 4
  });

  return runModel(selectedModel, input);
};

export const editImage = async ({ prompt, imageUrl, maskUrl, mode }: EditRequest): Promise<ImageOperationResult> => {
  const registry = getModelRegistry();
  const selectedModel = mode === "variation" ? registry.edit.variation : registry.edit.fill;
  const input = modelInput({
    prompt,
    image: imageUrl,
    mask: maskUrl
  });

  return runModel(selectedModel, input);
};

export const upscaleImage = async ({ imageUrl }: BaseToolRequest): Promise<ImageOperationResult> => {
  const registry = getModelRegistry();
  const input = modelInput({ image: imageUrl });
  return runModel(registry.tools.upscale, input);
};

export const removeBackground = async ({ imageUrl }: BaseToolRequest): Promise<ImageOperationResult> => {
  const registry = getModelRegistry();
  const input = modelInput({ image: imageUrl });
  return runModel(registry.tools.removeBg, input);
};
