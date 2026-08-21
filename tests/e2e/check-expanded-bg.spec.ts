import { test } from "@playwright/test";
test("expanded bg fills", async ({ page }) => {
  await page.goto("/?landing=1");
  await page.waitForTimeout(800);
  const secondCard = page.locator("[data-card-presentation=\"showcase\"]").nth(1);
  await secondCard.hover();
  await page.waitForTimeout(500);
  const cardBox = await secondCard.boundingBox();
  const bg = secondCard.locator(".cover-image").first();
  const bgBox = await bg.boundingBox();
  console.log("expanded card", cardBox);
  console.log("bg", bgBox);
  // bg should be larger than card due to scale
  if (cardBox && bgBox) {
    console.log("bg width vs card width", bgBox.width, cardBox.width, bgBox.width / cardBox.width);
  }
});
