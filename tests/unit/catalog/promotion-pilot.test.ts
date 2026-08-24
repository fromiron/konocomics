import { describe, expect, it } from "vitest";

import {
  buildPromotionPilotArtifacts,
  derivePilotCandidateSha256,
  loadPromotionPilotInput,
  validateFrozenPromotionPilot,
  validatePilotWorkSet,
} from "../../../scripts/build-promotion-pilot";

describe("promotion pilot packet", () => {
  it("validates the frozen packet after its live works are promoted", () => {
    const input = loadPromotionPilotInput(process.cwd());
    const manifest = validateFrozenPromotionPilot(input);
    const pilotIds = new Set(manifest.workSet.workIds);
    const promotedInput = {
      ...input,
      works: input.works.map((work) =>
        pilotIds.has(work.id)
          ? {
              ...work,
              libraryOnly: false,
              onboardingEligible: true,
              recommendationEligible: true,
            }
          : work,
      ),
    };

    expect(validateFrozenPromotionPilot(promotedInput)).toEqual(manifest);
    expect(() => buildPromotionPilotArtifacts(promotedInput)).toThrow(
      "work is not isolated libraryOnly",
    );
    expect(manifest.workSet.workIds).toHaveLength(50);
    expect(manifest.workSet.workIds).toEqual([...manifest.workSet.workIds].sort());
    expect(manifest.payload.files).toHaveLength(16);
    expect(
      manifest.payload.files
        .filter((file) => file.path.startsWith("research/chunk-"))
        .map((file) => [file.path, file.rowCount]),
    ).toEqual([
      ["research/chunk-01.md", 10],
      ["research/chunk-02.md", 10],
      ["research/chunk-03.md", 10],
      ["research/chunk-04.md", 10],
      ["research/chunk-05.md", 10],
    ]);

    expect(() =>
      validateFrozenPromotionPilot({
        ...promotedInput,
        works: [...promotedInput.works, promotedInput.works[0]!],
      }),
    ).toThrow("Live source contains a duplicate work ID");
    const first = input.batches[0]!;
    expect(() =>
      validateFrozenPromotionPilot({
        ...promotedInput,
        works: promotedInput.works.map((work) =>
          work.id === first.workId ? { ...work, title: `${work.title} changed` } : work,
        ),
      }),
    ).toThrow(`canonical title changed: ${first.workId}`);

    const changedCandidate = derivePilotCandidateSha256({
      factorDictionarySha256: manifest.policies.factorDictionary.sha256,
      annotationGuideSha256: manifest.policies.annotationGuide.sha256,
      promotionMethodSha256: manifest.policies.promotionMethod.sha256,
      workSetSha256: manifest.workSet.sha256,
      payloadLedgerSha256: "0".repeat(64),
    });
    expect(changedCandidate).not.toBe(manifest.candidateSha256);
  }, 30_000);

  it("keeps explicit packet regeneration isolated to the original library-only state", () => {
    const input = loadPromotionPilotInput(process.cwd());
    const first = input.batches[0]!;

    expect(() =>
      validatePilotWorkSet([...input.batches, first], input.works, input.goldWorkIds),
    ).toThrow("requires exactly 50 frozen works");
    expect(() =>
      validatePilotWorkSet(
        input.batches.map((row, index) => (index === 1 ? { ...row, workId: first.workId } : row)),
        input.works,
        input.goldWorkIds,
      ),
    ).toThrow(`contains a duplicate work: ${first.workId}`);
    expect(() =>
      validatePilotWorkSet(
        input.batches.map((row, index) => (index === 0 ? { ...row, workId: "work-missing" } : row)),
        input.works,
        input.goldWorkIds,
      ),
    ).toThrow("references a missing work: work-missing");
    expect(() =>
      validatePilotWorkSet(
        input.batches.map((row, index) =>
          index === 0 ? { ...row, workId: input.goldWorkIds[0]! } : row,
        ),
        input.works,
        input.goldWorkIds,
      ),
    ).toThrow(`cannot include a Gold work: ${input.goldWorkIds[0]!}`);
    expect(() =>
      validatePilotWorkSet(
        input.batches,
        input.works.map((work) =>
          work.id === first.workId ? { ...work, libraryOnly: false } : work,
        ),
        input.goldWorkIds,
      ),
    ).toThrow(`work is not isolated libraryOnly: ${first.workId}`);
  }, 30_000);
});
