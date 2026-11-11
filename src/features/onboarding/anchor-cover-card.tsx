"use client";

import type { FocusEventHandler, KeyboardEventHandler, Ref } from "react";
import { CheckIcon, PlusIcon, StarIcon } from "lucide-react";

import { CoverImage } from "@/components/cover/CoverImage";
import { Button } from "@/components/design-system/button";
import {
  COVER_CARD_META_CLASSNAME,
  COVER_CARD_SURFACE_CLASSNAME,
  COVER_CARD_SURFACE_TRANSITION_CLASSNAME,
  COVER_CARD_TITLE_CLASSNAME,
} from "@/components/media/cover-card";
import { useSaveConfirmation } from "@/components/motion/use-save-confirmation";
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
  onCoverVisible?: () => void;
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
  onCoverVisible,
  onToggleSelection,
  onToggleFavorite,
  tabIndex = 0,
  selectionButtonRef,
  onSelectionFocus,
  onSelectionKeyDown,
}: AnchorCoverCardProps) {
  const isSelected = selection !== undefined;
  const isFavorite = selection?.reaction === "favorite";
  // The selection prop changes only after the draft accepted the work (04 §6 D·G).
  const {
    attach: saveAttach,
    markPressed: saveMarkPressed,
    stamping: saveStamping,
  } = useSaveConfirmation<HTMLSpanElement>(isSelected);

  return (
    // A selection tool on the common cover card face (04 §2.10): the face takes `surface-2` on
    // hover or focus, the title sits under the cover, and the stamps stay on the cover.
    <article
      className={cn(
        "anchor-card relative w-[104px] min-w-[104px] snap-start rounded-[var(--radius-media-card)] p-[var(--space-2)] md:w-32 md:min-w-32",
        COVER_CARD_SURFACE_CLASSNAME,
        COVER_CARD_SURFACE_TRANSITION_CLASSNAME,
      )}
      data-selected={isSelected || undefined}
    >
      <Button
        aria-label={`${work.title} — ${isSelected ? labels.remove : labels.select}`}
        aria-pressed={isSelected}
        // The card face owns the hover and pressed colours: the button itself stays transparent,
        // so the title under the cover never sits on a filled button.
        className="anchor-card__selection group/selection !grid !h-auto min-h-[var(--control-min-size)] w-full !grid-cols-1 !justify-start gap-[var(--space-2)] rounded-[var(--radius-cover)] border-0 bg-transparent p-0 text-start whitespace-normal hover:bg-transparent aria-pressed:bg-transparent aria-pressed:hover:bg-transparent aria-pressed:active:bg-transparent [@media(hover:hover)_and_(pointer:fine)]:hover:bg-transparent [@media(hover:hover)_and_(pointer:fine)]:aria-pressed:hover:bg-transparent"
        onClick={() => {
          saveMarkPressed();
          onToggleSelection(work.id);
        }}
        onFocus={onSelectionFocus}
        onKeyDown={onSelectionKeyDown}
        ref={selectionButtonRef}
        tabIndex={tabIndex}
        type="button"
        variant="ghost"
      >
        <span
          className={cn(
            "anchor-card__cover relative block overflow-hidden rounded-[var(--radius-cover-selection)] border-2 border-transparent bg-surface-2",
            isSelected &&
              "border-accent shadow-[0_0_0_2px_var(--accent-soft)] motion-safe:animate-[anchor-card-selected_var(--motion-duration-feedback)_var(--motion-ease-direct)]",
          )}
        >
          <CoverImage
            coverUrl={coverUrl}
            creators={work.creators}
            onVisible={onCoverVisible}
            requestedSize={400}
            title={work.title}
          />
          {isSelected ? (
            <span
              aria-hidden="true"
              className={cn(
                "anchor-card__check absolute top-1 right-1 grid size-7 place-items-center rounded-full bg-accent font-bold text-on-accent shadow-[var(--shadow-level-1)] [--reduced-motion-duration:var(--motion-duration-feedback)] [&>svg]:size-4",
                saveStamping
                  ? "confirm-stamp"
                  : "motion-safe:animate-[anchor-check-appear_var(--motion-duration-feedback)_var(--motion-ease-direct)]",
              )}
              data-reduced-motion="fade"
              data-reduced-motion-enter=""
              ref={saveAttach}
            >
              <CheckIcon />
            </span>
          ) : (
            <span
              aria-hidden="true"
              className="anchor-card__add absolute top-1 right-1 grid size-7 place-items-center rounded-full border border-line bg-surface-1/90 text-text-strong [&>svg]:size-4"
            >
              <PlusIcon />
            </span>
          )}
        </span>
        <span className="anchor-card__identity grid min-w-0 gap-[var(--space-content-tight)]">
          <span className={cn("anchor-card__title", COVER_CARD_TITLE_CLASSNAME)}>{work.title}</span>
          <span className={cn("anchor-card__creator", COVER_CARD_META_CLASSNAME)}>
            {work.creators.join("・")}
          </span>
        </span>
      </Button>
      {isSelected ? (
        // A box over the cover keeps the star on the cover's corner, clear of the title.
        <span className="pointer-events-none absolute inset-x-[var(--space-2)] top-[var(--space-2)] aspect-[30/43]">
          <Button
            aria-label={`${work.title} — ${isFavorite ? labels.markLiked : labels.markFavorite}`}
            aria-pressed={isFavorite}
            className="anchor-card__favorite pointer-events-auto absolute right-1 bottom-1 !size-[var(--control-min-size)] min-h-[var(--control-min-size)] min-w-[var(--control-min-size)] rounded-full border border-line bg-surface-1/90 p-0 text-text-muted aria-pressed:border-accent aria-pressed:bg-surface-1/90 aria-pressed:text-accent-ink [&>svg]:size-4"
            onClick={() => onToggleFavorite(work.id)}
            type="button"
            variant="ghost"
          >
            <StarIcon aria-hidden="true" />
          </Button>
        </span>
      ) : null}
    </article>
  );
}
