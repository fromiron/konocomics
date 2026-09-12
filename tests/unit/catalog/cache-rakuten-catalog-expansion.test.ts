import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

let root: string;
let directory: string;
const startedAt = Date.parse("2026-09-12T00:00:00Z");
const rawHeader = "sourceItemId,sourceId,rawPublicationClass,rawTitle\n";
const firstRow = "first,konomanga-2026,comics,最初の作品\n";

beforeEach(() => {
  vi.resetModules();
  vi.useFakeTimers();
  vi.setSystemTime(startedAt);
  vi.stubEnv("RAKUTEN_APPLICATION_ID", "test-app");
  vi.stubEnv("RAKUTEN_ACCESS_KEY", "test-key");
  vi.stubEnv("RAKUTEN_ALLOWED_ORIGIN", "https://example.test");
  root = mkdtempSync(join(tmpdir(), "konocomics-rakuten-cache-"));
  directory = join(root, "data/staging/catalog-expansion");
  mkdirSync(directory, { recursive: true });
  writeFileSync(
    join(directory, "source-registry.csv"),
    "sourceId,sourceKind\nkonomanga-2026,award\n",
  );
  writeFileSync(join(directory, "raw-source-items.csv"), rawHeader + firstRow);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  rmSync(root, { recursive: true, force: true });
});

describe("Rakuten expansion cache", () => {
  it.each([
    [null, 7_200],
    ["", 7_200],
    ["-1", 7_200],
    ["invalid", 7_200],
    ["September 12, 2026", 7_200],
    ["Mon, 31 Feb 2026 00:00:00 GMT", 7_200],
    ["0", 3_600],
    ["45", 135_000],
    ["Sat, 12 Sep 2026 00:00:45 GMT", 47_400],
    ["Saturday, 12-Sep-26 00:00:45 GMT", 47_400],
    ["Sat Sep 12 00:00:45 2026", 47_400],
  ])("retries through the cache writer with Retry-After %s", async (header, elapsed) => {
    const requests: number[] = [];
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        requests.push(Date.now() - startedAt);
        const status = [429, 503, 500][requests.length - 1];
        return status === undefined
          ? Response.json({ items: [] })
          : new Response(null, {
              status,
              headers: header === null ? {} : { "retry-after": header },
            });
      }),
    );
    const { runRakutenExpansionCache } =
      await import("../../../scripts/cache-rakuten-catalog-expansion");
    const result = runRakutenExpansionCache("--write", root);
    await vi.runAllTimersAsync();
    await expect(result).resolves.toEqual({ queryCount: 1, fetched: 1 });
    expect(requests).toHaveLength(4);
    expect(requests.at(-1)).toBe(elapsed);
    expect(requests.slice(1).every((time, index) => time - requests[index]! >= 1_200)).toBe(true);
    await expect(runRakutenExpansionCache("--check", root)).resolves.toEqual({
      queryCount: 1,
      fetched: 0,
    });
  });

  it("stops after the last failure without another backoff or cache mutation", async () => {
    const fetch = vi.fn(async () => new Response(null, { status: 503 }));
    vi.stubGlobal("fetch", fetch);
    const { runRakutenExpansionCache } =
      await import("../../../scripts/cache-rakuten-catalog-expansion");
    const result = expect(runRakutenExpansionCache("--write", root)).rejects.toThrow(
      "retries exhausted",
    );
    await vi.runAllTimersAsync();
    await result;
    expect(fetch).toHaveBeenCalledTimes(4);
    expect(Date.now() - startedAt).toBe(7_200);
    expect(() => readFileSync(join(directory, "rakuten-search-results.jsonl"))).toThrow();
  });

  it("rejects delays beyond the timer range instead of retrying early", async () => {
    const fetch = vi.fn(
      async () => new Response(null, { status: 429, headers: { "retry-after": "2147484" } }),
    );
    vi.stubGlobal("fetch", fetch);
    const { runRakutenExpansionCache } =
      await import("../../../scripts/cache-rakuten-catalog-expansion");
    const result = expect(runRakutenExpansionCache("--write", root)).rejects.toThrow(
      "supported timer range",
    );
    await vi.runAllTimersAsync();
    await result;
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("records new retrieval dates while preserving cached responses and their dates", async () => {
    vi.setSystemTime(new Date("2026-08-22T00:00:00Z"));
    const fetch = vi.fn(async () => Response.json({ items: [] }));
    vi.stubGlobal("fetch", fetch);
    const { runRakutenExpansionCache } =
      await import("../../../scripts/cache-rakuten-catalog-expansion");
    const first = runRakutenExpansionCache("--write", root);
    await vi.runAllTimersAsync();
    await first;
    const original = readFileSync(join(directory, "rakuten-search-results.jsonl"), "utf8").trim();
    vi.setSystemTime(startedAt);
    writeFileSync(
      join(directory, "raw-source-items.csv"),
      rawHeader + firstRow + "second,konomanga-2026,comics,次の作品\n",
    );
    const second = runRakutenExpansionCache("--write", root);
    await vi.runAllTimersAsync();
    await expect(second).resolves.toEqual({ queryCount: 2, fetched: 1 });
    const lines = readFileSync(join(directory, "rakuten-search-results.jsonl"), "utf8")
      .trim()
      .split("\n");
    expect(lines).toContain(original);
    expect(lines.map((line) => JSON.parse(line))).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ sourceItemIds: ["second"], retrievedAt: "2026-09-12" }),
      ]),
    );
    expect(
      JSON.parse(readFileSync(join(directory, "rakuten-search-manifest.json"), "utf8")),
    ).toMatchObject({ retrievedThrough: "2026-09-12" });
    vi.setSystemTime(new Date("2026-09-13T00:00:00Z"));
    await expect(runRakutenExpansionCache("--check", root)).resolves.toEqual({
      queryCount: 2,
      fetched: 0,
    });
    expect(fetch).toHaveBeenCalledTimes(2);
    const manifest = readFileSync(join(directory, "rakuten-search-manifest.json"), "utf8");
    const cache = readFileSync(join(directory, "rakuten-search-results.jsonl"), "utf8");
    writeFileSync(join(directory, "raw-source-items.csv"), rawHeader);
    await expect(runRakutenExpansionCache("--write", root)).rejects.toThrow(
      "No eligible Rakuten queries",
    );
    expect(readFileSync(join(directory, "rakuten-search-manifest.json"), "utf8")).toBe(manifest);
    expect(readFileSync(join(directory, "rakuten-search-results.jsonl"), "utf8")).toBe(cache);
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});
