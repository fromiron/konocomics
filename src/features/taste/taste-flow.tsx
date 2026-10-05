"use client";

import { Link } from "@tanstack/react-router";
import { ChevronDownIcon, RotateCcwIcon } from "lucide-react";
import { LazyMotion, domAnimation, m } from "motion/react";
import { type CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Button, buttonClassName } from "@/components/design-system/button";
import { PageHeader } from "@/components/layout/page-header";
import { summaryLinkClassName } from "@/components/layout/summary-section";
import { CoverImage } from "@/components/cover/CoverImage";
import { useCountUp } from "@/components/motion/use-count-up";
import { useLiveReducedMotion } from "@/components/motion/use-live-reduced-motion";
import { usePointerEffect } from "@/components/motion/use-pointer-effects";
import { pageEntryFadeProps, usePageEntryMotion } from "@/components/motion/use-page-entry-motion";
import { ART_AXIS_IDS, NARRATIVE_AXIS_IDS, TONE_AXIS_IDS } from "@/domain/catalog/constants";
import type { AxisId, CoverageGroup, ThemeTag, Work } from "@/domain/catalog/types";
import type { ExplanationFactorId } from "@/domain/explanation";
import {
  hasCatalogBackedProfile,
  recommendationProfileRecords,
} from "@/domain/profile/catalog-profile";
import {
  summarizeMangaDna,
  type DnaPreference,
  type MangaDnaSummary,
} from "@/domain/profile/dna-summary";
import { calculateProfileConfidence, getConfidenceLevel } from "@/domain/profile/confidence";
import type {
  AdjustmentPreference,
  ProfileAdjustments,
  UserWorkRecord,
} from "@/domain/profile/types";
import { isExternalNegativeReason } from "@/domain/profile/constants";
import type { RecommendationPlanEntry } from "@/domain/recommendation/types";
import { useCatalog } from "@/features/catalog/catalog-provider";
import {
  createRecommendationCoverTargets,
  useRecommendationCovers,
} from "@/features/recommendations/recommendation-cover-resolver";
import { usePersistence } from "@/infrastructure/db";
import { explanationLexicon, mediaStrings, tasteStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

import { useTastePreview } from "./use-taste-preview";
import { DnaShareButton } from "./dna-share-dialog";
import { AdjustmentRadiogroup } from "./adjustment-radiogroup";
import { FactorBar } from "@/components/media/factor-bar";
import { RecommendationDiffPreview } from "./taste-insights";
import { DnaWheel } from "./dna-wheel";

const DNA_REVEAL_MARKER = "konocomics:manga-dna-reveal:v1";
const EMPTY_RECORDS: readonly UserWorkRecord[] = [];
const EMPTY_ADJUSTMENTS: ProfileAdjustments = { axes: {}, themes: {} };
const EMPTY_PREVIEW_ENTRIES: readonly RecommendationPlanEntry[] = [];
const NARRATIVE_IDS = new Set<AxisId>(NARRATIVE_AXIS_IDS);
const TONE_IDS = new Set<AxisId>(TONE_AXIS_IDS);
const ART_IDS = new Set<AxisId>(ART_AXIS_IDS);
type RevealExperience = Readonly<{
  entry: boolean;
  animate: boolean;
}>;

type RevealClaim = "claimed" | "consumed" | "unavailable";

function factorLabel(factorId: ExplanationFactorId) {
  return explanationLexicon.factorLabels[factorId];
}

function claimDnaReveal(completionIdentity: string): RevealClaim {
  try {
    if (window.sessionStorage.getItem(DNA_REVEAL_MARKER) === completionIdentity) {
      return "consumed";
    }
    window.sessionStorage.setItem(DNA_REVEAL_MARKER, completionIdentity);
    return window.sessionStorage.getItem(DNA_REVEAL_MARKER) === completionIdentity
      ? "claimed"
      : "unavailable";
  } catch {
    return "unavailable";
  }
}

function positiveAnchorWorks(
  records: readonly UserWorkRecord[],
  worksById: ReadonlyMap<string, Work>,
) {
  const seen = new Set<string>();
  return records.flatMap((record): Work[] => {
    if (
      (record.reaction !== "favorite" && record.reaction !== "liked") ||
      seen.has(record.workId)
    ) {
      return [];
    }
    const work = worksById.get(record.workId);
    if (work === undefined) {
      return [];
    }
    seen.add(record.workId);
    return [work];
  });
}

function AnchorStrip({
  anchors,
  animateReveal,
  coverUrls,
  evidenceLabels,
  onCoverVisible,
}: Readonly<{
  anchors: Work[];
  animateReveal: boolean;
  coverUrls: ReadonlyMap<string, string | null>;
  evidenceLabels: ReadonlyMap<string, string>;
  onCoverVisible(workId: string): void;
}>) {
  const content = (
    <section
      aria-labelledby="taste-anchors-heading"
      className="taste-anchor-strip grid gap-[var(--space-4)]"
    >
      <header className="grid gap-[var(--space-1)]">
        <h2
          className="text-[length:var(--text-subheading-size)] text-text-strong"
          id="taste-anchors-heading"
        >
          {tasteStrings.anchorsHeading}
        </h2>
        <p className="text-[length:var(--font-size-14)] text-text-muted">
          {tasteStrings.anchorsDescription(anchors.length)}
        </p>
      </header>
      <ul
        aria-label={tasteStrings.anchorsHeading}
        className="m-0 grid list-none grid-cols-2 gap-[var(--space-4)] p-0 sm:grid-cols-3 lg:grid-cols-5"
      >
        {anchors.map((work) => (
          <li className="min-w-0" key={work.id}>
            <Link
              aria-label={mediaStrings.openDetails(work.title)}
              className="group/evidence grid h-full min-h-[var(--control-min-size)] grid-rows-[auto_1fr] overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface-1 transition-colors duration-[var(--motion-duration-value)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:bg-surface-2 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-surface-2"
              params={{ workId: work.id }}
              preload={false}
              to="/works/$workId"
            >
              <CoverImage
                className="taste-anchor-cover aspect-[30/43] w-full overflow-hidden rounded-none border-0"
                coverUrl={coverUrls.get(work.id)}
                creators={work.creators}
                decorative
                onVisible={() => onCoverVisible(work.id)}
                requestedSize={400}
                title={work.title}
              />
              <span className="grid min-w-0 content-start gap-[var(--space-2)] p-[var(--space-3)]">
                <strong className="line-clamp-2 min-h-[2lh] text-[length:var(--font-size-14)] leading-tight text-text-strong">
                  {work.title}
                </strong>
                {evidenceLabels.has(work.id) ? (
                  <span className="w-fit max-w-full rounded-[var(--radius-pill)] border border-accent/25 bg-accent-soft px-[var(--space-2)] py-[var(--space-1)] text-[length:var(--text-caption-size)] leading-snug text-accent-ink">
                    {evidenceLabels.get(work.id)}
                  </span>
                ) : null}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
  return animateReveal ? (
    <m.div
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
    >
      {content}
    </m.div>
  ) : (
    content
  );
}

type AdjustmentGroup = Exclude<CoverageGroup, "genre">;

function AdjustmentResetButton({
  label,
  disabled,
  onReset,
}: Readonly<{
  label: string;
  disabled: boolean;
  onReset(): void;
}>) {
  return (
    <Button
      aria-label={label}
      className="taste-adjustment-reset relative z-10 size-[var(--control-min-size)] shrink-0 p-0 text-text-muted"
      disabled={disabled}
      onClick={onReset}
      title={label}
      type="button"
      variant="ghost"
    >
      <RotateCcwIcon aria-hidden="true" className="size-4" />
    </Button>
  );
}

type FactorGroupProps<FactorId extends ExplanationFactorId> = Readonly<{
  id: CoverageGroup;
  title: string;
  preferences: readonly DnaPreference<FactorId>[];
  animateReveal: boolean;
  factorRevealReady: boolean;
  adjustmentValues?: Partial<Record<FactorId, AdjustmentPreference>>;
  onAdjustment?: (factorId: FactorId, preference: AdjustmentPreference) => void;
  onReset?: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}>;

const ADJUSTMENT_PREVIEW_LIMIT = 6;

function compareByAnalysedValue<FactorId extends ExplanationFactorId>(
  left: DnaPreference<FactorId>,
  right: DnaPreference<FactorId>,
) {
  const leftValue = left.state === "known" ? (left.value ?? -1) : -1;
  const rightValue = right.state === "known" ? (right.value ?? -1) : -1;
  return (
    rightValue - leftValue ||
    (left.factorId < right.factorId ? -1 : left.factorId > right.factorId ? 1 : 0)
  );
}

function summarizeGroupPreferences<FactorId extends ExplanationFactorId>(
  preferences: readonly DnaPreference<FactorId>[],
) {
  const labels = preferences
    .flatMap((preference) =>
      preference.state === "known" && preference.value !== null ? [preference] : [],
    )
    .sort(
      (left, right) =>
        (right.value ?? 0) - (left.value ?? 0) ||
        (left.factorId < right.factorId ? -1 : left.factorId > right.factorId ? 1 : 0),
    )
    .slice(0, 3)
    .map((preference) => factorLabel(preference.factorId));

  return labels.length === 0
    ? tasteStrings.unknown
    : tasteStrings.groupFactorSummary(labels, Math.max(0, preferences.length - labels.length));
}

function FactorGroup<FactorId extends ExplanationFactorId>({
  id,
  title,
  preferences,
  animateReveal,
  factorRevealReady,
  adjustmentValues,
  onAdjustment,
  onReset,
  onOpenChange,
  open,
}: FactorGroupProps<FactorId>) {
  const detailsId = `taste-group-${id}-details`;
  const isAnalysisOnly = adjustmentValues === undefined || onAdjustment === undefined;
  const adjustedCount =
    adjustmentValues === undefined
      ? null
      : preferences.filter(
          (preference) => (adjustmentValues[preference.factorId] ?? "auto") !== "auto",
        ).length;
  const orderedPreferences = isAnalysisOnly
    ? preferences
    : [...preferences].sort(compareByAnalysedValue);
  const adjustedIds = () =>
    new Set(
      preferences
        .filter((preference) => (adjustmentValues?.[preference.factorId] ?? "auto") !== "auto")
        .map((preference) => preference.factorId),
    );
  // Pinned rows are fixed when the list collapses, so resetting one to 自動 never removes it
  // from under the pointer or keyboard focus.
  const [pinnedIds, setPinnedIds] = useState(adjustedIds);
  const [showAll, setShowAll] = useState(false);
  const canCollapse = !isAnalysisOnly && orderedPreferences.length > ADJUSTMENT_PREVIEW_LIMIT;
  const visiblePreferences =
    !canCollapse || showAll
      ? orderedPreferences
      : orderedPreferences.filter(
          (preference, index) =>
            index < ADJUSTMENT_PREVIEW_LIMIT || pinnedIds.has(preference.factorId),
        );
  const settingSummary =
    adjustedCount === null
      ? tasteStrings.groupAnalysisCount(preferences.length)
      : adjustedCount === 0
        ? tasteStrings.groupAdjustmentAuto
        : tasteStrings.groupAdjustmentCount(adjustedCount);

  return (
    <section
      aria-labelledby={`taste-group-${id}`}
      className="taste-factor-group m-0 min-w-0 border-t border-line first:border-t-0"
    >
      <header className="relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-[var(--space-3)] gap-y-[var(--space-1)] py-[var(--space-4)] min-[360px]:grid-cols-[minmax(0,1fr)_auto_auto] sm:grid-cols-[minmax(calc(var(--space-12)*3),0.3fr)_minmax(0,1fr)_auto_auto]">
        <h3
          aria-label={title}
          className="flex min-w-0 items-center gap-[var(--space-1)] text-[length:var(--font-size-16)]"
          id={`taste-group-${id}`}
        >
          <button
            aria-controls={detailsId}
            aria-expanded={open}
            aria-describedby={`taste-group-${id}-summary taste-group-${id}-status`}
            aria-label={
              isAnalysisOnly
                ? tasteStrings.groupAnalysisDetailsLabel(title, open)
                : tasteStrings.groupDetailsLabel(title, open)
            }
            className="taste-factor-group__trigger min-h-[var(--control-min-size)] min-w-0 text-left text-[length:var(--font-size-14)] font-bold text-text-strong after:absolute after:inset-0 after:rounded-[var(--radius-control)] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-ring"
            onClick={() => onOpenChange(!open)}
            type="button"
          >
            {title}
          </button>
          {onReset === undefined ? null : (
            <AdjustmentResetButton
              disabled={adjustedCount === 0}
              label={tasteStrings.resetGroup(title)}
              onReset={onReset}
            />
          )}
        </h3>
        <span
          className="pointer-events-none col-span-2 row-start-3 line-clamp-2 min-w-0 text-[length:var(--text-caption-size)] text-text-muted min-[360px]:col-span-3 min-[360px]:row-start-2 sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:line-clamp-1"
          id={`taste-group-${id}-summary`}
        >
          {summarizeGroupPreferences(preferences)}
        </span>
        <span
          className={cn(
            "pointer-events-none col-start-1 row-start-2 w-fit whitespace-nowrap rounded-[var(--radius-pill)] border px-[var(--space-2)] py-[var(--space-1)] text-[length:var(--text-caption-size)] font-medium min-[360px]:col-start-2 min-[360px]:row-start-1 sm:col-start-3",
            isAnalysisOnly
              ? "border-line bg-surface-2 text-text-muted"
              : "border-accent/25 bg-accent-soft text-accent-ink",
            adjustedCount !== null && adjustedCount > 0 && "font-bold",
          )}
          id={`taste-group-${id}-status`}
        >
          {settingSummary}
        </span>
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none col-start-2 row-start-1 grid size-[var(--control-min-size)] place-items-center rounded-[var(--radius-pill)] border border-line text-text-muted min-[360px]:col-start-3 sm:col-start-4",
            open && "border-accent text-accent-ink",
          )}
        >
          <ChevronDownIcon
            className={cn(
              "size-4 transition-transform duration-[var(--motion-duration-value)] motion-reduce:transition-none",
              open && "rotate-180",
            )}
          />
        </span>
      </header>
      <div
        className="taste-factor-group__details pb-[var(--space-5)]"
        hidden={!open}
        id={detailsId}
      >
        {open ? (
          <>
            {isAnalysisOnly ? null : (
              <p className="mb-[var(--space-3)] max-w-[var(--layout-width-reading)] text-[length:var(--text-caption-size)] text-text-muted">
                {tasteStrings.groupAdjustmentHelp}
              </p>
            )}
            <div
              className={cn(
                "taste-factor-group__rows grid",
                isAnalysisOnly
                  ? "taste-factor-group__rows--analysis grid-cols-1 md:grid-cols-2 md:gap-x-[var(--space-6)]"
                  : "grid-cols-1",
              )}
            >
              {visiblePreferences.map((preference, index) => {
                const label = factorLabel(preference.factorId);
                return (
                  <div
                    className={cn(
                      "taste-factor-row grid min-w-0 gap-[var(--space-3)] border-t border-line/70 py-[var(--space-3)]",
                      isAnalysisOnly && "taste-factor-row--analysis",
                    )}
                    key={preference.factorId}
                  >
                    <FactorBar
                      animateReveal={animateReveal}
                      enterDelay={index * 0.04}
                      enterFill
                      revealReady={factorRevealReady}
                      label={label}
                      revealDelay={index * 0.06}
                      state={preference.state}
                      value={preference.value}
                    />
                    {adjustmentValues === undefined || onAdjustment === undefined ? null : (
                      <div className="taste-factor-row__adjustment min-w-0">
                        <AdjustmentRadiogroup
                          factorId={`${id}-${preference.factorId}`}
                          factorLabel={label}
                          onChange={(value) => onAdjustment(preference.factorId, value)}
                          value={adjustmentValues[preference.factorId] ?? "auto"}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {canCollapse ? (
              <Button
                aria-controls={detailsId}
                aria-expanded={showAll}
                aria-label={tasteStrings.groupShowAllLabel(
                  title,
                  orderedPreferences.length,
                  showAll,
                )}
                className="mx-auto mt-[var(--space-4)] flex w-fit gap-[var(--space-2)] rounded-[var(--radius-pill)] text-[length:var(--text-caption-size)]"
                onClick={() => {
                  if (showAll) setPinnedIds(adjustedIds());
                  setShowAll(!showAll);
                }}
                type="button"
                variant="outline"
              >
                {showAll
                  ? tasteStrings.groupShowFewer
                  : tasteStrings.groupShowAll(orderedPreferences.length)}
                <ChevronDownIcon
                  aria-hidden="true"
                  className={cn(
                    "size-4 transition-transform duration-[var(--motion-duration-feedback)] motion-reduce:transition-none",
                    showAll && "rotate-180",
                  )}
                />
              </Button>
            ) : null}
          </>
        ) : null}
      </div>
    </section>
  );
}

type TasteMode = "summary" | "adjust";

function FactorPanels({
  adjustments,
  animateReveal,
  factorRevealReady,
  group,
  onAdjustment,
  onReset,
  onGroupChange,
  summary,
}: Readonly<{
  adjustments: ProfileAdjustments;
  animateReveal: boolean;
  factorRevealReady: boolean;
  group?: CoverageGroup;
  onAdjustment: (
    kind: "axis" | "theme",
    factorId: AxisId | ThemeTag,
    preference: AdjustmentPreference,
  ) => void;
  onGroupChange?: (group: CoverageGroup | undefined) => void;
  onReset(group: AdjustmentGroup): void;
  summary: MangaDnaSummary;
}>) {
  const narrative = summary.axes.filter((preference) => NARRATIVE_IDS.has(preference.factorId));
  const tone = summary.axes.filter((preference) => TONE_IDS.has(preference.factorId));
  const art = summary.axes.filter((preference) => ART_IDS.has(preference.factorId));
  const [localOpenGroup, setLocalOpenGroup] = useState<CoverageGroup | null>(group ?? null);
  const openGroup = onGroupChange === undefined ? localOpenGroup : (group ?? null);

  const setGroupOpen = (candidate: CoverageGroup, open: boolean) => {
    const nextGroup = open ? candidate : null;
    if (onGroupChange === undefined) setLocalOpenGroup(nextGroup);
    else onGroupChange(nextGroup ?? undefined);
  };

  return (
    <div className="taste-factor-grid grid min-w-0 grid-cols-1 items-start rounded-[var(--radius-card)] border border-line bg-surface-1 px-[var(--space-4)] sm:px-[var(--space-6)]">
      <FactorGroup
        animateReveal={animateReveal}
        factorRevealReady={factorRevealReady}
        id="genre"
        onOpenChange={(open) => setGroupOpen("genre", open)}
        open={openGroup === "genre"}
        preferences={summary.genres}
        title={tasteStrings.groups.genre}
      />
      <FactorGroup
        adjustmentValues={adjustments.themes}
        animateReveal={animateReveal}
        factorRevealReady={factorRevealReady}
        id="theme"
        onReset={() => onReset("theme")}
        onAdjustment={(factorId, value) => onAdjustment("theme", factorId, value)}
        onOpenChange={(open) => setGroupOpen("theme", open)}
        open={openGroup === "theme"}
        preferences={summary.themes}
        title={tasteStrings.groups.theme}
      />
      <FactorGroup
        adjustmentValues={adjustments.axes}
        animateReveal={animateReveal}
        factorRevealReady={factorRevealReady}
        id="narrative"
        onReset={() => onReset("narrative")}
        onAdjustment={(factorId, value) => onAdjustment("axis", factorId, value)}
        onOpenChange={(open) => setGroupOpen("narrative", open)}
        open={openGroup === "narrative"}
        preferences={narrative}
        title={tasteStrings.groups.narrative}
      />
      <FactorGroup
        adjustmentValues={adjustments.axes}
        animateReveal={animateReveal}
        factorRevealReady={factorRevealReady}
        id="tone"
        onReset={() => onReset("tone")}
        onAdjustment={(factorId, value) => onAdjustment("axis", factorId, value)}
        onOpenChange={(open) => setGroupOpen("tone", open)}
        open={openGroup === "tone"}
        preferences={tone}
        title={tasteStrings.groups.tone}
      />
      <FactorGroup
        adjustmentValues={adjustments.axes}
        animateReveal={animateReveal}
        factorRevealReady={factorRevealReady}
        id="art"
        onReset={() => onReset("art")}
        onAdjustment={(factorId, value) => onAdjustment("axis", factorId, value)}
        onOpenChange={(open) => setGroupOpen("art", open)}
        open={openGroup === "art"}
        preferences={art}
        title={tasteStrings.groups.art}
      />
    </div>
  );
}

function ConfidenceCoachSummary() {
  return (
    <section
      aria-labelledby="taste-coach-heading"
      className="taste-coach-banner mt-[var(--space-shelf)] flex flex-wrap items-center justify-between gap-[var(--space-5)] rounded-[var(--radius-card)] border border-accent/30 bg-surface-1 p-[var(--space-6)]"
    >
      <div className="grid gap-[var(--space-2)]">
        <h2
          className="text-[length:var(--text-subheading-size)] text-text-strong"
          id="taste-coach-heading"
        >
          {tasteStrings.coach.heading}
        </h2>
        <p className="text-[length:var(--font-size-14)] text-text-muted">
          {tasteStrings.coach.description}
        </p>
      </div>
      <Link
        className={buttonClassName({ className: "px-[var(--space-6)]" })}
        preload={false}
        to="/onboarding"
      >
        {tasteStrings.coach.action}
      </Link>
    </section>
  );
}

type RecentFeedbackSummaryProps = Readonly<{
  records: readonly UserWorkRecord[];
  worksById: ReadonlyMap<string, Work>;
  showAddWorksLink: boolean;
}>;

const RECENT_FEEDBACK_LIMIT = 12;

function RecentFeedbackSummary({
  records,
  worksById,
  showAddWorksLink,
}: RecentFeedbackSummaryProps) {
  const items = [...records]
    .sort(
      (left, right) =>
        right.updatedAt.localeCompare(left.updatedAt) || left.workId.localeCompare(right.workId),
    )
    .flatMap((record) => {
      const work = worksById.get(record.workId);
      return work === undefined ? [] : [{ record, work }];
    })
    .slice(0, RECENT_FEEDBACK_LIMIT);

  // Group by status so a shared label such as 「好き」 is written once above its covers.
  const groups = new Map<string, { record: UserWorkRecord; work: Work; reason?: string }[]>();
  for (const { record, work } of items) {
    const status =
      record.reaction !== undefined
        ? tasteStrings.feedbackLabels[record.reaction]
        : tasteStrings.readingStateLabels[record.readingState];
    const reason = [...(record.negativeReasons ?? []), ...(record.droppedReasons ?? [])].find(
      (candidate) => !isExternalNegativeReason(candidate),
    );
    const entry = {
      record,
      work,
      ...(reason === undefined ? {} : { reason: tasteStrings.negativeReasonLabels[reason] }),
    };
    const group = groups.get(status);
    if (group === undefined) groups.set(status, [entry]);
    else group.push(entry);
  }

  return items.length === 0 ? null : (
    <section
      aria-labelledby="taste-negative-heading"
      className="taste-negative-summary mt-[var(--space-shelf-group)] grid gap-[var(--space-3)]"
    >
      <header className="flex flex-wrap items-center justify-between gap-x-[var(--space-6)]">
        <h2
          className="text-[length:var(--text-subheading-size)] leading-snug font-bold text-text-strong"
          id="taste-negative-heading"
        >
          {tasteStrings.recentFeedbackHeading}
        </h2>
        <span className="flex flex-wrap items-center gap-x-[var(--space-6)]">
          <Link className={summaryLinkClassName} preload={false} to="/library">
            {tasteStrings.openLibrary}
          </Link>
          {showAddWorksLink ? (
            <Link
              className={cn("taste-add-link", summaryLinkClassName)}
              preload={false}
              to="/onboarding"
            >
              {tasteStrings.addWorks}
            </Link>
          ) : null}
        </span>
      </header>
      <ul className="m-0 flex list-none flex-wrap gap-x-[var(--space-8)] gap-y-[var(--space-4)] p-0">
        {[...groups].map(([status, entries]) => (
          <li className="grid content-start gap-[var(--space-2)]" key={status}>
            <span className="text-[length:var(--text-caption-size)] font-bold text-text-muted">
              {status}
            </span>
            <ul
              aria-label={status}
              className="m-0 flex list-none flex-wrap gap-[var(--space-3)] p-0"
            >
              {entries.map(({ reason, work }) => (
                <li className="min-w-0 max-w-full" key={work.id}>
                  <Link
                    aria-label={mediaStrings.openDetails(work.title)}
                    className="inline-flex min-h-[var(--control-min-size)] max-w-full flex-wrap items-center gap-x-[var(--space-2)] rounded-[var(--radius-pill)] border border-line bg-surface-2 px-[var(--space-4)] py-[var(--space-2)] text-[length:var(--font-size-14)] text-text transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [@media(hover:hover)_and_(pointer:fine)]:hover:bg-surface-3"
                    params={{ workId: work.id }}
                    preload={false}
                    to="/works/$workId"
                  >
                    <span className="line-clamp-2 break-words font-medium">{work.title}</span>
                    {reason === undefined ? null : (
                      <span className="truncate text-[length:var(--text-caption-size)] text-text-muted">
                        {reason}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function TasteFlow({
  group,
  mode = "summary",
  onGroupChange,
  onRevealConsumed,
  reveal,
}: Readonly<{
  group?: CoverageGroup;
  mode?: TasteMode;
  onGroupChange?: (group: CoverageGroup | undefined) => void;
  onModeChange?: (mode: TasteMode) => void;
  onRevealConsumed?: () => void;
  reveal?: "1";
}>) {
  const reducedMotion = useLiveReducedMotion();
  const catalog = useCatalog();
  const {
    adjustments: storedAdjustments,
    getProviderCache,
    onboardingCompletedAt,
    policies: storedPolicies,
    saveProviderCache,
    saveProfileAdjustments,
    status,
    userWorks,
  } = usePersistence();
  const [revealExperience, setRevealExperience] = useState<RevealExperience | null>(null);
  const [factorRevealReady, setFactorRevealReady] = useState(false);
  const [localAdjustments, setLocalAdjustments] = useState<ProfileAdjustments | null>(null);
  const [baselineAdjustments, setBaselineAdjustments] = useState<ProfileAdjustments | null>(null);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const messageTimer = useRef<number | null>(null);
  const snackbarRef = useRef<HTMLParagraphElement>(null);
  const keepFocusAboveSnackbar = useCallback(() => {
    const snackbar = snackbarRef.current;
    const focused = document.activeElement;
    if (
      !snackbar?.textContent ||
      !(focused instanceof HTMLElement) ||
      !focused.closest(".taste-page")
    )
      return;
    const target = focused.closest("label") ?? focused;
    const targetRect = target.getBoundingClientRect();
    const snackbarRect = snackbar.getBoundingClientRect();
    if (
      targetRect.bottom > snackbarRect.top &&
      targetRect.top < snackbarRect.bottom &&
      targetRect.right > snackbarRect.left &&
      targetRect.left < snackbarRect.right
    ) {
      target.scrollIntoView?.({ block: "center", inline: "nearest" });
    }
  }, []);
  useEffect(keepFocusAboveSnackbar, [keepFocusAboveSnackbar, message]);
  const saveSequence = useRef(0);
  const revealDecision = useRef<RevealExperience | null>(null);
  const revealQueryConsumedRef = useRef(false);
  const [revealRequestedAtMount] = useState(() => reveal === "1");
  const revealRequestedAtMountRef = useRef(revealRequestedAtMount);
  const pageEntryMotion = usePageEntryMotion({
    enabled: !revealRequestedAtMount,
    identity: "taste",
  });
  const records = userWorks ?? EMPTY_RECORDS;
  const adjustments = localAdjustments ?? storedAdjustments ?? EMPTY_ADJUSTMENTS;
  const preview = useTastePreview(records, adjustments, baselineAdjustments, storedPolicies);
  const displayCatalog = useMemo(() => {
    const result = preview.result?.catalog;
    if (result === undefined) return catalog;
    return {
      ...catalog,
      works: [
        ...new Map([...catalog.works, ...result.works].map((work) => [work.id, work])).values(),
      ],
      volumes: [
        ...new Map(
          [...catalog.volumes, ...result.volumes].map((volume) => [volume.id, volume]),
        ).values(),
      ],
      representativeVolumeByWorkId: {
        ...catalog.representativeVolumeByWorkId,
        ...result.representativeVolumeByWorkId,
      },
    };
  }, [catalog, preview.result]);
  const worksById = useMemo(
    () => new Map(displayCatalog.works.map((work) => [work.id, work] as const)),
    [displayCatalog.works],
  );
  const catalogRecords = useMemo(
    () => records.filter((record) => worksById.has(record.workId)),
    [records, worksById],
  );
  const profileRecords = useMemo(
    () => recommendationProfileRecords(catalogRecords, catalog.works),
    [catalog.works, catalogRecords],
  );
  const hasProfile = useMemo(
    () => hasCatalogBackedProfile(userWorks, catalog.works),
    [catalog.works, userWorks],
  );
  const summary = useMemo(
    () => summarizeMangaDna(catalog.works, profileRecords),
    [catalog.works, profileRecords],
  );
  const anchors = useMemo(() => {
    const positiveWorks = positiveAnchorWorks(profileRecords, worksById);
    const positiveWorksById = new Map(positiveWorks.map((work) => [work.id, work] as const));
    const seen = new Set<string>();
    return [
      ...summary.topPreferences.flatMap((preference) => preference.anchorWorkIds),
      ...positiveWorks.map((work) => work.id),
    ]
      .flatMap((workId): Work[] => {
        const work = positiveWorksById.get(workId);
        if (work === undefined || seen.has(workId)) return [];
        seen.add(workId);
        return [work];
      })
      .slice(0, 5);
  }, [profileRecords, summary.topPreferences, worksById]);
  const anchorEvidenceLabels = useMemo(() => {
    const labels = new Map<string, string>();
    for (const preference of summary.topPreferences) {
      for (const workId of preference.anchorWorkIds) {
        if (!labels.has(workId)) labels.set(workId, factorLabel(preference.factorId));
      }
    }
    for (const record of profileRecords) {
      if (labels.has(record.workId) || record.reaction === undefined) continue;
      labels.set(record.workId, tasteStrings.feedbackLabels[record.reaction]);
    }
    return labels;
  }, [profileRecords, summary.topPreferences]);
  const confidenceLevel = getConfidenceLevel(calculateProfileConfidence(profileRecords));
  const revealCtaRef = usePointerEffect<HTMLAnchorElement>("magnet");
  // The analysed work count is a real integer, so the reveal may count it up (04 §5.2).
  const basisDisplayCount = useCountUp(profileRecords.length, revealExperience?.animate === true);
  const reactionBreakdown = (["favorite", "liked", "neutral", "disliked"] as const).flatMap(
    (reaction) => {
      const count = profileRecords.filter((record) => record.reaction === reaction).length;
      return count === 0
        ? []
        : [tasteStrings.basisReactionCount(tasteStrings.feedbackLabels[reaction], count)];
    },
  );
  const beforePreviewWorkIds = useMemo(
    () => preview.result?.before.map((entry) => entry.workId) ?? null,
    [preview.result],
  );
  const afterPreviewEntries = preview.result?.after ?? null;
  const afterPreviewWorkIds = useMemo(
    () => afterPreviewEntries?.map((entry) => entry.workId) ?? null,
    [afterPreviewEntries],
  );
  const coverTargets = useMemo(
    () =>
      createRecommendationCoverTargets(displayCatalog, [
        ...new Set([
          ...anchors.map((work) => work.id),
          ...(beforePreviewWorkIds ?? []),
          ...(afterPreviewWorkIds ?? []),
        ]),
      ]),
    [afterPreviewWorkIds, anchors, beforePreviewWorkIds, displayCatalog],
  );
  const { coverUrls, requestCover } = useRecommendationCovers({
    targets: coverTargets,
    getProviderCache,
    saveProviderCache,
  });
  useEffect(() => {
    if (baselineAdjustments !== null || storedAdjustments === undefined) return;
    let active = true;
    window.queueMicrotask(() => {
      if (!active) return;
      setBaselineAdjustments({
        axes: { ...storedAdjustments.axes },
        themes: { ...storedAdjustments.themes },
      });
    });
    return () => {
      active = false;
    };
  }, [baselineAdjustments, storedAdjustments]);

  useEffect(() => {
    if (!revealRequestedAtMountRef.current || revealQueryConsumedRef.current) return;

    revealQueryConsumedRef.current = true;
    onRevealConsumed?.();
  }, [onRevealConsumed]);

  useEffect(() => {
    let active = true;
    const commitRevealExperience = (experience: RevealExperience) => {
      window.queueMicrotask(() => {
        if (active) setRevealExperience(experience);
      });
    };

    if (onboardingCompletedAt === undefined) {
      return () => {
        active = false;
      };
    }

    if (revealDecision.current === null && !revealRequestedAtMountRef.current) {
      revealDecision.current = { entry: false, animate: false };
    } else if (revealDecision.current === null) {
      const completionIdentity = onboardingCompletedAt ?? "legacy-profile";
      const claim = claimDnaReveal(completionIdentity);
      revealDecision.current =
        claim === "consumed"
          ? { entry: false, animate: false }
          : {
              entry: true,
              animate: claim === "claimed" && reducedMotion === false,
            };
    }

    let decision = revealDecision.current;
    if (decision.animate && reducedMotion !== false) {
      decision = { ...decision, animate: false };
      revealDecision.current = decision;
    }
    commitRevealExperience(decision);

    return () => {
      active = false;
    };
  }, [onboardingCompletedAt, reducedMotion]);

  useEffect(() => {
    if (revealExperience?.animate !== true) {
      return;
    }

    const timer = window.setTimeout(() => setFactorRevealReady(true), 1200);
    return () => window.clearTimeout(timer);
  }, [revealExperience?.animate]);

  useEffect(
    () => () => {
      if (messageTimer.current !== null) window.clearTimeout(messageTimer.current);
    },
    [],
  );

  const persistAdjustments = useCallback(
    (next: ProfileAdjustments, successMessage: string) => {
      const before = localAdjustments ?? storedAdjustments ?? EMPTY_ADJUSTMENTS;
      const sequence = ++saveSequence.current;
      setLocalAdjustments(next);
      setErrorMessage("");
      void saveProfileAdjustments(next).then(
        () => {
          if (saveSequence.current !== sequence) return;
          setMessage(successMessage);
          if (messageTimer.current !== null) window.clearTimeout(messageTimer.current);
          messageTimer.current = window.setTimeout(() => setMessage(""), 2400);
        },
        () => {
          if (saveSequence.current !== sequence) return;
          setLocalAdjustments(before);
          setErrorMessage(tasteStrings.saveError);
        },
      );
    },
    [localAdjustments, saveProfileAdjustments, storedAdjustments],
  );
  const updateAdjustment = useCallback(
    (kind: "axis" | "theme", factorId: AxisId | ThemeTag, preference: AdjustmentPreference) => {
      const next: ProfileAdjustments =
        kind === "axis"
          ? { ...adjustments, axes: { ...adjustments.axes, [factorId]: preference } }
          : { ...adjustments, themes: { ...adjustments.themes, [factorId]: preference } };
      persistAdjustments(
        next,
        tasteStrings.adjustmentSaved(
          factorLabel(factorId),
          tasteStrings.adjustmentLabels[preference],
        ),
      );
    },
    [adjustments, persistAdjustments],
  );
  const resetAdjustments = useCallback(
    (group?: AdjustmentGroup) => {
      const next: ProfileAdjustments = {
        axes: { ...adjustments.axes },
        themes: { ...adjustments.themes },
      };
      if (group === undefined) {
        next.axes = {};
        next.themes = {};
      } else if (group === "theme") {
        next.themes = {};
      } else {
        const ids =
          group === "narrative"
            ? NARRATIVE_AXIS_IDS
            : group === "tone"
              ? TONE_AXIS_IDS
              : ART_AXIS_IDS;
        for (const id of ids) delete next.axes[id];
      }
      persistAdjustments(
        next,
        group === undefined
          ? tasteStrings.resetAllSaved
          : tasteStrings.resetGroupSaved(tasteStrings.groups[group]),
      );
    },
    [adjustments, persistAdjustments],
  );
  const hasManualAdjustments = [
    ...Object.values(adjustments.axes),
    ...Object.values(adjustments.themes),
  ].some((value) => value !== undefined && value !== "auto");

  if (
    status.state === "initializing" ||
    onboardingCompletedAt === undefined ||
    userWorks === undefined ||
    storedAdjustments === undefined ||
    storedPolicies === undefined ||
    baselineAdjustments === null ||
    hasProfile !== true ||
    revealExperience === null
  ) {
    return (
      <main className="taste-page taste-page--loading mx-auto grid min-h-dvh w-full max-w-[var(--layout-width-media)] place-items-center px-[var(--layout-page-padding)] py-[var(--layout-page-block-start)] text-text-muted">
        <p aria-live="polite">{tasteStrings.loading}</p>
      </main>
    );
  }

  // Reduced-motion reveal: the same order as opacity steps, 80ms apart (04 §5.2).
  const revealFadeStep = (step: number) =>
    revealExperience.entry && reducedMotion === true
      ? ({
          "data-reduced-motion": "fade",
          "data-reduced-motion-enter": "",
          style: { "--reduced-motion-delay": `${String(step * 80)}ms` } as CSSProperties,
        } as const)
      : {};

  return (
    <LazyMotion features={domAnimation} strict>
      <main
        className={cn(
          "taste-page mx-auto min-h-dvh w-full max-w-[var(--layout-width-media)] px-[var(--layout-page-padding)] pt-[var(--layout-page-block-start)] text-text",
          revealExperience.entry &&
            "taste-page--with-action pb-[var(--layout-taste-action-clearance)]",
          !revealExperience.entry &&
            pageEntryMotion.active &&
            "page-entry-b motion-safe:animate-[page-entry-b-enter_var(--motion-duration-page)_var(--motion-ease-direct)_both]",
        )}
        onAnimationEnd={pageEntryMotion.onAnimationEnd}
        {...pageEntryFadeProps(pageEntryMotion.variant)}
        onFocus={keepFocusAboveSnackbar}
      >
        <PageHeader
          action={
            <DnaShareButton
              ready={preview.ready}
              recommendations={afterPreviewEntries ?? EMPTY_PREVIEW_ENTRIES}
              summary={summary}
              worksById={worksById}
            />
          }
          className="taste-header mb-[var(--space-8)]"
          title={tasteStrings.title}
        >
          <p className="mt-[var(--space-2)] text-[length:var(--font-size-14)] text-text-muted">
            {tasteStrings.description}
          </p>
          <section aria-label={tasteStrings.basisHeading}>
            <p className="text-[length:var(--font-size-14)] leading-relaxed text-text-muted">
              <span aria-hidden="true">
                {tasteStrings.basisCount(basisDisplayCount, reactionBreakdown)}
              </span>
              <span className="sr-only">
                {tasteStrings.basisCount(profileRecords.length, reactionBreakdown)}
              </span>
              <span aria-hidden="true"> · </span>
              <span className="taste-confidence inline-flex items-center gap-[var(--space-2)]">
                {tasteStrings.confidence}: {tasteStrings.confidenceLabels[confidenceLevel]}
                <span aria-hidden="true" className="inline-flex gap-[var(--space-1)]">
                  {[0, 1, 2].map((index) => (
                    <span
                      className={cn(
                        "size-1.5 rounded-full",
                        index <
                          (confidenceLevel === "high" ? 3 : confidenceLevel === "normal" ? 2 : 1)
                          ? "bg-accent"
                          : "bg-surface-3",
                      )}
                      key={index}
                    />
                  ))}
                </span>
              </span>
            </p>
          </section>
        </PageHeader>

        <div className="taste-overview" {...revealFadeStep(1)}>
          <DnaWheel
            animateReveal={revealExperience.animate}
            summary={summary}
            worksById={worksById}
          />
        </div>

        {status.state === "degraded" ? (
          <p
            className="taste-alert mb-[var(--space-4)] border-l-[length:var(--space-1)] border-warn bg-surface-1 px-[var(--space-4)] py-[var(--space-3)]"
            role="status"
          >
            {tasteStrings.storageWarning}
          </p>
        ) : null}
        {errorMessage ? (
          <p
            className="taste-alert mb-[var(--space-4)] border-l-[length:var(--space-1)] border-warn bg-surface-1 px-[var(--space-4)] py-[var(--space-3)]"
            role="alert"
          >
            {errorMessage}
          </p>
        ) : null}

        <div className="mt-[var(--space-shelf)]" {...revealFadeStep(0)}>
          <AnchorStrip
            anchors={anchors}
            animateReveal={revealExperience.animate}
            coverUrls={coverUrls}
            evidenceLabels={anchorEvidenceLabels}
            onCoverVisible={requestCover}
          />
        </div>

        {confidenceLevel !== "normal" || revealExperience.entry ? null : <ConfidenceCoachSummary />}

        <div className="taste-workspace-layout mt-[var(--space-shelf-group)] grid items-start gap-[var(--space-shelf-group)]">
          <section
            aria-labelledby="taste-workspace-heading"
            className="taste-workspace grid gap-[var(--space-3)]"
            data-taste-mode={mode}
          >
            <header className="taste-workspace__header grid gap-[var(--space-1)]">
              <div className="flex items-center gap-[var(--space-2)]">
                <h2
                  className="text-[length:var(--text-subheading-size)] text-text-strong"
                  id="taste-workspace-heading"
                >
                  {tasteStrings.workspaceHeading}
                </h2>
                <AdjustmentResetButton
                  disabled={!hasManualAdjustments}
                  label={tasteStrings.resetAll}
                  onReset={() => resetAdjustments()}
                />
              </div>
              <p className="text-[length:var(--text-caption-size)] text-text-muted">
                {tasteStrings.modeDescriptions.adjust}
              </p>
            </header>

            <FactorPanels
              adjustments={adjustments}
              animateReveal={revealExperience.animate}
              factorRevealReady={factorRevealReady}
              group={group}
              onAdjustment={updateAdjustment}
              onReset={resetAdjustments}
              onGroupChange={onGroupChange}
              summary={summary}
            />
          </section>

          <RecommendationDiffPreview
            loading={preview.loading}
            failed={preview.error}
            onRetry={preview.retry}
            after={afterPreviewWorkIds}
            before={beforePreviewWorkIds}
            coverUrls={coverUrls}
            onCoverVisible={requestCover}
            worksById={worksById}
          />
        </div>

        <RecentFeedbackSummary
          records={catalogRecords}
          showAddWorksLink={confidenceLevel !== "normal" || revealExperience.entry}
          worksById={worksById}
        />
        {revealExperience.entry ? (
          // A full-width bar on every viewport, so the CTA never floats over the axis list.
          <div className="taste-reveal-cta fixed inset-x-0 bottom-[var(--layout-mobile-navigation-clearance)] z-25 border-t border-line bg-surface-1 px-[var(--layout-page-padding)] py-2.5 md:bottom-0">
            <div className="mx-auto flex w-full max-w-[calc(var(--layout-width-media)-var(--layout-page-padding)*2)] justify-center md:justify-end">
              <Link
                className={buttonClassName({
                  className:
                    "pointer-magnet relative isolate min-h-12 w-full max-w-[calc(var(--control-min-size)*11)] px-[var(--space-5)] py-[var(--space-3)] font-bold md:w-80",
                })}
                preload={false}
                ref={revealCtaRef}
                to="/recommendations"
              >
                {tasteStrings.recommendations}
                <span
                  aria-hidden="true"
                  className="cta-star-border"
                  data-animate={revealExperience.animate ? "true" : undefined}
                >
                  <span className="cta-star-border__light" />
                </span>
              </Link>
            </div>
          </div>
        ) : null}
        <p
          aria-atomic="true"
          aria-live="polite"
          className="taste-snackbar fixed right-[var(--layout-page-padding)] bottom-[calc(var(--layout-mobile-navigation-clearance)+var(--space-12)+var(--space-7))] z-40 max-w-[min(360px,calc(100vw-(var(--layout-page-padding)*2)))] rounded-[var(--radius-card)] border border-l-[length:var(--space-1)] border-line border-l-accent bg-surface-1 px-[var(--space-4)] py-[var(--space-3)] font-bold shadow-[var(--shadow-raised)] empty:hidden md:bottom-[calc(var(--layout-page-padding)+var(--control-min-size)+var(--space-5))]"
          ref={snackbarRef}
        >
          {message}
        </p>
      </main>
    </LazyMotion>
  );
}
