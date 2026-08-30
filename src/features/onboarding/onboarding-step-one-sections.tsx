"use client";

import { type Ref, useEffect, useRef, useState } from "react";
import {
  BookmarkIcon,
  Clock3Icon,
  CompassIcon,
  Grid2X2Icon,
  ScanSearchIcon,
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

export function OnboardingStepProgress() {
  const steps = [
    onboardingStrings.stepProgress.selection,
    onboardingStrings.stepProgress.dna,
    onboardingStrings.stepProgress.recommendations,
  ] as const;

  return (
    <ol
      aria-label={onboardingStrings.stepProgress.label}
      className="onboarding-progress mx-auto mb-[var(--space-2)] flex max-w-[var(--layout-width-form)] list-none flex-wrap items-center justify-center gap-y-[var(--space-1)] p-0 text-[length:var(--text-caption-size)] text-text-muted md:mb-[var(--space-4)] md:text-[length:var(--text-body-size)]"
    >
      {steps.map((step, index) => (
        <li
          aria-current={index === 0 ? "step" : undefined}
          className="flex shrink-0 items-center"
          key={step}
        >
          {index === 0 ? null : (
            <span
              aria-hidden="true"
              className="mx-[var(--space-1)] h-px w-[var(--space-3)] bg-line md:mx-[var(--space-3)] md:w-[var(--space-8)]"
            />
          )}
          <span
            className={
              index === 0
                ? "grid size-[var(--space-7)] place-items-center rounded-full border border-accent bg-accent-soft font-display font-bold text-accent md:size-[var(--space-8)]"
                : "grid size-[var(--space-7)] place-items-center rounded-full border border-line font-display font-bold md:size-[var(--space-8)]"
            }
          >
            {index + 1}
          </span>
          <span
            className={
              index === 0
                ? "ms-[var(--space-content)] font-bold text-text-strong"
                : "ms-[var(--space-content)]"
            }
          >
            {step}
          </span>
        </li>
      ))}
    </ol>
  );
}

type OnboardingIntroProps = Readonly<{
  addMode: boolean;
  headingRef: Ref<HTMLHeadingElement>;
}>;

export function OnboardingIntro({ addMode, headingRef }: OnboardingIntroProps) {
  const benefitIcons = [ScanSearchIcon, Clock3Icon, CompassIcon] as const;

  return (
    <div className="onboarding-hero__copy min-w-0">
      <header className="onboarding-header mb-[var(--space-3)] grid max-w-[var(--layout-width-reading)] gap-[var(--space-content-tight)]">
        <p className="font-display text-[length:var(--text-caption-size)] font-bold tracking-[0.08em] text-text-muted">
          {addMode ? onboardingStrings.addMode.eyebrow : onboardingStrings.step1.eyebrow}
        </p>
        <h1
          className="max-w-[20ch] text-[length:var(--font-size-28)] leading-[1.2] tracking-[-0.03em] text-text-strong md:text-[2rem]"
          ref={headingRef}
          tabIndex={-1}
        >
          {addMode ? onboardingStrings.addMode.title : onboardingStrings.step1.title}
        </h1>
        <p className="text-text-muted">
          {addMode ? onboardingStrings.addMode.description : onboardingStrings.step1.description}
        </p>
      </header>
      {addMode ? null : (
        <ul className="onboarding-benefits m-0 grid list-none overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface-1 p-0 md:grid-cols-3">
          {onboardingStrings.step1.benefits.map((benefit, index) => {
            const BenefitIcon = benefitIcons[index] ?? SparklesIcon;
            return (
              <li
                className="grid grid-cols-[auto_minmax(0,1fr)] gap-[var(--space-content)] border-b border-line p-[var(--space-2)] leading-[1.45] last:border-b-0 md:border-r md:border-b-0 md:last:border-r-0"
                key={benefit.title}
              >
                <span
                  aria-hidden="true"
                  className="grid size-[var(--space-8)] place-items-center rounded-full border border-line/70 bg-surface-1 text-text-muted [&>svg]:size-4"
                >
                  <BenefitIcon />
                </span>
                <span className="grid min-w-0 gap-[var(--space-content-tight)]">
                  <strong className="text-[length:var(--font-size-14)] text-text-strong">
                    {benefit.title}
                  </strong>
                  <span className="text-[length:var(--text-caption-size)] leading-[1.5] text-text-muted">
                    {benefit.description}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
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
  collectionId: OnboardingCollectionId;
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
  collectionId,
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
      className="onboarding-collection-panel mt-[var(--space-content-loose)] min-w-0 rounded-[var(--radius-card)] border border-line bg-surface-1 p-[var(--space-4)]"
      id={COLLECTION_PANEL_ID}
    >
      <h3
        className="mb-[var(--space-3)] text-[length:var(--text-subheading-size)] tracking-tight text-text-strong"
        id={COLLECTION_PANEL_TITLE_ID}
      >
        {onboardingStrings.step1.collections[collectionId].title}
      </h3>
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
  const activeCollection =
    activeId === undefined
      ? undefined
      : onboardingCollections.find((collection) => collection.id === activeId);

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
      <div className="onboarding-collections__grid grid grid-cols-2 gap-[var(--space-content)] md:gap-[var(--space-4)]">
        {onboardingCollections.map((collection) => {
          const copy = onboardingStrings.step1.collections[collection.id];
          const covers = (previewWorks.get(collection.id) ?? []).slice(
            0,
            COLLECTION_TRIGGER_COVER_COUNT,
          );
          const expandedTrigger = activeId === collection.id;
          return (
            <Button
              aria-controls={expandedTrigger ? COLLECTION_PANEL_ID : undefined}
              aria-expanded={expandedTrigger}
              className="onboarding-collection grid h-auto min-h-[var(--control-min-size)] min-w-0 w-full shrink grid-rows-[auto_auto] items-start justify-stretch justify-items-stretch gap-[var(--space-content)] whitespace-normal p-[var(--space-3)] text-start aria-expanded:border-accent aria-expanded:bg-accent-soft aria-expanded:text-text-strong"
              key={collection.id}
              onClick={() => onSelect?.(expandedTrigger ? undefined : collection.id)}
              type="button"
              variant={expandedTrigger ? "secondary" : "outline"}
            >
              <span className="onboarding-collection__copy grid min-w-0 gap-[var(--space-content-tight)]">
                <strong className="line-clamp-2 text-[length:var(--font-size-14)] text-text-strong">
                  {copy.title}
                </strong>
                <span className="line-clamp-2 text-[length:var(--text-caption-size)] leading-[1.45] text-text-muted">
                  {copy.description}
                </span>
              </span>
              {covers.length === 0 ? null : (
                <span
                  aria-hidden="true"
                  className="onboarding-collection__covers pointer-events-none grid w-full min-w-0 grid-cols-3 gap-[var(--space-content-tight)] [&>.cover-image]:min-w-0"
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
            </Button>
          );
        })}
      </div>
      {activeCollection === undefined ? null : (
        <OnboardingCollectionPanel
          collectionId={activeCollection.id}
          coverUrls={coverUrls}
          key={activeCollection.id}
          labels={labels}
          onCoverVisible={onCoverVisible}
          onToggleFavorite={onToggleFavorite}
          onToggleSelection={onToggleSelection}
          panelWorks={panelWorks}
          previewLimit={previewLimit}
          selectionsByWorkId={selectionsByWorkId}
        />
      )}
    </section>
  );
}

export function OnboardingSelectionGuidance() {
  const guidanceIcons = [BookmarkIcon, Grid2X2Icon, WandSparklesIcon, SparklesIcon] as const;

  return (
    <section aria-labelledby="onboarding-guidance-heading" className="onboarding-guidance min-w-0">
      <SectionHeading
        compact
        id="onboarding-guidance-heading"
        title={onboardingStrings.step1.guidanceHeading}
      />
      <ul className="m-0 grid list-none gap-[var(--space-content-loose)] p-0 sm:grid-cols-2 md:grid-cols-4">
        {onboardingStrings.step1.guidance.map((item, index) => {
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
