import { describe, expect, it } from "vitest";

import { resolveCloudinaryConfig } from "@/lib/cloudinary-config";

describe("resolveCloudinaryConfig", () => {
  it("parses the single Cloudinary API environment variable", () => {
    expect(
      resolveCloudinaryConfig({
        CLOUDINARY_URL: "cloudinary://12345:secret-value@museum-cloud",
      }),
    ).toEqual({
      cloudName: "museum-cloud",
      apiKey: "12345",
      apiSecret: "secret-value",
    });
  });

  it("supports separate environment variables", () => {
    expect(
      resolveCloudinaryConfig({
        NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: "museum-cloud",
        CLOUDINARY_API_KEY: "12345",
        CLOUDINARY_API_SECRET: "secret-value",
      }),
    ).toEqual({
      cloudName: "museum-cloud",
      apiKey: "12345",
      apiSecret: "secret-value",
    });
  });

  it("rejects missing credentials", () => {
    expect(() => resolveCloudinaryConfig({})).toThrow(
      "Cloudinary credentials are missing",
    );
  });
});
