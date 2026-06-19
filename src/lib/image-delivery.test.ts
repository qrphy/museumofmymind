import { describe, expect, it } from "vitest";

import { getGalleryImageSizes, IMAGE_PLACEHOLDER } from "@/lib/image-delivery";

describe("image delivery", () => {
  it("accounts for gallery gutters in every responsive layout", () => {
    expect(getGalleryImageSizes(1, 4)).toContain("calc(100vw - 1.8rem)");
    expect(getGalleryImageSizes(2, 6)).toContain("calc(50vw - 1.35rem)");
    expect(getGalleryImageSizes(1, 4)).toContain("calc(25vw - 1.5rem)");
    expect(getGalleryImageSizes(1, 6)).toContain("calc(16.667vw - 1.5rem)");
  });

  it("uses an inline placeholder without another network request", () => {
    expect(IMAGE_PLACEHOLDER).toMatch(/^data:image\/svg\+xml/);
  });
});
