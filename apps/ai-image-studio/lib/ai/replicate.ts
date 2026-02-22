import Replicate from "replicate";
import { AIProviderError } from "@/lib/ai/errors";
import { normalizeImages } from "@/lib/ai/normalize";

interface ReplicateRunParams {
  model: string;
  input: Record<string, unknown>;
}

let replicateClient: Replicate | null = null;

const getReplicateClient = () => {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) {
    throw new AIProviderError("Missing REPLICATE_API_TOKEN", 500);
  }

  if (!replicateClient) {
    replicateClient = new Replicate({ auth: token });
  }

  return replicateClient;
};

export async function runReplicateModel({ model, input }: ReplicateRunParams): Promise<string[]> {
  try {
    const output = await getReplicateClient().run(model as `${string}/${string}` | `${string}/${string}:${string}`, { input });
    const images = normalizeImages(output);
    if (images.length === 0) {
      throw new AIProviderError("Replicate response did not include image outputs", 502);
    }
    return images;
  } catch (error) {
    if (error instanceof AIProviderError) {
      throw error;
    }

    const message = error instanceof Error ? error.message : "Replicate request failed";
    throw new AIProviderError(message, 502);
  }
}
