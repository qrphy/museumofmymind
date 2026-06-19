import { expect, test } from "@playwright/test";

const expectedImageCount = Number(process.env.EXPECTED_IMAGE_COUNT ?? 171);
const initialImageCount = Math.min(36, expectedImageCount);

test("renders the full responsive gallery and keyboard lightbox", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");

  const gallery = page.getByRole("region", { name: "Image gallery" });
  const items = page.getByRole("button", { name: /Open image/ });
  await expect(gallery).toBeVisible();
  await expect(items).toHaveCount(initialImageCount);
  await expect(gallery).toHaveCSS("column-count", "4");

  await items.first().click();
  const dialog = page.getByRole("dialog", { name: "Image viewer" });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText(`1 / ${expectedImageCount}`);
  await page.keyboard.press("ArrowRight");
  await expect(dialog).toContainText(`2 / ${expectedImageCount}`);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();

  while ((await items.count()) < expectedImageCount) {
    const previousCount = await items.count();
    const loadMore = page.getByRole("button", { name: /Load more|Loading/ });
    await loadMore.scrollIntoViewIfNeeded();
    if (await loadMore.isEnabled()) await loadMore.click();
    await expect.poll(() => items.count()).toBeGreaterThan(previousCount);
  }

  await expect(items).toHaveCount(expectedImageCount);

  await page.screenshot({
    fullPage: false,
    path: "test-results/gallery-desktop.png",
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(gallery).toHaveCSS("column-count", "1");
  await page.screenshot({
    fullPage: false,
    path: "test-results/gallery-mobile.png",
  });

  expect(consoleErrors).toEqual([]);
});
