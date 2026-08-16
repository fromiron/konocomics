import * as z from "zod/v4";

import type { NegativeReasonId, Reaction, UserWorkRecord } from "./types";

export type CompletedRecommendationReaction = "highest" | "good" | "neutral" | "poor" | "skip";

export type RecommendationFeedbackInput =
  | {
      action: "planned";
      workId: string;
      updatedAt: string;
    }
  | {
      action: "completed";
      workId: string;
      updatedAt: string;
      reaction: CompletedRecommendationReaction;
    }
  | {
      action: "hidden";
      workId: string;
      updatedAt: string;
      reasons: readonly NegativeReasonId[];
    };

const completedReactionMap = {
  highest: "favorite",
  good: "liked",
  neutral: "neutral",
  poor: "disliked",
} as const satisfies Record<Exclude<CompletedRecommendationReaction, "skip">, Reaction>;

export function createRecommendationFeedbackRecord(
  input: RecommendationFeedbackInput,
): UserWorkRecord {
  const updatedAt = z.iso.datetime({ offset: true }).parse(input.updatedAt);

  if (input.action === "planned") {
    return {
      workId: input.workId,
      readingState: "planned",
      updatedAt,
    };
  }

  if (input.action === "completed") {
    return {
      workId: input.workId,
      readingState: "completed",
      ...(input.reaction === "skip" ? {} : { reaction: completedReactionMap[input.reaction] }),
      updatedAt,
    };
  }

  if (input.reasons.length === 0) {
    return {
      workId: input.workId,
      readingState: "hidden",
      updatedAt,
    };
  }

  return {
    workId: input.workId,
    readingState: "hidden",
    reaction: "disliked",
    negativeReasons: [...input.reasons],
    updatedAt,
  };
}
