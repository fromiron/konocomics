"use client";

import type { FocusEventHandler, KeyboardEventHandler, Ref } from "react";
import { CheckIcon, StarIcon } from "lucide-react";

import { CoverImage } from "@/components/cover/CoverImage";
import { Button } from "@/components/design-system/button";
import type { Work } from "@/domain/catalog/types";
import type { PositiveOnboardingEntry } from "@/domain/profile/onboarding";
import { cn } from "@/lib/utils";

type AnchorCardLabels = Readonly<{
  select: string;
  remove: string;
  selected: string;
  favorite: string;
  markFavorite: string;
  markLiked: string;
}>;

type AnchorCoverCardProps = Readonly<{
  work: Work;
  selection?: PositiveOnboardingEntry;
  coverUrl?: string | null;
  labels: AnchorCardLabels;
  onCoverSettled?: () => void;
  onToggleSelection: (workId: string) => void;
  onToggleFavorite: (workId: string) => void;
  tabIndex?: number;
  selectionButtonRef?: Ref<HTMLButtonElement>;
  onSelectionFocus?: FocusEventHandler<HTMLButtonElement>;
  onSelectionKeyDown?: KeyboardEventHandler<HTMLButtonElement>;
}>;

export function AnchorCoverCard({
  work,
  selection,
  coverUrl,
  labels,
  onCoverSettled,
  onToggleSelection,
  onToggleFavorite,
  tabIndex = 0,
  selectionButtonRef,
  onSelectionFocus,
  onSelectionKeyDown,
}: AnchorCoverCardProps) {
  const isSelected = selection !== undefined;
  const isFavorite = selection?.reaction === "favorite";

  return (
    <article
      className="anchor-card w-[104px] min-w-[104px] snap-start md:w-32 md:min-w-32"
      data-selected={isSelected || undefined}
    >
      <Button
        aria-label={`${work.title} — ${isSelected ? labels.remove : labels.select}`}
        aria-pressed={isSelected}
        className="anchor-card__selection group/selection !grid !h-auto min-h-[var(--control-min-size)] w-full !justify-start gap-[var(--space-content)] rounded-[var(--radius-card)] border-0 bg-transparent p-0 text-start"
        onClick={() => onToggleSelection(work.id)}
        onFocus={onSelectionFocus}
        onKeyDown={onSelectionKeyDown}
        ref={selectionButtonRef}
        tabIndex={tabIndex}
        type="button"
        variant="ghost"
      >
        <span
          className={cn(
            "anchor-card__cover relative block overflow-hidden rounded-[var(--radius-cover-selection)] border-2 border-transparent bg-surface-2 transition-transform duration-[var(--motion-duration-feedback)] ease-[var(--motion-ease-direct)] group-hover/selection:-translate-y-0.5 group-hover/selection:shadow-[var(--shadow-raised)] motion-reduce:transform-none motion-reduce:transition-none",
            isSelected &&
              "border-accent shadow-[0_0_0_2px_var(--accent-soft)] motion-safe:animate-[anchor-card-selected_var(--motion-duration-feedback)_var(--motion-ease-direct)]",
          )}
        >
          <CoverImage
            coverUrl={coverUrl}
            creators={work.creators}
            onSettled={onCoverSettled}
            requestedSize={400}
            title={work.title}
          />
          {isSelected ? (
            <span
              aria-hidden="true"
              className="anchor-card__check absolute top-1 right-1 grid size-7 place-items-center rounded-full bg-accent font-bold text-on-accent shadow-[var(--shadow-level-1)] motion-safe:animate-[anchor-check-appear_var(--motion-duration-feedback)_var(--motion-ease-direct)] [&>svg]:size-4"
            >
              <CheckIcon />
            </span>
          ) : null}
        </span>
        <span className="anchor-card__title line-clamp-2 text-[length:var(--font-size-14)] leading-[1.45] font-bold text-text-strong">
          {work.title}
        </span>
        <span className="anchor-card__creator line-clamp-1 text-[length:var(--text-caption-size)] leading-[1.4] text-text-muted">
          {work.creators.join("・")}
        </span>
      </Button>
      {isSelected ? (
        <Button
          aria-label={`${work.title} — ${isFavorite ? labels.markLiked : labels.markFavorite}`}
          aria-pressed={isFavorite}
          className="anchor-card__favorite !h-auto min-h-[var(--control-min-size)] w-full gap-[var(--space-content-tight)] border-0 bg-transparent px-[var(--space-1)] py-[var(--space-2)] text-[length:var(--text-caption-size)] font-bold text-text-muted aria-pressed:text-accent [&>svg]:size-4"
          onClick={() => onToggleFavorite(work.id)}
          type="button"
          variant="ghost"
        >
          <StarIcon aria-hidden="true" />
          {isFavorite ? labels.favorite : labels.selected}
        </Button>
      ) : null}
    </article>
  );
}
