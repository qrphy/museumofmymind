import { describe, expect, it } from "vitest";

import {
  canPrefetchImages,
  getGalleryLoadMargin,
  isConstrainedConnection,
} from "@/lib/connection";

function navigatorWithConnection(
  connection: { effectiveType?: string; saveData?: boolean },
): Navigator {
  return { connection } as unknown as Navigator;
}

describe("connection helpers", () => {
  it("recognizes data-saving and slow connections", () => {
    expect(isConstrainedConnection(navigatorWithConnection({ saveData: true }))).toBe(
      true,
    );
    expect(
      isConstrainedConnection(navigatorWithConnection({ effectiveType: "2g" })),
    ).toBe(true);
    expect(
      isConstrainedConnection(navigatorWithConnection({ effectiveType: "4g" })),
    ).toBe(false);
  });

  it("loads the next gallery page later on constrained connections", () => {
    expect(getGalleryLoadMargin(navigatorWithConnection({ effectiveType: "2g" }))).toBe(
      "0px",
    );
    expect(getGalleryLoadMargin(navigatorWithConnection({ effectiveType: "4g" }))).toBe(
      "600px 0px",
    );
  });

  it("prefetches neighboring images only on known fast connections", () => {
    expect(canPrefetchImages(navigatorWithConnection({ effectiveType: "4g" }))).toBe(
      true,
    );
    expect(canPrefetchImages(navigatorWithConnection({ effectiveType: "3g" }))).toBe(
      false,
    );
    expect(canPrefetchImages({} as Navigator)).toBe(false);
  });
});
