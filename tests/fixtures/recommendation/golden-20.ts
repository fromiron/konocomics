import { AXIS_IDS, GENRE_TAGS, THEME_TAGS } from "@/domain/catalog/constants";
import type { AxisFactor, AxisId, CatalogV1, ScaleValue, Work } from "@/domain/catalog/types";
import type { RecommendationInput } from "@/domain/recommendation/types";
import { createTestAxes, createTestWork } from "../../helpers/catalog";
import {
  createTestAdjustments,
  createTestPolicies,
  createTestRecommendationContext,
  createTestRecord,
} from "../../helpers/recommendation";

const SCALE_VALUES = [0, 1, 2, 3, 4] as const satisfies readonly ScaleValue[];

function factorFor(workIndex: number, axisId: AxisId, axisIndex: number): AxisFactor {
  if (axisId === "motionImpact" && workIndex % 5 === 0) {
    return { state: "notApplicable" };
  }
  if (axisId === "romance" && workIndex % 7 === 0) {
    return { state: "unknown" };
  }
  return {
    state: "known",
    value: SCALE_VALUES[(workIndex * 2 + axisIndex) % SCALE_VALUES.length] ?? 0,
    confidence: 0.75 + ((workIndex + axisIndex) % 5) * 0.05,
  };
}

function goldenWork(index: number): Work {
  const id = `golden-${String(index).padStart(2, "0")}`;
  const axes = createTestAxes(
    Object.fromEntries(
      AXIS_IDS.map((axisId, axisIndex) => [axisId, factorFor(index, axisId, axisIndex)]),
    ),
  );
  const primaryTheme = THEME_TAGS[index % THEME_TAGS.length] ?? "adventure";
  const secondaryTheme = THEME_TAGS[(index + 5) % THEME_TAGS.length] ?? "exploration";
  const primaryGenre = GENRE_TAGS[index % GENRE_TAGS.length] ?? "fantasy";

  return createTestWork({
    id,
    genres: [primaryGenre],
    themes: [
      { id: primaryTheme, centrality: 2, confidence: 0.8 + (index % 3) * 0.05 },
      { id: secondaryTheme, centrality: 1, confidence: 0.75 + (index % 4) * 0.05 },
    ],
    axes,
    status: index % 3 === 0 ? "ongoing" : "completed",
    evidence: {
      groupingConfidence: 0.8 + (index % 4) * 0.05,
      sourceAgreement: 0.75 + (index % 5) * 0.05,
    },
  });
}

export function createGolden20Input(): RecommendationInput {
  const works = Array.from({ length: 20 }, (_, index) => goldenWork(index));
  const catalogVersion = "v1-golden-20";
  const catalog: CatalogV1 = {
    schemaVersion: 1,
    catalogVersion,
    factorDictionaryVersion: "v1",
    works,
    volumes: [],
    representativeVolumeByWorkId: {},
  };
  const context = createTestRecommendationContext(catalogVersion, {
    constraintByWorkId: Object.fromEntries(
      works.map((work, index) => [
        work.id,
        {
          workId: work.id,
          catalogRole: index < 3 ? "anchor" : index % 2 === 0 ? "discovery" : "bridge",
          seriesGroupId: index === 10 || index === 11 ? "golden-sequel-pair" : work.id,
          volumeCount: index + 1,
        },
      ]),
    ),
    marketSnapshot: {
      catalogVersion,
      catalogAverageRating: 3.6,
      byWorkId: Object.fromEntries(
        works.map((work, index) => [
          work.id,
          {
            workId: work.id,
            reviewAverage: 3.1 + (index % 8) * 0.2,
            reviewCount: (20 - index) * 13,
          },
        ]),
      ),
    },
  });

  return {
    catalog,
    context,
    records: [
      createTestRecord({ workId: "golden-00", reaction: "favorite", readingState: "completed" }),
      createTestRecord({ workId: "golden-01", reaction: "liked", readingState: "completed" }),
      createTestRecord({ workId: "golden-02", reaction: "liked", readingState: "completed" }),
      createTestRecord({
        workId: "golden-03",
        reaction: "disliked",
        readingState: "completed",
        negativeReasons: ["tooDark", "artStyleDislike", "genericStory"],
      }),
      createTestRecord({
        workId: "golden-04",
        reaction: "disliked",
        readingState: "dropped",
        negativeReasons: ["vagueDislike"],
      }),
    ],
    adjustments: createTestAdjustments({
      axes: { strategy: "like", pacing: "veryLike", darkness: "less" },
      themes: { adventure: "like", combat: "exclude", exploration: "veryLike" },
    }),
    policies: createTestPolicies({
      preferCompleted: true,
      preferHidden: true,
      preferVerified: true,
    }),
  };
}
