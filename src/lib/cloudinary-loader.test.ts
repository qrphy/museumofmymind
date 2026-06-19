import { describe, expect, it } from "vitest";

import cloudinaryLoader from "@/lib/cloudinary-loader";

describe("cloudinaryLoader", () => {
  it("requests the exact responsive width without reducing image quality", () => {
    expect(
      cloudinaryLoader({
        src: "https://res.cloudinary.com/demo/image/upload/v1/gallery/photo.jpg",
        width: 640,
      }),
    ).toBe(
      "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto:good,c_limit,w_640/v1/gallery/photo.jpg",
    );
  });

  it("preserves an explicitly requested quality", () => {
    expect(
      cloudinaryLoader({
        src: "https://res.cloudinary.com/demo/image/upload/v1/gallery/photo.jpg",
        width: 1280,
        quality: 90,
      }),
    ).toContain("/f_auto,q_90,c_limit,w_1280/");
  });

  it("leaves unsupported sources unchanged", () => {
    const src = "https://example.com/photo.jpg";
    expect(cloudinaryLoader({ src, width: 640 })).toBe(src);
  });
});
