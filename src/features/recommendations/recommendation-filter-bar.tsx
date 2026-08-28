import { Button } from "@/components/design-system/button";
import { ChoiceChipCheckbox } from "@/components/design-system/choice-chip";
import { GENRE_TAGS } from "@/domain/catalog/constants";
import type { GenreTag } from "@/domain/catalog/types";
import type { RecommendationPolicies } from "@/domain/profile/types";
import { explanationLexicon, recommendationStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronDownIcon, FilterIcon } from "lucide-react";
import { type Ref, useRef, useState } from "react";

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

type FilterMenuOption<Value extends string> = Readonly<{
  label: string;
  value?: Value;
}>;

function FilterMenu<Value extends string>({
  disabled,
  label,
  onChange,
  options,
  value,
}: Readonly<{
  disabled: boolean;
  label: string;
  onChange: (value: Value | undefined) => void;
  options: readonly FilterMenuOption<Value>[];
  value?: Value;
}>) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const activeLabel =
    options.find((option) => option.value === value)?.label ?? options[0]?.label ?? "";

  return (
    <details
      className="group/filter-menu relative min-w-0 border-r border-line/80 last:border-r-0"
      ref={detailsRef}
    >
      <summary
        aria-disabled={disabled || undefined}
        className="grid min-h-[var(--control-min-size)] cursor-pointer list-none content-center gap-px px-[var(--space-3)] text-left marker:content-none focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring aria-disabled:pointer-events-none aria-disabled:opacity-45 [&::-webkit-details-marker]:hidden"
        onClick={(event) => {
          if (disabled) event.preventDefault();
        }}
      >
        <span className="text-[length:var(--font-size-12)] leading-tight text-text-muted">
          {label}
        </span>
        <span className="flex min-w-0 items-center gap-[var(--space-content-tight)] text-[length:var(--font-size-14)] leading-tight font-bold text-text-strong">
          <span className="truncate">{activeLabel}</span>
          <ChevronDownIcon
            aria-hidden="true"
            className="size-3.5 shrink-0 text-text-muted transition-transform duration-[var(--motion-duration-feedback)] group-open/filter-menu:rotate-180 motion-reduce:transition-none"
          />
        </span>
      </summary>
      <div className="absolute top-[calc(100%+var(--space-content-tight))] left-0 z-50 grid max-h-72 min-w-full w-max max-w-[min(18rem,calc(100vw-var(--space-8)))] gap-px overflow-y-auto rounded-[var(--radius-control)] border border-line bg-surface-1 p-[var(--space-content-tight)] shadow-[var(--shadow-raised)]">
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <button
              aria-pressed={selected}
              className="grid min-h-[var(--control-min-size)] grid-cols-[var(--space-5)_minmax(0,1fr)] items-center gap-[var(--space-content)] rounded-[var(--radius-cover)] px-[var(--space-2)] text-left text-[length:var(--font-size-14)] text-text hover:bg-surface-3 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring disabled:opacity-45 aria-pressed:bg-accent-soft aria-pressed:font-bold aria-pressed:text-accent"
              disabled={disabled}
              key={option.value ?? "all"}
              onClick={() => {
                onChange(option.value);
                detailsRef.current?.removeAttribute("open");
              }}
              type="button"
            >
              <CheckIcon aria-hidden="true" className={selected ? "size-4" : "size-4 opacity-0"} />
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
    </details>
  );
}

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
  const [filtersOpen, setFiltersOpen] = useState(false);
  const genreOptions: readonly FilterMenuOption<GenreTag>[] = [
    { label: recommendationStrings.filters.allGenres },
    ...GENRE_TAGS.map((genreTag) => ({
      label: explanationLexicon.factorLabels[genreTag],
      value: genreTag,
    })),
  ];
  const shelfOptions: readonly FilterMenuOption<RecommendationShelf>[] = [
    { label: recommendationStrings.filters.allShelves },
    { label: recommendationStrings.shelves.featured.title, value: "featured" },
    { label: recommendationStrings.shelves.anchor.title, value: "anchor" },
    { label: recommendationStrings.shelves.discovery.title, value: "discovery" },
    { label: recommendationStrings.shelves.completed.title, value: "completed" },
    { label: recommendationStrings.shelves.ranking.title, value: "ranking" },
  ];

  return (
    <section
      aria-labelledby="recommendation-policy-heading"
      className="relative z-20 isolate mb-[var(--space-3)] overflow-visible rounded-[var(--radius-card)] border border-line/80 bg-surface-1"
    >
      <h2 className="sr-only" id="recommendation-policy-heading">
        {recommendationStrings.filters.heading}
      </h2>
      <Button
        aria-controls="recommendation-filter-controls"
        aria-expanded={filtersOpen}
        className="flex min-h-[var(--control-min-size)] w-full items-center justify-between rounded-none border-0 bg-transparent px-[var(--space-3)] text-text-strong md:hidden"
        onClick={() => setFiltersOpen((current) => !current)}
        type="button"
        variant="ghost"
      >
        <span className="inline-flex items-center gap-[var(--space-2)] font-bold">
          <FilterIcon aria-hidden="true" className="size-4 text-text-muted" />
          {recommendationStrings.filters.heading}
        </span>
        <span className="inline-flex items-center gap-[var(--space-2)] text-[length:var(--text-caption-size)] text-text-muted">
          {pending ? recommendationStrings.pendingChanges : null}
          <ChevronDownIcon
            aria-hidden="true"
            className={cn(
              "size-4 transition-transform duration-[var(--motion-duration-feedback)] motion-reduce:transition-none",
              filtersOpen && "rotate-180",
            )}
          />
        </span>
      </Button>
      <div
        className={cn(
          "min-w-0",
          filtersOpen ? "grid" : "hidden",
          "md:grid md:grid-cols-[max-content_minmax(15rem,0.85fr)_minmax(21rem,1.15fr)_auto] md:items-stretch",
        )}
        id="recommendation-filter-controls"
      >
        <div className="hidden min-h-[var(--control-min-size)] items-center gap-[var(--space-2)] whitespace-nowrap border-r border-line/80 px-[var(--space-4)] text-[length:var(--font-size-14)] font-bold text-text-strong md:flex">
          <FilterIcon aria-hidden="true" className="size-4 text-text-muted" />
          <span>{recommendationStrings.filters.heading}</span>
        </div>
        <div className="grid grid-cols-2 border-b border-line/80 md:grid-cols-2 md:border-r md:border-b-0">
          <FilterMenu
            disabled={disabled}
            label={recommendationStrings.filters.genre}
            onChange={(nextGenre) => onGenreChange?.(nextGenre)}
            options={genreOptions}
            value={genre}
          />
          <FilterMenu
            disabled={disabled}
            label={recommendationStrings.filters.shelf}
            onChange={(nextShelf) => onShelfChange?.(nextShelf)}
            options={shelfOptions}
            value={shelf}
          />
        </div>
        <fieldset className="m-0 min-w-0 border-0 border-b border-line/80 px-[var(--space-3)] py-0 md:border-r md:border-b-0">
          <legend className="mb-[var(--space-content-tight)] p-0 text-[length:var(--font-size-12)] font-bold text-text-strong md:sr-only">
            {recommendationStrings.policiesHeading}
          </legend>
          <div className="flex min-h-[var(--control-min-size)] flex-wrap items-center gap-[var(--space-content-tight)] md:flex-nowrap">
            {visiblePolicyKeys.map((key) => (
              <ChoiceChipCheckbox
                checked={policies[key]}
                chipClassName="!min-h-8 !min-w-0 !justify-start !rounded-[var(--radius-cover)] !border-line/80 !bg-transparent !px-[var(--space-2)] !py-0 text-left text-[length:var(--font-size-12)] leading-tight whitespace-nowrap text-text-muted peer-data-checked:!border-line-accent-subtle peer-data-checked:!bg-accent-soft peer-data-checked:!font-bold peer-data-checked:!text-accent"
                className="!min-h-[var(--control-min-size)] min-w-0"
                disabled={disabled}
                key={key}
                onCheckedChange={() => onPolicyToggle(key)}
              >
                <CheckIcon
                  aria-hidden="true"
                  className={cn(
                    "mr-[var(--space-content-tight)] size-3.5 text-accent transition-opacity duration-[var(--motion-duration-feedback)] motion-reduce:transition-none",
                    policies[key] ? "opacity-100" : "opacity-0",
                  )}
                />
                {recommendationStrings.policyLabels[key]}
              </ChoiceChipCheckbox>
            ))}
          </div>
        </fieldset>
        <div className="flex items-center justify-end gap-[var(--space-3)] px-[var(--space-3)] py-0">
          {pending ? (
            <p className="mr-auto hidden text-[length:var(--text-caption-size)] font-medium text-accent md:block">
              {recommendationStrings.pendingChanges}
            </p>
          ) : null}
          <Button
            className={
              pending
                ? "min-h-[var(--control-min-size)] min-w-[calc(var(--control-min-size)*2)] border-accent bg-accent !text-on-accent px-[var(--space-4)] py-[var(--space-content)] font-black hover:bg-accent-hover"
                : "min-h-[var(--control-min-size)] min-w-[calc(var(--control-min-size)*2)] border-line/80 bg-transparent px-[var(--space-3)] py-[var(--space-content)] font-bold hover:bg-surface-2"
            }
            busy={updating}
            disabled={updateDisabled}
            onClick={onUpdate}
            ref={updateButtonRef}
            type="button"
            variant={pending ? "default" : "outline"}
          >
            {updating ? recommendationStrings.updating : recommendationStrings.update}
          </Button>
        </div>
      </div>
    </section>
  );
}
