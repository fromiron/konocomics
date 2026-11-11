import { CheckIcon, SquareIcon } from "lucide-react";

import { ChoiceChipCheckbox } from "@/components/design-system/choice-chip";
import { NativeSelect, NativeSelectOption } from "@/components/design-system/native-select";
import { GENRE_TAGS } from "@/domain/catalog/constants";
import type { GenreTag } from "@/domain/catalog/types";
import type { RecommendationPolicies } from "@/domain/profile/types";
import { explanationLexicon, recommendationStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

export const visiblePolicyKeys = ["preferCompleted", "preferHidden", "preferVerified"] as const;
export type VisiblePolicyKey = (typeof visiblePolicyKeys)[number];

/**
 * Below `md`, a filter row stays on one line and scrolls sideways instead of wrapping. It runs
 * into the page gutters so a cut-off chip shows there is more, and the block padding keeps focus
 * rings from being clipped by the scroll box (03 §5 「추천 헤더」).
 */
export const RECOMMENDATION_FILTER_ROW_CLASSNAME =
  "flex min-w-0 items-center gap-x-[var(--space-3)] max-md:-mx-[var(--layout-page-padding)] max-md:flex-nowrap max-md:overflow-x-auto max-md:overscroll-x-contain max-md:px-[var(--layout-page-padding)] max-md:py-[var(--space-1)] max-md:scroll-px-[var(--layout-page-padding)] max-md:[scrollbar-width:none] max-md:[&::-webkit-scrollbar]:hidden md:flex-wrap md:gap-y-[var(--space-2)]";

type RecommendationFilterBarProps = Readonly<{
  genre?: GenreTag;
  policies: RecommendationPolicies;
  disabled: boolean;
  policyUpdating: boolean;
  onGenreChange?: (genre: GenreTag | undefined) => void;
  onPolicyToggle: (key: VisiblePolicyKey) => void;
}>;

export function RecommendationFilterBar({
  disabled,
  genre,
  onGenreChange,
  onPolicyToggle,
  policies,
  policyUpdating,
}: RecommendationFilterBarProps) {
  return (
    <div className="grid min-w-0 gap-[var(--space-2)]">
      <div className={cn(RECOMMENDATION_FILTER_ROW_CLASSNAME, "md:gap-x-[var(--space-4)]")}>
        <div className="flex shrink-0 items-center gap-[var(--space-2)]">
          <label
            className="text-[length:var(--font-size-14)] font-bold whitespace-nowrap text-text"
            htmlFor="recommendation-genre"
          >
            {recommendationStrings.filters.genre}
          </label>
          <NativeSelect
            aria-describedby={genre === undefined ? undefined : "recommendation-genre-scope"}
            className="w-[calc(var(--control-min-size)*4)] max-w-full"
            disabled={disabled}
            id="recommendation-genre"
            onChange={(event) =>
              onGenreChange?.(GENRE_TAGS.find((tag) => tag === event.target.value))
            }
            value={genre ?? ""}
          >
            <NativeSelectOption value="">
              {recommendationStrings.filters.allGenres}
            </NativeSelectOption>
            {GENRE_TAGS.map((tag) => (
              <NativeSelectOption key={tag} value={tag}>
                {explanationLexicon.factorLabels[tag]}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
        <span aria-hidden="true" className="h-[var(--space-6)] w-px shrink-0 bg-line" />
        <section
          aria-labelledby="recommendation-policy-heading"
          className="flex shrink-0 items-center gap-x-[var(--space-3)] gap-y-[var(--space-2)] md:min-w-0 md:shrink md:flex-wrap"
        >
          <fieldset className="m-0 min-w-0 border-0 p-0">
            <legend className="sr-only" id="recommendation-policy-heading">
              {recommendationStrings.policiesHeading}
            </legend>
            <div className="flex flex-nowrap gap-[var(--space-2)] md:flex-wrap">
              {visiblePolicyKeys.map((key) => (
                <ChoiceChipCheckbox
                  aria-describedby="recommendation-policy-hint"
                  checked={policies[key]}
                  chipClassName="gap-[var(--space-2)] whitespace-nowrap text-text"
                  className="shrink-0"
                  disabled={disabled}
                  key={key}
                  onCheckedChange={() => onPolicyToggle(key)}
                >
                  {policies[key] ? (
                    <CheckIcon aria-hidden="true" className="size-4 shrink-0" />
                  ) : (
                    <SquareIcon aria-hidden="true" className="size-4 shrink-0 text-text-muted" />
                  )}
                  {recommendationStrings.policyLabels[key]}
                </ChoiceChipCheckbox>
              ))}
            </div>
          </fieldset>
          <span
            className="min-w-0 text-[length:var(--text-caption-size)] whitespace-nowrap text-text-muted"
            id="recommendation-policy-hint"
            role="status"
          >
            {policyUpdating ? recommendationStrings.policiesUpdating : ""}
          </span>
        </section>
      </div>
      {policies.preferHidden ? (
        <p className="text-[length:var(--text-caption-size)] text-text-muted">
          {recommendationStrings.hiddenPolicyHint}
        </p>
      ) : null}
      {genre === undefined ? null : (
        <p
          className="text-[length:var(--text-caption-size)] text-text-muted"
          id="recommendation-genre-scope"
          role="status"
        >
          {recommendationStrings.filters.rankingScope}
        </p>
      )}
    </div>
  );
}
