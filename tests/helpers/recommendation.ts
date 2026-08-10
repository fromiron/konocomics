import type {
  ProfileAdjustments,
  RecommendationPolicies,
  UserWorkRecord,
} from "@/domain/profile/types";
import type { RecommendationContext, ScoredRecommendation } from "@/domain/recommendation/types";
import { createTestWork } from "./catalog";

export function createTestRecord(overrides: Partial<UserWorkRecord> = {}): UserWorkRecord {
  return {
    workId: "test-work",
    readingState: "completed",
    reaction: "liked",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

export function createTestAdjustments(
  overrides: Partial<ProfileAdjustments> = {},
): ProfileAdjustments {
  return {
    axes: {},
    themes: {},
    ...overrides,
  };
}

export function createTestPolicies(
  overrides: Partial<RecommendationPolicies> = {},
): RecommendationPolicies {
  return {
    preferCompleted: false,
    preferHidden: false,
    preferVerified: false,
    excludeIncomplete: false,
    ...overrides,
  };
}

export function createTestRecommendationContext(
  catalogVersion = "v1-test",
  overrides: Partial<RecommendationContext> = {},
): RecommendationContext {
  return {
    constraintByWorkId: {},
    marketSnapshot: {
      catalogVersion,
      catalogAverageRating: 3.5,
      byWorkId: {},
    },
    ...overrides,
  };
}

type ScoredOptions = Partial<Omit<ScoredRecommendation, "work">> & {
  workId: string;
};

export function createScoredRecommendation(options: ScoredOptions): ScoredRecommendation {
  const { workId, ...overrides } = options;
  const work = createTestWork({ id: workId });
  return {
    work,
    workId,
    tasteScore: 0.8,
    confidence: 0.7,
    bestAnchorId: "anchor-a",
    contributions: [],
    penaltiesApplied: [],
    bayesianRating: 3.5,
    maturity: 0.5,
    isPopular: false,
    isDiscovery: false,
    majorThemeKey: `theme:${workId}`,
    seriesGroupId: `series:${workId}`,
    ...overrides,
  };
}
