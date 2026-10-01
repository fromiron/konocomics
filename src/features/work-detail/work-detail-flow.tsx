"use client";

import { Link } from "@tanstack/react-router";
import { BookmarkIcon, EyeOffIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { coverSourceForSize } from "@/components/cover/CoverImage";
import { Button, buttonClassName } from "@/components/design-system/button";
import { Snackbar, type SnackbarNotice } from "@/components/layout/snackbar";
import { MediaShelf } from "@/components/media/media-shelf";
import { RankingCard } from "@/components/media/ranking-card";
import { ReasonBubble } from "@/components/media/reason-bubble";
import { ReasonChips } from "@/components/media/recommendation-evidence";
import { pageEntryFadeProps, usePageEntryMotion } from "@/components/motion/use-page-entry-motion";
import { usePointerEffect } from "@/components/motion/use-pointer-effects";
import { useSaveConfirmation } from "@/components/motion/use-save-confirmation";
import recommendationContextJson from "@/data/generated/recommendation-context-v1.json";
import { AXIS_IDS, GENRE_TAGS, THEME_TAGS } from "@/domain/catalog/constants";
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
import type { RecommendationInput } from "@/domain/recommendation/types";
import { useCatalog } from "@/features/catalog/catalog-provider";
import { WorkDetailShell } from "@/features/work-detail/work-detail-shell";
import { SameAuthorSection } from "@/features/work-detail/same-author-banner";
import { ShareButton } from "@/features/work-detail/share-button";
import { WorkTraits } from "@/features/work-detail/work-traits";
import {
  resolveWorkBookMetadata,
  selectSameAuthorWorks,
} from "@/features/work-detail/work-detail-data";
import {
  createRecommendationCoverTargets,
  useRecommendationCovers,
} from "@/features/recommendations/recommendation-cover-resolver";
import { usePersistence, type ProviderCacheRecord } from "@/infrastructure/db";
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
  | Readonly<{ kind: "unavailable" }>
  | Readonly<{ kind: "ready"; explanation: TasteRecommendationExplanation }>;

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

function sameAuthorMeta(work: Work) {
  const context = parsedRecommendationContext.success ? parsedRecommendationContext.data : null;
  const market = context?.marketSnapshot.byWorkId[work.id];
  if (market?.reviewAverage !== undefined && market.reviewCount !== undefined) {
    return workDetailStrings.sameAuthor.reviews(market.reviewAverage, market.reviewCount);
  }
  // Without reviews, fall back to known series facts only; an unknown status adds nothing.
  const volumeCount = context?.constraintByWorkId[work.id]?.volumeCount ?? 0;
  return [
    ...(work.status === "unknown" ? [] : [recommendationStrings.workStatus[work.status]]),
    ...(volumeCount < 1 ? [] : [recommendationStrings.volumeCount(volumeCount)]),
  ].join(" · ");
}

function compareWorkIds(left: Work, right: Work) {
  return left.id < right.id ? -1 : left.id === right.id ? 0 : 1;
}

function relatedWorkGroups(catalog: CatalogV1, source: Work) {
  if (!source.eligibility.recommendationEligible) return { themeRanked: [], moodRanked: [] };
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
  saveUserWork(record: UserWorkRecord): Promise<UserWorkRecord>;
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
    } catch {
      next = { tone: "error", text: workDetailStrings.state.error };
    } finally {
      actionInFlight.current = false;
      setBusy(false);
    }
    noticeSequence.current += 1;
    setNotice({ ...next, id: noticeSequence.current });
  };

  const saveReadingState = (readingState: ReadingState) =>
    runAction(async () => {
      const preservedRecord = readingState === "dropped" ? record : withoutDroppedReasons(record);
      await saveUserWork({
        ...preservedRecord,
        workId,
        readingState,
        updatedAt: new Date().toISOString(),
      });
      return {
        tone: "status",
        text:
          readingState === "planned"
            ? workDetailStrings.state.plannedSaved
            : workDetailStrings.state.stateSaved(workDetailStrings.state.options[readingState]),
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

  // A reaction keeps a finished or dropped state and otherwise records 「読んだ」.
  // Tapping the current reaction clears only the reaction.
  const saveReaction = (reaction: Reaction) => {
    const keptState =
      record?.readingState === "completed" || record?.readingState === "dropped"
        ? record.readingState
        : undefined;
    const nextState = keptState ?? "completed";
    const nextReaction =
      keptState !== undefined && record?.reaction === reaction ? undefined : reaction;
    return runAction(async () => {
      const base = nextState === "dropped" ? record : withoutDroppedReasons(record);
      const negativeReasons = base?.negativeReasons;
      const rest = { ...base };
      delete rest.reaction;
      delete rest.negativeReasons;
      await saveUserWork({
        ...rest,
        workId,
        readingState: nextState,
        ...(nextReaction === undefined ? {} : { reaction: nextReaction }),
        // Dislike reasons are only valid while the reaction stays 「いまいち」.
        ...(nextReaction === "disliked" && negativeReasons !== undefined
          ? { negativeReasons }
          : {}),
        updatedAt: new Date().toISOString(),
      });
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
  const rated = record?.readingState === "completed" || record?.readingState === "dropped";
  const interactive =
    "transition-[background-color,color] duration-[var(--motion-duration-feedback)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas motion-reduce:transition-none";

  const segment = (state: "completed" | "dropped") => {
    const selected = record?.readingState === state;
    return (
      <button
        aria-pressed={selected}
        className={`inline-flex min-h-[var(--control-min-size)] items-center justify-center rounded-[var(--radius-control)] px-[var(--space-4)] text-[length:var(--font-size-14)] font-bold whitespace-nowrap ${interactive} ${
          selected
            ? "bg-accent text-on-accent"
            : "text-text-muted hover:bg-surface-2 hover:text-text-strong"
        }`}
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
      className="grid gap-[var(--space-3)]"
      data-slot="work-state-controls"
    >
      <h2
        className="text-[length:var(--font-size-16)] font-bold text-text-strong"
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
            className="flex flex-wrap items-center gap-x-[var(--space-3)] gap-y-[var(--space-2)]"
            role="group"
          >
            <button
              aria-pressed={bookmarked}
              className={`inline-flex min-h-[var(--control-min-size)] items-center gap-[var(--space-2)] rounded-[var(--radius-control)] px-[var(--space-4)] text-[length:var(--font-size-14)] font-bold ${interactive} ${
                bookmarked
                  ? "bg-accent-soft text-accent"
                  : "bg-surface-2/70 text-text hover:bg-surface-2 hover:text-text-strong"
              }${bookmarkStamping ? " confirm-stamp" : ""}`}
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
            <div
              className="inline-flex gap-[var(--space-1)] rounded-[calc(var(--radius-control)+var(--space-1))] bg-surface-2/70 p-[var(--space-1)]"
              data-slot="work-reading-segments"
            >
              {segment("completed")}
              {segment("dropped")}
            </div>
            {/* 「興味なし」 excludes the work from recommendations rather than tracking reading. */}
            <button
              aria-pressed={excluded}
              className={`inline-flex min-h-[var(--control-min-size)] items-center gap-[var(--space-2)] rounded-[var(--radius-control)] px-[var(--space-3)] text-[length:var(--font-size-14)] font-bold ${interactive} ${
                excluded
                  ? "bg-surface-2 text-text-strong"
                  : "text-text-muted hover:text-text-strong"
              }`}
              data-reading-state="hidden"
              onClick={() => handleStateSelect("hidden")}
              type="button"
            >
              <EyeOffIcon aria-hidden="true" className="size-4" />
              {workDetailStrings.state.options.hidden}
            </button>
          </div>
          <div
            aria-labelledby="work-reaction-label"
            className="grid w-full grid-cols-4 items-center gap-[var(--space-1)] sm:flex sm:w-auto"
            role="group"
          >
            <span
              className="col-span-4 text-[length:var(--text-caption-size)] font-bold text-text-muted sm:mr-[var(--space-2)]"
              id="work-reaction-label"
            >
              {workDetailStrings.state.reactionGroup}
            </span>
            {REACTIONS.map((reaction) => {
              const pressed = rated && record?.reaction === reaction;
              return (
                <button
                  aria-pressed={pressed}
                  className={`inline-flex min-h-[var(--control-min-size)] items-center justify-center rounded-[var(--radius-control)] px-[var(--space-3)] text-[length:var(--font-size-14)] font-bold whitespace-nowrap ${interactive} ${
                    pressed
                      ? "bg-accent-soft text-accent"
                      : "text-text-muted hover:bg-surface-2 hover:text-text-strong"
                  }`}
                  key={reaction}
                  onClick={() => void saveReaction(reaction)}
                  type="button"
                >
                  {libraryStrings.reactions[reaction]}
                </button>
              );
            })}
          </div>
          {readProgress === "" ? null : (
            <p className="text-[length:var(--text-caption-size)] text-text-muted">
              {workDetailStrings.state.progressNote(readProgress)}
            </p>
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

function CompatibilitySummary({
  catalog,
  explanation,
  mobileAnchorFactorLabels,
}: Readonly<{
  catalog: CatalogV1;
  explanation: TasteRecommendationExplanation;
  mobileAnchorFactorLabels: readonly string[];
}>) {
  const leadReason = explanation.positiveReasons[0];
  const leadText = leadReason?.text ?? recommendationStrings.reasonUnavailable;
  const anchorTitle =
    leadReason?.source === "similarity"
      ? leadReason.anchorWorkIds
          .map((workId) => catalog.works.find((work) => work.id === workId)?.title)
          .find((title) => title !== undefined && title !== "")
      : undefined;
  const anchorMention = anchorTitle ?? "";
  const anchorMentionIndex = anchorMention === "" ? -1 : leadText.indexOf(anchorMention);
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
  const desktopLabelText = labels.join(" · ");
  const mobileLabelText = labels
    .filter((label) => !mobileAnchorFactorLabels.includes(label))
    .join(" · ");

  return (
    <div className="grid content-start gap-[var(--space-3)] text-[length:var(--text-body-size)] leading-[var(--line-height-body)] text-text">
      {leadReason === undefined ? (
        <p className="text-text-muted">{leadText}</p>
      ) : (
        <ReasonBubble className="grid gap-[var(--space-2)]">
          <p>
            {anchorMentionIndex < 0 ? (
              leadText
            ) : (
              <>
                {leadText.slice(0, anchorMentionIndex)}
                <strong className="font-bold text-text-strong">{anchorMention}</strong>
                {leadText.slice(anchorMentionIndex + anchorMention.length)}
              </>
            )}
          </p>
          {fullReasons.map(({ reason }) => (
            <p key={`${reason.source}:${reason.group}:${reason.factorId}`}>{reason.text}</p>
          ))}
        </ReasonBubble>
      )}
      {desktopLabelText === "" ? null : (
        <p className={desktopLabelText === mobileLabelText ? undefined : "hidden md:block"}>
          {desktopLabelText}
        </p>
      )}
      {mobileLabelText === "" || desktopLabelText === mobileLabelText ? null : (
        <p className="md:hidden">{mobileLabelText}</p>
      )}
      {explanation.caution === undefined ? null : (
        <ReasonChips
          caution={explanation.caution}
          cautionLabel={workDetailStrings.compatibility.caution}
          reasons={[]}
        />
      )}
    </div>
  );
}

function CompatibilitySection({
  anchorCoverUrls,
  catalog,
  onAnchorCoverVisible,
  state,
}: Readonly<{
  anchorCoverUrls: ReadonlyMap<string, string | null>;
  catalog: CatalogV1;
  onAnchorCoverVisible(workId: string): void;
  state: CompatibilityState;
}>) {
  const spotlightRef = usePointerEffect<HTMLElement>("light");

  if (state.kind === "hidden") return null;
  const primaryAnchorIds = new Set(
    state.kind === "ready"
      ? [
          ...state.explanation.positiveReasons,
          ...(state.explanation.caution ? [state.explanation.caution] : []),
        ]
          .filter((reason) => reason.source === "similarity")
          .flatMap((reason) => reason.anchorWorkIds)
      : [],
  );
  const anchorCards =
    state.kind !== "ready"
      ? []
      : state.explanation.anchors.flatMap((anchor) => {
          const work = catalog.works.find((candidate) => candidate.id === anchor.workId);
          if (work === undefined) return [];
          const factorLabels = state.explanation.positiveReasons
            .filter(
              (reason) =>
                reason.source === "similarity" && reason.anchorWorkIds.includes(anchor.workId),
            )
            .flatMap((reason) => {
              const label = explanationFactorLabel(reason.factorId);
              return label === undefined ? [] : [label];
            });
          return [{ work, factorLabels }];
        });
  const showMobileAnchorDetails = anchorCards.length === 1 || anchorCards.length === 3;
  const mobileAnchorFactorLabels = showMobileAnchorDetails
    ? (anchorCards[0]?.factorLabels ?? [])
    : [];

  return (
    <section
      aria-labelledby="work-compatibility-heading"
      className="relative grid items-start gap-[var(--space-6)] border-t border-line/70 pt-[var(--space-6)] md:grid-cols-2"
      data-slot="work-compatibility"
      ref={spotlightRef}
    >
      <span aria-hidden="true" className="pointer-spotlight" />
      <div className="grid min-w-0 content-start gap-[var(--space-6)]">
        <h2
          className="text-[length:var(--text-subheading-size)] font-bold text-text-strong"
          id="work-compatibility-heading"
        >
          {workDetailStrings.compatibility.heading}
        </h2>
        {state.kind === "unavailable" ? (
          <p>{workDetailStrings.compatibility.unavailable}</p>
        ) : (
          <CompatibilitySummary
            catalog={catalog}
            explanation={state.explanation}
            mobileAnchorFactorLabels={mobileAnchorFactorLabels}
          />
        )}
      </div>
      {anchorCards.length === 0 ? null : (
        <aside
          aria-labelledby="work-evidence-heading"
          className="work-detail-evidence grid min-w-0 gap-[var(--space-4)] rounded-[var(--radius-card)] p-[var(--space-3)] sm:p-[var(--space-4)]"
        >
          <h3
            className="text-[length:var(--text-subheading-size)] font-bold text-text-strong"
            id="work-evidence-heading"
          >
            {workDetailStrings.compatibility.anchors}
          </h3>
          <ul
            className="m-0 grid list-none grid-cols-2 gap-[var(--space-2)] p-0 md:grid-cols-3"
            data-evidence-count={anchorCards.length}
          >
            {anchorCards.map(({ work: anchorWork, factorLabels }, index) => {
              const isPrimary = primaryAnchorIds.has(anchorWork.id);
              const roleLabel = isPrimary
                ? workDetailStrings.compatibility.primaryAnchor
                : workDetailStrings.compatibility.supportingAnchor;
              return (
                <RankingCard
                  className="work-detail-compatibility__anchor-cover"
                  coverUrl={anchorCoverUrls.get(anchorWork.id)}
                  creators={anchorWork.creators}
                  key={anchorWork.id}
                  metadata={
                    <>
                      <span
                        className="work-detail-evidence__role"
                        data-evidence-role={isPrimary ? "primary" : "supporting"}
                      >
                        {roleLabel}
                      </span>
                      {index === 0 && showMobileAnchorDetails ? (
                        <span className="work-detail-evidence__details mt-[var(--space-3)] grid gap-[var(--space-3)] leading-[var(--line-height-body)] md:hidden">
                          <span>{coverStrings.creatorLine(anchorWork.creators)}</span>
                          {factorLabels.length === 0 ? null : (
                            <span className="grid gap-[var(--space-1)]">
                              <span className="font-bold text-text-strong">
                                {workDetailStrings.compatibility.anchorFactors}
                              </span>
                              <span>{factorLabels.join(" · ")}</span>
                            </span>
                          )}
                        </span>
                      ) : null}
                    </>
                  }
                  metadataAccessibleLabel={
                    index === 0
                      ? [
                          roleLabel,
                          coverStrings.creatorLine(anchorWork.creators),
                          ...factorLabels,
                        ].join(" · ")
                      : roleLabel
                  }
                  onCoverVisible={() => onAnchorCoverVisible(anchorWork.id)}
                  title={anchorWork.title}
                  variant="evidence"
                  workId={anchorWork.id}
                />
              );
            })}
            {[0, 1, 2].slice(anchorCards.length).map((slot) => (
              <RankingCard key={`empty-evidence-${slot}`} variant="evidence-placeholder" />
            ))}
          </ul>
        </aside>
      )}
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
        workId: work.id,
        records: userWorks,
        adjustments,
        policies,
      }),
    [adjustments, catalog, policies, userWorks, work.id],
  );
  const relatedGroups = useMemo(() => relatedWorkGroups(catalog, work), [catalog, work]);
  const sameAuthor = useMemo(
    () =>
      selectSameAuthorWorks(catalog, work, (workId) =>
        parsedRecommendationContext.success
          ? parsedRecommendationContext.data.marketSnapshot.byWorkId[workId]?.reviewCount
          : undefined,
      ),
    [catalog, work],
  );
  const coverTargets = useMemo(() => {
    const anchorWorkIds =
      compatibility.kind === "ready"
        ? compatibility.explanation.anchors.map((anchor) => anchor.workId)
        : [];
    const orderedWorkIds = [
      ...new Set([
        ...anchorWorkIds,
        ...(sameAuthor === null
          ? []
          : [
              ...(sameAuthor.featured === null ? [] : [sameAuthor.featured.id]),
              ...sameAuthor.others.map((other) => other.id),
            ]),
        ...relatedGroups.themeRanked.map((related) => related.id),
        ...relatedGroups.moodRanked.map((related) => related.id),
      ]),
    ];
    return createRecommendationCoverTargets(catalog, orderedWorkIds);
  }, [catalog, compatibility, relatedGroups, sameAuthor]);
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
  const volumeCount = parsedRecommendationContext.success
    ? (parsedRecommendationContext.data.constraintByWorkId[work.id]?.volumeCount ?? 0)
    : catalog.volumes.filter((volume) => volume.workId === work.id).length;
  const heroCoverUrl =
    bookMetadata.imageUrl === undefined ? null : coverSourceForSize(bookMetadata.imageUrl, 600);

  return (
    <>
      <main
        className={`mx-auto w-full pb-[var(--space-section-large)]${pageEntryMotion.active ? " page-entry-b motion-safe:animate-[page-entry-b-enter_var(--motion-duration-page)_var(--motion-ease-direct)_both]" : ""}`}
        data-work-detail-id={work.id}
        key={work.id}
        onAnimationEnd={pageEntryMotion.onAnimationEnd}
        {...pageEntryFadeProps(pageEntryMotion.variant)}
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
            <h1 className="font-display text-[length:var(--font-size-28)] leading-[var(--line-height-heading)] [overflow-wrap:anywhere] text-text-strong">
              {work.title}
            </h1>
            <p className="font-medium text-text-muted">{coverStrings.creatorLine(work.creators)}</p>
            <dl className="m-0 flex flex-wrap gap-x-[var(--space-6)] gap-y-[var(--space-3)] p-0 [&>div]:grid [&>div]:gap-[var(--space-content-tight)] [&_dd]:m-0 [&_dd]:font-bold [&_dd]:text-text-strong [&_dd]:tabular-nums [&_dt]:text-[length:var(--text-caption-size)] [&_dt]:font-medium [&_dt]:text-text-muted">
              <div>
                <dt>{workDetailStrings.metadata.publisher}</dt>
                <dd>{bookMetadata.publisherName ?? workDetailStrings.metadata.unknownPublisher}</dd>
              </div>
              <div>
                <dt>{workDetailStrings.metadata.status}</dt>
                <dd>{recommendationStrings.workStatus[work.status]}</dd>
              </div>
              <div>
                <dt>{workDetailStrings.metadata.volumes}</dt>
                <dd>{recommendationStrings.volumeCount(volumeCount)}</dd>
              </div>
              {commercial?.itemPrice === undefined ? null : (
                <div>
                  <dt>{workDetailStrings.provider.priceLabel}</dt>
                  <dd>{workDetailStrings.provider.price(commercial.itemPrice)}</dd>
                </div>
              )}
              {commercial?.availability === undefined ? null : (
                <div>
                  <dt>{workDetailStrings.provider.availabilityLabel}</dt>
                  <dd>{workDetailStrings.provider.availability[commercial.availability]}</dd>
                </div>
              )}
              {metadata?.reviewAverage === undefined ? null : (
                <div>
                  <dt>{workDetailStrings.provider.ratingLabel}</dt>
                  <dd>
                    {workDetailStrings.provider.rating(metadata.reviewAverage)}
                    {metadata.reviewCount === undefined ? null : (
                      <span className="ml-[var(--space-2)] font-normal text-text-muted">
                        {workDetailStrings.provider.reviewCount(metadata.reviewCount)}
                      </span>
                    )}
                  </dd>
                </div>
              )}
            </dl>
          </header>

          <section
            aria-labelledby="work-provider-heading"
            className="grid gap-[var(--space-content)]"
          >
            <h2 className="sr-only" id="work-provider-heading">
              {workDetailStrings.provider.heading}
            </h2>
            <div className="flex flex-wrap items-center gap-[var(--space-3)]">
              <a
                aria-label={
                  isDirectProviderLink
                    ? workDetailStrings.provider.openNewTab
                    : workDetailStrings.provider.searchNewTab
                }
                className={buttonClassName({
                  className:
                    "w-full min-w-[min(100%,16rem)] px-[var(--space-4)] py-[var(--space-content)] font-bold sm:w-fit",
                })}
                href={providerHref}
                rel="noreferrer"
                target="_blank"
              >
                {isDirectProviderLink
                  ? workDetailStrings.provider.view
                  : workDetailStrings.provider.search}
              </a>
              <ShareButton title={work.title} />
              {visibleProvider.phase === "error" && isbn !== null ? (
                <Button
                  className="w-fit"
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
            </div>
            <p className="text-[length:var(--text-caption-size)] text-text-muted">
              {visibleProvider.phase === "loading" ? (
                <span aria-live="polite">{workDetailStrings.provider.loading} </span>
              ) : commercial === null ? (
                <span>{workDetailStrings.provider.unavailable} </span>
              ) : null}
              {metadata?.affiliateUrl === undefined ? null : (
                <span>{workDetailStrings.provider.affiliate} </span>
              )}
              <span>{workDetailStrings.provider.credit}</span>
            </p>
          </section>

          {status.state === "degraded" ? (
            <p
              className="border-l-[length:var(--space-content-tight)] border-warn bg-surface-1 px-[var(--space-4)] py-[var(--space-3)]"
              role="status"
            >
              {workDetailStrings.storageWarning}
            </p>
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
        </WorkDetailShell>

        <div className="mx-auto grid w-full max-w-[var(--layout-width-media)] gap-[var(--space-shelf)] px-[var(--layout-page-padding)] pt-[var(--space-shelf)]">
          <div className="grid gap-[var(--space-shelf)] md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] md:gap-x-[var(--space-12)]">
            <section
              aria-labelledby="work-synopsis-heading"
              className="grid content-start gap-[var(--space-3)]"
            >
              <h2
                className="text-[length:var(--text-subheading-size)] font-bold text-text-strong"
                id="work-synopsis-heading"
              >
                {workDetailStrings.synopsis.heading}
              </h2>
              <WorkSynopsis
                caption={bookMetadata.itemCaption ?? workDetailStrings.synopsis.unavailable}
                key={bookMetadata.itemCaption}
              />
              {bookMetadata.itemCaption === undefined ||
              bookMetadata.captionSourceUrl === undefined ? null : (
                <a
                  aria-label={workDetailStrings.metadata.sourceOpen(
                    workDetailStrings.synopsis.source[bookMetadata.captionSource],
                  )}
                  className="inline-flex min-h-[var(--control-min-size)] w-fit items-center text-[length:var(--text-caption-size)] text-text-muted underline decoration-line underline-offset-4 hover:text-accent focus-visible:rounded-[var(--radius-control)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                  href={bookMetadata.captionSourceUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  {workDetailStrings.synopsis.source[bookMetadata.captionSource]}
                </a>
              )}
              {bookMetadata.salesDate === undefined &&
              bookMetadata.imprint === undefined &&
              bookMetadata.pageCount === undefined ? null : (
                <section
                  aria-labelledby="work-book-info-heading"
                  className="grid gap-[var(--space-3)] pt-[var(--space-3)]"
                >
                  <h3
                    className="text-[length:var(--font-size-16)] font-bold text-text-strong"
                    id="work-book-info-heading"
                  >
                    {workDetailStrings.metadata.bookHeading(representativeVolume?.volumeNumber)}
                  </h3>
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
                      className="inline-flex min-h-[var(--control-min-size)] w-fit items-center text-[length:var(--text-caption-size)] text-text-muted underline decoration-line underline-offset-4 hover:text-accent focus-visible:rounded-[var(--radius-control)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                      href={bookMetadata.collectedSourceUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {workDetailStrings.metadata.publisherSource}
                    </a>
                  )}
                </section>
              )}
            </section>

            <section
              aria-labelledby="work-factors-heading"
              className="grid content-start gap-[var(--space-3)]"
            >
              <h2
                className="text-[length:var(--text-subheading-size)] font-bold text-text-strong"
                id="work-factors-heading"
              >
                {workDetailStrings.factors.heading}
              </h2>
              {factorIds.length === 0 ? (
                <p className="text-text-muted">{workDetailStrings.factors.empty}</p>
              ) : (
                <ul className="m-0 flex list-none flex-wrap gap-[var(--space-content)] p-0">
                  {factorIds.map((factorId) => (
                    <li
                      className="inline-flex min-h-[var(--space-8)] items-center rounded-[var(--radius-pill)] border border-line/60 px-[var(--space-3)] py-[var(--space-content-tight)] text-[length:var(--font-size-12)] font-bold text-text"
                      key={factorId}
                    >
                      {explanationLexicon.factorLabels[factorId]}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          {work.eligibility.recommendationEligible ? (
            <WorkTraits tasteAxes={tasteAxes} work={work} />
          ) : null}

          <CompatibilitySection
            anchorCoverUrls={coverUrls}
            catalog={catalog}
            onAnchorCoverVisible={requestCover}
            state={compatibility}
          />
        </div>

        <div className="mx-auto grid w-full max-w-[var(--layout-width-media)] gap-[var(--space-shelf)] px-[var(--layout-page-padding)] pt-[var(--space-shelf-group)]">
          {sameAuthor === null ? null : (
            <SameAuthorSection
              author={sameAuthor.author}
              coverUrlOf={(workId) =>
                coverUrls.get(workId) ??
                catalog.volumes.find(
                  (volume) => volume.id === catalog.representativeVolumeByWorkId[workId],
                )?.metadata?.imageUrl
              }
              featured={sameAuthor.featured}
              featuredMeta={sameAuthor.featured === null ? "" : sameAuthorMeta(sameAuthor.featured)}
              onCoverVisible={requestCover}
              others={sameAuthor.others}
            />
          )}
          <MediaShelf
            compactHeading
            description={workDetailStrings.related.description}
            listType="unordered"
            title={workDetailStrings.related.heading}
          >
            {relatedGroups.themeRanked.map((related) => (
              <RankingCard
                coverUrl={coverUrls.get(related.id)}
                creators={related.creators}
                key={related.id}
                metadata={coverStrings.creatorLine(related.creators)}
                metadataAccessibleLabel={coverStrings.creatorLine(related.creators)}
                onCoverVisible={() => requestCover(related.id)}
                title={related.title}
                variant="unranked"
                workId={related.id}
              />
            ))}
          </MediaShelf>
          <MediaShelf
            compactHeading
            description={workDetailStrings.sameMood.description}
            listType="unordered"
            title={workDetailStrings.sameMood.heading}
          >
            {relatedGroups.moodRanked.map((related) => (
              <RankingCard
                coverUrl={coverUrls.get(related.id)}
                creators={related.creators}
                key={related.id}
                metadata={coverStrings.creatorLine(related.creators)}
                metadataAccessibleLabel={coverStrings.creatorLine(related.creators)}
                onCoverVisible={() => requestCover(related.id)}
                title={related.title}
                variant="unranked"
                workId={related.id}
              />
            ))}
          </MediaShelf>
        </div>
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
