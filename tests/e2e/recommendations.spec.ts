import { readFile } from "node:fs/promises";

import { expect, test, type Page } from "@playwright/test";

import catalogJson from "@/data/generated/catalog-v1.json" with { type: "json" };

type StoredUserWork = {
  workId: string;
  readingState: string;
  updatedAt?: string;
  reaction?: string;
  negativeReasons?: string[];
  progress?: { volume?: number; chapter?: number };
};

type StoredRecommendationCache = {
  inputHash: string;
  plan: Array<{ workId: string }>;
};

type StoredProviderCache = {
  workId: string;
  isbn: string;
};

type StoredExternalWork = {
  id: string;
  normalizedKey: string;
  title: string;
  creators: string[];
  isbnSamples: string[];
  coverUrl?: string;
  record: StoredUserWork & { updatedAt: string };
};

type StoredOnboardingDraft = {
  id: string;
  mode: "firstRun" | "add";
  step: number;
  positiveEntries: Array<{ workId: string; reaction: string }>;
  negativeEntries: unknown[];
  updatedAt: string;
};

type StoredProfileEntry = {
  key: string;
  value: unknown;
};

type ProductState = {
  userWorks: StoredUserWork[];
  externalWorks: StoredExternalWork[];
  onboardingDraft: StoredOnboardingDraft[];
  profile: StoredProfileEntry[];
  recommendationCache: StoredRecommendationCache[];
  providerCache: StoredProviderCache[];
  meta: Array<{ key: string; value: unknown }>;
};

type DownloadedExportFile = {
  format: "konocomics-export";
  schemaVersion: 1;
  exportedAt: string;
  catalogVersion: string;
  userWorks: StoredUserWork[];
  externalWorks: StoredExternalWork[];
  profile: {
    adjustments: unknown;
    policies: {
      preferCompleted: boolean;
      preferHidden: boolean;
      preferVerified: boolean;
      excludeIncomplete: boolean;
    };
    onboardingCompletedAt: string | null;
  };
  onboardingDraft: StoredOnboardingDraft | null;
};

const representativeWorkByIsbn = new Map(
  Object.entries(catalogJson.representativeVolumeByWorkId).flatMap(
    ([workId, representativeVolumeId]) => {
      const volume = catalogJson.volumes.find(
        (candidate) => candidate.id === representativeVolumeId && candidate.workId === workId,
      );
      return volume === undefined ? [] : [[volume.isbn, workId] as const];
    },
  ),
);
const catalogWorkById = new Map(catalogJson.works.map((work) => [work.id, work] as const));

async function readProductState(page: Page): Promise<ProductState> {
  return page.evaluate(async () => {
    const requestResult = <T>(request: IDBRequest<T>) =>
      new Promise<T>((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    const database = await requestResult(indexedDB.open("konocomics"));
    const storeNames = [
      "userWorks",
      "externalWorks",
      "profile",
      "onboardingDraft",
      "recommendationCache",
      "providerCache",
      "meta",
    ] as const;
    const transaction = database.transaction([...storeNames], "readonly");
    const completion = new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
    const [
      userWorks,
      externalWorks,
      profile,
      onboardingDraft,
      recommendationCache,
      providerCache,
      meta,
    ] = await Promise.all(
      storeNames.map((name) => requestResult(transaction.objectStore(name).getAll())),
    );
    await completion;
    const state = {
      userWorks,
      externalWorks,
      profile,
      onboardingDraft,
      recommendationCache,
      providerCache,
      meta,
    };
    database.close();
    return state as ProductState;
  });
}

function stateBytes(state: ProductState) {
  return JSON.stringify(state);
}

function jsonNormalized(value: unknown): unknown {
  const serialized = JSON.stringify(value);
  return serialized === undefined ? undefined : (JSON.parse(serialized) as unknown);
}

function profileValues(state: ProductState) {
  return Object.fromEntries(state.profile.map((entry) => [entry.key, entry.value]));
}

function expectCurrentRuntimeMeta(state: ProductState, catalogVersion: string) {
  expect(Object.fromEntries(state.meta.map((entry) => [entry.key, entry.value]))).toEqual({
    catalogVersion,
    schemaVersion: 2,
  });
}

function expectEmptyDataStores(state: ProductState) {
  expect({
    userWorks: state.userWorks,
    externalWorks: state.externalWorks,
    profile: state.profile,
    onboardingDraft: state.onboardingDraft,
    recommendationCache: state.recommendationCache,
    providerCache: state.providerCache,
  }).toEqual({
    userWorks: [],
    externalWorks: [],
    profile: [],
    onboardingDraft: [],
    recommendationCache: [],
    providerCache: [],
  });
}

async function downloadExport(page: Page) {
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "エクスポート", exact: true }).click();
  const download = await downloadPromise;
  expect(await download.failure()).toBeNull();
  expect(download.suggestedFilename()).toMatch(/^konocomics-export-\d{8}\.json$/u);
  const path = await download.path();
  if (path === null) throw new Error("The export download did not produce a local file");
  const buffer = await readFile(path);
  const file = JSON.parse(buffer.toString("utf8")) as DownloadedExportFile;
  return { buffer, file, filename: download.suggestedFilename() };
}

async function selectImportFile(page: Page, filename: string, buffer: Buffer) {
  await page.locator('input[type="file"]').setInputFiles({
    name: filename,
    mimeType: "application/json",
    buffer,
  });
}

async function confirmImport(page: Page) {
  const preview = page.locator('[data-import-state="ready"]');
  await expect(preview).toBeVisible();
  await preview.getByRole("button", { name: "置き換える内容を確認" }).click();
  const dialog = page.getByRole("dialog", { name: "現在のデータを置き換えますか？" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "置き換える", exact: true }).click();
  await expect(
    page.getByText("データを復元しました。おすすめは次に開いたときに再計算されます。", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.locator('input[type="file"]')).toBeFocused();
}

async function deleteAllDataThroughSettings(page: Page) {
  await page.getByRole("button", { name: "すべて削除", exact: true }).click();
  const dialog = page.getByRole("alertdialog", { name: "すべてのデータを削除しますか？" });
  await expect(dialog).toBeVisible();
  const submit = dialog.getByRole("button", { name: "削除する", exact: true });
  await expect(submit).toBeDisabled();
  await dialog.getByRole("textbox", { name: "確認のため「削除」と入力してください" }).fill("削除");
  await expect(submit).toBeEnabled();
  await submit.click();
  await expect(page).toHaveURL(/\/$/u);
  await expect(page.locator('main[data-landing-state="introduction"]')).toBeVisible();
}

async function openSettingsFromLanding(page: Page) {
  const settingsLink = page.getByRole("link", { name: "設定・データ管理", exact: true });
  await expect(settingsLink).toHaveAttribute("href", "/settings");
  await settingsLink.click();
  await expect(page).toHaveURL(/\/settings$/u);
  await expect(page.getByRole("heading", { level: 1, name: "設定" })).toBeVisible();
}

async function putRawExternalWork(page: Page, record: StoredExternalWork): Promise<void> {
  await page.evaluate(async (value) => {
    const requestResult = <T>(request: IDBRequest<T>) =>
      new Promise<T>((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    const database = await requestResult(indexedDB.open("konocomics"));
    const transaction = database.transaction("externalWorks", "readwrite");
    const completion = new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
    await requestResult(transaction.objectStore("externalWorks").put(value));
    await completion;
    database.close();
  }, record);
}

async function openLibrarySearch(page: Page, query: string) {
  await page.getByRole("button", { name: "作品を追加" }).first().click();
  const dialog = page.getByRole("dialog", { name: "作品を追加" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("searchbox", { name: "タイトル・作者名で検索" }).fill(query);
  return dialog;
}

async function activeControl(page: Page) {
  return page.evaluate(() => {
    const element = document.activeElement;
    if (!(element instanceof HTMLElement)) return null;
    return {
      ariaLabel: element.getAttribute("aria-label") ?? "",
      ariaPressed: element.getAttribute("aria-pressed"),
      checked: element instanceof HTMLInputElement ? element.checked : null,
      disabled: element.matches(":disabled"),
      labelText:
        element instanceof HTMLInputElement
          ? [...(element.labels ?? [])]
              .map((label) => label.textContent?.trim().replace(/\s+/gu, " ") ?? "")
              .join(" ")
          : (element.closest("label")?.textContent?.trim().replace(/\s+/gu, " ") ?? ""),
      role: element.getAttribute("role") ?? element.tagName.toLowerCase(),
      text: element.textContent?.trim().replace(/\s+/gu, " ") ?? "",
    };
  });
}

async function tabUntil(
  page: Page,
  label: RegExp,
  maximumTabs = 120,
  key: "Tab" | "Shift+Tab" = "Tab",
) {
  for (let index = 0; index < maximumTabs; index += 1) {
    await page.keyboard.press(key);
    const active = await activeControl(page);
    if (active !== null && label.test(`${active.ariaLabel} ${active.labelText} ${active.text}`)) {
      return active;
    }
  }
  throw new Error(`Keyboard target was not reached: ${String(label)}`);
}

async function selectFreshShelfWorks(page: Page, count: number) {
  let selected = 0;
  for (let attempts = 0; selected < count && attempts < 30; attempts += 1) {
    const active = await activeControl(page);
    expect(active?.role).toBe("button");
    expect(active?.ariaLabel).toMatch(/好きに追加|選択を解除/u);
    if (active?.ariaPressed !== "true") {
      await page.keyboard.press("Enter");
      await expect(page.locator(":focus")).toHaveAttribute("aria-pressed", "true");
      selected += 1;
    }
    await page.keyboard.press("ArrowRight");
  }
  expect(selected).toBe(count);
}

type KeyboardOnboardingObservations = Readonly<{
  alreadyOnOnboarding?: boolean;
  afterInitialNavigation?: (page: Page) => Promise<void>;
  beforeStepTwo?: (page: Page) => Promise<void>;
  afterStepTwo?: (page: Page) => Promise<void>;
  afterTasteNavigation?: (page: Page) => Promise<void>;
}>;

async function completeKeyboardOnboarding(
  page: Page,
  observations: KeyboardOnboardingObservations = {},
) {
  if (observations.alreadyOnOnboarding !== true) {
    await page.goto("/onboarding");
  } else {
    await expect(page).toHaveURL(/\/onboarding$/u);
  }
  await observations.afterInitialNavigation?.(page);
  await expect(
    page.getByRole("heading", { level: 1, name: "好きなマンガを 5〜10 作品えらんでください" }),
  ).toBeFocused();

  await page.keyboard.press("Tab");
  const positiveSearch = page.getByRole("searchbox", { name: "好きなマンガを検索" });
  await expect(positiveSearch).toBeFocused();
  await page.keyboard.type("鋼の錬金術師");
  const searchResults = page.locator(".work-search-grid");
  await expect(searchResults).toBeVisible();
  const fullmetalSelection = searchResults.getByRole("button", {
    name: "鋼の錬金術師 — 好きに追加",
  });
  await expect(fullmetalSelection).toBeVisible();
  await tabUntil(page, /鋼の錬金術師 — 好きに追加/u, 20);
  await expect(fullmetalSelection).toBeFocused();
  await page.keyboard.press("Enter");
  const fullmetalSelected = searchResults.getByRole("button", {
    name: "鋼の錬金術師 — 選択を解除",
  });
  await expect(fullmetalSelected).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("Tab");
  const favoriteButton = page.getByRole("button", {
    name: "鋼の錬金術師 — 大好きにする",
  });
  await expect(favoriteButton).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("button", { name: "鋼の錬金術師 — 好きに戻す" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );

  await tabUntil(page, /^\s*好きなマンガを検索\s*$/u, 20, "Shift+Tab");
  await expect(positiveSearch).toBeFocused();
  await page.keyboard.press("Control+A");
  await page.keyboard.press("Backspace");
  await expect(searchResults).toBeHidden();
  await tabUntil(page, /好きに追加|選択を解除/u, 20);
  await selectFreshShelfWorks(page, 3);
  await expect
    .poll(async () => (await readProductState(page)).onboardingDraft[0]?.positiveEntries.length)
    .toBe(4);

  await page.reload();
  await expect(
    page.getByRole("heading", { level: 1, name: "好きなマンガを 5〜10 作品えらんでください" }),
  ).toBeFocused();
  await expect
    .poll(async () => {
      const entries = (await readProductState(page)).onboardingDraft[0]?.positiveEntries ?? [];
      return {
        count: entries.length,
        favorites: entries.filter((entry) => entry.reaction === "favorite").length,
      };
    })
    .toEqual({ count: 4, favorites: 1 });

  await tabUntil(page, /^\s*好きなマンガを検索\s*$/u, 20);
  await expect(page.getByRole("searchbox", { name: "好きなマンガを検索" })).toBeFocused();
  await tabUntil(page, /好きに追加|選択を解除/u, 20);
  await selectFreshShelfWorks(page, 4);
  await expect
    .poll(async () => (await readProductState(page)).onboardingDraft[0]?.positiveEntries.length)
    .toBe(8);

  await observations.beforeStepTwo?.(page);
  const next = await tabUntil(page, /^\s*次へ \(8\/10\)\s*$/u);
  expect(next.disabled).toBe(false);
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "合わなかった・途中でやめたマンガはありますか？",
    }),
  ).toBeFocused();
  await observations.afterStepTwo?.(page);

  await page.keyboard.press("Tab");
  const negativeSearch = page.getByRole("searchbox", { name: "合わなかったマンガを検索" });
  await expect(negativeSearch).toBeFocused();
  await page.keyboard.type("MONSTER");
  const candidateGroup = page.getByRole("group", { name: "MONSTER — この作品について" });
  await expect(candidateGroup).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(candidateGroup.getByRole("radio", { name: "合わなかった" })).toBeFocused();
  await page.keyboard.press("Space");
  const selectedGroup = page.getByRole("group", { name: "MONSTER — この作品について" });
  const selectedDisposition = selectedGroup.getByRole("radio", { name: "合わなかった" });
  await expect(selectedDisposition).toBeChecked();
  await expect(selectedDisposition).toBeFocused();
  await page.keyboard.press("Tab");
  const reason = page.getByRole("checkbox", { name: "展開が遅い" });
  await expect(reason).toBeFocused();
  await page.keyboard.press("Space");
  await expect(reason).toBeChecked();
  await tabUntil(page, /^\s*好みを見る\s*$/u, 40);
  await page.keyboard.press("Enter");

  await observations.afterTasteNavigation?.(page);

  await expect(page.getByRole("heading", { level: 1, name: "あなたの Manga DNA" })).toBeVisible();
  await expect
    .poll(async () => {
      const state = await readProductState(page);
      return {
        draftCount: state.onboardingDraft.length,
        favoriteCount: state.userWorks.filter((record) => record.reaction === "favorite").length,
        monster: state.userWorks.find((record) => record.workId === "monster"),
        workCount: state.userWorks.length,
      };
    })
    .toEqual({
      draftCount: 0,
      favoriteCount: 1,
      monster: expect.objectContaining({
        readingState: "completed",
        reaction: "disliked",
        negativeReasons: ["tooSlow"],
      }),
      workCount: 9,
    });

  const recommendationsLink = page.getByRole("link", { name: "おすすめを見る" });
  await expect(recommendationsLink).toBeVisible({ timeout: 10_000 });
  await tabUntil(page, /^\s*おすすめを見る\s*$/u);
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/recommendations$/u);
  await expect(page.getByRole("heading", { level: 1, name: "あなたへのおすすめ" })).toBeVisible();
  await expect(page.locator("li[data-recommendation-work-id]:not([data-carousel-clone])")).toHaveCount(10);
}

async function recommendationIds(page: Page) {
  return page
    .locator("li[data-recommendation-work-id]:not([data-carousel-clone])")
    .evaluateAll((elements) =>
      elements
        .map((element) => element.getAttribute("data-recommendation-work-id"))
        .filter((workId): workId is string => workId !== null),
    );
}

async function openRecommendationFilters(page: Page) {
  if ((page.viewportSize()?.width ?? Number.POSITIVE_INFINITY) >= 768) return;
  const toggle = page.getByRole("button", { name: /絞り込み/u });
  await expect(toggle).toBeVisible();
  if ((await toggle.getAttribute("aria-expanded")) !== "true") await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
}

async function openRecommendationDetail(page: Page, workId: string) {
  const item = page.locator(`li[data-recommendation-work-id='${workId}']`);
  await item.getByRole("link", { name: /作品詳細を見る$/u }).click();
  if (await page.evaluate(() => window.matchMedia("(hover: none), (pointer: coarse)").matches)) {
    const preview = page.getByRole("dialog");
    await expect(preview).toBeVisible();
    await preview.getByRole("link", { name: "作品詳細を見る", exact: true }).click();
  }
  await expect(page).toHaveURL(new RegExp(`/works/${workId}$`, "u"));
}

type LateFactorProbe = {
  firstRow: HTMLElement;
  secondRow: HTMLElement;
  enteredAt: number | null;
  firstChangedAt: number | null;
  secondChangedAt: number | null;
};

async function verifyLateViewportFactorReveal(page: Page) {
  const narrativeDisclosure = page.getByRole("button", { name: "展開の詳細設定" });
  await expect(narrativeDisclosure).toHaveAttribute("aria-expanded", "false");
  await narrativeDisclosure.dispatchEvent("click");
  await expect(narrativeDisclosure).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("[data-reveal-ready='true']").first()).toBeAttached({
    timeout: 3_000,
  });
  const setup = await page.evaluate(() => {
    const scaleX = (row: HTMLElement) => {
      const element = row.querySelector<HTMLElement>(".taste-factor-bar__fill");
      if (element === null) return 0;
      const transform = getComputedStyle(element).transform;
      return transform === "none" ? 1 : new DOMMatrixReadOnly(transform).a;
    };
    const visibleRatio = (element: HTMLElement | null) => {
      if (element === null) return 0;
      const rect = element.getBoundingClientRect();
      const visibleHeight = Math.max(
        0,
        Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0),
      );
      return rect.height === 0 ? 0 : visibleHeight / rect.height;
    };
    const candidates = [...document.querySelectorAll<HTMLElement>(".taste-factor-group")]
      .flatMap((group) => {
        const rows = [...group.querySelectorAll<HTMLElement>(".taste-factor-row")];
        return rows.slice(0, -1).flatMap((firstRow, index) => {
          const secondRow = rows[index + 1];
          if (secondRow === undefined) return [];
          const firstValue = Number(
            firstRow.querySelector<HTMLElement>("[role='meter']")?.getAttribute("aria-valuenow"),
          );
          const secondValue = Number(
            secondRow.querySelector<HTMLElement>("[role='meter']")?.getAttribute("aria-valuenow"),
          );
          const firstFill = firstRow.querySelector<HTMLElement>("[data-reveal-ready='true']");
          const secondFill = secondRow.querySelector<HTMLElement>("[data-reveal-ready='true']");
          if (
            firstFill === null ||
            secondFill === null ||
            firstValue <= 0.04 ||
            secondValue <= 0.04
          ) {
            return [];
          }
          return [{ firstRow, secondRow }];
        });
      })
      .filter(({ firstRow }) => firstRow.getBoundingClientRect().top > window.innerHeight + 16)
      .sort(
        (left, right) =>
          left.firstRow.getBoundingClientRect().top - right.firstRow.getBoundingClientRect().top,
      );
    const selected = candidates[0];
    if (selected === undefined) return { found: false, firstScale: null, secondScale: null };

    const probe: LateFactorProbe = {
      ...selected,
      enteredAt: null,
      firstChangedAt: null,
      secondChangedAt: null,
    };
    (
      window as typeof window & { __konocomicsLateFactorProbe?: LateFactorProbe }
    ).__konocomicsLateFactorProbe = probe;

    const sample = (now: number) => {
      if (
        probe.enteredAt === null &&
        visibleRatio(probe.firstRow.querySelector<HTMLElement>(".taste-factor-bar__track")) >=
          0.4 &&
        visibleRatio(probe.secondRow.querySelector<HTMLElement>(".taste-factor-bar__track")) >= 0.4
      ) {
        probe.enteredAt = now;
      }
      if (probe.enteredAt !== null) {
        if (probe.firstChangedAt === null && scaleX(probe.firstRow) > 0.01) {
          probe.firstChangedAt = now;
        }
        if (probe.secondChangedAt === null && scaleX(probe.secondRow) > 0.01) {
          probe.secondChangedAt = now;
        }
      }
      if (probe.firstChangedAt === null || probe.secondChangedAt === null) {
        requestAnimationFrame(sample);
      }
    };
    requestAnimationFrame(sample);
    return {
      found: true,
      firstScale: scaleX(selected.firstRow),
      secondScale: scaleX(selected.secondRow),
    };
  });

  expect(setup).toEqual({ found: true, firstScale: 0, secondScale: 0 });
  let reachedLatePair = false;
  for (let attempt = 0; attempt < 40; attempt += 1) {
    reachedLatePair = await page.evaluate(() => {
      const probe = (window as typeof window & { __konocomicsLateFactorProbe?: LateFactorProbe })
        .__konocomicsLateFactorProbe;
      if (probe === undefined) return false;
      const visibleRatio = (element: HTMLElement | null) => {
        if (element === null) return 0;
        const rect = element.getBoundingClientRect();
        const visibleHeight = Math.max(
          0,
          Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0),
        );
        return rect.height === 0 ? 0 : visibleHeight / rect.height;
      };
      return (
        visibleRatio(probe.firstRow.querySelector<HTMLElement>(".taste-factor-bar__track")) >=
          0.4 &&
        visibleRatio(probe.secondRow.querySelector<HTMLElement>(".taste-factor-bar__track")) >= 0.4
      );
    });
    if (reachedLatePair) break;
    await page.mouse.wheel(0, 240);
    await page.evaluate(
      () =>
        new Promise<void>((resolve) => {
          requestAnimationFrame(() => resolve());
        }),
    );
  }
  expect(reachedLatePair).toBe(true);

  await expect
    .poll(() =>
      page.evaluate(() => {
        const probe = (window as typeof window & { __konocomicsLateFactorProbe?: LateFactorProbe })
          .__konocomicsLateFactorProbe;
        return probe?.firstChangedAt !== null && probe?.secondChangedAt !== null;
      }),
    )
    .toBe(true);
  const timing = await page.evaluate(() => {
    const probe = (window as typeof window & { __konocomicsLateFactorProbe?: LateFactorProbe })
      .__konocomicsLateFactorProbe;
    if (
      probe?.enteredAt === null ||
      probe?.enteredAt === undefined ||
      probe.firstChangedAt === null ||
      probe.secondChangedAt === null
    ) {
      return null;
    }
    return {
      firstAfterViewportMs: probe.firstChangedAt - probe.enteredAt,
      localStaggerMs: probe.secondChangedAt - probe.firstChangedAt,
    };
  });
  expect(timing).not.toBeNull();
  expect(timing?.firstAfterViewportMs).toBeLessThan(600);
  expect(timing?.localStaggerMs).toBeGreaterThanOrEqual(20);
  expect(timing?.localStaggerMs).toBeLessThan(200);

  await expect
    .poll(() =>
      page.evaluate(() => {
        const probe = (window as typeof window & { __konocomicsLateFactorProbe?: LateFactorProbe })
          .__konocomicsLateFactorProbe;
        return (
          probe !== undefined &&
          probe.firstRow.querySelector(".taste-factor-bar__fill--reveal") === null &&
          probe.secondRow.querySelector(".taste-factor-bar__fill--reveal") === null
        );
      }),
    )
    .toBe(true);
  await page.mouse.wheel(0, -10_000);
  await page.mouse.wheel(0, 10_000);
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      }),
  );
  expect(
    await page.evaluate(() => {
      const probe = (window as typeof window & { __konocomicsLateFactorProbe?: LateFactorProbe })
        .__konocomicsLateFactorProbe;
      return (
        probe !== undefined &&
        probe.firstRow.querySelector(".taste-factor-bar__fill--reveal") === null &&
        probe.secondRow.querySelector(".taste-factor-bar__fill--reveal") === null
      );
    }),
  ).toBe(true);
  await narrativeDisclosure.dispatchEvent("click");
  await expect(narrativeDisclosure).toHaveAttribute("aria-expanded", "false");
  await expect(page).toHaveURL(/\/taste$/u);
}

test.describe("Slice 7 recommendation journeys", () => {
  test("core journey keeps grounded recommendations stable across reload", async ({
    page,
  }, testInfo) => {
    test.setTimeout(120_000);
    const itemRequests: Array<{ isbn: string; workId: string }> = [];
    const fatalRuntimeMessages: string[] = [];
    const pageEntryObservations: Array<{ owner: "onboarding" | "taste"; pathname: string }> = [];
    let firstResponseReleased = false;
    let laterRequestStartedBeforeFirstResponse = false;
    let tastePageEntryArmed = false;
    let onboardingReductionStarted = false;
    let tasteReductionStarted = false;
    let onboardingEntriesBeforeStepTwo = 0;
    let resolveFirstResponse!: () => void;
    let resolveOnboardingReduction!: () => void;
    let rejectOnboardingReduction!: (reason?: unknown) => void;
    let resolveTasteReduction!: () => void;
    let rejectTasteReduction!: (reason?: unknown) => void;
    const firstResponseGate = new Promise<void>((resolve) => {
      resolveFirstResponse = resolve;
    });
    const onboardingReduction = new Promise<void>((resolve, reject) => {
      resolveOnboardingReduction = resolve;
      rejectOnboardingReduction = reject;
    });
    const tasteReduction = new Promise<void>((resolve, reject) => {
      resolveTasteReduction = resolve;
      rejectTasteReduction = reject;
    });

    const recordFatalRuntimeMessage = (message: string) => {
      if (/hydration|indexeddb.*(?:server|window)|window is not defined/iu.test(message)) {
        fatalRuntimeMessages.push(message);
      }
    };
    page.on("pageerror", (error) => recordFatalRuntimeMessage(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") recordFatalRuntimeMessage(message.text());
    });

    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.exposeFunction(
      "__recordKonocomicsPageEntryB",
      (pathname: string, owner: "onboarding" | "taste") => {
        pageEntryObservations.push({ owner, pathname });
        if (owner === "onboarding" && !onboardingReductionStarted) {
          onboardingReductionStarted = true;
          void page
            .emulateMedia({ reducedMotion: "reduce" })
            .then(resolveOnboardingReduction, rejectOnboardingReduction);
        }
        if (owner === "taste" && tastePageEntryArmed && !tasteReductionStarted) {
          tasteReductionStarted = true;
          void page
            .emulateMedia({ reducedMotion: "reduce" })
            .then(resolveTasteReduction, rejectTasteReduction);
        }
      },
    );
    await page.addInitScript(() => {
      const seen = new WeakSet<Element>();
      const inspect = () => {
        const reporter = (
          window as typeof window & {
            __recordKonocomicsPageEntryB?: (
              pathname: string,
              owner: "onboarding" | "taste",
            ) => Promise<void>;
          }
        ).__recordKonocomicsPageEntryB;
        if (reporter === undefined) return;
        document
          .querySelectorAll<HTMLElement>(
            "main[data-page-entry-b='active'], main.taste-page.page-entry-b",
          )
          .forEach((element) => {
            if (seen.has(element)) return;
            seen.add(element);
            const owner = element.matches("[data-page-entry-b='active']") ? "onboarding" : "taste";
            void reporter(window.location.pathname, owner);
          });
      };
      new MutationObserver(inspect).observe(document, {
        attributeFilter: ["class", "data-page-entry-b"],
        attributes: true,
        childList: true,
        subtree: true,
      });
      inspect();
    });

    await page.context().route(/\/api\/rakuten\/item(?:\?|$)/u, async (route) => {
      const requestUrl = new URL(route.request().url());
      const isbn = requestUrl.searchParams.get("isbn");
      const workId = isbn === null ? undefined : representativeWorkByIsbn.get(isbn);
      if (isbn === null || workId === undefined) {
        await route.fulfill({
          body: JSON.stringify({ error: "invalid_request" }),
          contentType: "application/json",
          status: 400,
        });
        return;
      }

      if (itemRequests.length > 0 && !firstResponseReleased) {
        laterRequestStartedBeforeFirstResponse = true;
      }
      itemRequests.push({ isbn, workId });
      if (itemRequests.length === 1) await firstResponseGate;

      const work = catalogWorkById.get(workId);
      if (work === undefined) throw new Error(`Missing Catalog work for provider ISBN: ${isbn}`);
      await route.fulfill({
        body: JSON.stringify({
          listing: {
            title: `${work.title} 1`,
            author: work.creators.join("・"),
            publisherName: work.publisher ?? "E2E 出版社",
            isbn,
            itemPrice: 770,
            itemUrl: `https://books.rakuten.co.jp/rb/e2e-recommendation-${isbn}/`,
            imageUrl: `https://thumbnail.image.rakuten.co.jp/e2e-recommendation-${isbn}.jpg`,
            availability: 1,
            reviewAverage: 4.5,
            reviewCount: 12,
          },
        }),
        contentType: "application/json",
        status: 200,
      });
    });
    await page.route("https://thumbnail.image.rakuten.co.jp/**", async (route) => {
      await route.fulfill({
        body: '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="430"></svg>',
        contentType: "image/svg+xml",
        status: 200,
      });
    });

    await page.goto("/", { waitUntil: "domcontentloaded" });
    const landingLogo = page.locator(".landing-logo-reveal");
    const landingCta = page.getByRole("link", { name: "好きなマンガから始める" });
    await expect(landingLogo).toHaveAttribute("data-motion", "signature-a");
    await expect(landingCta).toBeVisible();
    await expect(landingCta).toHaveAttribute("href", "/onboarding");
    expect(await page.evaluate(() => sessionStorage.getItem("logoRevealed"))).toBe("1");
    await landingCta.focus();
    await expect(landingCta).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(landingLogo).toHaveAttribute("data-motion", "static");
    await expect(landingLogo).toHaveAttribute("data-phase", "complete");
    await expect(landingCta).toBeFocused();

    await expect.poll(() => itemRequests.length).toBe(1);
    await page.evaluate(
      () =>
        new Promise<void>((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
        }),
    );
    expect(itemRequests).toHaveLength(1);
    expect(laterRequestStartedBeforeFirstResponse).toBe(false);
    firstResponseReleased = true;
    resolveFirstResponse();
    await page.waitForLoadState("networkidle");

    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(landingLogo).toHaveAttribute("data-motion", "static");
    await expect(landingLogo).toHaveAttribute("data-phase", "complete");
    await expect(landingCta).toBeVisible();
    expect(await page.evaluate(() => sessionStorage.getItem("logoRevealed"))).toBe("1");

    const browser = page.context().browser();
    if (browser === null) throw new Error("Reduced-motion page requires a browser context");
    const reducedContext = await browser.newContext();
    try {
      const reducedPage = await reducedContext.newPage();
      await reducedPage.emulateMedia({ reducedMotion: "reduce" });
      await reducedPage.goto(new URL("/", page.url()).toString(), {
        waitUntil: "domcontentloaded",
      });
      const reducedLogo = reducedPage.locator(".landing-logo-reveal");
      await expect(reducedLogo).toHaveAttribute("data-motion", "static");
      await expect(reducedLogo).toHaveAttribute("data-phase", "complete");
      expect(await reducedPage.evaluate(() => sessionStorage.getItem("logoRevealed"))).toBe("1");
      const reducedCta = reducedPage.getByRole("link", { name: "好きなマンガから始める" });
      await expect(reducedCta).toBeVisible();
      await reducedCta.click();
      await expect(reducedPage).toHaveURL(/\/onboarding$/u);
      await expect(
        reducedPage.getByRole("heading", {
          level: 1,
          name: "好きなマンガを 5〜10 作品えらんでください",
        }),
      ).toBeVisible();
      await expect(reducedPage.locator("main[data-page-entry-b='active']")).toHaveCount(0);
    } finally {
      await reducedContext.close();
    }

    await landingCta.click();
    await expect(page).toHaveURL(/\/onboarding$/u);

    let dnaRevealMarker: string | null = null;
    await completeKeyboardOnboarding(page, {
      alreadyOnOnboarding: true,
      afterInitialNavigation: async (journeyPage) => {
        await expect
          .poll(
            () =>
              pageEntryObservations.filter(
                (observation) =>
                  observation.owner === "onboarding" && observation.pathname === "/onboarding",
              ).length,
          )
          .toBe(1);
        await onboardingReduction;
        await expect(journeyPage.locator("main.onboarding-page")).not.toHaveAttribute(
          "data-page-entry-b",
          "active",
        );
        await journeyPage.emulateMedia({ reducedMotion: "no-preference" });
        await journeyPage.evaluate(
          () =>
            new Promise<void>((resolve) => {
              requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
            }),
        );
        await expect(journeyPage.locator("main.onboarding-page")).not.toHaveAttribute(
          "data-page-entry-b",
          "active",
        );
      },
      beforeStepTwo: async () => {
        await expect
          .poll(
            () =>
              pageEntryObservations.filter((observation) => observation.owner === "onboarding")
                .length,
          )
          .toBeGreaterThan(0);
        onboardingEntriesBeforeStepTwo = pageEntryObservations.filter(
          (observation) => observation.owner === "onboarding",
        ).length;
      },
      afterStepTwo: async (journeyPage) => {
        await expect(journeyPage.locator("main.onboarding-page")).not.toHaveAttribute(
          "data-page-entry-b",
          "active",
        );
        await journeyPage.evaluate(
          () =>
            new Promise<void>((resolve) => {
              requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
            }),
        );
        expect(
          pageEntryObservations.filter((observation) => observation.owner === "onboarding"),
        ).toHaveLength(onboardingEntriesBeforeStepTwo);
      },
      afterTasteNavigation: async (journeyPage) => {
        await expect(journeyPage).toHaveURL(/\/taste$/u);
        await expect(
          journeyPage.getByRole("heading", { level: 1, name: "あなたの Manga DNA" }),
        ).toBeVisible();
        const tasteMain = journeyPage.locator("main.taste-page");
        await expect(tasteMain).toHaveClass(/taste-page--with-action/u);
        await expect(tasteMain).not.toHaveClass(/page-entry-b/u);
        expect(
          pageEntryObservations.filter((observation) => observation.owner === "taste"),
        ).toHaveLength(0);
        await expect(journeyPage.getByRole("link", { name: "おすすめを見る" })).toBeVisible();
        await expect(journeyPage.locator(".taste-top-summary")).toBeVisible();
        expect(await journeyPage.locator(".taste-factor-group").count()).toBeGreaterThan(0);
        await expect(journeyPage.locator("[data-reveal-ready='false']").first()).toBeAttached();
        await expect(journeyPage.locator("[data-reveal-ready='true']")).toHaveCount(0);
        dnaRevealMarker = await journeyPage.evaluate(() =>
          sessionStorage.getItem("konocomics:manga-dna-reveal:v1"),
        );
        expect(dnaRevealMarker).toBeTruthy();
        await verifyLateViewportFactorReveal(journeyPage);
      },
    });

    const cards = page.locator("li[data-recommendation-work-id]:not([data-carousel-clone])");
    const firstReason = cards.first().locator("[data-contribution-summary]");
    const summary = JSON.parse(
      (await firstReason.getAttribute("data-contribution-summary")) ?? "null",
    ) as {
      text?: string;
    };
    expect(summary.text).toBe((await firstReason.textContent())?.trim());
    const initialIds = await recommendationIds(page);
    const initialHash = await page
      .locator("main[data-recommendation-input-hash]")
      .getAttribute("data-recommendation-input-hash");

    await expect
      .poll(
        () =>
          initialIds.every((workId) => itemRequests.some((request) => request.workId === workId)),
        { timeout: 45_000 },
      )
      .toBe(true);

    for (let index = 0; index < 10; index += 1) {
      const card = cards.nth(index);
      const cover = card.locator(".recommendation-card__cover img.cover-image__image");
      await cover.scrollIntoViewIfNeeded();
      await expect(cover).toBeVisible();
      await expect(cover).toHaveAttribute("data-loaded", "true", { timeout: 60_000 });
      await expect(cover).toHaveAttribute("loading", index === 0 ? "eager" : "lazy");
      await expect(cover).toHaveAttribute("fetchpriority", index === 0 ? "high" : "auto");
      await expect(cover).toHaveAttribute("decoding", index === 0 ? "sync" : "async");
    }
    const requestedWorkIds = itemRequests.map((request) => request.workId);
    expect(initialIds.every((workId) => requestedWorkIds.includes(workId))).toBe(true);

    await page.goBack();
    await expect(page).toHaveURL(/\/taste$/u);
    await expect(page.getByRole("heading", { level: 1, name: "あなたの Manga DNA" })).toBeVisible();
    expect(page.url()).not.toContain("reveal=1");
    expect(
      await page.evaluate(() => sessionStorage.getItem("konocomics:manga-dna-reveal:v1")),
    ).toBe(dnaRevealMarker);
    expect(
      await page.evaluate(() => {
        const probe = (window as typeof window & { __konocomicsLateFactorProbe?: LateFactorProbe })
          .__konocomicsLateFactorProbe;
        return (
          probe === undefined ||
          (probe.firstRow.querySelector(".taste-factor-bar__fill--reveal") === null &&
            probe.secondRow.querySelector(".taste-factor-bar__fill--reveal") === null)
        );
      }),
    ).toBe(true);

    await page.evaluate(
      () =>
        new Promise<void>((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
        }),
    );
    const tasteEntriesBeforeReload = pageEntryObservations.filter(
      (observation) => observation.owner === "taste" && observation.pathname === "/taste",
    ).length;
    tastePageEntryArmed = true;
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect
      .poll(
        () =>
          pageEntryObservations.filter(
            (observation) => observation.owner === "taste" && observation.pathname === "/taste",
          ).length,
      )
      .toBe(tasteEntriesBeforeReload + 1);
    await tasteReduction;
    const reloadedTaste = page.locator("main.taste-page");
    await expect(reloadedTaste).not.toHaveClass(/taste-page--with-action/u);
    await expect(reloadedTaste).not.toHaveClass(/page-entry-b/u);
    await expect(page.locator("[data-reveal-ready]")).toHaveCount(0);
    expect(
      await page.evaluate(() => sessionStorage.getItem("konocomics:manga-dna-reveal:v1")),
    ).toBe(dnaRevealMarker);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.evaluate(
      () =>
        new Promise<void>((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
        }),
    );
    await expect(reloadedTaste).not.toHaveClass(/page-entry-b/u);
    expect(
      pageEntryObservations.filter(
        (observation) => observation.owner === "taste" && observation.pathname === "/taste",
      ),
    ).toHaveLength(tasteEntriesBeforeReload + 1);
    await page.getByRole("link", { name: "おすすめ", exact: true }).first().press("Enter");
    await expect(page).toHaveURL(/\/recommendations$/u);
    await expect(page.locator("li[data-recommendation-work-id]:not([data-carousel-clone])")).toHaveCount(10);
    expect(await recommendationIds(page)).toEqual(initialIds);

    await page.reload();
    await expect(page.locator("li[data-recommendation-work-id]:not([data-carousel-clone])")).toHaveCount(10);
    expect(await recommendationIds(page)).toEqual(initialIds);

    if (testInfo.project.name === "chromium") {
      const firstItem = page
        .getByRole("list", { name: "あなたのために選んだ作品" })
        .locator("li[data-recommendation-work-id]:not([data-carousel-clone])")
        .first();
      const firstCard = firstItem.locator("article");
      const firstCardLink = firstItem.getByRole("link", { name: /作品詳細を見る$/u });
      const secondCard = page
        .getByRole("list", { name: "あなたのために選んだ作品" })
        .locator("li[data-recommendation-work-id]:not([data-carousel-clone])")
        .nth(1)
        .locator("article");
      await expect(firstCard).toHaveAttribute("data-expanded", "true");
      await secondCard.getByRole("link").focus();
      await expect(secondCard).toHaveAttribute("data-expanded", "true");
      await expect(firstCard).not.toHaveAttribute("data-expanded");
      await firstCardLink.focus();
      await expect(firstCard).toHaveAttribute("data-expanded", "true");
      await expect(secondCard).not.toHaveAttribute("data-expanded");
      await expect(firstCard.locator("[data-recommendation-evidence-summary]")).toBeVisible();
      await expect
        .poll(async () => (await firstCard.boundingBox())?.width ?? 0)
        .toBeGreaterThanOrEqual(300);
      const initialExpandedBox = await firstCard.boundingBox();
      expect(initialExpandedBox?.width).toBeGreaterThanOrEqual(300);
      expect(initialExpandedBox?.width).toBeLessThanOrEqual(360);
      await page.evaluate(() => {
        if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
      });
      await firstCard.hover();
      await page.mouse.move(0, 0);
      await expect(firstCard).not.toHaveAttribute("data-expanded");
      await expect
        .poll(async () => (await firstCard.boundingBox())?.width ?? Infinity)
        .toBeLessThanOrEqual(250);
      const collapsedBox = await firstCard.boundingBox();
      expect(collapsedBox?.width).toBeGreaterThanOrEqual(220);
      expect(collapsedBox?.width).toBeLessThanOrEqual(250);
      expect(
        Math.abs((initialExpandedBox?.height ?? 0) - (collapsedBox?.height ?? 0)),
      ).toBeLessThanOrEqual(1);

      await page.waitForTimeout(300);
      await secondCard.hover();
      await page.waitForTimeout(100);
      await expect(secondCard).not.toHaveAttribute("data-expanded");
      await expect(secondCard).toHaveAttribute("data-expanded", "true");
      await expect(firstCard.locator("[data-recommendation-backdrop]")).toHaveCount(0);
      await expect(firstCard.locator(".recommendation-card__cover")).toHaveCount(1);

      await page.mouse.move(0, 0);
      await expect(secondCard).not.toHaveAttribute("data-expanded");
      await page.evaluate(() => {
        if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
      });
      await firstCardLink.focus();
      await expect(firstCardLink).toBeFocused();
      await expect(firstCard).toHaveAttribute("data-expanded", "true", { timeout: 150 });

      await page.mouse.move(0, 0);
      await page.evaluate(() => {
        if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
      });
      await expect(firstCard).not.toHaveAttribute("data-expanded");
      const recommendationShelf = page.getByRole("list", {
        name: "あなたのために選んだ作品",
      });
      const rightEdgeItem = recommendationShelf.locator("li[data-recommendation-work-id]:not([data-carousel-clone])").last();
      await rightEdgeItem.scrollIntoViewIfNeeded();
      const rightEdgeCard = rightEdgeItem.locator("article");
      const rightEdgeCover = rightEdgeCard.locator("[data-expandable-cover-frame]");
      const rightEdgeCopy = rightEdgeCard.locator(
        ".recommendation-card__identity > div:last-child",
      );
      const collapsedEdgeCardBox = await rightEdgeCard.boundingBox();
      const collapsedEdgeCoverBox = await rightEdgeCover.boundingBox();

      await rightEdgeCard.hover();
      await expect(rightEdgeCard).toHaveAttribute("data-expansion-side", "left", {
        timeout: 1_000,
      });
      await page.waitForTimeout(300);
      const shelfBox = await recommendationShelf.boundingBox();
      const expandedEdgeCardBox = await rightEdgeCard.boundingBox();
      const expandedEdgeCoverBox = await rightEdgeCover.boundingBox();
      const expandedEdgeCopyBox = await rightEdgeCopy.boundingBox();
      expect(expandedEdgeCardBox?.x).toBeGreaterThanOrEqual((shelfBox?.x ?? 0) - 1);
      expect((expandedEdgeCardBox?.x ?? 0) + (expandedEdgeCardBox?.width ?? 0)).toBeLessThanOrEqual(
        (shelfBox?.x ?? 0) + (shelfBox?.width ?? 0) + 1,
      );
      expect(expandedEdgeCoverBox?.x).toBeGreaterThan(expandedEdgeCopyBox?.x ?? Infinity);
      expect(expandedEdgeCoverBox?.width).toBeGreaterThan(collapsedEdgeCoverBox?.width ?? 0);
      expect(
        Math.abs((expandedEdgeCardBox?.height ?? 0) - (collapsedEdgeCardBox?.height ?? 0)),
      ).toBeLessThanOrEqual(1);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth === document.documentElement.clientWidth,
        ),
      ).toBe(true);

      await page.mouse.move(0, 0);
      await expect(rightEdgeCard).not.toHaveAttribute("data-expanded");
    }

    if (testInfo.project.name === "mobile-chromium") {
      const previewWorkId = initialIds[0];
      expect(previewWorkId).toBeTruthy();
      const previewOpener = page
        .locator(`li[data-recommendation-work-id='${previewWorkId}']`)
        .getByRole("link");
      const previewTitle = (await previewOpener.locator("h3").textContent())?.trim();
      expect(previewTitle).toBeTruthy();
      const previewDialog = page.getByRole("dialog", { name: previewTitle });

      await previewOpener.scrollIntoViewIfNeeded();
      await page.evaluate(() => window.scrollTo(0, 200));
      await previewOpener.focus();
      const scrollYBeforePreview = await page.evaluate(() => window.scrollY);
      expect(scrollYBeforePreview).toBeGreaterThan(0);
      await previewOpener.click();
      expect(new URL(page.url()).searchParams.get("preview")).toBe(previewWorkId);
      await expect(previewDialog).toBeVisible();
      await expect
        .poll(async () =>
          Math.abs((await page.evaluate(() => window.scrollY)) - scrollYBeforePreview),
        )
        .toBeLessThanOrEqual(1);

      await page.goBack();
      await expect(previewDialog).toBeHidden();
      await expect(previewOpener).toBeFocused();

      await page.goForward();
      await expect(previewDialog).toBeVisible();
      await page.reload();
      await expect(previewDialog).toBeVisible();
      await page.goBack();
      await expect(previewDialog).toBeHidden();
    }

    await openRecommendationFilters(page);
    await tabUntil(page, /^\s*完結作を優先\s*$/u, 120);
    await page.keyboard.press("Space");
    await expect(page.getByRole("checkbox", { name: "完結作を優先" })).toBeChecked();
    await expect(page.getByText("おすすめの方針を反映しました。", { exact: true })).toBeVisible();
    await expect
      .poll(async () => {
        const policies = (await readProductState(page)).profile.find(
          (entry) => entry.key === "policies",
        )?.value;
        return policies;
      })
      .toEqual(
        expect.objectContaining({
          preferCompleted: true,
          preferHidden: false,
          preferVerified: false,
          excludeIncomplete: false,
        }),
      );
    const policyHash = await page
      .locator("main[data-recommendation-input-hash]")
      .getAttribute("data-recommendation-input-hash");
    expect(policyHash).not.toBe(initialHash);
    const policyIds = await recommendationIds(page);

    await page.reload();
    await openRecommendationFilters(page);
    await expect(page.getByRole("checkbox", { name: "完結作を優先" })).toBeChecked();
    await expect(page.locator("li[data-recommendation-work-id]:not([data-carousel-clone])")).toHaveCount(10);
    expect(await recommendationIds(page)).toEqual(policyIds);

    await page.goto(
      "/recommendations?preview=first&preview=second&genre=invalid&sort=invalid&shelf=%20",
    );
    await expect(page.getByRole("heading", { level: 1, name: "あなたへのおすすめ" })).toBeVisible();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(page.locator("li[data-recommendation-work-id]:not([data-carousel-clone])")).toHaveCount(10);

    await page.emulateMedia({ colorScheme: "light" });
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe(
      "dark",
    );
    const desktopNavigation = page.getByRole("navigation", { name: "メインナビゲーション" });
    const mobileNavigation = page.getByRole("navigation", { name: "メインタブ" });
    const activeNavigation =
      testInfo.project.name === "mobile-chromium" ? mobileNavigation : desktopNavigation;
    await expect(activeNavigation).toBeVisible();
    await expect(
      testInfo.project.name === "mobile-chromium" ? desktopNavigation : mobileNavigation,
    ).toBeHidden();
    const navigationTarget = await activeNavigation.getByRole("link").first().boundingBox();
    expect(navigationTarget).not.toBeNull();
    expect(navigationTarget!.width).toBeGreaterThanOrEqual(44);
    expect(navigationTarget!.height).toBeGreaterThanOrEqual(44);
    expect(fatalRuntimeMessages).toEqual([]);
  });

  test("completed feedback removes, backfills, persists, and stays excluded after update", async ({
    page,
  }) => {
    await completeKeyboardOnboarding(page);
    const initialIds = await recommendationIds(page);
    const removedWorkId = initialIds[0];
    expect(removedWorkId).toBeTruthy();

    const firstCard = page.locator("li[data-recommendation-work-id]:not([data-carousel-clone])").first();
    await firstCard.getByRole("button", { name: "読んだ" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("radio", { name: "最高" })).toBeFocused();
    await expect(page.locator(`li[data-recommendation-work-id='${removedWorkId}']`)).toHaveCount(0);
    await expect(page.locator("li[data-recommendation-work-id]:not([data-carousel-clone])")).toHaveCount(10);
    await expect(
      page.getByText("1件を除外し、新しい候補を追加しました", { exact: true }),
    ).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    const nextFirstWorkId = (await recommendationIds(page))[0];
    await expect
      .poll(() =>
        page.evaluate(() =>
          document.activeElement
            ?.closest("li[data-recommendation-work-id]:not([data-carousel-clone])")
            ?.getAttribute("data-recommendation-work-id"),
        ),
      )
      .toBe(nextFirstWorkId);
    await expect
      .poll(async () =>
        (await readProductState(page)).userWorks.find((record) => record.workId === removedWorkId),
      )
      .toEqual(expect.objectContaining({ readingState: "completed" }));

    await openRecommendationFilters(page);
    const update = page.getByRole("button", { name: "更新" });
    await expect(update).toBeEnabled();
    await update.click();
    await expect(page.getByText("おすすめを更新しました。", { exact: true })).toBeVisible();
    await expect(page.locator(`li[data-recommendation-work-id='${removedWorkId}']`)).toHaveCount(0);
    const displayedHash = await page
      .locator("main[data-recommendation-input-hash]")
      .getAttribute("data-recommendation-input-hash");
    const state = await readProductState(page);
    const currentCache = state.recommendationCache.find(
      (record) => record.inputHash === displayedHash,
    );
    expect(currentCache).toBeTruthy();
    expect(currentCache?.plan.some((entry) => entry.workId === removedWorkId)).toBe(false);

    const updatedIds = await recommendationIds(page);
    await page.reload();
    await expect(page.locator("li[data-recommendation-work-id]:not([data-carousel-clone])")).toHaveCount(10);
    expect(await recommendationIds(page)).toEqual(updatedIds);
    expect(await recommendationIds(page)).not.toContain(removedWorkId);
  });
});

test.describe("Slice 8 provider and work-detail journey", () => {
  test("provider failure keeps the product usable and detail recovers through the real boundary", async ({
    page,
  }) => {
    test.setTimeout(120_000);
    const itemRequests: string[] = [];
    const searchRequests: string[] = [];
    const imageRequests: string[] = [];
    let providerAvailable = false;
    let providerTitle = "";
    const affiliateUrl = "https://hb.afl.rakuten.co.jp/hgc/e2e-provider-link/";
    const coverUrl = "https://thumbnail.image.rakuten.co.jp/e2e-provider-cover.jpg";
    const itemCaption = "E2E で取得した、作品に根拠づけられた紹介文です。";

    for (const path of ["/api/rakuten/search", "/api/rakuten/item"]) {
      const response = await page.request.get(path);
      expect(response.status()).toBe(400);
      await expect(response.json()).resolves.toEqual({ error: "invalid_request" });
    }

    await page.context().route(/\/api\/rakuten\/search(?:\?|$)/u, async (route) => {
      searchRequests.push(route.request().url());
      await route.fulfill({
        body: JSON.stringify({ error: "provider_unavailable" }),
        contentType: "application/json",
        status: 502,
      });
    });
    await page.context().route(/\/api\/rakuten\/item(?:\?|$)/u, async (route) => {
      const requestUrl = new URL(route.request().url());
      itemRequests.push(requestUrl.toString());
      if (!providerAvailable) {
        await route.fulfill({
          body: JSON.stringify({ error: "provider_unavailable" }),
          contentType: "application/json",
          status: 502,
        });
        return;
      }

      const isbn = requestUrl.searchParams.get("isbn");
      expect(isbn).toMatch(/^(?:\d{13}|\d{9}[\dX])$/u);
      await route.fulfill({
        body: JSON.stringify({
          listing: {
            title: `${providerTitle} 1`,
            author: "E2E 著者",
            publisherName: "E2E 出版社",
            isbn,
            itemCaption,
            itemPrice: 770,
            itemUrl: "https://books.rakuten.co.jp/rb/e2e-provider-item/",
            affiliateUrl,
            imageUrl: coverUrl,
            availability: 1,
            reviewAverage: 4.5,
            reviewCount: 12,
          },
        }),
        contentType: "application/json",
        status: 200,
      });
    });
    await page.route("https://thumbnail.image.rakuten.co.jp/**", async (route) => {
      const requestUrl = new URL(route.request().url());
      imageRequests.push(requestUrl.toString());
      if (requestUrl.searchParams.get("_ex") === "600x600") {
        await route.fulfill({ status: 404 });
        return;
      }
      await route.fulfill({
        body: '<svg xmlns="http://www.w3.org/2000/svg" width="3" height="4"></svg>',
        contentType: "image/svg+xml",
        status: 200,
      });
    });

    await page.goto("/onboarding");
    const onboardingPlaceholder = page.getByRole("img", { name: /表紙画像はありません/u }).first();
    await expect(onboardingPlaceholder).toBeVisible();

    await completeKeyboardOnboarding(page);
    const firstCard = page.locator("li[data-recommendation-work-id]:not([data-carousel-clone])").first();
    const workId = await firstCard.getAttribute("data-recommendation-work-id");
    expect(workId).toBeTruthy();
    providerTitle =
      (await firstCard.getByRole("heading", { level: 3 }).textContent())?.trim() ?? "";
    expect(providerTitle).not.toBe("");
    await expect(firstCard.getByRole("img", { name: /表紙画像はありません/u })).toBeVisible();

    const detailLink = firstCard.getByRole("link", { name: /作品詳細を見る$/u });
    await expect(detailLink).toHaveAttribute("href", `/works/${workId}`);
    await openRecommendationDetail(page, workId!);
    const detail = page.locator(`main[data-work-detail-id='${workId}']`);
    await expect(detail.getByRole("heading", { level: 1, name: providerTitle })).toBeVisible();
    await expect.poll(() => itemRequests.length).toBeGreaterThan(0);
    expect(new URL(itemRequests[0]!).pathname).toBe("/api/rakuten/item");
    expect(new URL(itemRequests[0]!).searchParams.get("isbn")).toMatch(/^\d{13}$/u);

    const detailPlaceholder = detail.locator("[data-work-detail-cover]").getByRole("img");
    await expect(detailPlaceholder).toBeVisible();
    expect(await detailPlaceholder.getAttribute("aria-label")).toContain(providerTitle);
    await expect(
      detail.getByText("作品紹介を取得できませんでした。", { exact: true }),
    ).toBeVisible();
    await expect(detail.getByText("価格と在庫を現在表示できません。", { exact: true })).toBeVisible(
      { timeout: 45_000 },
    );
    await expect(detail.getByText("価格", { exact: true })).toHaveCount(0);
    await expect(detail.getByText("在庫・発送", { exact: true })).toHaveCount(0);

    const searchLink = detail.getByRole("link", {
      name: "楽天ブックスで検索する(新しいタブ)",
    });
    const searchHref = await searchLink.getAttribute("href");
    expect(searchHref).toBeTruthy();
    const searchUrl = new URL(searchHref!);
    expect(searchUrl.origin).toBe("https://books.rakuten.co.jp");
    expect(searchUrl.pathname).toBe("/search");
    expect(searchUrl.searchParams.get("g")).toBe("001001");
    expect(searchUrl.searchParams.get("sitem")).toBe(providerTitle);
    expect(searchRequests).toHaveLength(0);

    const planned = detail.getByRole("button", { name: "読みたい", exact: true });
    await planned.click();
    await expect(detail.getByRole("status")).toHaveText("読みたいに追加しました。");
    await expect
      .poll(async () =>
        (await readProductState(page)).userWorks.find((record) => record.workId === workId),
      )
      .toEqual(expect.objectContaining({ workId, readingState: "planned" }));

    const stalePage = await page.context().newPage();
    await stalePage.goto(`/works/${workId}`);
    const staleDetail = stalePage.locator(`main[data-work-detail-id='${workId}']`);
    await expect(staleDetail.getByRole("heading", { level: 1, name: providerTitle })).toBeVisible();
    await expect(staleDetail.getByLabel("読書状態を変更")).toHaveValue("planned");
    await expect(
      staleDetail.getByRole("button", { name: "読みたいから外す", exact: true }),
    ).toHaveAttribute("aria-pressed", "true");

    providerAvailable = true;
    await page.reload();
    const restoredDetail = page.locator(`main[data-work-detail-id='${workId}']`);
    await expect(restoredDetail.getByLabel("読書状態を変更")).toHaveValue("planned");
    await expect(
      restoredDetail.getByRole("button", { name: "読みたいから外す", exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect
      .poll(async () =>
        (await readProductState(page)).userWorks.find((record) => record.workId === workId),
      )
      .toEqual(expect.objectContaining({ workId, readingState: "planned" }));

    await expect(restoredDetail.getByText(itemCaption, { exact: true })).toBeVisible();
    const purchaseLink = restoredDetail.getByRole("link", {
      name: "楽天ブックスを開く(新しいタブ)",
    });
    await expect(purchaseLink).toHaveAttribute("href", affiliateUrl);
    await expect(purchaseLink).toHaveAttribute("target", "_blank");
    await expect(purchaseLink).toHaveAttribute("rel", "noreferrer");
    await expect(restoredDetail.getByText("価格", { exact: true })).toBeVisible();
    await expect(restoredDetail.getByText(/770/u)).toBeVisible();
    await expect(restoredDetail.getByText("在庫あり", { exact: true })).toBeVisible();

    const restoredCover = restoredDetail.locator("[data-work-detail-cover]");
    const foreground = restoredCover.getByRole("img", { name: `${providerTitle} 表紙` });
    const blur = restoredDetail
      .locator('[data-slot="hero-backdrop"] > img[aria-hidden="true"][data-cover-source]')
      .first();
    await expect(foreground).toHaveAttribute("data-loaded", "true");
    const foregroundSource = await foreground.getAttribute("src");
    expect(foregroundSource).toBeTruthy();
    await expect(blur).toHaveAttribute("src", foregroundSource!);
    expect(new URL(foregroundSource!).searchParams.get("_ex")).toBe("200x200");
    await expect
      .poll(() => imageRequests.map((url) => new URL(url).searchParams.get("_ex")).sort())
      .toEqual(expect.arrayContaining(["200x200", "600x600"]));

    const readingState = restoredDetail.getByRole("combobox", {
      name: "読書状態を変更",
    });
    await readingState.selectOption("completed");
    await expect(readingState).toHaveValue("completed");
    await expect(restoredDetail.getByRole("status")).toHaveText("読書状態を保存しました。");
    await expect
      .poll(async () =>
        (await readProductState(page)).userWorks.find((record) => record.workId === workId),
      )
      .toEqual(expect.objectContaining({ workId, readingState: "completed" }));

    await staleDetail.getByRole("button", { name: "読みたいから外す", exact: true }).click();
    await expect(staleDetail.getByRole("status")).toHaveText(
      "別の画面で更新された記録を残しました。最新の読書状態を表示しています。",
    );
    await expect(staleDetail.getByLabel("読書状態を変更")).toHaveValue("completed");
    await expect
      .poll(async () =>
        (await readProductState(stalePage)).userWorks.find((record) => record.workId === workId),
      )
      .toEqual(expect.objectContaining({ workId, readingState: "completed" }));
    await stalePage.close();

    await page.goBack();
    if (new URL(page.url()).searchParams.has("preview")) await page.goBack();
    await expect(page).toHaveURL(/\/recommendations$/u);
    await expect(page.getByRole("heading", { level: 1, name: "あなたへのおすすめ" })).toBeVisible();
    await expect(page.locator("li[data-recommendation-work-id]:not([data-carousel-clone])")).toHaveCount(10);
    await expect(page.locator(`li[data-recommendation-work-id='${workId}']`)).toHaveCount(0);

    const notFoundResponse = await page.goto("/works/not-a-real-work");
    expect(notFoundResponse?.status()).toBe(404);
    await expect(
      page.getByRole("heading", { level: 1, name: "作品が見つかりません" }),
    ).toBeVisible();
    await expect(
      page.getByText("指定された作品はカタログにありません。", { exact: true }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "おすすめに戻る" })).toHaveAttribute(
      "href",
      "/recommendations",
    );
  });
});

test.describe("Slice 9 library and external-work journey", () => {
  test("persists edited records and keeps external identity local, strict, and race-safe", async ({
    browser,
    context,
    page,
  }) => {
    test.setTimeout(120_000);
    const catalogTitle = "20世紀少年";
    const catalogWorkId = "20th-century-boys";
    const externalTitle = "E2E カタログ外作品 完全版 1";
    const externalCreator = "検証作者";
    const externalIsbn = "9784101010014";
    const externalMergeTitle = "E2E カタログ外作品 2";
    const externalMergeIsbn = "9784101010021";
    const externalNormalizedKey = '["e2e かたろぐ外作品","検証作者"]';
    const externalId =
      "ext:rakuten:v1:8f15e88b5fc3c988159efae9d61c75424802455d0d8ff057c2a2081fa668a840";
    const canonicalExternalHref = `/works/external?workId=${encodeURIComponent(externalId)}`;
    const providerRequests: string[] = [];
    const providerItemRequestCount = (isbn: string) =>
      providerRequests.filter((request) => {
        const requestUrl = new URL(request);
        return (
          requestUrl.pathname === "/api/rakuten/item" &&
          requestUrl.searchParams.get("isbn") === isbn
        );
      }).length;

    await context.route(/\/api\/rakuten\/(?:search|item)(?:\?|$)/u, async (route) => {
      const requestUrl = new URL(route.request().url());
      providerRequests.push(requestUrl.toString());
      if (requestUrl.pathname !== "/api/rakuten/search") {
        await route.fulfill({
          body: JSON.stringify({ error: "provider_unavailable" }),
          contentType: "application/json",
          status: 502,
        });
        return;
      }
      const requestedTitle = requestUrl.searchParams.get("title");
      expect([externalTitle, externalMergeTitle]).toContain(requestedTitle);
      const isMergeRequest = requestedTitle === externalMergeTitle;
      await route.fulfill({
        body: JSON.stringify({
          items: [
            {
              title: isMergeRequest ? externalMergeTitle : externalTitle,
              author: externalCreator,
              publisherName: "E2E 出版社",
              isbn: isMergeRequest ? externalMergeIsbn : externalIsbn,
              itemPrice: 880,
              itemUrl: isMergeRequest
                ? "https://books.rakuten.co.jp/rb/e2e-external-work-merge/"
                : "https://books.rakuten.co.jp/rb/e2e-external-work/",
              availability: 1,
              reviewAverage: 4.2,
              reviewCount: 9,
            },
          ],
        }),
        contentType: "application/json",
        status: 200,
      });
    });

    let appPage = page;
    await appPage.goto("/library");
    await expect(appPage.getByRole("heading", { level: 1, name: "ライブラリ" })).toBeVisible();

    const catalogSearch = await openLibrarySearch(appPage, catalogTitle);
    const catalogResult = catalogSearch.getByRole("listitem").filter({ hasText: catalogTitle });
    await expect(catalogResult).toHaveCount(1);
    await catalogResult.getByRole("button", { name: "読みたいに追加" }).click();
    await expect(
      catalogSearch.getByText(`「${catalogTitle}」を読みたいに追加しました。`, {
        exact: true,
      }),
    ).toBeVisible();
    await catalogSearch.getByRole("button", { name: "閉じる" }).click();
    await expect(catalogSearch).toBeHidden();

    await appPage
      .getByRole("tabpanel", { name: "すべて" })
      .getByRole("region", { name: "読みたい" })
      .getByRole("button", { name: `「${catalogTitle}」の記録を編集` })
      .click();
    const catalogEditor = appPage.getByRole("dialog", { name: catalogTitle });
    await expect(catalogEditor).toHaveAccessibleName(catalogTitle);
    await expect(
      catalogEditor.getByRole("heading", { level: 2, name: catalogTitle }),
    ).toBeVisible();
    const catalogDialogEvidence = await catalogEditor.evaluate((element) => {
      const labelledby = element.getAttribute("aria-labelledby");
      return {
        ariaLabel: element.getAttribute("aria-label"),
        idCount:
          labelledby === null ? 0 : document.querySelectorAll(`#${CSS.escape(labelledby)}`).length,
        labelText:
          labelledby === null ? null : (document.getElementById(labelledby)?.textContent ?? null),
        labelledby,
      };
    });
    expect(catalogDialogEvidence).toMatchObject({
      ariaLabel: catalogTitle,
      idCount: 0,
      labelledby: null,
      labelText: null,
    });
    await expect(
      catalogEditor.getByRole("heading", { level: 2, name: catalogTitle }),
    ).toHaveAttribute("id", "library-detail-title");
    await catalogEditor.getByRole("combobox", { name: "読書状態" }).selectOption("completed");
    await catalogEditor.getByRole("combobox", { name: "感想" }).selectOption("liked");
    await catalogEditor.getByRole("spinbutton", { name: "巻" }).fill("7");
    await catalogEditor.getByRole("button", { name: "変更を保存" }).click();
    await expect(
      catalogEditor.getByText("読書記録を保存しました。", { exact: true }),
    ).toBeVisible();
    await expect
      .poll(async () =>
        (await readProductState(appPage)).userWorks.find(
          (record) => record.workId === catalogWorkId,
        ),
      )
      .toEqual(
        expect.objectContaining({
          progress: { volume: 7 },
          reaction: "liked",
          readingState: "completed",
          workId: catalogWorkId,
        }),
      );
    await catalogEditor.getByRole("button", { name: "閉じる" }).click();
    await expect(catalogEditor).toBeHidden();

    const restartedPage = await context.newPage();
    await appPage.close();
    appPage = restartedPage;
    await appPage.goto("/library");
    await appPage.getByRole("tab", { name: "読んだ" }).click();
    await expect(
      appPage.getByRole("button", { name: `「${catalogTitle}」の記録を編集` }),
    ).toBeVisible();
    await appPage.getByRole("button", { name: `「${catalogTitle}」の記録を編集` }).click();
    const restoredCatalogEditor = appPage.getByRole("dialog", { name: catalogTitle });
    await expect(
      restoredCatalogEditor.getByRole("heading", { level: 2, name: catalogTitle }),
    ).toBeVisible();
    await expect(restoredCatalogEditor.getByRole("combobox", { name: "読書状態" })).toHaveValue(
      "completed",
    );
    await expect(restoredCatalogEditor.getByRole("combobox", { name: "感想" })).toHaveValue(
      "liked",
    );
    await expect(restoredCatalogEditor.getByRole("spinbutton", { name: "巻" })).toHaveValue("7");
    await restoredCatalogEditor.getByRole("button", { name: "閉じる" }).click();
    await expect(restoredCatalogEditor).toBeHidden();

    const stalePage = await context.newPage();
    await stalePage.goto("/library");
    const staleSearch = await openLibrarySearch(stalePage, externalTitle);
    await staleSearch.getByRole("button", { name: "楽天ブックスで探す" }).click();
    const staleProviderResult = staleSearch
      .getByRole("listitem")
      .filter({ hasText: externalTitle });
    await expect(staleProviderResult).toHaveCount(1);
    const staleAdd = staleProviderResult.getByRole("button", {
      name: "カタログ外として追加",
    });
    await expect(staleAdd).toBeEnabled();

    const externalSearch = await openLibrarySearch(appPage, externalTitle);
    await expect(externalSearch.getByText("カタログ内では見つかりませんでした。")).toBeVisible();
    await externalSearch.getByRole("button", { name: "楽天ブックスで探す" }).click();
    const providerResult = externalSearch.getByRole("listitem").filter({ hasText: externalTitle });
    await expect(providerResult).toHaveCount(1);
    await providerResult.getByRole("button", { name: "カタログ外として追加" }).click();
    await expect(
      externalSearch.getByText(`「${externalTitle}」を読みたいに追加しました。`, {
        exact: true,
      }),
    ).toBeVisible();
    await expect
      .poll(async () =>
        (await readProductState(appPage)).externalWorks.find((record) => record.id === externalId),
      )
      .toEqual(
        expect.objectContaining({
          creators: [externalCreator],
          id: externalId,
          isbnSamples: [externalIsbn],
          normalizedKey: externalNormalizedKey,
          record: expect.objectContaining({
            readingState: "planned",
            workId: externalId,
          }),
          title: externalTitle,
        }),
      );
    const storedIdentity = (await readProductState(appPage)).externalWorks.find(
      (record) => record.id === externalId,
    );
    expect(storedIdentity?.id).toMatch(/^ext:rakuten:v1:[0-9a-f]{64}$/u);
    expect(storedIdentity?.id.slice("ext:rakuten:v1:".length)).toHaveLength(64);
    await externalSearch.getByRole("button", { name: "閉じる" }).click();
    await expect(externalSearch).toBeHidden();

    await appPage.getByRole("tab", { name: "読みたい" }).click();
    await appPage.getByRole("button", { name: `「${externalTitle}」の記録を編集` }).click();
    const externalEditor = appPage.getByRole("dialog", { name: externalTitle });
    await expect(
      externalEditor.getByRole("heading", { level: 2, name: externalTitle }),
    ).toBeVisible();
    const externalDetailLink = externalEditor.getByRole("link", {
      name: "カタログ外作品の詳細を見る",
    });
    await expect(externalDetailLink).toHaveAttribute("href", canonicalExternalHref);
    await externalEditor.getByRole("combobox", { name: "読書状態" }).selectOption("reading");
    await externalEditor.getByRole("combobox", { name: "感想" }).selectOption("favorite");
    await externalEditor.getByRole("spinbutton", { name: "巻" }).fill("3");

    const mergePage = await context.newPage();
    await mergePage.goto("/library");
    const mergeSearch = await openLibrarySearch(mergePage, externalMergeTitle);
    await mergeSearch.getByRole("button", { name: "楽天ブックスで探す" }).click();
    const mergeProviderResult = mergeSearch
      .getByRole("listitem")
      .filter({ hasText: externalMergeTitle });
    await expect(mergeProviderResult).toHaveCount(1);
    await mergeProviderResult.getByRole("button", { name: "カタログ外として追加" }).click();
    await expect(
      mergeSearch.getByText(
        `「${externalMergeTitle}」はすでにライブラリにあります。最新の記録を表示しています。`,
        {
          exact: true,
        },
      ),
    ).toBeVisible();
    await expect
      .poll(async () =>
        (await readProductState(mergePage)).externalWorks.find(
          (record) => record.id === externalId,
        ),
      )
      .toEqual(
        expect.objectContaining({
          isbnSamples: [externalIsbn, externalMergeIsbn],
          record: expect.objectContaining({
            readingState: "planned",
            workId: externalId,
          }),
          title: externalTitle,
        }),
      );
    await mergePage.close();

    await externalEditor.getByRole("button", { name: "変更を保存" }).click();
    await expect(
      externalEditor.getByText("読書記録を保存しました。", { exact: true }),
    ).toBeVisible();
    await expect
      .poll(async () =>
        (await readProductState(appPage)).externalWorks.find((record) => record.id === externalId),
      )
      .toEqual(
        expect.objectContaining({
          isbnSamples: [externalIsbn, externalMergeIsbn],
          record: expect.objectContaining({
            progress: { volume: 3 },
            reaction: "favorite",
            readingState: "reading",
            workId: externalId,
          }),
        }),
      );
    const meaningfulExternalRecord = (await readProductState(appPage)).externalWorks.find(
      (record) => record.id === externalId,
    );
    expect(meaningfulExternalRecord).toBeTruthy();

    await staleAdd.click();
    await expect(
      staleSearch.getByText(
        `「${externalTitle}」はすでにライブラリにあります。最新の記録を表示しています。`,
        { exact: true },
      ),
    ).toBeVisible();
    expect(
      (await readProductState(stalePage)).externalWorks.find((record) => record.id === externalId),
    ).toEqual(meaningfulExternalRecord);
    await stalePage.close();

    const providerCountBeforeDetail = providerRequests.length;
    await externalDetailLink.click();
    await expect(appPage).toHaveURL(/\/works\/external\?workId=/u);
    expect(`${new URL(appPage.url()).pathname}${new URL(appPage.url()).search}`).toBe(
      canonicalExternalHref,
    );
    const externalDetail = appPage.locator(`main[data-external-work-detail='${externalId}']`);
    await expect(
      externalDetail.getByRole("heading", { level: 1, name: externalTitle }),
    ).toBeVisible();
    await expect(externalDetail.getByRole("combobox", { name: "読書状態" })).toHaveValue("reading");
    await expect(externalDetail.getByRole("combobox", { name: "感想" })).toHaveValue("favorite");
    await expect(externalDetail.getByRole("spinbutton", { name: "巻" })).toHaveValue("3");
    expect(providerRequests).toHaveLength(providerCountBeforeDetail);

    await appPage.reload();
    const reloadedExternalDetail = appPage.locator(
      `main[data-external-work-detail='${externalId}']`,
    );
    await expect(
      reloadedExternalDetail.getByRole("heading", { level: 1, name: externalTitle }),
    ).toBeVisible();
    await expect(reloadedExternalDetail.getByRole("combobox", { name: "読書状態" })).toHaveValue(
      "reading",
    );
    expect(providerRequests).toHaveLength(providerCountBeforeDetail);

    const cleanProviderRequests: string[] = [];
    const cleanContext = await browser.newContext({
      baseURL: "http://localhost:3000",
      viewport: appPage.viewportSize() ?? undefined,
    });
    await cleanContext.route(/\/api\/rakuten\/(?:search|item)(?:\?|$)/u, async (route) => {
      cleanProviderRequests.push(route.request().url());
      await route.fulfill({
        body: JSON.stringify({ error: "provider_unavailable" }),
        contentType: "application/json",
        status: 502,
      });
    });
    const cleanPage = await cleanContext.newPage();
    await cleanPage.goto(canonicalExternalHref);
    await expect(cleanPage.locator("main[data-external-detail-state='missing']")).toBeVisible();
    await expect(
      cleanPage.getByRole("heading", { level: 1, name: "作品が見つかりません" }),
    ).toBeVisible();
    expect(cleanProviderRequests).toHaveLength(0);
    await cleanContext.close();

    const duplicateExternalUrl = `${canonicalExternalHref}&workId=${encodeURIComponent(externalId)}`;
    await appPage.goto(duplicateExternalUrl);
    await expect(appPage.locator("main[data-external-detail-state='invalid']")).toBeVisible();
    await expect(
      appPage.getByRole("heading", { level: 1, name: "作品を指定できませんでした" }),
    ).toBeVisible();
    expect(providerRequests).toHaveLength(providerCountBeforeDetail);

    const corruptId = `ext:rakuten:v1:${"a".repeat(64)}`;
    const corruptTitle = "破損した外部作品";
    const corruptIsbnItemRequestsBefore = providerItemRequestCount(externalMergeIsbn);
    await putRawExternalWork(appPage, {
      id: corruptId,
      normalizedKey: '["破損した外部作品","破損作者"]',
      title: corruptTitle,
      creators: ["破損作者"],
      isbnSamples: ["9784101010021"],
      record: {
        workId: corruptId,
        readingState: "planned",
        updatedAt: "2026-08-14T00:00:00.000Z",
      },
    });
    await appPage.goto("/library");
    await appPage.getByRole("tab", { name: "読んでる" }).click();
    await expect(
      appPage.getByRole("button", { name: `「${externalTitle}」の記録を編集` }),
    ).toBeVisible();
    await expect(
      appPage.getByRole("button", { name: `「${corruptTitle}」の記録を編集` }),
    ).toHaveCount(0);
    expect(providerItemRequestCount(externalMergeIsbn)).toBe(corruptIsbnItemRequestsBefore);

    const corruptHref = `/works/external?workId=${encodeURIComponent(corruptId)}`;
    await appPage.goto(corruptHref);
    await expect(appPage.locator("main[data-external-detail-state='corrupt']")).toBeVisible();
    await expect(
      appPage.getByRole("heading", { level: 1, name: "作品情報を表示できません" }),
    ).toBeVisible();
    await expect(appPage.getByText(corruptTitle, { exact: true })).toHaveCount(0);
    expect(providerItemRequestCount(externalMergeIsbn)).toBe(corruptIsbnItemRequestsBefore);
  });
});

test.describe("Slice 10 data-sovereignty journey", () => {
  test("round-trips real local data and rejects invalid replacement files atomically", async ({
    browser,
    context,
    page,
  }) => {
    test.setTimeout(300_000);
    const externalTitle = "E2E カタログ外作品 完全版 1";
    const externalCreator = "検証作者";
    const externalIsbn = "9784101010014";
    const externalNormalizedKey = '["e2e かたろぐ外作品","検証作者"]';
    const externalId =
      "ext:rakuten:v1:8f15e88b5fc3c988159efae9d61c75424802455d0d8ff057c2a2081fa668a840";
    const canonicalExternalHref = `/works/external?workId=${encodeURIComponent(externalId)}`;
    const providerCaption = "E2E のキャッシュ境界を確認する作品紹介です。";

    await context.route(/\/api\/rakuten\/(?:search|item)(?:\?|$)/u, async (route) => {
      const requestUrl = new URL(route.request().url());
      if (requestUrl.pathname === "/api/rakuten/item") {
        const isbn = requestUrl.searchParams.get("isbn");
        expect(isbn).toMatch(/^\d{13}$/u);
        await route.fulfill({
          body: JSON.stringify({
            listing: {
              title: "E2E キャッシュ確認 1",
              author: "E2E 著者",
              publisherName: "E2E 出版社",
              isbn,
              itemCaption: providerCaption,
              itemPrice: 770,
              itemUrl: "https://books.rakuten.co.jp/rb/e2e-sovereignty-cache/",
              availability: 1,
              reviewAverage: 4.4,
              reviewCount: 11,
            },
          }),
          contentType: "application/json",
          status: 200,
        });
        return;
      }

      expect(requestUrl.pathname).toBe("/api/rakuten/search");
      expect(requestUrl.searchParams.get("title")).toBe(externalTitle);
      await route.fulfill({
        body: JSON.stringify({
          items: [
            {
              title: externalTitle,
              author: externalCreator,
              publisherName: "E2E 出版社",
              isbn: externalIsbn,
              itemPrice: 880,
              itemUrl: "https://books.rakuten.co.jp/rb/e2e-sovereignty-external/",
              availability: 1,
              reviewAverage: 4.2,
              reviewCount: 9,
            },
          ],
        }),
        contentType: "application/json",
        status: 200,
      });
    });

    await completeKeyboardOnboarding(page);

    const firstRecommendation = page.locator("li[data-recommendation-work-id]:not([data-carousel-clone])").first();
    const providerWorkId = await firstRecommendation.getAttribute("data-recommendation-work-id");
    expect(providerWorkId).toBeTruthy();
    await expect
      .poll(
        async () => {
          const cachedWorkIds = new Set(
            (await readProductState(page)).providerCache.map((record) => record.workId),
          );
          return providerWorkId !== null && cachedWorkIds.has(providerWorkId);
        },
        { timeout: 45_000 },
      )
      .toBe(true);
    const providerCacheBeforeDetail = (await readProductState(page)).providerCache;
    const cachedProviderWorkBeforeDetail = providerCacheBeforeDetail.find(
      (record) => record.workId === providerWorkId,
    );
    expect(cachedProviderWorkBeforeDetail).toBeTruthy();
    await openRecommendationDetail(page, providerWorkId!);
    await expect(page.locator(`main[data-work-detail-id='${providerWorkId}']`)).toBeVisible();
    await expect(page.getByText(providerCaption, { exact: true })).toBeVisible();
    await expect
      .poll(async () =>
        (await readProductState(page)).providerCache.find(
          (record) => record.workId === providerWorkId,
        ),
      )
      .toEqual(cachedProviderWorkBeforeDetail);
    await page.goBack();
    if (new URL(page.url()).searchParams.has("preview")) await page.goBack();
    await expect(page).toHaveURL(/\/recommendations$/u);
    await expect(page.locator("li[data-recommendation-work-id]:not([data-carousel-clone])")).toHaveCount(10);

    await page.goto("/library");
    const externalSearch = await openLibrarySearch(page, externalTitle);
    await expect(externalSearch.getByText("カタログ内では見つかりませんでした。")).toBeVisible();
    await externalSearch.getByRole("button", { name: "楽天ブックスで探す" }).click();
    const externalResult = externalSearch.getByRole("listitem").filter({ hasText: externalTitle });
    await expect(externalResult).toHaveCount(1);
    await externalResult.getByRole("button", { name: "カタログ外として追加" }).click();
    await expect(
      externalSearch.getByText(`「${externalTitle}」を読みたいに追加しました。`, {
        exact: true,
      }),
    ).toBeVisible();
    await externalSearch.getByRole("button", { name: "閉じる" }).click();

    await page.getByRole("tab", { name: "読みたい" }).click();
    await page.getByRole("button", { name: `「${externalTitle}」の記録を編集` }).click();
    const externalEditor = page.getByRole("dialog", { name: externalTitle });
    await expect(
      externalEditor.getByRole("link", { name: "カタログ外作品の詳細を見る" }),
    ).toHaveAttribute("href", canonicalExternalHref);
    await externalEditor.getByRole("combobox", { name: "読書状態" }).selectOption("reading");
    await externalEditor.getByRole("combobox", { name: "感想" }).selectOption("favorite");
    await externalEditor.getByRole("spinbutton", { name: "巻" }).fill("3");
    await externalEditor.getByRole("button", { name: "変更を保存" }).click();
    await expect(
      externalEditor.getByText("読書記録を保存しました。", { exact: true }),
    ).toBeVisible();
    await expect
      .poll(async () =>
        (await readProductState(page)).externalWorks.find((record) => record.id === externalId),
      )
      .toEqual(
        expect.objectContaining({
          id: externalId,
          normalizedKey: externalNormalizedKey,
          record: expect.objectContaining({
            progress: { volume: 3 },
            reaction: "favorite",
            readingState: "reading",
            workId: externalId,
          }),
        }),
      );
    await externalEditor.getByRole("button", { name: "閉じる" }).click();

    await page.goto("/settings");
    await expect(page.getByRole("heading", { level: 1, name: "設定" })).toBeVisible({
      timeout: 15_000,
    });
    const verifiedPolicy = page.getByRole("switch", { name: "検証済み作品を優先" });
    await expect(verifiedPolicy).not.toBeChecked();
    await verifiedPolicy.click();
    await expect(verifiedPolicy).toBeChecked();
    await expect
      .poll(
        async () =>
          (await readProductState(page)).profile.find((entry) => entry.key === "policies")?.value,
      )
      .toEqual({
        preferCompleted: false,
        preferHidden: false,
        preferVerified: true,
        excludeIncomplete: false,
      });

    const initialState = await readProductState(page);
    expect(initialState.userWorks).toHaveLength(9);
    expect(initialState.externalWorks).toHaveLength(1);
    expect(initialState.onboardingDraft).toEqual([]);
    expect(initialState.recommendationCache.length).toBeGreaterThan(0);
    expect(initialState.providerCache.length).toBeGreaterThan(0);
    const initialCacheHashes = initialState.recommendationCache.map((record) => record.inputHash);
    const exported = await downloadExport(page);
    expect(Object.keys(exported.file).sort()).toEqual([
      "catalogVersion",
      "exportedAt",
      "externalWorks",
      "format",
      "onboardingDraft",
      "profile",
      "schemaVersion",
      "userWorks",
    ]);
    expect(exported.file).toMatchObject({
      format: "konocomics-export",
      schemaVersion: 1,
      userWorks: jsonNormalized(initialState.userWorks),
      externalWorks: jsonNormalized(initialState.externalWorks),
      onboardingDraft: null,
    });
    expect(exported.file.profile.policies).toEqual({
      preferCompleted: false,
      preferHidden: false,
      preferVerified: true,
      excludeIncomplete: false,
    });
    expect(exported.file.profile.onboardingCompletedAt).toBe(
      profileValues(initialState).onboardingCompletedAt,
    );
    expect(Object.hasOwn(exported.file, "recommendationCache")).toBe(false);
    expect(Object.hasOwn(exported.file, "providerCache")).toBe(false);
    expect(Object.hasOwn(exported.file, "meta")).toBe(false);

    await deleteAllDataThroughSettings(page);
    const deletedState = await readProductState(page);
    expectEmptyDataStores(deletedState);
    expectCurrentRuntimeMeta(deletedState, exported.file.catalogVersion);

    const guardedPage = await context.newPage();
    await guardedPage.goto("/recommendations");
    await expect(guardedPage).toHaveURL(/\/onboarding$/u);
    await expect(
      guardedPage.getByRole("heading", {
        level: 1,
        name: "好きなマンガを 5〜10 作品えらんでください",
      }),
    ).toBeVisible();
    await guardedPage.close();

    await openSettingsFromLanding(page);
    await selectImportFile(page, exported.filename, exported.buffer);
    await expect(page.locator('[data-import-state="ready"]')).toContainText("10 作品");
    await confirmImport(page);
    const importedState = await readProductState(page);
    expect(importedState.userWorks).toEqual(exported.file.userWorks);
    expect(importedState.externalWorks).toEqual(exported.file.externalWorks);
    expect(profileValues(importedState)).toEqual({
      adjustments: exported.file.profile.adjustments,
      onboardingCompletedAt: exported.file.profile.onboardingCompletedAt,
      policies: exported.file.profile.policies,
    });
    expect(importedState.onboardingDraft).toEqual([]);
    expect(importedState.recommendationCache).toEqual([]);
    expect(importedState.providerCache).toEqual([]);
    expectCurrentRuntimeMeta(importedState, exported.file.catalogVersion);
    await expect(page.getByRole("switch", { name: "検証済み作品を優先" })).toBeChecked();

    const beforeIntroductionBypass = stateBytes(importedState);
    await page.goto("/?landing=1");
    await expect(page.locator('main[data-landing-state="introduction"]')).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 1, name: "好みから見つける、次のマンガ。" }),
    ).toBeVisible();
    expect(stateBytes(await readProductState(page))).toBe(beforeIntroductionBypass);

    await page.goto("/");
    await expect(page).toHaveURL(/\/recommendations$/u);
    await expect(page.locator("li[data-recommendation-work-id]:not([data-carousel-clone])")).toHaveCount(10);
    const recomputedHash = await page
      .locator("main[data-recommendation-input-hash]")
      .getAttribute("data-recommendation-input-hash");
    if (recomputedHash === null) throw new Error("The recomputed recommendation hash is missing");
    await expect
      .poll(async () =>
        (await readProductState(page)).recommendationCache.some(
          (record) => record.inputHash === recomputedHash,
        ),
      )
      .toBe(true);
    expect(initialCacheHashes).not.toContain(recomputedHash);

    await page.goto("/library");
    await page.getByRole("tab", { name: "読んだ" }).click();
    await expect(page.getByRole("button", { name: "「鋼の錬金術師」の記録を編集" })).toBeVisible();
    await page.getByRole("tab", { name: "読んでる" }).click();
    await page.getByRole("button", { name: `「${externalTitle}」の記録を編集` }).click();
    const restoredExternalEditor = page.getByRole("dialog", { name: externalTitle });
    await expect(restoredExternalEditor.getByRole("combobox", { name: "読書状態" })).toHaveValue(
      "reading",
    );
    await expect(restoredExternalEditor.getByRole("combobox", { name: "感想" })).toHaveValue(
      "favorite",
    );
    await expect(restoredExternalEditor.getByRole("spinbutton", { name: "巻" })).toHaveValue("3");
    await expect(
      restoredExternalEditor.getByRole("link", { name: "カタログ外作品の詳細を見る" }),
    ).toHaveAttribute("href", canonicalExternalHref);
    await restoredExternalEditor.getByRole("button", { name: "閉じる" }).click();

    await page.goto("/settings");
    const beforeCorruptImport = await readProductState(page);
    const corruptId = `ext:rakuten:v1:${"a".repeat(64)}`;
    const corruptExport: DownloadedExportFile = {
      ...exported.file,
      externalWorks: exported.file.externalWorks.map((record, index) =>
        index === 0
          ? {
              ...record,
              id: corruptId,
              record: { ...record.record, workId: corruptId },
            }
          : record,
      ),
    };
    await selectImportFile(
      page,
      "konocomics-corrupt-external.json",
      Buffer.from(`${JSON.stringify(corruptExport, null, 2)}\n`),
    );
    await expect(
      page.getByRole("alert").filter({ hasText: "識別情報が壊れています" }),
    ).toContainText("識別情報が壊れています");
    await expect(page.locator('[data-import-state="ready"]')).toHaveCount(0);
    expect(stateBytes(await readProductState(page))).toBe(stateBytes(beforeCorruptImport));

    const catalogMissingWorkId = "removed-from-current-catalog-e2e";
    const mismatchExport: DownloadedExportFile = {
      ...exported.file,
      catalogVersion: `${exported.file.catalogVersion}-previous`,
      userWorks: [
        ...exported.file.userWorks,
        {
          workId: catalogMissingWorkId,
          readingState: "planned",
          updatedAt: exported.file.exportedAt,
        },
      ],
    };
    await selectImportFile(
      page,
      "konocomics-previous-catalog.json",
      Buffer.from(`${JSON.stringify(mismatchExport, null, 2)}\n`),
    );
    await expect(page.locator(".settings-import-preview__warning")).toContainText(
      "カタログのバージョンが異なります",
    );
    await confirmImport(page);
    const mismatchState = await readProductState(page);
    expect(mismatchState.userWorks).toContainEqual(
      expect.objectContaining({ workId: catalogMissingWorkId, readingState: "planned" }),
    );
    expect(mismatchState.externalWorks).toEqual(exported.file.externalWorks);
    expect(mismatchState.recommendationCache).toEqual([]);
    expect(mismatchState.providerCache).toEqual([]);
    expectCurrentRuntimeMeta(mismatchState, exported.file.catalogVersion);

    await page.goto("/library");
    const catalogMissingRow = page.locator(
      `[data-library-row-kind='catalog-missing'][data-library-card-role='planned-compact'][data-work-id='${catalogMissingWorkId}']`,
    );
    await expect(catalogMissingRow).toBeVisible();
    await expect(catalogMissingRow).toContainText("現在のカタログ外");
    await expect(catalogMissingRow).toContainText(`作品ID: ${catalogMissingWorkId}`);

    await page.goto("/recommendations");
    await expect(page.locator("li[data-recommendation-work-id]:not([data-carousel-clone])")).toHaveCount(10);
    await expect(page.locator("main[data-recommendation-input-hash]")).toHaveAttribute(
      "data-recommendation-input-hash",
      recomputedHash,
    );

    const preProfileContext = await browser.newContext({
      baseURL: "http://localhost:3000",
      viewport: page.viewportSize() ?? undefined,
    });
    try {
      const preProfilePage = await preProfileContext.newPage();
      await preProfilePage.goto("/");
      await expect(preProfilePage.locator('main[data-landing-state="introduction"]')).toBeVisible();
      await preProfilePage
        .getByRole("link", { name: "好きなマンガから始める", exact: true })
        .click();
      await expect(preProfilePage).toHaveURL(/\/onboarding$/u);
      const draftSearch = preProfilePage.getByRole("searchbox", { name: "好きなマンガを検索" });
      await draftSearch.fill("鋼の錬金術師");
      const draftSearchResults = preProfilePage.locator(".work-search-grid");
      await expect(draftSearchResults).toBeVisible();
      const draftSelection = draftSearchResults.getByRole("button", {
        name: "鋼の錬金術師 — 好きに追加",
      });
      await expect(draftSelection).toBeVisible();
      await draftSelection.click();
      await expect
        .poll(
          async () =>
            (await readProductState(preProfilePage)).onboardingDraft[0]?.positiveEntries.length,
        )
        .toBe(1);

      await preProfilePage.goBack();
      await expect(preProfilePage.locator('main[data-landing-state="introduction"]')).toBeVisible();
      await openSettingsFromLanding(preProfilePage);
      const preProfileExport = await downloadExport(preProfilePage);
      expect(preProfileExport.file.userWorks).toEqual([]);
      expect(preProfileExport.file.externalWorks).toEqual([]);
      expect(preProfileExport.file.profile).toEqual({
        adjustments: { axes: {}, themes: {} },
        policies: {
          preferCompleted: false,
          preferHidden: false,
          preferVerified: false,
          excludeIncomplete: false,
        },
        onboardingCompletedAt: null,
      });
      expect(preProfileExport.file.onboardingDraft).toMatchObject({
        id: "current",
        mode: "firstRun",
        positiveEntries: [expect.objectContaining({ workId: "fullmetal-alchemist" })],
      });

      await deleteAllDataThroughSettings(preProfilePage);
      const deletedPreProfile = await readProductState(preProfilePage);
      expectEmptyDataStores(deletedPreProfile);
      expectCurrentRuntimeMeta(deletedPreProfile, preProfileExport.file.catalogVersion);

      await openSettingsFromLanding(preProfilePage);
      await selectImportFile(preProfilePage, preProfileExport.filename, preProfileExport.buffer);
      await confirmImport(preProfilePage);
      const restoredPreProfile = await readProductState(preProfilePage);
      expect(restoredPreProfile.userWorks).toEqual([]);
      expect(restoredPreProfile.externalWorks).toEqual([]);
      expect(restoredPreProfile.onboardingDraft).toEqual([preProfileExport.file.onboardingDraft]);
      expect(profileValues(restoredPreProfile)).toEqual({
        adjustments: preProfileExport.file.profile.adjustments,
        policies: preProfileExport.file.profile.policies,
      });
      expect(profileValues(restoredPreProfile)).not.toHaveProperty("onboardingCompletedAt");
      expect(restoredPreProfile.recommendationCache).toEqual([]);
      expect(restoredPreProfile.providerCache).toEqual([]);
      expectCurrentRuntimeMeta(restoredPreProfile, preProfileExport.file.catalogVersion);

      await preProfilePage.goto("/onboarding");
      await preProfilePage
        .getByRole("searchbox", { name: "好きなマンガを検索" })
        .fill("鋼の錬金術師");
      await expect(
        preProfilePage
          .locator(".work-search-grid")
          .getByRole("button", { name: "鋼の錬金術師 — 選択を解除" }),
      ).toHaveAttribute("aria-pressed", "true");
    } finally {
      await preProfileContext.close();
    }
  });
});
