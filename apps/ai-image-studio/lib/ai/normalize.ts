const urlLikeKeys = ["url", "href", "image", "src"] as const;

const asStringUrl = (value: unknown): string | null => {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "object" && "toString" in value && typeof value.toString === "function") {
    const asText = value.toString();
    if (/^https?:\/\//.test(asText)) {
      return asText;
    }
  }

  return null;
};

const fromObject = (value: Record<string, unknown>): string[] => {
  const directMatch = urlLikeKeys.map((key) => asStringUrl(value[key])).filter((item): item is string => Boolean(item));
  if (directMatch.length > 0) {
    return directMatch;
  }

  if (Array.isArray(value.output)) {
    return normalizeImages(value.output);
  }

  if (Array.isArray(value.images)) {
    return normalizeImages(value.images);
  }

  return [];
};

export const normalizeImages = (output: unknown): string[] => {
  if (Array.isArray(output)) {
    return output.flatMap((item) => normalizeImages(item));
  }

  const direct = asStringUrl(output);
  if (direct) {
    return [direct];
  }

  if (output && typeof output === "object") {
    return fromObject(output as Record<string, unknown>);
  }

  return [];
};
