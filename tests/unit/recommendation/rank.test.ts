import { describe, expect, it } from "vitest";

import type { CatalogV1, ThemeFactor, Work } from "@/domain/catalog/types";
import { rankRecommendations, filterEligibleCandidates } from "@/domain/recommendation/rank";
import type { RecommendationInput } from "@/domain/recommendation/types";
import { createTestAxes, createTestWork } from "../../helpers/catalog";
import {
  createTestAdjustments,
  createTestPolicies,
  createTestRecommendationContext,
  createTestRecord,
} from "../../helpers/recommendation";

function catalogWith(works: Work[], catalogVersion = "v1-rank-test"): CatalogV1 {
  return {
    schemaVersion: 1,
    catalogVersion,
    factorDictionaryVersion: "v1",
    works,
    volumes: [],
    representativeVolumeByWorkId: {},
  };
}

function inputWith(options: {
  works: Work[];
  records: RecommendationInput["records"];
  adjustments?: RecommendationInput["adjustments"];
  policies?: RecommendationInput["policies"];
}): RecommendationInput {
  const catalog = catalogWith(options.works);
  return {
    catalog,
    records: options.records,
    adjustments: options.adjustments ?? createTestAdjustments(),
    policies: options.policies ?? createTestPolicies(),
    context: createTestRecommendationContext(catalog.catalogVersion, {
      constraintByWorkId: Object.fromEntries(
        options.works.map((work) => [
          work.id,
          { workId: work.id, catalogRole: "bridge" as const, volumeCount: 1 },
        ]),
      ),
    }),
  };
}

describe("rank candidate eligibility", () => {
  it("excludes anchors, read, dropped, hidden, disliked, and ineligible works but keeps planned", () => {
    const ids = [
      "anchor",
      "reading",
      "completed",
      "dropped",
      "hidden",
      "disliked",
      "ineligible",
      "planned",
    ];
    const works = ids.map((id) =>
      createTestWork({
        id,
        eligibility:
          id === "ineligible"
            ? { onboardingEligible: true, recommendationEligible: false, libraryOnly: false }
            : undefined,
      }),
    );
    const records = [
      createTestRecord({ workId: "anchor", reaction: "liked", readingState: "completed" }),
      createTestRecord({ workId: "reading", reaction: "neutral", readingState: "reading" }),
      createTestRecord({ workId: "completed", reaction: "neutral", readingState: "completed" }),
      createTestRecord({ workId: "dropped", reaction: "neutral", readingState: "dropped" }),
      createTestRecord({ workId: "hidden", reaction: "neutral", readingState: "hidden" }),
      createTestRecord({ workId: "disliked", reaction: "disliked", readingState: "planned" }),
      createTestRecord({ workId: "planned", reaction: "neutral", readingState: "planned" }),
    ];

    expect(
      filterEligibleCandidates({
        works,
        records,
        adjustments: createTestAdjustments(),
        policies: createTestPolicies(),
      }).map((work) => work.id),
    ).toEqual(["planned"]);
  });

  it("applies incomplete, axis, and central Theme hard exclusions before scoring", () => {
    const theme = (centrality: 1 | 2): ThemeFactor[] => [
      { id: "combat", centrality, confidence: 0.9 },
    ];
    const works = [
      createTestWork({ id: "incomplete", status: "ongoing" }),
      createTestWork({
        id: "axis",
        axes: createTestAxes({ strategy: { state: "known", value: 3, confidence: 0.9 } }),
      }),
      createTestWork({ id: "central-theme", themes: theme(2) }),
      createTestWork({ id: "soft-theme", themes: theme(1) }),
      createTestWork({
        id: "unknown-axis",
        axes: createTestAxes({ strategy: { state: "unknown" } }),
      }),
    ];

    expect(
      filterEligibleCandidates({
        works,
        records: [],
        adjustments: createTestAdjustments({
          axes: { strategy: "exclude" },
          themes: { combat: "exclude" },
        }),
        policies: createTestPolicies({ excludeIncomplete: true }),
      }).map((work) => work.id),
    ).toEqual(["soft-theme", "unknown-axis"]);
  });
});

describe("rank recommendations", () => {
  it("returns no recommendations without a positive anchor", () => {
    const input = inputWith({ works: [createTestWork({ id: "candidate" })], records: [] });
    expect(rankRecommendations(input)).toEqual([]);
  });

  it("keeps a minority-taste candidate alive among eight anchors", () => {
    const majoritySignatures = [
      { genre: "action", theme: "adventure" },
      { genre: "fantasy", theme: "combat" },
      { genre: "historical", theme: "war" },
      { genre: "mystery", theme: "investigation" },
      { genre: "sports", theme: "sportsCompetition" },
      { genre: "comedy", theme: "cooking" },
      { genre: "sliceOfLife", theme: "workplace" },
    ] as const;
    const majorityAnchors = majoritySignatures.map((signature, index) =>
      createTestWork({
        id: `majority-anchor-${index}`,
        genres: [signature.genre],
        themes: [{ id: signature.theme, centrality: 2, confidence: 0.95 }],
      }),
    );
    const minorityAxes = createTestAxes(
      Object.fromEntries(
        Object.keys(createTestAxes()).map((axisId) => [
          axisId,
          { state: "known", value: 4, confidence: 0.95 },
        ]),
      ),
    );
    const minorityAnchor = createTestWork({
      id: "minority-anchor",
      genres: ["scienceFiction"],
      themes: [{ id: "exploration", centrality: 2, confidence: 0.95 }],
      axes: minorityAxes,
    });
    const minorityCandidate = createTestWork({
      id: "minority-candidate",
      genres: ["scienceFiction"],
      themes: [{ id: "exploration", centrality: 2, confidence: 0.95 }],
      axes: minorityAxes,
    });
    const majorityCandidates = Array.from({ length: 12 }, (_, index) => {
      const signature = majoritySignatures[index % majoritySignatures.length];
      if (signature === undefined) {
        throw new Error("Missing majority signature fixture.");
      }
      return createTestWork({
        id: `majority-candidate-${index}`,
        genres: [signature.genre],
        themes: [{ id: signature.theme, centrality: 2, confidence: 0.95 }],
      });
    });
    const records = [
      ...majorityAnchors.map((work) =>
        createTestRecord({ workId: work.id, reaction: "liked", readingState: "completed" }),
      ),
      createTestRecord({
        workId: minorityAnchor.id,
        reaction: "favorite",
        readingState: "completed",
      }),
    ];
    const input = inputWith({
      works: [...majorityAnchors, minorityAnchor, minorityCandidate, ...majorityCandidates],
      records,
    });

    const recommendations = rankRecommendations(input);
    expect(recommendations[0]).toMatchObject({
      workId: "minority-candidate",
      bestAnchorId: "minority-anchor",
    });
    expect(
      new Set(recommendations.slice(1).map((entry) => entry.bestAnchorId)).size,
    ).toBeGreaterThan(2);
  });

  it("ignores catalog-out records in anchors, confidence, and penalties", () => {
    const anchor = createTestWork({ id: "anchor" });
    const candidate = createTestWork({
      id: "candidate",
      axes: createTestAxes({ darkness: { state: "known", value: 4, confidence: 0.9 } }),
    });
    const baseRecord = createTestRecord({
      workId: anchor.id,
      reaction: "favorite",
      readingState: "completed",
    });
    const baseline = inputWith({ works: [anchor, candidate], records: [baseRecord] });
    const withExternalRecords = inputWith({
      works: [anchor, candidate],
      records: [
        baseRecord,
        createTestRecord({
          workId: "constructor",
          reaction: "favorite",
          readingState: "completed",
        }),
        createTestRecord({
          workId: "external-negative",
          reaction: "disliked",
          readingState: "completed",
          negativeReasons: ["tooDark"],
        }),
      ],
    });

    expect(rankRecommendations(withExternalRecords)).toEqual(rankRecommendations(baseline));
    expect(
      rankRecommendations(
        inputWith({
          works: [candidate],
          records: [
            createTestRecord({
              workId: "constructor",
              reaction: "favorite",
              readingState: "completed",
            }),
          ],
        }),
      ),
    ).toEqual([]);
  });

  it("produces a complete score ledger and applies completed preference before clamp", () => {
    const anchor = createTestWork({ id: "anchor" });
    const candidate = createTestWork({ id: "candidate", status: "ongoing" });
    const input = inputWith({
      works: [anchor, candidate],
      records: [
        createTestRecord({ workId: anchor.id, reaction: "liked", readingState: "completed" }),
      ],
      policies: createTestPolicies({ preferCompleted: true }),
    });
    const result = rankRecommendations(input)[0];

    expect(result).toBeDefined();
    expect(result?.tasteScore).toBe(0.75);
    expect(result?.contributions.some((entry) => entry.factorId === "preferCompleted")).toBe(true);
    expect(
      result?.contributions.reduce((sum, contribution) => sum + contribution.value, 0),
    ).toBeCloseTo(result?.tasteScore ?? 0, 10);
  });

  it("records the actually applied consensus bonus and supporter ids in the score ledger", () => {
    const candidate = createTestWork({ id: "candidate" });
    const bestAnchor = createTestWork({
      id: "anchor-best",
      axes: createTestAxes({
        progression: { state: "known", value: 4, confidence: 0.9 },
        problemSolving: { state: "known", value: 4, confidence: 0.9 },
        strategy: { state: "known", value: 4, confidence: 0.9 },
        pacing: { state: "known", value: 4, confidence: 0.9 },
        mysteryReveal: { state: "known", value: 4, confidence: 0.9 },
        worldBuilding: { state: "known", value: 4, confidence: 0.9 },
      }),
    });
    const supporter = createTestWork({ id: "anchor-supporter" });
    const input = inputWith({
      works: [bestAnchor, supporter, candidate],
      records: [
        createTestRecord({
          workId: bestAnchor.id,
          reaction: "favorite",
          readingState: "completed",
        }),
        createTestRecord({
          workId: supporter.id,
          reaction: "liked",
          readingState: "completed",
        }),
      ],
    });
    const result = rankRecommendations(input)[0];
    const consensus = result?.contributions.find((entry) => entry.source === "consensus");

    expect(result?.bestAnchorId).toBe(bestAnchor.id);
    expect(consensus).toEqual({
      source: "consensus",
      group: "overall",
      factorId: "consensus",
      value: 0.03,
      anchorWorkIds: [supporter.id],
      explainable: false,
    });
    expect(
      result?.contributions.reduce((sum, contribution) => sum + contribution.value, 0),
    ).toBeCloseTo(result?.tasteScore ?? 0, 10);
  });

  it("preserves a real Bayesian difference smaller than public score precision", () => {
    const anchor = createTestWork({ id: "anchor" });
    const candidateA = createTestWork({ id: "a" });
    const candidateZ = createTestWork({ id: "z" });
    const input = inputWith({
      works: [anchor, candidateA, candidateZ],
      records: [
        createTestRecord({
          workId: anchor.id,
          reaction: "favorite",
          readingState: "completed",
        }),
      ],
    });
    input.context.marketSnapshot.byWorkId = {
      a: { workId: "a", reviewAverage: 4, reviewCount: 1 },
      z: { workId: "z", reviewAverage: 4.000000000001, reviewCount: 1 },
    };

    expect(rankRecommendations(input).map((entry) => entry.workId)).toEqual(["z", "a"]);
  });

  it("treats mathematically equal Bayesian values with one-ULP drift as a tie", () => {
    const anchor = createTestWork({ id: "anchor" });
    const candidateA = createTestWork({ id: "a" });
    const candidateZ = createTestWork({ id: "z" });
    const input = inputWith({
      works: [anchor, candidateA, candidateZ],
      records: [
        createTestRecord({
          workId: anchor.id,
          reaction: "favorite",
          readingState: "completed",
        }),
      ],
    });
    input.context.marketSnapshot.byWorkId = {
      a: { workId: "a", reviewAverage: 0.14, reviewCount: 1 },
      z: { workId: "z", reviewAverage: 1.74, reviewCount: 2 },
    };

    expect(rankRecommendations(input).map((entry) => entry.workId)).toEqual(["a", "z"]);
  });

  it("preserves a real confidence difference smaller than public score precision", () => {
    const anchor = createTestWork({ id: "anchor" });
    const axesWithConfidence = (confidence: number) => {
      const axes = createTestAxes(
        Object.fromEntries(
          Object.keys(createTestAxes()).map((axisId) => [axisId, { state: "unknown" }]),
        ),
      );
      axes.progression = { state: "known", value: 2, confidence };
      return axes;
    };
    const evidence = { groupingConfidence: 0.5, sourceAgreement: 0.5 };
    const candidateA = createTestWork({
      id: "a",
      axes: axesWithConfidence(0.5),
      themes: [],
      evidence,
    });
    const candidateZ = createTestWork({
      id: "z",
      axes: axesWithConfidence(0.500000000001),
      themes: [],
      evidence,
    });
    const input = inputWith({
      works: [anchor, candidateA, candidateZ],
      records: [
        createTestRecord({
          workId: anchor.id,
          reaction: "favorite",
          readingState: "completed",
        }),
      ],
    });
    const recommendations = rankRecommendations(input);

    expect(recommendations.map((entry) => entry.workId)).toEqual(["z", "a"]);
    expect(recommendations[0]?.confidence).toBe(recommendations[1]?.confidence);
  });

  it("treats one-ULP confidence drift from equal factor multisets as a tie", () => {
    const anchor = createTestWork({ id: "anchor" });
    const axesWithOrderedConfidences = (confidences: readonly [number, number, number]) => {
      const axes = createTestAxes(
        Object.fromEntries(
          Object.keys(createTestAxes()).map((axisId) => [axisId, { state: "unknown" }]),
        ),
      );
      axes.progression = { state: "known", value: 2, confidence: confidences[0] };
      axes.problemSolving = { state: "known", value: 2, confidence: confidences[1] };
      axes.strategy = { state: "known", value: 2, confidence: confidences[2] };
      return axes;
    };
    const evidence = { groupingConfidence: 0, sourceAgreement: 0 };
    const candidateA = createTestWork({
      id: "a",
      axes: axesWithOrderedConfidences([1, 1e-16, 1e-16]),
      themes: [],
      evidence,
    });
    const candidateZ = createTestWork({
      id: "z",
      axes: axesWithOrderedConfidences([1e-16, 1e-16, 1]),
      themes: [],
      evidence,
    });
    const input = inputWith({
      works: [anchor, candidateA, candidateZ],
      records: [
        createTestRecord({
          workId: anchor.id,
          reaction: "favorite",
          readingState: "completed",
        }),
      ],
    });

    expect(rankRecommendations(input).map((entry) => entry.workId)).toEqual(["a", "z"]);
  });

  it("keeps equal work confidence when equal-weight evidence terms are swapped", () => {
    const anchor = createTestWork({ id: "anchor" });
    const axes = createTestAxes(
      Object.fromEntries(
        Object.keys(createTestAxes()).map((axisId) => [axisId, { state: "unknown" }]),
      ),
    );
    axes.progression = {
      state: "known",
      value: 2,
      confidence: 0.3187017763922877,
    };
    const candidateA = createTestWork({
      id: "a",
      axes,
      themes: [],
      evidence: {
        groupingConfidence: 0.4277680040921762,
        sourceAgreement: 0.14832389590009887,
      },
    });
    const candidateZ = createTestWork({
      id: "z",
      axes,
      themes: [],
      evidence: {
        groupingConfidence: 0.14832389590009887,
        sourceAgreement: 0.4277680040921762,
      },
    });
    const input = inputWith({
      works: [anchor, candidateA, candidateZ],
      records: [
        createTestRecord({
          workId: anchor.id,
          reaction: "favorite",
          readingState: "completed",
        }),
      ],
    });

    expect(rankRecommendations(input).map((entry) => entry.workId)).toEqual(["a", "z"]);
  });

  it("records the final score clamp as a non-explainable ledger entry", () => {
    const axes = createTestAxes({
      progression: { state: "known", value: 4, confidence: 0.9 },
      problemSolving: { state: "known", value: 4, confidence: 0.9 },
      strategy: { state: "known", value: 4, confidence: 0.9 },
    });
    const anchor = createTestWork({ id: "clamp-anchor", axes });
    const candidate = createTestWork({ id: "clamp-candidate", axes });
    const input = inputWith({
      works: [anchor, candidate],
      records: [
        createTestRecord({
          workId: anchor.id,
          reaction: "favorite",
          readingState: "completed",
        }),
      ],
      adjustments: createTestAdjustments({
        axes: { progression: "veryLike", problemSolving: "veryLike", strategy: "veryLike" },
      }),
    });
    const result = rankRecommendations(input)[0];
    const finalClamp = result?.contributions.find((entry) => entry.factorId === "finalClamp");

    expect(result?.tasteScore).toBe(1);
    expect(finalClamp).toMatchObject({ source: "clamp", explainable: false, value: -0.12 });
    expect(
      result?.contributions.reduce((sum, contribution) => sum + contribution.value, 0),
    ).toBeCloseTo(1, 10);
  });

  it("is fully deterministic across input permutations", () => {
    const anchor = createTestWork({
      id: "anchor-a",
      genres: ["fantasy", "action"],
      themes: [
        { id: "adventure", centrality: 2, confidence: 0.9 },
        { id: "combat", centrality: 1, confidence: 0.8 },
      ],
    });
    const secondAnchor = createTestWork({ id: "anchor-b" });
    const negativeSource = createTestWork({ id: "negative-source" });
    const candidates = Array.from({ length: 8 }, (_, index) =>
      createTestWork({
        id: `candidate-${index}`,
        genres: ["fantasy", "action"],
        themes: [
          { id: "adventure", centrality: 2, confidence: (index + 1) / 10 },
          { id: "combat", centrality: 1, confidence: (index + 2) / 10 },
        ],
        axes: createTestAxes({
          pacing: { state: "known", value: (index % 5) as 0 | 1 | 2 | 3 | 4, confidence: 0.9 },
        }),
      }),
    );
    const records = [
      createTestRecord({ workId: anchor.id, reaction: "favorite", readingState: "completed" }),
      createTestRecord({
        workId: secondAnchor.id,
        reaction: "liked",
        readingState: "completed",
      }),
      createTestRecord({
        workId: negativeSource.id,
        reaction: "disliked",
        readingState: "completed",
        negativeReasons: ["tooSlow", "tooDark"],
        droppedReasons: ["external:no-time", "vagueDislike"],
      }),
    ];
    const works = [anchor, secondAnchor, negativeSource, ...candidates];
    const first = inputWith({
      works,
      records,
      adjustments: createTestAdjustments({
        axes: { pacing: "less", darkness: "like" },
        themes: { adventure: "like", combat: "less" },
      }),
    });
    first.context.marketSnapshot.byWorkId = Object.fromEntries(
      candidates.map((work, index) => [
        work.id,
        { workId: work.id, reviewAverage: 3 + index / 10, reviewCount: index },
      ]),
    );
    const permutedWorks = [...works].reverse().map((work) => ({
      ...work,
      genres: [...work.genres].reverse(),
      themes: [...work.themes].reverse(),
    }));
    const permutedRecords = [...records].reverse().map((record) => ({
      ...record,
      negativeReasons:
        record.negativeReasons === undefined ? undefined : [...record.negativeReasons].reverse(),
      droppedReasons:
        record.droppedReasons === undefined ? undefined : [...record.droppedReasons].reverse(),
    }));
    const second = inputWith({
      works: permutedWorks,
      records: permutedRecords,
      adjustments: createTestAdjustments({
        axes: { darkness: "like", pacing: "less" },
        themes: { combat: "less", adventure: "like" },
      }),
    });
    second.context.marketSnapshot.byWorkId = Object.fromEntries(
      [...candidates].reverse().map((work, reverseIndex) => {
        const index = candidates.findIndex((candidate) => candidate.id === work.id);
        return [
          work.id,
          { workId: work.id, reviewAverage: 3 + index / 10, reviewCount: index + reverseIndex * 0 },
        ];
      }),
    );

    const firstResult = rankRecommendations(first);
    expect(rankRecommendations(first)).toEqual(firstResult);
    expect(rankRecommendations(second)).toEqual(firstResult);
  });

  it("rejects duplicate user records deterministically", () => {
    const anchor = createTestWork({ id: "anchor" });
    const record = createTestRecord({ workId: anchor.id, reaction: "liked" });
    const input = inputWith({ works: [anchor], records: [record, { ...record }] });
    expect(() => rankRecommendations(input)).toThrow("Duplicate user work record: anchor");
  });
});
