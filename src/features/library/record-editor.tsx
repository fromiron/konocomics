"use client";

import { type FormEvent, useState } from "react";

import { FACTOR_BACKED_NEGATIVE_REASON_IDS } from "@/domain/profile/constants";
import type {
  NegativeReasonId,
  Reaction,
  ReadingState,
  UserWorkRecord,
} from "@/domain/profile/types";
import { libraryStrings } from "@/lib/strings";

const READING_STATES = ["planned", "reading", "completed", "dropped", "hidden"] as const;
const REACTIONS = ["favorite", "liked", "neutral", "disliked"] as const;
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

function isReaction(value: string): value is Reaction {
  return REACTIONS.some((reaction) => reaction === value);
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
    <fieldset aria-describedby={descriptionId} className="library-editor__reasons">
      <legend>{legend}</legend>
      <p id={descriptionId}>{libraryStrings.editor.reasonOptional}</p>
      <div role="group">
        {REASON_OPTIONS.map((option) => (
          <button
            aria-pressed={reasons.includes(option.id)}
            className="interactive-press"
            key={option.id}
            onClick={() => {
              const next = toggleReason(reasons, otherReasons, option.id);
              setReasons(next.current, next.other);
            }}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
      {hasExternalReason ? (
        <p className="library-external-note">{libraryStrings.editor.externalReason}</p>
      ) : null}
    </fieldset>
  );
}

type LibraryRecordEditorProps = Readonly<{
  busy: boolean;
  onSave(record: UserWorkRecord): Promise<void>;
  record: UserWorkRecord;
}>;

export function LibraryRecordEditor({ busy, onSave, record }: LibraryRecordEditorProps) {
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

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: UserWorkRecord = {
      ...record,
      workId: record.workId,
      readingState,
      updatedAt: new Date().toISOString(),
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
    void onSave(next);
  };

  return (
    <form aria-busy={busy} className="library-editor" onSubmit={submit}>
      <h3>{libraryStrings.editor.heading}</h3>
      <div className="library-editor__fields">
        <label>
          <span>{libraryStrings.editor.readingState}</span>
          <select
            disabled={busy}
            onChange={(event) => {
              if (isReadingState(event.currentTarget.value)) {
                setReadingState(event.currentTarget.value);
              }
            }}
            value={readingState}
          >
            {READING_STATES.map((state) => (
              <option key={state} value={state}>
                {libraryStrings.tabs[state]}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>{libraryStrings.editor.reaction}</span>
          <select
            disabled={busy}
            onChange={(event) => {
              const value = event.currentTarget.value;
              if (value === "" || isReaction(value)) setReaction(value);
            }}
            value={reaction}
          >
            <option value="">{libraryStrings.editor.reactionPrompt}</option>
            {REACTIONS.map((entry) => (
              <option key={entry} value={entry}>
                {libraryStrings.reactions[entry]}
              </option>
            ))}
          </select>
        </label>
      </div>
      <fieldset className="library-editor__progress">
        <legend>{libraryStrings.editor.progress}</legend>
        <label>
          <span>{libraryStrings.editor.volume}</span>
          <input
            disabled={busy}
            inputMode="numeric"
            min="0"
            onChange={(event) => setVolume(event.currentTarget.value)}
            step="1"
            type="number"
            value={volume}
          />
        </label>
        <label>
          <span>{libraryStrings.editor.chapter}</span>
          <input
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
      <button className="library-editor__save interactive-press" disabled={busy} type="submit">
        {busy ? libraryStrings.editor.saving : libraryStrings.editor.save}
      </button>
    </form>
  );
}
