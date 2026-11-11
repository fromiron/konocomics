"use client";

import { Link } from "@tanstack/react-router";
import { GenreChips } from "@/components/media/genre-chips";
import { DetailBackLink } from "@/components/nav/detail-back-link";
import { ArrowRightIcon, BookmarkIcon, EyeOffIcon } from "lucide-react";
import { LazyMotion, domAnimation, m } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { coverSourceForSize } from "@/components/cover/CoverImage";
import { Button, buttonClassName } from "@/components/design-system/button";
import { Notice } from "@/components/design-system/notice";
import { SegmentedControl } from "@/components/design-system/segmented-control";
import { PageHeader } from "@/components/layout/page-header";
import { SectionHeading } from "@/components/layout/section-heading";
import { Snackbar, type SnackbarNotice } from "@/components/layout/snackbar";
import { LeadReasonText } from "@/components/media/lead-reason-text";
import { RankingShelf } from "@/components/media/ranking-shelf";
import { RankingCard } from "@/components/media/ranking-card";
import { ReasonBubble } from "@/components/media/reason-bubble";
import { controlSpring } from "@/components/design-system/spring-selection";
import { useLiveReducedMotion } from "@/components/motion/use-live-reduced-motion";
import { pageEntryFadeProps, usePageEntryMotion } from "@/components/motion/use-page-entry-motion";
import { useSaveConfirmation } from "@/components/motion/use-save-confirmation";
import recommendationContextJson from "@/data/generated/recommendation-context-v1.json";
import { confirmedSeriesVolumeCounts } from "@/domain/catalog/series";
import { GENRE_TAGS, THEME_TAGS } from "@/domain/catalog/constants";
import { normalizeIsbn } from "@/domain/catalog/normalize";
import type { CatalogV1, Work } from "@/domain/catalog/types";
import { generateTasteExplanation } from "@/domain/explanation";
import type { ExplanationFactorId, TasteRecommendationExplanation } from "@/domain/explanation";
import {
  hasCatalogBackedProfile,
  recommendationProfileRecords,
} from "@/domain/profile/catalog-profile";
import { summarizeMangaDna } from "@/domain/profile/dna-summary";
import type { Reaction, ReadingState, UserWorkRecord } from "@/domain/profile/types";
import { recommendationContextSchema } from "@/domain/recommendation/context-schema";
import { scoreWorkCompatibility } from "@/domain/recommendation/rank";
import { selectContrastingWorks } from "@/domain/recommendation/contrast";
import { selectRelatedWorks } from "@/domain/recommendation/related";
import type { RecommendationInput } from "@/domain/recommendation/types";
import { useCatalog } from "@/features/catalog/catalog-provider";
import { WorkDetailShell } from "@/features/work-detail/work-detail-shell";
import { SameAuthorSection } from "@/features/work-detail/same-author-banner";
import { ShareButton } from "@/features/work-detail/share-button";
import { WorkTraits } from "@/features/work-detail/work-traits";
import { WorkEvidenceList } from "./work-evidence";
import { WorkContrastSection } from "./work-contrast";
import { WorkMetaLine, type WorkMetaItem } from "./work-meta-line";
import {
  collectWorkEvidence,
  resolveWorkBookMetadata,
  type WorkEvidence,
  selectSameAuthorWorks,
} from "@/features/work-detail/work-detail-data";
import {
  createRecommendationCoverTargets,
  useRecommendationCovers,
} from "@/features/recommendations/recommendation-cover-resolver";
import {
  usePersistence,
  UserWorkConflictError,
  type ProviderCacheRecord,
} from "@/infrastructure/db";
import { explanationFactorLabel } from "@/lib/explanation-labels";
import {
  buildRakutenBooksSearchUrl,
  createProviderCacheRecord,
  inspectProviderCache,
  requestRakutenBook,
  type ProviderCacheState,
} from "@/infrastructure/rakuten";
import {
  coverStrings,
  libraryStrings,
  navigationStrings,
  recommendationStrings,
  onboardingStrings,
  workDetailStrings,
  explanationLexicon,
} from "@/lib/strings";

const parsedRecommendationContext =
  recommendationContextSchema.safeParse(recommendationContextJson);
const REACTIONS = ["favorite", "liked", "neutral", "disliked"] as const;
const MAX_TIMER_DELAY_MS = 2_147_483_647;

type ProviderLoadState = Readonly<{
  isbn: string | null;
  phase: "loading" | "ready" | "error";
  cache: ProviderCacheState | null;
}>;

type CompatibilityState =
  | Readonly<{ kind: "hidden" }>
  /** Records are loaded and there is no catalog-backed profile, so there is no engine output. */
  | Readonly<{ kind: "noProfile" }>
  | Readonly<{ kind: "unavailable" }>
  | Readonly<{
      kind: "ready";
      explanation: TasteRecommendationExplanation;
      evidence: readonly WorkEvidence[];
    }>;

function providerNow() {
  return new Date(Date.now()).toISOString();
}

function WorkSynopsis({ caption }: Readonly<{ caption: string }>) {
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);

  useEffect(() => {
    const paragraph = paragraphRef.current;
    if (paragraph === null) return;
    const measure = () => {
      const collapsedHeight = Number.parseFloat(getComputedStyle(paragraph).lineHeight) * 5;
      setCanExpand(paragraph.scrollHeight > collapsedHeight + 1);
    };
    measure();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    observer?.observe(paragraph);
    return () => observer?.disconnect();
  }, []);

  return (
    <>
      <p
        className={`whitespace-pre-line leading-[var(--line-height-body)] text-text${expanded ? "" : " line-clamp-5"}`}
        id="work-synopsis-content"
        ref={paragraphRef}
      >
        {caption}
      </p>
      {canExpand ? (
        <Button
          aria-controls="work-synopsis-content"
          aria-expanded={expanded}
          className="w-fit"
          onClick={() => setExpanded((current) => !current)}
          variant="ghost"
        >
          {expanded ? workDetailStrings.synopsis.readLess : workDetailStrings.synopsis.readMore}
        </Button>
      ) : null}
    </>
  );
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

function genreThemeIds(work: Work): ExplanationFactorId[] {
  if (!work.eligibility.recommendationEligible) return [];
  const genres = new Set(work.genres);
  const centralThemes = new Set(
    work.themes.filter((theme) => theme.centrality === 2).map((theme) => theme.id),
  );
  return [
    ...GENRE_TAGS.filter((genre) => genres.has(genre)),
    ...THEME_TAGS.filter((themeId) => centralThemes.has(themeId)),
  ];
}

/** The series length the Catalog vouches for, or 0; see `confirmedSeriesVolumeCounts`. */
function seriesVolumeCount(catalog: CatalogV1, workId: string) {
  return (
    confirmedSeriesVolumeCounts(
      catalog,
      (id) =>
        parsedRecommendationContext.success
          ? parsedRecommendationContext.data.constraintByWorkId[id]?.volumeCount
          : undefined,
      [workId],
    ).get(workId) ?? 0
  );
}

function sameAuthorMeta(catalog: CatalogV1, work: Work) {
  const context = parsedRecommendationContext.success ? parsedRecommendationContext.data : null;
  const market = context?.marketSnapshot.byWorkId[work.id];
  if (market?.reviewAverage !== undefined && market.reviewCount !== undefined) {
    return workDetailStrings.sameAuthor.reviews(market.reviewAverage, market.reviewCount);
  }
  // Without reviews, fall back to known series facts only; an unknown status adds nothing.
  const volumeCount = seriesVolumeCount(catalog, work.id);
  return [
    ...(work.status === "unknown" ? [] : [recommendationStrings.workStatus[work.status]]),
    ...(volumeCount < 1 ? [] : [recommendationStrings.volumeCount(volumeCount)]),
  ].join(" · ");
}

function compatibilityFor(options: {
  catalog: CatalogV1;
  work: Work;
  records: readonly UserWorkRecord[] | undefined;
  adjustments: RecommendationInput["adjustments"] | undefined;
  policies: RecommendationInput["policies"] | undefined;
}): CompatibilityState {
  const { adjustments, catalog, policies, records, work } = options;
  const workId = work.id;
  const hasProfile = hasCatalogBackedProfile(records, catalog.works);
  // While records load nothing is drawn, so the no-profile guidance never flashes first.
  if (hasProfile === undefined) return { kind: "hidden" };
  if (hasProfile === false) {
    // Only a work the engine could score invites the reader to build a profile.
    return work.eligibility.recommendationEligible ? { kind: "noProfile" } : { kind: "hidden" };
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
    const explanation = generateTasteExplanation({
      contributions: result.contributions,
      confidenceLevel: result.confidenceLevel,
      lexicon: explanationLexicon,
      resolveTitle: (anchorWorkId) => worksById.get(anchorWorkId)?.title,
    });
    return {
      kind: "ready",
      explanation,
      evidence: collectWorkEvidence(catalog, result.contributions, explanation),
    };
  } catch {
    return { kind: "unavailable" };
  }
}

type RemovalResult = "removed" | "already-absent" | "preserved-conflict";
type StateNotice = Omit<SnackbarNotice, "id">;

type WorkStateControlsProps = Readonly<{
  record: UserWorkRecord | undefined;
  recordsReady: boolean;
  /** Ongoing or paused series: 「読んだ」 also covers reading up to the latest volume. */
  seriesContinues: boolean;
  workId: string;
  addUserWorkIfAbsent(
    record: UserWorkRecord,
  ): Promise<Readonly<{ kind: "added" | "already-exists" | "preserved-unknown" }>>;
  removeMinimalPlannedUserWork(workId: string): Promise<RemovalResult>;
  removeUserWorkIfUnchanged(workId: string, expectedUpdatedAt: string): Promise<RemovalResult>;
  saveUserWork(record: UserWorkRecord, expectedUpdatedAt?: string | null): Promise<UserWorkRecord>;
}>;

function WorkStateControls({
  addUserWorkIfAbsent,
  record,
  recordsReady,
  removeMinimalPlannedUserWork,
  removeUserWorkIfUnchanged,
  saveUserWork,
  seriesContinues,
  workId,
}: WorkStateControlsProps) {
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<SnackbarNotice | undefined>();
  const noticeSequence = useRef(0);
  const actionInFlight = useRef(false);
  const minimalPlanned = isMinimalPlannedRecord(record);

  const dismissNotice = useCallback((id: number) => {
    setNotice((current) => (current?.id === id ? undefined : current));
  }, []);

  // Serializes one mutation at a time. Controls keep their look while saving and the outcome
  // replaces the snackbar in place, so quick successive taps do not flash or reflow the page.
  const runAction = async (action: () => Promise<StateNotice>) => {
    if (!recordsReady || actionInFlight.current) return;
    actionInFlight.current = true;
    setBusy(true);
    let next: StateNotice;
    try {
      next = await action();
    } catch (error) {
      next = {
        tone: "error",
        text:
          error instanceof UserWorkConflictError
            ? workDetailStrings.state.plannedPreservedConflict
            : workDetailStrings.state.error,
      };
    } finally {
      actionInFlight.current = false;
      setBusy(false);
    }
    noticeSequence.current += 1;
    setNotice({ ...next, id: noticeSequence.current });
  };

  const saveReadingState = (readingState: ReadingState) =>
    runAction(async () => {
      const snapshot = record;
      const preservedRecord = readingState === "dropped" ? record : withoutDroppedReasons(record);
      const saved = await saveUserWork(
        {
          ...preservedRecord,
          workId,
          readingState,
          updatedAt: new Date().toISOString(),
        },
        snapshot?.updatedAt ?? null,
      );
      return {
        tone: "status",
        text:
          readingState === "planned"
            ? workDetailStrings.state.plannedSaved
            : workDetailStrings.state.stateSaved(workDetailStrings.state.options[readingState]),
        action: {
          label: workDetailStrings.state.undo,
          onAction: () =>
            void runAction(async () => {
              if (snapshot !== undefined) {
                await saveUserWork(
                  { ...snapshot, updatedAt: new Date().toISOString() },
                  saved.updatedAt,
                );
              } else if ((await removeUserWorkIfUnchanged(workId, saved.updatedAt)) !== "removed") {
                return { tone: "status", text: workDetailStrings.state.plannedPreservedConflict };
              }
              return { tone: "status", text: workDetailStrings.state.recordRestored };
            }),
        },
      };
    });

  const removePlanned = () =>
    runAction(async () => {
      const result = await removeMinimalPlannedUserWork(workId);
      return {
        tone: "status",
        text:
          result === "removed"
            ? workDetailStrings.state.plannedRemoved
            : result === "already-absent"
              ? workDetailStrings.state.plannedAlreadyAbsent
              : workDetailStrings.state.plannedPreservedConflict,
      };
    });

  const restoreRecord = (snapshot: UserWorkRecord) =>
    runAction(async () => {
      const result = await addUserWorkIfAbsent({
        ...snapshot,
        updatedAt: new Date().toISOString(),
      });
      return {
        tone: "status",
        text:
          result.kind === "added"
            ? workDetailStrings.state.recordRestored
            : workDetailStrings.state.plannedPreservedConflict,
      };
    });

  // Tapping the selected state resets the work to 「no record」; a newer write from another
  // tab is never deleted, and the removed record stays restorable from the snackbar.
  const clearRecord = (label: string) => {
    const snapshot = record;
    if (snapshot === undefined) return Promise.resolve();
    return runAction(async () => {
      const result = await removeUserWorkIfUnchanged(workId, snapshot.updatedAt);
      if (result !== "removed") {
        return {
          tone: "status",
          text:
            result === "already-absent"
              ? workDetailStrings.state.recordAlreadyCleared
              : workDetailStrings.state.plannedPreservedConflict,
        };
      }
      return {
        tone: "status",
        text: workDetailStrings.state.recordCleared(label),
        action: {
          label: workDetailStrings.state.undo,
          onAction: () => void restoreRecord(snapshot),
        },
      };
    });
  };

  // A reaction does not imply that reading is complete.
  const saveReaction = (reaction: Reaction) => {
    if (record?.readingState !== "completed" && record?.readingState !== "reading") return;
    const nextState = record.readingState;
    const nextReaction = record.reaction === reaction ? undefined : reaction;
    return runAction(async () => {
      const base = withoutDroppedReasons(record);
      const negativeReasons = base?.negativeReasons;
      const rest = { ...base };
      delete rest.reaction;
      delete rest.negativeReasons;
      await saveUserWork(
        {
          ...rest,
          workId,
          readingState: nextState,
          ...(nextReaction === undefined ? {} : { reaction: nextReaction }),
          // Dislike reasons are only valid while the reaction stays 「いまいち」.
          ...(nextReaction === "disliked" && negativeReasons !== undefined
            ? { negativeReasons }
            : {}),
          updatedAt: new Date().toISOString(),
        },
        record.updatedAt,
      );
      return {
        tone: "status",
        text:
          nextReaction === undefined
            ? workDetailStrings.state.reactionCleared
            : workDetailStrings.state.reactionSaved(
                workDetailStrings.state.options[nextState],
                libraryStrings.reactions[nextReaction],
              ),
      };
    });
  };

  // Every state button toggles: selecting the current state again clears the record.
  const handleStateSelect = (state: ReadingState) => {
    if (record?.readingState !== state) {
      void saveReadingState(state);
    } else if (state === "planned" && minimalPlanned) {
      void removePlanned();
    } else {
      void clearRecord(workDetailStrings.state.options[state]);
    }
  };

  const bookmarked = record?.readingState === "planned";
  const {
    attach: bookmarkAttach,
    markPressed: bookmarkMarkPressed,
    stamping: bookmarkStamping,
  } = useSaveConfirmation<HTMLButtonElement>(bookmarked);
  const excluded = record?.readingState === "hidden";
  const showReaction = record?.readingState === "completed" || record?.readingState === "reading";
  const reducedMotion = useLiveReducedMotion() !== false;
  const rated = showReaction || record?.readingState === "dropped";
  const interactive =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas motion-reduce:transition-none";

  const segment = (state: "reading" | "completed" | "dropped") => {
    const selected = record?.readingState === state;
    return (
      <button
        aria-pressed={selected}
        className={`inline-flex min-h-[var(--control-min-size)] items-center justify-center rounded-[var(--radius-control)] border px-[var(--space-4)] text-[length:var(--font-size-14)] font-bold whitespace-nowrap ${interactive} ${
          selected
            ? "border-accent bg-accent-soft text-accent-ink"
            : "border-line bg-surface-1 text-text-muted hover:bg-surface-2 hover:text-text-strong"
        }`}
        disabled={busy}
        data-reading-state={state}
        onClick={() => handleStateSelect(state)}
        type="button"
      >
        {workDetailStrings.state.options[state]}
      </button>
    );
  };

  const readProgress =
    rated && record?.progress !== undefined
      ? libraryStrings.progress(record.progress.volume, record.progress.chapter)
      : "";

  return (
    <section
      aria-busy={busy}
      aria-labelledby="work-state-heading"
      className="grid gap-[var(--space-2)]"
      data-slot="work-state-controls"
    >
      {/* In the hero the group keeps its heading, at label size like 「感想」 below it. */}
      <h2
        className="text-[length:var(--text-caption-size)] font-bold text-text-muted"
        id="work-state-heading"
      >
        {workDetailStrings.state.heading}
      </h2>
      {!recordsReady ? (
        <p aria-live="polite" className="text-[length:var(--text-caption-size)] text-text-muted">
          {workDetailStrings.state.loading}
        </p>
      ) : (
        <>
          {/* 「読みたい」 stays in place in every state so rating never reflows the row. */}
          <div
            aria-labelledby="work-state-heading"
            className="flex flex-wrap items-center gap-[var(--space-2)]"
            role="group"
          >
            <button
              aria-pressed={bookmarked}
              className={`inline-flex min-h-[var(--control-min-size)] items-center gap-[var(--space-2)] rounded-[var(--radius-control)] border px-[var(--space-4)] text-[length:var(--font-size-14)] font-bold ${interactive} ${
                bookmarked
                  ? "border-accent bg-accent-soft text-accent-ink"
                  : "border-line bg-surface-1 text-text hover:bg-surface-2 hover:text-text-strong"
              }${bookmarkStamping ? " confirm-stamp" : ""}`}
              disabled={busy}
              data-reading-state="planned"
              data-slot="work-bookmark"
              onClick={() => {
                bookmarkMarkPressed();
                handleStateSelect("planned");
              }}
              ref={bookmarkAttach}
              type="button"
            >
              <BookmarkIcon
                aria-hidden="true"
                className={`size-4 ${bookmarked ? "fill-current" : ""}`}
              />
              {workDetailStrings.state.options.planned}
            </button>
            <div className="contents" data-slot="work-reading-segments">
              {segment("reading")}
              {segment("completed")}
              {segment("dropped")}
            </div>
            {/* 「興味なし」 excludes the work from recommendations rather than tracking reading. */}
            <button
              aria-pressed={excluded}
              className={`inline-flex min-h-[var(--control-min-size)] items-center gap-[var(--space-2)] rounded-[var(--radius-control)] border px-[var(--space-4)] text-[length:var(--font-size-14)] font-bold ${interactive} ${
                excluded
                  ? "border-accent bg-accent-soft text-accent-ink"
                  : "border-line bg-surface-1 text-text-muted hover:bg-surface-2 hover:text-text-strong"
              }`}
              disabled={busy}
              data-reading-state="hidden"
              onClick={() => handleStateSelect("hidden")}
              type="button"
            >
              <EyeOffIcon aria-hidden="true" className="size-4" />
              {workDetailStrings.state.options.hidden}
            </button>
          </div>
          <LazyMotion features={domAnimation} strict>
            <m.div
              animate={{ height: showReaction ? "auto" : 0, opacity: showReaction ? 1 : 0 }}
              aria-hidden={!showReaction}
              className="overflow-hidden"
              inert={!showReaction}
              initial={false}
              transition={{
                height: reducedMotion ? { duration: 0 } : controlSpring,
                opacity: { duration: 0.16 },
              }}
            >
              <div className="grid gap-[var(--space-2)] sm:flex sm:items-center sm:gap-[var(--space-3)]">
                <span
                  className="text-[length:var(--text-caption-size)] font-bold text-text-muted"
                  id="work-reaction-label"
                >
                  {workDetailStrings.state.reactionGroup}
                </span>
                <SegmentedControl
                  className="w-full sm:w-[var(--control-segment-width)]"
                  label={workDetailStrings.state.reactionGroup}
                  options={REACTIONS.map((reaction) => ({
                    value: reaction,
                    label: libraryStrings.reactions[reaction],
                  }))}
                  value={showReaction ? (record?.reaction ?? null) : null}
                  onSelect={saveReaction}
                />
              </div>
            </m.div>
          </LazyMotion>
          {readProgress === "" ? null : (
            <p className="text-[length:var(--text-caption-size)] text-text-muted">
              {workDetailStrings.state.progressNote(readProgress)}
            </p>
          )}
          {record === undefined ? null : (
            <div className="grid gap-[var(--space-2)]">
              <Button
                disabled={busy}
                variant="ghost"
                className="justify-self-start"
                onClick={() =>
                  void clearRecord(workDetailStrings.state.options[record.readingState])
                }
              >
                {workDetailStrings.state.removeRecord}
              </Button>
              <p className="text-[length:var(--text-caption-size)] text-text-muted">
                {workDetailStrings.state.removeDescription}
              </p>
            </div>
          )}
          {seriesContinues ? (
            <p className="text-[length:var(--text-caption-size)] text-text-muted">
              {workDetailStrings.state.ongoingHint}
            </p>
          ) : null}
        </>
      )}
      <Snackbar notice={notice} onDismiss={dismissNotice} />
    </section>
  );
}

/** The lead sentence and the library work it names in bold, when it names one. */
function leadReasonAnchor(catalog: CatalogV1, explanation: TasteRecommendationExplanation) {
  const leadReason = explanation.positiveReasons[0];
  const leadText = leadReason?.text ?? recommendationStrings.reasonUnavailable;
  const anchorWork =
    leadReason?.source === "similarity"
      ? leadReason.anchorWorkIds
          .map((workId) => catalog.works.find((work) => work.id === workId))
          .find((work) => work !== undefined && work.title !== "")
      : undefined;
  const anchorMentionIndex = anchorWork === undefined ? -1 : leadText.indexOf(anchorWork.title);
  return { leadReason, leadText, anchorWork, anchorMentionIndex };
}

/**
 * The reason, in the same paper bubble as every recommendation card (04 §2.9, 2026-11-11): the
 * lead sentence with its anchor work in bold, then 「近いポイント」 with the other shown reasons.
 * A caution keeps its own warn block outside the bubble. Every line comes from the explanation.
 */
function CompatibilitySummary({
  catalog,
  explanation,
  tail,
}: Readonly<{
  catalog: CatalogV1;
  explanation: TasteRecommendationExplanation;
  tail: "top" | "side";
}>) {
  const { leadReason, leadText, anchorWork, anchorMentionIndex } = leadReasonAnchor(
    catalog,
    explanation,
  );
  const anchorTitle = anchorWork?.title;
  const leadLabel =
    leadReason === undefined ? undefined : explanationFactorLabel(leadReason.factorId);
  const additionalReasons = explanation.positiveReasons.slice(1).map((reason) => ({
    reason,
    label: explanationFactorLabel(reason.factorId),
  }));
  const fullReasons = additionalReasons.filter(
    ({ reason, label }) => reason.axisPreferenceDirection === "lower" || label === undefined,
  );
  const labels = [
    ...new Set(
      additionalReasons.flatMap(({ reason, label }) =>
        reason.axisPreferenceDirection === "lower" || label === undefined || label === leadLabel
          ? []
          : [label],
      ),
    ),
  ];

  return (
    <div className="grid min-w-0 content-start gap-[var(--space-3)] text-[length:var(--text-body-size)] leading-[var(--line-height-body)] text-text">
      {leadReason === undefined ? null : (
        <ReasonBubble
          className={`grid w-fit gap-[var(--space-2)] px-[var(--space-4)] py-[var(--space-3)] text-text-strong ${
            // A side tail keeps 8px of room on both sides of the bubble (04 §2.9).
            tail === "side" ? "max-w-[calc(100%-var(--space-4))]" : "max-w-full"
          }`}
          tail={tail}
        >
          <p>
            <LeadReasonText
              anchorIndex={anchorMentionIndex}
              anchorTitle={anchorTitle}
              strongClassName="font-bold text-text-strong"
              text={leadText}
            />
          </p>
          {fullReasons.map(({ reason }) => (
            <p key={`${reason.source}:${reason.group}:${reason.factorId}`}>{reason.text}</p>
          ))}
          {labels.length === 0 ? null : (
            <div className="flex flex-wrap gap-x-[var(--space-3)] gap-y-[var(--space-1)] text-[length:var(--font-size-14)]">
              <h3 className="text-[length:var(--font-size-14)] font-normal text-text-muted">
                {workDetailStrings.compatibility.anchorFactors}
              </h3>
              <ul className="dot-separated m-0 list-none p-0">
                {labels.map((label) => (
                  <li key={label}>{label}</li>
                ))}
              </ul>
            </div>
          )}
        </ReasonBubble>
      )}
      {explanation.caution === undefined ? null : (
        <div className="grid gap-[var(--space-1)] rounded-r-[var(--radius-card)] border-l-2 border-warn bg-warn/10 px-[var(--space-4)] py-[var(--space-3)]">
          <h3 className="text-[length:var(--text-caption-size)] font-bold text-warn">
            {workDetailStrings.compatibility.caution}
          </h3>
          <p className="text-[length:var(--font-size-14)]">{explanation.caution.text}</p>
        </div>
      )}
    </div>
  );
}

/**
 * The page's highlight, in the hero above the reading state and the purchase block (03 §6,
 * 2026-11-11): the library work behind the recommendation, with the paper reason bubble beside it
 * pointing at its cover. One work sits beside the bubble; several sit in a row above it. Nothing
 * else stands behind the block. Without a profile there is no engine output, so the same slot only
 * says how to get one; it never shows a bubble or a reason.
 */
function CompatibilitySection({
  catalog,
  coverUrls,
  onCoverVisible,
  state,
}: Readonly<{
  catalog: CatalogV1;
  coverUrls: ReadonlyMap<string, string | null>;
  onCoverVisible(workId: string): void;
  state: CompatibilityState;
}>) {
  if (state.kind === "noProfile") {
    return (
      <section
        aria-labelledby="work-compatibility-heading"
        className="grid gap-[var(--space-2)]"
        data-slot="work-compatibility"
        data-state="no-profile"
      >
        <SectionHeading
          className="mb-0"
          compact
          id="work-compatibility-heading"
          title={workDetailStrings.compatibility.heading}
        />
        <div className="grid justify-items-start gap-[var(--space-1)] rounded-[var(--radius-card)] bg-surface-1 px-[var(--space-5)] py-[var(--space-4)] text-[length:var(--font-size-14)] text-text">
          <p>{workDetailStrings.compatibility.noProfile}</p>
          <Link
            className="inline-flex min-h-[var(--control-min-size)] items-center gap-[var(--space-1)] font-bold text-accent-ink underline underline-offset-[var(--space-content-tight)] focus-visible:rounded-[var(--radius-control)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
            to="/onboarding"
          >
            {workDetailStrings.compatibility.noProfileAction}
            <ArrowRightIcon aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </section>
    );
  }
  if (
    state.kind !== "ready" ||
    (state.explanation.positiveReasons.length === 0 && state.explanation.caution === undefined)
  )
    return null;
  const beside = state.evidence.length === 1;
  // A lone anchor that the lead sentence already names in bold needs no caption under its cover.
  const { anchorWork, anchorMentionIndex } = leadReasonAnchor(catalog, state.explanation);
  const captions =
    beside && anchorMentionIndex >= 0 && anchorWork?.id === state.evidence[0]?.work.id
      ? "named"
      : "visible";
  return (
    <section
      aria-labelledby="work-compatibility-heading"
      className="grid gap-[var(--space-2)]"
      data-slot="work-compatibility"
    >
      <SectionHeading
        className="mb-0"
        compact
        id="work-compatibility-heading"
        title={workDetailStrings.compatibility.heading}
      />
      <div
        className={
          beside
            ? "grid grid-cols-[auto_minmax(0,1fr)] items-start gap-[var(--space-2)]"
            : "grid gap-[var(--space-2)]"
        }
        data-evidence-layout={beside ? "beside" : "stacked"}
      >
        <WorkEvidenceList
          captions={captions}
          coverUrls={coverUrls}
          evidence={state.evidence}
          onCoverVisible={onCoverVisible}
        />
        <CompatibilitySummary
          catalog={catalog}
          explanation={state.explanation}
          tail={beside ? "side" : "top"}
        />
      </div>
    </section>
  );
}

function WorkDetailContent({ catalog, work }: Readonly<{ catalog: CatalogV1; work: Work }>) {
  const pageEntryMotion = usePageEntryMotion({ enabled: true, identity: work.id });
  const {
    adjustments,
    getProviderCache,
    addUserWorkIfAbsent,
    policies,
    removeMinimalPlannedUserWork,
    removeUserWorkIfUnchanged,
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
  const factorIds = useMemo(() => genreThemeIds(work), [work]);
  const tasteAxes = useMemo(() => {
    if (userWorks === undefined || !hasCatalogBackedProfile(userWorks, catalog.works)) return null;
    const catalogWorkIds = new Set(catalog.works.map((candidate) => candidate.id));
    const profileRecords = recommendationProfileRecords(
      userWorks.filter((record) => catalogWorkIds.has(record.workId)),
      catalog.works,
    );
    return summarizeMangaDna(catalog.works, profileRecords).axes;
  }, [catalog.works, userWorks]);
  const compatibility = useMemo(
    () =>
      compatibilityFor({
        catalog,
        work,
        records: userWorks,
        adjustments,
        policies,
      }),
    [adjustments, catalog, policies, userWorks, work],
  );
  const nearbyWorks = useMemo(
    () => selectRelatedWorks({ source: work, candidates: catalog.works }),
    [catalog.works, work],
  );
  const sameAuthor = useMemo(
    () =>
      selectSameAuthorWorks(catalog, work, (workId) =>
        parsedRecommendationContext.success
          ? parsedRecommendationContext.data.marketSnapshot.byWorkId[workId]?.reviewCount
          : undefined,
      ),
    [catalog, work],
  );
  const contrastingWorks = useMemo(() => {
    if (userWorks === undefined) return [];
    return selectContrastingWorks({
      source: work,
      candidates: catalog.works,
      excludedWorkIds: [
        ...nearbyWorks.map((related) => related.work.id),
        ...(sameAuthor === null || sameAuthor.featured === null ? [] : [sameAuthor.featured.id]),
        ...(sameAuthor?.others.map((other) => other.id) ?? []),
        ...(compatibility.kind === "ready"
          ? compatibility.evidence.map((item) => item.work.id)
          : []),
        ...userWorks
          .filter((record) => record.readingState !== "planned" || record.reaction === "disliked")
          .map((record) => record.workId),
      ],
    });
  }, [catalog, compatibility, nearbyWorks, sameAuthor, userWorks, work]);
  const coverTargets = useMemo(() => {
    const anchorWorkIds =
      compatibility.kind === "ready" ? compatibility.evidence.map((item) => item.work.id) : [];
    const orderedWorkIds = [
      ...new Set([
        ...anchorWorkIds,
        ...(sameAuthor === null
          ? []
          : [
              ...(sameAuthor.featured === null ? [] : [sameAuthor.featured.id]),
              ...sameAuthor.others.map((other) => other.id),
            ]),
        ...nearbyWorks.map((related) => related.work.id),
        ...contrastingWorks.map((entry) => entry.work.id),
      ]),
    ];
    return createRecommendationCoverTargets(catalog, orderedWorkIds);
  }, [catalog, compatibility, contrastingWorks, nearbyWorks, sameAuthor]);
  const { coverUrls, requestCover } = useRecommendationCovers({
    targets: coverTargets,
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
        if (
          cached !== null &&
          cached.workId === work.id &&
          normalizeIsbn(cached.isbn) === normalizeIsbn(providerIsbn)
        ) {
          const cachedState = inspectProviderCache(cached, providerNow());
          if (active) {
            setProviderLoad({ isbn: providerIsbn, phase: "loading", cache: cachedState });
          }
          if (
            cachedState.metadataFresh &&
            cachedState.commercialFresh &&
            cached.publisherName !== undefined
          ) {
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
  const bookMetadata = resolveWorkBookMetadata(work, representativeVolume, metadata);
  const commercial = visibleProvider.cache?.commercial ?? null;
  const directUrl =
    metadata?.affiliateUrl ?? metadata?.itemUrl ?? visibleProvider.cache?.fallbackItemUrl;
  const providerHref = directUrl ?? buildRakutenBooksSearchUrl(work.title);
  const isDirectProviderLink = directUrl !== undefined;
  const volumeCount = seriesVolumeCount(catalog, work.id);
  const heroCoverUrl =
    bookMetadata.imageUrl === undefined ? null : coverSourceForSize(bookMetadata.imageUrl, 600);
  const statusLabel =
    work.status === "unknown" ? undefined : recommendationStrings.workStatus[work.status];
  const metaItems: WorkMetaItem[] = [
    ...(bookMetadata.publisherName === undefined
      ? []
      : [
          {
            key: "publisher",
            term: workDetailStrings.metadata.publisher,
            value: bookMetadata.publisherName,
          },
        ]),
    // A confirmed series length carries the known status beside it; without one only the status.
    ...(volumeCount > 0
      ? [
          {
            key: "volumes",
            term: workDetailStrings.metadata.volumes,
            value:
              statusLabel === undefined
                ? recommendationStrings.volumeCount(volumeCount)
                : `${recommendationStrings.volumeCount(volumeCount)} ${statusLabel}`,
          },
        ]
      : statusLabel === undefined
        ? []
        : [{ key: "status", term: workDetailStrings.metadata.status, value: statusLabel }]),
    ...(commercial?.itemPrice !== undefined && commercial.itemPrice > 0
      ? [
          {
            key: "price",
            term: workDetailStrings.provider.priceLabel(representativeVolume?.volumeNumber),
            termVisible: true,
            value: workDetailStrings.provider.price(commercial.itemPrice),
          },
        ]
      : []),
    ...(metadata?.reviewAverage !== undefined &&
    metadata.reviewAverage > 0 &&
    metadata.reviewCount !== undefined &&
    metadata.reviewCount > 0
      ? [
          {
            key: "rating",
            term: workDetailStrings.provider.ratingLabel,
            termVisible: true,
            value: `${workDetailStrings.provider.rating(metadata.reviewAverage)}${workDetailStrings.provider.reviewCountInline(metadata.reviewCount)}`,
          },
        ]
      : []),
  ];

  return (
    <>
      <main
        className={`mx-auto w-full${pageEntryMotion.active ? " page-entry-b motion-safe:animate-[page-entry-b-enter_var(--motion-duration-page)_var(--motion-ease-direct)_both]" : ""}`}
        data-work-detail-id={work.id}
        key={work.id}
        onAnimationEnd={pageEntryMotion.onAnimationEnd}
        {...pageEntryFadeProps(pageEntryMotion.variant)}
      >
        <p aria-atomic="true" aria-live="polite" className="sr-only">
          {navigationStrings.routeAnnouncement(work.title)}
        </p>
        <DetailBackLink />
        <WorkDetailShell
          coverUrl={heroCoverUrl}
          creators={work.creators}
          kind="catalog"
          title={work.title}
        >
          <header className="grid gap-[var(--space-2)]">
            <h1 className="font-display text-[length:var(--font-size-28)] leading-[var(--line-height-heading)] [overflow-wrap:anywhere] text-text-strong">
              {work.title}
            </h1>
            <p className="text-[length:var(--font-size-14)] text-text-muted">
              {coverStrings.creatorLine(work.creators)}
            </p>
            {/* Only known values: an unconfirmed length, an unknown status, a 0 price or rating add nothing. */}
            <WorkMetaLine items={metaItems} />
            <GenreChips
              className="pt-[var(--space-1)]"
              label={workDetailStrings.factors.heading}
              labels={factorIds.map((factorId) => explanationLexicon.factorLabels[factorId])}
            />
          </header>
          {/* 相性 before purchase: the product's own reading of this work comes first. */}
          <CompatibilitySection
            catalog={catalog}
            coverUrls={coverUrls}
            onCoverVisible={requestCover}
            state={compatibility}
          />
          {status.state === "degraded" ? (
            <Notice tone="warn">{workDetailStrings.storageWarning}</Notice>
          ) : null}
          <WorkStateControls
            addUserWorkIfAbsent={addUserWorkIfAbsent}
            record={currentRecord}
            recordsReady={userWorks !== undefined}
            removeMinimalPlannedUserWork={removeMinimalPlannedUserWork}
            removeUserWorkIfUnchanged={removeUserWorkIfUnchanged}
            saveUserWork={saveUserWork}
            seriesContinues={work.status === "ongoing" || work.status === "hiatus"}
            workId={work.id}
          />
          <section aria-labelledby="work-provider-heading" className="grid gap-[var(--space-2)]">
            <h2 className="sr-only" id="work-provider-heading">
              {workDetailStrings.provider.heading}
            </h2>
            <div className="flex items-start gap-[var(--space-2)]">
              {/* An outside shop link, not the product's own action: neutral, never accent. */}
              <a
                aria-label={
                  isDirectProviderLink
                    ? workDetailStrings.provider.openNewTab
                    : workDetailStrings.provider.searchNewTab
                }
                className={buttonClassName({
                  className:
                    "min-w-0 flex-1 px-[var(--space-3)] font-bold md:flex-none md:px-[var(--space-5)]",
                  variant: "outline",
                })}
                href={providerHref}
                rel="noreferrer"
                target="_blank"
              >
                {isDirectProviderLink
                  ? workDetailStrings.provider.view
                  : workDetailStrings.provider.search}
                <span className="text-[length:var(--text-caption-size)] font-normal">
                  （{workDetailStrings.provider.newTab}）
                </span>
              </a>
              <ShareButton title={work.title} />
            </div>
            <div className="flex flex-wrap gap-x-[var(--space-3)] gap-y-[var(--space-1)] text-[length:var(--text-caption-size)] text-text-muted">
              <p>
                {metadata?.affiliateUrl === undefined ? null : (
                  <span>{workDetailStrings.provider.affiliate} </span>
                )}
                {workDetailStrings.provider.credit}
              </p>
              {commercial?.availability === undefined ? null : (
                <p>{workDetailStrings.provider.availability[commercial.availability]}</p>
              )}
            </div>
            {visibleProvider.phase === "loading" ? (
              <p
                aria-live="polite"
                className="text-[length:var(--text-caption-size)] text-text-muted"
              >
                {workDetailStrings.provider.loading}
              </p>
            ) : visibleProvider.phase === "error" && isbn !== null ? (
              <Button
                className="w-fit"
                onClick={() => {
                  setProviderLoad((current) => ({ ...current, phase: "loading" }));
                  setProviderAttempt((current) => current + 1);
                }}
                type="button"
                variant="ghost"
              >
                {workDetailStrings.provider.retry}
              </Button>
            ) : null}
          </section>
        </WorkDetailShell>

        <div className="mx-auto w-full max-w-[var(--layout-width-media)] px-[var(--layout-page-padding)] pt-[var(--space-section)]">
          <div className="work-detail-column grid gap-[var(--space-section)] [&>*]:min-w-0">
            {bookMetadata.itemCaption === undefined ? (
              <section
                aria-labelledby="work-synopsis-heading"
                className="grid gap-[var(--space-3)]"
              >
                <SectionHeading
                  className="mb-0"
                  compact
                  id="work-synopsis-heading"
                  title={workDetailStrings.synopsis.heading}
                />
                <p className="text-[length:var(--font-size-14)] text-text-muted" role="status">
                  {bookMetadata.captionRejected
                    ? workDetailStrings.synopsis.chapterList
                    : visibleProvider.phase === "loading"
                      ? workDetailStrings.synopsis.loading
                      : visibleProvider.phase === "error" && isbn !== null
                        ? workDetailStrings.synopsis.unavailable
                        : workDetailStrings.synopsis.missing}
                </p>
              </section>
            ) : (
              <section
                aria-labelledby="work-synopsis-heading"
                className="grid gap-[var(--space-3)]"
              >
                <SectionHeading
                  className="mb-0"
                  compact
                  id="work-synopsis-heading"
                  title={workDetailStrings.synopsis.heading}
                />
                <div className="grid gap-[var(--space-3)] rounded-[var(--radius-card)] bg-surface-1 p-[var(--space-5)] text-[length:var(--font-size-14)]">
                  <WorkSynopsis caption={bookMetadata.itemCaption} key={bookMetadata.itemCaption} />
                  {bookMetadata.captionSourceUrl === undefined ? (
                    <p className="text-[length:var(--text-caption-size)] text-text-muted">
                      {workDetailStrings.metadata.edition(representativeVolume?.volumeNumber)}
                    </p>
                  ) : (
                    <a
                      aria-label={workDetailStrings.metadata.sourceOpen(
                        workDetailStrings.synopsis.sourceForEdition(
                          workDetailStrings.synopsis.source[bookMetadata.captionSource],
                          representativeVolume?.volumeNumber,
                        ),
                      )}
                      className="inline-flex min-h-[var(--control-min-size)] w-fit items-center text-[length:var(--text-caption-size)] text-text-muted underline decoration-line underline-offset-4 hover:text-accent-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                      href={bookMetadata.captionSourceUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {workDetailStrings.synopsis.sourceForEdition(
                        workDetailStrings.synopsis.source[bookMetadata.captionSource],
                        representativeVolume?.volumeNumber,
                      )}
                    </a>
                  )}
                </div>
              </section>
            )}
            {work.eligibility.recommendationEligible ? (
              <div>
                <WorkTraits
                  tasteAxes={tasteAxes}
                  tasteReady={userWorks !== undefined}
                  work={work}
                />
              </div>
            ) : null}
            {bookMetadata.salesDate === undefined &&
            bookMetadata.imprint === undefined &&
            bookMetadata.pageCount === undefined ? null : (
              <section
                aria-labelledby="work-book-info-heading"
                className="grid gap-[var(--space-3)]"
              >
                <h2
                  className="text-[length:var(--font-size-16)] font-bold text-text-strong"
                  id="work-book-info-heading"
                >
                  {workDetailStrings.metadata.bookHeading(representativeVolume?.volumeNumber)}
                </h2>
                <dl className="m-0 flex flex-wrap gap-x-[var(--space-6)] gap-y-[var(--space-3)] p-0 [&>div]:grid [&>div]:gap-[var(--space-content-tight)] [&_dd]:m-0 [&_dd]:text-text [&_dt]:text-[length:var(--text-caption-size)] [&_dt]:text-text-muted">
                  {bookMetadata.salesDate === undefined ? null : (
                    <div>
                      <dt>{workDetailStrings.metadata.releaseDate}</dt>
                      <dd>{workDetailStrings.metadata.date(bookMetadata.salesDate)}</dd>
                    </div>
                  )}
                  {bookMetadata.imprint === undefined ? null : (
                    <div>
                      <dt>{workDetailStrings.metadata.imprint}</dt>
                      <dd>{bookMetadata.imprint}</dd>
                    </div>
                  )}
                  {bookMetadata.pageCount === undefined ? null : (
                    <div>
                      <dt>{workDetailStrings.metadata.pages}</dt>
                      <dd>{workDetailStrings.metadata.pageCount(bookMetadata.pageCount)}</dd>
                    </div>
                  )}
                </dl>
                {bookMetadata.collectedSourceUrl === undefined ? null : (
                  <a
                    aria-label={workDetailStrings.metadata.sourceOpen(
                      workDetailStrings.metadata.publisherSource,
                    )}
                    className="inline-flex min-h-[var(--control-min-size)] w-fit items-center text-[length:var(--text-caption-size)] text-text-muted underline decoration-line underline-offset-4 hover:text-accent-ink focus-visible:rounded-[var(--radius-control)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                    href={bookMetadata.collectedSourceUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {workDetailStrings.metadata.publisherSource}
                  </a>
                )}
              </section>
            )}
          </div>
        </div>
        {sameAuthor === null ? null : (
          <div className="mx-auto w-full max-w-[var(--layout-width-media)] px-[var(--layout-page-padding)] pt-[var(--space-section)]">
            <SameAuthorSection
              authors={sameAuthor.authors}
              sharedAuthorsByWorkId={sameAuthor.sharedAuthorsByWorkId}
              coverUrlOf={(workId) =>
                coverUrls.get(workId) ??
                catalog.volumes.find(
                  (volume) => volume.id === catalog.representativeVolumeByWorkId[workId],
                )?.metadata?.imageUrl
              }
              featured={sameAuthor.featured}
              featuredMeta={
                sameAuthor.featured === null ? "" : sameAuthorMeta(catalog, sameAuthor.featured)
              }
              onCoverVisible={requestCover}
              others={sameAuthor.others}
            />
          </div>
        )}
        {nearbyWorks.length === 0 && contrastingWorks.length === 0 ? null : (
          <div className="mx-auto grid w-full max-w-[var(--layout-width-media)] gap-[var(--space-shelf)] px-[var(--layout-page-padding)] pt-[var(--space-section)]">
            {nearbyWorks.length === 0 ? null : (
              <RankingShelf
                compactHeading
                controlsPlacement="overlay"
                description={workDetailStrings.related.description}
                rankingKind="unranked"
                title={workDetailStrings.related.heading(work.title)}
                trackClassName="!pb-[var(--space-1)]"
              >
                {nearbyWorks.map(({ work: related, contributions }) => {
                  const lead = contributions[0];
                  if (lead === undefined) return null;
                  const label = explanationLexicon.factorLabels[lead.factorId];
                  const reason =
                    lead.group === "genre"
                      ? workDetailStrings.related.genreReason(label)
                      : lead.group === "theme"
                        ? workDetailStrings.related.themeReason(label)
                        : workDetailStrings.related.axisReason(label);
                  const genreLabels = related.genres
                    .slice(0, 3)
                    .map((genre) => onboardingStrings.step1.genreLabels[genre]);
                  const genres = genreLabels.join(" · ");
                  return (
                    <RankingCard
                      coverUrl={coverUrls.get(related.id)}
                      creators={related.creators}
                      key={related.id}
                      metadata={
                        <span className="grid gap-[var(--space-2)]">
                          <GenreChips inline labels={genreLabels} max={2} />
                          <span className="text-[length:var(--text-caption-size)]">{reason}</span>
                        </span>
                      }
                      metadataAccessibleLabel={[genres, reason].filter(Boolean).join(" · ")}
                      onCoverVisible={() => requestCover(related.id)}
                      title={related.title}
                      variant="unranked"
                      workId={related.id}
                    />
                  );
                })}
              </RankingShelf>
            )}
            <WorkContrastSection
              coverUrls={coverUrls}
              entries={contrastingWorks}
              onCoverVisible={requestCover}
            />
          </div>
        )}
      </main>
    </>
  );
}

export function WorkDetailFlow({ workId }: Readonly<{ workId: string }>) {
  const catalog = useCatalog();
  const work = catalog.works.find((candidate) => candidate.id === workId);

  if (work === undefined) {
    return (
      <main className="mx-auto grid min-h-[calc(100dvh-var(--layout-mobile-navigation-clearance))] w-full max-w-[var(--layout-width-reading)] content-center justify-items-start gap-[var(--space-4)] p-[var(--layout-page-padding)]">
        <PageHeader title={workDetailStrings.notFound.title}>
          <p>{workDetailStrings.notFound.description}</p>
        </PageHeader>
        <Link
          className="inline-flex min-h-[var(--control-min-size)] items-center font-bold text-accent-ink underline underline-offset-[var(--space-content-tight)]"
          to="/recommendations"
        >
          {workDetailStrings.notFound.recommendations}
        </Link>
      </main>
    );
  }

  return <WorkDetailContent catalog={catalog} work={work} />;
}
