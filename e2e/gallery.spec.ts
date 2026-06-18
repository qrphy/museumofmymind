import { expect, test } from "@playwright/test";

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
  await expect(items).toHaveCount(171);
  await expect(gallery).toHaveCSS("column-count", "4");

  await items.first().click();
  const dialog = page.getByRole("dialog", { name: "Image viewer" });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("1 / 171");
  await page.keyboard.press("ArrowRight");
  await expect(dialog).toContainText("2 / 171");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();

  await page.screenshot({
    fullPage: true,
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
