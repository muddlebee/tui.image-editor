import { describe, expect, it } from "vitest";
import { POST as editPost } from "@/app/api/edit/route";
import { POST as generatePost } from "@/app/api/generate/route";
import { POST as removeBgPost } from "@/app/api/remove-bg/route";
import { POST as upscalePost } from "@/app/api/upscale/route";

const buildRequest = (payload: Record<string, unknown>) =>
  new Request("http://localhost/api/test", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

describe("API route validation", () => {
  it("rejects empty prompt for generate", async () => {
    const response = await generatePost(buildRequest({ prompt: "" }));
    expect(response.status).toBe(400);
  });

  it("rejects invalid mode for edit", async () => {
    const response = await editPost(buildRequest({ imageUrl: "https://a.example/1.png", mode: "bad-mode" }));
    expect(response.status).toBe(400);
  });

  it("rejects empty image url for upscale", async () => {
    const response = await upscalePost(buildRequest({ imageUrl: "" }));
    expect(response.status).toBe(400);
  });

  it("rejects empty image url for remove-bg", async () => {
    const response = await removeBgPost(buildRequest({ imageUrl: "" }));
    expect(response.status).toBe(400);
  });
});
