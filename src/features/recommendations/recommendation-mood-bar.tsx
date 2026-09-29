"use client";

import { ChoiceChipRadio, ChoiceChipRadioGroup } from "@/components/design-system/choice-chip";
import { RECOMMENDATION_MOODS, type RecommendationMood } from "@/domain/recommendation/mood";
import { recommendationStrings } from "@/lib/strings";

const strings = recommendationStrings.mood;
const NO_MOOD = "none";

type MoodValue = RecommendationMood | typeof NO_MOOD;

export function RecommendationMoodBar({
  candidateCount,
  disabled,
  dismissedCount,
  mood,
  onMoodChange,
}: Readonly<{
  mood: RecommendationMood | null;
  /** Works in the ranked plan that meet the mood, after today's set-asides. */
  candidateCount: number;
  dismissedCount: number;
  disabled: boolean;
  onMoodChange: (mood: RecommendationMood | null) => void;
}>) {
  return (
    <section
      aria-labelledby="recommendation-mood-heading"
      className="mt-[var(--space-3)] grid gap-[var(--space-2)]"
      data-recommendation-mood={mood ?? NO_MOOD}
    >
      <div className="flex flex-wrap items-center gap-x-[var(--space-3)] gap-y-[var(--space-2)]">
        <h2
          className="text-[length:var(--font-size-14)] font-bold text-text-strong"
          id="recommendation-mood-heading"
        >
          {strings.heading}
        </h2>
        <ChoiceChipRadioGroup<MoodValue>
          aria-labelledby="recommendation-mood-heading"
          className="w-auto"
          disabled={disabled}
          name="recommendation-mood"
          onValueChange={(value) => onMoodChange(value === NO_MOOD ? null : value)}
          value={mood ?? NO_MOOD}
        >
          <ChoiceChipRadio<MoodValue> value={NO_MOOD}>{strings.none}</ChoiceChipRadio>
          {RECOMMENDATION_MOODS.map((value) => (
            <ChoiceChipRadio<MoodValue> key={value} value={value}>
              {strings.labels[value]}
            </ChoiceChipRadio>
          ))}
        </ChoiceChipRadioGroup>
      </div>
      <p
        aria-atomic="true"
        aria-live="polite"
        className="text-[length:var(--text-caption-size)] leading-[var(--line-height-body)] text-text-muted empty:hidden"
      >
        {mood === null
          ? ""
          : [
              strings.basis(strings.labels[mood], candidateCount),
              strings.limits[mood],
              dismissedCount > 0 ? strings.dismissedCount(dismissedCount) : "",
            ]
              .filter(Boolean)
              .join(" ")}
      </p>
    </section>
  );
}
