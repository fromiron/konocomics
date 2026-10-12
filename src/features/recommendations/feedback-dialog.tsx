"use client";

import { useState } from "react";

import { Button } from "@/components/design-system/button";
import { ChoiceChipRadio, ChoiceChipRadioGroup } from "@/components/design-system/choice-chip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/design-system/dialog";
import type { CompletedRecommendationReaction } from "@/domain/profile/recommendation-feedback";
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
  onSkip: () => void;
}>;

const REACTIONS = ["highest", "good", "neutral", "poor"] as const;

export function FeedbackDialog({
  busy,
  errorMessage,
  feedback,
  onSaveCompleted,
  onSkip,
}: FeedbackDialogProps) {
  const feedbackKey =
    feedback === null ? "closed" : `${feedback.kind}:${feedback.workId}:${feedback.updatedAt}`;
  const [selection, setSelection] = useState<{
    feedbackKey: string;
    reaction: (typeof REACTIONS)[number] | null;
  }>({ feedbackKey: "closed", reaction: null });
  const reaction = selection.feedbackKey === feedbackKey ? selection.reaction : null;
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
  const canSave = completed && reaction !== null;

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open && !busy) onSkip();
      }}
      open={feedback !== null}
    >
      <DialogContent
        aria-describedby="recommendation-feedback-description"
        aria-labelledby="recommendation-feedback-title"
        className="!top-auto bottom-0 !max-h-[88dvh] w-full max-w-[var(--layout-width-form)] -translate-x-1/2 translate-y-0 rounded-t-[var(--radius-card)] rounded-b-none bg-surface-1 p-0 text-text shadow-[var(--shadow-raised)] sm:max-w-[var(--layout-width-form)] md:!top-1/2 md:bottom-auto md:-translate-y-1/2 md:rounded-[var(--radius-card)]"
        showCloseButton={false}
      >
        <form
          className="grid max-h-[88dvh] gap-[var(--space-5)] overflow-y-auto px-[var(--layout-page-padding)] pt-[var(--space-6)] pb-[calc(var(--space-6)+var(--layout-safe-area-bottom))] md:p-[var(--space-8)]"
          onSubmit={(event) => {
            event.preventDefault();
            if (feedback?.kind === "completed" && reaction !== null) {
              onSaveCompleted(reaction);
            }
          }}
        >
          <DialogHeader className="grid gap-[var(--space-content)]">
            <DialogTitle id="recommendation-feedback-title">{title}</DialogTitle>
            <DialogDescription id="recommendation-feedback-description">
              {description}
            </DialogDescription>
          </DialogHeader>

          {completed ? (
            <fieldset className="m-0 min-w-0 border-0 p-0">
              <legend className="mb-[var(--space-content)] p-0 font-bold text-text-strong">
                {recommendationStrings.feedbackDialog.reactionLegend}
              </legend>
              <ChoiceChipRadioGroup<(typeof REACTIONS)[number] | "">
                aria-label={recommendationStrings.feedbackDialog.reactionLegend}
                disabled={busy}
                name="recommendation-reaction"
                onValueChange={(value) => {
                  if (value !== "") {
                    setSelection({ feedbackKey, reaction: value });
                  }
                }}
                value={reaction ?? ""}
              >
                {REACTIONS.map((value) => (
                  <ChoiceChipRadio key={value} value={value}>
                    {recommendationStrings.feedbackDialog.reactionLabels[value]}
                  </ChoiceChipRadio>
                ))}
              </ChoiceChipRadioGroup>
            </fieldset>
          ) : null}

          {errorMessage ? (
            <p
              className="rounded-[var(--radius-card)] border border-warn p-[var(--space-3)]"
              role="alert"
            >
              {errorMessage}
            </p>
          ) : null}
          <div className="grid grid-cols-2 gap-[var(--space-content)]">
            <Button
              className="min-h-[var(--control-min-size)] border-line bg-surface-1 px-[var(--space-4)] py-[var(--space-content)] font-bold"
              busy={busy}
              onClick={onSkip}
              type="button"
              variant="outline"
            >
              {completed
                ? recommendationStrings.feedbackDialog.skip
                : recommendationStrings.feedbackDialog.close}
            </Button>
            {completed ? (
              <Button
                className="min-h-[var(--control-min-size)] px-[var(--space-4)] py-[var(--space-content)] font-bold"
                busy={busy}
                disabled={!canSave}
                type="submit"
              >
                {busy
                  ? recommendationStrings.feedbackDialog.saving
                  : recommendationStrings.feedbackDialog.save}
              </Button>
            ) : null}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
