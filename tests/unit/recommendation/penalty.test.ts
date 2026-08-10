import { describe, expect, it } from "vitest";

import { ART_AXIS_IDS, AXIS_IDS } from "@/domain/catalog/constants";
import type { AxisFactor, AxisId, ThemeFactor, Work } from "@/domain/catalog/types";
import type {
  FactorBackedNegativeReasonId,
  NegativeReasonId,
  UserWorkRecord,
} from "@/domain/profile/types";
import { FACTOR_PENALTY_AMOUNTS, FACTOR_PENALTY_GROUPS } from "@/domain/recommendation/constants";
import {
  calculateNegativePenalties,
  type CalculateNegativePenaltiesInput,
} from "@/domain/recommendation/penalty";
import { workSimilarity } from "@/domain/recommendation/similarity";
import { createTestAxes, createTestWork } from "../../helpers/catalog";
import { createTestRecord } from "../../helpers/recommendation";

type AxisNegativeReasonId = Exclude<
  FactorBackedNegativeReasonId,
  "artStyleDislike" | "genericStory"
>;

type AxisReasonFixture = {
  reasonId: AxisNegativeReasonId;
  match: Partial<Record<AxisId, AxisFactor>>;
  nonMatch: Partial<Record<AxisId, AxisFactor>>;
  unknown: Partial<Record<AxisId, AxisFactor>>;
};

const known = (value: 0 | 1 | 2 | 3 | 4): AxisFactor => ({
  state: "known",
  value,
  confidence: 0.9,
});
const unknown: AxisFactor = { state: "unknown" };

const AXIS_REASON_FIXTURES: readonly AxisReasonFixture[] = [
  {
    reasonId: "tooSlow",
    match: { pacing: known(1) },
    nonMatch: { pacing: known(2) },
    unknown: { pacing: unknown },
  },
  {
    reasonId: "tooRepetitiveProgression",
    match: { progression: known(4), problemSolving: known(1) },
    nonMatch: { progression: known(4), problemSolving: known(2) },
    unknown: { progression: known(4), problemSolving: unknown },
  },
  {
    reasonId: "tooDark",
    match: { darkness: known(3) },
    nonMatch: { darkness: known(2) },
    unknown: { darkness: unknown },
  },
  {
    reasonId: "tooStressful",
    match: { mentalStress: known(3) },
    nonMatch: { mentalStress: known(2) },
    unknown: { mentalStress: unknown },
  },
  {
    reasonId: "tooMuchRomance",
    match: { romance: known(3) },
    nonMatch: { romance: known(2) },
    unknown: { romance: unknown },
  },
  {
    reasonId: "tooMuchComedy",
    match: { comedy: known(3) },
    nonMatch: { comedy: known(2) },
    unknown: { comedy: unknown },
  },
  {
    reasonId: "notEnoughSeriousness",
    match: { darkness: known(1), mentalStress: known(1) },
    nonMatch: { darkness: known(2), mentalStress: known(1) },
    unknown: { darkness: known(1), mentalStress: unknown },
  },
  {
    reasonId: "tooComplex",
    match: { worldBuilding: known(4), relationshipStructure: unknown },
    nonMatch: { worldBuilding: known(3), relationshipStructure: known(3) },
    unknown: { worldBuilding: unknown, relationshipStructure: unknown },
  },
  {
    reasonId: "powerInflation",
    match: { progression: known(4) },
    nonMatch: { progression: known(3) },
    unknown: { progression: unknown },
  },
];

function negativeRecord(
  workId: string,
  reasons: readonly NegativeReasonId[],
  droppedReasons: readonly NegativeReasonId[] = [],
): UserWorkRecord {
  return createTestRecord({
    workId,
    readingState: "completed",
    reaction: "disliked",
    negativeReasons: [...reasons],
    droppedReasons: [...droppedReasons],
  });
}

function workMap(works: readonly Work[]) {
  return Object.fromEntries(works.map((work) => [work.id, work]));
}

function calculate(
  candidate: Work,
  negativeRecords: readonly UserWorkRecord[],
  sources: readonly Work[],
  bestAnchor = createTestWork({ id: "best-anchor" }),
) {
  const input: CalculateNegativePenaltiesInput = {
    candidate,
    bestAnchor,
    negativeRecords,
    worksById: workMap(sources),
  };
  return calculateNegativePenalties(input);
}

describe("factor-backed negative reasons", () => {
  it.each(AXIS_REASON_FIXTURES)(
    "applies $reasonId exactly once at its matching boundary",
    ({ match, reasonId }) => {
      const source = createTestWork({ id: "negative-source" });
      const candidate = createTestWork({
        id: "candidate",
        axes: createTestAxes(match),
      });
      const result = calculate(candidate, [negativeRecord(source.id, [reasonId])], [source]);
      const amount = FACTOR_PENALTY_AMOUNTS[reasonId];

      expect(result).toEqual({
        factorPenalty: amount,
        vaguePenalty: 0,
        totalPenalty: amount,
        contributions: [
          {
            source: "penalty",
            group: FACTOR_PENALTY_GROUPS[reasonId],
            factorId: reasonId,
            value: -amount,
            anchorWorkIds: [source.id],
            negativeReasonId: reasonId,
            explainable: true,
          },
        ],
        penaltiesApplied: [reasonId],
      });
    },
  );

  it.each(AXIS_REASON_FIXTURES)(
    "does not apply $reasonId when its predicate does not match",
    ({ nonMatch, reasonId }) => {
      const source = createTestWork({ id: "negative-source" });
      const candidate = createTestWork({
        id: "candidate",
        axes: createTestAxes(nonMatch),
      });

      expect(calculate(candidate, [negativeRecord(source.id, [reasonId])], [source])).toEqual({
        factorPenalty: 0,
        vaguePenalty: 0,
        totalPenalty: 0,
        contributions: [],
        penaltiesApplied: [],
      });
    },
  );

  it.each(AXIS_REASON_FIXTURES)(
    "does not turn unknown axes into a $reasonId penalty",
    ({ reasonId, unknown: unknownAxes }) => {
      const source = createTestWork({ id: "negative-source" });
      const candidate = createTestWork({
        id: "candidate",
        axes: createTestAxes(unknownAxes),
      });

      expect(calculate(candidate, [negativeRecord(source.id, [reasonId])], [source])).toEqual({
        factorPenalty: 0,
        vaguePenalty: 0,
        totalPenalty: 0,
        contributions: [],
        penaltiesApplied: [],
      });
    },
  );

  it("uses the coverage-adjusted Art score and includes the exact triggering sources", () => {
    const candidateAtBoundary = createTestWork({
      id: "candidate",
      axes: createTestAxes({ artRealism: known(0) }),
    });
    const matchingZ = createTestWork({
      id: "source-z",
      axes: createTestAxes({ artRealism: known(4) }),
    });
    const matchingA = createTestWork({
      id: "source-a",
      axes: createTestAxes({ artRealism: known(4) }),
    });
    const belowThreshold = createTestWork({
      id: "source-below",
      axes: createTestAxes({ artRealism: known(4), artDensity: known(4) }),
    });
    const records = [matchingZ, belowThreshold, matchingA].map((source) =>
      negativeRecord(source.id, ["artStyleDislike"]),
    );
    const result = calculate(candidateAtBoundary, records, [matchingZ, belowThreshold, matchingA]);

    expect(result.factorPenalty).toBe(0.08);
    expect(result.penaltiesApplied).toEqual(["artStyleDislike"]);
    expect(result.contributions).toEqual([
      expect.objectContaining({
        group: "art",
        factorId: "artStyleDislike",
        value: -0.08,
        anchorWorkIds: ["source-a", "source-z"],
      }),
    ]);
  });

  it("does not apply artStyleDislike below threshold or when the Art group is unknown", () => {
    const source = createTestWork({
      id: "negative-source",
      axes: createTestAxes({ artRealism: known(4), artDensity: known(4) }),
    });
    const below = createTestWork({
      id: "candidate-below",
      axes: createTestAxes({ artRealism: known(0), artDensity: known(0) }),
    });
    const allUnknown = Object.fromEntries(ART_AXIS_IDS.map((axisId) => [axisId, unknown]));
    const unknownCandidate = createTestWork({
      id: "candidate-unknown",
      axes: createTestAxes(allUnknown),
    });
    const record = negativeRecord(source.id, ["artStyleDislike"]);

    expect(calculate(below, [record], [source]).penaltiesApplied).toEqual([]);
    expect(calculate(unknownCandidate, [record], [source]).penaltiesApplied).toEqual([]);
  });

  it("applies artStyleDislike at the decimal-sensitive exact 0.75 boundary", () => {
    const zeroWeightArt = {
      artDensity: { state: "known" as const, value: 2 as const, confidence: 0 },
      visualSoftness: { state: "known" as const, value: 2 as const, confidence: 0 },
      motionImpact: { state: "known" as const, value: 2 as const, confidence: 0 },
    };
    const candidate = createTestWork({
      id: "candidate",
      axes: createTestAxes({
        artRealism: { state: "known", value: 0, confidence: 0.7 },
        ...zeroWeightArt,
      }),
    });
    const source = createTestWork({
      id: "negative-source",
      axes: createTestAxes({
        artRealism: { state: "known", value: 1, confidence: 0.7 },
        ...zeroWeightArt,
      }),
    });

    expect(
      calculate(candidate, [negativeRecord(source.id, ["artStyleDislike"])], [source])
        .factorPenalty,
    ).toBe(0.08);
  });

  it("requires candidate and best anchor to match the same genericStory source", () => {
    const adventure: ThemeFactor[] = [{ id: "adventure", centrality: 2, confidence: 0.9 }];
    const combat: ThemeFactor[] = [{ id: "combat", centrality: 2, confidence: 0.9 }];
    const candidate = createTestWork({ id: "candidate", themes: adventure });
    const bestAnchor = createTestWork({ id: "best-anchor", themes: combat });
    const candidateOnlySource = createTestWork({ id: "source-a", themes: adventure });
    const anchorOnlySource = createTestWork({ id: "source-b", themes: combat });
    const records = [candidateOnlySource, anchorOnlySource].map((source) =>
      negativeRecord(source.id, ["genericStory"]),
    );

    expect(
      calculate(candidate, records, [candidateOnlySource, anchorOnlySource], bestAnchor),
    ).toEqual({
      factorPenalty: 0,
      vaguePenalty: 0,
      totalPenalty: 0,
      contributions: [],
      penaltiesApplied: [],
    });
  });

  it("applies genericStory once and sorts every same-source match id", () => {
    const sourceZ = createTestWork({ id: "source-z" });
    const sourceA = createTestWork({ id: "source-a" });
    const candidate = createTestWork({ id: "candidate" });
    const result = calculate(
      candidate,
      [negativeRecord(sourceZ.id, ["genericStory"]), negativeRecord(sourceA.id, ["genericStory"])],
      [sourceZ, sourceA],
    );

    expect(result.factorPenalty).toBe(0.08);
    expect(result.penaltiesApplied).toEqual(["genericStory"]);
    expect(result.contributions[0]).toEqual(
      expect.objectContaining({
        group: "theme",
        anchorWorkIds: ["source-a", "source-z"],
        negativeReasonId: "genericStory",
      }),
    );
  });

  it("does not apply genericStory for a nonmatching or unannotated candidate Theme group", () => {
    const source = createTestWork({ id: "negative-source" });
    const nonMatch = createTestWork({
      id: "candidate-nonmatch",
      themes: [{ id: "combat", centrality: 2, confidence: 0.9 }],
    });
    const unknownTheme = createTestWork({ id: "candidate-unknown", themes: [] });
    const record = negativeRecord(source.id, ["genericStory"]);

    expect(calculate(nonMatch, [record], [source]).penaltiesApplied).toEqual([]);
    expect(calculate(unknownTheme, [record], [source]).penaltiesApplied).toEqual([]);
  });

  it("applies genericStory at 0.7 and rejects the nearest lower weighted fixture", () => {
    const theme = (id: ThemeFactor["id"], centrality: 1 | 2): ThemeFactor => ({
      id,
      centrality,
      confidence: 0.9,
    });
    const exactSource = createTestWork({
      id: "exact-source",
      themes: [theme("adventure", 2), theme("combat", 2), theme("martialArts", 2), theme("war", 1)],
    });
    const exactCandidate = createTestWork({
      id: "exact-candidate",
      themes: [...exactSource.themes, theme("politics", 2), theme("survival", 1)],
    });
    const belowSource = createTestWork({
      id: "below-source",
      themes: [
        theme("adventure", 2),
        theme("combat", 2),
        theme("martialArts", 2),
        theme("war", 2),
        theme("politics", 1),
      ],
    });
    const belowCandidate = createTestWork({
      id: "below-candidate",
      themes: [...belowSource.themes, theme("survival", 2), theme("investigation", 2)],
    });

    expect(
      calculate(
        exactCandidate,
        [negativeRecord(exactSource.id, ["genericStory"])],
        [exactSource],
        exactCandidate,
      ).factorPenalty,
    ).toBe(0.08);
    expect(
      calculate(
        belowCandidate,
        [negativeRecord(belowSource.id, ["genericStory"])],
        [belowSource],
        belowCandidate,
      ).factorPenalty,
    ).toBe(0);
  });
});

describe("negative reason aggregation", () => {
  it("deduplicates factor reasons globally and produces input-order-independent source ids", () => {
    const candidate = createTestWork({
      id: "candidate",
      axes: createTestAxes({ darkness: known(4) }),
    });
    const sourceZ = createTestWork({ id: "source-z" });
    const sourceA = createTestWork({ id: "source-a" });
    const records = [
      negativeRecord(sourceZ.id, ["tooDark", "tooDark"], ["tooDark"]),
      negativeRecord(sourceA.id, ["tooDark"]),
    ];
    const forward = calculate(candidate, records, [sourceZ, sourceA]);
    const reversed = calculate(candidate, [...records].reverse(), [sourceA, sourceZ]);

    expect(forward).toEqual(reversed);
    expect(forward.factorPenalty).toBe(0.1);
    expect(forward.penaltiesApplied).toEqual(["tooDark"]);
    expect(forward.contributions[0]?.anchorWorkIds).toEqual(["source-a", "source-z"]);
  });

  it("proportionally scales the reasoned total to 0.25 without enum-order priority", () => {
    const candidate = createTestWork({
      id: "candidate",
      axes: createTestAxes({
        pacing: known(1),
        darkness: known(4),
        mentalStress: known(4),
      }),
    });
    const sources = ["slow-source", "dark-source", "stress-source"].map((id) =>
      createTestWork({ id }),
    );
    const records = [
      negativeRecord("stress-source", ["tooStressful"]),
      negativeRecord("dark-source", ["tooDark"]),
      negativeRecord("slow-source", ["tooSlow"]),
    ];
    const result = calculate(candidate, records, sources);

    expect(result.factorPenalty).toBe(0.25);
    expect(result.penaltiesApplied).toEqual(["tooSlow", "tooDark", "tooStressful"]);
    expect(result.contributions.map(({ value }) => value)).toEqual([
      -0.09375, -0.078125, -0.078125,
    ]);
    expect(-result.contributions.reduce((sum, contribution) => sum + contribution.value, 0)).toBe(
      0.25,
    );
  });

  it("ignores external reasons while preserving a factor reason on the same record", () => {
    const candidate = createTestWork({
      id: "candidate",
      axes: createTestAxes({ darkness: known(4) }),
    });
    const source = createTestWork({ id: "negative-source" });
    const factorResult = calculate(
      candidate,
      [negativeRecord(source.id, ["external:hiatus", "tooDark"])],
      [source],
    );
    const externalOnlyResult = calculate(
      candidate,
      [negativeRecord(source.id, ["external:hiatus"])],
      [source],
    );

    expect(factorResult.penaltiesApplied).toEqual(["tooDark"]);
    expect(factorResult.factorPenalty).toBe(0.1);
    expect(externalOnlyResult).toEqual({
      factorPenalty: 0,
      vaguePenalty: 0,
      totalPenalty: 0,
      contributions: [],
      penaltiesApplied: [],
    });
  });

  it("keeps an axis reason source id when the source Work is not needed by its predicate", () => {
    const candidate = createTestWork({
      id: "candidate",
      axes: createTestAxes({ darkness: known(4) }),
    });

    expect(calculate(candidate, [negativeRecord("stale-work", ["tooDark"])], [])).toEqual({
      factorPenalty: 0.1,
      vaguePenalty: 0,
      totalPenalty: 0.1,
      contributions: [
        {
          source: "penalty",
          group: "tone",
          factorId: "tooDark",
          value: -0.1,
          anchorWorkIds: ["stale-work"],
          negativeReasonId: "tooDark",
          explainable: true,
        },
      ],
      penaltiesApplied: ["tooDark"],
    });
  });

  it("does not treat an inherited object key as a vague source Work", () => {
    const candidate = createTestWork({ id: "candidate" });

    expect(calculate(candidate, [negativeRecord("constructor", ["vagueDislike"])], [])).toEqual({
      factorPenalty: 0,
      vaguePenalty: 0,
      totalPenalty: 0,
      contributions: [],
      penaltiesApplied: [],
    });
  });
});

describe("vague dislike", () => {
  it("scales a fractional source similarity instead of applying a flat amount", () => {
    const candidate = createTestWork({ id: "candidate" });
    const source = createTestWork({
      id: "fractional-source",
      axes: createTestAxes({ pacing: known(0) }),
    });
    const similarity = workSimilarity(candidate, source).score;
    const result = calculate(candidate, [negativeRecord(source.id, ["vagueDislike"])], [source]);

    expect(similarity).toBeGreaterThan(0);
    expect(similarity).toBeLessThan(1);
    expect(result.vaguePenalty).toBeCloseTo(similarity * 0.08, 12);
    expect(result.vaguePenalty).toBeLessThan(0.08);
  });

  it("uses max similarity and resolves an exact source tie by work id", () => {
    const candidate = createTestWork({ id: "candidate" });
    const sourceB = createTestWork({ id: "source-b" });
    const sourceA = createTestWork({ id: "source-a" });
    const unlike = createTestWork({
      id: "source-unlike",
      genres: ["romance"],
      themes: [{ id: "combat", centrality: 2, confidence: 0.9 }],
      axes: createTestAxes(Object.fromEntries(AXIS_IDS.map((axisId) => [axisId, known(0)]))),
    });
    const records = [sourceB, unlike, sourceA].map((source) =>
      negativeRecord(source.id, ["vagueDislike"]),
    );
    const result = calculate(candidate, records, [sourceB, unlike, sourceA]);

    expect(result.factorPenalty).toBe(0);
    expect(result.vaguePenalty).toBe(0.08);
    expect(result.totalPenalty).toBe(0.08);
    expect(result.penaltiesApplied).toEqual(["vagueDislike"]);
    expect(result.contributions).toEqual([
      {
        source: "penalty",
        group: "overall",
        factorId: "vagueDislike",
        value: -0.08,
        anchorWorkIds: ["source-a"],
        negativeReasonId: "vagueDislike",
        explainable: false,
      },
    ]);
  });

  it("resolves a mathematically equal decimal max similarity by work id", () => {
    const candidate = createTestWork({ id: "candidate" });
    const sourceA = createTestWork({
      id: "source-a",
      genres: ["action"],
      themes: [{ id: "adventure", centrality: 1, confidence: 1 }],
      axes: createTestAxes({
        artRealism: { state: "known", value: 0, confidence: 1 },
        artDensity: { state: "known", value: 0, confidence: 1 },
        visualSoftness: { state: "known", value: 0, confidence: 1 },
        motionImpact: { state: "known", value: 0, confidence: 1 },
      }),
    });
    const sourceZ = createTestWork({
      id: "source-z",
      themes: [{ id: "adventure", centrality: 1, confidence: 1 }],
      axes: createTestAxes({
        progression: { state: "known", value: 4, confidence: 1 },
        problemSolving: { state: "known", value: 4, confidence: 1 },
        worldBuilding: { state: "unknown" },
        characterArcWeight: { state: "known", value: 4, confidence: 1 },
        relationshipStructure: { state: "known", value: 4, confidence: 1 },
        comedy: { state: "known", value: 4, confidence: 1 },
        darkness: { state: "known", value: 4, confidence: 1 },
        mentalStress: { state: "known", value: 4, confidence: 1 },
        romance: { state: "known", value: 4, confidence: 1 },
        emotionalWarmth: { state: "known", value: 4, confidence: 1 },
        artRealism: { state: "known", value: 4, confidence: 1 },
        artDensity: { state: "known", value: 4, confidence: 1 },
        visualSoftness: { state: "known", value: 4, confidence: 1 },
        motionImpact: { state: "known", value: 4, confidence: 1 },
      }),
    });
    const result = calculate(
      candidate,
      [negativeRecord(sourceZ.id, ["vagueDislike"]), negativeRecord(sourceA.id, ["vagueDislike"])],
      [sourceZ, sourceA],
    );

    expect(workSimilarity(candidate, sourceA).score).toBeCloseTo(0.65, 12);
    expect(workSimilarity(candidate, sourceZ).score).toBeCloseTo(0.65, 12);
    expect(result.contributions[0]?.anchorWorkIds).toEqual(["source-a"]);
  });

  it("preserves a real vague max difference smaller than output precision", () => {
    const candidate = createTestWork({
      id: "candidate",
      axes: createTestAxes({
        progression: { state: "known", value: 0, confidence: 1 },
        problemSolving: { state: "known", value: 0, confidence: 1 },
      }),
    });
    const sourceA = createTestWork({
      id: "source-a",
      axes: createTestAxes({
        progression: { state: "known", value: 0, confidence: 0.5 },
        problemSolving: { state: "known", value: 4, confidence: 0.5 },
      }),
    });
    const sourceZ = createTestWork({
      id: "source-z",
      axes: createTestAxes({
        progression: { state: "known", value: 0, confidence: 0.500000000001 },
        problemSolving: { state: "known", value: 4, confidence: 0.5 },
      }),
    });
    const scoreA = workSimilarity(candidate, sourceA).score;
    const scoreZ = workSimilarity(candidate, sourceZ).score;
    const result = calculate(
      candidate,
      [negativeRecord(sourceA.id, ["vagueDislike"]), negativeRecord(sourceZ.id, ["vagueDislike"])],
      [sourceA, sourceZ],
    );

    expect(scoreZ).toBeGreaterThan(scoreA);
    expect(scoreZ - scoreA).toBeLessThan(1e-12);
    expect(result.contributions[0]?.anchorWorkIds).toEqual(["source-z"]);
  });

  it("uses a raw-score leader cohort for a vague non-transitive tolerance chain", () => {
    const candidate = createTestWork({
      id: "candidate",
      axes: createTestAxes({
        progression: { state: "known", value: 0, confidence: 1 },
        problemSolving: { state: "known", value: 0, confidence: 1 },
      }),
    });
    const sourceWithConfidence = (id: string, confidence: number) =>
      createTestWork({
        id,
        axes: createTestAxes({
          progression: { state: "known", value: 0, confidence },
          problemSolving: { state: "known", value: 4, confidence: 0.5 },
        }),
      });
    const sources = [
      sourceWithConfidence("source-a", 0.5),
      sourceWithConfidence("source-b", 0.5000000000001),
      sourceWithConfidence("source-c", 0.5000000000002),
    ];
    const result = calculate(
      candidate,
      sources.map((source) => negativeRecord(source.id, ["vagueDislike"])),
      sources,
    );

    expect(result.contributions[0]?.anchorWorkIds).toEqual(["source-b"]);
  });

  it("accepts a deduplicated vague-only record but rejects factor/external mixtures", () => {
    const candidate = createTestWork({
      id: "candidate",
      axes: createTestAxes({ darkness: known(4) }),
    });
    const vagueOnly = createTestWork({ id: "vague-only" });
    const mixedFactor = createTestWork({ id: "mixed-factor" });
    const mixedExternal = createTestWork({ id: "mixed-external" });

    const duplicateVagueResult = calculate(
      candidate,
      [negativeRecord(vagueOnly.id, ["vagueDislike"], ["vagueDislike"])],
      [vagueOnly],
    );
    const mixedFactorResult = calculate(
      candidate,
      [negativeRecord(mixedFactor.id, ["vagueDislike", "tooDark"])],
      [mixedFactor],
    );
    const mixedExternalResult = calculate(
      candidate,
      [negativeRecord(mixedExternal.id, ["vagueDislike", "external:hiatus"])],
      [mixedExternal],
    );

    expect(duplicateVagueResult.penaltiesApplied).toEqual(["vagueDislike"]);
    expect(mixedFactorResult.factorPenalty).toBe(0.1);
    expect(mixedFactorResult.vaguePenalty).toBe(0);
    expect(mixedFactorResult.penaltiesApplied).toEqual(["tooDark"]);
    expect(mixedExternalResult.penaltiesApplied).toEqual([]);
    expect(mixedExternalResult.vaguePenalty).toBe(0);
  });

  it("applies vague outside the 0.25 factor cap when it comes from a separate vague-only record", () => {
    const candidate = createTestWork({
      id: "candidate",
      axes: createTestAxes({
        pacing: known(1),
        darkness: known(4),
        mentalStress: known(4),
      }),
    });
    const vagueSource = createTestWork({
      id: "vague-source",
      axes: candidate.axes,
    });
    const factorSources = ["slow-source", "dark-source", "stress-source"].map((id) =>
      createTestWork({ id }),
    );
    const records = [
      negativeRecord("slow-source", ["tooSlow"]),
      negativeRecord("dark-source", ["tooDark"]),
      negativeRecord("stress-source", ["tooStressful"]),
      negativeRecord(vagueSource.id, ["vagueDislike"]),
    ];
    const result = calculate(candidate, records, [...factorSources, vagueSource]);

    expect(result.factorPenalty).toBe(0.25);
    expect(result.vaguePenalty).toBe(0.08);
    expect(result.totalPenalty).toBe(0.33);
    expect(result.penaltiesApplied).toEqual(["tooSlow", "tooDark", "tooStressful", "vagueDislike"]);
  });
});
