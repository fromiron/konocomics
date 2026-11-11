"use client";

import { ChoiceChipRadio, ChoiceChipRadioGroup } from "@/components/design-system/choice-chip";
import { RECOMMENDATION_MOODS, type RecommendationMood } from "@/domain/recommendation/mood";
import { recommendationStrings } from "@/lib/strings";

import { RECOMMENDATION_FILTER_ROW_CLASSNAME } from "./recommendation-filter-bar";

const strings = recommendationStrings.mood;
const NO_MOOD = "none";

type MoodValue = RecommendationMood | typeof NO_MOOD;

export function RecommendationMoodBar({
  candidateCount,
  unchanged = false,
  disabled,
  dismissedCount,
  mood,
  onMoodChange,
}: Readonly<{
  mood: RecommendationMood | null;
  /** Works in the ranked plan that meet the mood, after today's set-asides. */
  candidateCount: number;
  unchanged?: boolean;
  dismissedCount: number;
  disabled: boolean;
  onMoodChange: (mood: RecommendationMood | null) => void;
}>) {
  return (
    <section
      aria-labelledby="recommendation-mood-heading"
      className="mt-[var(--space-2)] grid gap-[var(--space-2)]"
      data-recommendation-mood={mood ?? NO_MOOD}
    >
      <div className={RECOMMENDATION_FILTER_ROW_CLASSNAME}>
        <h2
          className="shrink-0 text-[length:var(--font-size-14)] font-bold whitespace-nowrap text-text-strong"
          id="recommendation-mood-heading"
        >
          {strings.heading}
        </h2>
        <ChoiceChipRadioGroup<MoodValue>
          aria-labelledby="recommendation-mood-heading"
          className="w-auto max-md:shrink-0 max-md:flex-nowrap"
          disabled={disabled}
          name="recommendation-mood"
          onValueChange={(value) => onMoodChange(value === NO_MOOD ? null : value)}
          value={mood ?? NO_MOOD}
        >
          <ChoiceChipRadio<MoodValue> chipClassName="whitespace-nowrap" value={NO_MOOD}>
            {strings.none}
          </ChoiceChipRadio>
          {RECOMMENDATION_MOODS.map((value) => (
            <ChoiceChipRadio<MoodValue> chipClassName="whitespace-nowrap" key={value} value={value}>
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
              unchanged ? strings.unchanged : "",
              dismissedCount > 0 ? strings.dismissedCount(dismissedCount) : "",
            ]
              .filter(Boolean)
              .join(" ")}
      </p>
    </section>
  );
}
