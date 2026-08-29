import type { Ref } from "react";
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
import { onboardingStrings } from "@/lib/strings";

import { onboardingCollections, type OnboardingCollectionId } from "./onboarding-collections";

export function OnboardingStepProgress() {
  const steps = [
    onboardingStrings.stepProgress.selection,
    onboardingStrings.stepProgress.dna,
    onboardingStrings.stepProgress.recommendations,
  ] as const;

  return (
    <ol
      aria-label={onboardingStrings.stepProgress.label}
      className="onboarding-progress mx-auto mb-[var(--space-4)] flex max-w-[var(--layout-width-form)] list-none items-center overflow-x-auto p-0 text-text-muted md:mb-[var(--space-4)]"
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
              className="mx-[var(--space-3)] h-px w-[var(--space-8)] bg-line"
            />
          )}
          <span
            className={
              index === 0
                ? "grid size-[var(--space-8)] place-items-center rounded-full border border-accent bg-accent-soft font-display font-bold text-accent"
                : "grid size-[var(--space-8)] place-items-center rounded-full border border-line font-display font-bold"
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
      <div className="flex gap-[var(--space-content)] overflow-x-auto pb-[var(--space-content)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&>button[aria-pressed=true]]:border-accent [&>button[aria-pressed=true]]:text-accent">
        <Button
          aria-pressed={genre === undefined}
          className="shrink-0"
          onClick={() => onChange?.(undefined)}
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

type OnboardingCollectionGridProps = Readonly<{
  activeId?: OnboardingCollectionId;
  previewWorks: ReadonlyMap<OnboardingCollectionId, readonly Work[]>;
  coverUrls: ReadonlyMap<string, string | null>;
  onCoverSettled: (workId: string) => void;
  onSelect?: (id: OnboardingCollectionId | undefined) => void;
}>;

export function OnboardingCollectionGrid({
  activeId,
  coverUrls,
  onCoverSettled,
  onSelect,
  previewWorks,
}: OnboardingCollectionGridProps) {
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
      <div className="onboarding-collections__grid grid gap-[var(--space-content-loose)] md:grid-cols-2">
        {onboardingCollections.map((collection) => {
          const copy = onboardingStrings.step1.collections[collection.id];
          const works = previewWorks.get(collection.id) ?? [];
          const active = activeId === collection.id;
          return (
            <Button
              aria-pressed={active}
              className="onboarding-collection grid h-auto min-h-[calc(var(--space-12)*4+var(--space-2))] grid-rows-[auto_1fr_auto] justify-items-stretch gap-[var(--space-4)] whitespace-normal p-[var(--space-4)] aria-pressed:border-accent aria-pressed:bg-accent-soft"
              key={collection.id}
              onClick={() => onSelect?.(active ? undefined : collection.id)}
              type="button"
              variant={active ? "secondary" : "outline"}
            >
              <span className="onboarding-collection__copy grid gap-[var(--space-content-tight)] text-start">
                <strong className="text-text-strong">{copy.title}</strong>
                <span className="text-[length:var(--text-caption-size)] text-text-muted">
                  {copy.description}
                </span>
              </span>
              <span
                aria-hidden="true"
                className="onboarding-collection__covers pointer-events-none grid min-w-0 grid-cols-6 gap-[var(--space-content-tight)] [&>.cover-image]:min-w-0"
              >
                {works.map((work) => (
                  <CoverImage
                    coverUrl={coverUrls.get(work.id)}
                    creators={work.creators}
                    decorative
                    key={work.id}
                    onSettled={() => onCoverSettled(work.id)}
                    requestedSize={200}
                    title={work.title}
                  />
                ))}
              </span>
              <span className="onboarding-collection__action text-start text-[length:var(--text-caption-size)] font-bold text-text-strong">
                {copy.action}
              </span>
            </Button>
          );
        })}
      </div>
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
