"use client";

import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";

import { CoverImage, coverSourceForSize } from "@/components/cover/CoverImage";
import { Button, buttonClassName } from "@/components/design-system/button";
import { NativeSelect } from "@/components/design-system/native-select";
import { SiteFooter } from "@/components/layout/site-footer";
import { MediaPosterCard } from "@/components/media/media-poster-card";
import { MediaShelf } from "@/components/media/media-shelf";
import { ConfidenceLabel, ReasonChips } from "@/components/media/recommendation-evidence";
import { usePageEntryMotion } from "@/components/motion/use-page-entry-motion";
import recommendationContextJson from "@/data/generated/recommendation-context-v1.json";
import { AXIS_IDS, THEME_TAGS } from "@/domain/catalog/constants";
import type { CatalogV1, Work } from "@/domain/catalog/types";
import { generateTasteExplanation } from "@/domain/explanation";
import type { ExplanationFactorId, TasteRecommendationExplanation } from "@/domain/explanation";
import { hasCatalogBackedProfile } from "@/domain/profile/catalog-profile";
import type { ReadingState, UserWorkRecord } from "@/domain/profile/types";
import { recommendationContextSchema } from "@/domain/recommendation/context-schema";
import { scoreWorkCompatibility } from "@/domain/recommendation/rank";
import type { RecommendationInput } from "@/domain/recommendation/types";
import { useCatalog } from "@/features/catalog/catalog-provider";
import { WorkDetailShell } from "@/features/work-detail/work-detail-shell";
import {
  createRecommendationCoverTargets,
  type RecommendationCoverTarget,
  useRecommendationCovers,
} from "@/features/recommendations/recommendation-cover-resolver";
import { usePersistence, type ProviderCacheRecord } from "@/infrastructure/db";
import {
  buildRakutenBooksSearchUrl,
  createProviderCacheRecord,
  inspectProviderCache,
  requestRakutenBook,
  type ProviderCacheState,
} from "@/infrastructure/rakuten";
import {
  coverStrings,
  navigationStrings,
  recommendationStrings,
  workDetailStrings,
  explanationLexicon,
} from "@/lib/strings";

const parsedRecommendationContext =
  recommendationContextSchema.safeParse(recommendationContextJson);
const READING_STATES = ["planned", "reading", "completed", "dropped", "hidden"] as const;
const MAX_TIMER_DELAY_MS = 2_147_483_647;

type ProviderLoadState = Readonly<{
  isbn: string | null;
  phase: "loading" | "ready" | "error";
  cache: ProviderCacheState | null;
}>;

type CompatibilityState =
  | Readonly<{ kind: "hidden" }>
  | Readonly<{ kind: "unavailable" }>
  | Readonly<{ kind: "ready"; explanation: TasteRecommendationExplanation }>;

function providerNow() {
  return new Date(Date.now()).toISOString();
}

function nextProviderExpiry(
  record: ProviderCacheRecord,
  cache: ProviderCacheState,
): number | undefined {
  const candidates = [
    cache.commercialFresh ? Date.parse(record.commercialExpiresAt) : undefined,
    cache.metadataFresh ? Date.parse(record.metadataExpiresAt) : undefined,
  ].filter((value): value is number => value !== undefined);
  return candidates.length === 0 ? undefined : Math.min(...candidates);
}

function freshnessChanged(previous: ProviderCacheState, next: ProviderCacheState) {
  return (
    previous.commercialFresh !== next.commercialFresh ||
    previous.metadataFresh !== next.metadataFresh
  );
}

function isReadingState(value: string): value is ReadingState {
  return READING_STATES.some((state) => state === value);
}

function isMinimalPlannedRecord(record: UserWorkRecord | undefined) {
  return (
    record?.readingState === "planned" &&
    record.reaction === undefined &&
    record.progress?.volume === undefined &&
    record.progress?.chapter === undefined &&
    (record.positiveReasons?.length ?? 0) === 0 &&
    (record.negativeReasons?.length ?? 0) === 0 &&
    (record.droppedReasons?.length ?? 0) === 0
  );
}

function withoutDroppedReasons(record: UserWorkRecord | undefined) {
  if (record === undefined) return undefined;
  const next = { ...record };
  delete next.droppedReasons;
  return next;
}

function majorFactorIds(work: Work): ExplanationFactorId[] {
  const centralThemes = new Set(
    work.themes.filter((theme) => theme.centrality === 2).map((theme) => theme.id),
  );
  const themeIds = THEME_TAGS.filter((themeId) => centralThemes.has(themeId));
  const axisIds = AXIS_IDS.filter((axisId) => {
    const factor = work.axes[axisId];
    return factor.state === "known" && factor.value >= 3;
  });
  return [...themeIds, ...axisIds];
}

function compareWorkIds(left: Work, right: Work) {
  return left.id < right.id ? -1 : left.id === right.id ? 0 : 1;
}

function relatedWorkGroups(catalog: CatalogV1, source: Work) {
  const sourceThemes = new Set(
    source.themes.filter((theme) => theme.centrality > 0).map((theme) => theme.id),
  );
  const sourceAxes = AXIS_IDS.flatMap((axisId) => {
    const factor = source.axes[axisId];
    return factor.state === "known" ? [[axisId, factor.value] as const] : [];
  });
  const themeRanked = catalog.works
    .filter((work) => work.id !== source.id && work.eligibility.recommendationEligible)
    .map((work) => ({
      work,
      score: work.themes.reduce(
        (score, theme) => score + (sourceThemes.has(theme.id) ? theme.centrality : 0),
        0,
      ),
    }))
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score || compareWorkIds(left.work, right.work))
    .slice(0, 8)
    .map(({ work }) => work);
  const themeIds = new Set(themeRanked.map((work) => work.id));
  const moodRanked = catalog.works
    .filter(
      (work) =>
        work.id !== source.id && work.eligibility.recommendationEligible && !themeIds.has(work.id),
    )
    .map((work) => {
      const distances = sourceAxes.flatMap(([axisId, sourceValue]) => {
        const factor = work.axes[axisId];
        return factor.state === "known" ? [Math.abs(sourceValue - factor.value)] : [];
      });
      return {
        work,
        coverage: distances.length,
        distance: distances.reduce((sum, value) => sum + value, 0),
      };
    })
    .filter(({ coverage }) => coverage >= 4)
    .sort(
      (left, right) =>
        left.distance / left.coverage - right.distance / right.coverage ||
        compareWorkIds(left.work, right.work),
    )
    .slice(0, 8)
    .map(({ work }) => work);

  return { themeRanked, moodRanked };
}

function compatibilityFor(options: {
  catalog: CatalogV1;
  workId: string;
  records: readonly UserWorkRecord[] | undefined;
  adjustments: RecommendationInput["adjustments"] | undefined;
  policies: RecommendationInput["policies"] | undefined;
}): CompatibilityState {
  const { adjustments, catalog, policies, records, workId } = options;
  if (hasCatalogBackedProfile(records, catalog.works) !== true) {
    return { kind: "hidden" };
  }
  if (
    records === undefined ||
    adjustments === undefined ||
    policies === undefined ||
    !parsedRecommendationContext.success
  ) {
    return { kind: "unavailable" };
  }

  try {
    const result = scoreWorkCompatibility(
      {
        catalog,
        records: [...records],
        adjustments,
        policies,
        context: parsedRecommendationContext.data,
      },
      workId,
    );
    if (result === null) return { kind: "unavailable" };

    const worksById = new Map(catalog.works.map((work) => [work.id, work] as const));
    return {
      kind: "ready",
      explanation: generateTasteExplanation({
        contributions: result.contributions,
        confidenceLevel: result.confidenceLevel,
        lexicon: explanationLexicon,
        resolveTitle: (anchorWorkId) => worksById.get(anchorWorkId)?.title,
      }),
    };
  } catch {
    return { kind: "unavailable" };
  }
}

type WorkStateControlsProps = Readonly<{
  record: UserWorkRecord | undefined;
  recordsReady: boolean;
  workId: string;
  removeMinimalPlannedUserWork(
    workId: string,
  ): Promise<"removed" | "already-absent" | "preserved-conflict">;
  saveUserWork(record: UserWorkRecord): Promise<UserWorkRecord>;
}>;

function WorkStateControls({
  record,
  recordsReady,
  removeMinimalPlannedUserWork,
  saveUserWork,
  workId,
}: WorkStateControlsProps) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<
    Readonly<{ kind: "status" | "error"; text: string }> | undefined
  >();
  const actionInFlight = useRef(false);
  const minimalPlanned = isMinimalPlannedRecord(record);
  const plannedToggleUnavailable = record !== undefined && !minimalPlanned;

  const saveReadingState = async (readingState: ReadingState) => {
    if (!recordsReady || actionInFlight.current || record?.readingState === readingState) return;
    actionInFlight.current = true;
    setBusy(true);
    setMessage(undefined);
    try {
      const preservedRecord = readingState === "dropped" ? record : withoutDroppedReasons(record);
      await saveUserWork({
        ...preservedRecord,
        workId,
        readingState,
        updatedAt: new Date().toISOString(),
      });
      setMessage({ kind: "status", text: workDetailStrings.state.saved });
    } catch {
      setMessage({ kind: "error", text: workDetailStrings.state.error });
    } finally {
      actionInFlight.current = false;
      setBusy(false);
    }
  };

  const togglePlanned = async () => {
    if (!recordsReady || actionInFlight.current || plannedToggleUnavailable) return;
    actionInFlight.current = true;
    setBusy(true);
    setMessage(undefined);
    try {
      if (minimalPlanned) {
        const result = await removeMinimalPlannedUserWork(workId);
        setMessage({
          kind: "status",
          text:
            result === "removed"
              ? workDetailStrings.state.plannedRemoved
              : result === "already-absent"
                ? workDetailStrings.state.plannedAlreadyAbsent
                : workDetailStrings.state.plannedPreservedConflict,
        });
      } else {
        await saveUserWork({
          workId,
          readingState: "planned",
          updatedAt: new Date().toISOString(),
        });
        setMessage({ kind: "status", text: workDetailStrings.state.plannedSaved });
      }
    } catch {
      setMessage({ kind: "error", text: workDetailStrings.state.error });
    } finally {
      actionInFlight.current = false;
      setBusy(false);
    }
  };

  return (
    <section
      aria-labelledby="work-state-heading"
      className="grid gap-[var(--space-3)] rounded-[var(--radius-card)] border border-line bg-surface-overlay p-[var(--space-4)] md:gap-[var(--space-2)]"
      data-slot="work-state-controls"
    >
      <h2
        className="border-l-[length:var(--space-content-tight)] border-accent pl-[var(--space-3)] text-[length:var(--font-size-16)]"
        id="work-state-heading"
      >
        {workDetailStrings.state.heading}
      </h2>
      <div className="grid gap-[var(--space-content-loose)] min-[360px]:grid-cols-[minmax(0,1fr)_auto] min-[360px]:items-end">
        <label className="grid min-w-0 gap-[var(--space-content-tight)] text-[length:var(--text-caption-size)] font-bold text-text-muted">
          <span>{workDetailStrings.state.label}</span>
          <NativeSelect
            className="[&_[data-slot=native-select]]:min-h-[var(--control-min-size)] [&_[data-slot=native-select]]:border-line [&_[data-slot=native-select]]:bg-surface-2 [&_[data-slot=native-select]]:text-[length:var(--font-size-14)] [&_[data-slot=native-select]]:font-bold [&_[data-slot=native-select]]:text-text-strong"
            disabled={busy || !recordsReady}
            onChange={(event) => {
              if (isReadingState(event.target.value)) {
                void saveReadingState(event.target.value);
              }
            }}
            value={record?.readingState ?? ""}
          >
            <option disabled value="">
              {workDetailStrings.state.prompt}
            </option>
            {READING_STATES.map((state) => (
              <option key={state} value={state}>
                {workDetailStrings.state.options[state]}
              </option>
            ))}
          </NativeSelect>
        </label>
        <Button
          aria-pressed={minimalPlanned}
          className="min-w-[8rem] aria-pressed:border-accent aria-pressed:bg-accent aria-pressed:text-on-accent"
          disabled={busy || !recordsReady || plannedToggleUnavailable}
          onClick={() => void togglePlanned()}
          type="button"
          variant="outline"
        >
          {minimalPlanned
            ? workDetailStrings.state.plannedRemove
            : workDetailStrings.state.plannedAdd}
        </Button>
      </div>
      {!recordsReady ? (
        <p aria-live="polite" className="text-[length:var(--text-caption-size)] text-text-muted">
          {workDetailStrings.state.loading}
        </p>
      ) : plannedToggleUnavailable ? (
        <p className="text-[length:var(--text-caption-size)] text-text-muted">
          {workDetailStrings.state.managedByState}
        </p>
      ) : null}
      {busy ? (
        <p aria-live="polite" className="text-[length:var(--text-caption-size)] text-text-muted">
          {workDetailStrings.state.saving}
        </p>
      ) : message === undefined ? null : (
        <p
          className="text-[length:var(--text-caption-size)] text-text-muted [&[role=alert]]:border-l-[length:var(--space-content-tight)] [&[role=alert]]:border-warn [&[role=alert]]:px-[var(--space-3)] [&[role=alert]]:py-[var(--space-content)] [&[role=alert]]:text-text-strong"
          role={message.kind === "error" ? "alert" : "status"}
        >
          {message.text}
        </p>
      )}
    </section>
  );
}

function CompatibilitySection({
  anchorCoverTargets,
  anchorCoverUrls,
  catalog,
  notifyAnchorCoverSettled,
  state,
}: Readonly<{
  anchorCoverTargets: readonly RecommendationCoverTarget[];
  anchorCoverUrls: ReadonlyMap<string, string | null>;
  catalog: CatalogV1;
  notifyAnchorCoverSettled(target: RecommendationCoverTarget): void;
  state: CompatibilityState;
}>) {
  if (state.kind === "hidden") return null;

  return (
    <section
      aria-labelledby="work-compatibility-heading"
      className="grid gap-[var(--space-3)] rounded-[var(--radius-card)] border border-line-accent bg-surface-overlay p-[var(--space-4)] md:grid-cols-[minmax(0,2fr)_minmax(13rem,1fr)] md:gap-[var(--space-2)] md:p-[var(--space-3)]"
      data-slot="work-compatibility"
    >
      <h2
        className="border-l-[length:var(--space-content-tight)] border-accent pl-[var(--space-3)] text-[length:var(--font-size-16)] md:col-span-2"
        id="work-compatibility-heading"
      >
        {workDetailStrings.compatibility.heading}
      </h2>
      {state.kind === "unavailable" ? (
        <p>{workDetailStrings.compatibility.unavailable}</p>
      ) : (
        <>
          <div className="grid content-start gap-[var(--space-content)]">
            <h3 className="text-[length:var(--font-size-14)]">
              {workDetailStrings.compatibility.reasons}
            </h3>
            <ReasonChips
              caution={state.explanation.caution}
              cautionLabel={workDetailStrings.compatibility.caution}
              className="[&_li]:text-[length:var(--text-caption-size)] [&_li]:leading-[1.45]"
              emptyText={recommendationStrings.reasonUnavailable}
              presentation="feature-cards"
              reasons={state.explanation.positiveReasons}
            />
          </div>
          <div className="grid content-start gap-[var(--space-content-tight)]">
            {state.explanation.anchors.length === 0 ? null : (
              <>
                <h3 className="text-[length:var(--font-size-14)]">
                  {workDetailStrings.compatibility.anchors}
                </h3>
                <ul className="m-0 flex list-none flex-wrap gap-[var(--space-content)] p-0">
                  {state.explanation.anchors.map((anchor) => {
                    const anchorWork = catalog.works.find((work) => work.id === anchor.workId);
                    if (anchorWork === undefined) return null;
                    const coverTarget = anchorCoverTargets.find(
                      (target) => target.workId === anchor.workId,
                    );
                    return (
                      <li
                        className="grid max-w-full grid-cols-[var(--control-min-size)_minmax(0,1fr)] items-center gap-[var(--space-content)] rounded-[var(--radius-card)] border border-line bg-surface-2 p-[var(--space-content-tight)]"
                        key={anchor.workId}
                      >
                        <CoverImage
                          className="work-detail-compatibility__anchor-cover w-[var(--control-min-size)]"
                          coverUrl={anchorCoverUrls.get(anchor.workId)}
                          creators={anchorWork.creators}
                          decorative
                          onSettled={
                            coverTarget === undefined
                              ? undefined
                              : () => notifyAnchorCoverSettled(coverTarget)
                          }
                          requestedSize={200}
                          title={anchorWork.title}
                        />
                        <span className="[overflow-wrap:anywhere] text-[length:var(--text-caption-size)] font-bold">
                          {anchorWork.title}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
            <ConfidenceLabel
              className="mt-[var(--space-content-tight)]"
              label={state.explanation.confidence.label}
              prefix={workDetailStrings.compatibility.confidence}
            />
          </div>
        </>
      )}
    </section>
  );
}

function WorkDetailContent({ catalog, work }: Readonly<{ catalog: CatalogV1; work: Work }>) {
  const pageEntryMotion = usePageEntryMotion({ enabled: true, identity: work.id });
  const {
    adjustments,
    getProviderCache,
    policies,
    removeMinimalPlannedUserWork,
    saveProviderCache,
    saveUserWork,
    status,
    userWorks,
  } = usePersistence();
  const representativeVolumeId = catalog.representativeVolumeByWorkId[work.id];
  const representativeVolume = catalog.volumes.find(
    (volume) => volume.id === representativeVolumeId,
  );
  const isbn = representativeVolume?.isbn ?? null;
  const [providerAttempt, setProviderAttempt] = useState(0);
  const [providerLoad, setProviderLoad] = useState<ProviderLoadState>({
    isbn,
    phase: isbn === null ? "error" : "loading",
    cache: null,
  });
  const currentRecord = userWorks?.find((record) => record.workId === work.id);
  const factorIds = useMemo(() => majorFactorIds(work), [work]);
  const compatibility = useMemo(
    () =>
      compatibilityFor({
        catalog,
        workId: work.id,
        records: userWorks,
        adjustments,
        policies,
      }),
    [adjustments, catalog, policies, userWorks, work.id],
  );
  const relatedGroups = useMemo(() => relatedWorkGroups(catalog, work), [catalog, work]);
  const coverTargets = useMemo(() => {
    const anchorWorkIds =
      compatibility.kind === "ready"
        ? compatibility.explanation.anchors.map((anchor) => anchor.workId)
        : [];
    const orderedWorkIds = [
      ...new Set([
        ...anchorWorkIds,
        ...relatedGroups.themeRanked.map((related) => related.id),
        ...relatedGroups.moodRanked.map((related) => related.id),
      ]),
    ];
    return createRecommendationCoverTargets(catalog, orderedWorkIds);
  }, [catalog, compatibility, relatedGroups]);
  const { coverUrls, notifyCoverSettled } = useRecommendationCovers({
    targets: coverTargets,
    getProviderCache,
    saveProviderCache,
  });

  useEffect(() => {
    const first = coverTargets[0];
    if (first !== undefined && coverUrls.has(first.workId)) notifyCoverSettled(first);
  }, [coverTargets, coverUrls, notifyCoverSettled]);

  useEffect(() => {
    if (status.state === "initializing" || isbn === null) return;
    const providerIsbn = isbn;
    let active = true;
    let expiryTimer: ReturnType<typeof setTimeout> | undefined;

    function clearExpiryTimer() {
      if (expiryTimer !== undefined) {
        clearTimeout(expiryTimer);
        expiryTimer = undefined;
      }
    }

    function scheduleExpiry(
      record: ProviderCacheRecord,
      cache: ProviderCacheState,
      autoRefreshAllowed: boolean,
    ) {
      clearExpiryTimer();
      const expiresAt = nextProviderExpiry(record, cache);
      if (expiresAt === undefined) return;
      const delay = Math.min(Math.max(0, expiresAt - Date.now()), MAX_TIMER_DELAY_MS);
      expiryTimer = setTimeout(() => {
        if (!active) return;
        const nextCache = inspectProviderCache(record, providerNow());
        if (!freshnessChanged(cache, nextCache)) {
          scheduleExpiry(record, nextCache, autoRefreshAllowed);
          return;
        }

        setProviderLoad({
          isbn: providerIsbn,
          phase: autoRefreshAllowed ? "loading" : "error",
          cache: nextCache,
        });
        if (autoRefreshAllowed) {
          void refreshProvider(record, nextCache);
        } else {
          scheduleExpiry(record, nextCache, false);
        }
      }, delay);
    }

    async function refreshProvider(
      fallbackRecord: ProviderCacheRecord | null,
      fallbackCache: ProviderCacheState | null,
    ) {
      try {
        const item = await requestRakutenBook(providerIsbn);
        if (!active) return;
        const fetchedAt = providerNow();
        const saved = await saveProviderCache(
          createProviderCacheRecord({ workId: work.id, item, fetchedAt }),
        );
        if (!active) return;
        const nextCache = inspectProviderCache(saved, fetchedAt);
        setProviderLoad({ isbn: providerIsbn, phase: "ready", cache: nextCache });
        scheduleExpiry(saved, nextCache, true);
      } catch {
        if (!active) return;
        setProviderLoad({ isbn: providerIsbn, phase: "error", cache: fallbackCache });
        if (fallbackRecord !== null && fallbackCache !== null) {
          scheduleExpiry(fallbackRecord, fallbackCache, false);
        }
      }
    }

    void (async () => {
      try {
        const cached = await getProviderCache(providerIsbn);
        if (cached !== null && cached.workId === work.id) {
          const cachedState = inspectProviderCache(cached, providerNow());
          if (active) {
            setProviderLoad({ isbn: providerIsbn, phase: "loading", cache: cachedState });
          }
          if (cachedState.metadataFresh && cachedState.commercialFresh) {
            if (active) {
              setProviderLoad({ isbn: providerIsbn, phase: "ready", cache: cachedState });
              scheduleExpiry(cached, cachedState, true);
            }
            return;
          }
          await refreshProvider(cached, cachedState);
          return;
        }
        await refreshProvider(null, null);
      } catch {
        if (active) setProviderLoad({ isbn: providerIsbn, phase: "error", cache: null });
      }
    })();

    return () => {
      active = false;
      clearExpiryTimer();
    };
  }, [getProviderCache, isbn, providerAttempt, saveProviderCache, status.state, work.id]);

  const visibleProvider: ProviderLoadState =
    providerLoad.isbn === isbn
      ? providerLoad
      : { isbn, phase: isbn === null ? "error" : "loading", cache: null };
  const metadata = visibleProvider.cache?.metadata ?? null;
  const commercial = visibleProvider.cache?.commercial ?? null;
  const directUrl =
    metadata?.affiliateUrl ?? metadata?.itemUrl ?? visibleProvider.cache?.fallbackItemUrl;
  const providerHref = directUrl ?? buildRakutenBooksSearchUrl(work.title);
  const isDirectProviderLink = directUrl !== undefined;
  const volumeCount = parsedRecommendationContext.success
    ? (parsedRecommendationContext.data.constraintByWorkId[work.id]?.volumeCount ?? 0)
    : catalog.volumes.filter((volume) => volume.workId === work.id).length;
  const heroCoverUrl =
    metadata?.imageUrl === undefined ? null : coverSourceForSize(metadata.imageUrl, 600);

  return (
    <>
      <main
        className={`mx-auto w-full pb-[var(--space-section-large)]${pageEntryMotion.active ? " page-entry-b motion-safe:animate-[page-entry-b-enter_var(--motion-duration-page)_var(--motion-ease-direct)_both]" : ""}`}
        data-work-detail-id={work.id}
        key={work.id}
        onAnimationEnd={pageEntryMotion.onAnimationEnd}
      >
        <p aria-atomic="true" aria-live="polite" className="sr-only">
          {navigationStrings.routeAnnouncement(work.title)}
        </p>
        <WorkDetailShell
          coverUrl={heroCoverUrl}
          creators={work.creators}
          kind="catalog"
          title={work.title}
        >
          <header className="grid gap-[var(--space-content-loose)] md:gap-[var(--space-content)]">
            <h1 className="[overflow-wrap:anywhere] text-[length:var(--text-page-title-size)] leading-[var(--line-height-heading)] text-text-strong">
              {work.title}
            </h1>
            <p className="font-medium text-text-muted">{coverStrings.creatorLine(work.creators)}</p>
            <dl className="m-0 flex flex-wrap gap-x-[var(--space-6)] gap-y-[var(--space-3)] p-0 [&>div]:grid [&>div]:gap-[var(--space-content-tight)] [&_dd]:m-0 [&_dd]:font-bold [&_dd]:text-text-strong [&_dt]:text-[length:var(--text-caption-size)] [&_dt]:font-medium [&_dt]:text-text-muted">
              <div>
                <dt>{workDetailStrings.metadata.publisher}</dt>
                <dd>{work.publisher ?? workDetailStrings.metadata.unknownPublisher}</dd>
              </div>
              <div>
                <dt>{workDetailStrings.metadata.status}</dt>
                <dd>{recommendationStrings.workStatus[work.status]}</dd>
              </div>
              <div>
                <dt>{workDetailStrings.metadata.volumes}</dt>
                <dd>{recommendationStrings.volumeCount(volumeCount)}</dd>
              </div>
            </dl>
            {compatibility.kind === "ready" &&
            compatibility.explanation.positiveReasons[0] !== undefined ? (
              <section
                aria-label={workDetailStrings.compatibility.reasons}
                className="grid gap-[var(--space-content-tight)] border-l-[length:var(--space-1)] border-accent bg-surface-2 p-[var(--space-3)] md:hidden"
              >
                <h2 className="text-[length:var(--font-size-14)]">
                  {workDetailStrings.compatibility.reasons}
                </h2>
                <p>{compatibility.explanation.positiveReasons[0].text}</p>
              </section>
            ) : null}
          </header>

          {status.state === "degraded" ? (
            <p
              className="border-l-[length:var(--space-content-tight)] border-warn bg-surface-1 px-[var(--space-4)] py-[var(--space-3)]"
              role="status"
            >
              {workDetailStrings.storageWarning}
            </p>
          ) : null}

          <WorkStateControls
            record={currentRecord}
            recordsReady={userWorks !== undefined}
            removeMinimalPlannedUserWork={removeMinimalPlannedUserWork}
            saveUserWork={saveUserWork}
            workId={work.id}
          />
        </WorkDetailShell>

        <div className="mx-auto grid w-full max-w-[var(--layout-width-detail)] gap-[var(--space-4)] px-[var(--layout-page-padding)] pt-[var(--space-6)]">
          <CompatibilitySection
            anchorCoverTargets={coverTargets}
            anchorCoverUrls={coverUrls}
            catalog={catalog}
            notifyAnchorCoverSettled={notifyCoverSettled}
            state={compatibility}
          />

          <div className="grid overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface-overlay md:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
            <section
              aria-labelledby="work-synopsis-heading"
              className="grid content-start gap-[var(--space-3)] p-[var(--space-4)]"
            >
              <h2 id="work-synopsis-heading">{workDetailStrings.synopsis.heading}</h2>
              <p>{metadata?.itemCaption ?? workDetailStrings.synopsis.unavailable}</p>
            </section>

            <section
              aria-labelledby="work-factors-heading"
              className="grid content-start gap-[var(--space-3)] border-t border-line bg-surface-1 p-[var(--space-4)] md:border-t-0 md:border-l"
            >
              <h2 id="work-factors-heading">{workDetailStrings.factors.heading}</h2>
              {factorIds.length === 0 ? (
                <p>{workDetailStrings.factors.empty}</p>
              ) : (
                <ul className="m-0 flex list-none flex-wrap gap-[var(--space-content)] p-0">
                  {factorIds.map((factorId) => (
                    <li
                      className="inline-flex min-h-[var(--space-8)] items-center rounded-[var(--radius-pill)] border border-line bg-surface-2 px-[var(--space-3)] py-[var(--space-content-tight)] text-[length:var(--font-size-12)] font-bold"
                      key={factorId}
                    >
                      {explanationLexicon.factorLabels[factorId]}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <section
            aria-labelledby="work-provider-heading"
            className="grid gap-[var(--space-content)] rounded-[var(--radius-card)] border border-line bg-surface-overlay p-[var(--space-4)] md:grid-cols-[minmax(0,1fr)_auto] md:[&>h2]:col-span-2"
          >
            <h2 id="work-provider-heading">{workDetailStrings.provider.heading}</h2>
            <div className="flex flex-wrap content-start gap-x-[var(--space-6)] gap-y-[var(--space-content)]">
              {visibleProvider.phase === "loading" ? (
                <p aria-live="polite">{workDetailStrings.provider.loading}</p>
              ) : commercial === null ? (
                <p>{workDetailStrings.provider.unavailable}</p>
              ) : (
                <dl className="m-0 flex flex-wrap gap-x-[var(--space-6)] gap-y-[var(--space-3)] p-0 [&>div]:grid [&>div]:gap-[var(--space-content-tight)] [&_dd]:m-0 [&_dd]:font-bold [&_dd]:text-text-strong [&_dt]:text-[length:var(--text-caption-size)] [&_dt]:font-medium [&_dt]:text-text-muted">
                  {commercial.itemPrice === undefined ? null : (
                    <div>
                      <dt>{workDetailStrings.provider.priceLabel}</dt>
                      <dd>{workDetailStrings.provider.price(commercial.itemPrice)}</dd>
                    </div>
                  )}
                  {commercial.availability === undefined ? null : (
                    <div>
                      <dt>{workDetailStrings.provider.availabilityLabel}</dt>
                      <dd>{workDetailStrings.provider.availability[commercial.availability]}</dd>
                    </div>
                  )}
                </dl>
              )}
              {metadata?.reviewAverage === undefined ? null : (
                <dl className="m-0 flex flex-wrap gap-x-[var(--space-6)] gap-y-[var(--space-3)] p-0 [&>div]:grid [&>div]:gap-[var(--space-content-tight)] [&_dd]:m-0 [&_dd]:font-bold [&_dd]:text-text-strong [&_dd]:tabular-nums [&_dt]:text-[length:var(--text-caption-size)] [&_dt]:text-text-muted">
                  <div>
                    <dt>{workDetailStrings.provider.ratingLabel}</dt>
                    <dd>{workDetailStrings.provider.rating(metadata.reviewAverage)}</dd>
                  </div>
                  {metadata.reviewCount === undefined ? null : (
                    <div>
                      <dt>{workDetailStrings.provider.reviewCountLabel}</dt>
                      <dd>{workDetailStrings.provider.reviewCount(metadata.reviewCount)}</dd>
                    </div>
                  )}
                </dl>
              )}
            </div>
            <div className="grid content-start justify-items-start gap-[var(--space-content-tight)] md:justify-items-end">
              <a
                aria-label={
                  isDirectProviderLink
                    ? workDetailStrings.provider.openNewTab
                    : workDetailStrings.provider.searchNewTab
                }
                className={buttonClassName({
                  className:
                    "w-fit min-w-[min(100%,16rem)] px-[var(--space-4)] py-[var(--space-content)] font-bold",
                })}
                href={providerHref}
                rel="noreferrer"
                target="_blank"
              >
                {isDirectProviderLink
                  ? workDetailStrings.provider.view
                  : workDetailStrings.provider.search}
              </a>
              {visibleProvider.phase === "error" && isbn !== null ? (
                <Button
                  className="w-fit justify-self-start md:justify-self-end"
                  onClick={() => {
                    setProviderLoad((current) => ({ ...current, phase: "loading" }));
                    setProviderAttempt((current) => current + 1);
                  }}
                  type="button"
                  variant="outline"
                >
                  {workDetailStrings.provider.retry}
                </Button>
              ) : null}
              {metadata?.affiliateUrl === undefined ? null : (
                <p className="text-[length:var(--text-caption-size)] text-text-muted">
                  {workDetailStrings.provider.affiliate}
                </p>
              )}
              <p className="text-[length:var(--text-caption-size)] text-text-muted">
                {workDetailStrings.provider.credit}
              </p>
            </div>
          </section>
        </div>

        <div className="mx-auto grid w-full max-w-[var(--layout-width-media)] gap-[var(--space-6)] px-[var(--layout-page-padding)] pt-[var(--space-6)]">
          <MediaShelf
            compactHeading
            description={workDetailStrings.related.description}
            title={workDetailStrings.related.heading}
          >
            {relatedGroups.themeRanked.map((related) => (
              <MediaPosterCard
                coverUrl={coverUrls.get(related.id)}
                creators={related.creators}
                key={related.id}
                presentation="cover-overlay"
                title={related.title}
                workId={related.id}
              />
            ))}
          </MediaShelf>
          <MediaShelf
            compactHeading
            description={workDetailStrings.sameMood.description}
            title={workDetailStrings.sameMood.heading}
          >
            {relatedGroups.moodRanked.map((related) => (
              <MediaPosterCard
                coverUrl={coverUrls.get(related.id)}
                creators={related.creators}
                key={related.id}
                presentation="cover-overlay"
                title={related.title}
                workId={related.id}
              />
            ))}
          </MediaShelf>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

export function WorkDetailFlow({ workId }: Readonly<{ workId: string }>) {
  const catalog = useCatalog();
  const work = catalog.works.find((candidate) => candidate.id === workId);

  if (work === undefined) {
    return (
      <main className="mx-auto grid min-h-[calc(100dvh-var(--layout-mobile-navigation-clearance))] w-full max-w-[var(--layout-width-reading)] content-center justify-items-start gap-[var(--space-4)] p-[var(--layout-page-padding)]">
        <h1>{workDetailStrings.notFound.title}</h1>
        <p>{workDetailStrings.notFound.description}</p>
        <Link
          className="inline-flex min-h-[var(--control-min-size)] items-center font-bold text-accent underline underline-offset-[var(--space-content-tight)]"
          to="/recommendations"
        >
          {workDetailStrings.notFound.recommendations}
        </Link>
      </main>
    );
  }

  return <WorkDetailContent catalog={catalog} work={work} />;
}
