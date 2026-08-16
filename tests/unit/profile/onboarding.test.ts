import { describe, expect, it } from "vitest";

import {
  createEmptyOnboardingDraft,
  finalizeOnboardingDraft,
  reconcileOnboardingDraftMode,
  restoreOnboardingDraft,
  type FirstRunOnboardingDraft,
  type OnboardingDraft,
} from "@/domain/profile/onboarding";

const DRAFT_TIME = "2026-08-14T01:00:00.000Z";
const COMPLETED_TIME = "2026-08-14T02:00:00.000Z";

function positiveEntries(count = 5): OnboardingDraft["positiveEntries"] {
  return Array.from({ length: count }, (_, index) => ({
    workId: `positive-${String(index + 1)}`,
    reaction: index === 0 ? "favorite" : "liked",
  }));
}

function validDraft(overrides: Partial<FirstRunOnboardingDraft> = {}): FirstRunOnboardingDraft {
  return {
    id: "current",
    mode: "firstRun",
    step: 2,
    positiveEntries: positiveEntries(),
    negativeEntries: [],
    updatedAt: DRAFT_TIME,
    ...overrides,
  };
}

describe("onboarding draft", () => {
  it("creates an empty draft with only the injected time", () => {
    expect(createEmptyOnboardingDraft(DRAFT_TIME)).toEqual({
      id: "current",
      mode: "firstRun",
      step: 1,
      positiveEntries: [],
      negativeEntries: [],
      updatedAt: DRAFT_TIME,
    });
  });

  it("restores reaction, disposition, and reasons without sharing mutable input arrays", () => {
    const stored = {
      id: "current",
      mode: "firstRun",
      step: 2,
      positiveEntries: [
        { workId: "positive-1", reaction: "favorite" },
        { workId: "positive-2", reaction: "liked" },
      ],
      negativeEntries: [{ workId: "negative-1", disposition: "dropped", reasons: ["tooSlow"] }],
      updatedAt: DRAFT_TIME,
    };

    const restored = restoreOnboardingDraft(stored);
    stored.positiveEntries[0]!.reaction = "liked";
    stored.negativeEntries[0]!.reasons.push("tooDark");

    expect(restored).toEqual({
      id: "current",
      mode: "firstRun",
      step: 2,
      positiveEntries: [
        { workId: "positive-1", reaction: "favorite" },
        { workId: "positive-2", reaction: "liked" },
      ],
      negativeEntries: [{ workId: "negative-1", disposition: "dropped", reasons: ["tooSlow"] }],
      updatedAt: DRAFT_TIME,
    });
  });

  it("finalizes each disposition with the injected completion time and a vague fallback", () => {
    const draft = validDraft({
      negativeEntries: [
        { workId: "disliked-reasoned", disposition: "disliked", reasons: ["tooDark"] },
        { workId: "disliked-vague", disposition: "disliked", reasons: [] },
        { workId: "dropped-vague", disposition: "dropped", reasons: [] },
      ],
    });

    expect(finalizeOnboardingDraft(draft, COMPLETED_TIME)).toEqual([
      ...positiveEntries().map((entry) => ({
        workId: entry.workId,
        readingState: "completed",
        reaction: entry.reaction,
        updatedAt: COMPLETED_TIME,
      })),
      {
        workId: "disliked-reasoned",
        readingState: "completed",
        reaction: "disliked",
        negativeReasons: ["tooDark"],
        updatedAt: COMPLETED_TIME,
      },
      {
        workId: "disliked-vague",
        readingState: "completed",
        reaction: "disliked",
        negativeReasons: ["vagueDislike"],
        updatedAt: COMPLETED_TIME,
      },
      {
        workId: "dropped-vague",
        readingState: "dropped",
        droppedReasons: ["vagueDislike"],
        updatedAt: COMPLETED_TIME,
      },
    ]);
  });

  it("requires five positive works only when finalizing", () => {
    const incomplete = validDraft({ step: 1, positiveEntries: positiveEntries(4) });

    expect(restoreOnboardingDraft(incomplete)).toEqual(incomplete);
    expect(() => finalizeOnboardingDraft(incomplete, COMPLETED_TIME)).toThrow(
      "Onboarding requires at least 5 positive works",
    );
  });

  it("strictly distinguishes add drafts and finalizes one to ten new positive works", () => {
    const addDraft = createEmptyOnboardingDraft(DRAFT_TIME, "add");
    expect(addDraft).toEqual({
      id: "current",
      mode: "add",
      step: 1,
      positiveEntries: [],
      negativeEntries: [],
      updatedAt: DRAFT_TIME,
    });
    expect(() => finalizeOnboardingDraft(addDraft, COMPLETED_TIME)).toThrow(
      "Add mode requires at least 1 positive works",
    );

    const selectedAddDraft: OnboardingDraft = {
      ...addDraft,
      positiveEntries: [{ workId: "new-positive", reaction: "favorite" }],
    };
    expect(finalizeOnboardingDraft(selectedAddDraft, COMPLETED_TIME)).toEqual([
      {
        workId: "new-positive",
        readingState: "completed",
        reaction: "favorite",
        updatedAt: COMPLETED_TIME,
      },
    ]);
  });

  it("rejects missing or contradictory draft mode state", () => {
    const firstRun = validDraft();
    const withoutMode = Object.fromEntries(
      Object.entries(firstRun).filter(([key]) => key !== "mode"),
    );
    expect(() => restoreOnboardingDraft(withoutMode)).toThrow();
    expect(() => restoreOnboardingDraft({ ...firstRun, mode: "add" })).toThrow();
    expect(() =>
      restoreOnboardingDraft({
        ...createEmptyOnboardingDraft(DRAFT_TIME, "add"),
        negativeEntries: [{ workId: "negative-1", disposition: "disliked", reasons: [] }],
      }),
    ).toThrow();
  });

  it("reconciles a stale draft mode without carrying completed works or Step 2 negatives", () => {
    const staleFirstRun = validDraft({
      positiveEntries: [
        { workId: "already-saved", reaction: "favorite" },
        { workId: "still-new", reaction: "liked" },
      ],
      negativeEntries: [{ workId: "old-negative", disposition: "disliked", reasons: ["tooDark"] }],
    });

    expect(
      reconcileOnboardingDraftMode(
        staleFirstRun,
        true,
        new Set(["already-saved"]),
        new Set(["already-saved", "still-new", "old-negative"]),
        new Set(["already-saved", "still-new", "old-negative"]),
      ),
    ).toEqual({
      id: "current",
      mode: "add",
      step: 1,
      positiveEntries: [{ workId: "still-new", reaction: "liked" }],
      negativeEntries: [],
      updatedAt: DRAFT_TIME,
    });

    expect(
      reconcileOnboardingDraftMode(
        createEmptyOnboardingDraft(DRAFT_TIME, "add"),
        false,
        new Set(),
        new Set(),
        new Set(),
      ),
    ).toEqual(createEmptyOnboardingDraft(DRAFT_TIME, "firstRun"));

    expect(
      reconcileOnboardingDraftMode(
        {
          ...createEmptyOnboardingDraft(DRAFT_TIME, "add"),
          positiveEntries: [
            { workId: "already-saved", reaction: "favorite" },
            { workId: "still-new", reaction: "liked" },
          ],
        },
        true,
        new Set(["already-saved"]),
        new Set(["already-saved", "still-new"]),
        new Set(["already-saved", "still-new"]),
      ),
    ).toEqual({
      id: "current",
      mode: "add",
      step: 1,
      positiveEntries: [{ workId: "still-new", reaction: "liked" }],
      negativeEntries: [],
      updatedAt: DRAFT_TIME,
    });
  });

  it("drops unavailable work IDs and returns an incomplete first run to Step 1", () => {
    const staleDraft = validDraft({
      step: 2,
      positiveEntries: [
        { workId: "current-positive", reaction: "favorite" },
        { workId: "stale-positive-1", reaction: "liked" },
        { workId: "stale-positive-2", reaction: "liked" },
        { workId: "stale-positive-3", reaction: "liked" },
        { workId: "stale-positive-4", reaction: "liked" },
      ],
      negativeEntries: [
        { workId: "current-negative", disposition: "disliked", reasons: [] },
        { workId: "stale-negative", disposition: "dropped", reasons: [] },
      ],
    });

    expect(
      reconcileOnboardingDraftMode(
        staleDraft,
        false,
        new Set(),
        new Set(["current-positive"]),
        new Set(["current-positive", "current-negative"]),
      ),
    ).toEqual({
      ...staleDraft,
      step: 1,
      positiveEntries: [{ workId: "current-positive", reaction: "favorite" }],
      negativeEntries: [{ workId: "current-negative", disposition: "disliked", reasons: [] }],
    });
  });

  it("rejects drafts above the positive or negative limits", () => {
    expect(() =>
      restoreOnboardingDraft(validDraft({ positiveEntries: positiveEntries(11) })),
    ).toThrow();
    expect(() =>
      restoreOnboardingDraft(
        validDraft({
          negativeEntries: Array.from({ length: 4 }, (_, index) => ({
            workId: `negative-${String(index + 1)}`,
            disposition: "disliked" as const,
            reasons: [],
          })),
        }),
      ),
    ).toThrow();
  });

  it("rejects duplicate works and positive-negative overlap", () => {
    expect(() =>
      restoreOnboardingDraft(
        validDraft({
          positiveEntries: [...positiveEntries(), { workId: "positive-1", reaction: "liked" }],
        }),
      ),
    ).toThrow();
    expect(() =>
      restoreOnboardingDraft(
        validDraft({
          negativeEntries: [
            { workId: "negative-1", disposition: "disliked", reasons: [] },
            { workId: "negative-1", disposition: "dropped", reasons: [] },
          ],
        }),
      ),
    ).toThrow();
    expect(() =>
      restoreOnboardingDraft(
        validDraft({
          negativeEntries: [{ workId: "positive-1", disposition: "disliked", reasons: [] }],
        }),
      ),
    ).toThrow();
  });

  it("rejects vagueDislike when another reason is present", () => {
    expect(() =>
      restoreOnboardingDraft(
        validDraft({
          negativeEntries: [
            {
              workId: "negative-1",
              disposition: "dropped",
              reasons: ["vagueDislike", "external:no-time"],
            },
          ],
        }),
      ),
    ).toThrow("vagueDislike must be the entry's only reason");
  });

  it("rejects duplicate and non-canonical external reasons", () => {
    expect(() =>
      restoreOnboardingDraft(
        validDraft({
          negativeEntries: [
            {
              workId: "negative-1",
              disposition: "disliked",
              reasons: ["tooDark", "tooDark"],
            },
          ],
        }),
      ),
    ).toThrow("Duplicate onboarding reason");
    expect(() =>
      restoreOnboardingDraft({
        ...validDraft(),
        negativeEntries: [
          {
            workId: "negative-1",
            disposition: "dropped",
            reasons: ["external:No_Time"],
          },
        ],
      }),
    ).toThrow();
  });
});
