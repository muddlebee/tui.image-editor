import { NextResponse } from "next/server";
import { AIProviderError, toProviderError } from "@/lib/ai/errors";
import { generateImages } from "@/lib/ai/service";
import type { AIModel } from "@/lib/types";

interface GeneratePayload {
  prompt?: unknown;
  model?: unknown;
  aspectRatio?: unknown;
}

const isAIModel = (value: unknown): value is AIModel => value === "flux-pro" || value === "flux-schnell";

const parsePayload = (payload: GeneratePayload) => {
  if (typeof payload.prompt !== "string" || payload.prompt.trim().length === 0) {
    throw new AIProviderError("`prompt` must be a non-empty string.", 400);
  }

  const model = isAIModel(payload.model) ? payload.model : "flux-schnell";
  const aspectRatio = typeof payload.aspectRatio === "string" ? payload.aspectRatio : "1:1";

  return {
    prompt: payload.prompt.trim(),
    model,
    aspectRatio
  };
};

export async function POST(request: Request) {
  try {
    const payload = parsePayload((await request.json()) as GeneratePayload);
    const result = await generateImages(payload);
    return NextResponse.json(result);
  } catch (error) {
    const normalizedError = toProviderError(error);
    return NextResponse.json({ error: normalizedError.message }, { status: normalizedError.status });
  }
}
