"use client";

import Link from "next/link";
import type { ComponentType, ReactNode } from "react";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";

import recommendationContextJson from "@/data/generated/recommendation-context-v1.json";
import type { ExplanationFactorId } from "@/domain/explanation";
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
const parsedRecommendationContext =
  recommendationContextSchema.safeParse(recommendationContextJson);

type VisiblePolicyKey = (typeof VISIBLE_POLICY_KEYS)[number];
type RecommendationMotionListComponent = ComponentType<RecommendationMotionListProps>;
type MotionFocusTarget = Readonly<{
  workId: string;
  action: "completed" | "hidden" | null;
}>;

function StaticRecommendationList({
  items,
  shortage,
}: Readonly<{ items: readonly RecommendationMotionItem[]; shortage: ReactNode }>) {
  return (
    <ol className="recommendations-list" data-recommendation-motion="static" role="list">
      {items.map((item) => (
        <li data-recommendation-work-id={item.workId} key={item.workId}>
          {item.content}
        </li>
      ))}
      {shortage}
    </ol>
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
      <p>{recommendationStrings.calculating}</p>
      <ol aria-hidden="true">
        {Array.from({ length: 10 }, (_, index) => (
          <li key={index}>
            <span />
            <div>
              <span />
              <span />
              <span />
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function RecommendationsFlow() {
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
  const excludedWorkIds = useRef(new Set<string>());
  const articleRefs = useRef(new Map<string, HTMLElement>());
  const updateButtonRef = useRef<HTMLButtonElement>(null);
  const motionAllowed = useRef(false);
  const motionListActive = useRef(false);
  const loadedMotionList = useRef<RecommendationMotionListComponent | null>(null);
  const motionListRequest = useRef<Promise<void> | null>(null);
  const pendingMotionFocus = useRef<MotionFocusTarget | null>(null);
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
  const recommendationCoverTargets = useMemo(
    () =>
      createRecommendationCoverTargets(
        catalog,
        visibleEntries.map((entry) => entry.workId),
      ),
    [catalog, visibleEntries],
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
        excludedWorkIds.current = new Set();
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
      excludedWorkIds.current.add(entry.workId);
      const removedIndex = visibleEntries.findIndex(
        (candidate) => candidate.workId === entry.workId,
      );
      const survivors = visibleEntries.filter((candidate) => candidate.workId !== entry.workId);
      const nextEntries = backfillRecommendationPlanEntries({
        plan,
        survivors,
        excludedWorkIds: [...excludedWorkIds.current],
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

  if (
    status.state === "initializing" ||
    userWorks === undefined ||
    storedAdjustments === undefined ||
    storedPolicies === undefined
  ) {
    return (
      <main className="recommendations-page recommendations-page--loading">
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
  const recommendationItems: RecommendationMotionItem[] = renderedEntries.map(
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
      <li className="recommendations-shortage surface-card" key="recommendation-shortage">
        <h2>{recommendationStrings.shortage.title}</h2>
        <p>{recommendationStrings.shortage.description}</p>
        <div>
          <Link className="interactive-press" href="/onboarding" prefetch={false}>
            {recommendationStrings.shortage.addWorks}
          </Link>
          <Link className="interactive-press" href="/taste" prefetch={false}>
            {recommendationStrings.shortage.reviewTaste}
          </Link>
        </div>
      </li>
    ) : null;

  return (
    <main
      className="recommendations-page"
      data-recommendation-input-hash={displayedHash ?? undefined}
    >
      <div className="recommendations-layout">
        <div className="recommendations-main">
          <header className="recommendations-header">
            <h1 className="font-display">{recommendationStrings.title}</h1>
            <p>{recommendationStrings.description}</p>
          </header>

          {status.state === "degraded" ? (
            <p className="recommendations-alert" role="status">
              {recommendationStrings.storageWarning}
            </p>
          ) : null}

          <section
            aria-labelledby="recommendation-policy-heading"
            className="recommendations-controls surface-card"
          >
            <fieldset>
              <legend id="recommendation-policy-heading">
                {recommendationStrings.policiesHeading}
              </legend>
              <div className="recommendations-controls__policies">
                {VISIBLE_POLICY_KEYS.map((key) => (
                  <label key={key}>
                    <input
                      checked={policies[key]}
                      disabled={isComputing || isPolicySaving || feedbackBaseBusy}
                      onChange={() => void togglePolicy(key)}
                      type="checkbox"
                    />
                    <span>{recommendationStrings.policyLabels[key]}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="recommendations-controls__update">
              {displayedHash !== null && currentHash !== null && displayedHash !== currentHash ? (
                <p>{recommendationStrings.pendingChanges}</p>
              ) : null}
              <button
                className="interactive-press"
                disabled={updateDisabled}
                onClick={() => {
                  if (recommendationInput === null) window.location.reload();
                  else void updateRecommendations();
                }}
                ref={updateButtonRef}
                type="button"
              >
                {isComputing ? recommendationStrings.updating : recommendationStrings.update}
              </button>
            </div>
          </section>

          {actionError ? (
            <p className="recommendations-alert" role="alert">
              {actionError}
            </p>
          ) : null}
          {calculationError && plan !== null ? (
            <p className="recommendations-alert" role="alert">
              {calculationError}
            </p>
          ) : null}

          {showSkeleton ? (
            <RecommendationsSkeleton />
          ) : showInitialError ? (
            <section className="recommendations-error surface-card" role="alert">
              <h2>{recommendationStrings.errors.calculation}</h2>
              <button
                className="interactive-press"
                onClick={() => {
                  if (recommendationInput === null) window.location.reload();
                  else void updateRecommendations();
                }}
                type="button"
              >
                {recommendationStrings.errors.retry}
              </button>
            </section>
          ) : plan === null || isComputing ? null : renderedEntries.length === 0 ? (
            <section className="recommendations-empty surface-card">
              <span aria-hidden="true" className="recommendations-empty__illustration" />
              <h2>{recommendationStrings.empty.title}</h2>
              <p>{recommendationStrings.empty.description}</p>
              <Link className="interactive-press" href="/taste" prefetch={false}>
                {recommendationStrings.empty.link}
              </Link>
            </section>
          ) : MotionList === null ? (
            <StaticRecommendationList items={recommendationItems} shortage={shortageItem} />
          ) : (
            <MotionList items={recommendationItems} reducedMotion={false} shortage={shortageItem} />
          )}
        </div>

        <aside className="recommendations-taste-summary surface-card">
          <h2>{recommendationStrings.tasteSummary.heading}</h2>
          {dnaSummary.topPreferences.length === 0 ? (
            <p>{recommendationStrings.tasteSummary.empty}</p>
          ) : (
            <ol>
              {dnaSummary.topPreferences.map((preference) => (
                <li key={`${preference.kind}:${preference.factorId}`}>
                  {explanationLexicon.factorLabels[preference.factorId as ExplanationFactorId] ??
                    preference.factorId}
                </li>
              ))}
            </ol>
          )}
          <Link className="interactive-press" href="/taste" prefetch={false}>
            {recommendationStrings.tasteSummary.link}
          </Link>
        </aside>
      </div>

      <FeedbackDialog
        busy={feedbackBusy}
        errorMessage={feedbackError}
        feedback={feedback}
        onSaveCompleted={(reaction) => void saveCompletedFeedback(reaction)}
        onSaveHidden={(reasons) => void saveHiddenFeedback(reasons)}
        onSkip={closeFeedback}
      />
      <p aria-atomic="true" aria-live="polite" className="recommendations-live-region">
        {liveAnnouncement.text === "" ? null : (
          <span key={liveAnnouncement.sequence}>{liveAnnouncement.text}</span>
        )}
      </p>
    </main>
  );
}
