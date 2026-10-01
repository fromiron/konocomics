"use client";

import { type ReactNode, type Ref, useEffect, useRef, useState } from "react";
import {
  BookmarkIcon,
  ChevronDownIcon,
  Grid2X2Icon,
  SparklesIcon,
  WandSparklesIcon,
} from "lucide-react";

import { CoverImage } from "@/components/cover/CoverImage";
import { Button } from "@/components/design-system/button";
import { SectionHeading } from "@/components/layout/section-heading";
import { GENRE_TAGS } from "@/domain/catalog/constants";
import type { GenreTag, Work } from "@/domain/catalog/types";
import type { PositiveOnboardingEntry } from "@/domain/profile/onboarding";
import { onboardingStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

import { AnchorCoverCard } from "./anchor-cover-card";
import {
  COLLECTION_DESKTOP_QUERY,
  COLLECTION_EXPANDED_LIMIT,
  COLLECTION_PANEL_ID,
  COLLECTION_PANEL_TITLE_ID,
  COLLECTION_PREVIEW_LIMIT_DESKTOP,
  COLLECTION_PREVIEW_LIMIT_MOBILE,
  COLLECTION_TRIGGER_COVER_COUNT,
  collectionPreviewLimitForViewport,
  onboardingCollections,
  type OnboardingCollectionId,
} from "./onboarding-collections";

export function OnboardingWelcome({
  headingRef,
}: Readonly<{ headingRef: Ref<HTMLHeadingElement> }>) {
  const copy = onboardingStrings.welcome;

  return (
    <section
      aria-labelledby="onboarding-welcome-heading"
      className="onboarding-welcome mb-[var(--space-6)] grid gap-[var(--space-5)] rounded-[var(--radius-card)] border border-accent/30 bg-surface-1 p-[var(--space-5)] md:p-[var(--space-8)]"
    >
      <header className="grid max-w-[var(--layout-width-reading)] gap-[var(--space-content-tight)]">
        <p className="font-display text-[length:var(--text-caption-size)] font-bold tracking-[0.08em] text-accent">
          {copy.eyebrow}
        </p>
        <h1
          className="text-[length:var(--font-size-28)] leading-[1.2] tracking-[-0.03em] text-text-strong md:text-[length:var(--font-size-32)]"
          id="onboarding-welcome-heading"
          ref={headingRef}
          tabIndex={-1}
        >
          {copy.title}
        </h1>
        <p className="text-text-muted">{copy.description}</p>
      </header>
      <ol
        aria-label={copy.stepsLabel}
        className="onboarding-welcome__steps m-0 grid list-none gap-[var(--space-content-loose)] p-0 md:grid-cols-3"
      >
        {copy.steps.map((step, index) => (
          <li
            className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-[var(--space-3)] rounded-[var(--radius-card)] border border-line bg-surface-2 p-[var(--space-4)] md:grid-cols-1"
            key={step.title}
          >
            <span
              aria-hidden="true"
              className="grid size-[var(--space-8)] place-items-center rounded-full border border-accent bg-accent-soft font-display font-bold text-accent"
            >
              {index + 1}
            </span>
            <span className="grid min-w-0 gap-[var(--space-content-tight)]">
              <strong className="text-[length:var(--font-size-14)] text-text-strong">
                {step.title}
              </strong>
              <span className="text-[length:var(--text-caption-size)] leading-[1.5] text-text-muted">
                {step.description}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

type OnboardingIntroProps = Readonly<{
  addMode: boolean;
  headingRef?: Ref<HTMLHeadingElement>;
  action?: ReactNode;
}>;

export function OnboardingIntro({ action, addMode, headingRef }: OnboardingIntroProps) {
  const Heading = addMode ? "h1" : "h2";

  return (
    <header className="onboarding-header mb-[var(--space-5)] grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-[var(--space-4)] gap-y-[var(--space-content-tight)]">
      <div className="grid max-w-[var(--layout-width-reading)] min-w-0 gap-[var(--space-content-tight)]">
        <p className="font-display text-[length:var(--text-caption-size)] font-bold tracking-[0.08em] text-text-muted">
          {addMode ? onboardingStrings.addMode.eyebrow : onboardingStrings.step1.eyebrow}
        </p>
        <Heading
          className="max-w-[20ch] text-[length:var(--font-size-20)] leading-[1.3] tracking-[-0.02em] text-text-strong md:text-[length:var(--font-size-28)]"
          ref={headingRef}
          tabIndex={headingRef === undefined ? undefined : -1}
        >
          {addMode ? onboardingStrings.addMode.title : onboardingStrings.step1.title}
        </Heading>
        <p className="text-text-muted">
          {addMode ? onboardingStrings.addMode.description : onboardingStrings.step1.description}
        </p>
      </div>
      {action}
    </header>
  );
}

type OnboardingGenreChipsProps = Readonly<{
  genre?: GenreTag;
  onChange?: (genre: GenreTag | undefined) => void;
}>;

export function OnboardingGenreChips({ genre, onChange }: OnboardingGenreChipsProps) {
  return (
    <section aria-labelledby="onboarding-genre-heading" className="onboarding-genres min-w-0">
      <SectionHeading
        compact
        id="onboarding-genre-heading"
        title={onboardingStrings.step1.genreHeading}
      />
      <div className="flex flex-wrap gap-[var(--space-content)] pb-[var(--space-content)] [&>button[aria-pressed=true]]:border-accent [&>button[aria-pressed=true]]:text-accent">
        <Button
          aria-pressed={genre === undefined}
          className="shrink-0"
          onClick={() => {
            if (genre !== undefined) {
              onChange?.(undefined);
            }
          }}
          type="button"
          variant={genre === undefined ? "secondary" : "outline"}
        >
          {onboardingStrings.step1.allGenres}
        </Button>
        {GENRE_TAGS.map((genreId) => (
          <Button
            aria-pressed={genre === genreId}
            className="shrink-0"
            key={genreId}
            onClick={() => onChange?.(genre === genreId ? undefined : genreId)}
            type="button"
            variant={genre === genreId ? "secondary" : "outline"}
          >
            {onboardingStrings.step1.genreLabels[genreId]}
          </Button>
        ))}
      </div>
    </section>
  );
}

type OnboardingCollectionPanelProps = Readonly<{
  panelWorks: readonly Work[];
  previewLimit: number;
  coverUrls: ReadonlyMap<string, string | null>;
  onCoverVisible: (workId: string) => void;
  selectionsByWorkId: ReadonlyMap<string, PositiveOnboardingEntry>;
  labels: Parameters<typeof AnchorCoverCard>[0]["labels"];
  onToggleSelection: (workId: string) => void;
  onToggleFavorite: (workId: string) => void;
}>;

function OnboardingCollectionPanel({
  coverUrls,
  labels,
  onCoverVisible,
  onToggleFavorite,
  onToggleSelection,
  panelWorks,
  previewLimit,
  selectionsByWorkId,
}: OnboardingCollectionPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const expandedStatusRef = useRef<HTMLParagraphElement>(null);
  const visibleWorks = panelWorks.slice(0, expanded ? COLLECTION_EXPANDED_LIMIT : previewLimit);
  const canShowMore = !expanded && panelWorks.length > previewLimit;

  useEffect(() => {
    if (!expanded) {
      return;
    }
    expandedStatusRef.current?.focus();
  }, [expanded]);

  return (
    <section
      aria-labelledby={COLLECTION_PANEL_TITLE_ID}
      className="onboarding-collection-panel min-w-0 px-[var(--space-4)] pb-[var(--space-4)]"
      data-reduced-motion="fade"
      data-reduced-motion-enter=""
      id={COLLECTION_PANEL_ID}
    >
      {visibleWorks.length === 0 ? (
        <p className="text-text-muted">{onboardingStrings.step1.collectionEmpty}</p>
      ) : (
        <div className="onboarding-collection-panel__works grid grid-cols-[repeat(auto-fill,minmax(104px,1fr))] gap-x-[var(--space-3)] gap-y-[var(--space-5)] [&>.anchor-card]:w-full [&>.anchor-card]:min-w-0 md:grid-cols-[repeat(auto-fill,minmax(128px,1fr))] md:gap-x-[var(--space-4)] md:gap-y-[var(--space-6)]">
          {visibleWorks.map((work) => (
            <AnchorCoverCard
              coverUrl={coverUrls.get(work.id)}
              key={work.id}
              labels={labels}
              onCoverVisible={() => onCoverVisible(work.id)}
              onToggleFavorite={onToggleFavorite}
              onToggleSelection={onToggleSelection}
              selection={selectionsByWorkId.get(work.id)}
              work={work}
            />
          ))}
        </div>
      )}
      {canShowMore ? (
        <Button
          className="mt-[var(--space-4)]"
          onClick={() => setExpanded(true)}
          type="button"
          variant="outline"
        >
          {onboardingStrings.step1.showMore}
        </Button>
      ) : expanded ? (
        <p
          className="mt-[var(--space-4)] w-fit max-w-full text-[length:var(--text-caption-size)] text-text-muted"
          ref={expandedStatusRef}
          role="status"
          tabIndex={-1}
        >
          {onboardingStrings.step1.collectionVisibleCount(visibleWorks.length)}
        </p>
      ) : null}
    </section>
  );
}

type OnboardingCollectionGridProps = Readonly<{
  activeId?: OnboardingCollectionId;
  previewWorks: ReadonlyMap<OnboardingCollectionId, readonly Work[]>;
  panelWorks: readonly Work[];
  coverUrls: ReadonlyMap<string, string | null>;
  onCoverVisible: (workId: string) => void;
  onSelect?: (id: OnboardingCollectionId | undefined) => void;
  selectionsByWorkId: ReadonlyMap<string, PositiveOnboardingEntry>;
  labels: Parameters<typeof AnchorCoverCard>[0]["labels"];
  onToggleSelection: (workId: string) => void;
  onToggleFavorite: (workId: string) => void;
}>;

/**
 * Collections are click-only accordion rows (same disclosure language as the /taste factor
 * groups): each row opens its works directly under its own trigger, and only one row is open at a
 * time so the open shelf can be restored from the URL.
 */
export function OnboardingCollectionGrid({
  activeId,
  coverUrls,
  labels,
  onCoverVisible,
  onSelect,
  onToggleFavorite,
  onToggleSelection,
  panelWorks,
  previewWorks,
  selectionsByWorkId,
}: OnboardingCollectionGridProps) {
  const [previewLimit, setPreviewLimit] = useState(() => collectionPreviewLimitForViewport());

  useEffect(() => {
    if (typeof window.matchMedia !== "function") {
      return;
    }
    const mediaQuery = window.matchMedia(COLLECTION_DESKTOP_QUERY);
    const sync = () => {
      setPreviewLimit(
        mediaQuery.matches ? COLLECTION_PREVIEW_LIMIT_DESKTOP : COLLECTION_PREVIEW_LIMIT_MOBILE,
      );
    };
    mediaQuery.addEventListener("change", sync);
    return () => mediaQuery.removeEventListener("change", sync);
  }, []);

  return (
    <section
      aria-labelledby="onboarding-collections-heading"
      className="onboarding-collections min-w-0"
    >
      <SectionHeading
        compact
        id="onboarding-collections-heading"
        title={onboardingStrings.step1.collectionsHeading}
      />
      <p className="mb-[var(--space-3)] text-[length:var(--text-caption-size)] text-text-muted">
        {onboardingStrings.step1.collectionsDescription}
      </p>
      <ul className="onboarding-collections__list m-0 grid list-none gap-[var(--space-content)] p-0">
        {onboardingCollections.map((collection) => {
          const copy = onboardingStrings.step1.collections[collection.id];
          const covers = (previewWorks.get(collection.id) ?? []).slice(
            0,
            COLLECTION_TRIGGER_COVER_COUNT,
          );
          const open = activeId === collection.id;
          return (
            <li
              className={cn(
                "onboarding-collection-row min-w-0 overflow-hidden rounded-[var(--radius-card)] border bg-surface-1",
                open ? "border-accent/60" : "border-line",
              )}
              key={collection.id}
            >
              <button
                aria-controls={open ? COLLECTION_PANEL_ID : undefined}
                aria-expanded={open}
                className="onboarding-collection grid min-h-[var(--control-min-size)] w-full min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-[var(--space-3)] bg-transparent p-[var(--space-4)] text-start focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring sm:grid-cols-[minmax(0,1fr)_auto_auto]"
                onClick={() => onSelect?.(open ? undefined : collection.id)}
                type="button"
              >
                <span className="onboarding-collection__copy grid min-w-0 gap-[var(--space-content-tight)]">
                  <strong
                    className="text-[length:var(--font-size-14)] text-text-strong"
                    id={open ? COLLECTION_PANEL_TITLE_ID : undefined}
                  >
                    {copy.title}
                  </strong>
                  <span className="text-[length:var(--text-caption-size)] leading-[1.45] text-text-muted">
                    {copy.description}
                  </span>
                </span>
                {covers.length === 0 ? null : (
                  <span
                    aria-hidden="true"
                    className="onboarding-collection__covers pointer-events-none hidden w-[calc(var(--space-12)*2)] grid-cols-3 gap-[var(--space-content-tight)] sm:grid [&>.cover-image]:min-w-0"
                  >
                    {covers.map((work) => (
                      <CoverImage
                        coverUrl={coverUrls.get(work.id)}
                        creators={work.creators}
                        decorative
                        key={work.id}
                        onVisible={() => onCoverVisible(work.id)}
                        requestedSize={200}
                        title={work.title}
                      />
                    ))}
                  </span>
                )}
                <span
                  aria-hidden="true"
                  className={cn(
                    "grid size-[var(--control-min-size)] place-items-center rounded-[var(--radius-pill)] border border-line text-text-muted",
                    open && "border-accent text-accent",
                  )}
                >
                  <ChevronDownIcon
                    className={cn(
                      "size-4 transition-transform duration-[var(--motion-duration-value)] motion-reduce:transition-none",
                      open && "rotate-180",
                    )}
                  />
                </span>
              </button>
              {open ? (
                <OnboardingCollectionPanel
                  coverUrls={coverUrls}
                  key={collection.id}
                  labels={labels}
                  onCoverVisible={onCoverVisible}
                  onToggleFavorite={onToggleFavorite}
                  onToggleSelection={onToggleSelection}
                  panelWorks={panelWorks}
                  previewLimit={previewLimit}
                  selectionsByWorkId={selectionsByWorkId}
                />
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function OnboardingSelectionGuidance({ addMode }: Readonly<{ addMode: boolean }>) {
  const guidanceIcons = [BookmarkIcon, Grid2X2Icon, WandSparklesIcon, SparklesIcon] as const;
  const guidance = addMode
    ? onboardingStrings.step1.guidance.add
    : onboardingStrings.step1.guidance.firstRun;

  return (
    <section aria-labelledby="onboarding-guidance-heading" className="onboarding-guidance min-w-0">
      <SectionHeading
        compact
        id="onboarding-guidance-heading"
        title={onboardingStrings.step1.guidanceHeading}
      />
      <ul className="m-0 grid list-none gap-[var(--space-content-loose)] p-0 sm:grid-cols-2">
        {guidance.map((item, index) => {
          const GuidanceIcon = guidanceIcons[index] ?? SparklesIcon;
          return (
            <li
              className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-[var(--space-content)] rounded-[var(--radius-card)] border border-line bg-surface-1 p-[var(--space-4)] text-[length:var(--text-caption-size)] leading-[1.5] text-text-muted"
              key={item}
            >
              <span
                aria-hidden="true"
                className="grid size-[var(--space-8)] place-items-center rounded-full border border-line/70 bg-surface-1 text-text-muted [&>svg]:size-4"
              >
                <GuidanceIcon />
              </span>
              <span>{item}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
