export type Provider = "fal" | "replicate";

export interface ModelConfig {
  provider: Provider;
  id: string;
}

export interface ModelRegistry {
  generate: {
    fluxPro: ModelConfig;
    fluxSchnell: ModelConfig;
  };
  edit: {
    variation: ModelConfig;
    fill: ModelConfig;
  };
  tools: {
    upscale: ModelConfig;
    removeBg: ModelConfig;
  };
}

export const getModelRegistry = (): ModelRegistry => ({
  generate: {
    fluxPro: {
      provider: "fal",
      id: process.env.FAL_GENERATE_MODEL ?? "fal-ai/flux-pro/v1.1-ultra"
    },
    fluxSchnell: {
      provider: "replicate",
      id: process.env.REPLICATE_GENERATE_MODEL ?? "black-forest-labs/flux-schnell"
    }
  },
  edit: {
    variation: {
      provider: "replicate",
      id: process.env.REPLICATE_VARIATION_MODEL ?? "black-forest-labs/flux-redux-dev"
    },
    fill: {
      provider: "replicate",
      id: process.env.REPLICATE_FILL_MODEL ?? "black-forest-labs/flux-fill-dev"
    }
  },
  tools: {
    upscale: {
      provider: "replicate",
      id: process.env.REPLICATE_UPSCALE_MODEL ?? "nightmareai/real-esrgan"
    },
    removeBg: {
      provider: "replicate",
      id: process.env.REPLICATE_REMOVE_BG_MODEL ?? "briaai/bria-rmbg-2.0"
    }
  }
});
