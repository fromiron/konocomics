import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";

import { chromium } from "/home/bell/konocomics/node_modules/@playwright/test/index.mjs";

const root = "/tmp/konocomics-g2-pilot.fjIE7t";
const screenshots = join(root, "screenshots");
const downloads = join(root, "downloads");
const profilePath = join(root, "pilot-browser-one-profile.json");
const url = "http://127.0.0.1:4173/synthetic-pilot/";

await mkdir(screenshots, { recursive: true });
await mkdir(downloads, { recursive: true });

const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
});
const context = await browser.newContext({
  acceptDownloads: true,
  viewport: { width: 1440, height: 1000 },
});
const page = await context.newPage();
const consoleMessages = [];
const pageErrors = [];
const requestFailures = [];
const httpErrors = [];
const requests = [];

page.on("console", (message) => {
  consoleMessages.push({ type: message.type(), text: message.text() });
});
page.on("pageerror", (error) => {
  pageErrors.push(error.message);
});
page.on("requestfailed", (request) => {
  requestFailures.push({ url: request.url(), error: request.failure()?.errorText ?? "unknown" });
});
page.on("response", (response) => {
  if (response.status() >= 400) {
    httpErrors.push({ url: response.url(), status: response.status() });
  }
});
page.on("request", (request) => {
  requests.push({ url: request.url(), method: request.method(), resourceType: request.resourceType() });
});

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function stageSnapshot(label) {
  const heading = await page.locator("h1").innerText();
  const active = await page.evaluate(() => ({
    tag: document.activeElement?.tagName ?? null,
    text: document.activeElement?.textContent?.trim() ?? null,
  }));
  return { label, url: page.url(), heading, active };
}

async function recommendationLists() {
  const sections = page.locator("section.list-section");
  assert((await sections.count()) === 2, "Expected exactly two recommendation lists");
  const result = {};
  for (let index = 0; index < 2; index += 1) {
    const section = sections.nth(index);
    const label = await section.locator("h2").innerText();
    const items = [];
    const cards = section.locator("li.recommendation-card");
    for (let cardIndex = 0; cardIndex < (await cards.count()); cardIndex += 1) {
      const card = cards.nth(cardIndex);
      items.push({
        rank: await card.locator(".rank").innerText(),
        title: await card.locator("h3").innerText(),
      });
    }
    result[label] = items;
  }
  return result;
}

async function captureBlinding(label) {
  const aria = await page.locator("body").ariaSnapshot();
  const state = await page.evaluate(async () => {
    const attributes = [...document.querySelectorAll("*")].flatMap((element) =>
      [...element.attributes]
        .filter((attribute) =>
          attribute.name === "id" ||
          attribute.name === "class" ||
          attribute.name.startsWith("data-") ||
          attribute.name.startsWith("aria-"),
        )
        .map((attribute) => ({
          element: element.tagName,
          name: attribute.name,
          value: attribute.value,
        })),
    );
    const indexedDatabases =
      typeof indexedDB.databases === "function"
        ? (await indexedDB.databases()).map((database) => database.name ?? "")
        : [];
    return {
      url: location.href,
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
      bodyText: document.body.innerText,
      html: document.documentElement.outerHTML,
      attributes,
      jsonLd: [...document.querySelectorAll('script[type="application/ld+json"]')].map(
        (node) => node.textContent ?? "",
      ),
      downloadButtonCount: [...document.querySelectorAll("button")].filter((button) =>
        button.textContent?.includes("結果JSONをダウンロード"),
      ).length,
      downloadAnchorCount: document.querySelectorAll("a[download]").length,
      storage: {
        localStorage: localStorage.length,
        sessionStorage: sessionStorage.length,
        cacheStorage: await caches.keys(),
        indexedDatabases,
      },
    };
  });
  const cookies = await context.cookies();
  const searchable = [
    state.bodyText,
    aria,
    JSON.stringify(state.attributes),
    JSON.stringify(state.jsonLd),
    state.url,
    JSON.stringify(consoleMessages),
  ].join("\n");
  const forbiddenTokens = [
    "Taste Engine",
    "Baseline",
    "tasteScore",
    "baselineScore",
    "confidence",
    "bestAnchor",
    "contribution",
    "penalty",
    "marketSnapshot",
    "maturity",
    "catalogRole",
  ];
  const forbiddenHits = forbiddenTokens.filter((token) =>
    searchable.toLocaleLowerCase("en-US").includes(token.toLocaleLowerCase("en-US")),
  );
  assert(state.pathname === "/synthetic-pilot/", `${label}: unexpected route`);
  assert(state.search === "" && state.hash === "", `${label}: query/hash must be empty`);
  assert(state.downloadButtonCount === 0, `${label}: download button was exposed early`);
  assert(state.downloadAnchorCount === 0, `${label}: download anchor was exposed early`);
  assert(forbiddenHits.length === 0, `${label}: forbidden metadata leaked: ${forbiddenHits.join(", ")}`);
  assert(state.storage.localStorage === 0, `${label}: localStorage was used`);
  assert(state.storage.sessionStorage === 0, `${label}: sessionStorage was used`);
  assert(state.storage.cacheStorage.length === 0, `${label}: CacheStorage was used`);
  assert(state.storage.indexedDatabases.length === 0, `${label}: IndexedDB was used`);
  assert(cookies.length === 0, `${label}: cookies were used`);
  await writeFile(join(root, `${label}.html`), `${state.html}\n`, "utf8");
  await writeFile(join(root, `${label}.aria.txt`), `${aria.trimEnd()}\n`, "utf8");
  return {
    label,
    url: state.url,
    bodyTextSha256: createHash("sha256").update(state.bodyText, "utf8").digest("hex"),
    htmlSha256: createHash("sha256").update(`${state.html}\n`, "utf8").digest("hex"),
    ariaSha256: createHash("sha256").update(`${aria.trimEnd()}\n`, "utf8").digest("hex"),
    attributeCount: state.attributes.length,
    jsonLdCount: state.jsonLd.length,
    downloadButtonCount: state.downloadButtonCount,
    downloadAnchorCount: state.downloadAnchorCount,
    storage: state.storage,
    cookieCount: cookies.length,
    forbiddenHits,
  };
}

async function checkEvery(locator) {
  const count = await locator.count();
  for (let index = 0; index < count; index += 1) {
    await locator.nth(index).check();
  }
  return count;
}

let downloadedPath = "";
let log;
try {
  await page.goto(url, { waitUntil: "networkidle" });
  assert((await page.title()) === "ブラインドテスト | konocomics", "Unexpected page title");
  await page.screenshot({ path: join(screenshots, "01-input.png"), fullPage: true });
  const inputStage = await stageSnapshot("input");
  assert(inputStage.heading === "テストを始める", "Input heading mismatch");
  assert(inputStage.active.tag === "H1", "Input heading did not receive focus");

  await page.locator('input[type="text"]').fill("pilot-browser-one");
  await page.locator('input[type="file"]').setInputFiles(profilePath);
  await page.getByRole("button", { name: "おすすめ一覧を作る" }).click();
  await page.getByRole("heading", { name: "説明を見る前の回答" }).waitFor();
  const beforeStage = await stageSnapshot("before");
  assert(beforeStage.active.tag === "H1", "Before heading did not receive focus");
  const beforeLists = await recommendationLists();
  assert(beforeLists["リストA"]?.length === 10, "List A must preserve ten native results");
  assert(beforeLists["リストB"]?.length === 10, "List B must preserve ten native results");
  const recommendationCardCount = await page.locator(".recommendation-card").count();
  const familiarityInputs = page.locator('input[name^="before-familiarity-"][value="unknown"]');
  const beforeInterestInputs = page.locator('input[name^="before-interest-"][value="4"]');
  const familiarityCount = await familiarityInputs.count();
  const beforeInterestCount = await beforeInterestInputs.count();
  assert(familiarityCount === beforeInterestCount, "Before response group count mismatch");
  assert(familiarityCount >= 10, "Too few distinct before-response works");
  const sharedResponseCount = await page.locator(".shared-answer-note").count();
  assert(sharedResponseCount === recommendationCardCount - familiarityCount, "Shared response count mismatch");
  const beforeSubmit = page.getByRole("button", { name: "説明前の回答を確定する" });
  assert(await beforeSubmit.isDisabled(), "Before submit should start disabled");
  await page.screenshot({ path: join(screenshots, "02-before-top.png"), fullPage: false });
  await checkEvery(familiarityInputs);
  await checkEvery(beforeInterestInputs);
  await page.locator('input[name="before-list-preference"][value="tie"]').check();
  assert(await beforeSubmit.isEnabled(), "Before submit remained disabled");
  await beforeSubmit.scrollIntoViewIfNeeded();
  const beforeBlinding = await captureBlinding("before-ready");
  await page.screenshot({ path: join(screenshots, "03-before-complete.png"), fullPage: false });
  await beforeSubmit.click();

  await page.getByRole("heading", { name: "おすすめ理由を見た後の回答" }).waitFor();
  const afterStage = await stageSnapshot("after");
  assert(afterStage.active.tag === "H1", "After heading did not receive focus");
  const afterLists = await recommendationLists();
  assert(JSON.stringify(afterLists) === JSON.stringify(beforeLists), "Native lists/ranks changed after explanation reveal");
  const afterInterestInputs = page.locator('input[name^="after-interest-"][value="4"]');
  const afterAgreementInputs = page.locator('input[name^="after-agreement-"][value="4"]');
  const afterInterestCount = await afterInterestInputs.count();
  const afterAgreementCount = await afterAgreementInputs.count();
  assert(afterInterestCount === recommendationCardCount, "After response count does not match list occurrences");
  const noExplanationCount = await page.getByText("説明はありません。", { exact: true }).count();
  assert(afterAgreementCount + noExplanationCount === recommendationCardCount, "Explanation/agreement cardinality mismatch");
  const afterSubmit = page.getByRole("button", { name: "最終回答を確定する" });
  assert(await afterSubmit.isDisabled(), "Final submit should start disabled");
  await page.screenshot({ path: join(screenshots, "04-after-top.png"), fullPage: false });
  await checkEvery(afterInterestInputs);
  await checkEvery(afterAgreementInputs);
  assert(await afterSubmit.isEnabled(), "Final submit remained disabled");
  await afterSubmit.scrollIntoViewIfNeeded();
  const afterBlinding = await captureBlinding("after-ready");
  await page.screenshot({ path: join(screenshots, "05-after-complete.png"), fullPage: false });
  await afterSubmit.click();

  await page.getByRole("heading", { name: "回答が完了しました" }).waitFor();
  const completeStage = await stageSnapshot("complete");
  assert(completeStage.active.tag === "H1", "Complete heading did not receive focus");
  const debriefText = await page.locator(".debrief").innerText();
  assert(debriefText.includes("Taste Engine"), "Taste identity missing from final debrief");
  assert(debriefText.includes("Baseline"), "Baseline identity missing from final debrief");
  await page.screenshot({ path: join(screenshots, "06-complete.png"), fullPage: true });

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "結果JSONをダウンロード" }).click();
  const download = await downloadPromise;
  downloadedPath = join(downloads, download.suggestedFilename());
  await download.saveAs(downloadedPath);
  assert((await page.locator(".download-status").innerText()).includes("ダウンロードしました"), "Download status missing");
  const bytes = await readFile(downloadedPath);
  const result = JSON.parse(bytes.toString("utf8"));
  assert(result.participantId === "pilot-browser-one", "Downloaded participant mismatch");
  assert(result.respondent?.kind === "syntheticPilot", "Downloaded respondent is not synthetic pilot");
  assert(result.respondent?.label === "manual-round-trip", "Downloaded respondent label mismatch");
  assert(bytes.at(-1) === 10 && bytes.at(-2) !== 10, "Downloaded JSON must have one final LF");
  const downloadedSha256 = createHash("sha256").update(bytes).digest("hex");
  const externalRequests = requests.filter((request) => new URL(request.url).host !== "127.0.0.1:4173");
  assert(externalRequests.length === 0, "Browser made an external request");
  assert(pageErrors.length === 0, "Browser emitted a page error");
  assert(requestFailures.length === 0, "Browser emitted a failed request");

  log = {
    runtime: {
      browser: await browser.version(),
      executablePath: "/usr/bin/google-chrome",
      headless: true,
      viewport: { width: 1440, height: 1000 },
    },
    entry: { url, title: await page.title() },
    stages: [inputStage, beforeStage, afterStage, completeStage],
    interactions: {
      profilePath: basename(profilePath),
      beforeLists,
      afterLists,
      recommendationCardCount,
      distinctBeforeWorkCount: familiarityCount,
      sharedResponseCount,
      beforeInterestCount,
      listPreference: "tie",
      afterInterestCount,
      afterAgreementCount,
      noExplanationCount,
      downloadedFilename: basename(downloadedPath),
      downloadedSha256,
      downloadedBytes: bytes.length,
    },
    blinding: {
      beforeForbiddenLabelsAbsent: true,
      afterForbiddenLabelsAbsent: true,
      engineIdentityRevealedOnlyAtComplete: true,
      before: beforeBlinding,
      after: afterBlinding,
    },
    diagnostics: {
      requests,
      externalRequestCount: externalRequests.length,
      consoleMessages,
      pageErrors,
      requestFailures,
      httpErrors,
      knownNonBlockingServerResponse: {
        url: "http://127.0.0.1:4173/favicon.ico",
        status: 404,
        evidence: "Python static-server log; no application document, script, stylesheet, or data request failed",
      },
    },
  };
  await writeFile(join(root, "browser-pilot-log.json"), `${JSON.stringify(log, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify(log, null, 2)}\n`);
} finally {
  await context.close();
  await browser.close();
}
