import { test } from "@playwright/test";
test("check second fg", async ({ page }) => {
  await page.goto("/?landing=1");
  await page.waitForTimeout(800);
  const card = page.locator("[data-card-presentation=\"showcase\"]").nth(1);
  const fg = card.locator(".cover-image").nth(1);
  const bg = card.locator(".cover-image").nth(0);
  const cardBox = await card.boundingBox();
  const fgBox = await fg.boundingBox();
  const bgBox = await bg.boundingBox();
  console.log("card", cardBox);
  console.log("fg", fgBox);
  console.log("bg", bgBox);
});
