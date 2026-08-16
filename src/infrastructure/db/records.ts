import type { RecommendationPlanEntry } from "@/domain/recommendation/types";
import type {
  RECOMMENDATION_CACHE_SCHEMA_VERSION,
  RECOMMENDATION_ENGINE_VERSION,
} from "@/domain/recommendation/input-hash";
import type {
  ProfileAdjustments,
  RecommendationPolicies,
  UserWorkRecord,
} from "@/domain/profile/types";
import type { ExternalWorkId } from "@/domain/catalog/external-work";

export type ExternalWorkRecord = {
  id: ExternalWorkId;
  normalizedKey: string;
  title: string;
  creators: string[];
  isbnSamples: string[];
  coverUrl?: string;
  record: UserWorkRecord;
};

export type ProfileRecord =
  | { key: "adjustments"; value: ProfileAdjustments }
  | { key: "policies"; value: RecommendationPolicies }
  | { key: "onboardingCompletedAt"; value: string };

export type RecommendationCacheRecord = {
  schemaVersion: typeof RECOMMENDATION_CACHE_SCHEMA_VERSION;
  engineVersion: typeof RECOMMENDATION_ENGINE_VERSION;
  inputHash: string;
  plan: RecommendationPlanEntry[];
  computedAt: string;
};

export type ProviderCacheRecord = {
  workId: string;
  provider: "rakuten";
  isbn: string;
  imageUrl?: string;
  itemUrl?: string;
  affiliateUrl?: string;
  chirayomiUrl?: string;
  itemCaption?: string;
  itemPrice?: number;
  availability?: 1 | 2 | 3 | 4 | 5 | 6;
  reviewAverage?: number;
  reviewCount?: number;
  fetchedAt: string;
  commercialExpiresAt: string;
  metadataExpiresAt: string;
};

export type MetaRecord =
  { key: "schemaVersion"; value: 1 | 2 } | { key: "catalogVersion"; value: string };
