import { describe, expect, it } from "vitest";

import { ART_AXIS_IDS, AXIS_IDS, NARRATIVE_AXIS_IDS } from "@/domain/catalog/constants";
import type { ScaleValue, Work } from "@/domain/catalog/types";
import { selectRelatedWorks } from "@/domain/recommendation/related";
import { workSimilarity } from "@/domain/recommendation/similarity";
import { createTestAxes, createTestWork } from "../../helpers/catalog";

function emptyWork(id: string): Work {
  const axes = createTestAxes();
  for (const axis of AXIS_IDS) axes[axis] = { state: "unknown" };
  return createTestWork({ id, axes, genres: [], themes: [] });
}

function known(value: ScaleValue) {
  return { state: "known", value, confidence: 1 } as const;
}

function ineligible(work: Work): Work {
  return {
    ...work,
    eligibility: { onboardingEligible: false, recommendationEligible: false, libraryOnly: true },
  };
}

describe("related work selection", () => {
  it("requires eligible source and candidates, and excludes the source itself", () => {
    const source = createTestWork({ id: "source" });
    const candidate = createTestWork({ id: "candidate" });
    expect(selectRelatedWorks({ source: ineligible(source), candidates: [candidate] })).toEqual([]);
    expect(selectRelatedWorks({ source, candidates: [source, ineligible(candidate)] })).toEqual([]);
    expect(
      selectRelatedWorks({ source, candidates: [candidate] }).map(({ work }) => work.id),
    ).toEqual([candidate.id]);
  });

  it("does not fill missing results with unknown, inapplicable, or insufficient-coverage evidence", () => {
    const source = emptyWork("source");
    const empty = emptyWork("empty");
    const inapplicable = emptyWork("inapplicable");
    for (const axis of AXIS_IDS) inapplicable.axes[axis] = { state: "notApplicable" };
    expect(selectRelatedWorks({ source, candidates: [empty, inapplicable] })).toEqual([]);

    source.axes.pacing = known(0);
    const sparse = emptyWork("sparse");
    sparse.axes.pacing = known(0);
    const similarity = workSimilarity(source, sparse);
    expect(similarity.score).toBeGreaterThan(0.5);
    expect(similarity.groups.narrative.coverageScale).toBeLessThan(1);
    expect(selectRelatedWorks({ source, candidates: [sparse] })).toEqual([]);
  });

  it("preserves known zero as real evidence once its group has sufficient coverage", () => {
    const source = emptyWork("source");
    const candidate = emptyWork("candidate");
    for (const axis of NARRATIVE_AXIS_IDS) {
      source.axes[axis] = known(0);
      candidate.axes[axis] = known(0);
    }
    const result = selectRelatedWorks({ source, candidates: [candidate] });
    expect(result).toHaveLength(1);
    expect(result[0]?.score).toBeCloseTo(0.625);
    expect(result[0]?.contributions.map(({ factorId }) => factorId)).toEqual(
      [...NARRATIVE_AXIS_IDS].sort(),
    );

    for (const axis of NARRATIVE_AXIS_IDS) candidate.axes[axis] = { ...known(0), confidence: 0 };
    expect(selectRelatedWorks({ source, candidates: [candidate] })).toEqual([]);
  });

  it("keeps the existing score including shrunk groups, while explaining only supported contributions", () => {
    const source = emptyWork("source");
    source.genres = ["fantasy"];
    source.themes = [{ id: "adventure", centrality: 2, confidence: 1 }];
    source.axes.pacing = known(0);
    const theme = { ...emptyWork("theme"), themes: source.themes };
    const genre = { ...emptyWork("genre"), genres: source.genres };
    const mixed = { ...emptyWork("mixed"), genres: source.genres };
    mixed.axes.pacing = known(0);
    // Missing tags are neutral in the shared engine, not evidence of a match.
    const candidates = [genre, mixed, theme];
    const result = selectRelatedWorks({ source, candidates });
    expect(result.map(({ work }) => work.id)).toEqual(["theme", "mixed", "genre"]);
    for (const entry of result) {
      expect(entry.score).toBe(workSimilarity(source, entry.work).score);
    }
    expect(result[1]?.contributions).toEqual([
      { group: "genre", factorId: "fantasy", value: 0.075 },
    ]);
    expect(result[1]?.score).toBeGreaterThan(result[2]!.score);
    expect(selectRelatedWorks({ source, candidates: [...candidates].reverse() })).toEqual(result);
  });

  it("rejects a neutral total even when a supported positive contribution exists", () => {
    const source = emptyWork("source");
    source.genres = ["fantasy"];
    const candidate = { ...emptyWork("candidate"), genres: source.genres };
    for (const axis of ART_AXIS_IDS) {
      source.axes[axis] = known(0);
      candidate.axes[axis] = known(4);
    }
    const similarity = workSimilarity(source, candidate);
    expect(similarity.score).toBeCloseTo(0.5);
    expect(similarity.groups.genre.coverageScale).toBe(1);
    expect(similarity.groups.genre.contributions[0]?.value).toBeGreaterThan(0);
    expect(selectRelatedWorks({ source, candidates: [candidate] })).toEqual([]);
  });

  it("orders contributions by value, then group and factor ID for ties", () => {
    const source = emptyWork("source");
    source.genres = ["fantasy", "action"];
    source.themes = [{ id: "adventure", centrality: 2, confidence: 1 }];
    source.axes.artRealism = known(2);
    source.axes.artDensity = known(2);
    const candidate = { ...source, id: "candidate" };
    const result = selectRelatedWorks({ source, candidates: [candidate] });
    expect(result[0]?.contributions).toEqual([
      { group: "theme", factorId: "adventure", value: 0.125 },
      { group: "art", factorId: "artDensity", value: 0.0375 },
      { group: "art", factorId: "artRealism", value: 0.0375 },
      { group: "genre", factorId: "action", value: 0.0375 },
      { group: "genre", factorId: "fantasy", value: 0.0375 },
    ]);
  });

  it("caps at sixteen, breaks score ties by work ID, and keeps short results short", () => {
    const source = createTestWork({ id: "source" });
    const candidates = Array.from({ length: 18 }, (_, index) =>
      createTestWork({ id: `candidate-${String(index).padStart(2, "0")}` }),
    );
    const result = selectRelatedWorks({ source, candidates: [...candidates].reverse() });
    expect(result.map(({ work }) => work.id)).toEqual(candidates.slice(0, 16).map(({ id }) => id));
    expect(selectRelatedWorks({ source, candidates: candidates.slice(0, 3) })).toHaveLength(3);
    expect(selectRelatedWorks({ source, candidates: [] })).toEqual([]);
  });
});
