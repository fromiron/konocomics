import { Button } from "@/components/design-system/button";
import { ChoiceChipCheckbox } from "@/components/design-system/choice-chip";
import { NativeSelect } from "@/components/design-system/native-select";
import { GENRE_TAGS } from "@/domain/catalog/constants";
import type { GenreTag } from "@/domain/catalog/types";
import type { RecommendationPolicies } from "@/domain/profile/types";
import { explanationLexicon, recommendationStrings } from "@/lib/strings";
import type { Ref } from "react";

export const visiblePolicyKeys = ["preferCompleted", "preferHidden", "preferVerified"] as const;
export const recommendationShelves = [
  "featured",
  "anchor",
  "discovery",
  "completed",
  "ranking",
] as const;

export type VisiblePolicyKey = (typeof visiblePolicyKeys)[number];
export type RecommendationShelf = (typeof recommendationShelves)[number];

type RecommendationFilterBarProps = Readonly<{
  genre?: GenreTag;
  shelf?: RecommendationShelf;
  policies: RecommendationPolicies;
  disabled: boolean;
  pending: boolean;
  updating: boolean;
  updateDisabled: boolean;
  updateButtonRef: Ref<HTMLButtonElement>;
  onGenreChange?: (genre: GenreTag | undefined) => void;
  onShelfChange?: (shelf: RecommendationShelf | undefined) => void;
  onPolicyToggle: (key: VisiblePolicyKey) => void;
  onUpdate: () => void;
}>;

export function RecommendationFilterBar({
  disabled,
  genre,
  onGenreChange,
  onPolicyToggle,
  onShelfChange,
  onUpdate,
  pending,
  policies,
  shelf,
  updateDisabled,
  updateButtonRef,
  updating,
}: RecommendationFilterBarProps) {
  return (
    <section
      aria-labelledby="recommendation-policy-heading"
      className="mb-[var(--space-3)] grid gap-[var(--space-3)] rounded-[var(--radius-card)] border border-line bg-surface-1 p-[var(--space-3)] min-[360px]:grid-cols-[minmax(0,1fr)_auto] min-[360px]:items-end md:grid-cols-[minmax(0,1.25fr)_minmax(17rem,1fr)_auto] md:gap-[var(--space-content-tight)] md:p-[var(--space-content-tight)]"
    >
      <div className="grid grid-cols-3 gap-[var(--space-content)] min-[360px]:col-span-2 md:col-span-1">
        <label className="grid min-w-0 gap-[var(--space-content-tight)] text-[length:var(--text-caption-size)] font-bold text-text-muted">
          <span className="md:sr-only">{recommendationStrings.filters.genre}</span>
          <NativeSelect
            className="min-w-0 [&_[data-slot=native-select]]:bg-surface-2 [&_[data-slot=native-select]]:text-text-strong"
            onChange={(event) => {
              const nextGenre = GENRE_TAGS.find(
                (candidate) => candidate === event.currentTarget.value,
              );
              onGenreChange?.(nextGenre);
            }}
            value={genre ?? ""}
          >
            <option value="">{recommendationStrings.filters.allGenres}</option>
            {GENRE_TAGS.map((genreTag) => (
              <option key={genreTag} value={genreTag}>
                {explanationLexicon.factorLabels[genreTag]}
              </option>
            ))}
          </NativeSelect>
        </label>
        <label className="grid min-w-0 gap-[var(--space-content-tight)] text-[length:var(--text-caption-size)] font-bold text-text-muted">
          <span className="md:sr-only">{recommendationStrings.filters.shelf}</span>
          <NativeSelect
            className="min-w-0 [&_[data-slot=native-select]]:bg-surface-2 [&_[data-slot=native-select]]:text-text-strong"
            onChange={(event) => {
              const nextShelf = recommendationShelves.find(
                (candidate) => candidate === event.currentTarget.value,
              );
              onShelfChange?.(nextShelf);
            }}
            value={shelf ?? ""}
          >
            <option value="">{recommendationStrings.filters.allShelves}</option>
            <option value="featured">{recommendationStrings.shelves.featured.title}</option>
            <option value="anchor">{recommendationStrings.shelves.anchor.title}</option>
            <option value="discovery">{recommendationStrings.shelves.discovery.title}</option>
            <option value="completed">{recommendationStrings.shelves.completed.title}</option>
            <option value="ranking">{recommendationStrings.shelves.ranking.title}</option>
          </NativeSelect>
        </label>
        <div className="grid min-w-0 gap-[var(--space-content-tight)] text-[length:var(--text-caption-size)] font-bold text-text-muted">
          <span className="md:sr-only">{recommendationStrings.filters.sort}</span>
          <span className="inline-flex min-h-[var(--control-min-size)] min-w-0 items-center rounded-[var(--radius-control)] border border-line bg-surface-2 px-[var(--space-3)] text-text-strong">
            {recommendationStrings.filters.recommended}
          </span>
        </div>
      </div>
      <fieldset className="m-0 min-w-0 border-0 p-0">
        <legend
          className="mb-[var(--space-content)] p-0 font-bold text-text-strong md:sr-only"
          id="recommendation-policy-heading"
        >
          {recommendationStrings.policiesHeading}
        </legend>
        <div className="grid grid-cols-3 gap-[var(--space-content)]">
          {visiblePolicyKeys.map((key) => (
            <ChoiceChipCheckbox
              checked={policies[key]}
              chipClassName="w-full px-[var(--space-content-tight)] py-[var(--space-content-tight)] text-center text-[length:var(--font-size-12)] leading-tight md:text-[length:var(--font-size-14)]"
              className="w-full min-w-0"
              disabled={disabled}
              key={key}
              onCheckedChange={() => onPolicyToggle(key)}
            >
              {recommendationStrings.policyLabels[key]}
            </ChoiceChipCheckbox>
          ))}
        </div>
      </fieldset>
      <div className="flex items-center justify-between gap-[var(--space-3)] md:justify-end">
        {pending ? (
          <p className="text-[length:var(--text-caption-size)] text-text-muted">
            {recommendationStrings.pendingChanges}
          </p>
        ) : null}
        <Button
          className="min-h-[var(--control-min-size)] min-w-[calc(var(--control-min-size)*2)] border-line bg-surface-1 px-[var(--space-4)] py-[var(--space-content)] font-bold"
          busy={updating}
          disabled={updateDisabled}
          onClick={onUpdate}
          ref={updateButtonRef}
          type="button"
          variant="outline"
        >
          {updating ? recommendationStrings.updating : recommendationStrings.update}
        </Button>
      </div>
    </section>
  );
}
