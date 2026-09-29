"use client";

import { Link } from "@tanstack/react-router";
import { ChevronDownIcon } from "lucide-react";
import { LazyMotion, domAnimation, m, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Button, buttonClassName } from "@/components/design-system/button";
import { PageHeader } from "@/components/layout/page-header";
import { SummarySection, summaryLinkClassName } from "@/components/layout/summary-section";
import { CoverImage } from "@/components/cover/CoverImage";
import { MediaShelf } from "@/components/media/media-shelf";
import { usePageEntryMotion } from "@/components/motion/use-page-entry-motion";
import recommendationContextJson from "@/data/generated/recommendation-context-v1.json";
import { ART_AXIS_IDS, NARRATIVE_AXIS_IDS, TONE_AXIS_IDS } from "@/domain/catalog/constants";
import type { AxisId, CatalogV1, CoverageGroup, ThemeTag, Work } from "@/domain/catalog/types";
import type { ExplanationFactorId } from "@/domain/explanation";
import {
  hasCatalogBackedProfile,
  recommendationProfileRecords,
} from "@/domain/profile/catalog-profile";
import {
  summarizeMangaDna,
  type DnaPreference,
  type DnaTopPreference,
  type MangaDnaSummary,
} from "@/domain/profile/dna-summary";
import { calculateProfileConfidence, getConfidenceLevel } from "@/domain/profile/confidence";
import type {
  AdjustmentPreference,
  ProfileAdjustments,
  RecommendationPolicies,
  UserWorkRecord,
} from "@/domain/profile/types";
import { isExternalNegativeReason } from "@/domain/profile/constants";
import { recommendationContextSchema } from "@/domain/recommendation/context-schema";
import {
  buildRecommendationPlan,
  selectRecommendationPlanEntries,
} from "@/domain/recommendation/rank";
import { useCatalog } from "@/features/catalog/catalog-provider";
import {
  createRecommendationCoverTargets,
  useRecommendationCovers,
} from "@/features/recommendations/recommendation-cover-resolver";
import { usePersistence } from "@/infrastructure/db";
import { explanationLexicon, mediaStrings, tasteStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

import { AdjustmentRadiogroup } from "./adjustment-radiogroup";
import { FactorBar } from "@/components/media/factor-bar";
import { DnaAxesOverview, RecommendationDiffPreview } from "./taste-insights";

const DNA_REVEAL_MARKER = "konocomics:manga-dna-reveal:v1";
const EMPTY_RECORDS: readonly UserWorkRecord[] = [];
const EMPTY_ADJUSTMENTS: ProfileAdjustments = { axes: {}, themes: {} };
const NARRATIVE_IDS = new Set<AxisId>(NARRATIVE_AXIS_IDS);
const TONE_IDS = new Set<AxisId>(TONE_AXIS_IDS);
const ART_IDS = new Set<AxisId>(ART_AXIS_IDS);
const parsedRecommendationContext =
  recommendationContextSchema.safeParse(recommendationContextJson);

function recommendationPreviewWorkIds(
  catalog: CatalogV1,
  records: readonly UserWorkRecord[],
  adjustments: ProfileAdjustments,
  policies: RecommendationPolicies,
) {
  if (!parsedRecommendationContext.success) return null;

  try {
    const plan = buildRecommendationPlan({
      catalog,
      records: [...records],
      adjustments,
      policies,
      context: parsedRecommendationContext.data,
    });
    return selectRecommendationPlanEntries(plan, policies)
      .slice(0, 4)
      .map((entry) => entry.workId);
  } catch {
    return null;
  }
}

type RevealExperience = Readonly<{
  entry: boolean;
  animate: boolean;
}>;

type RevealClaim = "claimed" | "consumed" | "unavailable";

function useLiveReducedMotion() {
  const initialPreference = useReducedMotion();
  const [livePreference, setLivePreference] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (typeof mediaQuery.addEventListener !== "function") return;
    const handleChange = (event: MediaQueryListEvent) => setLivePreference(event.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return livePreference ?? initialPreference;
}

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
  const shelf = (
    <MediaShelf
      className="taste-anchor-strip min-w-0"
      compactHeading
      listType="unordered"
      title={tasteStrings.anchorsHeading}
      trackClassName="!pb-[var(--space-1)]"
    >
      {anchors.map((work) => (
        <li
          className="w-[calc((100vw-(var(--layout-page-padding)*2)-(var(--space-content-loose)*2))/2.4)] max-w-44 shrink-0 snap-start sm:w-32 md:w-[calc((100%-var(--space-content-loose)*7)/8)] md:min-w-28 md:max-w-32"
          key={work.id}
        >
          <Link
            aria-label={mediaStrings.openDetails(work.title)}
            className="group/evidence grid min-h-[var(--control-min-size)] gap-[var(--space-2)] rounded-[var(--radius-cover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            params={{ workId: work.id }}
            preload={false}
            to="/works/$workId"
          >
            <CoverImage
              className="taste-anchor-cover aspect-[30/43] w-full overflow-hidden rounded-[var(--radius-cover)] border border-line/60"
              coverUrl={coverUrls.get(work.id)}
              creators={work.creators}
              decorative
              onVisible={() => onCoverVisible(work.id)}
              requestedSize={200}
              title={work.title}
            />
            <span className="grid min-w-0 gap-[var(--space-content-tight)]">
              <strong className="line-clamp-2 min-h-[2.5em] text-[length:var(--font-size-14)] leading-tight text-text-strong">
                {work.title}
              </strong>
              <span className="truncate text-[length:var(--text-caption-size)] text-text-muted">
                {evidenceLabels.get(work.id)}
              </span>
            </span>
          </Link>
        </li>
      ))}
    </MediaShelf>
  );

  return animateReveal ? (
    <m.div
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
    >
      {shelf}
    </m.div>
  ) : (
    shelf
  );
}

type TopPreferenceCardProps = Readonly<{
  preference: DnaTopPreference;
  worksById: ReadonlyMap<string, Work>;
  index: number;
  animateReveal: boolean;
}>;

function TopPreferenceCard({
  preference,
  worksById,
  index,
  animateReveal,
}: TopPreferenceCardProps) {
  const evidenceWorks = preference.anchorWorkIds.flatMap((workId): Work[] => {
    const work = worksById.get(workId);
    return work === undefined ? [] : [work];
  });
  const label = factorLabel(preference.factorId);
  const cardClassName =
    "taste-top-card grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-baseline gap-x-[var(--space-3)] gap-y-[var(--space-content-tight)] border-t border-line/70 py-[var(--space-3)] text-left";

  const content = (
    <>
      <span className="taste-top-card__rank font-display text-[length:var(--text-subheading-size)] leading-none text-text-muted tabular-nums">
        {String(index + 1)}
      </span>
      <h3
        className={cn(
          "relative min-w-0 line-clamp-2 text-[length:var(--font-size-16)] leading-tight font-bold text-text-strong",
          animateReveal &&
            "taste-top-card__label--reveal after:absolute after:right-0 after:-bottom-[3px] after:left-0 after:h-0.5 after:origin-left after:scale-x-0 after:bg-accent after:content-[''] motion-safe:after:animate-[taste-underline-reveal_300ms_500ms_ease-out_forwards]",
          animateReveal && index === 1 && "after:[animation-delay:680ms]",
          animateReveal && index === 2 && "after:[animation-delay:860ms]",
        )}
      >
        {label}
      </h3>
      <strong className="taste-top-card__level shrink-0 whitespace-nowrap text-[length:var(--font-size-14)] font-bold text-accent">
        {tasteStrings.factorValue(preference.value)}
      </strong>
      <p className="col-span-2 col-start-2 line-clamp-2 text-[length:var(--text-caption-size)] leading-[var(--line-height-body)] text-text-muted">
        {tasteStrings.topPreferenceEvidence(evidenceWorks.map((work) => work.title))}
      </p>
    </>
  );

  return animateReveal ? (
    <m.article
      animate={{ opacity: 1, y: 0 }}
      className={cardClassName}
      initial={{ opacity: 0, y: 8 }}
      transition={{ delay: 0.5 + index * 0.18, duration: 0.4, ease: [0.2, 0, 0, 1] }}
    >
      {content}
    </m.article>
  ) : (
    <article className={cardClassName}>{content}</article>
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
      className="taste-factor-group m-0 h-fit min-w-0 border-t border-line/70 pt-[var(--space-3)]"
    >
      <header className="grid grid-cols-1 items-center gap-[var(--space-3)] py-[var(--space-content)] sm:grid-cols-[minmax(0,1fr)_auto]">
        <span className="min-w-0">
          <h3 className="text-[length:var(--font-size-16)] tracking-tight" id={`taste-group-${id}`}>
            {title}
          </h3>
          <span className="mt-[var(--space-content-tight)] line-clamp-2 block text-[length:var(--font-size-12)] leading-[var(--line-height-body)] text-text-muted">
            {summarizeGroupPreferences(preferences)}
          </span>
        </span>
        <span className="flex min-w-0 flex-wrap items-center justify-between gap-[var(--space-content)] sm:flex-nowrap sm:justify-end">
          <span className="whitespace-nowrap text-[length:var(--font-size-12)] font-bold text-text-muted">
            {settingSummary}
          </span>
          <Button
            aria-controls={detailsId}
            aria-expanded={open}
            aria-label={
              isAnalysisOnly
                ? tasteStrings.groupAnalysisDetailsLabel(title, open)
                : tasteStrings.groupDetailsLabel(title, open)
            }
            className="shrink-0 gap-[var(--space-content-tight)] px-[var(--space-2)] text-[length:var(--font-size-12)] font-bold text-text-strong"
            onClick={() => onOpenChange(!open)}
            type="button"
            variant="ghost"
          >
            {open
              ? tasteStrings.groupClose
              : isAnalysisOnly
                ? tasteStrings.groupAnalysisDetails
                : tasteStrings.groupDetails}
            <ChevronDownIcon
              aria-hidden="true"
              className={cn(
                "size-[var(--space-4)] transition-transform duration-[var(--motion-duration-feedback)] motion-reduce:transition-none",
                open && "rotate-180",
              )}
            />
          </Button>
        </span>
      </header>
      <div
        className={cn(
          "taste-factor-group__details taste-factor-group__rows grid px-0 pb-[var(--space-3)]",
          isAnalysisOnly
            ? "taste-factor-group__rows--analysis grid-cols-1 md:grid-cols-2 md:gap-x-[var(--space-4)]"
            : "grid-cols-1",
        )}
        hidden={!open}
        id={detailsId}
      >
        {isAnalysisOnly ? null : (
          <div
            aria-hidden="true"
            className="taste-factor-group__column-headings sticky top-[var(--desktop-navigation-height)] z-10 hidden grid-cols-[minmax(12rem,0.75fr)_minmax(0,1.25fr)] items-center gap-[var(--space-content)] border-b border-line/70 bg-canvas py-[var(--space-content)] text-[length:var(--font-size-12)] font-bold text-text-muted md:grid"
          >
            <span>{tasteStrings.analysisColumnHeading}</span>
            <span className="taste-factor-group__column-adjustment border-l border-line pl-[var(--space-content-loose)]">
              {tasteStrings.adjustmentColumnHeading}
            </span>
          </div>
        )}
        {visiblePreferences.map((preference, index) => {
          const label = factorLabel(preference.factorId);
          return (
            <div
              className={cn(
                "taste-factor-row min-w-0 border-b border-line py-[var(--space-content-tight)]",
                isAnalysisOnly
                  ? "taste-factor-row--analysis grid gap-[var(--space-content-tight)] last:border-b-0 md:[&:nth-last-child(-n+2)]:border-b-0"
                  : "grid gap-[var(--space-content-tight)] last:border-b-0 md:grid-cols-[minmax(12rem,0.75fr)_minmax(0,1.25fr)] md:items-center md:gap-[var(--space-content)]",
              )}
              key={preference.factorId}
            >
              <FactorBar
                animateReveal={animateReveal}
                revealReady={factorRevealReady}
                label={label}
                revealDelay={index * 0.06}
                state={preference.state}
                value={preference.value}
              />
              {adjustmentValues === undefined || onAdjustment === undefined ? null : (
                <div className="taste-factor-row__adjustment grid min-w-0 gap-[var(--space-content-tight)] md:border-l md:border-line md:pl-[var(--space-content-loose)]">
                  <span
                    aria-hidden="true"
                    className="taste-factor-row__adjustment-label text-[length:var(--font-size-12)] font-bold text-text-muted md:hidden"
                  >
                    {tasteStrings.adjustmentColumnHeading}
                  </span>
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
        {canCollapse ? (
          <Button
            aria-controls={detailsId}
            aria-expanded={showAll}
            aria-label={tasteStrings.groupShowAllLabel(title, orderedPreferences.length, showAll)}
            className="mt-[var(--space-2)] w-fit gap-[var(--space-content-tight)] px-[var(--space-2)] text-[length:var(--font-size-12)] font-bold text-text-strong"
            onClick={() => {
              if (showAll) setPinnedIds(adjustedIds());
              setShowAll(!showAll);
            }}
            type="button"
            variant="ghost"
          >
            {showAll
              ? tasteStrings.groupShowFewer
              : tasteStrings.groupShowAll(orderedPreferences.length)}
            <ChevronDownIcon
              aria-hidden="true"
              className={cn(
                "size-[var(--space-4)] transition-transform duration-[var(--motion-duration-feedback)] motion-reduce:transition-none",
                showAll && "rotate-180",
              )}
            />
          </Button>
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
    <div className="taste-factor-grid grid grid-cols-1 items-start gap-[var(--space-3)]">
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
    <SummarySection
      actions={
        <Link className={summaryLinkClassName} preload={false} to="/onboarding">
          {tasteStrings.coach.action}
        </Link>
      }
      headingId="taste-coach-heading"
      title={tasteStrings.coach.heading}
    >
      <p className="text-[length:var(--font-size-14)] text-text-muted">
        {tasteStrings.coach.description}
      </p>
    </SummarySection>
  );
}

type RecentFeedbackSummaryProps = Readonly<{
  records: readonly UserWorkRecord[];
  worksById: ReadonlyMap<string, Work>;
  coverUrls: ReadonlyMap<string, string | null>;
  onCoverVisible(workId: string): void;
  showAddWorksLink: boolean;
}>;

const RECENT_FEEDBACK_LIMIT = 12;

function RecentFeedbackSummary({
  records,
  worksById,
  coverUrls,
  onCoverVisible,
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
                <li className="w-16 min-w-0" key={work.id}>
                  <Link
                    aria-label={mediaStrings.openDetails(work.title)}
                    className="grid gap-[var(--space-1)] rounded-[var(--radius-cover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    params={{ workId: work.id }}
                    preload={false}
                    to="/works/$workId"
                  >
                    <CoverImage
                      className="taste-feedback-cover aspect-[30/43] w-full overflow-hidden rounded-[var(--radius-cover)] border border-line/60"
                      coverUrl={coverUrls.get(work.id)}
                      creators={work.creators}
                      decorative
                      onVisible={() => onCoverVisible(work.id)}
                      requestedSize={200}
                      title={work.title}
                    />
                    <span className="truncate text-[length:var(--text-caption-size)] font-bold text-text-strong">
                      {work.title}
                    </span>
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
  const worksById = useMemo(
    () => new Map(catalog.works.map((work) => [work.id, work] as const)),
    [catalog.works],
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
  const reactionBreakdown = (["favorite", "liked", "neutral", "disliked"] as const).flatMap(
    (reaction) => {
      const count = profileRecords.filter((record) => record.reaction === reaction).length;
      return count === 0
        ? []
        : [tasteStrings.basisReactionCount(tasteStrings.feedbackLabels[reaction], count)];
    },
  );
  const beforePreviewWorkIds = useMemo(() => {
    if (baselineAdjustments === null || storedPolicies === undefined) return null;
    return recommendationPreviewWorkIds(catalog, records, baselineAdjustments, storedPolicies);
  }, [baselineAdjustments, catalog, records, storedPolicies]);
  const afterPreviewWorkIds = useMemo(() => {
    if (storedPolicies === undefined) return null;
    return recommendationPreviewWorkIds(catalog, records, adjustments, storedPolicies);
  }, [adjustments, catalog, records, storedPolicies]);
  const recentFeedbackWorkIds = useMemo(
    () =>
      [...catalogRecords]
        .sort(
          (left, right) =>
            right.updatedAt.localeCompare(left.updatedAt) ||
            left.workId.localeCompare(right.workId),
        )
        .slice(0, RECENT_FEEDBACK_LIMIT)
        .map((record) => record.workId),
    [catalogRecords],
  );
  const coverTargets = useMemo(
    () =>
      createRecommendationCoverTargets(catalog, [
        ...new Set([
          ...anchors.map((work) => work.id),
          ...recentFeedbackWorkIds,
          ...(beforePreviewWorkIds ?? []),
          ...(afterPreviewWorkIds ?? []),
        ]),
      ]),
    [afterPreviewWorkIds, anchors, beforePreviewWorkIds, catalog, recentFeedbackWorkIds],
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

  const updateAdjustment = useCallback(
    (kind: "axis" | "theme", factorId: AxisId | ThemeTag, preference: AdjustmentPreference) => {
      const before = localAdjustments ?? storedAdjustments ?? EMPTY_ADJUSTMENTS;
      const next: ProfileAdjustments =
        kind === "axis"
          ? { ...before, axes: { ...before.axes, [factorId]: preference } }
          : { ...before, themes: { ...before.themes, [factorId]: preference } };
      const sequence = saveSequence.current + 1;
      saveSequence.current = sequence;
      setLocalAdjustments(next);
      setErrorMessage("");

      void saveProfileAdjustments(next).then(
        () => {
          if (saveSequence.current !== sequence) return;
          setMessage(
            tasteStrings.adjustmentSaved(
              factorLabel(factorId),
              tasteStrings.adjustmentLabels[preference],
            ),
          );
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

  return (
    <LazyMotion features={domAnimation} strict>
      <main
        className={cn(
          "taste-page mx-auto min-h-dvh w-full max-w-[var(--layout-width-media)] px-[var(--layout-page-padding)] pt-[var(--layout-page-block-start)] pb-[var(--space-shelf-group)] text-text",
          revealExperience.entry &&
            "taste-page--with-action pb-[var(--layout-taste-action-clearance)]",
          !revealExperience.entry &&
            pageEntryMotion.active &&
            "page-entry-b motion-safe:animate-[page-entry-b-enter_var(--motion-duration-page)_var(--motion-ease-direct)_both]",
        )}
        onAnimationEnd={pageEntryMotion.onAnimationEnd}
        onFocus={keepFocusAboveSnackbar}
      >
        <PageHeader
          className="taste-header mb-[var(--space-6)]"
          description={tasteStrings.description}
          title={tasteStrings.title}
        >
          <section aria-label={tasteStrings.basisHeading}>
            <p className="text-[length:var(--font-size-14)] leading-relaxed text-text-muted">
              <span>{tasteStrings.basisCount(profileRecords.length, reactionBreakdown)}</span>
              <span aria-hidden="true"> · </span>
              <span className="taste-confidence">
                {tasteStrings.confidence}: {tasteStrings.confidenceLabels[confidenceLevel]}
              </span>
            </p>
          </section>
        </PageHeader>

        <div className="taste-overview grid items-start gap-[var(--space-shelf)] lg:grid-cols-2 lg:gap-x-[var(--space-12)]">
          <section
            className="taste-top-summary grid content-start gap-[var(--space-3)]"
            aria-labelledby="taste-top-heading"
          >
            <h2 className="text-[length:var(--text-subheading-size)]" id="taste-top-heading">
              {tasteStrings.topPreferencesHeading}
            </h2>
            {summary.topPreferences.length === 0 ? (
              <p className="text-text-muted">{tasteStrings.topPreferencePending}</p>
            ) : (
              <ol className="taste-top-summary__grid m-0 grid list-none grid-cols-1 p-0">
                {summary.topPreferences.map((preference, index) => (
                  <li className="min-w-0" key={`${preference.kind}:${preference.factorId}`}>
                    <TopPreferenceCard
                      animateReveal={revealExperience.animate}
                      index={index}
                      preference={preference}
                      worksById={worksById}
                    />
                  </li>
                ))}
              </ol>
            )}
          </section>
          <DnaAxesOverview
            animateReveal={revealExperience.animate}
            axes={summary.axes}
            revealReady={factorRevealReady}
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

        <div className="mt-[var(--space-shelf-group)]">
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
            <header className="taste-workspace__header flex flex-wrap items-baseline gap-x-[var(--space-3)] gap-y-[var(--space-content-tight)]">
              <h2
                className="text-[length:var(--text-subheading-size)] text-text-strong"
                id="taste-workspace-heading"
              >
                {tasteStrings.workspaceHeading}
              </h2>
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
              onGroupChange={onGroupChange}
              summary={summary}
            />
          </section>

          <RecommendationDiffPreview
            after={afterPreviewWorkIds}
            before={beforePreviewWorkIds}
            coverUrls={coverUrls}
            onCoverVisible={requestCover}
            worksById={worksById}
          />
        </div>

        <RecentFeedbackSummary
          coverUrls={coverUrls}
          onCoverVisible={requestCover}
          records={catalogRecords}
          showAddWorksLink={confidenceLevel !== "normal" || revealExperience.entry}
          worksById={worksById}
        />
        {revealExperience.entry ? (
          <div className="taste-reveal-cta fixed inset-x-0 bottom-[var(--layout-mobile-navigation-clearance)] z-25 border-t border-line bg-surface-1 px-[var(--layout-page-padding)] py-2.5 md:right-[var(--layout-page-padding)] md:bottom-[var(--layout-page-padding)] md:left-auto md:w-80 md:border-0 md:bg-transparent md:p-0">
            <Link
              className={buttonClassName({
                className:
                  "mx-auto min-h-12 w-full max-w-[calc(var(--control-min-size)*11)] px-[var(--space-5)] py-[var(--space-3)] font-bold",
              })}
              preload={false}
              to="/recommendations"
            >
              {tasteStrings.recommendations}
            </Link>
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
