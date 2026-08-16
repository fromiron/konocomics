"use client";

import { useEffect, useRef } from "react";
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
  onCoverSettled?: () => void;
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
  onCoverSettled,
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
      className="negative-result-card grid grid-cols-[72px_minmax(0,1fr)] content-start items-start gap-[var(--space-content)] rounded-[var(--radius-card)] border border-line bg-surface-1 p-[var(--space-3)] data-[disabled]:opacity-65 md:grid-cols-[72px_minmax(0,1fr)_minmax(260px,auto)]"
      data-disabled={unavailable || undefined}
    >
      <CoverImage
        className="[grid-row:1/span_3]"
        coverUrl={coverUrl}
        creators={work.creators}
        onSettled={onCoverSettled}
        requestedSize={400}
        title={work.title}
      />
      <h3 className="col-start-2">{work.title}</h3>
      <p className="col-start-2 text-[length:var(--font-size-14)] text-text-muted">
        {work.creators.join("・")}
      </p>
      {isPositive ? (
        <span className="negative-result-card__badge col-start-2 inline-flex min-h-8 items-center justify-center rounded-full bg-accent-soft px-2 py-1 text-[length:var(--text-caption-size)] font-bold text-text-strong md:col-start-3 md:row-start-1 md:[grid-row-end:span_3]">
          {labels.selectedPositive}
        </span>
      ) : null}
      {isSelected ? (
        <span className="negative-result-card__badge col-start-2 inline-flex min-h-8 items-center justify-center rounded-full bg-accent-soft px-2 py-1 text-[length:var(--text-caption-size)] font-bold text-text-strong md:col-start-3 md:row-start-1 md:[grid-row-end:span_3]">
          {labels.selectedNegative}
        </span>
      ) : null}
      {!isPositive && !isSelected ? (
        <fieldset
          aria-label={`${work.title} — ${labels.disposition}`}
          className="negative-entry__disposition negative-result-card__disposition col-span-full mt-auto flex flex-wrap gap-[var(--space-content)] border-0 p-0 md:col-start-3 md:row-start-1 md:[grid-row-end:span_3]"
        >
          <legend className="mb-1 w-full font-bold text-text-strong">{labels.disposition}</legend>
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
      ) : null}
    </article>
  );
}

export type NegativeReasonOption = Readonly<{
  id: NegativeReasonId;
  label: string;
  external: boolean;
}>;

type NegativeEntryEditorProps = Readonly<{
  work: Work;
  coverUrl?: string | null;
  onCoverSettled?: () => void;
  disabled: boolean;
  entry: NegativeOnboardingEntry;
  focusDisposition?: NegativeDisposition;
  labels: Readonly<{
    disposition: string;
    disliked: string;
    dropped: string;
    reasons: string;
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
  onCoverSettled,
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
    <article className="negative-entry grid gap-[var(--space-5)] rounded-[var(--radius-card)] border border-line bg-surface-1 p-[var(--space-4)] md:grid-cols-[minmax(240px,0.8fr)_minmax(280px,1.2fr)]">
      <div className="negative-entry__identity grid grid-cols-[64px_minmax(0,1fr)_var(--control-min-size)] items-center gap-[var(--space-content-loose)] md:self-start">
        <CoverImage
          coverUrl={coverUrl}
          creators={work.creators}
          onSettled={onCoverSettled}
          requestedSize={200}
          title={work.title}
        />
        <div>
          <h3>{work.title}</h3>
          <p className="text-[length:var(--font-size-14)] text-text-muted">
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
        className="negative-entry__disposition flex flex-wrap gap-[var(--space-content)] border-0 p-0"
      >
        <legend className="mb-1 w-full font-bold text-text-strong">{labels.disposition}</legend>
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
        className="negative-entry__reasons flex flex-wrap gap-[var(--space-content)] md:col-start-2"
        role="group"
      >
        {reasonOptions.map((option) => (
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
      {entry.reasons.length === 0 ? (
        <p className="negative-entry__helper text-[length:var(--text-caption-size)] text-text-muted md:col-start-2">
          {labels.noReason}
        </p>
      ) : null}
      {hasExternalReason ? (
        <p className="negative-entry__helper text-[length:var(--text-caption-size)] text-text-muted md:col-start-2">
          {labels.externalHelper}
        </p>
      ) : null}
    </article>
  );
}
