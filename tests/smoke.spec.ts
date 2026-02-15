import { expect, test } from "@playwright/test";

const TEST_EMAIL = process.env.TEST_EMAIL?.trim();
const TEST_PASSWORD = process.env.TEST_PASSWORD?.trim();

test.describe("Pre-Stripe smoke", () => {
  test.skip(
    !TEST_EMAIL || !TEST_PASSWORD,
    "Set TEST_EMAIL and TEST_PASSWORD in your local environment.",
  );

  test("login, submit intake, and confirm dashboard persistence", async ({ page }) => {
    const datasetTag = new Date().toISOString().replace(/[-:.TZ]/g, "");
    const projectTitle = `E2E_SMOKE_${datasetTag}`;

    await page.goto("/login");
    await page.getByLabel("Email").fill(TEST_EMAIL as string);
    await page.getByLabel("Password").fill(TEST_PASSWORD as string);
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page).toHaveURL(/\/app$/);
    await expect(page.getByRole("heading", { name: "Projects" })).toBeVisible();

    await page.getByRole("link", { name: "New Project" }).click();
    await expect(page).toHaveURL(/\/app\/projects\/new$/);

    await page.getByLabel("Project title").fill(projectTitle);
    await page.getByRole("button", { name: "Next" }).click();

    await page.getByLabel("Goals").fill("Smoke test minimum intake goals.");
    await page.getByRole("button", { name: "Next" }).click();
    await page.getByRole("button", { name: "Next" }).click();
    await page.getByRole("button", { name: "Next" }).click();

    await page.getByRole("button", { name: "Submit Intake" }).click();
    await expect(page).toHaveURL(/\/app\/projects\/[^/?#]+$/, { timeout: 20_000 });
    await expect(
      page.getByRole("status", {
        name: /Project status: Submitted/i,
      }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: projectTitle })).toBeVisible();

    await page.goto("/app");
    await expect(page.getByRole("heading", { name: "Projects" })).toBeVisible();
    await expect(page.getByRole("heading", { name: projectTitle })).toBeVisible();
    await expect(
      page.locator(`article[aria-label="Project ${projectTitle}"]`).getByRole("status", {
        name: /Project status: Submitted/i,
      }),
    ).toBeVisible();
  });
});
