import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import catalogJson from "@/data/generated/catalog-v1.json";
import contextJson from "@/data/generated/recommendation-context-v1.json";
import kinetic from "../../../data/fixtures/experiment-profiles/kinetic-competition.json";
import tactical from "../../../data/fixtures/experiment-profiles/tactical-mystery.json";
import warm from "../../../data/fixtures/experiment-profiles/warm-exploration.json";
import { catalogV1Schema } from "@/domain/catalog/schema";
import { experimentProfileV1Schema } from "@/domain/profile/experiment-schema";
import { recommendationContextSchema } from "@/domain/recommendation/context-schema";
import { buildRecommendationPlan } from "@/domain/recommendation/rank";
import { selectRecommendationPlanEntries } from "@/domain/recommendation/ordering";
import {
  generateTasteExplanation,
  generateVariedTasteExplanations,
} from "@/domain/explanation/generate";
import {
  createRecommendationInputProjection,
  serializeRecommendationInput,
} from "@/domain/recommendation/input-hash";
import { explanationLexicon } from "@/lib/strings";
import type { UserWorkRecord } from "@/domain/profile/types";

const catalog = catalogV1Schema.parse(catalogJson);
const context = recommendationContextSchema.parse(contextJson);
const works = new Map(catalog.works.map((work) => [work.id, work]));
const mixed = {
  ...kinetic,
  profileId: "action-nine-and-drama",
  records: [
    "one-piece",
    "naruto",
    "work-335e47351a159b8445a3",
    "dragon-ball",
    "hunter-x-hunter",
    "chainsaw-man",
    "fullmetal-alchemist",
    "kingdom",
    "attack-on-titan",
    "work-0153a125c5a56225b06c",
  ].map((workId) => ({
    workId,
    readingState: "completed",
    reaction: "liked",
    updatedAt: "2000-01-01T00:00:00.000Z",
  })),
  adjustments: { axes: {}, themes: {} },
};

// These are fixed profiles, not reproductions of an unavailable reviewer's private records.
describe("tracker 56 fixed-profile diagnostics", () => {
  for (const fixture of [kinetic, tactical, warm, mixed]) {
    it(`${fixture.profileId}: traces reasons, policy and feedback without changing scores`, () => {
      const profile = experimentProfileV1Schema.parse(fixture);
      expect(profile.records.every((record) => works.has(record.workId))).toBe(true);
      const input = { ...profile, catalog, context };
      const plan = buildRecommendationPlan(input);
      const original = structuredClone(plan);
      const top = selectRecommendationPlanEntries(plan, profile.policies);
      const explanationInputs = top.map((entry) => ({
        ...entry,
        lexicon: explanationLexicon,
        resolveTitle: (id: string) => works.get(id)?.title,
      }));
      const varied = generateVariedTasteExplanations(explanationInputs);
      for (const entry of top) {
        const explanation = varied.get(entry.workId)!;
        const originalReasons = generateTasteExplanation(
          explanationInputs.find((item) => item.workId === entry.workId)!,
        ).positiveReasons;
        expect(explanation.positiveReasons.map((reason) => reason.factorId).sort()).toEqual(
          originalReasons.map((reason) => reason.factorId).sort(),
        );
        for (const reason of explanation.positiveReasons) {
          expect(
            entry.contributions.some(
              (contribution) =>
                contribution.explainable &&
                contribution.factorId === reason.factorId &&
                contribution.value === reason.value &&
                contribution.source === reason.source &&
                contribution.anchorWorkIds.join() === reason.anchorWorkIds.join(),
            ),
          ).toBe(true);
        }
      }
      expect(plan).toEqual(original);
      const target = top[0]!;
      const feedback: UserWorkRecord = {
        workId: target.workId,
        readingState: "completed",
        reaction: "favorite",
        updatedAt: "2026-10-09T00:00:00.000Z",
      };
      const afterInput = { ...input, records: [...input.records, feedback] };
      expect(serializeRecommendationInput(afterInput)).not.toBe(
        serializeRecommendationInput(input),
      );
      const after = buildRecommendationPlan(afterInput);
      expect(after.some((entry) => entry.workId === target.workId)).toBe(false);
      expect(
        createRecommendationInputProjection(afterInput).anchors.some(
          (anchor) => anchor.workId === target.workId,
        ),
      ).toBe(true);
      for (const readingState of ["dropped", "hidden"] as const) {
        const projection = createRecommendationInputProjection({
          ...input,
          records: [...input.records, { ...feedback, readingState, reaction: undefined }],
        });
        expect(projection.eligibilityExclusions).toContain(target.workId);
      }
      const hiddenInput = { ...input, policies: { ...input.policies, preferHidden: true } };
      const hidden = selectRecommendationPlanEntries(
        buildRecommendationPlan(hiddenInput),
        hiddenInput.policies,
      );
      expect({
        fixture: fixture.profileId,
        feedback,
        beforeHash: createHash("sha256").update(serializeRecommendationInput(input)).digest("hex"),
        afterHash: createHash("sha256")
          .update(serializeRecommendationInput(afterInput))
          .digest("hex"),
        hiddenPolicyHash: createHash("sha256")
          .update(serializeRecommendationInput(hiddenInput))
          .digest("hex"),
        catalog: catalog.catalogVersion,
        before: top.map((entry) => entry.workId),
        afterFavorite: selectRecommendationPlanEntries(after, input.policies).map(
          (entry) => entry.workId,
        ),
        hiddenPolicy: hidden.map((entry) => entry.workId),
        reasons: top.slice(0, 5).map((entry) => ({
          workId: entry.workId,
          score: entry.tasteScore,
          bestAnchorId: entry.bestAnchorId,
          lead: varied.get(entry.workId)?.positiveReasons[0],
          candidateAxis: Object.fromEntries(
            Object.entries(works.get(entry.workId)!.axes).filter(
              ([factorId]) => factorId === varied.get(entry.workId)?.positiveReasons[0]?.factorId,
            ),
          ),
          anchorAxis: Object.fromEntries(
            Object.entries(works.get(entry.bestAnchorId)!.axes).filter(
              ([factorId]) => factorId === varied.get(entry.workId)?.positiveReasons[0]?.factorId,
            ),
          ),
          originalLead: generateTasteExplanation(
            explanationInputs.find((item) => item.workId === entry.workId)!,
          ).positiveReasons[0]?.factorId,
        })),
      }).toMatchSnapshot();
    });
  }
});
