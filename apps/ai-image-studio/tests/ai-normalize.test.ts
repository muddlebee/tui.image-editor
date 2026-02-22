import { describe, expect, it } from "vitest";
import { normalizeImages } from "@/lib/ai/normalize";

describe("normalizeImages", () => {
  it("extracts urls from string arrays", () => {
    const output = normalizeImages(["https://a.example/image-1.png", "https://a.example/image-2.png"]);
    expect(output).toEqual(["https://a.example/image-1.png", "https://a.example/image-2.png"]);
  });

  it("extracts nested image objects", () => {
    const output = normalizeImages({
      output: [
        { url: "https://a.example/1.png" },
        { href: "https://a.example/2.png" }
      ]
    });
    expect(output).toEqual(["https://a.example/1.png", "https://a.example/2.png"]);
  });

  it("returns empty array when no image-like field exists", () => {
    const output = normalizeImages({ status: "done" });
    expect(output).toEqual([]);
  });
});
