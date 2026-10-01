"use client";

import { useEffect, useId, useRef } from "react";
import { XIcon } from "lucide-react";

import { CoverImage } from "@/components/cover/CoverImage";
import { Button } from "@/components/design-system/button";
import {
  ChoiceChipCheckbox,
  ChoiceChipRadio,
  ChoiceChipRadioGroup,
} from "@/components/design-system/choice-chip";
import type { Work } from "@/domain/catalog/types";
import type { NegativeDisposition, NegativeOnboardingEntry } from "@/domain/profile/onboarding";
import type { NegativeReasonId } from "@/domain/profile/types";

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
      className="negative-result-card grid grid-cols-[var(--space-12)_minmax(0,1fr)] items-center gap-x-[var(--space-3)] gap-y-[var(--space-content)] rounded-[var(--radius-card)] border border-line bg-surface-1 p-[var(--space-3)] data-[disabled]:opacity-65 sm:grid-cols-[var(--space-12)_minmax(0,1fr)_auto]"
      data-disabled={unavailable || undefined}
    >
      <CoverImage
        className="row-span-2 sm:row-span-1"
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
      {unavailable ? (
        <span className="negative-result-card__badge col-start-2 w-fit rounded-[var(--radius-pill)] border border-line px-[var(--space-2)] py-[var(--space-1)] text-[length:var(--text-caption-size)] font-bold text-text-muted sm:col-start-3">
          {isPositive ? labels.selectedPositive : labels.selectedNegative}
        </span>
      ) : (
        <fieldset
          aria-label={`${work.title} — ${labels.disposition}`}
          className="negative-entry__disposition negative-result-card__disposition col-start-2 m-0 min-w-0 border-0 p-0 sm:col-start-3"
        >
          <legend className="sr-only">{labels.disposition}</legend>
          <ChoiceChipRadioGroup<NegativeDisposition | "">
            aria-label={`${work.title} — ${labels.disposition}`}
            className="w-auto"
            disabled={disabled}
            name={dispositionName}
            onValueChange={(disposition) => {
              if (disposition !== "") onAdd(work.id, disposition);
            }}
            value=""
          >
            <ChoiceChipRadio value="disliked">{labels.disliked}</ChoiceChipRadio>
            <ChoiceChipRadio value="dropped">{labels.dropped}</ChoiceChipRadio>
          </ChoiceChipRadioGroup>
        </fieldset>
      )}
    </article>
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
          <ChoiceChipRadio inputRef={dislikedInputRef} value="disliked">
            {labels.disliked}
          </ChoiceChipRadio>
          <ChoiceChipRadio inputRef={droppedInputRef} value="dropped">
            {labels.dropped}
          </ChoiceChipRadio>
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
                  <ChoiceChipCheckbox
                    checked={entry.reasons.includes(option.id)}
                    disabled={disabled}
                    key={option.id}
                    onCheckedChange={() => onReasonToggle(work.id, option.id)}
                    value={option.id}
                  >
                    {option.label}
                  </ChoiceChipCheckbox>
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
