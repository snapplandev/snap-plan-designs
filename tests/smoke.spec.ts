import { expect, test } from "@playwright/test";

test.describe("Marketing smoke", () => {
  test("home and pricing render", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Snap Plan Designs home" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "From rough ideas to contractor-ready plans." })).toBeVisible();

    await page.goto("/pricing");
    await expect(page.getByRole("heading", { name: "Pricing" })).toBeVisible();
    await expect(page.getByText("Compare packages")).toBeVisible();
  });
});
