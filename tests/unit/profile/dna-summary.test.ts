import { describe, expect, it } from "vitest";

import { AXIS_IDS } from "@/domain/catalog/constants";
import { workAxesSchema } from "@/domain/catalog/schema";
import { summarizeMangaDna } from "@/domain/profile/dna-summary";
import { createTestAxes, createTestWork } from "../../helpers/catalog";
import { createTestRecord } from "../../helpers/recommendation";

describe("Manga DNA summary", () => {
  it("uses reaction-weighted positive anchors and stable supporting anchor ids", () => {
    const favorite = createTestWork({
      id: "anchor-a",
      axes: createTestAxes({
        strategy: { state: "known", value: 4, confidence: 0.1 },
        pacing: { state: "unknown" },
        motionImpact: { state: "notApplicable" },
      }),
      themes: [{ id: "adventure", centrality: 2, confidence: 0.1 }],
      genres: ["fantasy"],
    });
    const liked = createTestWork({
      id: "anchor-b",
      axes: createTestAxes({
        strategy: { state: "known", value: 2, confidence: 1 },
        pacing: { state: "known", value: 2, confidence: 1 },
        motionImpact: { state: "unknown" },
      }),
      themes: [
        { id: "adventure", centrality: 1, confidence: 1 },
        { id: "combat", centrality: 2, confidence: 1 },
      ],
      genres: ["fantasy", "action"],
    });
    const emptyTagAxes = workAxesSchema.parse(
      Object.fromEntries(AXIS_IDS.map((axisId) => [axisId, { state: "unknown" }])),
    );
    const emptyTagGroups = createTestWork({
      id: "anchor-c",
      axes: emptyTagAxes,
      themes: [],
      genres: [],
    });
    const ignored = createTestWork({
      id: "ignored",
      axes: createTestAxes({ strategy: { state: "known", value: 0, confidence: 1 } }),
      themes: [{ id: "adventure", centrality: 1, confidence: 1 }],
      genres: ["action"],
    });
    const libraryOnly = createTestWork({
      id: "library-only",
      axes: createTestAxes({ strategy: { state: "known", value: 0, confidence: 1 } }),
      themes: [{ id: "war", centrality: 2, confidence: 1 }],
      genres: ["historical"],
      eligibility: {
        onboardingEligible: false,
        recommendationEligible: false,
        libraryOnly: true,
      },
    });
    const records = [
      createTestRecord({ workId: "anchor-b", reaction: "liked" }),
      createTestRecord({ workId: "anchor-a", reaction: "favorite" }),
      createTestRecord({ workId: "anchor-a", reaction: "liked" }),
      createTestRecord({ workId: "anchor-c", reaction: "liked" }),
      createTestRecord({ workId: "ignored", reaction: "neutral" }),
      createTestRecord({ workId: "library-only", reaction: "favorite" }),
    ];

    const summary = summarizeMangaDna(
      [ignored, libraryOnly, emptyTagGroups, liked, favorite],
      records,
    );

    expect(summary.axes.find(({ factorId }) => factorId === "strategy")).toEqual({
      factorId: "strategy",
      state: "known",
      value: 3.111111111111,
      anchorWorkIds: ["anchor-a", "anchor-b"],
    });
    expect(summary.axes.find(({ factorId }) => factorId === "pacing")).toEqual({
      factorId: "pacing",
      state: "known",
      value: 2,
      anchorWorkIds: ["anchor-b"],
    });
    expect(summary.axes.find(({ factorId }) => factorId === "motionImpact")).toEqual({
      factorId: "motionImpact",
      state: "unknown",
      value: null,
      anchorWorkIds: [],
    });
    expect(summary.themes.find(({ factorId }) => factorId === "adventure")).toEqual({
      factorId: "adventure",
      state: "known",
      value: 3.111111111111,
      anchorWorkIds: ["anchor-a", "anchor-b"],
    });
    expect(summary.themes.find(({ factorId }) => factorId === "combat")).toEqual({
      factorId: "combat",
      state: "known",
      value: 1.777777777778,
      anchorWorkIds: ["anchor-b"],
    });
    expect(summary.genres.find(({ factorId }) => factorId === "fantasy")).toEqual({
      factorId: "fantasy",
      state: "known",
      value: 4,
      anchorWorkIds: ["anchor-a", "anchor-b"],
    });
    expect(summary.topPreferences.map(({ kind, factorId }) => [kind, factorId])).toEqual([
      ["genre", "fantasy"],
      ["theme", "adventure"],
      ["axis", "strategy"],
    ]);

    expect(
      summarizeMangaDna(
        [favorite, liked, emptyTagGroups, libraryOnly, ignored],
        [...records].reverse(),
      ),
    ).toEqual(summary);
  });

  it("preserves unknown instead of rendering missing evidence as zero", () => {
    const axes = workAxesSchema.parse(
      Object.fromEntries(AXIS_IDS.map((axisId) => [axisId, { state: "unknown" }])),
    );
    const work = createTestWork({ id: "unknown-anchor", axes, themes: [], genres: [] });
    const summary = summarizeMangaDna(
      [work],
      [createTestRecord({ workId: work.id, reaction: "favorite" })],
    );

    expect(summary.axes.every(({ state, value }) => state === "unknown" && value === null)).toBe(
      true,
    );
    expect(summary.themes.every(({ state, value }) => state === "unknown" && value === null)).toBe(
      true,
    );
    expect(summary.genres.every(({ state, value }) => state === "unknown" && value === null)).toBe(
      true,
    );
    expect(summary.topPreferences).toEqual([]);
  });
});
