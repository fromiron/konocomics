import { CheckIcon, SquareIcon } from "lucide-react";
import type { Ref } from "react";

import { Button } from "@/components/design-system/button";
import { ChoiceChipCheckbox } from "@/components/design-system/choice-chip";
import { NativeSelect, NativeSelectOption } from "@/components/design-system/native-select";
import { GENRE_TAGS } from "@/domain/catalog/constants";
import type { GenreTag } from "@/domain/catalog/types";
import type { RecommendationPolicies } from "@/domain/profile/types";
import { explanationLexicon, recommendationStrings } from "@/lib/strings";

export const visiblePolicyKeys = ["preferCompleted", "preferHidden", "preferVerified"] as const;
export type VisiblePolicyKey = (typeof visiblePolicyKeys)[number];

type RecommendationFilterBarProps = Readonly<{
  genre?: GenreTag;
  policies: RecommendationPolicies;
  disabled: boolean;
  pending: boolean;
  policyUpdating: boolean;
  updating: boolean;
  updateDisabled: boolean;
  updateButtonRef: Ref<HTMLButtonElement>;
  onGenreChange?: (genre: GenreTag | undefined) => void;
  onPolicyToggle: (key: VisiblePolicyKey) => void;
  onUpdate: () => void;
}>;

export function RecommendationFilterBar({
  disabled,
  genre,
  onGenreChange,
  onPolicyToggle,
  onUpdate,
  pending,
  policies,
  policyUpdating,
  updateDisabled,
  updateButtonRef,
  updating,
}: RecommendationFilterBarProps) {
  return (
    <div className="grid min-w-0 gap-[var(--space-4)]">
      <section aria-labelledby="recommendation-policy-heading">
        <fieldset className="m-0 min-w-0 border-0 p-0">
          <legend className="mb-[var(--space-2)] w-full p-0">
            <span className="flex items-center gap-[var(--space-3)]">
              <span
                className="shrink-0 text-[length:var(--font-size-14)] font-bold text-text"
                id="recommendation-policy-heading"
              >
                {recommendationStrings.policiesHeading}
              </span>
              <span
                className="min-w-0 truncate text-[length:var(--text-caption-size)] text-text-muted"
                id="recommendation-policy-hint"
                role="status"
              >
                {policyUpdating ? recommendationStrings.policiesUpdating : ""}
              </span>
            </span>
          </legend>
          <div className="flex flex-wrap gap-[var(--space-2)]">
            {visiblePolicyKeys.map((key) => (
              <ChoiceChipCheckbox
                aria-describedby="recommendation-policy-hint"
                checked={policies[key]}
                chipClassName="gap-[var(--space-2)] rounded-[var(--radius-control)] text-text"
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
        {!policyUpdating && pending ? (
          <div className="mt-[var(--space-3)] flex flex-wrap items-center gap-x-[var(--space-4)] gap-y-[var(--space-2)]">
            {updating ? null : (
              <p className="text-[length:var(--font-size-14)] text-text-muted">
                {recommendationStrings.pendingChanges}
              </p>
            )}
            <Button
              busy={updating}
              disabled={updateDisabled}
              onClick={onUpdate}
              ref={updateButtonRef}
              type="button"
            >
              {updating ? recommendationStrings.updating : recommendationStrings.update}
            </Button>
          </div>
        ) : null}
      </section>

      <div className="flex flex-wrap items-center gap-[var(--space-3)] border-t border-line pt-[var(--space-3)]">
        <label
          className="text-[length:var(--font-size-14)] font-bold text-text"
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
