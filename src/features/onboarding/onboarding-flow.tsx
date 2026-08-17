"use client";

import { useNavigate } from "@tanstack/react-router";
import {
  type AnimationEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Button } from "@/components/design-system/button";
import { SiteFooter } from "@/components/layout/site-footer";
import { usePageEntryMotion } from "@/components/motion/use-page-entry-motion";
import type { GenreTag, Work } from "@/domain/catalog/types";
import { hasCatalogBackedProfile } from "@/domain/profile/catalog-profile";
import {
  createEmptyOnboardingDraft,
  reconcileOnboardingDraftMode,
  ONBOARDING_MAX_NEGATIVE_WORKS,
  ONBOARDING_MAX_POSITIVE_WORKS,
  ONBOARDING_MIN_POSITIVE_WORKS,
  type NegativeDisposition,
  type OnboardingDraft,
} from "@/domain/profile/onboarding";
import { FACTOR_BACKED_NEGATIVE_REASON_IDS } from "@/domain/profile/constants";
import type { NegativeReasonId } from "@/domain/profile/types";
import { useCatalog } from "@/features/catalog/catalog-provider";
import {
  createRecommendationCoverTargets,
  useRecommendationCovers,
} from "@/features/recommendations/recommendation-cover-resolver";
import { usePersistence } from "@/infrastructure/db";
import {
  OnboardingAlreadyCompletedError,
  OnboardingWorkConflictError,
} from "@/infrastructure/db/backend";
import { onboardingStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

import { AnchorCoverCard } from "./anchor-cover-card";
import { isOnboardingCollectionId, onboardingCollections } from "./onboarding-collections";
import {
  OnboardingCollectionGrid,
  OnboardingGenreChips,
  OnboardingIntro,
  OnboardingSelectionGuidance,
  OnboardingStepProgress,
} from "./onboarding-step-one-sections";
import {
  NegativeEntryEditor,
  type NegativeReasonOption,
  NegativeWorkCard,
} from "./negative-work-card";
import { SelectedTray } from "./selected-tray";
import { WorkSearchInput, type WorkSearchState } from "./work-search-input";
import { WorkShelf } from "./work-shelf";

const STEP_ONE_SEARCH_EMPTY: WorkSearchState = { query: "", results: [] };
const STEP_TWO_SEARCH_EMPTY: WorkSearchState = { query: "", results: [] };

const ANCHOR_CARD_LABELS = {
  select: onboardingStrings.step1.select,
  remove: onboardingStrings.step1.remove,
  selected: onboardingStrings.step1.selected,
  favorite: onboardingStrings.step1.favorite,
  markFavorite: onboardingStrings.step1.markFavorite,
  markLiked: onboardingStrings.step1.markLiked,
} as const;

const NEGATIVE_REASON_OPTIONS: readonly NegativeReasonOption[] = [
  ...FACTOR_BACKED_NEGATIVE_REASON_IDS.map((id): NegativeReasonOption => ({
    id,
    label: onboardingStrings.step2.reasonLabels[id],
    external: false,
  })),
  {
    id: "external:hiatus",
    label: onboardingStrings.step2.reasonLabels.externalHiatus,
    external: true,
  },
  {
    id: "external:no-time",
    label: onboardingStrings.step2.reasonLabels.externalNoTime,
    external: true,
  },
  {
    id: "vagueDislike",
    label: onboardingStrings.step2.reasonLabels.vague,
    external: false,
  },
];

function nowIso(): string {
  return new Date().toISOString();
}

function withUpdatedAt(draft: OnboardingDraft): OnboardingDraft {
  return { ...draft, updatedAt: nowIso() };
}

function ResolvedOnboardingPage({
  children,
  currentStep,
  onPageEntryEnd,
  pageEntryConsumed,
}: Readonly<{
  children: ReactNode;
  currentStep: OnboardingDraft["step"];
  onPageEntryEnd: (event: AnimationEvent<HTMLElement>) => void;
  pageEntryConsumed: boolean;
}>) {
  const [pageEntryAllowed] = useState(currentStep === 1);
  const pageEntryMotion = usePageEntryMotion({
    enabled: pageEntryAllowed && currentStep === 1 && !pageEntryConsumed,
    identity: "onboarding",
  });

  return (
    <main
      className={cn(
        "onboarding-page mx-auto min-h-dvh w-[min(100%,var(--layout-width-onboarding))] px-[var(--layout-page-padding)] pt-[var(--layout-page-block-start)] pb-[calc(var(--space-12)+var(--space-12)+var(--space-12)+var(--space-8)+var(--layout-safe-area-bottom))] text-text md:min-h-[calc(100dvh-var(--desktop-navigation-height))] md:pt-[var(--space-4)] md:pb-0",
        pageEntryMotion.active &&
          "onboarding-page--entry-b motion-safe:[&>.onboarding-step-one]:animate-[page-entry-b-enter_var(--motion-duration-page)_var(--motion-ease-direct)_both]",
      )}
      data-page-entry-b={pageEntryMotion.active ? "active" : undefined}
      onAnimationEnd={(event) => {
        pageEntryMotion.onAnimationEnd(event);
        onPageEntryEnd(event);
      }}
    >
      {children}
    </main>
  );
}

export function OnboardingFlow({
  genre,
  onGenreChange,
  onQueryChange,
  onShelfChange,
  query,
  shelf,
}: Readonly<{
  genre?: GenreTag;
  onGenreChange?: (genre: GenreTag | undefined) => void;
  onQueryChange?: (query: string) => void;
  onShelfChange?: (shelf: string | undefined) => void;
  query?: string;
  shelf?: string;
}> = {}) {
  const navigate = useNavigate();
  const catalog = useCatalog();
  const {
    status,
    onboardingDraft: storedDraft,
    onboardingCompletedAt,
    userWorks,
    getProviderCache,
    refresh,
    saveProviderCache,
    saveOnboardingDraft,
    clearOnboardingDraft,
    finalizeOnboarding,
  } = usePersistence();
  const [localDraft, setLocalDraft] = useState<OnboardingDraft | null>(null);
  const [stepOneSearch, setStepOneSearch] = useState<WorkSearchState>(STEP_ONE_SEARCH_EMPTY);
  const [stepTwoSearch, setStepTwoSearch] = useState<WorkSearchState>(STEP_TWO_SEARCH_EMPTY);
  const [negativeFocus, setNegativeFocus] = useState<Readonly<{
    workId: string;
    disposition: NegativeDisposition;
  }> | null>(null);
  const [limitMessage, setLimitMessage] = useState("");
  const [selectionMessage, setSelectionMessage] = useState("");
  const [shakeKey, setShakeKey] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [pageEntryConsumed, setPageEntryConsumed] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const limitTimerRef = useRef<number | null>(null);
  const submittingRef = useRef(false);

  const allCatalogWorks = catalog.works;
  const catalogWorkIds = useMemo(
    () => new Set(allCatalogWorks.map((work) => work.id)),
    [allCatalogWorks],
  );
  const onboardingEligibleCatalogWorks = useMemo(
    () => allCatalogWorks.filter((work) => work.eligibility.onboardingEligible),
    [allCatalogWorks],
  );
  const onboardingEligibleWorkIds = useMemo(
    () => new Set(onboardingEligibleCatalogWorks.map((work) => work.id)),
    [onboardingEligibleCatalogWorks],
  );
  const persistedWorkIds = useMemo(
    () => new Set((userWorks ?? []).map((record) => record.workId)),
    [userWorks],
  );
  const selectableCatalogWorks = useMemo(
    () => allCatalogWorks.filter((work) => !persistedWorkIds.has(work.id)),
    [allCatalogWorks, persistedWorkIds],
  );
  const onboardingEligibleWorks = useMemo(
    () => onboardingEligibleCatalogWorks.filter((work) => !persistedWorkIds.has(work.id)),
    [onboardingEligibleCatalogWorks, persistedWorkIds],
  );
  const selectedCollection = isOnboardingCollectionId(shelf)
    ? onboardingCollections.find((collection) => collection.id === shelf)
    : undefined;
  const filteredPositiveWorks = useMemo(
    () =>
      onboardingEligibleWorks
        .filter((work) => genre === undefined || work.genres.includes(genre))
        .filter(
          (work) =>
            selectedCollection === undefined ||
            work.genres.some((workGenre) =>
              selectedCollection.genres.some((collectionGenre) => collectionGenre === workGenre),
            ),
        ),
    [genre, onboardingEligibleWorks, selectedCollection],
  );
  const browseWorks = useMemo(
    () =>
      [...new Map(filteredPositiveWorks.map((work) => [work.id, work] as const)).values()].slice(
        0,
        18,
      ),
    [filteredPositiveWorks],
  );
  const collectionPreviewWorks = useMemo(
    () =>
      new Map(
        onboardingCollections.map(
          (collection) =>
            [
              collection.id,
              onboardingEligibleWorks
                .filter((work) =>
                  work.genres.some((workGenre) =>
                    collection.genres.some((collectionGenre) => collectionGenre === workGenre),
                  ),
                )
                .slice(0, 6),
            ] as const,
        ),
      ),
    [onboardingEligibleWorks],
  );
  const hadCatalogBackedProfile = useMemo(
    () => hasCatalogBackedProfile(userWorks, allCatalogWorks),
    [allCatalogWorks, userWorks],
  );
  const shouldUseAddMode =
    onboardingCompletedAt !== undefined &&
    (onboardingCompletedAt !== null || hadCatalogBackedProfile === true);

  const worksById = useMemo(
    () => new Map(allCatalogWorks.map((work) => [work.id, work] as const)),
    [allCatalogWorks],
  );
  const initialDraft = useMemo(
    () =>
      storedDraft === undefined || onboardingCompletedAt === undefined || userWorks === undefined
        ? null
        : storedDraft === null
          ? createEmptyOnboardingDraft(nowIso(), shouldUseAddMode ? "add" : "firstRun")
          : reconcileOnboardingDraftMode(
              storedDraft,
              shouldUseAddMode,
              persistedWorkIds,
              onboardingEligibleWorkIds,
              catalogWorkIds,
            ),
    [
      catalogWorkIds,
      onboardingEligibleWorkIds,
      onboardingCompletedAt,
      persistedWorkIds,
      shouldUseAddMode,
      storedDraft,
      userWorks,
    ],
  );
  const draft = localDraft ?? initialDraft;
  const currentStep = draft?.step;
  const coverWorkIds = useMemo(() => {
    const ordered = [
      ...(draft?.positiveEntries.map((entry) => entry.workId) ?? []),
      ...(draft?.negativeEntries.map((entry) => entry.workId) ?? []),
      ...stepOneSearch.results.slice(0, 8).map((work) => work.id),
      ...stepTwoSearch.results.slice(0, 8).map((work) => work.id),
      ...browseWorks.slice(0, 12).map((work) => work.id),
      ...onboardingCollections.flatMap((collection) =>
        (collectionPreviewWorks.get(collection.id) ?? []).map((work) => work.id),
      ),
    ];
    return [...new Set(ordered)].slice(0, 18);
  }, [
    browseWorks,
    collectionPreviewWorks,
    draft?.negativeEntries,
    draft?.positiveEntries,
    stepOneSearch.results,
    stepTwoSearch.results,
  ]);
  const coverTargets = useMemo(
    () =>
      typeof getProviderCache === "function" && typeof saveProviderCache === "function"
        ? createRecommendationCoverTargets(catalog, coverWorkIds)
        : [],
    [catalog, coverWorkIds, getProviderCache, saveProviderCache],
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
  const handleCoverSettled = useCallback(
    (workId: string) => {
      const target = coverTargetsByWorkId.get(workId);
      if (target !== undefined) notifyCoverSettled(target);
    },
    [coverTargetsByWorkId, notifyCoverSettled],
  );

  useEffect(() => {
    if (currentStep !== undefined) {
      headingRef.current?.focus();
    }
  }, [currentStep]);

  useEffect(
    () => () => {
      if (limitTimerRef.current !== null) {
        window.clearTimeout(limitTimerRef.current);
      }
    },
    [],
  );

  const persist = useCallback(
    (nextDraft: OnboardingDraft) => {
      if (submittingRef.current) {
        return;
      }
      setLocalDraft(nextDraft);
      setErrorMessage("");
      void saveOnboardingDraft(nextDraft).catch(() => {
        setErrorMessage(onboardingStrings.saveError);
      });
    },
    [saveOnboardingDraft],
  );

  const showLimit = useCallback((message: string) => {
    if (limitTimerRef.current !== null) {
      window.clearTimeout(limitTimerRef.current);
    }
    setLimitMessage(message);
    setShakeKey((value) => value + 1);
    limitTimerRef.current = window.setTimeout(() => {
      setLimitMessage("");
      limitTimerRef.current = null;
    }, 2400);
  }, []);

  if (draft === null || status.state === "initializing" || userWorks === undefined) {
    return (
      <main className="onboarding-page mx-auto grid min-h-dvh w-[min(100%,var(--layout-width-onboarding))] place-items-center px-[var(--layout-page-padding)] py-[var(--layout-page-block-start)] text-text-muted">
        <p aria-live="polite">{onboardingStrings.loading}</p>
      </main>
    );
  }

  const positiveByWorkId = new Map(
    draft.positiveEntries.map((entry) => [entry.workId, entry] as const),
  );
  const positiveWorkIds = new Set(positiveByWorkId.keys());
  const negativeByWorkId = new Map(
    draft.negativeEntries.map((entry) => [entry.workId, entry] as const),
  );

  const updateDraft = (nextDraft: OnboardingDraft) => persist(withUpdatedAt(nextDraft));
  const isAddMode = draft.mode === "add";
  const minimumPositiveWorks = isAddMode ? 1 : ONBOARDING_MIN_POSITIVE_WORKS;

  const togglePositiveSelection = (workId: string) => {
    const existing = positiveByWorkId.get(workId);
    const workTitle = worksById.get(workId)?.title ?? workId;
    if (existing !== undefined) {
      setSelectionMessage(onboardingStrings.step1.removedAnnouncement(workTitle));
      updateDraft({
        ...draft,
        positiveEntries: draft.positiveEntries.filter((entry) => entry.workId !== workId),
      });
      return;
    }
    if (persistedWorkIds.has(workId)) {
      return;
    }
    if (draft.positiveEntries.length >= ONBOARDING_MAX_POSITIVE_WORKS) {
      showLimit(onboardingStrings.step1.maximum);
      return;
    }
    setSelectionMessage(onboardingStrings.step1.selectedAnnouncement(workTitle));
    updateDraft({
      ...draft,
      positiveEntries: [...draft.positiveEntries, { workId, reaction: "liked" }],
    });
  };

  const toggleFavorite = (workId: string) => {
    if (persistedWorkIds.has(workId)) {
      return;
    }
    updateDraft({
      ...draft,
      positiveEntries: draft.positiveEntries.map((entry) =>
        entry.workId === workId
          ? { ...entry, reaction: entry.reaction === "favorite" ? "liked" : "favorite" }
          : entry,
      ),
    });
  };

  const prepareToContinue = () => {
    if (limitTimerRef.current !== null) {
      window.clearTimeout(limitTimerRef.current);
      limitTimerRef.current = null;
    }
    setLimitMessage("");
  };

  const addNegative = (workId: string, disposition: NegativeDisposition) => {
    if (draft.mode === "add") {
      return;
    }
    if (
      persistedWorkIds.has(workId) ||
      positiveWorkIds.has(workId) ||
      negativeByWorkId.has(workId)
    ) {
      return;
    }
    if (draft.negativeEntries.length >= ONBOARDING_MAX_NEGATIVE_WORKS) {
      showLimit(onboardingStrings.step2.maximum);
      return;
    }
    setNegativeFocus({ workId, disposition });
    updateDraft({
      ...draft,
      negativeEntries: [...draft.negativeEntries, { workId, disposition, reasons: [] }],
    });
  };

  const changeNegativeDisposition = (workId: string, disposition: NegativeDisposition) => {
    if (draft.mode === "add") {
      return;
    }
    updateDraft({
      ...draft,
      negativeEntries: draft.negativeEntries.map((entry) =>
        entry.workId === workId ? { ...entry, disposition } : entry,
      ),
    });
  };

  const toggleNegativeReason = (workId: string, reason: NegativeReasonId) => {
    if (draft.mode === "add") {
      return;
    }
    updateDraft({
      ...draft,
      negativeEntries: draft.negativeEntries.map((entry) => {
        if (entry.workId !== workId) {
          return entry;
        }
        if (reason === "vagueDislike") {
          return {
            ...entry,
            reasons: entry.reasons.includes(reason) ? [] : [reason],
          };
        }
        const withoutVague = entry.reasons.filter((entryReason) => entryReason !== "vagueDislike");
        return {
          ...entry,
          reasons: withoutVague.includes(reason)
            ? withoutVague.filter((entryReason) => entryReason !== reason)
            : [...withoutVague, reason],
        };
      }),
    });
  };

  const removeNegative = (workId: string) => {
    if (draft.mode === "add") {
      return;
    }
    updateDraft({
      ...draft,
      negativeEntries: draft.negativeEntries.filter((entry) => entry.workId !== workId),
    });
  };

  const complete = async (includeNegativeEntries: boolean) => {
    if (submittingRef.current) {
      return;
    }
    submittingRef.current = true;
    setSubmitting(true);
    setErrorMessage("");
    const completedDraft: OnboardingDraft =
      draft.mode === "add"
        ? { ...draft, negativeEntries: [], updatedAt: nowIso() }
        : {
            ...draft,
            negativeEntries: includeNegativeEntries ? draft.negativeEntries : [],
            updatedAt: nowIso(),
          };
    try {
      await finalizeOnboarding(completedDraft, nowIso());
      if (completedDraft.mode === "add") {
        await navigate({ to: "/taste", replace: true });
      } else {
        await navigate({ to: "/taste", search: { reveal: "1" } });
      }
    } catch (error) {
      if (error instanceof OnboardingAlreadyCompletedError) {
        await refresh().catch(() => undefined);
        setLocalDraft(null);
        await navigate({ to: "/taste", replace: true });
        return;
      }
      if (error instanceof OnboardingWorkConflictError) {
        await refresh().catch(() => undefined);
        setLocalDraft(null);
        submittingRef.current = false;
        setSubmitting(false);
        setErrorMessage(
          onboardingStrings.workConflict(worksById.get(error.workId)?.title ?? error.workId),
        );
        return;
      }
      submittingRef.current = false;
      setErrorMessage(onboardingStrings.completeError);
      setSubmitting(false);
    }
  };

  const continueFromStepOne = () => {
    if (draft.positiveEntries.length < minimumPositiveWorks) {
      return;
    }
    setPageEntryConsumed(true);
    prepareToContinue();
    if (draft.mode === "add") {
      void complete(false);
      return;
    }
    updateDraft({ ...draft, step: 2 });
  };

  const closeAddMode = async () => {
    if (draft.mode !== "add" || submittingRef.current) {
      return;
    }
    submittingRef.current = true;
    setSubmitting(true);
    setErrorMessage("");
    try {
      await saveOnboardingDraft(draft);
      await navigate({ to: "/taste", replace: true });
    } catch {
      submittingRef.current = false;
      setSubmitting(false);
      setErrorMessage(onboardingStrings.saveError);
    }
  };

  const discardAddDraft = async () => {
    if (draft.mode !== "add" || submittingRef.current) {
      return;
    }
    submittingRef.current = true;
    setSubmitting(true);
    setErrorMessage("");
    try {
      await clearOnboardingDraft();
      setLocalDraft(null);
      await navigate({ to: "/taste", replace: true });
    } catch {
      submittingRef.current = false;
      setSubmitting(false);
      setErrorMessage(onboardingStrings.addMode.discardError);
    }
  };

  const storageWarning = status.state === "degraded";

  return (
    <ResolvedOnboardingPage
      currentStep={draft.step}
      onPageEntryEnd={(event) => {
        if (event.animationName === "page-entry-b-enter") setPageEntryConsumed(true);
      }}
      pageEntryConsumed={pageEntryConsumed}
    >
      {storageWarning ? (
        <div
          className="onboarding-alert mb-[var(--space-4)] max-w-[var(--layout-width-reading)] border-l-[length:var(--space-1)] border-warn bg-surface-1 px-[var(--space-4)] py-[var(--space-3)]"
          role="alert"
        >
          {onboardingStrings.storageWarning}
        </div>
      ) : null}
      {errorMessage ? (
        <div
          className="onboarding-alert mb-[var(--space-4)] max-w-[var(--layout-width-reading)] border-l-[length:var(--space-1)] border-warn bg-surface-1 px-[var(--space-4)] py-[var(--space-3)]"
          role="alert"
        >
          {errorMessage}
        </div>
      ) : null}
      {limitMessage ? (
        <div
          aria-atomic="true"
          aria-live="polite"
          className="onboarding-limit-message fixed right-[var(--layout-page-padding)] bottom-[var(--layout-onboarding-tray-clearance)] z-50 max-w-[min(360px,calc(100vw-(var(--layout-page-padding)*2)))] rounded-[var(--radius-card)] border border-l-[length:var(--space-1)] border-line border-l-warn bg-surface-1 px-[var(--space-4)] py-[var(--space-3)] font-bold text-text-strong shadow-[var(--shadow-raised)] motion-reduce:border-2 motion-reduce:border-l-[length:var(--space-1)] motion-reduce:border-warn"
          key={shakeKey}
          role="status"
        >
          {limitMessage}
        </div>
      ) : null}
      <p aria-atomic="true" aria-live="polite" className="visually-hidden sr-only">
        {selectionMessage}
      </p>

      {draft.step === 1 ? (
        <div className="onboarding-step-one min-w-0">
          {isAddMode ? null : <OnboardingStepProgress />}

          <div className="onboarding-hero mb-[var(--space-6)] grid gap-[var(--space-6)] md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:items-start">
            <OnboardingIntro addMode={isAddMode} headingRef={headingRef} />

            <SelectedTray
              continueLabel={
                submitting && isAddMode
                  ? onboardingStrings.addMode.saving
                  : isAddMode && draft.positiveEntries.length === 0
                    ? onboardingStrings.addMode.minimum
                    : isAddMode
                      ? onboardingStrings.addMode.submit(draft.positiveEntries.length)
                      : draft.positiveEntries.length < ONBOARDING_MIN_POSITIVE_WORKS
                        ? onboardingStrings.step1.remaining(
                            ONBOARDING_MIN_POSITIVE_WORKS - draft.positiveEntries.length,
                          )
                        : onboardingStrings.step1.next(draft.positiveEntries.length)
              }
              countLabel={onboardingStrings.step1.selectedCount(
                draft.positiveEntries.length,
                ONBOARDING_MAX_POSITIVE_WORKS,
              )}
              coverUrls={coverUrls}
              disabled={submitting || draft.positiveEntries.length < minimumPositiveWorks}
              emptyLabel={
                isAddMode
                  ? onboardingStrings.addMode.emptySelected
                  : onboardingStrings.step1.emptySelected
              }
              label={
                isAddMode
                  ? onboardingStrings.addMode.selectedTray
                  : onboardingStrings.step1.selectedTray
              }
              limitActive={limitMessage !== ""}
              onContinue={continueFromStepOne}
              onCoverSettled={handleCoverSettled}
              onRemove={togglePositiveSelection}
              removeLabel={onboardingStrings.step1.remove}
              selections={draft.positiveEntries}
              shakeKey={shakeKey}
              worksById={worksById}
            />
          </div>

          {isAddMode ? (
            <div className="onboarding-step-actions onboarding-add-mode-actions mb-[var(--space-6)] flex max-w-[var(--layout-width-form)] flex-wrap justify-start gap-[var(--space-content-loose)] [&>button]:flex-[0_1_auto]">
              <Button
                className="onboarding-add-mode-actions__close"
                disabled={submitting}
                onClick={() => void closeAddMode()}
                type="button"
                variant="outline"
              >
                {onboardingStrings.addMode.close}
              </Button>
              <Button
                className="onboarding-add-mode-actions__discard border-transparent bg-transparent text-warn"
                disabled={submitting}
                onClick={() => void discardAddDraft()}
                type="button"
                variant="ghost"
              >
                {onboardingStrings.addMode.discard}
              </Button>
            </div>
          ) : null}

          <div className="onboarding-discovery grid gap-[var(--space-6)] [&>.work-search]:m-0 [&>.work-search]:max-w-none [&_.work-search__label]:sr-only [&_.work-search__input]:min-h-[var(--control-min-size)] [&_.work-search__input]:border-accent [&_.work-search__input]:bg-surface-1 [&_.work-search__input]:shadow-[0_0_0_1px_var(--accent-soft)] motion-reduce:[&_.work-search__input]:transition-none">
            <WorkSearchInput
              key="positive-search"
              label={onboardingStrings.step1.searchLabel}
              onQueryChange={onQueryChange}
              onSearchStateChange={setStepOneSearch}
              placeholder={onboardingStrings.step1.searchPlaceholder}
              query={query}
              works={filteredPositiveWorks}
            />
            <p aria-atomic="true" aria-live="polite" className="visually-hidden sr-only">
              {stepOneSearch.query.trim().length > 0
                ? onboardingStrings.searchResults(stepOneSearch.query, stepOneSearch.results.length)
                : ""}
            </p>

            <OnboardingGenreChips genre={genre} onChange={onGenreChange} />

            {stepOneSearch.query.trim().length > 0 ? (
              stepOneSearch.results.length > 0 ? (
                <section
                  aria-label={onboardingStrings.step1.searchLabel}
                  className="work-search-grid grid grid-cols-[repeat(auto-fill,minmax(104px,1fr))] gap-x-[var(--space-3)] gap-y-[var(--space-5)] [&>.anchor-card]:w-full [&>.anchor-card]:min-w-0 md:grid-cols-[repeat(auto-fill,minmax(128px,1fr))] md:gap-x-[var(--space-4)] md:gap-y-[var(--space-6)]"
                >
                  {stepOneSearch.results.map((work) => (
                    <AnchorCoverCard
                      coverUrl={coverUrls.get(work.id)}
                      key={work.id}
                      labels={ANCHOR_CARD_LABELS}
                      onCoverSettled={() => handleCoverSettled(work.id)}
                      onToggleFavorite={toggleFavorite}
                      onToggleSelection={togglePositiveSelection}
                      selection={positiveByWorkId.get(work.id)}
                      work={work}
                    />
                  ))}
                </section>
              ) : (
                <div className="onboarding-empty grid gap-[var(--space-content-tight)] rounded-[var(--radius-card)] border border-line bg-surface-1 px-[var(--space-5)] py-[var(--space-7)] text-text-muted">
                  <p>{onboardingStrings.step1.noResults}</p>
                  <p>{onboardingStrings.step1.catalogLater}</p>
                </div>
              )
            ) : (
              <div className="onboarding-shelves grid gap-[var(--space-section)]">
                {browseWorks.length === 0 ? (
                  <div className="onboarding-empty grid gap-[var(--space-content-tight)] rounded-[var(--radius-card)] border border-line bg-surface-1 px-[var(--space-5)] py-[var(--space-7)] text-text-muted">
                    <p>{onboardingStrings.step1.noFilteredWorks}</p>
                  </div>
                ) : (
                  <WorkShelf
                    coverUrls={coverUrls}
                    labels={ANCHOR_CARD_LABELS}
                    onCoverSettled={handleCoverSettled}
                    onToggleFavorite={toggleFavorite}
                    onToggleSelection={togglePositiveSelection}
                    selectionsByWorkId={positiveByWorkId}
                    title={
                      selectedCollection === undefined
                        ? onboardingStrings.step1.featuredHeading
                        : onboardingStrings.step1.collections[selectedCollection.id].title
                    }
                    works={browseWorks}
                  />
                )}

                <OnboardingCollectionGrid
                  activeId={selectedCollection?.id}
                  coverUrls={coverUrls}
                  onCoverSettled={handleCoverSettled}
                  onSelect={onShelfChange}
                  previewWorks={collectionPreviewWorks}
                />

                <OnboardingSelectionGuidance />
              </div>
            )}
          </div>
        </div>
      ) : (
        <fieldset
          aria-busy={submitting}
          aria-label={onboardingStrings.step2.title}
          className="onboarding-step-two m-0 min-w-0 border-0 p-0"
          disabled={submitting}
        >
          <header className="onboarding-header mb-[var(--space-5)] grid max-w-[var(--layout-width-reading)] gap-[var(--space-content)]">
            <p className="font-display text-[length:var(--text-caption-size)] font-bold tracking-[0.08em] text-accent">
              {onboardingStrings.step2.eyebrow}
            </p>
            <h1
              className="max-w-[18ch] text-[clamp(var(--font-size-28),5vw,var(--font-size-40))] leading-[1.25] tracking-[-0.03em] text-text-strong"
              ref={headingRef}
              tabIndex={-1}
            >
              {onboardingStrings.step2.title}{" "}
              <span className="ms-2 inline-block text-[length:var(--font-size-14)] font-medium text-text-muted">
                {onboardingStrings.step2.optional}
              </span>
            </h1>
            <p className="text-text-muted">{onboardingStrings.step2.description}</p>
          </header>

          {draft.negativeEntries.length > 0 ? (
            <section
              aria-label={onboardingStrings.step2.title}
              className="negative-entries mb-[var(--space-7)] grid gap-[var(--space-4)]"
            >
              {draft.negativeEntries.map((entry) => {
                const work = worksById.get(entry.workId);
                return work === undefined ? null : (
                  <NegativeEntryEditor
                    coverUrl={coverUrls.get(work.id)}
                    disabled={submitting}
                    key={entry.workId}
                    entry={entry}
                    focusDisposition={
                      negativeFocus?.workId === entry.workId ? negativeFocus.disposition : undefined
                    }
                    labels={{
                      disposition: onboardingStrings.step2.disposition,
                      disliked: onboardingStrings.step2.disliked,
                      dropped: onboardingStrings.step2.dropped,
                      reasons: onboardingStrings.step2.reasons,
                      noReason: onboardingStrings.step2.noReason,
                      externalHelper: onboardingStrings.step2.externalHelper,
                      remove: onboardingStrings.step2.remove,
                    }}
                    onCoverSettled={() => handleCoverSettled(work.id)}
                    onDispositionChange={changeNegativeDisposition}
                    onReasonToggle={toggleNegativeReason}
                    onRemove={removeNegative}
                    reasonOptions={NEGATIVE_REASON_OPTIONS}
                    work={work}
                  />
                );
              })}
            </section>
          ) : null}

          <WorkSearchInput
            key="negative-search"
            label={onboardingStrings.step2.searchLabel}
            onQueryChange={onQueryChange}
            onSearchStateChange={setStepTwoSearch}
            placeholder={onboardingStrings.step2.searchPlaceholder}
            query={query}
            works={selectableCatalogWorks}
          />
          <p aria-atomic="true" aria-live="polite" className="visually-hidden sr-only">
            {stepTwoSearch.query.trim().length > 0
              ? onboardingStrings.searchResults(stepTwoSearch.query, stepTwoSearch.results.length)
              : ""}
          </p>

          {stepTwoSearch.query.trim().length === 0 ? (
            <p className="onboarding-search-prompt rounded-[var(--radius-card)] border border-line bg-surface-1 px-[var(--space-5)] py-[var(--space-7)] text-text-muted">
              {onboardingStrings.step2.emptySearch}
            </p>
          ) : stepTwoSearch.results.length === 0 ? (
            <div className="onboarding-empty grid gap-[var(--space-content-tight)] rounded-[var(--radius-card)] border border-line bg-surface-1 px-[var(--space-5)] py-[var(--space-7)] text-text-muted">
              <p>{onboardingStrings.step2.noResults}</p>
            </div>
          ) : (
            <section
              aria-label={onboardingStrings.step2.searchLabel}
              className="negative-result-grid grid grid-cols-[minmax(0,var(--layout-width-form))] gap-x-[var(--space-3)] gap-y-[var(--space-5)] [&>.negative-result-card]:w-full [&>.negative-result-card]:min-w-0"
            >
              {stepTwoSearch.results.map((work: Work) => (
                <NegativeWorkCard
                  coverUrl={coverUrls.get(work.id)}
                  disabled={submitting}
                  key={work.id}
                  isPositive={positiveWorkIds.has(work.id)}
                  isSelected={negativeByWorkId.has(work.id)}
                  labels={{
                    selectedPositive: onboardingStrings.step2.selectedPositive,
                    selectedNegative: onboardingStrings.step2.selectedNegative,
                    disposition: onboardingStrings.step2.disposition,
                    disliked: onboardingStrings.step2.disliked,
                    dropped: onboardingStrings.step2.dropped,
                  }}
                  onAdd={addNegative}
                  onCoverSettled={() => handleCoverSettled(work.id)}
                  work={work}
                />
              ))}
            </section>
          )}

          <div className="onboarding-step-actions mt-[var(--space-section)] flex max-w-[var(--layout-width-form)] justify-end gap-[var(--space-content-loose)] [&>button]:flex-1">
            <Button
              className={cn(
                draft.negativeEntries.length === 0 &&
                  "onboarding-step-actions__primary [@media(hover:hover)_and_(pointer:fine)]:hover:border-accent-hover [@media(hover:hover)_and_(pointer:fine)]:hover:bg-accent-hover",
              )}
              disabled={submitting}
              onClick={() => void complete(false)}
              type="button"
              variant={draft.negativeEntries.length === 0 ? "default" : "outline"}
            >
              {submitting ? onboardingStrings.step2.saving : onboardingStrings.step2.skip}
            </Button>
            <Button
              className={cn(
                draft.negativeEntries.length > 0 &&
                  "onboarding-step-actions__primary [@media(hover:hover)_and_(pointer:fine)]:hover:border-accent-hover [@media(hover:hover)_and_(pointer:fine)]:hover:bg-accent-hover",
              )}
              disabled={submitting}
              onClick={() => void complete(true)}
              type="button"
              variant={draft.negativeEntries.length > 0 ? "default" : "outline"}
            >
              {submitting ? onboardingStrings.step2.saving : onboardingStrings.step2.finish}
            </Button>
          </div>
        </fieldset>
      )}
      <SiteFooter className="onboarding-footer mx-[calc(var(--layout-page-padding)*-1)] mt-[var(--space-section-large)] [&>div]:py-[var(--space-4)]" />
    </ResolvedOnboardingPage>
  );
}
