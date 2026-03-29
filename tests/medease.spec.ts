import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("redirects root to doctors and supports filtering", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/doctors$/);
  await expect(page.getByText("Showing 6 doctors")).toBeVisible();

  await page.getByRole("button", { name: "Cardiologist" }).click();
  await expect(page.getByText("Showing 1 doctors")).toBeVisible();

  await page.getByLabel("City").selectOption("Mumbai");
  await page.getByLabel("Search by symptom or doctor name").fill("priya");
  await expect(page.getByRole("heading", { name: "Dr. Priya Menon" })).toBeVisible();
});

test("completes the booking flow and shows the success state", async ({ page }, testInfo) => {
  await page.goto("/doctors");
  const doctorIndex = testInfo.project.name === "mobile-chrome" ? 1 : 0;
  await page.getByRole("button", { name: "Book Appointment" }).nth(doctorIndex).click();
  await expect(page).toHaveURL(/\/booking\?doctorId=/);

  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByText("Please select a date and time slot to continue.")).toBeVisible();

  const dayCards = page.getByTestId("day-card");
  const totalDays = await dayCards.count();
  let selected = false;

  for (let index = 0; index < totalDays; index += 1) {
    await dayCards.nth(index).click();
    const enabledSlots = page.locator('[data-testid="slot-button"]:not([disabled])');
    if ((await enabledSlots.count()) > 0) {
      await enabledSlots.first().click();
      selected = true;
      break;
    }
  }

  expect(selected).toBe(true);
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByLabel("Patient Name").fill("Asha Rao");
  await page.getByLabel("Age").fill("31");
  await page.getByLabel("Phone Number").fill("9876543210");
  await page.getByLabel("Female").check();
  await page.getByLabel("Reason for Visit").fill("Recurring chest tightness.");
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(page.getByText("Select Payment Method")).toBeVisible();
  await page.getByRole("button", { name: /Net Banking/i }).click();
  await page.getByRole("button", { name: "Confirm Appointment" }).click();

  await expect(page.getByText("Appointment Confirmed!")).toBeVisible();
  await page.getByRole("button", { name: "Book Another Appointment" }).click();
  await expect(page).toHaveURL(/\/doctors$/);
});

test("meets the core responsive and accessibility expectations", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/doctors");

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
  );
  expect(overflow).toBe(true);

  const badges = page.getByTestId("available-today-badge");
  await expect(badges).toHaveCount(3);

  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});
