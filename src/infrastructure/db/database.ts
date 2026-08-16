import Dexie, { type Table } from "dexie";

import type { OnboardingDraft } from "@/domain/profile/onboarding";
import type { UserWorkRecord } from "@/domain/profile/types";

import type {
  ExternalWorkRecord,
  MetaRecord,
  ProfileRecord,
  ProviderCacheRecord,
  RecommendationCacheRecord,
} from "./records";

export const DATABASE_NAME = "konocomics";

export const DATABASE_SCHEMA_V1 = {
  userWorks: "workId, readingState, updatedAt",
  externalWorks: "id, record.updatedAt",
  profile: "key",
  onboardingDraft: "id",
  recommendationCache: "inputHash",
  providerCache: "isbn, expiresAt",
  meta: "key",
} as const;

export const DATABASE_SCHEMA_V2 = {
  ...DATABASE_SCHEMA_V1,
  providerCache: "isbn",
} as const;

export const DATABASE_SCHEMA_VERSION = 2;

export class KonocomicsDatabase extends Dexie {
  userWorks!: Table<UserWorkRecord, string>;
  externalWorks!: Table<ExternalWorkRecord, string>;
  profile!: Table<ProfileRecord, ProfileRecord["key"]>;
  onboardingDraft!: Table<OnboardingDraft, "current">;
  recommendationCache!: Table<RecommendationCacheRecord, string>;
  providerCache!: Table<ProviderCacheRecord, string>;
  meta!: Table<MetaRecord, MetaRecord["key"]>;

  constructor(name = DATABASE_NAME) {
    super(name);
    this.version(1).stores(DATABASE_SCHEMA_V1);
    this.version(DATABASE_SCHEMA_VERSION).stores(DATABASE_SCHEMA_V2);
  }
}
