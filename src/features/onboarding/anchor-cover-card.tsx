"use client";

import type { FocusEventHandler, KeyboardEventHandler, Ref } from "react";

import { CoverImage } from "@/components/cover/CoverImage";
import type { Work } from "@/domain/catalog/types";
import type { PositiveOnboardingEntry } from "@/domain/profile/onboarding";

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
  labels: AnchorCardLabels;
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
  labels,
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
    <article className="anchor-card" data-selected={isSelected || undefined}>
      <button
        aria-label={`${work.title} — ${isSelected ? labels.remove : labels.select}`}
        aria-pressed={isSelected}
        className="anchor-card__selection"
        onClick={() => onToggleSelection(work.id)}
        onFocus={onSelectionFocus}
        onKeyDown={onSelectionKeyDown}
        ref={selectionButtonRef}
        tabIndex={tabIndex}
        type="button"
      >
        <span className="anchor-card__cover">
          <CoverImage creators={work.creators} requestedSize={400} title={work.title} />
          {isSelected ? (
            <span aria-hidden="true" className="anchor-card__check">
              ✓
            </span>
          ) : null}
        </span>
        <span className="anchor-card__title">{work.title}</span>
        <span className="anchor-card__creator">{work.creators.join("・")}</span>
      </button>
      {isSelected ? (
        <button
          aria-label={`${work.title} — ${isFavorite ? labels.markLiked : labels.markFavorite}`}
          aria-pressed={isFavorite}
          className="anchor-card__favorite"
          onClick={() => onToggleFavorite(work.id)}
          type="button"
        >
          <span aria-hidden="true">★</span>
          {isFavorite ? labels.favorite : labels.selected}
        </button>
      ) : null}
    </article>
  );
}
