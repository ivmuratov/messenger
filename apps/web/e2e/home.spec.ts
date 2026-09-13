import { expect, test } from "@playwright/test";

test.describe("drawer", () => {
  test("открывает и закрывает drawer через aria-hidden на aside", async ({ page }) => {
    await page.goto("/");

    const aside = page.locator("aside");

    await expect(aside).toHaveAttribute("aria-hidden", "true");

    await page.getByRole("button", { name: "Toggle Drawer" }).click();
    await expect(aside).toHaveAttribute("aria-hidden", "false");

    await page.getByRole("button", { name: "Toggle Drawer" }).click();
    await expect(aside).toHaveAttribute("aria-hidden", "true");
  });
});

test.describe("theme", () => {
  test("переключает data-theme на documentElement", async ({ page }) => {
    await page.goto("/");

    const html = page.locator("html");

    await expect(html).toHaveAttribute("data-theme", "dark");

    await page.getByRole("button", { name: "Toggle theme" }).click();
    await expect(html).toHaveAttribute("data-theme", "light");

    await page.getByRole("button", { name: "Toggle theme" }).click();
    await expect(html).toHaveAttribute("data-theme", "dark");
  });
});
