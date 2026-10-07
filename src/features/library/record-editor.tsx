"use client";

import { type FormEvent, type ReactNode, useState } from "react";

import { Button } from "@/components/design-system/button";
import { ChoiceChipRadio, ChoiceChipRadioGroup } from "@/components/design-system/choice-chip";
import { Input } from "@/components/design-system/input";
import { FACTOR_BACKED_NEGATIVE_REASON_IDS } from "@/domain/profile/constants";
import { READING_STATES } from "@/domain/profile/reading-state";
import type {
  NegativeReasonId,
  Reaction,
  ReadingState,
  UserWorkRecord,
} from "@/domain/profile/types";
import { libraryStrings } from "@/lib/strings";

const REACTIONS = ["favorite", "liked", "neutral", "disliked"] as const;
/** The "no reaction" choice in the reaction group; never stored. */
const NO_REACTION = "none";
const REASON_OPTIONS: ReadonlyArray<Readonly<{ id: NegativeReasonId; label: string }>> = [
  ...FACTOR_BACKED_NEGATIVE_REASON_IDS.map((id) => ({
    id,
    label: libraryStrings.editor.reasonLabels[id],
  })),
  { id: "external:hiatus", label: libraryStrings.editor.reasonLabels.externalHiatus },
  { id: "external:no-time", label: libraryStrings.editor.reasonLabels.externalNoTime },
  { id: "vagueDislike", label: libraryStrings.editor.reasonLabels.vague },
];

function optionalInteger(value: string) {
  if (value.trim() === "") return undefined;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed >= 0 ? parsed : undefined;
}

function isReadingState(value: string): value is ReadingState {
  return READING_STATES.some((state) => state === value);
}

function editableValues(record: UserWorkRecord) {
  return JSON.stringify([
    record.readingState,
    record.reaction ?? "",
    record.progress?.volume,
    record.progress?.chapter,
    record.reaction === "disliked" ? [...(record.negativeReasons ?? [])].sort() : [],
    record.readingState === "dropped" ? [...(record.droppedReasons ?? [])].sort() : [],
  ]);
}

function toggleReason(
  current: readonly NegativeReasonId[],
  other: readonly NegativeReasonId[],
  reason: NegativeReasonId,
): { current: NegativeReasonId[]; other: NegativeReasonId[] } {
  if (current.includes(reason)) {
    return { current: current.filter((entry) => entry !== reason), other: [...other] };
  }
  if (reason === "vagueDislike") {
    return { current: [reason], other: [] };
  }
  return {
    current: [...current.filter((entry) => entry !== "vagueDislike"), reason],
    other: other.filter((entry) => entry !== reason && entry !== "vagueDislike"),
  };
}

type ReasonPickerProps = Readonly<{
  descriptionId: string;
  legend: string;
  otherReasons: readonly NegativeReasonId[];
  reasons: readonly NegativeReasonId[];
  setReasons(next: NegativeReasonId[], nextOther: NegativeReasonId[]): void;
}>;

function ReasonPicker({
  descriptionId,
  legend,
  otherReasons,
  reasons,
  setReasons,
}: ReasonPickerProps) {
  const hasExternalReason = reasons.some((reason) => reason.startsWith("external:"));
  return (
    <fieldset aria-describedby={descriptionId} className="library-editor__group">
      <legend className="library-editor__legend">{legend}</legend>
      <p className="text-[length:var(--text-caption-size)] text-text-muted" id={descriptionId}>
        {libraryStrings.editor.reasonOptional}
      </p>
      <div className="flex flex-wrap gap-[var(--space-content)]" role="group">
        {REASON_OPTIONS.map((option) => (
          <Button
            aria-pressed={reasons.includes(option.id)}
            className="aria-pressed:border-accent aria-pressed:bg-accent aria-pressed:text-on-accent"
            key={option.id}
            onClick={() => {
              const next = toggleReason(reasons, otherReasons, option.id);
              setReasons(next.current, next.other);
            }}
            type="button"
            variant="outline"
          >
            {option.label}
          </Button>
        ))}
      </div>
      {hasExternalReason ? (
        <p className="border-l-[length:var(--space-content-tight)] border-line bg-canvas p-[var(--space-3)] text-[length:var(--text-caption-size)] text-text-muted">
          {libraryStrings.editor.externalReason}
        </p>
      ) : null}
    </fieldset>
  );
}

type LibraryRecordEditorProps = Readonly<{
  busy: boolean;
  isNewRecord?: boolean;
  onSave(record: UserWorkRecord): Promise<void>;
  record: UserWorkRecord;
  /** Save feedback shown beside the save button in the sticky action bar. */
  status?: ReactNode;
}>;

/**
 * The reading record form: state and reaction as visible choices (one tap each), optional
 * progress, the reasons a negative choice asks for, and the save action in a bar that stays at
 * the foot of the dialog while the form scrolls.
 */
export function LibraryRecordEditor({
  busy,
  isNewRecord = false,
  onSave,
  record,
  status,
}: LibraryRecordEditorProps) {
  const [readingState, setReadingState] = useState<ReadingState>(record.readingState);
  const [reaction, setReaction] = useState<Reaction | "">(record.reaction ?? "");
  const [volume, setVolume] = useState(
    record.progress?.volume === undefined ? "" : String(record.progress.volume),
  );
  const [chapter, setChapter] = useState(
    record.progress?.chapter === undefined ? "" : String(record.progress.chapter),
  );
  const [negativeReasons, setNegativeReasons] = useState<NegativeReasonId[]>(
    record.negativeReasons ?? [],
  );
  const [droppedReasons, setDroppedReasons] = useState<NegativeReasonId[]>(
    record.droppedReasons ?? [],
  );
  const [progressOpen, setProgressOpen] = useState(
    record.progress?.volume !== undefined || record.progress?.chapter !== undefined,
  );

  const next: UserWorkRecord = {
    ...record,
    workId: record.workId,
    readingState,
  };
  if (reaction === "") {
    delete next.reaction;
    delete next.negativeReasons;
  } else {
    next.reaction = reaction;
    if (reaction === "disliked" && negativeReasons.length > 0) {
      next.negativeReasons = [...negativeReasons];
    } else {
      delete next.negativeReasons;
    }
  }
  if (readingState === "dropped" && droppedReasons.length > 0) {
    next.droppedReasons = [...droppedReasons];
  } else {
    delete next.droppedReasons;
  }
  const nextVolume = optionalInteger(volume);
  const nextChapter = optionalInteger(chapter);
  if (nextVolume === undefined && nextChapter === undefined) {
    delete next.progress;
  } else {
    next.progress = { volume: nextVolume, chapter: nextChapter };
  }
  const hasChanges = editableValues(next) !== editableValues(record);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy || (!isNewRecord && !hasChanges)) return;
    void onSave({ ...next, updatedAt: new Date().toISOString() });
  };

  return (
    <form aria-busy={busy} className="library-editor" onSubmit={submit}>
      <h3 className="sr-only">{libraryStrings.editor.heading}</h3>
      <fieldset className="library-editor__group">
        <legend className="library-editor__legend">{libraryStrings.editor.readingState}</legend>
        <ChoiceChipRadioGroup<ReadingState>
          aria-label={libraryStrings.editor.readingState}
          disabled={busy}
          onValueChange={(value) => {
            if (isReadingState(value)) setReadingState(value);
          }}
          value={readingState}
        >
          {READING_STATES.map((state) => (
            <ChoiceChipRadio key={state} value={state}>
              {libraryStrings.tabs[state]}
            </ChoiceChipRadio>
          ))}
        </ChoiceChipRadioGroup>
      </fieldset>
      <fieldset className="library-editor__group">
        <legend className="library-editor__legend">{libraryStrings.editor.reaction}</legend>
        <ChoiceChipRadioGroup<Reaction | typeof NO_REACTION>
          aria-label={libraryStrings.editor.reaction}
          disabled={busy}
          onValueChange={(value) => setReaction(value === NO_REACTION ? "" : value)}
          value={reaction === "" ? NO_REACTION : reaction}
        >
          {REACTIONS.map((entry) => (
            <ChoiceChipRadio
              key={entry}
              value={entry}
              variant={entry === "disliked" ? "danger" : "default"}
            >
              {libraryStrings.reactions[entry]}
            </ChoiceChipRadio>
          ))}
          <ChoiceChipRadio chipClassName="library-editor__none" value={NO_REACTION}>
            {libraryStrings.editor.reactionPrompt}
          </ChoiceChipRadio>
        </ChoiceChipRadioGroup>
      </fieldset>
      <details open={progressOpen} onToggle={(event) => setProgressOpen(event.currentTarget.open)}>
        <summary className="library-editor__legend min-h-[var(--control-min-size)] cursor-pointer content-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring">
          {libraryStrings.editor.progressOptional}
        </summary>
        <fieldset
          aria-label={libraryStrings.editor.progress}
          className="m-0 grid grid-cols-2 gap-[var(--space-3)] border-0 pt-[var(--space-content)]"
        >
          <label className="grid gap-[var(--space-content-tight)] text-[length:var(--text-caption-size)] font-bold text-text-muted">
            <span>{libraryStrings.editor.volume}</span>
            <Input
              disabled={busy}
              inputMode="numeric"
              min="0"
              onChange={(event) => setVolume(event.currentTarget.value)}
              step="1"
              type="number"
              value={volume}
            />
          </label>
          <label className="grid gap-[var(--space-content-tight)] text-[length:var(--text-caption-size)] font-bold text-text-muted">
            <span>{libraryStrings.editor.chapter}</span>
            <Input
              disabled={busy}
              inputMode="numeric"
              min="0"
              onChange={(event) => setChapter(event.currentTarget.value)}
              step="1"
              type="number"
              value={chapter}
            />
          </label>
        </fieldset>
      </details>
      {reaction === "disliked" ? (
        <ReasonPicker
          descriptionId={`library-negative-reasons-${record.workId}`}
          legend={libraryStrings.editor.reasonDisliked}
          otherReasons={droppedReasons}
          reasons={negativeReasons}
          setReasons={(next, nextDropped) => {
            setNegativeReasons(next);
            setDroppedReasons(nextDropped);
          }}
        />
      ) : null}
      {readingState === "dropped" ? (
        <ReasonPicker
          descriptionId={`library-dropped-reasons-${record.workId}`}
          legend={libraryStrings.editor.reasonDropped}
          otherReasons={negativeReasons}
          reasons={droppedReasons}
          setReasons={(next, nextNegative) => {
            setDroppedReasons(next);
            setNegativeReasons(nextNegative);
          }}
        />
      ) : null}
      <div className="library-editor__actions">
        <div className="library-editor__status">{status}</div>
        <Button disabled={busy || (!isNewRecord && !hasChanges)} type="submit">
          {busy ? libraryStrings.editor.saving : libraryStrings.editor.save}
        </Button>
      </div>
    </form>
  );
}
