// @vitest-environment jsdom

import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import catalogJson from "@/data/generated/catalog-v1.json";
import { catalogV1Schema } from "@/domain/catalog/schema";
import {
  createRecommendationCoverTargets,
  resolveRecommendationCover,
  useRecommendationCovers,
  type RecommendationCoverTarget,
} from "@/features/recommendations/recommendation-cover-resolver";
import type { ProviderCacheRecord } from "@/infrastructure/db";
import type { RakutenBookItem } from "@/infrastructure/rakuten";

const NOW = "2026-08-15T00:00:00.000Z";
const catalog = catalogV1Schema.parse(catalogJson);
const targets = createRecommendationCoverTargets(
  catalog,
  catalog.works.slice(5, 9).map((work) => work.id),
);

function itemFor(target: RecommendationCoverTarget, image = true): RakutenBookItem {
  return {
    title: target.workId,
    author: "作者",
    publisherName: "出版社",
    isbn: target.isbn,
    itemPrice: 770,
    itemUrl: `https://books.rakuten.co.jp/rb/${target.workId}/`,
    availability: 1,
    reviewAverage: 4.5,
    reviewCount: 12,
    ...(image ? { imageUrl: `https://thumbnail.image.rakuten.co.jp/${target.workId}.jpg` } : {}),
  };
}

function cacheFor(
  target: RecommendationCoverTarget,
  options: Readonly<{
    image?: boolean;
    workId?: string;
    metadataExpiresAt?: string;
  }> = {},
): ProviderCacheRecord {
  const item = itemFor(target, options.image ?? true);
  return {
    workId: options.workId ?? target.workId,
    provider: "rakuten",
    isbn: target.isbn,
    imageUrl: item.imageUrl,
    fetchedAt: NOW,
    commercialExpiresAt: "2099-08-15T00:00:00.000Z",
    metadataExpiresAt: options.metadataExpiresAt ?? "2099-08-15T00:00:00.000Z",
  };
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise;
  });
  return { promise, resolve };
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("recommendation cover resolver", () => {
  it("maps visible work IDs to normalized representative-volume ISBNs in display order", () => {
    const orderedWorkIds = [catalog.works[12]!.id, catalog.works[6]!.id, catalog.works[10]!.id];
    const result = createRecommendationCoverTargets(catalog, orderedWorkIds);

    expect(result.map((target) => target.workId)).toEqual(orderedWorkIds);
    result.forEach((target) => {
      const volumeId = catalog.representativeVolumeByWorkId[target.workId];
      expect(target.isbn).toBe(catalog.volumes.find((volume) => volume.id === volumeId)?.isbn);
    });
  });

  it("uses fresh exact-work metadata and treats a fresh no-image record as terminal", async () => {
    const target = targets[0]!;
    const requestBook = vi.fn();
    const saveProviderCache = vi.fn();

    await expect(
      resolveRecommendationCover(target, {
        getProviderCache: vi.fn(async () => cacheFor(target)),
        saveProviderCache,
        requestBook,
        now: () => NOW,
      }),
    ).resolves.toMatchObject({
      coverUrl: `https://thumbnail.image.rakuten.co.jp/${target.workId}.jpg`,
      source: "fresh-cache",
    });
    await expect(
      resolveRecommendationCover(target, {
        getProviderCache: vi.fn(async () => cacheFor(target, { image: false })),
        saveProviderCache,
        requestBook,
        now: () => NOW,
      }),
    ).resolves.toMatchObject({ coverUrl: null, source: "fresh-cache" });
    expect(requestBook).not.toHaveBeenCalled();
    expect(saveProviderCache).not.toHaveBeenCalled();
  });

  it.each(["miss", "expired", "mismatched-work"] as const)(
    "refreshes a %s before exposing provider metadata",
    async (cacheState) => {
      const target = targets[0]!;
      const staleCache =
        cacheState === "miss"
          ? null
          : cacheFor(target, {
              ...(cacheState === "expired" ? { metadataExpiresAt: NOW } : {}),
              ...(cacheState === "mismatched-work" ? { workId: "another-work" } : {}),
            });
      const requestBook = vi.fn(async () => itemFor(target));
      const saveProviderCache = vi.fn(async (record: ProviderCacheRecord) => record);

      const result = await resolveRecommendationCover(target, {
        getProviderCache: vi.fn(async () => staleCache),
        saveProviderCache,
        requestBook,
        now: () => NOW,
      });

      expect(result).toMatchObject({
        coverUrl: `https://thumbnail.image.rakuten.co.jp/${target.workId}.jpg`,
        source: "refreshed",
      });
      expect(requestBook).toHaveBeenCalledWith(target.isbn);
      expect(saveProviderCache).toHaveBeenCalledWith(
        expect.objectContaining({ workId: target.workId, isbn: target.isbn }),
      );
    },
  );

  it("returns an unavailable placeholder result after cache and provider failures", async () => {
    const target = targets[0]!;
    const saveProviderCache = vi.fn();
    const result = await resolveRecommendationCover(target, {
      getProviderCache: vi.fn(async () => {
        throw new Error("cache unavailable");
      }),
      saveProviderCache,
      requestBook: vi.fn(async () => {
        throw new Error("provider unavailable");
      }),
      now: () => NOW,
    });

    expect(result).toMatchObject({ coverUrl: null, source: "unavailable" });
    expect(saveProviderCache).not.toHaveBeenCalled();
  });

  it("waits for the first rendered cover to settle before starting the remaining providers", async () => {
    const firstCache = deferred<ProviderCacheRecord | null>();
    const getProviderCache = vi.fn((isbn: string) => {
      const target = targets.find((candidate) => candidate.isbn === isbn)!;
      return target === targets[0]
        ? firstCache.promise
        : Promise.resolve<ProviderCacheRecord | null>(cacheFor(target));
    });
    const saveProviderCache = vi.fn(async (record: ProviderCacheRecord) => record);
    const visibleTargets = targets.slice(0, 3);
    const { result } = renderHook(() =>
      useRecommendationCovers({ targets: visibleTargets, getProviderCache, saveProviderCache }),
    );

    await waitFor(() => expect(getProviderCache).toHaveBeenCalledTimes(1));
    expect(getProviderCache).toHaveBeenCalledWith(visibleTargets[0]!.isbn);
    expect(result.current.coverUrls.size).toBe(0);

    act(() => firstCache.resolve(cacheFor(visibleTargets[0]!)));
    await waitFor(() => expect(result.current.coverUrls.size).toBe(1));
    expect(getProviderCache).toHaveBeenCalledTimes(1);
    expect(result.current.coverUrls.get(visibleTargets[0]!.workId)).toContain(
      visibleTargets[0]!.workId,
    );

    act(() => result.current.notifyCoverSettled(visibleTargets[0]!));
    await waitFor(() => expect(getProviderCache).toHaveBeenCalledTimes(3));
    await waitFor(() => expect(result.current.coverUrls.size).toBe(3));
  });

  it("retains survivor URLs and resolves only a newly backfilled work", async () => {
    const getProviderCache = vi.fn(async (isbn: string) => {
      const target = targets.find((candidate) => candidate.isbn === isbn)!;
      return cacheFor(target);
    });
    const saveProviderCache = vi.fn(async (record: ProviderCacheRecord) => record);
    const initial = targets.slice(0, 2);
    const { result, rerender } = renderHook(
      ({ visibleTargets }) =>
        useRecommendationCovers({
          targets: visibleTargets,
          getProviderCache,
          saveProviderCache,
        }),
      { initialProps: { visibleTargets: initial } },
    );
    await waitFor(() => expect(result.current.coverUrls.size).toBe(1));
    act(() => result.current.notifyCoverSettled(initial[0]!));
    await waitFor(() => expect(result.current.coverUrls.size).toBe(2));
    const survivorUrl = result.current.coverUrls.get(initial[1]!.workId);
    getProviderCache.mockClear();

    rerender({ visibleTargets: [initial[1]!, targets[2]!] });
    act(() => result.current.notifyCoverSettled(initial[1]!));
    await waitFor(() =>
      expect(result.current.coverUrls.get(targets[2]!.workId)).toContain(targets[2]!.workId),
    );

    expect(result.current.coverUrls.get(initial[1]!.workId)).toBe(survivorUrl);
    expect(getProviderCache).toHaveBeenCalledOnce();
    expect(getProviderCache).toHaveBeenCalledWith(targets[2]!.isbn);
  });

  it("fences stale-generation results and does not start their remaining queue", async () => {
    const staleFirst = deferred<ProviderCacheRecord | null>();
    const getProviderCache = vi.fn((isbn: string) => {
      const target = targets.find((candidate) => candidate.isbn === isbn)!;
      return target === targets[0]
        ? staleFirst.promise
        : Promise.resolve<ProviderCacheRecord | null>(cacheFor(target));
    });
    const saveProviderCache = vi.fn(async (record: ProviderCacheRecord) => record);
    const { result, rerender } = renderHook(
      ({ visibleTargets }) =>
        useRecommendationCovers({
          targets: visibleTargets,
          getProviderCache,
          saveProviderCache,
        }),
      { initialProps: { visibleTargets: targets.slice(0, 2) } },
    );
    await waitFor(() => expect(getProviderCache).toHaveBeenCalledWith(targets[0]!.isbn));

    rerender({ visibleTargets: [targets[2]!] });
    await waitFor(() =>
      expect(result.current.coverUrls.get(targets[2]!.workId)).toContain(targets[2]!.workId),
    );
    act(() => staleFirst.resolve(cacheFor(targets[0]!)));
    await act(async () => Promise.resolve());

    expect(result.current.coverUrls.has(targets[0]!.workId)).toBe(false);
    expect(getProviderCache).not.toHaveBeenCalledWith(targets[1]!.isbn);
  });

  it("can reuse an exact in-flight result when its target becomes current again", async () => {
    const firstCache = deferred<ProviderCacheRecord | null>();
    const getProviderCache = vi.fn((isbn: string) => {
      const target = targets.find((candidate) => candidate.isbn === isbn)!;
      return target === targets[0]
        ? firstCache.promise
        : Promise.resolve<ProviderCacheRecord | null>(cacheFor(target));
    });
    const saveProviderCache = vi.fn(async (record: ProviderCacheRecord) => record);
    const { result, rerender } = renderHook(
      ({ visibleTargets }) =>
        useRecommendationCovers({
          targets: visibleTargets,
          getProviderCache,
          saveProviderCache,
        }),
      { initialProps: { visibleTargets: [targets[0]!] } },
    );
    await waitFor(() => expect(getProviderCache).toHaveBeenCalledWith(targets[0]!.isbn));

    rerender({ visibleTargets: [targets[1]!] });
    await waitFor(() => expect(result.current.coverUrls.has(targets[1]!.workId)).toBe(true));
    rerender({ visibleTargets: [targets[0]!] });
    act(() => firstCache.resolve(cacheFor(targets[0]!)));

    await waitFor(() => {
      expect(result.current.coverUrls.get(targets[0]!.workId)).toContain(targets[0]!.workId);
    });
    expect(getProviderCache.mock.calls.filter(([isbn]) => isbn === targets[0]!.isbn)).toHaveLength(
      1,
    );
  });
});
