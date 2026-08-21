import { test } from "@playwright/test";
test("expanded fg after hover", async ({ page }) => {
  await page.goto("/?landing=1");
  await page.waitForTimeout(800);
  const second = page.locator("[data-card-presentation=\"showcase\"]").nth(1);
  await second.hover();
  await page.waitForTimeout(500);
  const cardBox = await second.boundingBox();
  const fg = second.locator(".cover-image").nth(1);
  const fgBox = await fg.boundingBox();
  console.log("expanded card", cardBox);
  console.log("fg after hover", fgBox);
  if (cardBox && fgBox) {
    console.log("ratio", fgBox.width / cardBox.width);
  }
  await page.screenshot({ path: "C:/Users/Bell/AppData/Local/Temp/opencode/hover_expanded_red.png" });
});
