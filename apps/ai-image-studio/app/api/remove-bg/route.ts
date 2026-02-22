import { NextResponse } from "next/server";
import { AIProviderError, toProviderError } from "@/lib/ai/errors";
import { removeBackground } from "@/lib/ai/service";

interface RemoveBgPayload {
  imageUrl?: unknown;
}

const parsePayload = (payload: RemoveBgPayload) => {
  if (typeof payload.imageUrl !== "string" || payload.imageUrl.trim().length === 0) {
    throw new AIProviderError("`imageUrl` must be a non-empty string.", 400);
  }

  return {
    imageUrl: payload.imageUrl.trim()
  };
};

export async function POST(request: Request) {
  try {
    const payload = parsePayload((await request.json()) as RemoveBgPayload);
    const result = await removeBackground(payload);
    return NextResponse.json(result);
  } catch (error) {
    const normalizedError = toProviderError(error);
    return NextResponse.json({ error: normalizedError.message }, { status: normalizedError.status });
  }
}
