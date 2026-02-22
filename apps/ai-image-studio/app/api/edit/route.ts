import { NextResponse } from "next/server";
import { AIProviderError, toProviderError } from "@/lib/ai/errors";
import { editImage } from "@/lib/ai/service";

interface EditPayload {
  prompt?: unknown;
  imageUrl?: unknown;
  maskUrl?: unknown;
  mode?: unknown;
}

const validModes = new Set(["variation", "inpaint", "outpaint"]);

const parsePayload = (payload: EditPayload) => {
  if (typeof payload.imageUrl !== "string" || payload.imageUrl.trim().length === 0) {
    throw new AIProviderError("`imageUrl` must be a non-empty string.", 400);
  }

  if (typeof payload.mode !== "string" || !validModes.has(payload.mode)) {
    throw new AIProviderError("`mode` must be one of: variation, inpaint, outpaint.", 400);
  }

  if (payload.maskUrl !== undefined && typeof payload.maskUrl !== "string") {
    throw new AIProviderError("`maskUrl` must be a string when provided.", 400);
  }

  if (payload.prompt !== undefined && typeof payload.prompt !== "string") {
    throw new AIProviderError("`prompt` must be a string when provided.", 400);
  }

  return {
    imageUrl: payload.imageUrl.trim(),
    mode: payload.mode as "variation" | "inpaint" | "outpaint",
    prompt: payload.prompt?.trim() || undefined,
    maskUrl: payload.maskUrl?.trim() || undefined
  };
};

export async function POST(request: Request) {
  try {
    const payload = parsePayload((await request.json()) as EditPayload);
    const result = await editImage(payload);
    return NextResponse.json(result);
  } catch (error) {
    const normalizedError = toProviderError(error);
    return NextResponse.json({ error: normalizedError.message }, { status: normalizedError.status });
  }
}
