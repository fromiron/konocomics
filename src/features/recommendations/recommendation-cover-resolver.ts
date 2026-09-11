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
  itemCaption?: string;
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
          itemCaption: cache.metadata?.itemCaption,
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
      itemCaption: savedCache.metadata?.itemCaption,
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
  itemCaptions: ReadonlyMap<string, string>;
  requestCover(workId: string): void;
}>;

type InFlightCoverResolution = Readonly<{
  generation: number;
  request: Promise<RecommendationCoverResolution>;
}>;

const COVER_RESOLUTION_CONCURRENCY = 4;

export function useRecommendationCovers({
  targets,
  getProviderCache,
  saveProviderCache,
}: UseRecommendationCoversInput): RecommendationCoverState {
  const generationRef = useRef(0);
  const completedRef = useRef(new Map<string, string | null>());
  const inFlightRef = useRef(new Map<string, InFlightCoverResolution>());
  const demandedWorkIdsRef = useRef(new Set<string>());
  const enqueueRef = useRef<((workId: string) => void) | null>(null);
  const [resolvedByTarget, setResolvedByTarget] = useState<
    ReadonlyMap<string, RecommendationCoverResolution>
  >(() => new Map());
  const requestCover = useCallback((workId: string) => {
    demandedWorkIdsRef.current.add(workId);
    enqueueRef.current?.(workId);
  }, []);

  useLayoutEffect(() => {
    const generation = generationRef.current + 1;
    generationRef.current = generation;
    const first = targets[0];
    const targetsByWorkId = new Map(targets.map((target) => [target.workId, target] as const));
    const pending: RecommendationCoverTarget[] = [];
    const scheduledKeys = new Set<string>();
    let active = 0;

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

    const commit = (resolution: RecommendationCoverResolution, flushBeforeContinuing = false) => {
      if (generationRef.current !== generation) return false;
      const key = targetKey(resolution.target);
      completedRef.current.set(key, resolution.coverUrl);
      const update = () => {
        setResolvedByTarget((current) => {
          const next = new Map(current);
          next.set(key, resolution);
          return next;
        });
      };
      if (flushBeforeContinuing) flushSync(update);
      else update();
      return true;
    };

    const pump = () => {
      while (generationRef.current === generation && active < COVER_RESOLUTION_CONCURRENCY) {
        const target = pending.shift();
        if (target === undefined) return;
        const key = targetKey(target);
        active += 1;
        void resolveShared(target)
          .then((resolution) => commit(resolution, target === first))
          .finally(() => {
            active -= 1;
            scheduledKeys.delete(key);
            pump();
          });
      }
    };

    const enqueue = (workId: string) => {
      const target = targetsByWorkId.get(workId);
      if (target === undefined) return;
      const key = targetKey(target);
      if (
        completedRef.current.has(key) ||
        scheduledKeys.has(key) ||
        inFlightRef.current.get(key)?.generation === generation
      ) {
        return;
      }
      scheduledKeys.add(key);
      pending.push(target);
      pump();
    };

    enqueueRef.current = enqueue;
    if (first !== undefined) enqueue(first.workId);
    demandedWorkIdsRef.current.forEach(enqueue);

    return () => {
      if (enqueueRef.current === enqueue) enqueueRef.current = null;
      if (generationRef.current === generation) {
        generationRef.current += 1;
      }
    };
  }, [getProviderCache, saveProviderCache, targets]);

  const metadata = useMemo(() => {
    const coverUrls = new Map<string, string | null>();
    const itemCaptions = new Map<string, string>();
    targets.forEach((target) => {
      const resolution = resolvedByTarget.get(targetKey(target));
      if (resolution === undefined) return;
      coverUrls.set(target.workId, resolution.coverUrl);
      if (resolution.itemCaption) itemCaptions.set(target.workId, resolution.itemCaption);
    });
    return { coverUrls, itemCaptions };
  }, [resolvedByTarget, targets]);

  return useMemo(() => ({ ...metadata, requestCover }), [metadata, requestCover]);
}
