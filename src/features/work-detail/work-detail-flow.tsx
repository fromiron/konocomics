"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { CoverImage } from "@/components/cover/CoverImage";
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
    <section aria-labelledby="work-state-heading" className="work-detail-state surface-card">
      <h2 id="work-state-heading">{workDetailStrings.state.heading}</h2>
      <div className="work-detail-state__controls">
        <label>
          <span>{workDetailStrings.state.label}</span>
          <select
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
          </select>
        </label>
        <button
          aria-pressed={minimalPlanned}
          className="interactive-press"
          disabled={busy || !recordsReady || plannedToggleUnavailable}
          onClick={() => void togglePlanned()}
          type="button"
        >
          {minimalPlanned
            ? workDetailStrings.state.plannedRemove
            : workDetailStrings.state.plannedAdd}
        </button>
      </div>
      {!recordsReady ? (
        <p aria-live="polite" className="work-detail-state__helper">
          {workDetailStrings.state.loading}
        </p>
      ) : plannedToggleUnavailable ? (
        <p className="work-detail-state__helper">{workDetailStrings.state.managedByState}</p>
      ) : null}
      {busy ? (
        <p aria-live="polite" className="work-detail-state__message">
          {workDetailStrings.state.saving}
        </p>
      ) : message === undefined ? null : (
        <p
          className="work-detail-state__message"
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
      className="work-detail-compatibility surface-card"
    >
      <h2 id="work-compatibility-heading">{workDetailStrings.compatibility.heading}</h2>
      {state.kind === "unavailable" ? (
        <p>{workDetailStrings.compatibility.unavailable}</p>
      ) : (
        <>
          <div className="work-detail-compatibility__reasons">
            <h3>{workDetailStrings.compatibility.reasons}</h3>
            {state.explanation.positiveReasons.length === 0 ? (
              <p>{recommendationStrings.reasonUnavailable}</p>
            ) : (
              <ul>
                {state.explanation.positiveReasons.map((reason) => (
                  <li key={`${reason.source}:${reason.group}:${reason.factorId}`}>{reason.text}</li>
                ))}
              </ul>
            )}
          </div>
          {state.explanation.caution === undefined ? null : (
            <div className="work-detail-compatibility__caution">
              <h3>{workDetailStrings.compatibility.caution}</h3>
              <p>{state.explanation.caution.text}</p>
            </div>
          )}
          {state.explanation.anchors.length === 0 ? null : (
            <div className="work-detail-compatibility__anchors">
              <h3>{workDetailStrings.compatibility.anchors}</h3>
              <ul>
                {state.explanation.anchors.map((anchor) => {
                  const anchorWork = catalog.works.find((work) => work.id === anchor.workId);
                  if (anchorWork === undefined) return null;
                  const coverTarget = anchorCoverTargets.find(
                    (target) => target.workId === anchor.workId,
                  );
                  return (
                    <li key={anchor.workId}>
                      <CoverImage
                        className="work-detail-compatibility__anchor-cover"
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
                      <span>{anchorWork.title}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          <p className="work-detail-compatibility__confidence">
            {workDetailStrings.compatibility.confidence}: {state.explanation.confidence.label}
          </p>
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
  const anchorCoverTargets = useMemo(
    () =>
      createRecommendationCoverTargets(
        catalog,
        compatibility.kind === "ready"
          ? compatibility.explanation.anchors.map((anchor) => anchor.workId)
          : [],
      ),
    [catalog, compatibility],
  );
  const { coverUrls: anchorCoverUrls, notifyCoverSettled: notifyAnchorCoverSettled } =
    useRecommendationCovers({
      targets: anchorCoverTargets,
      getProviderCache,
      saveProviderCache,
    });

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

  return (
    <main
      className={`work-detail-page${pageEntryMotion.active ? " page-entry-b" : ""}`}
      data-work-detail-id={work.id}
      key={work.id}
      onAnimationEnd={pageEntryMotion.onAnimationEnd}
    >
      <div className="work-detail-layout">
        <div className="work-detail-media" data-work-detail-cover>
          <CoverImage
            className="work-detail-cover"
            coverUrl={metadata?.imageUrl}
            creators={work.creators}
            priority
            requestedSize={600}
            title={work.title}
            variant="hero"
          />
        </div>

        <div className="work-detail-content">
          <header className="work-detail-header">
            <h1>{work.title}</h1>
            <p className="work-detail-header__creators">
              {coverStrings.creatorLine(work.creators)}
            </p>
            <dl className="work-detail-metadata">
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
          </header>

          {status.state === "degraded" ? (
            <p className="work-detail-alert" role="status">
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

          <CompatibilitySection
            anchorCoverTargets={anchorCoverTargets}
            anchorCoverUrls={anchorCoverUrls}
            catalog={catalog}
            notifyAnchorCoverSettled={notifyAnchorCoverSettled}
            state={compatibility}
          />

          <section aria-labelledby="work-synopsis-heading" className="work-detail-section">
            <h2 id="work-synopsis-heading">{workDetailStrings.synopsis.heading}</h2>
            <p>{metadata?.itemCaption ?? workDetailStrings.synopsis.unavailable}</p>
          </section>

          <section aria-labelledby="work-factors-heading" className="work-detail-section">
            <h2 id="work-factors-heading">{workDetailStrings.factors.heading}</h2>
            {factorIds.length === 0 ? (
              <p>{workDetailStrings.factors.empty}</p>
            ) : (
              <ul className="work-detail-factors">
                {factorIds.map((factorId) => (
                  <li key={factorId}>{explanationLexicon.factorLabels[factorId]}</li>
                ))}
              </ul>
            )}
          </section>

          <section
            aria-labelledby="work-provider-heading"
            className="work-detail-provider surface-card"
          >
            <h2 id="work-provider-heading">{workDetailStrings.provider.heading}</h2>
            {visibleProvider.phase === "loading" ? (
              <p aria-live="polite">{workDetailStrings.provider.loading}</p>
            ) : commercial === null ? (
              <p>{workDetailStrings.provider.unavailable}</p>
            ) : (
              <dl className="work-detail-provider__commercial">
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
            <a
              aria-label={
                isDirectProviderLink
                  ? workDetailStrings.provider.openNewTab
                  : workDetailStrings.provider.searchNewTab
              }
              className="work-detail-provider__primary interactive-press"
              href={providerHref}
              rel="noreferrer"
              target="_blank"
            >
              {isDirectProviderLink
                ? workDetailStrings.provider.view
                : workDetailStrings.provider.search}
            </a>
            {visibleProvider.phase === "error" && isbn !== null ? (
              <button
                className="work-detail-provider__retry interactive-press"
                onClick={() => {
                  setProviderLoad((current) => ({ ...current, phase: "loading" }));
                  setProviderAttempt((current) => current + 1);
                }}
                type="button"
              >
                {workDetailStrings.provider.retry}
              </button>
            ) : null}
            {metadata?.affiliateUrl === undefined ? null : (
              <p className="work-detail-provider__affiliate">
                {workDetailStrings.provider.affiliate}
              </p>
            )}
            <p className="work-detail-provider__credit">{workDetailStrings.provider.credit}</p>
          </section>
        </div>
      </div>
    </main>
  );
}

export function WorkDetailFlow({ workId }: Readonly<{ workId: string }>) {
  const catalog = useCatalog();
  const work = catalog.works.find((candidate) => candidate.id === workId);

  if (work === undefined) {
    return (
      <main className="work-detail-not-found">
        <h1>{workDetailStrings.notFound.title}</h1>
        <p>{workDetailStrings.notFound.description}</p>
        <Link href="/recommendations">{workDetailStrings.notFound.recommendations}</Link>
      </main>
    );
  }

  return <WorkDetailContent catalog={catalog} work={work} />;
}
