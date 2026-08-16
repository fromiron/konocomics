"use client";

import { useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

import { MediaShelf } from "@/components/media/media-shelf";
import type { Work } from "@/domain/catalog/types";
import type { PositiveOnboardingEntry } from "@/domain/profile/onboarding";

import { AnchorCoverCard } from "./anchor-cover-card";

type WorkShelfProps = Readonly<{
  title: string;
  works: readonly Work[];
  selectionsByWorkId: ReadonlyMap<string, PositiveOnboardingEntry>;
  labels: Parameters<typeof AnchorCoverCard>[0]["labels"];
  coverUrls?: ReadonlyMap<string, string | null>;
  onCoverSettled?: (workId: string) => void;
  onToggleSelection: (workId: string) => void;
  onToggleFavorite: (workId: string) => void;
}>;

export function WorkShelf({
  title,
  works,
  selectionsByWorkId,
  labels,
  coverUrls,
  onCoverSettled,
  onToggleSelection,
  onToggleFavorite,
}: WorkShelfProps) {
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = useReducedMotion();

  const moveFocus = (nextIndex: number) => {
    const normalizedIndex = (nextIndex + works.length) % works.length;
    setActiveIndex(normalizedIndex);
    const nextCard = cardRefs.current[normalizedIndex];
    nextCard?.focus({ preventScroll: true });
    nextCard?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "nearest",
      inline: "nearest",
    });
  };

  if (works.length === 0) {
    return null;
  }
  const rovingIndex = Math.min(activeIndex, works.length - 1);

  return (
    <MediaShelf
      className="work-shelf [&>div[aria-label]]:px-[var(--space-1)] [&>header]:items-center"
      title={title}
    >
      {works.map((work, index) => (
        <AnchorCoverCard
          coverUrl={coverUrls?.get(work.id)}
          key={work.id}
          labels={labels}
          onCoverSettled={() => onCoverSettled?.(work.id)}
          onSelectionFocus={() => setActiveIndex(index)}
          onSelectionKeyDown={(event) => {
            if (event.key === "ArrowRight") {
              event.preventDefault();
              moveFocus(index + 1);
            } else if (event.key === "ArrowLeft") {
              event.preventDefault();
              moveFocus(index - 1);
            }
          }}
          onToggleFavorite={onToggleFavorite}
          onToggleSelection={onToggleSelection}
          selection={selectionsByWorkId.get(work.id)}
          selectionButtonRef={(node) => {
            cardRefs.current[index] = node;
          }}
          tabIndex={index === rovingIndex ? 0 : -1}
          work={work}
        />
      ))}
    </MediaShelf>
  );
}
