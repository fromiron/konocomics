import { CheckIcon, SquareIcon } from "lucide-react";
import { type Ref, useEffect, useState } from "react";

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
  const [policiesOpen, setPoliciesOpen] = useState(
    () =>
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function" ||
      !window.matchMedia("(max-width: 47.999rem)").matches,
  );

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const viewport = window.matchMedia("(max-width: 47.999rem)");
    const sync = () => setPoliciesOpen(!viewport.matches);
    viewport.addEventListener("change", sync);
    return () => viewport.removeEventListener("change", sync);
  }, []);

  return (
    <div className="grid min-w-0 gap-[var(--space-3)]">
      <div className="flex min-w-0 flex-wrap items-center gap-x-[var(--space-4)] gap-y-[var(--space-2)]">
        <div className="flex items-center gap-[var(--space-2)]">
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
        <span aria-hidden="true" className="hidden h-[var(--space-6)] w-px bg-line sm:block" />
        <section
          aria-labelledby="recommendation-policy-heading"
          className="flex min-w-0 flex-wrap items-center gap-x-[var(--space-3)] gap-y-[var(--space-2)]"
        >
          <details
            className="min-w-0"
            onToggle={(event) => setPoliciesOpen(event.currentTarget.open)}
            open={policiesOpen}
          >
            <summary className="min-h-[var(--control-min-size)] cursor-pointer content-center rounded-[var(--radius-control)] py-[var(--space-2)] text-[length:var(--font-size-14)] font-bold text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:hidden">
              <span id="recommendation-policy-heading">
                {recommendationStrings.policiesHeading}
              </span>
              {visiblePolicyKeys
                .filter((key) => policies[key])
                .map((key) => (
                  <span className="ml-[var(--space-2)] inline-block text-accent-ink" key={key}>
                    {recommendationStrings.policyLabels[key]}
                  </span>
                ))}
            </summary>
            <fieldset className="m-0 min-w-0 border-0 p-0">
              <legend className="sr-only">{recommendationStrings.policiesHeading}</legend>
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
          </details>
          <span
            className="min-w-0 text-[length:var(--text-caption-size)] text-text-muted"
            id="recommendation-policy-hint"
            role="status"
          >
            {policyUpdating ? recommendationStrings.policiesUpdating : ""}
          </span>
        </section>
      </div>
      {!policyUpdating && pending ? (
        <div className="flex flex-wrap items-center gap-x-[var(--space-4)] gap-y-[var(--space-2)]">
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
