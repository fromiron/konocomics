import { AXIS_IDS } from "@/domain/catalog/constants";
import { workAxesSchema } from "@/domain/catalog/schema";
import type {
  AxisFactor,
  AxisId,
  CatalogEligibility,
  CatalogV1,
  GenreTag,
  ThemeFactor,
  Work,
  WorkAxes,
  WorkEvidence,
  WorkStatus,
} from "@/domain/catalog/types";

export function createTestAxes(overrides: Partial<Record<AxisId, AxisFactor>> = {}): WorkAxes {
  const base = Object.fromEntries(
    AXIS_IDS.map((axisId) => [axisId, { state: "known", value: 2, confidence: 0.9 }]),
  );
  return workAxesSchema.parse({ ...base, ...overrides });
}

type TestWorkOptions = {
  id?: string;
  genres?: GenreTag[];
  themes?: ThemeFactor[];
  axes?: WorkAxes;
  eligibility?: CatalogEligibility;
  status?: WorkStatus;
  evidence?: Partial<WorkEvidence>;
};

export function createTestWork(options: TestWorkOptions = {}): Work {
  const id = options.id ?? "test-work";
  return {
    id,
    title: "テスト作品",
    aliases: [],
    creators: ["テスト作者"],
    publisher: "テスト出版社",
    demographic: "general",
    status: options.status ?? "completed",
    firstPublishedYear: 2020,
    genres: options.genres ?? ["fantasy"],
    themes: options.themes ?? [{ id: "adventure", centrality: 2, confidence: 0.9 }],
    axes: options.axes ?? createTestAxes(),
    factorScope: "entry_1_3_volumes",
    eligibility:
      options.eligibility ??
      ({ onboardingEligible: true, recommendationEligible: true, libraryOnly: false } as const),
    evidence: {
      metadataConfidence: 0.9,
      groupingConfidence: 0.9,
      sourceAgreement: 0.9,
      ...options.evidence,
    },
  };
}

export function createTestCatalog(work = createTestWork()): CatalogV1 {
  const volumeId = `${work.id}-v1`;
  return {
    schemaVersion: 1,
    catalogVersion: "v1-test",
    factorDictionaryVersion: "v1",
    works: [work],
    volumes: [
      {
        id: volumeId,
        workId: work.id,
        volumeNumber: 1,
        isbn: "9780306406157",
        releaseDate: "2020-01-01",
        editionKind: "standard",
      },
    ],
    representativeVolumeByWorkId: { [work.id]: volumeId },
  };
}
