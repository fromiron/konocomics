import { describe, expect, it } from "vitest";

import type { AxisFactor, ScaleValue, Work } from "@/domain/catalog/types";
import { selectContrastingWorks, type ContrastAxisId } from "@/domain/recommendation/contrast";
import { createTestAxes, createTestWork } from "../../helpers/catalog";

const known = (value: ScaleValue): AxisFactor => ({ state: "known", value, confidence: 0.9 });
const unknown: AxisFactor = { state: "unknown" };

function workWith(id: string, axes: Partial<Record<ContrastAxisId, AxisFactor>>): Work {
  return createTestWork({
    id,
    axes: {
      ...createTestAxes(),
      pacing: unknown,
      comedy: unknown,
      darkness: unknown,
      mentalStress: unknown,
      romance: unknown,
      ...axes,
    },
  });
}

function ineligible(work: Work): Work {
  return {
    ...work,
    eligibility: { onboardingEligible: false, recommendationEligible: false, libraryOnly: true },
  };
}

describe("contrasting work selection", () => {
  it("preserves known zero and returns actual differences while averaging every observed axis", () => {
    const source = workWith("source", {
      pacing: known(4),
      comedy: known(0),
      darkness: known(0),
      mentalStress: known(2),
      romance: known(1),
    });
    const candidate = workWith("candidate", {
      pacing: known(2),
      comedy: known(2),
      darkness: known(2),
      mentalStress: known(2),
      romance: known(2),
    });

    const result = selectContrastingWorks({ source, candidates: [candidate] });

    expect(result).toHaveLength(1);
    expect(result[0]?.work).toBe(candidate);
    expect(result[0]?.observedCount).toBe(5);
    // The unchanged stress axis and the one-step romance difference still enter the mean.
    expect(result[0]?.distance).toBeCloseTo(0.4, 12);
    expect(result[0]?.contributions).toEqual([
      { axisId: "darkness", sourceValue: 0, targetValue: 2, direction: "higher", distance: 0.75 },
      { axisId: "pacing", sourceValue: 4, targetValue: 2, direction: "lower", distance: 0.5 },
      { axisId: "comedy", sourceValue: 0, targetValue: 2, direction: "higher", distance: 0.5 },
    ]);
  });

  it("orders all qualifying evidence by distance, raw difference, then the specified axis order", () => {
    const source = workWith("source", {
      pacing: known(4),
      comedy: known(0),
      darkness: known(0),
      mentalStress: known(4),
      romance: known(0),
    });
    const candidate = workWith("candidate", {
      pacing: known(1),
      comedy: known(3),
      darkness: known(2),
      mentalStress: known(0),
      romance: known(4),
    });

    const result = selectContrastingWorks({ source, candidates: [candidate] });

    expect(result[0]?.contributions.map(({ axisId }) => axisId)).toEqual([
      "mentalStress",
      "romance",
      "pacing",
      "comedy",
      "darkness",
    ]);
    expect(result[0]?.contributions).toHaveLength(5);
  });

  it.each([{ state: "unknown" }, { state: "notApplicable" }] as const)(
    "does not turn $state values on either side into zero or count other axes for coverage",
    (missing) => {
      const source = workWith("source", {
        pacing: known(4),
        comedy: known(0),
        darkness: known(4),
      });
      const candidate = workWith("candidate", {
        pacing: known(0),
        comedy: known(4),
        darkness: missing,
      });
      expect(selectContrastingWorks({ source, candidates: [candidate] })).toEqual([]);

      const incompleteSource = workWith("source", {
        pacing: known(4),
        comedy: known(0),
        darkness: missing,
      });
      const completeCandidate = workWith("candidate", {
        pacing: known(0),
        comedy: known(4),
        darkness: known(0),
      });
      expect(
        selectContrastingWorks({ source: incompleteSource, candidates: [completeCandidate] }),
      ).toEqual([]);
    },
  );

  it("requires two raw differences of at least two among at least three known pairs", () => {
    const source = workWith("source", {
      pacing: known(4),
      comedy: known(0),
      darkness: known(4),
    });
    const qualifies = workWith("qualifies", {
      pacing: known(2),
      comedy: known(2),
      darkness: known(4),
    });
    const onlyOneDifference = workWith("one", {
      pacing: known(3),
      comedy: known(2),
      darkness: known(3),
    });

    const result = selectContrastingWorks({ source, candidates: [onlyOneDifference, qualifies] });

    expect(result.map(({ work }) => work.id)).toEqual(["qualifies"]);
    expect(result[0]?.observedCount).toBe(3);
    expect(result[0]?.contributions).toHaveLength(2);
    expect(selectContrastingWorks({ source, candidates: [onlyOneDifference] })).toEqual([]);
    expect(selectContrastingWorks({ source, candidates: [] })).toEqual([]);
  });

  it("requires recommendation eligibility on the source and each candidate", () => {
    const source = workWith("source", {
      pacing: known(4),
      comedy: known(0),
      darkness: known(4),
    });
    const candidate = workWith("candidate", {
      pacing: known(0),
      comedy: known(4),
      darkness: known(0),
    });

    expect(selectContrastingWorks({ source: ineligible(source), candidates: [candidate] })).toEqual(
      [],
    );
    expect(selectContrastingWorks({ source, candidates: [ineligible(candidate)] })).toEqual([]);
    expect(selectContrastingWorks({ source, candidates: [candidate] })).toHaveLength(1);
  });

  it("excludes the current work ID and caller-supplied IDs without changing its inputs", () => {
    const source = workWith("source", {
      pacing: known(4),
      comedy: known(0),
      darkness: known(4),
    });
    const contrastingAxes = { pacing: known(0), comedy: known(4), darkness: known(0) };
    const candidates = Object.freeze([
      workWith("source", contrastingAxes),
      workWith("excluded", contrastingAxes),
      workWith("remaining", contrastingAxes),
    ]);
    const excludedWorkIds = Object.freeze(["excluded"]);
    const before = structuredClone({ source, candidates, excludedWorkIds });

    const result = selectContrastingWorks({ source, candidates, excludedWorkIds });

    expect(result.map(({ work }) => work.id)).toEqual(["remaining"]);
    expect({ source, candidates, excludedWorkIds }).toEqual(before);
  });

  it("ranks by observed mean distance, then coverage, then work ID regardless of input order", () => {
    const source = workWith("source", {
      pacing: known(0),
      comedy: known(0),
      darkness: known(0),
      mentalStress: known(0),
      romance: known(0),
    });
    const fullyContrasting = {
      pacing: known(4),
      comedy: known(4),
      darkness: known(4),
      mentalStress: known(4),
      romance: known(4),
    };
    const candidates = Object.freeze([
      workWith("a-four", { ...fullyContrasting, romance: unknown }),
      workWith("z-five", fullyContrasting),
      workWith("c-three", { ...fullyContrasting, mentalStress: unknown, romance: unknown }),
      workWith("b-five", fullyContrasting),
      workWith("a-closer", {
        pacing: known(2),
        comedy: known(2),
        darkness: known(2),
        mentalStress: known(2),
        romance: known(2),
      }),
    ]);

    const result = selectContrastingWorks({ source, candidates });

    expect(result.map(({ work }) => work.id)).toEqual([
      "b-five",
      "z-five",
      "a-four",
      "c-three",
      "a-closer",
    ]);
    expect(selectContrastingWorks({ source, candidates: [...candidates].reverse() })).toEqual(
      result,
    );
    expect(selectContrastingWorks({ source, candidates })).toEqual(result);
  });

  it("limits the deterministic result to six without filling a shorter valid list", () => {
    const source = workWith("source", { pacing: known(4), comedy: known(0), darkness: known(4) });
    const candidates = Array.from({ length: 8 }, (_, index) =>
      workWith(`candidate-${index}`, {
        pacing: known(0),
        comedy: known(4),
        darkness: known(0),
      }),
    );
    const result = selectContrastingWorks({ source, candidates: [...candidates].reverse() });

    expect(result.map(({ work }) => work.id)).toEqual([
      "candidate-0",
      "candidate-1",
      "candidate-2",
      "candidate-3",
      "candidate-4",
      "candidate-5",
    ]);
    expect(selectContrastingWorks({ source, candidates: candidates.slice(0, 1) })).toHaveLength(1);
  });
});
