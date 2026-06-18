import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  normalizeResource,
  sortCloudinaryResources,
} from "@/lib/cloudinary";

const validResource = {
  asset_id: "asset-1",
  public_id: "museum-of-my-mind/first",
  width: 1200,
  height: 1800,
  secure_url:
    "https://res.cloudinary.com/demo/image/upload/v1/museum-of-my-mind/first.jpg",
  created_at: "2026-06-18T08:00:00Z",
};

describe("normalizeResource", () => {
  it("keeps intrinsic dimensions and adds non-cropping delivery transforms", () => {
    expect(normalizeResource(validResource)).toEqual({
      id: "asset-1",
      publicId: "museum-of-my-mind/first",
      width: 1200,
      height: 1800,
      alt: "",
      src: "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,c_limit,w_2400/v1/museum-of-my-mind/first.jpg",
    });
  });

  it.each([
    null,
    {},
    { ...validResource, width: 0 },
    { ...validResource, height: -1 },
    { ...validResource, secure_url: "http://example.com/image.jpg" },
    { ...validResource, resource_type: "video" },
  ])("discards malformed or non-image resources", (resource) => {
    expect(normalizeResource(resource)).toBeNull();
  });
});

describe("sortCloudinaryResources", () => {
  it("sorts newest first and uses public id as a stable tie-breaker", () => {
    const resources = [
      { ...validResource, public_id: "b", created_at: "2026-06-17T00:00:00Z" },
      { ...validResource, public_id: "z", created_at: "2026-06-18T00:00:00Z" },
      { ...validResource, public_id: "a", created_at: "2026-06-18T00:00:00Z" },
    ];

    expect(sortCloudinaryResources(resources).map((item) => item.public_id)).toEqual([
      "a",
      "z",
      "b",
    ]);
  });
});
