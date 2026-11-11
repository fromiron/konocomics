"use client";

import { type Ref, useEffect, useId, useRef } from "react";
import { XIcon } from "lucide-react";

import { CoverImage } from "@/components/cover/CoverImage";
import { Button } from "@/components/design-system/button";
import {
  ChoiceChipCheckbox,
  ChoiceChipRadio,
  ChoiceChipRadioGroup,
} from "@/components/design-system/choice-chip";
import {
  COVER_CARD_META_CLASSNAME,
  COVER_CARD_SURFACE_CLASSNAME,
  COVER_CARD_SURFACE_TRANSITION_CLASSNAME,
  COVER_CARD_TITLE_CLASSNAME,
} from "@/components/media/cover-card";
import type { Work } from "@/domain/catalog/types";
import type { NegativeDisposition, NegativeOnboardingEntry } from "@/domain/profile/onboarding";
import type { NegativeReasonId } from "@/domain/profile/types";
import { cn } from "@/lib/utils";

type NegativeWorkCardProps = Readonly<{
  work: Work;
  coverUrl?: string | null;
  onCoverVisible?: () => void;
  disabled: boolean;
  isPositive: boolean;
  isSelected: boolean;
  labels: Readonly<{
    selectedPositive: string;
    selectedNegative: string;
    disposition: string;
    disliked: string;
    dropped: string;
  }>;
  onAdd: (workId: string, disposition: NegativeDisposition) => void;
}>;

/**
 * A step-2 candidate drawn like the step-1 cover cards, on the common cover card face (04 §2.10):
 * the cover, its title and creators under it, then the two dispositions to choose from (or why it
 * cannot be chosen).
 */
export function NegativeWorkCard({
  work,
  coverUrl,
  onCoverVisible,
  disabled,
  isPositive,
  isSelected,
  labels,
  onAdd,
}: NegativeWorkCardProps) {
  const unavailable = isPositive || isSelected;
  const dispositionName = `negative-result-disposition-${work.id}`;

  return (
    <article
      className={cn(
        "negative-result-card rounded-[var(--radius-media-card)] p-[var(--space-2)]",
        COVER_CARD_SURFACE_CLASSNAME,
        COVER_CARD_SURFACE_TRANSITION_CLASSNAME,
      )}
      data-disabled={unavailable || undefined}
    >
      <span className="negative-result-card__cover">
        <CoverImage
          coverUrl={coverUrl}
          creators={work.creators}
          onVisible={onCoverVisible}
          requestedSize={400}
          title={work.title}
        />
      </span>
      <span className="negative-result-card__identity grid min-w-0 gap-[var(--space-content-tight)]">
        <h3 className={cn("negative-result-card__title", COVER_CARD_TITLE_CLASSNAME)}>
          {work.title}
        </h3>
        <span className={cn("negative-result-card__creators", COVER_CARD_META_CLASSNAME)}>
          {work.creators.join("・")}
        </span>
      </span>
      {unavailable ? (
        <span className="negative-result-card__badge">
          {isPositive ? labels.selectedPositive : labels.selectedNegative}
        </span>
      ) : (
        <fieldset
          aria-label={`${work.title} — ${labels.disposition}`}
          className="negative-entry__disposition negative-result-card__disposition"
        >
          <legend className="sr-only">{labels.disposition}</legend>
          <ChoiceChipRadioGroup<NegativeDisposition | "">
            aria-label={`${work.title} — ${labels.disposition}`}
            className="negative-result-card__choices"
            disabled={disabled}
            name={dispositionName}
            onValueChange={(disposition) => {
              if (disposition !== "") onAdd(work.id, disposition);
            }}
            value=""
          >
            <DispositionChoice label={labels.disliked} value="disliked" />
            <DispositionChoice label={labels.dropped} value="dropped" />
          </ChoiceChipRadioGroup>
        </fieldset>
      )}
    </article>
  );
}

/**
 * A disposition radio named by its visible label alone. The name points at the label text (not
 * the wrapping `<label>`, which also holds the radio) and repeats it as `aria-label`, so neither a
 * late label lookup nor a DOM-reading tool falls back to the stored value (`disliked`/`dropped`).
 */
function DispositionChoice({
  inputRef,
  label,
  value,
}: Readonly<{ inputRef?: Ref<HTMLInputElement>; label: string; value: NegativeDisposition }>) {
  const labelId = useId();
  return (
    <ChoiceChipRadio aria-label={label} aria-labelledby={labelId} inputRef={inputRef} value={value}>
      <span id={labelId}>{label}</span>
    </ChoiceChipRadio>
  );
}

/** A reason chip named by its visible label; its hidden input carries no reason ID. */
function ReasonChoice({
  checked,
  disabled,
  label,
  onToggle,
}: Readonly<{ checked: boolean; disabled: boolean; label: string; onToggle: () => void }>) {
  const labelId = useId();
  return (
    <ChoiceChipCheckbox
      aria-label={label}
      aria-labelledby={labelId}
      checked={checked}
      disabled={disabled}
      onCheckedChange={onToggle}
    >
      <span id={labelId}>{label}</span>
    </ChoiceChipCheckbox>
  );
}

export type NegativeReasonOption = Readonly<{
  id: NegativeReasonId;
  label: string;
  group: NegativeReasonGroup;
}>;

export type NegativeReasonGroup = "content" | "circumstance" | "vague";

const NEGATIVE_REASON_GROUP_ORDER = ["content", "circumstance", "vague"] as const;

type NegativeEntryEditorProps = Readonly<{
  work: Work;
  coverUrl?: string | null;
  onCoverVisible?: () => void;
  disabled: boolean;
  entry: NegativeOnboardingEntry;
  focusDisposition?: NegativeDisposition;
  labels: Readonly<{
    disposition: string;
    disliked: string;
    dropped: string;
    reasons: string;
    reasonsLegend: Readonly<Record<NegativeDisposition, string>>;
    reasonGroups: Readonly<Record<NegativeReasonGroup, string>>;
    noReason: string;
    externalHelper: string;
    remove: string;
  }>;
  reasonOptions: readonly NegativeReasonOption[];
  onDispositionChange: (workId: string, disposition: NegativeDisposition) => void;
  onReasonToggle: (workId: string, reason: NegativeReasonId) => void;
  onRemove: (workId: string) => void;
}>;

export function NegativeEntryEditor({
  work,
  coverUrl,
  onCoverVisible,
  disabled,
  entry,
  focusDisposition,
  labels,
  reasonOptions,
  onDispositionChange,
  onReasonToggle,
  onRemove,
}: NegativeEntryEditorProps) {
  const groupName = `negative-disposition-${work.id}`;
  const reasonsLegendId = useId();
  const hasExternalReason = entry.reasons.some((reason) => reason.startsWith("external:"));
  const dislikedInputRef = useRef<HTMLInputElement>(null);
  const droppedInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focusDisposition === "disliked") {
      dislikedInputRef.current?.focus();
    } else if (focusDisposition === "dropped") {
      droppedInputRef.current?.focus();
    }
  }, [focusDisposition]);

  return (
    <article className="negative-entry grid gap-[var(--space-4)] rounded-[var(--radius-card)] border border-line bg-surface-1 p-[var(--space-4)]">
      <div className="negative-entry__identity grid grid-cols-[var(--space-12)_minmax(0,1fr)_var(--control-min-size)] items-center gap-[var(--space-3)]">
        <CoverImage
          coverUrl={coverUrl}
          creators={work.creators}
          onVisible={onCoverVisible}
          requestedSize={200}
          title={work.title}
        />
        <div className="grid min-w-0 gap-[var(--space-content-tight)]">
          <h3 className="line-clamp-2 text-[length:var(--font-size-14)] font-bold text-text-strong">
            {work.title}
          </h3>
          <p className="truncate text-[length:var(--text-caption-size)] text-text-muted">
            {work.creators.join("・")}
          </p>
        </div>
        <Button
          aria-label={`${work.title} — ${labels.remove}`}
          className="negative-entry__remove [&>svg]:size-4"
          disabled={disabled}
          onClick={() => onRemove(work.id)}
          size="icon"
          type="button"
          variant="outline"
        >
          <XIcon aria-hidden="true" />
        </Button>
      </div>

      <fieldset
        aria-label={`${work.title} — ${labels.disposition}`}
        className="negative-entry__disposition m-0 grid min-w-0 gap-[var(--space-content)] border-0 p-0"
      >
        <legend className="mb-[var(--space-content)] text-[length:var(--text-caption-size)] font-bold text-text-muted">
          {labels.disposition}
        </legend>
        <ChoiceChipRadioGroup<NegativeDisposition>
          aria-label={`${work.title} — ${labels.disposition}`}
          className="w-auto"
          disabled={disabled}
          name={groupName}
          onValueChange={(disposition) => onDispositionChange(work.id, disposition)}
          value={entry.disposition}
        >
          <DispositionChoice inputRef={dislikedInputRef} label={labels.disliked} value="disliked" />
          <DispositionChoice inputRef={droppedInputRef} label={labels.dropped} value="dropped" />
        </ChoiceChipRadioGroup>
      </fieldset>

      <div
        aria-label={`${work.title} — ${labels.reasons}`}
        className="negative-entry__reasons grid gap-[var(--space-3)] border-t border-line pt-[var(--space-4)]"
        role="group"
      >
        <p
          className="text-[length:var(--text-caption-size)] font-bold text-text-muted"
          id={reasonsLegendId}
        >
          {labels.reasonsLegend[entry.disposition]}
        </p>
        {NEGATIVE_REASON_GROUP_ORDER.map((group) => {
          const options = reasonOptions.filter((option) => option.group === group);
          if (options.length === 0) return null;
          return (
            <div
              aria-describedby={reasonsLegendId}
              aria-label={labels.reasonGroups[group]}
              className="grid gap-[var(--space-content)]"
              key={group}
              role="group"
            >
              <span
                aria-hidden="true"
                className="text-[length:var(--text-caption-size)] text-text-muted"
              >
                {labels.reasonGroups[group]}
              </span>
              <div className="flex flex-wrap gap-[var(--space-content)]">
                {options.map((option) => (
                  <ReasonChoice
                    checked={entry.reasons.includes(option.id)}
                    disabled={disabled}
                    key={option.id}
                    label={option.label}
                    onToggle={() => onReasonToggle(work.id, option.id)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {entry.reasons.length === 0 ? (
        <p className="negative-entry__helper text-[length:var(--text-caption-size)] text-text-muted">
          {labels.noReason}
        </p>
      ) : null}
      {hasExternalReason ? (
        <p className="negative-entry__helper text-[length:var(--text-caption-size)] text-text-muted">
          {labels.externalHelper}
        </p>
      ) : null}
    </article>
  );
}
