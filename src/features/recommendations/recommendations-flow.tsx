"use client";

import { Link } from "@tanstack/react-router";
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import { flushSync } from "react-dom";

import { Button } from "@/components/design-system/button";
import {
  carouselCloneProps,
  carouselLoopCopies,
  duplicateCarouselContent,
  MediaShelf,
  shouldLoopCarousel,
} from "@/components/media/media-shelf";
import { RankingCard } from "@/components/media/ranking-card";
import { RankingShelf } from "@/components/media/ranking-shelf";
import type { GenreTag } from "@/domain/catalog/types";
import type { ExplanationFactorId } from "@/domain/explanation";
import { generateTasteExplanation } from "@/domain/explanation/generate";
import { recommendationProfileRecords } from "@/domain/profile/catalog-profile";
import {
  createRecommendationFeedbackRecord,
  type CompletedRecommendationReaction,
} from "@/domain/profile/recommendation-feedback";
import { summarizeMangaDna } from "@/domain/profile/dna-summary";
import type {
  FactorBackedNegativeReasonId,
  ProfileAdjustments,
  RecommendationPolicies,
  UserWorkRecord,
} from "@/domain/profile/types";
import {
  RECOMMENDATION_CACHE_SCHEMA_VERSION,
  RECOMMENDATION_ENGINE_VERSION,
  serializeRecommendationInput,
} from "@/domain/recommendation/input-hash";
import {
  backfillRecommendationPlanEntries,
  selectRecommendationPlanEntries,
} from "@/domain/recommendation/ordering";
import type {
  RecommendationContext,
  RecommendationInput,
  RecommendationPlanEntry,
} from "@/domain/recommendation/types";
import { useCatalog } from "@/features/catalog/catalog-provider";
import { PopularWorkDiscovery } from "@/features/discovery/popular-work-discovery";
import { usePersistence } from "@/infrastructure/db";
import { explanationLexicon, onboardingStrings, recommendationStrings } from "@/lib/strings";

import type { PendingRecommendationFeedback } from "./feedback-dialog";
import { FeedbackImpactSummary } from "./feedback-impact-summary";
import { RecommendationCard } from "./recommendation-card";
import { RecommendationCriteriaSummary } from "./recommendation-criteria-summary";
import {
  createRecommendationCoverTargets,
  useRecommendationCovers,
} from "./recommendation-cover-resolver";
import { RecommendationPlanWorkerClient } from "./recommendation-plan-worker-client";
import { RecommendationFilterBar, type VisiblePolicyKey } from "./recommendation-filter-bar";
import {
  RecommendationShelfNavigation,
  type RecommendationShelf,
} from "./recommendation-shelf-navigation";
import { loadRecommendationMotionList } from "./recommendation-motion-loader";
import { RecommendationShelfCard } from "./recommendation-shelf-card";
import type {
  RecommendationMotionItem,
  RecommendationMotionListProps,
} from "./recommendation-motion-list";

const RECOMMENDATION_CAROUSEL_TRACK_CLASSNAME =
  "recommendations-list relative items-stretch gap-[var(--space-3)] [--featured-card-basis:17rem] sm:[--featured-card-basis:19rem] [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:[--featured-card-basis:21.5rem]";

function scrollToRecommendationShelf(shelf: string, focus = false) {
  const target = document.getElementById(`recommendation-shelf-${shelf}`);
  const heading = target?.querySelector("h2") ?? target?.nextElementSibling?.querySelector("h2");
  if (target === null || !(heading instanceof HTMLElement)) return;
  target.scrollIntoView({ block: "start" });
  if (focus) {
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
  }
}

const DEFAULT_POLICIES: RecommendationPolicies = {
  preferCompleted: false,
  preferHidden: false,
  preferVerified: false,
  excludeIncomplete: false,
};
const EMPTY_ADJUSTMENTS: ProfileAdjustments = { axes: {}, themes: {} };
const EMPTY_RECORDS: readonly UserWorkRecord[] = [];
type RecommendationMotionListComponent = ComponentType<RecommendationMotionListProps>;
const FeedbackDialog = lazy(async () => {
  const module = await import("./feedback-dialog");
  return { default: module.FeedbackDialog };
});
const QuickPreviewDialog = lazy(async () => {
  const module = await import("@/components/media/quick-preview-dialog");
  return { default: module.QuickPreviewDialog };
});
type MotionFocusTarget = Readonly<{
  workId: string;
  action: "completed" | "hidden" | null;
}>;
type RecommendationsFlowProps = Readonly<{
  context: RecommendationContext | null;
  previewWorkId?: string;
  genre?: GenreTag;
  shelf?: string;
  onPreviewOpen?: (workId: string) => void;
  onPreviewClose?: () => void;
  onGenreChange?: (genre: GenreTag | undefined) => void;
  onShelfChange?: (shelf: RecommendationShelf | undefined) => void;
}>;

function StaticRecommendationItems({
  items,
}: Readonly<{ items: readonly RecommendationMotionItem[] }>) {
  const copies = shouldLoopCarousel(items.length) ? carouselLoopCopies : ([1] as const);
  return (
    <>
      {copies.flatMap((copy) =>
        items.map((item) => (
          <li
            className="basis-[var(--featured-card-basis)] shrink-0 snap-start overflow-visible"
            data-recommendation-work-id={item.workId}
            key={`${String(copy)}-${item.workId}`}
            {...carouselCloneProps(copy)}
          >
            {duplicateCarouselContent(item.content, copy)}
          </li>
        )),
      )}
    </>
  );
}

function FeaturedRecommendationState({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <section
      aria-labelledby="recommendation-featured-heading"
      className="grid scroll-mt-[var(--space-4)] md:scroll-mt-[calc(var(--control-min-size)+var(--space-2))] gap-[var(--space-content)]"
      id="recommendation-shelf-featured"
    >
      <header className="grid gap-[var(--space-content-tight)]">
        <h2
          className="border-l-[length:var(--space-1)] border-accent pl-[var(--space-4)]"
          id="recommendation-featured-heading"
        >
          {recommendationStrings.shelves.featured.title}
        </h2>
        <p className="text-text-muted">{recommendationStrings.shelves.featured.description}</p>
      </header>
      {children}
    </section>
  );
}

function planReferencesCurrentInput(
  plan: readonly RecommendationPlanEntry[],
  input: RecommendationInput,
) {
  const catalogWorkIds = new Set(input.catalog.works.map((work) => work.id));
  const profileWorkIds = new Set(
    input.catalog.works
      .filter((work) => work.eligibility.recommendationEligible)
      .map((work) => work.id),
  );
  const positiveAnchorIds = new Set(
    recommendationProfileRecords(input.records, input.catalog.works)
      .filter((record) => record.reaction === "favorite" || record.reaction === "liked")
      .map((record) => record.workId),
  );
  const seen = new Set<string>();
  return plan.every((entry) => {
    const metadata = input.context.constraintByWorkId[entry.workId];
    if (
      seen.has(entry.workId) ||
      !catalogWorkIds.has(entry.workId) ||
      !positiveAnchorIds.has(entry.bestAnchorId) ||
      metadata === undefined ||
      metadata.workId !== entry.workId ||
      entry.contributions.some((contribution) =>
        contribution.anchorWorkIds.some((workId) => !profileWorkIds.has(workId)),
      )
    ) {
      return false;
    }
    seen.add(entry.workId);
    return true;
  });
}

async function sha256(value: string) {
  const digest = await globalThis.crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function recommendationInputHash(input: RecommendationInput) {
  return sha256(serializeRecommendationInput(input));
}

function RecommendationsSkeleton() {
  return (
    <section
      aria-label={recommendationStrings.calculating}
      aria-live="polite"
      className="recommendations-skeleton"
    >
      <p className="mb-[var(--space-4)] text-text-muted">{recommendationStrings.calculating}</p>
      <ol aria-hidden="true" className="m-0 grid list-none gap-[var(--space-4)] p-0">
        {Array.from({ length: 10 }, (_, index) => (
          <li
            className="grid min-h-[calc(var(--recommendation-cover-width)*1.43)] grid-cols-[var(--recommendation-cover-width)_minmax(0,1fr)] gap-[var(--space-4)] rounded-[var(--radius-card)] border border-line bg-surface-1 p-[var(--space-4)] motion-safe:[animation:cover-skeleton-pulse_1.2s_ease-in-out_infinite_alternate] motion-reduce:animate-none motion-reduce:opacity-65"
            key={index}
          >
            <span className="block aspect-[30/43] rounded-[var(--radius-cover)] bg-line" />
            <div className="grid content-start gap-[var(--space-3)]">
              <span className="block h-[var(--space-4)] rounded-[var(--radius-cover)] bg-line" />
              <span className="block h-[var(--space-4)] w-2/3 rounded-[var(--radius-cover)] bg-line" />
              <span className="block h-[var(--space-8)] rounded-[var(--radius-cover)] bg-line" />
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function RecommendationsFlow({
  context,
  genre,
  onGenreChange,
  onPreviewClose,
  onPreviewOpen,
  onShelfChange,
  previewWorkId,
  shelf,
}: RecommendationsFlowProps) {
  const catalog = useCatalog();
  const {
    adjustments: storedAdjustments,
    getProviderCache,
    getRecommendationCache,
    policies: storedPolicies,
    savePolicies,
    saveProviderCache,
    saveRecommendationCache,
    saveUserWork,
    status,
    userWorks,
  } = usePersistence();
  const [localPolicies, setLocalPolicies] = useState<RecommendationPolicies | null>(null);
  const [expandedAnchorId, setExpandedAnchorId] = useState<string | null>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const restoredShelf = useRef<string | undefined>(undefined);
  const [isPolicySaving, setIsPolicySaving] = useState(false);
  const [plan, setPlan] = useState<RecommendationPlanEntry[] | null>(null);
  const [planPolicies, setPlanPolicies] = useState<RecommendationPolicies | null>(null);
  const [visibleEntries, setVisibleEntries] = useState<RecommendationPlanEntry[]>([]);
  const [displayedHash, setDisplayedHash] = useState<string | null>(null);
  const [currentHashResult, setCurrentHashResult] = useState<{
    input: RecommendationInput;
    hash: string;
  } | null>(null);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [isComputing, setIsComputing] = useState(false);
  const [calculationError, setCalculationError] = useState("");
  const [actionError, setActionError] = useState("");
  const [liveAnnouncement, setLiveAnnouncement] = useState({ sequence: 0, text: "" });
  const [busyWorkIds, setBusyWorkIds] = useState<ReadonlySet<string>>(new Set());
  const [optimisticPlannedIds, setOptimisticPlannedIds] = useState<ReadonlySet<string>>(new Set());
  const [backfillIds, setBackfillIds] = useState<ReadonlySet<string>>(new Set());
  const [feedback, setFeedback] = useState<PendingRecommendationFeedback | null>(null);
  const [feedbackBusy, setFeedbackBusy] = useState(false);
  const [feedbackBaseBusy, setFeedbackBaseBusy] = useState(false);
  const [feedbackError, setFeedbackError] = useState("");
  const [MotionList, setMotionList] = useState<RecommendationMotionListComponent | null>(null);
  const [recommendationPlanWorker] = useState(() => new RecommendationPlanWorkerClient());
  const calculationSequence = useRef(0);
  const calculationInFlight = useRef(false);
  const hashSequence = useRef(0);
  const initialLoadHash = useRef<string | null>(null);
  const policySaveInFlight = useRef(false);
  const feedbackBaseInFlight = useRef(false);
  const [excludedWorkIds, setExcludedWorkIds] = useState<ReadonlySet<string>>(new Set());
  const articleRefs = useRef(new Map<string, HTMLElement>());
  const updateButtonRef = useRef<HTMLButtonElement>(null);
  const restoreUpdateFocus = useRef(false);
  const motionAllowed = useRef(false);
  const motionListActive = useRef(false);
  const loadedMotionList = useRef<RecommendationMotionListComponent | null>(null);
  const motionListRequest = useRef<Promise<void> | null>(null);
  const pendingMotionFocus = useRef<MotionFocusTarget | null>(null);
  const [previewOpener, setPreviewOpener] = useState<HTMLElement | null>(null);
  const records = userWorks ?? EMPTY_RECORDS;
  const profileRecords = useMemo(
    () => recommendationProfileRecords(records, catalog.works),
    [catalog.works, records],
  );
  const adjustments = storedAdjustments ?? EMPTY_ADJUSTMENTS;
  const policies = localPolicies ?? storedPolicies ?? DEFAULT_POLICIES;
  const worksById = useMemo(
    () => new Map(catalog.works.map((work) => [work.id, work] as const)),
    [catalog.works],
  );
  const recommendationInput = useMemo<RecommendationInput | null>(() => {
    if (
      userWorks === undefined ||
      storedAdjustments === undefined ||
      storedPolicies === undefined ||
      context === null
    ) {
      return null;
    }
    return {
      catalog,
      records: userWorks,
      adjustments,
      policies,
      context,
    };
  }, [adjustments, catalog, context, policies, storedAdjustments, storedPolicies, userWorks]);
  const dnaSummary = useMemo(
    () => summarizeMangaDna(catalog.works, profileRecords),
    [catalog.works, profileRecords],
  );
  const plannedIds = useMemo(() => {
    const ids = new Set(optimisticPlannedIds);
    records.forEach((record) => {
      if (record.readingState === "planned") ids.add(record.workId);
    });
    return ids;
  }, [optimisticPlannedIds, records]);
  const {
    anchorEntries,
    completedEntries,
    discoveryEntries,
    featuredEntries,
    previewEntry,
    renderedEntries,
  } = useMemo(() => {
    const nextRenderedEntries = visibleEntries.flatMap((entry) => {
      const work = worksById.get(entry.workId);
      const metadata = context?.constraintByWorkId[entry.workId];
      return work === undefined || metadata === undefined ? [] : [{ entry, metadata, work }];
    });
    const nextFeaturedEntries =
      genre === undefined
        ? nextRenderedEntries
        : nextRenderedEntries.filter(({ work }) => work.genres.includes(genre));
    const nextAllPlanEntries = (plan ?? []).flatMap((entry) => {
      if (excludedWorkIds.has(entry.workId)) return [];
      const work = worksById.get(entry.workId);
      const metadata = context?.constraintByWorkId[entry.workId];
      return work === undefined || metadata === undefined ? [] : [{ entry, metadata, work }];
    });
    const visibleWorkIds = new Set(visibleEntries.map((entry) => entry.workId));
    const auxiliaryEntries = nextAllPlanEntries.filter(
      ({ entry, work }) =>
        !visibleWorkIds.has(entry.workId) && (genre === undefined || work.genres.includes(genre)),
    );
    const usedAuxiliaryIds = new Set<string>();
    const nextAnchorEntries: typeof auxiliaryEntries = [];
    for (const candidate of auxiliaryEntries) {
      if (nextAnchorEntries.length === 8) break;
      const leadReason = generateTasteExplanation({
        contributions: candidate.entry.contributions,
        confidenceLevel: candidate.entry.confidenceLevel,
        lexicon: explanationLexicon,
        resolveTitle: (workId) => worksById.get(workId)?.title,
      }).positiveReasons[0];
      if (leadReason !== undefined && leadReason.anchorWorkIds.length > 0) {
        nextAnchorEntries.push(candidate);
      }
    }
    nextAnchorEntries.forEach(({ entry }) => usedAuxiliaryIds.add(entry.workId));
    const nextDiscoveryEntries = auxiliaryEntries
      .filter(({ entry }) => entry.isDiscovery && !usedAuxiliaryIds.has(entry.workId))
      .slice(0, 6);
    nextDiscoveryEntries.forEach(({ entry }) => usedAuxiliaryIds.add(entry.workId));
    const nextCompletedEntries = auxiliaryEntries
      .filter(
        ({ entry, work }) => work.status === "completed" && !usedAuxiliaryIds.has(entry.workId),
      )
      .slice(0, 6);

    return {
      anchorEntries: nextAnchorEntries,
      completedEntries: nextCompletedEntries,
      discoveryEntries: nextDiscoveryEntries,
      featuredEntries: nextFeaturedEntries,
      previewEntry: nextAllPlanEntries.find(({ entry }) => entry.workId === previewWorkId) ?? null,
      renderedEntries: nextRenderedEntries,
    };
  }, [context, excludedWorkIds, genre, plan, previewWorkId, visibleEntries, worksById]);
  const shelfAvailability = useMemo(
    () => ({
      featured: true,
      anchor: anchorEntries.length > 0,
      discovery: discoveryEntries.length > 0,
      completed: completedEntries.length > 0,
      ranking: renderedEntries.length > 0,
    }),
    [
      anchorEntries.length,
      completedEntries.length,
      discoveryEntries.length,
      renderedEntries.length,
    ],
  );
  const coverWorkIds = useMemo(() => {
    const orderedIds = [
      ...featuredEntries.map(({ entry }) => entry.workId),
      ...renderedEntries.map(({ entry }) => entry.workId),
      ...anchorEntries.map(({ entry }) => entry.workId),
      ...discoveryEntries.map(({ entry }) => entry.workId),
      ...completedEntries.map(({ entry }) => entry.workId),
      ...(previewEntry === null ? [] : [previewEntry.entry.workId]),
    ];
    return [...new Set(orderedIds)];
  }, [
    anchorEntries,
    completedEntries,
    discoveryEntries,
    featuredEntries,
    previewEntry,
    renderedEntries,
  ]);
  const recommendationCoverTargets = useMemo(
    () => createRecommendationCoverTargets(catalog, coverWorkIds),
    [catalog, coverWorkIds],
  );
  const {
    coverUrls: recommendationCoverUrls,
    itemCaptions,
    requestCover,
  } = useRecommendationCovers({
    targets: recommendationCoverTargets,
    getProviderCache,
    saveProviderCache,
  });
  const announce = useCallback((text: string) => {
    setLiveAnnouncement((current) => ({ sequence: current.sequence + 1, text }));
  }, []);

  useEffect(
    () => () => {
      calculationSequence.current += 1;
      recommendationPlanWorker.terminate();
    },
    [recommendationPlanWorker],
  );

  const captureMotionFocus = useCallback((): MotionFocusTarget | null => {
    const activeElement = document.activeElement;
    if (!(activeElement instanceof HTMLElement)) return null;
    const listItem = activeElement.closest<HTMLElement>("li[data-recommendation-work-id]");
    const workId = listItem?.dataset.recommendationWorkId;
    if (workId === undefined) return null;
    const action = activeElement.dataset.recommendationAction;
    return {
      workId,
      action: action === "completed" || action === "hidden" ? action : null,
    };
  }, []);

  const requestRemovalMotion = useCallback(() => {
    if (
      !motionAllowed.current ||
      motionListRequest.current !== null ||
      calculationInFlight.current ||
      policySaveInFlight.current ||
      feedbackBaseInFlight.current
    ) {
      return;
    }
    try {
      motionListRequest.current = loadRecommendationMotionList().then(
        (component) => {
          loadedMotionList.current = component;
        },
        () => undefined,
      );
    } catch {
      motionListRequest.current = Promise.resolve();
    }
  }, []);

  const activateLoadedMotionList = useCallback(() => {
    const component = loadedMotionList.current;
    if (!motionAllowed.current || motionListActive.current || component === null) return false;
    pendingMotionFocus.current = captureMotionFocus();
    motionListActive.current = true;
    flushSync(() => setMotionList(() => component));
    return true;
  }, [captureMotionFocus]);

  const deactivateMotionList = useCallback(() => {
    if (!motionListActive.current) return;
    pendingMotionFocus.current = captureMotionFocus();
    motionListActive.current = false;
    setMotionList(null);
  }, [captureMotionFocus]);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    let mediaQuery: MediaQueryList;
    try {
      mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    } catch {
      return;
    }
    if (typeof mediaQuery.addEventListener !== "function") return;
    motionAllowed.current = !mediaQuery.matches;
    const handleChange = (event: MediaQueryListEvent) => {
      motionAllowed.current = !event.matches;
      if (event.matches && motionListActive.current) {
        deactivateMotionList();
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [deactivateMotionList]);

  useLayoutEffect(() => {
    const target = pendingMotionFocus.current;
    if (target === null) return;
    pendingMotionFocus.current = null;
    const article = articleRefs.current.get(target.workId);
    if (article === undefined) return;
    const action =
      target.action === null
        ? null
        : article.querySelector<HTMLButtonElement>(
            `[data-recommendation-action="${target.action}"]`,
          );
    if (action !== null && !action.disabled) action.focus();
    else article.focus();
  }, [MotionList]);

  useEffect(() => {
    if (plan === null || restoredShelf.current === shelf) return;
    restoredShelf.current = shelf;
    if (shelf !== undefined) scrollToRecommendationShelf(shelf);
  }, [plan, shelf]);

  useLayoutEffect(() => {
    if (isComputing || !restoreUpdateFocus.current) return;
    restoreUpdateFocus.current = false;
    if (
      document.activeElement !== document.body &&
      document.activeElement !== updateButtonRef.current
    ) {
      return;
    }
    (updateButtonRef.current ?? document.getElementById("recommendation-page-heading"))?.focus({
      preventScroll: true,
    });
  }, [calculationError, displayedHash, isComputing]);

  useEffect(() => {
    if (
      plan !== null &&
      previewWorkId !== undefined &&
      (!plan.some((entry) => entry.workId === previewWorkId) || excludedWorkIds.has(previewWorkId))
    ) {
      onPreviewClose?.();
    }
  }, [excludedWorkIds, onPreviewClose, plan, previewWorkId]);

  useEffect(() => {
    if (recommendationInput === null) return;
    const sequence = hashSequence.current + 1;
    hashSequence.current = sequence;
    void recommendationInputHash(recommendationInput).then(
      (hash) => {
        if (hashSequence.current === sequence) {
          setCurrentHashResult({ input: recommendationInput, hash });
        }
      },
      () => {
        if (hashSequence.current === sequence) {
          setCalculationError(recommendationStrings.errors.calculation);
        }
      },
    );
  }, [recommendationInput]);
  const currentHash =
    currentHashResult?.input === recommendationInput ? currentHashResult.hash : null;

  const loadPlan = useCallback(
    async (
      input: RecommendationInput,
      inputHash: string,
      options: Readonly<{ allowCache: boolean; announcement?: string }>,
    ) => {
      const isInitialCalculation = plan === null;
      const sequence = calculationSequence.current + 1;
      const startedAt = performance.now();
      calculationSequence.current = sequence;
      calculationInFlight.current = true;
      setCalculationError("");
      setActionError("");
      setIsComputing(true);
      setShowSkeleton(false);
      const skeletonTimer = window.setTimeout(() => {
        if (isInitialCalculation && calculationSequence.current === sequence) {
          setShowSkeleton(true);
        }
      }, 200);

      try {
        const cached = options.allowCache ? await getRecommendationCache(inputHash) : null;
        if (calculationSequence.current !== sequence) return false;
        const cachedPlanIsUsable =
          cached !== null && planReferencesCurrentInput(cached.plan, input);
        const nextPlan = cachedPlanIsUsable
          ? cached.plan
          : await recommendationPlanWorker.build(input);
        if (!planReferencesCurrentInput(nextPlan, input)) {
          throw new Error("Recommendation plan does not match the current catalog context");
        }
        const nextVisible = selectRecommendationPlanEntries(nextPlan, input.policies);
        if (!cachedPlanIsUsable) {
          void saveRecommendationCache({
            schemaVersion: RECOMMENDATION_CACHE_SCHEMA_VERSION,
            engineVersion: RECOMMENDATION_ENGINE_VERSION,
            inputHash,
            plan: nextPlan,
            computedAt: new Date().toISOString(),
          }).catch(() => undefined);
        }
        if (
          isInitialCalculation &&
          performance.now() - startedAt >= 200 &&
          calculationSequence.current === sequence
        ) {
          setShowSkeleton(true);
          await new Promise<void>((resolve) => {
            window.requestAnimationFrame(() => resolve());
          });
        }
        if (calculationSequence.current !== sequence) return false;
        deactivateMotionList();
        setExcludedWorkIds(new Set());
        setPlan(nextPlan);
        setPlanPolicies(input.policies);
        setVisibleEntries(nextVisible);
        setBackfillIds(new Set());
        setDisplayedHash(inputHash);
        if (options.announcement !== undefined) announce(options.announcement);
        return true;
      } catch {
        if (calculationSequence.current === sequence) {
          setCalculationError(recommendationStrings.errors.calculation);
        }
        return false;
      } finally {
        window.clearTimeout(skeletonTimer);
        if (calculationSequence.current === sequence) {
          calculationInFlight.current = false;
          setShowSkeleton(false);
          setIsComputing(false);
        }
      }
    },
    [
      announce,
      deactivateMotionList,
      getRecommendationCache,
      plan,
      recommendationPlanWorker,
      saveRecommendationCache,
    ],
  );

  useEffect(() => {
    if (
      recommendationInput === null ||
      currentHash === null ||
      displayedHash !== null ||
      initialLoadHash.current === currentHash
    ) {
      return;
    }
    initialLoadHash.current = currentHash;
    void loadPlan(recommendationInput, currentHash, { allowCache: true });
  }, [currentHash, displayedHash, loadPlan, recommendationInput]);

  const setWorkBusy = (workId: string, busy: boolean) => {
    setBusyWorkIds((current) => {
      const next = new Set(current);
      if (busy) next.add(workId);
      else next.delete(workId);
      return next;
    });
  };

  const focusAfterDialog = (workId: string | null) => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const target =
          workId === null
            ? null
            : (articleRefs.current.get(workId) ??
              document
                .getElementById(`recommendation-shelf-work-${workId}`)
                ?.querySelector<HTMLAnchorElement>("a"));
        if (target?.isConnected) {
          target.focus();
        } else {
          if (updateButtonRef.current !== null) updateButtonRef.current.focus();
          else document.getElementById("recommendation-page-heading")?.focus();
        }
      });
    });
  };

  const closeFeedback = () => {
    const focusWorkId = feedback?.focusWorkId ?? null;
    setFeedback(null);
    setFeedbackError("");
    focusAfterDialog(focusWorkId);
  };

  const savePlanned = async (entry: RecommendationPlanEntry) => {
    if (
      plannedIds.has(entry.workId) ||
      calculationInFlight.current ||
      policySaveInFlight.current ||
      feedbackBaseInFlight.current
    ) {
      return;
    }
    const work = worksById.get(entry.workId);
    if (work === undefined) return;
    setWorkBusy(entry.workId, true);
    setActionError("");
    try {
      await saveUserWork(
        createRecommendationFeedbackRecord({
          action: "planned",
          workId: entry.workId,
          updatedAt: new Date().toISOString(),
        }),
      );
      setOptimisticPlannedIds((current) => new Set(current).add(entry.workId));
      announce(recommendationStrings.announcements.planned(work.title));
    } catch {
      setActionError(recommendationStrings.errors.feedback);
    } finally {
      setWorkBusy(entry.workId, false);
    }
  };

  const removeForFeedback = async (
    entry: RecommendationPlanEntry,
    kind: PendingRecommendationFeedback["kind"],
  ) => {
    const work = worksById.get(entry.workId);
    if (
      work === undefined ||
      plan === null ||
      calculationInFlight.current ||
      policySaveInFlight.current ||
      feedbackBaseInFlight.current
    ) {
      return;
    }
    feedbackBaseInFlight.current = true;
    setFeedbackBaseBusy(true);
    setWorkBusy(entry.workId, true);
    setActionError("");
    const updatedAt = new Date().toISOString();
    const requestedMotionList = motionListRequest.current;
    try {
      await saveUserWork(
        kind === "completed"
          ? createRecommendationFeedbackRecord({
              action: "completed",
              workId: entry.workId,
              updatedAt,
              reaction: "skip",
            })
          : createRecommendationFeedbackRecord({
              action: "hidden",
              workId: entry.workId,
              updatedAt,
              reasons: [],
            }),
      );
      await requestedMotionList;
      const nextExcludedWorkIds = new Set(excludedWorkIds).add(entry.workId);
      const removedIndex = visibleEntries.findIndex(
        (candidate) => candidate.workId === entry.workId,
      );
      const survivors = visibleEntries.filter((candidate) => candidate.workId !== entry.workId);
      const nextEntries = backfillRecommendationPlanEntries({
        plan,
        survivors,
        excludedWorkIds: [...nextExcludedWorkIds],
        policies: planPolicies ?? policies,
      });
      const survivorIds = new Set(survivors.map((candidate) => candidate.workId));
      const addedIds = new Set(
        nextEntries
          .filter((candidate) => !survivorIds.has(candidate.workId))
          .map((candidate) => candidate.workId),
      );
      const shelf = [anchorEntries, discoveryEntries, completedEntries].find((entries) =>
        entries.some((candidate) => candidate.entry.workId === entry.workId),
      );
      const shelfIndex = shelf?.findIndex((candidate) => candidate.entry.workId === entry.workId);
      const shelfNeighbor =
        shelfIndex === undefined ? undefined : (shelf?.[shelfIndex + 1] ?? shelf?.[shelfIndex - 1]);
      const focusEntry =
        shelfNeighbor?.entry ??
        nextEntries[Math.min(Math.max(removedIndex, 0), nextEntries.length - 1)];
      if (removedIndex >= 0) activateLoadedMotionList();
      setExpandedAnchorId(null);
      setExcludedWorkIds(nextExcludedWorkIds);
      setBackfillIds(addedIds);
      setVisibleEntries(nextEntries);
      announce(
        addedIds.size > 0
          ? recommendationStrings.announcements.removedAndBackfilled
          : recommendationStrings.announcements.removedWithoutBackfill,
      );
      setFeedback({
        kind,
        workId: entry.workId,
        title: work.title,
        updatedAt,
        focusWorkId: focusEntry?.workId ?? null,
      });
    } catch {
      setActionError(recommendationStrings.errors.feedback);
    } finally {
      setWorkBusy(entry.workId, false);
      feedbackBaseInFlight.current = false;
      setFeedbackBaseBusy(false);
    }
  };

  const saveCompletedFeedback = async (
    reaction: Exclude<CompletedRecommendationReaction, "skip">,
  ) => {
    if (feedback?.kind !== "completed") return;
    setFeedbackBusy(true);
    setFeedbackError("");
    try {
      await saveUserWork(
        createRecommendationFeedbackRecord({
          action: "completed",
          workId: feedback.workId,
          updatedAt: feedback.updatedAt,
          reaction,
        }),
      );
      closeFeedback();
    } catch {
      setFeedbackError(recommendationStrings.errors.followUp);
    } finally {
      setFeedbackBusy(false);
    }
  };

  const saveHiddenFeedback = async (reasons: readonly FactorBackedNegativeReasonId[]) => {
    if (feedback?.kind !== "hidden") return;
    setFeedbackBusy(true);
    setFeedbackError("");
    try {
      await saveUserWork(
        createRecommendationFeedbackRecord({
          action: "hidden",
          workId: feedback.workId,
          updatedAt: feedback.updatedAt,
          reasons,
        }),
      );
      closeFeedback();
    } catch {
      setFeedbackError(recommendationStrings.errors.followUp);
    } finally {
      setFeedbackBusy(false);
    }
  };

  const togglePolicy = async (key: VisiblePolicyKey) => {
    if (
      recommendationInput === null ||
      calculationInFlight.current ||
      policySaveInFlight.current ||
      feedbackBaseInFlight.current
    ) {
      return;
    }
    policySaveInFlight.current = true;
    setIsPolicySaving(true);
    const previous = policies;
    const next = { ...previous, [key]: !previous[key] };
    setLocalPolicies(next);
    setActionError("");
    try {
      await savePolicies(next);
    } catch {
      setLocalPolicies(previous);
      setActionError(recommendationStrings.errors.policies);
      policySaveInFlight.current = false;
      setIsPolicySaving(false);
      return;
    }
    const nextInput = { ...recommendationInput, policies: next };
    try {
      const nextHash = await recommendationInputHash(nextInput);
      await loadPlan(nextInput, nextHash, {
        allowCache: true,
        announcement: recommendationStrings.announcements.policiesUpdated,
      });
    } catch {
      setCalculationError(recommendationStrings.errors.calculation);
    } finally {
      policySaveInFlight.current = false;
      setIsPolicySaving(false);
    }
  };

  const updateRecommendations = async () => {
    if (
      recommendationInput === null ||
      currentHash === null ||
      calculationInFlight.current ||
      policySaveInFlight.current ||
      feedbackBaseInFlight.current
    ) {
      return;
    }
    restoreUpdateFocus.current = document.activeElement === updateButtonRef.current;
    await loadPlan(recommendationInput, currentHash, {
      allowCache: true,
      announcement: recommendationStrings.announcements.updated,
    });
  };

  const openPreview = (workId: string) => {
    setPreviewOpener(document.activeElement instanceof HTMLElement ? document.activeElement : null);
    onPreviewOpen?.(workId);
  };

  if (
    status.state === "initializing" ||
    userWorks === undefined ||
    storedAdjustments === undefined ||
    storedPolicies === undefined
  ) {
    return (
      <main className="mx-auto min-h-dvh w-full max-w-[var(--layout-width-media)] px-[var(--layout-page-padding)] pt-[var(--layout-page-block-start)] pb-[calc(var(--layout-mobile-navigation-clearance)+var(--space-8))] md:pb-[var(--space-section-large)] [--recommendation-cover-width:104px]">
        <p aria-live="polite">{recommendationStrings.loading}</p>
      </main>
    );
  }

  const previewExplanation =
    previewEntry === null
      ? null
      : generateTasteExplanation({
          contributions: previewEntry.entry.contributions,
          confidenceLevel: previewEntry.entry.confidenceLevel,
          lexicon: explanationLexicon,
          resolveTitle: (workId) => worksById.get(workId)?.title,
        });
  const hasInvalidEntry = renderedEntries.length !== visibleEntries.length;
  const showInitialError =
    (context === null || calculationError !== "" || hasInvalidEntry) && plan === null;
  const updateDisabled =
    isComputing ||
    isPolicySaving ||
    feedbackBaseBusy ||
    currentHash === null ||
    displayedHash === null ||
    currentHash === displayedHash;
  const preferenceSummary =
    dnaSummary.topPreferences.length === 0
      ? recommendationStrings.tasteSummary.empty
      : dnaSummary.topPreferences
          .map(
            (preference) =>
              explanationLexicon.factorLabels[preference.factorId as ExplanationFactorId] ??
              preference.factorId,
          )
          .join("・");
  const recommendationItems: RecommendationMotionItem[] = featuredEntries.map(
    ({ entry, metadata, work }, index) => ({
      workId: entry.workId,
      animateIn: backfillIds.has(entry.workId),
      content: (
        <RecommendationCard
          articleRef={(element) => {
            if (element === null) articleRefs.current.delete(entry.workId);
            else articleRefs.current.set(entry.workId, element);
          }}
          busy={isComputing || isPolicySaving || feedbackBaseBusy || busyWorkIds.has(entry.workId)}
          coverUrl={recommendationCoverUrls.get(entry.workId)}
          entry={entry}
          onCompleted={() => void removeForFeedback(entry, "completed")}
          onCoverVisible={() => requestCover(entry.workId)}
          onHidden={() => void removeForFeedback(entry, "hidden")}
          onPlanned={() => void savePlanned(entry)}
          onPreview={() => openPreview(entry.workId)}
          onRemovalIntent={requestRemovalMotion}
          planned={plannedIds.has(entry.workId)}
          priority={index === 0}
          resolveTitle={(workId) => worksById.get(workId)?.title}
          volumeCount={metadata.volumeCount}
          work={work}
        />
      ),
    }),
  );
  const showShortageBanner =
    plan !== null &&
    !showInitialError &&
    calculationError === "" &&
    renderedEntries.length >= 1 &&
    renderedEntries.length <= 9 &&
    recommendationItems.length > 0;
  const renderShelfCard = (
    { entry, metadata, work }: (typeof anchorEntries)[number],
    variant: "anchor" | "discovery" | "completed",
  ) => (
    <RecommendationShelfCard
      busy={isComputing || isPolicySaving || feedbackBaseBusy || busyWorkIds.has(entry.workId)}
      coverUrl={recommendationCoverUrls.get(entry.workId)}
      entry={entry}
      expanded={variant === "anchor" && expandedAnchorId === entry.workId}
      itemCaption={itemCaptions.get(entry.workId)}
      key={entry.workId}
      onCompleted={() => void removeForFeedback(entry, "completed")}
      onCoverVisible={() => requestCover(entry.workId)}
      onExpandedChange={(expanded) =>
        setExpandedAnchorId((current) =>
          expanded ? entry.workId : current === entry.workId ? null : current,
        )
      }
      onHidden={() => void removeForFeedback(entry, "hidden")}
      onPlanned={() => void savePlanned(entry)}
      onPreview={() => openPreview(entry.workId)}
      planned={plannedIds.has(entry.workId)}
      resolveTitle={(workId) => worksById.get(workId)?.title}
      variant={variant}
      volumeCount={metadata.volumeCount}
      work={work}
    />
  );

  return (
    <>
      <main
        className="mx-auto w-full max-w-[var(--layout-width-media)] bg-canvas px-[var(--layout-page-padding)] pt-[var(--layout-page-block-start)] pb-[var(--space-8)] md:pb-[var(--space-6)] [--recommendation-cover-width:104px]"
        data-recommendation-input-hash={displayedHash ?? undefined}
      >
        <div className="block w-full min-w-0">
          <div className="block w-full min-w-0">
            <RecommendationShelfNavigation
              availability={shelfAvailability}
              disabled={isComputing || isPolicySaving || feedbackBaseBusy}
              introRef={introRef}
              onSelect={(nextShelf) => {
                restoredShelf.current = nextShelf;
                onShelfChange?.(nextShelf);
                scrollToRecommendationShelf(nextShelf, true);
              }}
            />
            <div className="mb-[var(--space-6)]" id="recommendation-intro" ref={introRef}>
              <header className="mb-[var(--space-4)] flex flex-wrap items-center justify-between gap-x-[var(--space-4)] gap-y-[var(--space-2)]">
                <h1
                  className="font-display text-[length:var(--font-size-28)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  id="recommendation-page-heading"
                  tabIndex={-1}
                >
                  {recommendationStrings.title}
                </h1>
                <Link
                  className="inline-flex min-h-[var(--control-min-size)] shrink-0 items-center text-[length:var(--font-size-14)] font-bold text-text underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  preload={false}
                  to="/taste"
                >
                  {recommendationStrings.criteria.dnaLink}
                </Link>
                <p className="sr-only">{recommendationStrings.description}</p>
              </header>

              <RecommendationCriteriaSummary
                preferenceSummary={preferenceSummary}
                recordCount={profileRecords.length}
              />

              {status.state === "degraded" ? (
                <p
                  className="mb-[var(--space-4)] rounded-[var(--radius-card)] border border-warn bg-surface-1 px-[var(--space-4)] py-[var(--space-3)]"
                  role="status"
                >
                  {recommendationStrings.storageWarning}
                </p>
              ) : null}

              <RecommendationFilterBar
                disabled={isComputing || isPolicySaving || feedbackBaseBusy}
                genre={genre}
                onGenreChange={onGenreChange}
                onPolicyToggle={(key) => void togglePolicy(key)}
                onUpdate={() => {
                  if (recommendationInput === null) window.location.reload();
                  else void updateRecommendations();
                }}
                pending={
                  displayedHash !== null && currentHash !== null && displayedHash !== currentHash
                }
                policies={policies}
                policyUpdating={isPolicySaving}
                updateButtonRef={updateButtonRef}
                updateDisabled={updateDisabled}
                updating={isComputing}
              />

              {actionError ? (
                <p
                  className="mt-[var(--space-4)] rounded-[var(--radius-card)] border border-warn bg-surface-1 px-[var(--space-4)] py-[var(--space-3)]"
                  role="alert"
                >
                  {actionError}
                </p>
              ) : null}
              {calculationError && plan !== null ? (
                <p
                  className="mt-[var(--space-4)] rounded-[var(--radius-card)] border border-warn bg-surface-1 px-[var(--space-4)] py-[var(--space-3)]"
                  role="alert"
                >
                  {calculationError}
                </p>
              ) : null}
            </div>

            {showSkeleton ? (
              <FeaturedRecommendationState>
                <RecommendationsSkeleton />
              </FeaturedRecommendationState>
            ) : showInitialError ? (
              <FeaturedRecommendationState>
                <section
                  className="grid gap-[var(--space-3)] rounded-[var(--radius-card)] border border-line bg-surface-1 p-[var(--space-6)]"
                  role="alert"
                >
                  <h2>{recommendationStrings.errors.calculation}</h2>
                  <Button
                    className="min-w-[calc(var(--control-min-size)*2)] min-h-[var(--control-min-size)] border-line bg-surface-1 px-[var(--space-4)] py-[var(--space-content)] font-bold"
                    onClick={() => {
                      if (recommendationInput === null) window.location.reload();
                      else void updateRecommendations();
                    }}
                    type="button"
                    variant="outline"
                  >
                    {recommendationStrings.errors.retry}
                  </Button>
                </section>
              </FeaturedRecommendationState>
            ) : plan === null ? (
              <FeaturedRecommendationState>{null}</FeaturedRecommendationState>
            ) : renderedEntries.length === 0 ? (
              <FeaturedRecommendationState>
                <section className="grid justify-items-start gap-[var(--space-3)] rounded-[var(--radius-card)] border border-line bg-surface-1 p-[var(--space-6)]">
                  <h2>{recommendationStrings.empty.title}</h2>
                  <p>{recommendationStrings.empty.description}</p>
                  <Link
                    className="inline-flex min-h-[var(--control-min-size)] items-center font-bold text-accent underline underline-offset-[var(--space-content-tight)] transition-transform duration-[var(--motion-duration-press)] active:scale-[0.97] motion-reduce:transform-none motion-reduce:transition-none"
                    preload={false}
                    to="/taste"
                  >
                    {recommendationStrings.empty.link}
                  </Link>
                </section>
              </FeaturedRecommendationState>
            ) : recommendationItems.length === 0 ? (
              <FeaturedRecommendationState>
                <p className="rounded-[var(--radius-card)] border border-line p-[var(--space-5)] text-text-muted">
                  {recommendationStrings.filters.empty}
                </p>
              </FeaturedRecommendationState>
            ) : (
              <div>
                <span
                  aria-hidden="true"
                  className="scroll-mt-[var(--space-4)] md:scroll-mt-[calc(var(--control-min-size)+var(--space-2))]"
                  id="recommendation-shelf-featured"
                />
                <MediaShelf
                  className="scroll-mt-[var(--space-4)] md:scroll-mt-[calc(var(--control-min-size)+var(--space-2))]"
                  controlsPlacement="overlay"
                  description={recommendationStrings.shelves.featured.description}
                  enableLoop
                  listType="unordered"
                  compactHeading
                  title={recommendationStrings.shelves.featured.title}
                  trackClassName={RECOMMENDATION_CAROUSEL_TRACK_CLASSNAME}
                  trackData={{
                    "data-recommendation-motion": MotionList === null ? "static" : "enabled",
                  }}
                >
                  {MotionList === null ? (
                    <StaticRecommendationItems items={recommendationItems} />
                  ) : (
                    <MotionList items={recommendationItems} reducedMotion={false} shortage={null} />
                  )}
                </MediaShelf>
                {showShortageBanner ? (
                  <section
                    aria-labelledby="recommendation-shortage-heading"
                    className="relative mt-[var(--space-4)] h-[150px] overflow-hidden rounded-[var(--radius-card)] md:h-[176px]"
                  >
                    <img
                      alt=""
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 size-full object-cover object-[78%_50%]"
                      src="/media/recommendations-shortage-books.png"
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-r from-canvas from-35% to-transparent to-70%"
                    />
                    <div className="relative z-10 grid h-full content-center justify-items-start gap-[var(--space-2)] p-[var(--space-3)] md:max-w-[55%] md:p-[var(--space-5)]">
                      <h2
                        className="text-[length:var(--font-size-14)] leading-snug font-bold text-text-strong md:text-[length:var(--text-subheading-size)]"
                        id="recommendation-shortage-heading"
                      >
                        {recommendationStrings.shortage.title}
                      </h2>
                      <p className="hidden text-text-muted md:block">
                        {recommendationStrings.shortage.description}
                      </p>
                      <div className="flex flex-nowrap items-center gap-x-[var(--space-4)]">
                        <Link
                          className="inline-flex min-h-[var(--control-min-size)] shrink-0 items-center font-bold text-accent underline underline-offset-[var(--space-content-tight)] transition-transform duration-[var(--motion-duration-press)] active:scale-[0.97] motion-reduce:transform-none motion-reduce:transition-none"
                          preload={false}
                          to="/onboarding"
                        >
                          {recommendationStrings.shortage.addWorks}
                        </Link>
                        <Link
                          className="inline-flex min-h-[var(--control-min-size)] shrink-0 items-center font-bold text-accent underline underline-offset-[var(--space-content-tight)] transition-transform duration-[var(--motion-duration-press)] active:scale-[0.97] motion-reduce:transform-none motion-reduce:transition-none"
                          preload={false}
                          to="/taste"
                        >
                          {recommendationStrings.shortage.reviewTaste}
                        </Link>
                      </div>
                    </div>
                  </section>
                ) : null}
              </div>
            )}

            <span
              aria-hidden="true"
              className="scroll-mt-[var(--space-4)] md:scroll-mt-[calc(var(--control-min-size)+var(--space-2))]"
              id="recommendation-shelf-anchor"
            />
            <div
              onPointerLeave={(event) => {
                if (!event.currentTarget.contains(document.activeElement))
                  setExpandedAnchorId(null);
              }}
            >
              <MediaShelf
                className="mt-[var(--space-section)] scroll-mt-[var(--space-4)] md:scroll-mt-[calc(var(--control-min-size)+var(--space-2))]"
                compactHeading
                controlsPlacement="overlay"
                description={recommendationStrings.shelves.anchor.description}
                enableLoop={false}
                onPageChange={() => setExpandedAnchorId(null)}
                title={recommendationStrings.shelves.anchor.title}
                trackClassName="!pb-[var(--space-1)] has-[[data-expansion-active]]:!snap-none"
              >
                {anchorEntries.map((item) => renderShelfCard(item, "anchor"))}
              </MediaShelf>
            </div>

            <PopularWorkDiscovery />

            <span
              aria-hidden="true"
              className="scroll-mt-[var(--space-4)] md:scroll-mt-[calc(var(--control-min-size)+var(--space-2))]"
              id="recommendation-shelf-discovery"
            />
            <MediaShelf
              className="mt-[var(--space-section)] scroll-mt-[var(--space-4)] md:scroll-mt-[calc(var(--control-min-size)+var(--space-2))]"
              compactHeading
              controlsPlacement="overlay"
              description={recommendationStrings.shelves.discovery.description}
              enableLoop={false}
              title={recommendationStrings.shelves.discovery.title}
              trackClassName="!pb-[var(--space-1)]"
            >
              {discoveryEntries.map((item) => renderShelfCard(item, "discovery"))}
            </MediaShelf>

            <span
              aria-hidden="true"
              className="scroll-mt-[var(--space-4)] md:scroll-mt-[calc(var(--control-min-size)+var(--space-2))]"
              id="recommendation-shelf-completed"
            />
            <MediaShelf
              className="mt-[var(--space-section)] scroll-mt-[var(--space-4)] md:scroll-mt-[calc(var(--control-min-size)+var(--space-2))]"
              compactHeading
              controlsPlacement="overlay"
              description={recommendationStrings.shelves.completed.description}
              enableLoop={false}
              title={recommendationStrings.shelves.completed.title}
              trackClassName="!pb-[var(--space-1)]"
            >
              {completedEntries.map((item) => renderShelfCard(item, "completed"))}
            </MediaShelf>

            <span
              aria-hidden="true"
              className="scroll-mt-[var(--space-4)] md:scroll-mt-[calc(var(--control-min-size)+var(--space-2))]"
              id="recommendation-shelf-ranking"
            />
            <RankingShelf
              className="mt-[var(--space-section)] scroll-mt-[var(--space-4)] md:scroll-mt-[calc(var(--control-min-size)+var(--space-2))]"
              compactHeading
              controlsPlacement="overlay"
              description={recommendationStrings.shelves.ranking.description}
              rankingKind="personalized-ranking"
              title={recommendationStrings.shelves.ranking.title}
              trackClassName="!pb-[var(--space-1)]"
            >
              {renderedEntries.slice(0, 10).map(({ entry, work }, index) => {
                const genreLabels = work.genres
                  .slice(0, 3)
                  .map((genre) => onboardingStrings.step1.genreLabels[genre])
                  .join(" · ");

                return (
                  <RankingCard
                    coverUrl={recommendationCoverUrls.get(entry.workId)}
                    creators={work.creators}
                    key={entry.workId}
                    metadata={genreLabels}
                    metadataAccessibleLabel={genreLabels}
                    onCoverVisible={() => requestCover(entry.workId)}
                    position={index + 1}
                    priority={featuredEntries.length === 0 && index === 0}
                    rankingKind="personalized-ranking"
                    title={work.title}
                    workId={work.id}
                  />
                );
              })}
            </RankingShelf>
            <FeedbackImpactSummary
              completedCount={
                records.filter((record) => record.readingState === "completed").length
              }
              hiddenCount={records.filter((record) => record.readingState === "hidden").length}
            />
          </div>
        </div>

        {feedback !== null || previewEntry !== null ? (
          <Suspense fallback={null}>
            {feedback !== null ? (
              <FeedbackDialog
                busy={feedbackBusy}
                errorMessage={feedbackError}
                feedback={feedback}
                onSaveCompleted={(reaction) => void saveCompletedFeedback(reaction)}
                onSaveHidden={(reasons) => void saveHiddenFeedback(reasons)}
                onSkip={closeFeedback}
              />
            ) : null}
            {previewEntry !== null ? (
              <QuickPreviewDialog
                busy={
                  isComputing ||
                  isPolicySaving ||
                  feedbackBaseBusy ||
                  busyWorkIds.has(previewEntry.entry.workId)
                }
                coverUrl={recommendationCoverUrls.get(previewEntry.entry.workId)}
                explanation={previewExplanation}
                opener={previewOpener}
                onCompleted={() => {
                  onPreviewClose?.();
                  void removeForFeedback(previewEntry.entry, "completed");
                }}
                onHidden={() => {
                  onPreviewClose?.();
                  void removeForFeedback(previewEntry.entry, "hidden");
                }}
                onCoverVisible={() => requestCover(previewEntry.entry.workId)}
                onOpenChange={(open) => {
                  if (!open) onPreviewClose?.();
                }}
                onPlanned={() => void savePlanned(previewEntry.entry)}
                onRemovalIntent={requestRemovalMotion}
                open
                planned={plannedIds.has(previewEntry.entry.workId)}
                volumeCount={previewEntry.metadata.volumeCount}
                work={previewEntry.work}
              />
            ) : null}
          </Suspense>
        ) : null}
        <p
          aria-atomic="true"
          aria-live="polite"
          className="fixed right-[var(--layout-page-padding)] bottom-[calc(var(--layout-mobile-navigation-clearance)+var(--space-4))] z-40 max-w-[min(calc(var(--layout-width-form)/2),calc(100vw-(var(--layout-page-padding)*2)))] rounded-[var(--radius-card)] border border-line border-l-[length:var(--space-content-tight)] border-l-accent bg-surface-1 px-[var(--space-4)] py-[var(--space-3)] font-bold shadow-[var(--shadow-raised)] empty:hidden md:bottom-[var(--space-6)]"
        >
          {liveAnnouncement.text === "" ? null : (
            <span key={liveAnnouncement.sequence}>{liveAnnouncement.text}</span>
          )}
        </p>
      </main>
    </>
  );
}
