"use client";

import { useRouter } from "next/navigation";
import {
  type AnimationEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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
import { usePersistence } from "@/infrastructure/db";
import {
  OnboardingAlreadyCompletedError,
  OnboardingWorkConflictError,
} from "@/infrastructure/db/backend";
import { onboardingStrings } from "@/lib/strings";

import { AnchorCoverCard } from "./anchor-cover-card";
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

const SHELVES = [
  { id: "action", genre: "action", label: onboardingStrings.step1.shelves.action },
  { id: "fantasy", genre: "fantasy", label: onboardingStrings.step1.shelves.fantasy },
  { id: "historical", genre: "historical", label: onboardingStrings.step1.shelves.historical },
  {
    id: "scienceFiction",
    genre: "scienceFiction",
    label: onboardingStrings.step1.shelves.scienceFiction,
  },
  { id: "mystery", genre: "mystery", label: onboardingStrings.step1.shelves.mystery },
] as const satisfies ReadonlyArray<{ id: string; genre: GenreTag; label: string }>;

const PRIMARY_SHELF_GENRES = new Set<GenreTag>(SHELVES.map((shelf) => shelf.genre));

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
      className={`onboarding-page${pageEntryMotion.active ? " onboarding-page--entry-b" : ""}`}
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

export function OnboardingFlow() {
  const router = useRouter();
  const catalog = useCatalog();
  const {
    status,
    onboardingDraft: storedDraft,
    onboardingCompletedAt,
    userWorks,
    refresh,
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
      <main className="onboarding-page onboarding-page--loading">
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
        router.replace("/taste");
      } else {
        router.push("/taste?reveal=1");
      }
    } catch (error) {
      if (error instanceof OnboardingAlreadyCompletedError) {
        await refresh().catch(() => undefined);
        setLocalDraft(null);
        router.replace("/taste");
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
      router.replace("/taste");
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
      router.replace("/taste");
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
        <div className="onboarding-alert" role="alert">
          {onboardingStrings.storageWarning}
        </div>
      ) : null}
      {errorMessage ? (
        <div className="onboarding-alert" role="alert">
          {errorMessage}
        </div>
      ) : null}
      {limitMessage ? (
        <div
          aria-atomic="true"
          aria-live="polite"
          className="onboarding-limit-message"
          key={shakeKey}
          role="status"
        >
          {limitMessage}
        </div>
      ) : null}
      <p aria-atomic="true" aria-live="polite" className="visually-hidden">
        {selectionMessage}
      </p>

      {draft.step === 1 ? (
        <>
          <div className="onboarding-step-one">
            <header className="onboarding-header">
              <p>
                {isAddMode ? onboardingStrings.addMode.eyebrow : onboardingStrings.step1.eyebrow}
              </p>
              <h1 ref={headingRef} tabIndex={-1}>
                {isAddMode ? onboardingStrings.addMode.title : onboardingStrings.step1.title}
              </h1>
              <p>
                {isAddMode
                  ? onboardingStrings.addMode.description
                  : onboardingStrings.step1.description}
              </p>
            </header>

            {isAddMode ? (
              <div className="onboarding-step-actions onboarding-add-mode-actions">
                <button
                  className="onboarding-add-mode-actions__close"
                  disabled={submitting}
                  onClick={() => void closeAddMode()}
                  type="button"
                >
                  {onboardingStrings.addMode.close}
                </button>
                <button
                  className="onboarding-add-mode-actions__discard"
                  disabled={submitting}
                  onClick={() => void discardAddDraft()}
                  type="button"
                >
                  {onboardingStrings.addMode.discard}
                </button>
              </div>
            ) : null}

            <WorkSearchInput
              key="positive-search"
              label={onboardingStrings.step1.searchLabel}
              onSearchStateChange={setStepOneSearch}
              placeholder={onboardingStrings.step1.searchPlaceholder}
              works={onboardingEligibleWorks}
            />
            <p aria-atomic="true" aria-live="polite" className="visually-hidden">
              {stepOneSearch.query.trim().length > 0
                ? onboardingStrings.searchResults(stepOneSearch.query, stepOneSearch.results.length)
                : ""}
            </p>

            {stepOneSearch.query.trim().length > 0 ? (
              stepOneSearch.results.length > 0 ? (
                <section
                  aria-label={onboardingStrings.step1.searchLabel}
                  className="work-search-grid"
                >
                  {stepOneSearch.results.map((work) => (
                    <AnchorCoverCard
                      key={work.id}
                      labels={ANCHOR_CARD_LABELS}
                      onToggleFavorite={toggleFavorite}
                      onToggleSelection={togglePositiveSelection}
                      selection={positiveByWorkId.get(work.id)}
                      work={work}
                    />
                  ))}
                </section>
              ) : (
                <div className="onboarding-empty">
                  <p>{onboardingStrings.step1.noResults}</p>
                  <p>{onboardingStrings.step1.catalogLater}</p>
                </div>
              )
            ) : (
              <div className="onboarding-shelves">
                {SHELVES.map((shelf) => (
                  <WorkShelf
                    key={shelf.id}
                    labels={ANCHOR_CARD_LABELS}
                    nextLabel={onboardingStrings.step1.nextShelf}
                    onToggleFavorite={toggleFavorite}
                    onToggleSelection={togglePositiveSelection}
                    previousLabel={onboardingStrings.step1.previousShelf}
                    selectionsByWorkId={positiveByWorkId}
                    title={shelf.label}
                    works={onboardingEligibleWorks.filter((work) =>
                      work.genres.includes(shelf.genre),
                    )}
                  />
                ))}
                <WorkShelf
                  labels={ANCHOR_CARD_LABELS}
                  nextLabel={onboardingStrings.step1.nextShelf}
                  onToggleFavorite={toggleFavorite}
                  onToggleSelection={togglePositiveSelection}
                  previousLabel={onboardingStrings.step1.previousShelf}
                  selectionsByWorkId={positiveByWorkId}
                  title={onboardingStrings.step1.shelves.other}
                  works={onboardingEligibleWorks.filter((work) =>
                    work.genres.every((genre) => !PRIMARY_SHELF_GENRES.has(genre)),
                  )}
                />
              </div>
            )}
          </div>

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
            onContinue={continueFromStepOne}
            onRemove={togglePositiveSelection}
            removeLabel={onboardingStrings.step1.remove}
            selections={draft.positiveEntries}
            limitActive={limitMessage !== ""}
            shakeKey={shakeKey}
            worksById={worksById}
          />
        </>
      ) : (
        <fieldset
          aria-busy={submitting}
          aria-label={onboardingStrings.step2.title}
          className="onboarding-step-two"
          disabled={submitting}
        >
          <header className="onboarding-header">
            <p>{onboardingStrings.step2.eyebrow}</p>
            <h1 ref={headingRef} tabIndex={-1}>
              {onboardingStrings.step2.title} <span>{onboardingStrings.step2.optional}</span>
            </h1>
            <p>{onboardingStrings.step2.description}</p>
          </header>

          {draft.negativeEntries.length > 0 ? (
            <section aria-label={onboardingStrings.step2.title} className="negative-entries">
              {draft.negativeEntries.map((entry) => {
                const work = worksById.get(entry.workId);
                return work === undefined ? null : (
                  <NegativeEntryEditor
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
            onSearchStateChange={setStepTwoSearch}
            placeholder={onboardingStrings.step2.searchPlaceholder}
            works={selectableCatalogWorks}
          />
          <p aria-atomic="true" aria-live="polite" className="visually-hidden">
            {stepTwoSearch.query.trim().length > 0
              ? onboardingStrings.searchResults(stepTwoSearch.query, stepTwoSearch.results.length)
              : ""}
          </p>

          {stepTwoSearch.query.trim().length === 0 ? (
            <p className="onboarding-search-prompt">{onboardingStrings.step2.emptySearch}</p>
          ) : stepTwoSearch.results.length === 0 ? (
            <div className="onboarding-empty">
              <p>{onboardingStrings.step2.noResults}</p>
            </div>
          ) : (
            <section
              aria-label={onboardingStrings.step2.searchLabel}
              className="negative-result-grid"
            >
              {stepTwoSearch.results.map((work: Work) => (
                <NegativeWorkCard
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
                  work={work}
                />
              ))}
            </section>
          )}

          <div className="onboarding-step-actions">
            <button
              className={
                draft.negativeEntries.length === 0 ? "onboarding-step-actions__primary" : undefined
              }
              disabled={submitting}
              onClick={() => void complete(false)}
              type="button"
            >
              {submitting ? onboardingStrings.step2.saving : onboardingStrings.step2.skip}
            </button>
            <button
              className={
                draft.negativeEntries.length > 0 ? "onboarding-step-actions__primary" : undefined
              }
              disabled={submitting}
              onClick={() => void complete(true)}
              type="button"
            >
              {submitting ? onboardingStrings.step2.saving : onboardingStrings.step2.finish}
            </button>
          </div>
        </fieldset>
      )}
    </ResolvedOnboardingPage>
  );
}
