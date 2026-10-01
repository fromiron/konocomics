"use client";

import { CoverImage } from "@/components/cover/CoverImage";
import { Button } from "@/components/design-system/button";
import type { Work } from "@/domain/catalog/types";
import {
  ONBOARDING_MAX_NEGATIVE_WORKS,
  type NegativeOnboardingEntry,
} from "@/domain/profile/onboarding";
import { onboardingStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

import { ClarityMeter, ONBOARDING_PANEL_CLASS, type SelectedTrayClarity } from "./selected-tray";

type NegativeSummaryPanelProps = Readonly<{
  entries: readonly NegativeOnboardingEntry[];
  worksById: ReadonlyMap<string, Work>;
  coverUrls: ReadonlyMap<string, string | null>;
  onCoverVisible: (workId: string) => void;
  clarity: SelectedTrayClarity;
  limitActive: boolean;
  shakeKey: number;
  submitting: boolean;
  onFinish: () => void;
  onSkip: () => void;
}>;

/**
 * STEP 2 counterpart of the selected tray: the same panel frame, a summary of the chosen works,
 * what choosing them does, and the single primary action. Skipping is only offered as a
 * separate action when it would actually differ from finishing (some works are chosen).
 */
export function NegativeSummaryPanel({
  clarity,
  coverUrls,
  entries,
  limitActive,
  onCoverVisible,
  onFinish,
  onSkip,
  shakeKey,
  submitting,
  worksById,
}: NegativeSummaryPanelProps) {
  const copy = onboardingStrings.step2;
  const visibleEntries = entries.flatMap((entry) => {
    const work = worksById.get(entry.workId);
    return work === undefined ? [] : [{ entry, work }];
  });

  return (
    <aside
      aria-label={copy.panel.title}
      className={cn(
        "negative-summary-panel",
        ONBOARDING_PANEL_CLASS,
        limitActive &&
          "border-2 border-warn motion-reduce:animate-none motion-reduce:transform-none",
        limitActive &&
          (shakeKey % 2 === 0
            ? "motion-safe:animate-[selected-tray-limit-0_240ms_linear]"
            : "motion-safe:animate-[selected-tray-limit-1_240ms_linear]"),
      )}
      data-limit-active={limitActive ? "true" : undefined}
    >
      <div className="col-span-full flex items-baseline justify-between gap-[var(--space-4)]">
        <strong className="text-text-strong">{copy.panel.title}</strong>
        <span className="text-[length:var(--text-caption-size)] font-bold text-accent">
          {onboardingStrings.step1.selectedCount(entries.length, ONBOARDING_MAX_NEGATIVE_WORKS)}
          <span aria-hidden="true" className="font-medium text-text-muted md:hidden">
            {` ・ ${clarity.levelLabel}`}
          </span>
        </span>
      </div>

      <ClarityMeter clarity={clarity} />

      {visibleEntries.length === 0 ? (
        <p className="col-span-full hidden rounded-[var(--radius-card)] border border-dashed border-line bg-surface-2 p-[var(--space-4)] text-[length:var(--text-caption-size)] leading-[1.8] text-text-muted md:block">
          {copy.panel.empty}
        </p>
      ) : (
        <ul className="col-span-full m-0 hidden list-none gap-[var(--space-content)] p-0 md:grid">
          {visibleEntries.map(({ entry, work }) => (
            <li
              className="grid grid-cols-[var(--space-8)_minmax(0,1fr)] items-center gap-[var(--space-3)] rounded-[var(--radius-card)] border border-line bg-surface-2 p-[var(--space-2)]"
              key={work.id}
            >
              <CoverImage
                coverUrl={coverUrls.get(work.id)}
                creators={work.creators}
                decorative
                onVisible={() => onCoverVisible(work.id)}
                requestedSize={200}
                title={work.title}
              />
              <span className="grid min-w-0">
                <span className="truncate text-[length:var(--font-size-14)] font-bold text-text-strong">
                  {work.title}
                </span>
                <span className="text-[length:var(--text-caption-size)] text-text-muted">
                  {entry.disposition === "disliked" ? copy.disliked : copy.dropped}
                  {" ・ "}
                  {copy.panel.reasonCount(entry.reasons.length)}
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="col-span-full hidden rounded-[var(--radius-card)] border border-line p-[var(--space-4)] text-[length:var(--text-caption-size)] leading-[1.7] text-text-muted md:block">
        <strong className="text-text-strong">{copy.panel.effectsTitle}</strong>
        <ul className="m-0 mt-[var(--space-1)] list-disc ps-[var(--space-5)]">
          {copy.panel.effects.map((effect) => (
            <li key={effect}>{effect}</li>
          ))}
        </ul>
      </div>

      <p className="self-center text-[length:var(--text-caption-size)] text-text-muted md:hidden">
        {visibleEntries.length === 0 ? copy.finishHint : null}
      </p>
      <div className="grid content-center gap-[var(--space-content-tight)]">
        <Button
          className="onboarding-step-actions__primary min-w-32 md:w-full md:min-w-0 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-accent-hover"
          disabled={submitting}
          onClick={onFinish}
          type="button"
        >
          {submitting ? copy.saving : copy.finish}
        </Button>
        {visibleEntries.length === 0 ? (
          <p className="hidden text-center text-[length:var(--text-caption-size)] text-text-muted md:block">
            {copy.finishHint}
          </p>
        ) : (
          <button
            className="onboarding-step-actions__skip min-h-[var(--control-min-size)] justify-self-center bg-transparent px-[var(--space-2)] text-[length:var(--text-caption-size)] text-text-muted underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-50 [@media(hover:hover)_and_(pointer:fine)]:hover:text-text-strong"
            disabled={submitting}
            onClick={onSkip}
            type="button"
          >
            {copy.skip}
          </button>
        )}
      </div>
    </aside>
  );
}
