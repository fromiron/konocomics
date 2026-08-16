"use client";

import { Link } from "@tanstack/react-router";
import type { ComponentType, ReactNode } from "react";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";

import { Button } from "@/components/design-system/button";
import { ChoiceChipCheckbox } from "@/components/design-system/choice-chip";
import { NativeSelect } from "@/components/design-system/native-select";
import { SiteFooter } from "@/components/layout/site-footer";
import { MediaPosterCard } from "@/components/media/media-poster-card";
import { MediaShelf } from "@/components/media/media-shelf";
import { QuickPreviewDialog } from "@/components/media/quick-preview-dialog";
import { RankingShelf } from "@/components/media/ranking-shelf";
import recommendationContextJson from "@/data/generated/recommendation-context-v1.json";
import { GENRE_TAGS } from "@/domain/catalog/constants";
import type { GenreTag } from "@/domain/catalog/types";
import type { ExplanationFactorId } from "@/domain/explanation";
import { generateTasteExplanation } from "@/domain/explanation/generate";
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
import { recommendationContextSchema } from "@/domain/recommendation/context-schema";
import {
  RECOMMENDATION_CACHE_SCHEMA_VERSION,
  RECOMMENDATION_ENGINE_VERSION,
  serializeRecommendationInput,
} from "@/domain/recommendation/input-hash";
import {
  backfillRecommendationPlanEntries,
  buildRecommendationPlan,
  selectRecommendationPlanEntries,
} from "@/domain/recommendation/rank";
import type { RecommendationInput, RecommendationPlanEntry } from "@/domain/recommendation/types";
import { useCatalog } from "@/features/catalog/catalog-provider";
import { usePersistence } from "@/infrastructure/db";
import { recommendationStrings, explanationLexicon } from "@/lib/strings";

import { FeedbackDialog, type PendingRecommendationFeedback } from "./feedback-dialog";
import { RecommendationCard } from "./recommendation-card";
import {
  createRecommendationCoverTargets,
  useRecommendationCovers,
} from "./recommendation-cover-resolver";
import { loadRecommendationMotionList } from "./recommendation-motion-loader";
import type {
  RecommendationMotionItem,
  RecommendationMotionListProps,
} from "./recommendation-motion-list";

const DEFAULT_POLICIES: RecommendationPolicies = {
  preferCompleted: false,
  preferHidden: false,
  preferVerified: false,
  excludeIncomplete: false,
};
const EMPTY_ADJUSTMENTS: ProfileAdjustments = { axes: {}, themes: {} };
const EMPTY_RECORDS: readonly UserWorkRecord[] = [];
const VISIBLE_POLICY_KEYS = ["preferCompleted", "preferHidden", "preferVerified"] as const;
const RECOMMENDATION_SHELVES = ["featured", "anchor", "discovery", "completed", "ranking"] as const;
const parsedRecommendationContext =
  recommendationContextSchema.safeParse(recommendationContextJson);

type VisiblePolicyKey = (typeof VISIBLE_POLICY_KEYS)[number];
type RecommendationMotionListComponent = ComponentType<RecommendationMotionListProps>;
type MotionFocusTarget = Readonly<{
  workId: string;
  action: "completed" | "hidden" | null;
}>;
type RecommendationShelf = (typeof RECOMMENDATION_SHELVES)[number];

type RecommendationsFlowProps = Readonly<{
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
  shortage,
}: Readonly<{ items: readonly RecommendationMotionItem[]; shortage: ReactNode }>) {
  return (
    <>
      {items.map((item) => (
        <li
          className="basis-[var(--featured-card-basis)] shrink-0 snap-start overflow-visible [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:has-[article[data-expanded]]:basis-[calc(var(--control-min-size)*8)]"
          data-recommendation-work-id={item.workId}
          key={item.workId}
        >
          {item.content}
        </li>
      ))}
      {shortage}
    </>
  );
}

function FeaturedRecommendationState({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <section
      aria-labelledby="recommendation-featured-heading"
      className="grid scroll-mt-[calc(var(--desktop-navigation-height)+var(--space-4))] gap-[var(--space-content)]"
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
  const positiveAnchorIds = new Set(
    input.records
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
        contribution.anchorWorkIds.some((workId) => !catalogWorkIds.has(workId)),
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
  genre,
  onGenreChange,
  onPreviewClose,
  onPreviewOpen,
  onShelfChange,
  previewWorkId,
  shelf,
}: RecommendationsFlowProps = {}) {
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
  const calculationSequence = useRef(0);
  const calculationInFlight = useRef(false);
  const hashSequence = useRef(0);
  const initialLoadHash = useRef<string | null>(null);
  const policySaveInFlight = useRef(false);
  const feedbackBaseInFlight = useRef(false);
  const [excludedWorkIds, setExcludedWorkIds] = useState<ReadonlySet<string>>(new Set());
  const articleRefs = useRef(new Map<string, HTMLElement>());
  const updateButtonRef = useRef<HTMLButtonElement>(null);
  const motionAllowed = useRef(false);
  const motionListActive = useRef(false);
  const loadedMotionList = useRef<RecommendationMotionListComponent | null>(null);
  const motionListRequest = useRef<Promise<void> | null>(null);
  const pendingMotionFocus = useRef<MotionFocusTarget | null>(null);
  const previewOpener = useRef<HTMLElement | null>(null);
  const previousPreviewWorkId = useRef<string | null>(null);
  const records = userWorks ?? EMPTY_RECORDS;
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
      !parsedRecommendationContext.success
    ) {
      return null;
    }
    return {
      catalog,
      records: userWorks,
      adjustments,
      policies,
      context: parsedRecommendationContext.data,
    };
  }, [adjustments, catalog, policies, storedAdjustments, storedPolicies, userWorks]);
  const dnaSummary = useMemo(
    () => summarizeMangaDna(catalog.works, records),
    [catalog.works, records],
  );
  const plannedIds = useMemo(() => {
    const ids = new Set(optimisticPlannedIds);
    records.forEach((record) => {
      if (record.readingState === "planned") ids.add(record.workId);
    });
    return ids;
  }, [optimisticPlannedIds, records]);
  const coverWorkIds = useMemo(
    () => (plan ?? visibleEntries).slice(0, 18).map((entry) => entry.workId),
    [plan, visibleEntries],
  );
  const recommendationCoverTargets = useMemo(
    () => createRecommendationCoverTargets(catalog, coverWorkIds),
    [catalog, coverWorkIds],
  );
  const { coverUrls: recommendationCoverUrls, notifyCoverSettled } = useRecommendationCovers({
    targets: recommendationCoverTargets,
    getProviderCache,
    saveProviderCache,
  });
  const recommendationCoverTargetsByWorkId = useMemo(
    () => new Map(recommendationCoverTargets.map((target) => [target.workId, target] as const)),
    [recommendationCoverTargets],
  );
  const announce = useCallback((text: string) => {
    setLiveAnnouncement((current) => ({ sequence: current.sequence + 1, text }));
  }, []);

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

  useLayoutEffect(() => {
    const currentPreviewWorkId = previewWorkId ?? null;
    if (previousPreviewWorkId.current !== null && currentPreviewWorkId === null) {
      const opener = previewOpener.current;
      previewOpener.current = null;
      if (opener?.isConnected) opener.focus();
    }
    previousPreviewWorkId.current = currentPreviewWorkId;
  }, [previewWorkId]);

  useEffect(() => {
    if (shelf === undefined) return;
    document.getElementById(`recommendation-shelf-${shelf}`)?.scrollIntoView({ block: "start" });
  }, [plan, shelf]);

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
      const sequence = calculationSequence.current + 1;
      const startedAt = performance.now();
      calculationSequence.current = sequence;
      calculationInFlight.current = true;
      setCalculationError("");
      setActionError("");
      setIsComputing(true);
      setShowSkeleton(false);
      const skeletonTimer = window.setTimeout(() => {
        if (calculationSequence.current === sequence) setShowSkeleton(true);
      }, 200);

      try {
        const cached = options.allowCache ? await getRecommendationCache(inputHash) : null;
        const cachedPlanIsUsable =
          cached !== null && planReferencesCurrentInput(cached.plan, input);
        const nextPlan = cachedPlanIsUsable ? cached.plan : buildRecommendationPlan(input);
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
        if (performance.now() - startedAt >= 200 && calculationSequence.current === sequence) {
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
    [announce, deactivateMotionList, getRecommendationCache, saveRecommendationCache],
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
        if (workId !== null && articleRefs.current.get(workId)?.isConnected) {
          articleRefs.current.get(workId)?.focus();
        } else {
          updateButtonRef.current?.focus();
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
      const focusEntry = nextEntries[Math.min(Math.max(removedIndex, 0), nextEntries.length - 1)];
      activateLoadedMotionList();
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
    await loadPlan(recommendationInput, currentHash, {
      allowCache: false,
      announcement: recommendationStrings.announcements.updated,
    });
  };

  const openPreview = (workId: string) => {
    previewOpener.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    onPreviewOpen?.(workId);
  };

  if (
    status.state === "initializing" ||
    userWorks === undefined ||
    storedAdjustments === undefined ||
    storedPolicies === undefined
  ) {
    return (
      <main className="mx-auto min-h-dvh w-full max-w-[var(--layout-width-media)] px-[var(--layout-page-padding)] pt-[var(--layout-page-block-start)] pb-[calc(var(--layout-mobile-navigation-clearance)+var(--space-8))] md:pb-[var(--space-section-large)] [--recommendation-cover-width:96px]">
        <p aria-live="polite">{recommendationStrings.loading}</p>
      </main>
    );
  }

  const renderedEntries = visibleEntries.flatMap((entry) => {
    const work = worksById.get(entry.workId);
    const metadata = parsedRecommendationContext.success
      ? parsedRecommendationContext.data.constraintByWorkId[entry.workId]
      : undefined;
    return work === undefined || metadata === undefined ? [] : [{ entry, metadata, work }];
  });
  const featuredEntries =
    genre === undefined
      ? renderedEntries
      : renderedEntries.filter(({ work }) => work.genres.includes(genre));
  const allPlanEntries = (plan ?? []).flatMap((entry) => {
    if (excludedWorkIds.has(entry.workId)) return [];
    const work = worksById.get(entry.workId);
    const metadata = parsedRecommendationContext.success
      ? parsedRecommendationContext.data.constraintByWorkId[entry.workId]
      : undefined;
    return work === undefined || metadata === undefined ? [] : [{ entry, metadata, work }];
  });
  const visibleWorkIds = new Set(visibleEntries.map((entry) => entry.workId));
  const auxiliaryEntries = allPlanEntries
    .filter(
      ({ entry, work }) =>
        !visibleWorkIds.has(entry.workId) && (genre === undefined || work.genres.includes(genre)),
    )
    .slice(0, 18);
  const usedAuxiliaryIds = new Set<string>();
  const discoveryEntries = auxiliaryEntries.filter(({ entry }) => entry.isDiscovery).slice(0, 6);
  discoveryEntries.forEach(({ entry }) => usedAuxiliaryIds.add(entry.workId));
  const completedEntries = auxiliaryEntries
    .filter(({ entry, work }) => work.status === "completed" && !usedAuxiliaryIds.has(entry.workId))
    .slice(0, 6);
  completedEntries.forEach(({ entry }) => usedAuxiliaryIds.add(entry.workId));
  const anchorEntries = auxiliaryEntries
    .filter(({ entry }) => !usedAuxiliaryIds.has(entry.workId))
    .slice(0, 6);
  const previewEntry = allPlanEntries.find(({ entry }) => entry.workId === previewWorkId) ?? null;
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
    (!parsedRecommendationContext.success || calculationError !== "" || hasInvalidEntry) &&
    plan === null;
  const updateDisabled =
    isComputing ||
    isPolicySaving ||
    feedbackBaseBusy ||
    currentHash === null ||
    displayedHash === null ||
    currentHash === displayedHash;
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
          onCoverSettled={
            index === 0 && recommendationCoverUrls.has(entry.workId)
              ? () => {
                  const target = recommendationCoverTargetsByWorkId.get(entry.workId);
                  if (target !== undefined) notifyCoverSettled(target);
                }
              : undefined
          }
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
  const shortageItem =
    renderedEntries.length < 10 ? (
      <li
        className="grid basis-[var(--featured-card-basis)] shrink-0 snap-start gap-[var(--space-3)] overflow-visible rounded-[var(--radius-card)] border border-line bg-surface-1 p-[var(--space-6)]"
        key="recommendation-shortage"
      >
        <h2>{recommendationStrings.shortage.title}</h2>
        <p>{recommendationStrings.shortage.description}</p>
        <div className="flex flex-wrap gap-[var(--space-content)]">
          <Link
            className="inline-flex min-h-[var(--control-min-size)] items-center font-bold text-accent underline underline-offset-[var(--space-content-tight)] transition-transform duration-[var(--motion-duration-press)] active:scale-[0.97] motion-reduce:transform-none motion-reduce:transition-none"
            preload={false}
            to="/onboarding"
          >
            {recommendationStrings.shortage.addWorks}
          </Link>
          <Link
            className="inline-flex min-h-[var(--control-min-size)] items-center font-bold text-accent underline underline-offset-[var(--space-content-tight)] transition-transform duration-[var(--motion-duration-press)] active:scale-[0.97] motion-reduce:transform-none motion-reduce:transition-none"
            preload={false}
            to="/taste"
          >
            {recommendationStrings.shortage.reviewTaste}
          </Link>
        </div>
      </li>
    ) : null;
  const renderPoster = ({ entry, work }: (typeof allPlanEntries)[number], index: number) => (
    <div
      className="grid w-[calc(var(--control-min-size)*3.5)] shrink-0 snap-start content-start gap-[var(--space-content)]"
      key={entry.workId}
    >
      <MediaPosterCard
        className="!w-full"
        coverUrl={recommendationCoverUrls.get(entry.workId)}
        creators={work.creators}
        metadata={explanationLexicon.confidenceLabels[entry.confidenceLevel]}
        priority={index === 0}
        title={work.title}
        workId={work.id}
      />
      <Button
        className="w-full min-h-[var(--control-min-size)] overflow-hidden text-ellipsis"
        onClick={() => openPreview(entry.workId)}
        type="button"
        variant="outline"
      >
        {recommendationStrings.quickPreview.open(work.title)}
      </Button>
    </div>
  );

  return (
    <>
      <main
        className="mx-auto min-h-dvh w-full max-w-[var(--layout-width-media)] bg-canvas px-[var(--layout-page-padding)] pt-[var(--layout-page-block-start)] pb-[calc(var(--layout-mobile-navigation-clearance)+var(--space-8))] md:pb-[var(--space-section-large)] [--recommendation-cover-width:96px]"
        data-recommendation-input-hash={displayedHash ?? undefined}
      >
        <div className="block w-full min-w-0">
          <div className="block w-full min-w-0">
            <header className="mb-[var(--space-5)] grid gap-[var(--space-content)] lg:mb-[var(--space-3)] lg:grid-cols-[auto_minmax(0,1fr)] lg:items-baseline lg:gap-[var(--space-4)]">
              <h1 className="font-display">{recommendationStrings.title}</h1>
              <p className="text-text-muted">{recommendationStrings.description}</p>
            </header>

            <section className="mb-[var(--space-4)] grid grid-cols-1 gap-[var(--space-3)] rounded-[var(--radius-card)] border border-line bg-surface-1 p-[var(--space-3)] min-[360px]:grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_auto] md:items-center lg:mb-[var(--space-3)]">
              <div className="grid gap-[var(--space-content)]">
                <h2>{recommendationStrings.criteria.heading}</h2>
                <p className="sr-only text-text-muted sm:not-sr-only">
                  {recommendationStrings.criteria.description}
                </p>
              </div>
              <dl className="m-0 grid grid-cols-3 gap-[var(--space-content)] min-[360px]:col-span-2 md:col-span-1">
                <div className="grid gap-[var(--space-content-tight)] rounded-[var(--radius-control)] border border-line bg-surface-2 p-[var(--space-content)]">
                  <dt className="text-[length:var(--text-caption-size)] text-text-muted">
                    {recommendationStrings.criteria.records}
                  </dt>
                  <dd className="m-0 font-bold text-text-strong">
                    {recommendationStrings.criteria.recordCount(records.length)}
                  </dd>
                </div>
                <div className="grid gap-[var(--space-content-tight)] rounded-[var(--radius-control)] border border-line bg-surface-2 p-[var(--space-content)]">
                  <dt className="text-[length:var(--text-caption-size)] text-text-muted">
                    {recommendationStrings.criteria.preferences}
                  </dt>
                  <dd className="m-0 line-clamp-2 font-bold text-text-strong">
                    {dnaSummary.topPreferences.length === 0
                      ? recommendationStrings.tasteSummary.empty
                      : dnaSummary.topPreferences
                          .map(
                            (preference) =>
                              explanationLexicon.factorLabels[
                                preference.factorId as ExplanationFactorId
                              ] ?? preference.factorId,
                          )
                          .join("・")}
                  </dd>
                </div>
                <div className="grid gap-[var(--space-content-tight)] rounded-[var(--radius-control)] border border-line bg-surface-2 p-[var(--space-content)]">
                  <dt className="text-[length:var(--text-caption-size)] text-text-muted">
                    {recommendationStrings.criteria.policies}
                  </dt>
                  <dd className="m-0 font-bold text-text-strong">
                    {recommendationStrings.criteria.policyCount(
                      VISIBLE_POLICY_KEYS.filter((key) => policies[key]).length,
                    )}
                  </dd>
                </div>
              </dl>
              <Link
                className="inline-flex min-h-[var(--control-min-size)] items-center justify-self-start font-bold text-accent min-[360px]:col-start-2 min-[360px]:row-start-1 md:col-auto md:row-auto"
                preload={false}
                to="/taste"
              >
                {recommendationStrings.tasteSummary.link}
              </Link>
            </section>

            {status.state === "degraded" ? (
              <p
                className="mb-[var(--space-4)] rounded-[var(--radius-card)] border border-warn bg-surface-1 px-[var(--space-4)] py-[var(--space-3)]"
                role="status"
              >
                {recommendationStrings.storageWarning}
              </p>
            ) : null}

            <section
              aria-labelledby="recommendation-policy-heading"
              className="mb-[var(--space-5)] grid gap-[var(--space-3)] rounded-[var(--radius-card)] border border-line bg-surface-1 p-[var(--space-3)] min-[360px]:grid-cols-[minmax(0,1fr)_auto] min-[360px]:items-end lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)_auto]"
            >
              <div className="grid grid-cols-3 gap-[var(--space-content)] min-[360px]:col-span-2 lg:col-span-1">
                <label className="grid min-w-0 gap-[var(--space-content-tight)] text-[length:var(--text-caption-size)] font-bold text-text-muted">
                  <span>{recommendationStrings.filters.genre}</span>
                  <NativeSelect
                    className="min-w-0 [&_[data-slot=native-select]]:bg-surface-2 [&_[data-slot=native-select]]:text-text-strong"
                    onChange={(event) => {
                      const nextGenre = GENRE_TAGS.find(
                        (candidate) => candidate === event.currentTarget.value,
                      );
                      onGenreChange?.(nextGenre);
                    }}
                    value={genre ?? ""}
                  >
                    <option value="">{recommendationStrings.filters.allGenres}</option>
                    {GENRE_TAGS.map((genreTag) => (
                      <option key={genreTag} value={genreTag}>
                        {explanationLexicon.factorLabels[genreTag]}
                      </option>
                    ))}
                  </NativeSelect>
                </label>
                <label className="grid min-w-0 gap-[var(--space-content-tight)] text-[length:var(--text-caption-size)] font-bold text-text-muted">
                  <span>{recommendationStrings.filters.shelf}</span>
                  <NativeSelect
                    className="min-w-0 [&_[data-slot=native-select]]:bg-surface-2 [&_[data-slot=native-select]]:text-text-strong"
                    onChange={(event) => {
                      const nextShelf = RECOMMENDATION_SHELVES.find(
                        (candidate) => candidate === event.currentTarget.value,
                      );
                      onShelfChange?.(nextShelf);
                    }}
                    value={shelf ?? ""}
                  >
                    <option value="">{recommendationStrings.filters.allShelves}</option>
                    <option value="featured">{recommendationStrings.shelves.featured.title}</option>
                    <option value="anchor">{recommendationStrings.shelves.anchor.title}</option>
                    <option value="discovery">
                      {recommendationStrings.shelves.discovery.title}
                    </option>
                    <option value="completed">
                      {recommendationStrings.shelves.completed.title}
                    </option>
                    <option value="ranking">{recommendationStrings.shelves.ranking.title}</option>
                  </NativeSelect>
                </label>
                <div className="grid min-w-0 gap-[var(--space-content-tight)] text-[length:var(--text-caption-size)] font-bold text-text-muted">
                  <span>{recommendationStrings.filters.sort}</span>
                  <span className="inline-flex min-h-[var(--control-min-size)] min-w-0 items-center rounded-[var(--radius-control)] border border-line bg-surface-2 px-[var(--space-3)] text-text-strong">
                    {recommendationStrings.filters.recommended}
                  </span>
                </div>
              </div>
              <fieldset className="m-0 min-w-0 border-0 p-0">
                <legend
                  className="mb-[var(--space-content)] p-0 font-bold text-text-strong lg:mb-[var(--space-content-tight)]"
                  id="recommendation-policy-heading"
                >
                  {recommendationStrings.policiesHeading}
                </legend>
                <div className="grid grid-cols-3 gap-[var(--space-content)]">
                  {VISIBLE_POLICY_KEYS.map((key) => (
                    <ChoiceChipCheckbox
                      checked={policies[key]}
                      chipClassName="w-full px-[var(--space-content-tight)] py-[var(--space-content-tight)] text-center text-[length:var(--font-size-12)] leading-tight md:text-[length:var(--font-size-14)]"
                      className="w-full min-w-0"
                      disabled={isComputing || isPolicySaving || feedbackBaseBusy}
                      key={key}
                      onCheckedChange={() => void togglePolicy(key)}
                    >
                      {recommendationStrings.policyLabels[key]}
                    </ChoiceChipCheckbox>
                  ))}
                </div>
              </fieldset>
              <div className="flex items-center justify-between gap-[var(--space-3)]">
                {displayedHash !== null && currentHash !== null && displayedHash !== currentHash ? (
                  <p className="text-[length:var(--text-caption-size)] text-text-muted">
                    {recommendationStrings.pendingChanges}
                  </p>
                ) : null}
                <Button
                  className="min-w-[calc(var(--control-min-size)*2)] min-h-[var(--control-min-size)] border-line bg-surface-1 px-[var(--space-4)] py-[var(--space-content)] font-bold"
                  busy={isComputing}
                  disabled={updateDisabled}
                  onClick={() => {
                    if (recommendationInput === null) window.location.reload();
                    else void updateRecommendations();
                  }}
                  ref={updateButtonRef}
                  type="button"
                  variant="outline"
                >
                  {isComputing ? recommendationStrings.updating : recommendationStrings.update}
                </Button>
              </div>
            </section>

            {actionError ? (
              <p
                className="mb-[var(--space-4)] rounded-[var(--radius-card)] border border-warn bg-surface-1 px-[var(--space-4)] py-[var(--space-3)]"
                role="alert"
              >
                {actionError}
              </p>
            ) : null}
            {calculationError && plan !== null ? (
              <p
                className="mb-[var(--space-4)] rounded-[var(--radius-card)] border border-warn bg-surface-1 px-[var(--space-4)] py-[var(--space-3)]"
                role="alert"
              >
                {calculationError}
              </p>
            ) : null}

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
            ) : plan === null || isComputing ? (
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
              <>
                <span
                  aria-hidden="true"
                  className="scroll-mt-[calc(var(--desktop-navigation-height)+var(--space-4))]"
                  id="recommendation-shelf-featured"
                />
                <MediaShelf
                  className="scroll-mt-[calc(var(--desktop-navigation-height)+var(--space-4))] [&_h2]:border-l-[length:var(--space-1)] [&_h2]:border-accent [&_h2]:pl-[var(--space-4)]"
                  description={recommendationStrings.shelves.featured.description}
                  listType="unordered"
                  title={recommendationStrings.shelves.featured.title}
                  trackClassName="recommendations-list min-h-[calc(var(--control-min-size)*8)] items-start gap-[var(--space-4)] [--featured-card-basis:clamp(calc(var(--control-min-size)*2.5),calc((100%-(var(--space-4)*1.4))/2.4),calc(var(--control-min-size)*3.5))] [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:min-h-[calc(var(--control-min-size)*11)] [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:[--featured-card-basis:calc(var(--control-min-size)*3.5)]"
                  trackData={{
                    "data-recommendation-motion": MotionList === null ? "static" : "enabled",
                  }}
                >
                  {MotionList === null ? (
                    <StaticRecommendationItems
                      items={recommendationItems}
                      shortage={shortageItem}
                    />
                  ) : (
                    <MotionList
                      items={recommendationItems}
                      reducedMotion={false}
                      shortage={shortageItem}
                    />
                  )}
                </MediaShelf>
              </>
            )}

            <span
              aria-hidden="true"
              className="scroll-mt-[calc(var(--desktop-navigation-height)+var(--space-4))]"
              id="recommendation-shelf-anchor"
            />
            <MediaShelf
              className="mt-[var(--space-section-large)] scroll-mt-[calc(var(--desktop-navigation-height)+var(--space-4))] [&_h2]:border-l-[length:var(--space-1)] [&_h2]:border-accent [&_h2]:pl-[var(--space-4)]"
              description={recommendationStrings.shelves.anchor.description}
              title={recommendationStrings.shelves.anchor.title}
            >
              {anchorEntries.map(renderPoster)}
            </MediaShelf>

            <span
              aria-hidden="true"
              className="scroll-mt-[calc(var(--desktop-navigation-height)+var(--space-4))]"
              id="recommendation-shelf-discovery"
            />
            <MediaShelf
              className="mt-[var(--space-section-large)] scroll-mt-[calc(var(--desktop-navigation-height)+var(--space-4))] [&_h2]:border-l-[length:var(--space-1)] [&_h2]:border-accent [&_h2]:pl-[var(--space-4)]"
              description={recommendationStrings.shelves.discovery.description}
              title={recommendationStrings.shelves.discovery.title}
            >
              {discoveryEntries.map(renderPoster)}
            </MediaShelf>

            <span
              aria-hidden="true"
              className="scroll-mt-[calc(var(--desktop-navigation-height)+var(--space-4))]"
              id="recommendation-shelf-completed"
            />
            <MediaShelf
              className="mt-[var(--space-section-large)] scroll-mt-[calc(var(--desktop-navigation-height)+var(--space-4))] [&_h2]:border-l-[length:var(--space-1)] [&_h2]:border-accent [&_h2]:pl-[var(--space-4)]"
              description={recommendationStrings.shelves.completed.description}
              title={recommendationStrings.shelves.completed.title}
            >
              {completedEntries.map(renderPoster)}
            </MediaShelf>

            <span
              aria-hidden="true"
              className="scroll-mt-[calc(var(--desktop-navigation-height)+var(--space-4))]"
              id="recommendation-shelf-ranking"
            />
            <RankingShelf
              className="mt-[var(--space-section-large)] scroll-mt-[calc(var(--desktop-navigation-height)+var(--space-4))] [&_h2]:border-l-[length:var(--space-1)] [&_h2]:border-accent [&_h2]:pl-[var(--space-4)]"
              description={recommendationStrings.shelves.ranking.description}
              title={recommendationStrings.shelves.ranking.title}
            >
              {renderedEntries.slice(0, 10).map(renderPoster)}
            </RankingShelf>
            <section className="mt-[var(--space-section-large)] grid gap-[var(--space-4)] rounded-[var(--radius-card)] border border-line bg-surface-1 p-[var(--space-5)] md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] md:items-center">
              <div className="grid gap-[var(--space-content)]">
                <h2>{recommendationStrings.feedbackSummary.heading}</h2>
                <p className="text-text-muted">
                  {recommendationStrings.feedbackSummary.description}
                </p>
              </div>
              <dl className="m-0 grid gap-[var(--space-content)] md:grid-cols-2">
                <div className="grid gap-[var(--space-content-tight)] rounded-[var(--radius-control)] border border-line bg-surface-2 p-[var(--space-3)]">
                  <dt className="text-[length:var(--text-caption-size)] text-text-muted">
                    {recommendationStrings.actions.completed}
                  </dt>
                  <dd className="m-0 font-bold text-text-strong">
                    {recommendationStrings.feedbackSummary.count(
                      records.filter((record) => record.readingState === "completed").length,
                    )}
                  </dd>
                </div>
                <div className="grid gap-[var(--space-content-tight)] rounded-[var(--radius-control)] border border-line bg-surface-2 p-[var(--space-3)]">
                  <dt className="text-[length:var(--text-caption-size)] text-text-muted">
                    {recommendationStrings.actions.hidden}
                  </dt>
                  <dd className="m-0 font-bold text-text-strong">
                    {recommendationStrings.feedbackSummary.count(
                      records.filter((record) => record.readingState === "hidden").length,
                    )}
                  </dd>
                </div>
              </dl>
            </section>
          </div>
        </div>

        <FeedbackDialog
          busy={feedbackBusy}
          errorMessage={feedbackError}
          feedback={feedback}
          onSaveCompleted={(reaction) => void saveCompletedFeedback(reaction)}
          onSaveHidden={(reasons) => void saveHiddenFeedback(reasons)}
          onSkip={closeFeedback}
        />
        <QuickPreviewDialog
          busy={
            previewEntry === null ||
            isComputing ||
            isPolicySaving ||
            feedbackBaseBusy ||
            busyWorkIds.has(previewEntry.entry.workId)
          }
          coverUrl={
            previewEntry === null ? null : recommendationCoverUrls.get(previewEntry.entry.workId)
          }
          explanation={previewExplanation}
          onCompleted={() => {
            if (previewEntry === null) return;
            onPreviewClose?.();
            void removeForFeedback(previewEntry.entry, "completed");
          }}
          onHidden={() => {
            if (previewEntry === null) return;
            onPreviewClose?.();
            void removeForFeedback(previewEntry.entry, "hidden");
          }}
          onOpenChange={(open) => {
            if (!open) onPreviewClose?.();
          }}
          onPlanned={() => {
            if (previewEntry !== null) void savePlanned(previewEntry.entry);
          }}
          open={previewEntry !== null}
          planned={previewEntry !== null && plannedIds.has(previewEntry.entry.workId)}
          volumeCount={previewEntry?.metadata.volumeCount ?? null}
          work={previewEntry?.work ?? null}
        />
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
      {plan === null ? null : <SiteFooter className="mt-[var(--space-section-large)]" />}
    </>
  );
}
