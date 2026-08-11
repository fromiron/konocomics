import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { buildG1ReplacementManifest } from "../../../scripts/build-g1-replacement";
import {
  NON_ART_AXIS_IDS,
  calculateReplacementDistance,
  selectReplacementPair,
} from "../../../scripts/catalog/g1-replacement";
import type {
  CohortProfile,
  NonArtAxisId,
  ReplacementContract,
  ReplacementProfile,
  ReplacementSlot,
} from "../../../scripts/catalog/g1-replacement";
import { NARRATIVE_AXIS_IDS } from "../../../src/domain/catalog/constants";
import type { ScaleValue } from "../../../src/domain/catalog/types";

const contract: ReplacementContract = {
  minimumSharedKnownNonArtAxes: 9,
  requiredNonArtGroups: ["narrative", "tone"],
  distanceWeights: { axis: 0.7, genre: 0.15, theme: 0.15 },
};

function factors(value: ScaleValue, axisIds: readonly NonArtAxisId[] = NON_ART_AXIS_IDS) {
  const result: ReplacementProfile["factors"] = {};
  for (const axisId of axisIds) {
    result[axisId] = value;
  }
  return result;
}

function profile(
  workId: string,
  overrides: Partial<Omit<ReplacementProfile, "workId">> = {},
): ReplacementProfile {
  return {
    workId,
    genres: ["action"],
    themes: [{ id: "adventure", centrality: 2 }],
    factors: factors(2),
    ...overrides,
  };
}

function cohortProfile(
  workId: string,
  overrides: Partial<Omit<CohortProfile, "workId">> = {},
): CohortProfile {
  return {
    ...profile(workId),
    demographic: "shonen",
    catalogRole: "bridge",
    onboardingEligible: false,
    ...overrides,
  };
}

function permutationFixture() {
  const originalCohort = [
    cohortProfile("removed-a", { demographic: "general", catalogRole: "discovery" }),
    cohortProfile("removed-b", { onboardingEligible: true, catalogRole: "anchor" }),
  ];
  const slots: ReplacementSlot[] = [
    {
      removedWorkId: "removed-a",
      demographic: "general",
      catalogRole: "discovery",
      onboardingEligible: false,
      minimumValidCandidates: 1,
      candidateWorkIds: ["left-zeta", "left-alpha"],
    },
    {
      removedWorkId: "removed-b",
      demographic: "shonen",
      catalogRole: "anchor",
      onboardingEligible: true,
      minimumValidCandidates: 1,
      candidateWorkIds: ["right-zeta", "right-alpha"],
    },
  ];
  const candidates = [
    profile("left-zeta"),
    profile("left-alpha"),
    profile("right-zeta"),
    profile("right-alpha"),
  ];
  return { originalCohort, slots, candidates, contract };
}

describe("G1 replacement selection", () => {
  it("matches the frozen two-slot selection and raw distance", () => {
    const manifest = buildG1ReplacementManifest(resolve(import.meta.dirname, "../../.."));

    expect(manifest.replacements.map((replacement) => replacement.selectedWorkId)).toEqual([
      "beyond-the-clouds",
      "noragami-stray-god",
    ]);
    expect(manifest.selectedPairRank).toBe(1);
    expect(manifest.pairRanking).toHaveLength(25);
    expect(manifest.pairRanking[0]?.totalDistance).toBe(0.8967307692307692);
  });

  it("is permutation-stable, ignores Art and market-shaped fields, and uses code-unit ties", () => {
    const fixture = permutationFixture();
    const expected = selectReplacementPair(fixture);
    const noisyCandidates = [...fixture.candidates].reverse().map((candidate, index) => ({
      ...candidate,
      factors: { ...candidate.factors, artRealism: index % 2 === 0 ? 0 : 4 },
      marketScore: 100 - index,
      reviewAverage: index,
    }));
    const permuted = selectReplacementPair({
      ...fixture,
      originalCohort: [...fixture.originalCohort].reverse(),
      slots: [...fixture.slots]
        .reverse()
        .map((slot) => ({ ...slot, candidateWorkIds: [...slot.candidateWorkIds].reverse() })),
      candidates: noisyCandidates,
    });

    expect(permuted).toEqual(expected);
    expect(permuted.pairRanking[0]?.candidateWorkIds).toEqual(["left-alpha", "right-alpha"]);
  });

  it("skips unknown axes and enforces the shared-known and group gates", () => {
    const removed = profile("removed");
    const tooFewKnown = profile("candidate", {
      factors: factors(2, NON_ART_AXIS_IDS.slice(0, 8)),
    });
    expect(calculateReplacementDistance(removed, tooFewKnown, contract)).toBeUndefined();

    const narrativeOnly = profile("candidate", {
      factors: factors(2, NARRATIVE_AXIS_IDS),
    });
    expect(
      calculateReplacementDistance(removed, narrativeOnly, {
        ...contract,
        minimumSharedKnownNonArtAxes: 1,
      }),
    ).toBeUndefined();
  });

  it("enforces slot inheritance and rejects a candidate duplicated across slots", () => {
    const fixture = permutationFixture();
    expect(() =>
      selectReplacementPair({
        ...fixture,
        slots: fixture.slots.map((slot, index) =>
          index === 0 ? { ...slot, demographic: "shonen" } : slot,
        ),
      }),
    ).toThrow(/Slot inheritance does not match/u);

    expect(() =>
      selectReplacementPair({
        ...fixture,
        slots: fixture.slots.map((slot, index) =>
          index === 1
            ? { ...slot, candidateWorkIds: [...slot.candidateWorkIds, "left-alpha"] }
            : slot,
        ),
      }),
    ).toThrow(/Duplicate candidate across replacement slots/u);
  });

  it("falls back when the nearest pair loses a genre, central theme, and occupied value bin", () => {
    const removedAFactors = factors(0);
    const retainedFactors = factors(0);
    retainedFactors.progression = 2;
    const nearFactors = factors(0);
    nearFactors.progression = 1;
    const safeFactors = factors(2);
    safeFactors.progression = 0;
    const originalCohort = [
      cohortProfile("removed-a", {
        factors: removedAFactors,
        genres: ["sports"],
        themes: [{ id: "survival", centrality: 2 }],
      }),
      cohortProfile("removed-b", {
        factors: factors(2),
        onboardingEligible: true,
        catalogRole: "anchor",
      }),
      cohortProfile("retained", { factors: retainedFactors }),
    ];
    const slots: ReplacementSlot[] = [
      {
        removedWorkId: "removed-a",
        demographic: "shonen",
        catalogRole: "bridge",
        onboardingEligible: false,
        minimumValidCandidates: 1,
        candidateWorkIds: ["left-near", "left-safe"],
      },
      {
        removedWorkId: "removed-b",
        demographic: "shonen",
        catalogRole: "anchor",
        onboardingEligible: true,
        minimumValidCandidates: 1,
        candidateWorkIds: ["right-only"],
      },
    ];
    const selection = selectReplacementPair({
      originalCohort,
      slots,
      candidates: [
        profile("left-near", { factors: nearFactors, themes: [] }),
        profile("left-safe", {
          factors: safeFactors,
          genres: ["sports"],
          themes: [{ id: "survival", centrality: 2 }],
        }),
        profile("right-only", { factors: factors(2) }),
      ],
      contract,
    });

    expect(selection.pairRanking[0]).toMatchObject({
      candidateWorkIds: ["left-near", "right-only"],
      diversityPassed: false,
    });
    expect(selection.pairRanking[0]?.diversityFailures).toEqual(
      expect.arrayContaining([
        "genres:sports",
        "central-themes:survival",
        "axis-extrema:progression",
        "axis-bins:progression:0",
      ]),
    );
    expect(selection.selectedPairRank).toBe(2);
    expect(selection.replacements[0]?.selectedWorkId).toBe("left-safe");
  });
});
