"use client";

import { useEffect, useRef } from "react";

import { CoverImage } from "@/components/cover/CoverImage";
import type { Work } from "@/domain/catalog/types";
import type { NegativeDisposition, NegativeOnboardingEntry } from "@/domain/profile/onboarding";
import type { NegativeReasonId } from "@/domain/profile/types";

type NegativeWorkCardProps = Readonly<{
  work: Work;
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
  isPositive,
  isSelected,
  labels,
  onAdd,
}: NegativeWorkCardProps) {
  const unavailable = isPositive || isSelected;
  const dispositionName = `negative-result-disposition-${work.id}`;

  return (
    <article className="negative-result-card" data-disabled={unavailable || undefined}>
      <CoverImage creators={work.creators} requestedSize={400} title={work.title} />
      <h3>{work.title}</h3>
      <p>{work.creators.join("・")}</p>
      {isPositive ? (
        <span className="negative-result-card__badge">{labels.selectedPositive}</span>
      ) : null}
      {isSelected ? (
        <span className="negative-result-card__badge">{labels.selectedNegative}</span>
      ) : null}
      {!isPositive && !isSelected ? (
        <fieldset
          aria-label={`${work.title} — ${labels.disposition}`}
          className="negative-entry__disposition negative-result-card__disposition"
        >
          <legend>{labels.disposition}</legend>
          <label>
            <input
              checked={false}
              name={dispositionName}
              onChange={() => onAdd(work.id, "disliked")}
              type="radio"
              value="disliked"
            />
            <span>{labels.disliked}</span>
          </label>
          <label>
            <input
              checked={false}
              name={dispositionName}
              onChange={() => onAdd(work.id, "dropped")}
              type="radio"
              value="dropped"
            />
            <span>{labels.dropped}</span>
          </label>
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
    <article className="negative-entry">
      <div className="negative-entry__identity">
        <CoverImage creators={work.creators} requestedSize={200} title={work.title} />
        <div>
          <h3>{work.title}</h3>
          <p>{work.creators.join("・")}</p>
        </div>
        <button
          aria-label={`${work.title} — ${labels.remove}`}
          className="negative-entry__remove"
          onClick={() => onRemove(work.id)}
          type="button"
        >
          ×
        </button>
      </div>

      <fieldset
        aria-label={`${work.title} — ${labels.disposition}`}
        className="negative-entry__disposition"
      >
        <legend>{labels.disposition}</legend>
        <label>
          <input
            checked={entry.disposition === "disliked"}
            name={groupName}
            onChange={() => onDispositionChange(work.id, "disliked")}
            ref={dislikedInputRef}
            type="radio"
          />
          <span>{labels.disliked}</span>
        </label>
        <label>
          <input
            checked={entry.disposition === "dropped"}
            name={groupName}
            onChange={() => onDispositionChange(work.id, "dropped")}
            ref={droppedInputRef}
            type="radio"
          />
          <span>{labels.dropped}</span>
        </label>
      </fieldset>

      <div
        aria-label={`${work.title} — ${labels.reasons}`}
        className="negative-entry__reasons"
        role="group"
      >
        {reasonOptions.map((option) => (
          <button
            aria-pressed={entry.reasons.includes(option.id)}
            key={option.id}
            onClick={() => onReasonToggle(work.id, option.id)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
      {entry.reasons.length === 0 ? (
        <p className="negative-entry__helper">{labels.noReason}</p>
      ) : null}
      {hasExternalReason ? <p className="negative-entry__helper">{labels.externalHelper}</p> : null}
    </article>
  );
}
