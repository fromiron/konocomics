"use client";

import { useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

import type { Work } from "@/domain/catalog/types";
import type { PositiveOnboardingEntry } from "@/domain/profile/onboarding";

import { AnchorCoverCard } from "./anchor-cover-card";

type WorkShelfProps = Readonly<{
  title: string;
  works: readonly Work[];
  selectionsByWorkId: ReadonlyMap<string, PositiveOnboardingEntry>;
  labels: Parameters<typeof AnchorCoverCard>[0]["labels"];
  previousLabel: string;
  nextLabel: string;
  onToggleSelection: (workId: string) => void;
  onToggleFavorite: (workId: string) => void;
}>;

export function WorkShelf({
  title,
  works,
  selectionsByWorkId,
  labels,
  previousLabel,
  nextLabel,
  onToggleSelection,
  onToggleFavorite,
}: WorkShelfProps) {
  const shelfRef = useRef<HTMLDivElement>(null);
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

  const scroll = (direction: -1 | 1) => {
    shelfRef.current?.scrollBy({
      behavior: reducedMotion ? "auto" : "smooth",
      left: direction * Math.max(240, shelfRef.current.clientWidth * 0.8),
    });
  };

  if (works.length === 0) {
    return null;
  }

  return (
    <section aria-label={title} className="work-shelf">
      <div className="work-shelf__heading">
        <h2>{title}</h2>
        <div className="work-shelf__controls">
          <button
            aria-label={`${title} — ${previousLabel}`}
            onClick={() => scroll(-1)}
            type="button"
          >
            ←
          </button>
          <button aria-label={`${title} — ${nextLabel}`} onClick={() => scroll(1)} type="button">
            →
          </button>
        </div>
      </div>
      <div className="work-shelf__track" ref={shelfRef}>
        {works.map((work, index) => (
          <AnchorCoverCard
            key={work.id}
            labels={labels}
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
            tabIndex={index === activeIndex ? 0 : -1}
            work={work}
          />
        ))}
      </div>
    </section>
  );
}
