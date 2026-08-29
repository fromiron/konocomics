"use client";

import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";

import { normalizeIsbn } from "@/domain/catalog/normalize";
import type { CatalogV1 } from "@/domain/catalog/types";
import type { ProviderCacheRecord } from "@/infrastructure/db";
import {
  createProviderCacheRecord,
  inspectProviderCache,
  rakutenIsbnSchema,
  requestRakutenBook,
  type RakutenBookItem,
} from "@/infrastructure/rakuten";

export type RecommendationCoverTarget = Readonly<{
  workId: string;
  isbn: string;
}>;

type RecommendationCoverResolution = Readonly<{
  target: RecommendationCoverTarget;
  coverUrl: string | null;
  source: "fresh-cache" | "refreshed" | "unavailable";
}>;

type RecommendationCoverDependencies = Readonly<{
  getProviderCache(isbn: string): Promise<ProviderCacheRecord | null>;
  saveProviderCache(record: ProviderCacheRecord): Promise<ProviderCacheRecord>;
  requestBook?(isbn: string): Promise<RakutenBookItem>;
  now?(): string;
  isActive?(): boolean;
}>;

function targetKey(target: RecommendationCoverTarget) {
  return `${target.workId}\u0000${target.isbn}`;
}

function exactTargetRecord(record: ProviderCacheRecord, target: RecommendationCoverTarget) {
  return record.workId === target.workId && normalizeIsbn(record.isbn) === target.isbn;
}

function normalizedImageUrl(imageUrl: string | undefined) {
  const normalized = imageUrl?.trim();
  return normalized === undefined || normalized === "" ? null : normalized;
}

export function createRecommendationCoverTargets(
  catalog: CatalogV1,
  orderedWorkIds: readonly string[],
): RecommendationCoverTarget[] {
  const volumesById = new Map(catalog.volumes.map((volume) => [volume.id, volume] as const));
  return orderedWorkIds.flatMap((workId) => {
    const representativeVolumeId = catalog.representativeVolumeByWorkId[workId];
    const volume =
      representativeVolumeId === undefined ? undefined : volumesById.get(representativeVolumeId);
    if (volume === undefined || volume.workId !== workId) return [];
    const parsedIsbn = rakutenIsbnSchema.safeParse(normalizeIsbn(volume.isbn));
    return parsedIsbn.success ? [{ workId, isbn: parsedIsbn.data }] : [];
  });
}

export async function resolveRecommendationCover(
  target: RecommendationCoverTarget,
  dependencies: RecommendationCoverDependencies,
): Promise<RecommendationCoverResolution> {
  const now = dependencies.now ?? (() => new Date().toISOString());
  const requestBook = dependencies.requestBook ?? requestRakutenBook;

  try {
    let cached: ProviderCacheRecord | null = null;
    try {
      cached = await dependencies.getProviderCache(target.isbn);
    } catch {
      // A cache read failure is a miss; the provider path remains available.
    }

    if (cached !== null && exactTargetRecord(cached, target)) {
      const cache = inspectProviderCache(cached, now());
      if (cache.metadataFresh) {
        return {
          target,
          coverUrl: normalizedImageUrl(cache.metadata?.imageUrl),
          source: "fresh-cache",
        };
      }
    }

    const item = await requestBook(target.isbn);
    if (normalizeIsbn(item.isbn) !== target.isbn) {
      return { target, coverUrl: null, source: "unavailable" };
    }
    if (dependencies.isActive?.() === false) {
      return { target, coverUrl: null, source: "unavailable" };
    }

    const fetchedAt = now();
    const saved = await dependencies.saveProviderCache(
      createProviderCacheRecord({ workId: target.workId, item, fetchedAt }),
    );
    if (!exactTargetRecord(saved, target)) {
      return { target, coverUrl: null, source: "unavailable" };
    }
    const savedCache = inspectProviderCache(saved, fetchedAt);
    if (!savedCache.metadataFresh) {
      return { target, coverUrl: null, source: "unavailable" };
    }
    return {
      target,
      coverUrl: normalizedImageUrl(savedCache.metadata?.imageUrl),
      source: "refreshed",
    };
  } catch {
    return { target, coverUrl: null, source: "unavailable" };
  }
}

type UseRecommendationCoversInput = Readonly<{
  targets: readonly RecommendationCoverTarget[];
  getProviderCache(isbn: string): Promise<ProviderCacheRecord | null>;
  saveProviderCache(record: ProviderCacheRecord): Promise<ProviderCacheRecord>;
}>;

type RecommendationCoverState = Readonly<{
  coverUrls: ReadonlyMap<string, string | null>;
  notifyCoverSettled(target: RecommendationCoverTarget): void;
}>;

type InFlightCoverResolution = Readonly<{
  generation: number;
  request: Promise<RecommendationCoverResolution>;
}>;

const REMAINING_COVER_CONCURRENCY = 4;

export function useRecommendationCovers({
  targets,
  getProviderCache,
  saveProviderCache,
}: UseRecommendationCoversInput): RecommendationCoverState {
  const generationRef = useRef(0);
  const completedRef = useRef(new Map<string, string | null>());
  const inFlightRef = useRef(new Map<string, InFlightCoverResolution>());
  const [resolvedByTarget, setResolvedByTarget] = useState<ReadonlyMap<string, string | null>>(
    () => new Map(),
  );
  const notifyCoverSettled = useCallback(() => undefined, []);

  useLayoutEffect(() => {
    const generation = generationRef.current + 1;
    generationRef.current = generation;
    const first = targets[0];

    const resolveShared = (target: RecommendationCoverTarget) => {
      const key = targetKey(target);
      const existing = inFlightRef.current.get(key);
      if (existing?.generation === generation) return existing.request;
      const request = resolveRecommendationCover(target, {
        getProviderCache,
        isActive: () => generationRef.current === generation,
        saveProviderCache,
      });
      const inFlight = { generation, request };
      inFlightRef.current.set(key, inFlight);
      void request.finally(() => {
        if (inFlightRef.current.get(key) === inFlight) inFlightRef.current.delete(key);
      });
      return request;
    };

    const commit = (
      resolutions: readonly RecommendationCoverResolution[],
      flushBeforeContinuing = false,
    ) => {
      if (generationRef.current !== generation) return false;
      resolutions.forEach((resolution) => {
        completedRef.current.set(targetKey(resolution.target), resolution.coverUrl);
      });
      const update = () => {
        setResolvedByTarget((current) => {
          const next = new Map(current);
          resolutions.forEach((resolution) => {
            const key = targetKey(resolution.target);
            next.set(key, resolution.coverUrl);
          });
          return next;
        });
      };
      if (flushBeforeContinuing) flushSync(update);
      else update();
      return true;
    };

    void (async () => {
      if (first === undefined) return;
      if (!completedRef.current.has(targetKey(first))) {
        const firstResolution = await resolveShared(first);
        if (!commit([firstResolution], true)) return;
      }
      if (generationRef.current !== generation) return;
      const pending = targets
        .slice(1)
        .filter((target) => !completedRef.current.has(targetKey(target)));
      let nextIndex = 0;
      const resolveNext = async () => {
        while (generationRef.current === generation) {
          const target = pending[nextIndex];
          if (target === undefined) return;
          nextIndex += 1;
          const resolution = await resolveShared(target);
          if (!commit([resolution])) return;
        }
      };
      await Promise.all(
        Array.from({ length: Math.min(REMAINING_COVER_CONCURRENCY, pending.length) }, resolveNext),
      );
    })();

    return () => {
      if (generationRef.current === generation) {
        generationRef.current += 1;
      }
    };
  }, [getProviderCache, saveProviderCache, targets]);

  const coverUrls = useMemo(() => {
    const visible = new Map<string, string | null>();
    targets.forEach((target) => {
      const coverUrl = resolvedByTarget.get(targetKey(target));
      if (coverUrl !== undefined || resolvedByTarget.has(targetKey(target))) {
        visible.set(target.workId, coverUrl ?? null);
      }
    });
    return visible;
  }, [resolvedByTarget, targets]);

  return useMemo(() => ({ coverUrls, notifyCoverSettled }), [coverUrls, notifyCoverSettled]);
}
