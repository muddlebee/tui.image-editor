export class AIProviderError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = "AIProviderError";
    this.status = status;
  }
}

export const toProviderError = (error: unknown): AIProviderError => {
  if (error instanceof AIProviderError) {
    return error;
  }

  if (error instanceof Error) {
    return new AIProviderError(error.message);
  }

  return new AIProviderError("Unknown AI provider error");
};
