"use client";

import {
  BookOpenIcon,
  BookmarkIcon,
  CircleCheckIcon,
  CircleXIcon,
  EyeOffIcon,
  LibraryBigIcon,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/design-system/button";
import type { ReadingState } from "@/domain/profile/types";
import { libraryStrings } from "@/lib/strings";

const STATE_SUMMARIES: readonly Readonly<{
  icon: LucideIcon;
  state: ReadingState;
}>[] = [
  { icon: BookmarkIcon, state: "planned" },
  { icon: BookOpenIcon, state: "reading" },
  { icon: CircleCheckIcon, state: "completed" },
  { icon: CircleXIcon, state: "dropped" },
  { icon: EyeOffIcon, state: "hidden" },
];

export function LibraryOverviewHeader({
  onAddWork,
  stateCounts,
  total,
}: Readonly<{
  onAddWork(opener: HTMLElement): void;
  stateCounts: Readonly<Record<ReadingState, number>>;
  total: number;
}>) {
  return (
    <header className="mb-[var(--space-4)] grid items-stretch gap-[var(--space-4)] md:grid-cols-[minmax(15rem,0.42fr)_minmax(0,1fr)]">
      <div className="grid max-w-[var(--layout-width-reading)] content-start justify-items-start gap-[var(--space-3)] py-[var(--space-2)]">
        <h1 className="text-[length:var(--text-page-title-size)] text-text-strong">
          {libraryStrings.title}
        </h1>
        <p className="max-w-[42rem] text-text-muted">{libraryStrings.description}</p>
        <Button
          className="mt-[var(--space-content)]"
          onClick={(event) => onAddWork(event.currentTarget)}
          type="button"
        >
          {libraryStrings.addWork}
        </Button>
      </div>

      {total === 0 ? null : (
        <section
          aria-label={libraryStrings.summary.heading}
          className="grid grid-cols-2 overflow-hidden rounded-[var(--radius-card)] border border-line/70 bg-surface-1 sm:grid-cols-3 md:grid-cols-6 [&>div]:relative [&>div]:grid [&>div]:min-h-[calc(var(--control-min-size)*2)] [&>div]:content-center [&>div]:justify-items-center [&>div]:gap-[var(--space-content-tight)] [&>div]:border-r [&>div]:border-b [&>div]:border-line/60 [&>div]:p-[var(--space-3)] md:[&>div]:border-b-0"
        >
          {STATE_SUMMARIES.map(({ icon: Icon, state }) => (
            <div key={state}>
              <Icon aria-hidden="true" className="size-[var(--space-5)] text-text-muted" />
              <span className="text-center text-[length:var(--text-caption-size)] text-text-muted">
                {libraryStrings.tabs[state]}
              </span>
              <strong className="text-[length:var(--text-section-title-size)] leading-none text-text-strong tabular-nums">
                {String(stateCounts[state])}
              </strong>
            </div>
          ))}
          <div className="border-r-0 bg-surface-2">
            <LibraryBigIcon aria-hidden="true" className="size-[var(--space-5)] text-text-muted" />
            <span className="text-center text-[length:var(--text-caption-size)] text-text-muted">
              {libraryStrings.summary.total}
            </span>
            <strong className="text-[length:var(--text-page-title-size)] leading-none text-text-strong tabular-nums">
              {String(total)}
            </strong>
          </div>
        </section>
      )}
    </header>
  );
}
