"use client";

import { Link } from "@tanstack/react-router";
import { LazyMotion, domAnimation, m, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Button, buttonClassName } from "@/components/design-system/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/design-system/tabs";
import { CoverImage } from "@/components/cover/CoverImage";
import { SiteFooter } from "@/components/layout/site-footer";
import { MediaShelf } from "@/components/media/media-shelf";
import { usePageEntryMotion } from "@/components/motion/use-page-entry-motion";
import recommendationContextJson from "@/data/generated/recommendation-context-v1.json";
import {
  ART_AXIS_IDS,
  COVERAGE_GROUPS,
  NARRATIVE_AXIS_IDS,
  TONE_AXIS_IDS,
} from "@/domain/catalog/constants";
import type { AxisId, CatalogV1, CoverageGroup, ThemeTag, Work } from "@/domain/catalog/types";
import type { ExplanationFactorId } from "@/domain/explanation";
import { hasCatalogBackedProfile } from "@/domain/profile/catalog-profile";
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
import { tasteStrings, explanationLexicon } from "@/lib/strings";
import { cn } from "@/lib/utils";

import { AdjustmentRadiogroup } from "./adjustment-radiogroup";
import { FactorBar } from "./factor-bar";
import { DnaRadarChart, RecommendationDiffPreview } from "./taste-insights";

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
  onCoverSettled,
}: Readonly<{
  anchors: Work[];
  animateReveal: boolean;
  coverUrls: ReadonlyMap<string, string | null>;
  onCoverSettled(workId: string): void;
}>) {
  const shelf = (
    <MediaShelf
      className="taste-anchor-strip mb-[var(--space-6)] min-w-0 rounded-[var(--radius-card)] border border-line bg-surface-1 p-[var(--space-5)]"
      listType="unordered"
      title={tasteStrings.anchorsHeading}
      trackClassName="pt-0.5"
    >
      {anchors.map((work) => (
        <li
          className="relative w-[calc(var(--space-8)+var(--space-8)+var(--space-8)+var(--space-3))] min-w-[calc(var(--space-8)+var(--space-8)+var(--space-8)+var(--space-3))] snap-start"
          key={work.id}
        >
          <CoverImage
            className="taste-anchor-cover overflow-hidden rounded-[var(--radius-cover)] bg-surface-2"
            coverUrl={coverUrls.get(work.id)}
            creators={work.creators}
            decorative
            onSettled={() => onCoverSettled(work.id)}
            requestedSize={200}
            title={work.title}
          />
          <span className="visually-hidden sr-only">{work.title}</span>
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
  coverUrls: ReadonlyMap<string, string | null>;
  onCoverSettled(workId: string): void;
}>;

function TopPreferenceCard({
  preference,
  worksById,
  index,
  animateReveal,
  coverUrls,
  onCoverSettled,
}: TopPreferenceCardProps) {
  const evidenceWorks = preference.anchorWorkIds.flatMap((workId): Work[] => {
    const work = worksById.get(workId);
    return work === undefined ? [] : [work];
  });
  const label = factorLabel(preference.factorId);

  const content = (
    <>
      <h3
        className={cn(
          "relative w-fit text-accent",
          animateReveal &&
            "taste-top-card__label--reveal after:absolute after:right-0 after:-bottom-[3px] after:left-0 after:h-0.5 after:origin-left after:scale-x-0 after:bg-accent after:content-[''] motion-safe:after:animate-[taste-underline-reveal_300ms_500ms_ease-out_forwards]",
          animateReveal && index === 1 && "after:[animation-delay:680ms]",
          animateReveal && index === 2 && "after:[animation-delay:860ms]",
        )}
      >
        {label}
      </h3>
      <ul
        aria-hidden="true"
        className="m-0 flex min-h-[calc(var(--space-12)+var(--space-1))] list-none gap-[var(--space-content)] p-0 md:hidden"
      >
        {evidenceWorks.map((work) => (
          <li className="w-8 min-w-8 md:w-7 md:min-w-7" key={work.id}>
            <CoverImage
              className="taste-evidence-cover rounded-[var(--radius-cover)]"
              coverUrl={coverUrls.get(work.id)}
              creators={work.creators}
              decorative
              onSettled={() => onCoverSettled(work.id)}
              requestedSize={200}
              title={work.title}
            />
          </li>
        ))}
      </ul>
      <span className="taste-top-card__level whitespace-nowrap text-[length:var(--text-caption-size)] text-accent">
        {tasteStrings.factorValue(preference.value)}
      </span>
      <p className="line-clamp-2 text-[length:var(--text-caption-size)] text-text-muted md:sr-only">
        {tasteStrings.topPreferenceEvidence(evidenceWorks.map((work) => work.title))}
      </p>
    </>
  );

  return animateReveal ? (
    <m.article
      animate={{ opacity: 1, y: 0 }}
      className="taste-top-card surface-card grid min-w-0 gap-[var(--space-content-loose)] rounded-[var(--radius-card)] border border-line bg-surface-2 p-[var(--space-3)]"
      initial={{ opacity: 0, y: 8 }}
      transition={{ delay: 0.5 + index * 0.18, duration: 0.4, ease: [0.2, 0, 0, 1] }}
    >
      {content}
    </m.article>
  ) : (
    <article className="taste-top-card surface-card grid min-w-0 gap-[var(--space-content-loose)] rounded-[var(--radius-card)] border border-line bg-surface-2 p-[var(--space-3)]">
      {content}
    </article>
  );
}

type FactorGroupProps<FactorId extends ExplanationFactorId> = Readonly<{
  id: string;
  highlightPrefix?: "axis" | "theme";
  title: string;
  preferences: readonly DnaPreference<FactorId>[];
  animateReveal: boolean;
  factorRevealReady: boolean;
  adjustmentValues?: Partial<Record<FactorId, AdjustmentPreference>>;
  onAdjustment?: (factorId: FactorId, preference: AdjustmentPreference) => void;
  highlightedFactor: string | null;
}>;

function FactorGroup<FactorId extends ExplanationFactorId>({
  id,
  highlightPrefix,
  title,
  preferences,
  animateReveal,
  factorRevealReady,
  adjustmentValues,
  onAdjustment,
  highlightedFactor,
}: FactorGroupProps<FactorId>) {
  return (
    <section
      className="taste-factor-group surface-card m-0 min-w-0 rounded-[var(--radius-card)] border border-line bg-surface-2 px-[var(--space-4)] py-[var(--space-5)]"
      aria-labelledby={`taste-group-${id}`}
    >
      <h2 className="border-b border-line pb-3 text-text-strong" id={`taste-group-${id}`}>
        {title}
      </h2>
      <div className="taste-factor-group__rows grid">
        {preferences.map((preference, index) => {
          const label = factorLabel(preference.factorId);
          return (
            <div
              className="taste-factor-row grid min-w-0 gap-[var(--space-3)] border-b border-line py-[var(--space-4)] last:border-b-0 last:pb-0"
              key={preference.factorId}
            >
              <FactorBar
                animateReveal={animateReveal}
                revealReady={factorRevealReady}
                highlighted={highlightedFactor === `${highlightPrefix}:${preference.factorId}`}
                label={label}
                revealDelay={index * 0.06}
                state={preference.state}
                value={preference.value}
              />
              {adjustmentValues === undefined || onAdjustment === undefined ? null : (
                <AdjustmentRadiogroup
                  factorId={`${id}-${preference.factorId}`}
                  factorLabel={label}
                  onChange={(value) => onAdjustment(preference.factorId, value)}
                  value={adjustmentValues[preference.factorId] ?? "auto"}
                />
              )}
            </div>
          );
        })}
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
  highlightedFactor,
  mode,
  onAdjustment,
  summary,
}: Readonly<{
  adjustments: ProfileAdjustments;
  animateReveal: boolean;
  factorRevealReady: boolean;
  group?: CoverageGroup;
  highlightedFactor: string | null;
  mode: TasteMode;
  onAdjustment: (
    kind: "axis" | "theme",
    factorId: AxisId | ThemeTag,
    preference: AdjustmentPreference,
  ) => void;
  summary: MangaDnaSummary;
}>) {
  const narrative = summary.axes.filter((preference) => NARRATIVE_IDS.has(preference.factorId));
  const tone = summary.axes.filter((preference) => TONE_IDS.has(preference.factorId));
  const art = summary.axes.filter((preference) => ART_IDS.has(preference.factorId));
  const adjusting = mode === "adjust";
  const visible = (candidate: CoverageGroup) =>
    adjusting ? group === candidate : group === undefined || group === candidate;

  return (
    <div className="taste-factor-grid grid grid-cols-1 gap-[var(--space-content-loose)] md:grid-cols-2">
      {visible("theme") ? (
        <FactorGroup
          adjustmentValues={adjusting ? adjustments.themes : undefined}
          animateReveal={animateReveal}
          factorRevealReady={factorRevealReady}
          highlightedFactor={highlightedFactor}
          highlightPrefix="theme"
          id="theme"
          onAdjustment={
            adjusting ? (factorId, value) => onAdjustment("theme", factorId, value) : undefined
          }
          preferences={summary.themes}
          title={tasteStrings.groups.theme}
        />
      ) : null}
      {visible("narrative") ? (
        <FactorGroup
          adjustmentValues={adjusting ? adjustments.axes : undefined}
          animateReveal={animateReveal}
          factorRevealReady={factorRevealReady}
          highlightedFactor={highlightedFactor}
          highlightPrefix="axis"
          id="narrative"
          onAdjustment={
            adjusting ? (factorId, value) => onAdjustment("axis", factorId, value) : undefined
          }
          preferences={narrative}
          title={tasteStrings.groups.narrative}
        />
      ) : null}
      {visible("tone") ? (
        <FactorGroup
          adjustmentValues={adjusting ? adjustments.axes : undefined}
          animateReveal={animateReveal}
          factorRevealReady={factorRevealReady}
          highlightedFactor={highlightedFactor}
          highlightPrefix="axis"
          id="tone"
          onAdjustment={
            adjusting ? (factorId, value) => onAdjustment("axis", factorId, value) : undefined
          }
          preferences={tone}
          title={tasteStrings.groups.tone}
        />
      ) : null}
      {visible("art") ? (
        <FactorGroup
          adjustmentValues={adjusting ? adjustments.axes : undefined}
          animateReveal={animateReveal}
          factorRevealReady={factorRevealReady}
          highlightedFactor={highlightedFactor}
          highlightPrefix="axis"
          id="art"
          onAdjustment={
            adjusting ? (factorId, value) => onAdjustment("axis", factorId, value) : undefined
          }
          preferences={art}
          title={tasteStrings.groups.art}
        />
      ) : null}
      {visible("genre") ? (
        <FactorGroup
          animateReveal={animateReveal}
          factorRevealReady={factorRevealReady}
          highlightedFactor={highlightedFactor}
          id="genre"
          preferences={summary.genres}
          title={tasteStrings.groups.genre}
        />
      ) : null}
    </div>
  );
}

type RecentFeedbackSummaryProps = Readonly<{
  records: readonly UserWorkRecord[];
  worksById: ReadonlyMap<string, Work>;
  coverUrls: ReadonlyMap<string, string | null>;
  onCoverSettled(workId: string): void;
}>;

function RecentFeedbackSummary({
  records,
  worksById,
  coverUrls,
  onCoverSettled,
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
    .slice(0, 3);

  const feedbackLabel = (record: UserWorkRecord) => {
    if (record.reaction !== undefined) return tasteStrings.feedbackLabels[record.reaction];
    return tasteStrings.readingStateLabels[record.readingState];
  };

  return items.length === 0 ? null : (
    <section
      className="taste-negative-summary mt-[var(--space-6)] grid gap-[var(--space-content-loose)] rounded-[var(--radius-card)] border border-line bg-surface-1 p-[var(--space-5)]"
      aria-labelledby="taste-negative-heading"
    >
      <h2 id="taste-negative-heading">{tasteStrings.recentFeedbackHeading}</h2>
      <ul className="m-0 grid list-none grid-cols-1 gap-[var(--space-content)] p-0 md:grid-cols-3">
        {items.map(({ record, work }) => (
          <li
            className="grid min-h-[var(--control-min-size)] grid-cols-[var(--space-12)_minmax(0,1fr)] items-center gap-[var(--space-4)] rounded-[var(--radius-card)] border border-line bg-surface-1 px-3 py-2.5"
            key={work.id}
          >
            <CoverImage
              className="taste-feedback-cover overflow-hidden bg-surface-2"
              coverUrl={coverUrls.get(work.id)}
              creators={work.creators}
              decorative
              onSettled={() => onCoverSettled(work.id)}
              requestedSize={200}
              title={work.title}
            />
            <span className="taste-feedback-copy grid min-w-0 gap-[var(--space-content-tight)]">
              <strong className="truncate text-text-strong">{work.title}</strong>
              <span className="text-[length:var(--text-caption-size)] text-text-muted">
                {feedbackLabel(record)}
              </span>
            </span>
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
  onModeChange,
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
  const [highlightedFactor, setHighlightedFactor] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const highlightTimer = useRef<number | null>(null);
  const messageTimer = useRef<number | null>(null);
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
  const hasProfile = useMemo(
    () => hasCatalogBackedProfile(userWorks, catalog.works),
    [catalog.works, userWorks],
  );
  const summary = useMemo(
    () => summarizeMangaDna(catalog.works, catalogRecords),
    [catalog.works, catalogRecords],
  );
  const anchors = useMemo(
    () => positiveAnchorWorks(catalogRecords, worksById),
    [catalogRecords, worksById],
  );
  const recentFeedbackWorkIds = useMemo(
    () =>
      [...catalogRecords]
        .sort(
          (left, right) =>
            right.updatedAt.localeCompare(left.updatedAt) ||
            left.workId.localeCompare(right.workId),
        )
        .slice(0, 3)
        .map((record) => record.workId),
    [catalogRecords],
  );
  const coverTargets = useMemo(
    () =>
      createRecommendationCoverTargets(catalog, [
        ...new Set([...anchors.map((work) => work.id), ...recentFeedbackWorkIds]),
      ]),
    [anchors, catalog, recentFeedbackWorkIds],
  );
  const { coverUrls, notifyCoverSettled } = useRecommendationCovers({
    targets: coverTargets,
    getProviderCache,
    saveProviderCache,
  });
  const coverTargetsByWorkId = useMemo(
    () => new Map(coverTargets.map((target) => [target.workId, target] as const)),
    [coverTargets],
  );
  const activeGroup = group;
  const handleCoverSettled = useCallback(
    (workId: string) => {
      const target = coverTargetsByWorkId.get(workId);
      if (target !== undefined) notifyCoverSettled(target);
    },
    [coverTargetsByWorkId, notifyCoverSettled],
  );
  const confidenceLevel = getConfidenceLevel(calculateProfileConfidence(catalogRecords));
  const beforePreviewWorkIds = useMemo(() => {
    if (baselineAdjustments === null || storedPolicies === undefined) return null;
    return recommendationPreviewWorkIds(catalog, records, baselineAdjustments, storedPolicies);
  }, [baselineAdjustments, catalog, records, storedPolicies]);
  const afterPreviewWorkIds = useMemo(() => {
    if (storedPolicies === undefined) return null;
    return recommendationPreviewWorkIds(catalog, records, adjustments, storedPolicies);
  }, [adjustments, catalog, records, storedPolicies]);

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
      if (highlightTimer.current !== null) window.clearTimeout(highlightTimer.current);
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
      setHighlightedFactor(`${kind}:${factorId}`);
      if (highlightTimer.current !== null) window.clearTimeout(highlightTimer.current);
      highlightTimer.current = window.setTimeout(() => setHighlightedFactor(null), 600);

      void saveProfileAdjustments(next).then(
        () => {
          if (saveSequence.current !== sequence) return;
          setMessage(tasteStrings.adjustmentSaved);
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
      <main className="taste-page taste-page--loading mx-auto grid min-h-dvh w-[min(100%,var(--layout-width-taste))] place-items-center px-[var(--layout-page-padding)] py-[var(--layout-page-block-start)] text-text-muted">
        <p aria-live="polite">{tasteStrings.loading}</p>
      </main>
    );
  }

  return (
    <LazyMotion features={domAnimation} strict>
      <main
        className={cn(
          "taste-page mx-auto min-h-dvh w-[min(100%,var(--layout-width-taste))] px-[var(--layout-page-padding)] pt-[var(--layout-page-block-start)] pb-[var(--space-section-large)] text-text",
          revealExperience.entry &&
            "taste-page--with-action pb-[var(--layout-taste-action-clearance)]",
          !revealExperience.entry &&
            pageEntryMotion.active &&
            "page-entry-b motion-safe:animate-[page-entry-b-enter_var(--motion-duration-page)_var(--motion-ease-direct)_both]",
        )}
        onAnimationEnd={pageEntryMotion.onAnimationEnd}
      >
        <header className="taste-header mb-[var(--space-6)] grid items-stretch gap-[var(--space-5)] md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div className="grid content-start gap-[var(--space-4)]">
            <div className="taste-header__copy grid content-center gap-[var(--space-content)] border-l-2 border-accent p-[var(--space-5)]">
              <p className="taste-header__eyebrow text-[length:var(--text-caption-size)] font-bold tracking-[0.08em] text-accent">
                {tasteStrings.eyebrow}
              </p>
              <h1 className="font-display text-[length:var(--text-display-size)]">
                {tasteStrings.title}
              </h1>
              <p className="max-w-[48ch] font-normal text-text-muted">{tasteStrings.description}</p>
              <strong className="taste-confidence min-h-[var(--control-min-size)] w-fit rounded-full border border-line bg-surface-1 px-[var(--space-3)] py-[var(--space-2)] leading-[calc(var(--control-min-size)-(var(--space-2)*2))] text-accent">
                {tasteStrings.confidence}: {tasteStrings.confidenceLabels[confidenceLevel]}
              </strong>
            </div>
            <section
              className="taste-top-summary screentone grid gap-[var(--space-4)] rounded-[var(--radius-card)] border border-line bg-surface-1 p-[var(--space-4)] [background-image:radial-gradient(color-mix(in_oklch,var(--text-strong)_5%,transparent)_1px,transparent_1px)] [background-size:8px_8px]"
              aria-labelledby="taste-top-heading"
            >
              <h2 id="taste-top-heading">{tasteStrings.topPreferencesHeading}</h2>
              {summary.topPreferences.length === 0 ? (
                <p>{tasteStrings.topPreferencePending}</p>
              ) : (
                <div className="taste-top-summary__grid grid gap-[var(--space-content-loose)] md:grid-cols-3">
                  {summary.topPreferences.map((preference, index) => (
                    <TopPreferenceCard
                      animateReveal={revealExperience.animate}
                      coverUrls={coverUrls}
                      index={index}
                      key={`${preference.kind}:${preference.factorId}`}
                      preference={preference}
                      onCoverSettled={handleCoverSettled}
                      worksById={worksById}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
          <DnaRadarChart axes={summary.axes} />
        </header>

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

        <AnchorStrip
          anchors={anchors}
          animateReveal={revealExperience.animate}
          coverUrls={coverUrls}
          onCoverSettled={handleCoverSettled}
        />

        <Tabs
          className="taste-workspace grid gap-[var(--space-4)] rounded-[var(--radius-card)] border border-line bg-surface-1 p-[var(--space-4)] md:p-[var(--space-5)]"
          onValueChange={(value) => {
            if (value === "summary" || value === "adjust") onModeChange?.(value);
          }}
          value={mode}
        >
          <div className="taste-workspace__header flex flex-col items-stretch justify-between gap-[var(--space-4)] md:flex-row md:items-end">
            <div className="grid gap-[var(--space-content-tight)]">
              <h2>{tasteStrings.workspaceHeading}</h2>
              <p className="text-text-muted">
                {mode === "summary"
                  ? tasteStrings.modeDescriptions.summary
                  : tasteStrings.modeDescriptions.adjust}
              </p>
            </div>
            <TabsList
              aria-label={tasteStrings.modeLabel}
              className="w-full md:w-fit md:min-w-[min(calc(var(--layout-width-form)/2),100%)]"
            >
              <TabsTrigger value="summary">{tasteStrings.modes.summary}</TabsTrigger>
              <TabsTrigger value="adjust">{tasteStrings.modes.adjust}</TabsTrigger>
            </TabsList>
          </div>

          <div
            aria-label={tasteStrings.groupLabel}
            className="taste-group-filter flex flex-nowrap gap-[var(--space-content)] overflow-x-auto overscroll-x-contain border-y border-line py-[var(--space-content)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&>button]:shrink-0 [&>button[aria-pressed=true]]:border-accent [&>button[aria-pressed=true]]:text-accent md:flex-wrap md:overflow-x-visible"
            role="group"
          >
            {mode === "summary" ? (
              <Button
                aria-pressed={group === undefined}
                onClick={() => onGroupChange?.(undefined)}
                type="button"
                variant={group === undefined ? "secondary" : "outline"}
              >
                {tasteStrings.allGroups}
              </Button>
            ) : null}
            {COVERAGE_GROUPS.map((groupId) => (
              <Button
                aria-pressed={activeGroup === groupId}
                key={groupId}
                onClick={() => onGroupChange?.(group === groupId ? undefined : groupId)}
                type="button"
                variant={activeGroup === groupId ? "secondary" : "outline"}
              >
                {tasteStrings.groups[groupId]}
              </Button>
            ))}
          </div>

          <TabsContent value="summary">
            <FactorPanels
              adjustments={adjustments}
              animateReveal={revealExperience.animate}
              factorRevealReady={factorRevealReady}
              group={group}
              highlightedFactor={highlightedFactor}
              mode="summary"
              onAdjustment={updateAdjustment}
              summary={summary}
            />
          </TabsContent>
          <TabsContent value="adjust">
            <FactorPanels
              adjustments={adjustments}
              animateReveal={revealExperience.animate}
              factorRevealReady={factorRevealReady}
              group={activeGroup}
              highlightedFactor={highlightedFactor}
              mode="adjust"
              onAdjustment={updateAdjustment}
              summary={summary}
            />
          </TabsContent>
        </Tabs>

        <RecommendationDiffPreview after={afterPreviewWorkIds} before={beforePreviewWorkIds} />

        <RecentFeedbackSummary
          coverUrls={coverUrls}
          onCoverSettled={handleCoverSettled}
          records={catalogRecords}
          worksById={worksById}
        />
        <div className="taste-next-actions mt-[var(--space-6)] flex flex-wrap items-center justify-between gap-[var(--space-4)]">
          <Link
            className="taste-add-link interactive-press mt-[var(--space-6)] inline-flex min-h-[var(--control-min-size)] items-center font-bold text-accent underline underline-offset-4 transition-[opacity,transform] duration-[var(--motion-duration-feedback)] ease-[var(--motion-ease-direct)] active:scale-[0.97] motion-reduce:transform-none"
            to="/onboarding"
          >
            {tasteStrings.addWorks}
          </Link>
        </div>
        {revealExperience.entry ? (
          <div className="taste-reveal-cta fixed inset-x-0 bottom-[var(--layout-mobile-navigation-clearance)] z-25 border-t border-line bg-surface-1 px-[var(--layout-page-padding)] py-2.5 md:right-[var(--layout-page-padding)] md:bottom-[var(--layout-page-padding)] md:left-auto md:w-80 md:border-0 md:bg-transparent md:p-0">
            <Link
              className={buttonClassName({
                className:
                  "mx-auto min-h-12 w-full max-w-[calc(var(--layout-width-taste)/2)] px-[var(--space-5)] py-[var(--space-3)] font-bold",
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
        >
          {message}
        </p>
        <SiteFooter className="taste-footer mx-[calc(var(--layout-page-padding)*-1)] mt-[var(--space-section-large)]" />
      </main>
    </LazyMotion>
  );
}
