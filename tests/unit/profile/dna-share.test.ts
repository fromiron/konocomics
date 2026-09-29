import { describe, expect, it } from "vitest";

import { buildDnaShareCard, dnaShareWorkCandidates } from "@/domain/profile/dna-share";
import { summarizeMangaDna } from "@/domain/profile/dna-summary";
import type { UserWorkRecord } from "@/domain/profile/types";
import { landingSearchSchema } from "@/lib/route-search";
import { createTestAxes, createTestWork } from "../../helpers/catalog";

const works = Array.from({ length: 7 }, (_, index) =>
  createTestWork({
    id: `work-${String(index + 1)}`,
    axes: createTestAxes({ pacing: { state: "known", value: 4, confidence: 0.9 } }),
  }),
);

function record(workId: string, reaction: UserWorkRecord["reaction"]): UserWorkRecord {
  return {
    workId,
    readingState: "completed",
    ...(reaction === undefined ? {} : { reaction }),
    updatedAt: "2026-09-01T00:00:00.000Z",
  };
}

describe("Manga DNA share card", () => {
  it("counts the distinct analysed works, not the capped evidence lists", () => {
    const records = [
      ...works.slice(0, 6).map((work) => record(work.id, "liked")),
      record("work-1", "favorite"),
      record("work-7", "disliked"),
    ];
    const summary = summarizeMangaDna(works, records);
    const evidenceCount = new Set(summary.topPreferences.flatMap((p) => p.anchorWorkIds)).size;

    const card = buildDnaShareCard(summary, new Set());

    expect(summary.analyzedWorkIds).toEqual(works.slice(0, 6).map((work) => work.id));
    expect(evidenceCount).toBeLessThan(6);
    expect(card?.analyzedWorkCount).toBe(6);
  });

  it("offers every analysed work, evidence first, and keeps named plus unnamed equal to the count", () => {
    const records = works.slice(0, 5).map((work) => record(work.id, "liked"));
    const summary = summarizeMangaDna(works, records);
    const candidates = dnaShareWorkCandidates(summary);
    const evidence = [...new Set(summary.topPreferences.flatMap((p) => p.anchorWorkIds))];

    const allPublic = buildDnaShareCard(summary, new Set(candidates));
    const hidden = buildDnaShareCard(summary, new Set(candidates.slice(1)));

    expect(new Set(candidates)).toEqual(new Set(summary.analyzedWorkIds));
    expect(candidates.slice(0, evidence.length)).toEqual(evidence);
    expect(allPublic?.namedWorkIds).toEqual(candidates);
    expect(hidden?.namedWorkIds).not.toContain(candidates[0]);
    expect(hidden?.analyzedWorkCount).toBe(5);
    expect(hidden?.analyzedWorkCount).toBe(allPublic?.analyzedWorkCount);
    expect(hidden?.preferences.map((p) => p.factorId)).toEqual(
      allPublic?.preferences.map((p) => p.factorId),
    );
  });

  it("lists only confirmed scarce Axes, lowest first, and never pads or guesses", () => {
    const scarceWorks = works.slice(0, 5).map((work) => ({
      ...work,
      axes: createTestAxes({
        romance: { state: "known", value: 0, confidence: 0.9 },
        comedy: { state: "known", value: 1, confidence: 0.9 },
        darkness: { state: "known", value: 2, confidence: 0.9 },
        artDensity: { state: "unknown" },
      }),
    }));
    const summary = summarizeMangaDna(
      scarceWorks,
      scarceWorks.map((work) => record(work.id, "liked")),
    );

    const card = buildDnaShareCard(summary, new Set());

    expect(card?.restrainedAxes).toEqual([
      { axisId: "romance", value: 0 },
      { axisId: "comedy", value: 1 },
    ]);
    expect(card?.restrainedAxes.some((axis) => axis.axisId === "artDensity")).toBe(false);
  });

  it("refuses to build a card without a confirmed preference", () => {
    expect(
      buildDnaShareCard({ analyzedWorkIds: ["work-1"], axes: [], topPreferences: [] }, new Set()),
    ).toBe(null);
  });

  it("accepts only the fixed share entry marker", () => {
    expect(landingSearchSchema.parse({ landing: "1", via: "share-card" })).toEqual({
      landing: "1",
      via: "share-card",
    });
    expect(landingSearchSchema.parse({ via: "user-123" }).via).toBeUndefined();
  });
});
