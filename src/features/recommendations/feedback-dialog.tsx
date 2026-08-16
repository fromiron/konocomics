"use client";

import { useEffect, useRef, useState } from "react";

import { FACTOR_BACKED_NEGATIVE_REASON_IDS } from "@/domain/profile/constants";
import type { CompletedRecommendationReaction } from "@/domain/profile/recommendation-feedback";
import type { FactorBackedNegativeReasonId } from "@/domain/profile/types";
import { recommendationStrings } from "@/lib/strings";

export type PendingRecommendationFeedback = Readonly<{
  kind: "completed" | "hidden";
  workId: string;
  title: string;
  updatedAt: string;
  focusWorkId: string | null;
}>;

type FeedbackDialogProps = Readonly<{
  feedback: PendingRecommendationFeedback | null;
  busy: boolean;
  errorMessage: string;
  onSaveCompleted: (reaction: Exclude<CompletedRecommendationReaction, "skip">) => void;
  onSaveHidden: (reasons: readonly FactorBackedNegativeReasonId[]) => void;
  onSkip: () => void;
}>;

const REACTIONS = ["highest", "good", "neutral", "poor"] as const;

export function FeedbackDialog({
  busy,
  errorMessage,
  feedback,
  onSaveCompleted,
  onSaveHidden,
  onSkip,
}: FeedbackDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const feedbackKey =
    feedback === null ? "closed" : `${feedback.kind}:${feedback.workId}:${feedback.updatedAt}`;
  const [selection, setSelection] = useState<{
    feedbackKey: string;
    reaction: (typeof REACTIONS)[number] | null;
    reasons: FactorBackedNegativeReasonId[];
  }>({ feedbackKey: "closed", reaction: null, reasons: [] });
  const reaction = selection.feedbackKey === feedbackKey ? selection.reaction : null;
  const reasons = selection.feedbackKey === feedbackKey ? selection.reasons : [];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog === null) return;
    if (feedback === null) {
      if (dialog.open) {
        if (typeof dialog.close === "function") dialog.close();
        else dialog.removeAttribute("open");
      }
      return;
    }
    if (!dialog.open) {
      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "");
    }
  }, [feedback]);

  const toggleReason = (reason: FactorBackedNegativeReasonId) => {
    setSelection((current) => {
      const currentReasons = current.feedbackKey === feedbackKey ? current.reasons : [];
      return {
        feedbackKey,
        reaction: null,
        reasons: currentReasons.includes(reason)
          ? currentReasons.filter((candidate) => candidate !== reason)
          : [...currentReasons, reason],
      };
    });
  };
  const completed = feedback?.kind === "completed";
  const title = completed
    ? recommendationStrings.feedbackDialog.completedTitle
    : recommendationStrings.feedbackDialog.hiddenTitle;
  const description =
    feedback === null
      ? ""
      : completed
        ? recommendationStrings.feedbackDialog.completedDescription(feedback.title)
        : recommendationStrings.feedbackDialog.hiddenDescription(feedback.title);
  const canSave = completed ? reaction !== null : reasons.length > 0;

  return (
    <dialog
      aria-describedby="recommendation-feedback-description"
      aria-labelledby="recommendation-feedback-title"
      className="recommendation-feedback-dialog"
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onSkip();
      }}
      ref={dialogRef}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (feedback?.kind === "completed" && reaction !== null) {
            onSaveCompleted(reaction);
          } else if (feedback?.kind === "hidden" && reasons.length > 0) {
            onSaveHidden(reasons);
          }
        }}
      >
        <header>
          <h2 id="recommendation-feedback-title">{title}</h2>
          <p id="recommendation-feedback-description">{description}</p>
        </header>

        {completed ? (
          <fieldset>
            <legend>{recommendationStrings.feedbackDialog.reactionLegend}</legend>
            <div className="recommendation-feedback-dialog__choices">
              {REACTIONS.map((value, index) => (
                <label key={value}>
                  <input
                    autoFocus={feedback?.kind === "completed" && index === 0}
                    checked={reaction === value}
                    disabled={busy}
                    name="recommendation-reaction"
                    onChange={() => setSelection({ feedbackKey, reaction: value, reasons: [] })}
                    type="radio"
                    value={value}
                  />
                  <span>{recommendationStrings.feedbackDialog.reactionLabels[value]}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ) : (
          <fieldset>
            <legend>{recommendationStrings.feedbackDialog.reasonLegend}</legend>
            <div className="recommendation-feedback-dialog__reasons">
              {FACTOR_BACKED_NEGATIVE_REASON_IDS.map((reason, index) => (
                <label key={reason}>
                  <input
                    autoFocus={feedback?.kind === "hidden" && index === 0}
                    checked={reasons.includes(reason)}
                    disabled={busy}
                    onChange={() => toggleReason(reason)}
                    type="checkbox"
                    value={reason}
                  />
                  <span>{recommendationStrings.feedbackDialog.reasonLabels[reason]}</span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {errorMessage ? <p role="alert">{errorMessage}</p> : null}
        <div className="recommendation-feedback-dialog__actions">
          <button disabled={busy} onClick={onSkip} type="button">
            {recommendationStrings.feedbackDialog.skip}
          </button>
          <button className="interactive-press" disabled={busy || !canSave} type="submit">
            {busy
              ? recommendationStrings.feedbackDialog.saving
              : recommendationStrings.feedbackDialog.save}
          </button>
        </div>
      </form>
    </dialog>
  );
}
