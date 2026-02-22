import { AIProviderError } from "@/lib/ai/errors";
import { normalizeImages } from "@/lib/ai/normalize";

interface FalRunParams {
  endpoint: string;
  input: Record<string, unknown>;
}

const FAL_BASE_URL = "https://fal.run";

export async function runFalModel({ endpoint, input }: FalRunParams): Promise<string[]> {
  const apiKey = process.env.FAL_API_KEY;
  if (!apiKey) {
    throw new AIProviderError("Missing FAL_API_KEY", 500);
  }

  const response = await fetch(`${FAL_BASE_URL}/${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: `Key ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const detail =
      data && typeof data === "object" && "error" in data && typeof data.error === "string"
        ? data.error
        : `fal request failed with status ${response.status}`;
    throw new AIProviderError(detail, response.status);
  }

  const images = normalizeImages(data);
  if (images.length === 0) {
    throw new AIProviderError("fal response did not include image outputs", 502);
  }

  return images;
}
