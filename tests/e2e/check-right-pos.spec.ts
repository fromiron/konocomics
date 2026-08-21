import { test } from "@playwright/test";
test("check right pos", async ({ page }) => {
  await page.goto("/?landing=1");
  await page.waitForTimeout(800);
  const second = page.locator("[data-card-presentation=\"showcase\"]").nth(1);
  await second.hover();
  await page.waitForTimeout(500);
  const fg = second.locator(".cover-image").nth(1);
  const style = await fg.evaluate((el) => {
    const cs = getComputedStyle(el);
    return { right: cs.right, left: cs.left, width: cs.width, position: cs.position, inset: cs.inset };
  });
  console.log(style);
  const cardBox = await second.boundingBox();
  const fgBox = await fg.boundingBox();
  console.log("cardBox", cardBox, "fgBox", fgBox);
});
