import { createHash } from "node:crypto";

import { AXIS_IDS, THEME_TAGS } from "../../src/domain/catalog/constants";
import { isbnIdentityKey } from "../../src/domain/catalog/normalize";
import { catalogV1Schema, workAxesSchema } from "../../src/domain/catalog/schema";
import type {
  AxisFactor,
  CatalogV1,
  ThemeFactor,
  Volume,
  Work,
} from "../../src/domain/catalog/types";
import { validateCatalog } from "../../src/domain/catalog/validate";
import type { RecommendationContext } from "../../src/domain/recommendation/types";
import type {
  CatalogSource,
  EvidenceSourceRow,
  Located,
  SourceIssue,
  SourceIssueSeverity,
  WorkSourceRow,
} from "./types";

type CompileResult = {
  catalog: CatalogV1;
  context: RecommendationContext;
  issues: SourceIssue[];
};

function issue(
  located: Pick<Located<unknown>, "file" | "row">,
  severity: SourceIssueSeverity,
  code: string,
  message: string,
  field?: string,
): SourceIssue {
  return {
    severity,
    code,
    file: located.file,
    row: located.row,
    ...(field === undefined ? {} : { field }),
    message,
  };
}

function collectFirstByKey<T>(
  rows: readonly Located<T>[],
  key: (value: T) => string,
  duplicateCode: string,
  issues: SourceIssue[],
) {
  const map = new Map<string, Located<T>>();
  for (const row of rows) {
    const id = key(row.value);
    if (map.has(id)) {
      issues.push(issue(row, "error", duplicateCode, `Duplicate value: ${id}`));
      continue;
    }
    map.set(id, row);
  }
  return map;
}

function compareIds(left: string, right: string) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function compileRecommendationContext(
  source: CatalogSource,
  catalog: CatalogV1,
  workRows: ReadonlyMap<string, Located<WorkSourceRow>>,
  issues: SourceIssue[],
): RecommendationContext {
  const config = source.recommendationConfig[0];
  if (config === undefined) {
    issues.push({
      severity: "error",
      code: "RECOMMENDATION_CONFIG_MISSING",
      file: "recommendation-config.csv",
      message: "Exactly one recommendation config row is required",
    });
  }
  for (const duplicate of source.recommendationConfig.slice(1)) {
    issues.push(
      issue(
        duplicate,
        "error",
        "DUPLICATE_RECOMMENDATION_CONFIG",
        "Exactly one recommendation config row is allowed",
      ),
    );
  }

  const contextRows = collectFirstByKey(
    source.recommendationContext,
    (row) => row.workId,
    "DUPLICATE_RECOMMENDATION_CONTEXT_WORK",
    issues,
  );
  const constraintEntries: [string, RecommendationContext["constraintByWorkId"][string]][] = [];
  const marketEntries: [string, RecommendationContext["marketSnapshot"]["byWorkId"][string]][] = [];

  for (const [workId, row] of contextRows) {
    if (!workRows.has(workId)) {
      issues.push(
        issue(
          row,
          "error",
          "UNKNOWN_RECOMMENDATION_CONTEXT_WORK",
          `Recommendation context references unknown work ${workId}`,
          "workId",
        ),
      );
      continue;
    }
    constraintEntries.push([
      workId,
      {
        workId,
        catalogRole: row.value.catalogRole,
        ...(row.value.seriesGroupId === undefined
          ? {}
          : { seriesGroupId: row.value.seriesGroupId }),
        volumeCount: row.value.volumeCount,
      },
    ]);
    marketEntries.push([
      workId,
      {
        workId,
        ...(row.value.reviewAverage === undefined
          ? {}
          : { reviewAverage: row.value.reviewAverage }),
        ...(row.value.reviewCount === undefined ? {} : { reviewCount: row.value.reviewCount }),
      },
    ]);
  }

  for (const work of catalog.works.filter(
    (candidate) => candidate.eligibility.recommendationEligible,
  )) {
    if (!contextRows.has(work.id)) {
      const row = workRows.get(work.id);
      if (row !== undefined) {
        issues.push(
          issue(
            row,
            "error",
            "RECOMMENDATION_CONTEXT_MISSING",
            `Recommendation-eligible work ${work.id} requires static recommendation metadata`,
            "recommendationContext",
          ),
        );
      }
    }
  }

  constraintEntries.sort(([left], [right]) => compareIds(left, right));
  marketEntries.sort(([left], [right]) => compareIds(left, right));
  return {
    constraintByWorkId: Object.fromEntries(constraintEntries),
    marketSnapshot: {
      catalogVersion: "v1-unversioned",
      catalogAverageRating: config?.value.catalogAverageRating ?? 0,
      byWorkId: Object.fromEntries(marketEntries),
    },
  };
}

function evidenceMatches(
  evidence: EvidenceSourceRow,
  workId: string,
  targetType: EvidenceSourceRow["targetType"],
  targetId: string,
) {
  return (
    evidence.workId === workId &&
    (evidence.targetType === "work" ||
      (evidence.targetType === targetType && evidence.targetId === targetId))
  );
}

function validateEvidenceReference(
  row: Pick<Located<unknown>, "file" | "row">,
  evidenceId: string,
  workId: string,
  targetType: EvidenceSourceRow["targetType"],
  targetId: string,
  evidenceById: ReadonlyMap<string, Located<EvidenceSourceRow>>,
  warnedUnreviewedEvidenceIds: Set<string>,
  issues: SourceIssue[],
) {
  const evidence = evidenceById.get(evidenceId);
  if (evidence === undefined) {
    issues.push(
      issue(
        row,
        "error",
        "EVIDENCE_MISSING",
        `Evidence ${evidenceId} does not exist`,
        "evidenceId",
      ),
    );
    return;
  }
  if (!evidenceMatches(evidence.value, workId, targetType, targetId)) {
    issues.push(
      issue(
        row,
        "error",
        "EVIDENCE_TARGET_MISMATCH",
        `Evidence ${evidenceId} does not support ${targetType} ${targetId}`,
        "evidenceId",
      ),
    );
  }
  if (!evidence.value.reviewedByHuman && !warnedUnreviewedEvidenceIds.has(evidenceId)) {
    warnedUnreviewedEvidenceIds.add(evidenceId);
    issues.push(
      issue(
        row,
        "warning",
        "EVIDENCE_NOT_HUMAN_REVIEWED",
        `Evidence ${evidenceId} has not been reviewed by a human`,
        "evidenceId",
      ),
    );
  }
}

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(canonicalize);
  }
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([left], [right]) => (left < right ? -1 : left > right ? 1 : 0))
        .map(([key, entry]) => [key, canonicalize(entry)]),
    );
  }
  return value;
}

function assignJointVersion(catalog: CatalogV1, context: RecommendationContext) {
  const { catalogVersion, ...versionlessCatalog } = catalog;
  const { catalogVersion: contextCatalogVersion, ...versionlessMarketSnapshot } =
    context.marketSnapshot;
  void catalogVersion;
  void contextCatalogVersion;
  const content = JSON.stringify(
    canonicalize({
      catalog: versionlessCatalog,
      context: {
        constraintByWorkId: context.constraintByWorkId,
        marketSnapshot: versionlessMarketSnapshot,
      },
    }),
  );
  const digest = createHash("sha256").update(content).digest("hex").slice(0, 12);
  const version = `v1-${digest}`;
  return {
    catalog: { ...catalog, catalogVersion: version },
    context: {
      ...context,
      marketSnapshot: { ...context.marketSnapshot, catalogVersion: version },
    },
  };
}

export function compileCatalog(source: CatalogSource): CompileResult {
  const issues: SourceIssue[] = [];
  const workRows = collectFirstByKey(source.works, (row) => row.id, "DUPLICATE_WORK_ID", issues);
  const evidenceById = collectFirstByKey(
    source.evidence,
    (row) => row.id,
    "DUPLICATE_EVIDENCE_ID",
    issues,
  );
  const warnedUnreviewedEvidenceIds = new Set<string>();
  const aliasKeys = new Set<string>();
  const aliasesByWork = new Map<string, string[]>();
  for (const row of source.aliases) {
    if (!workRows.has(row.value.workId)) {
      issues.push(
        issue(
          row,
          "error",
          "UNKNOWN_ALIAS_WORK",
          `Alias references unknown work ${row.value.workId}`,
          "workId",
        ),
      );
      continue;
    }
    const key = `${row.value.workId}\u0000${row.value.alias}`;
    if (aliasKeys.has(key)) {
      issues.push(issue(row, "error", "DUPLICATE_ALIAS", `Duplicate alias ${row.value.alias}`));
      continue;
    }
    aliasKeys.add(key);
    const aliases = aliasesByWork.get(row.value.workId) ?? [];
    aliases.push(row.value.alias);
    aliasesByWork.set(row.value.workId, aliases);
  }

  const factorByWorkAndAxis = new Map<string, (typeof source.factors)[number]>();
  for (const row of source.factors) {
    if (!workRows.has(row.value.workId)) {
      issues.push(
        issue(
          row,
          "error",
          "UNKNOWN_FACTOR_WORK",
          `Factor references unknown work ${row.value.workId}`,
          "workId",
        ),
      );
      continue;
    }
    const key = `${row.value.workId}\u0000${row.value.axisId}`;
    if (factorByWorkAndAxis.has(key)) {
      issues.push(issue(row, "error", "DUPLICATE_AXIS", `Axis ${row.value.axisId} is duplicated`));
      continue;
    }
    factorByWorkAndAxis.set(key, row);
    validateEvidenceReference(
      row,
      row.value.evidenceId,
      row.value.workId,
      "axis",
      row.value.axisId,
      evidenceById,
      warnedUnreviewedEvidenceIds,
      issues,
    );
  }

  const themeKeys = new Set<string>();
  const themesByWork = new Map<string, ThemeFactor[]>();
  for (const row of source.themes) {
    if (!workRows.has(row.value.workId)) {
      issues.push(
        issue(
          row,
          "error",
          "UNKNOWN_THEME_WORK",
          `Theme references unknown work ${row.value.workId}`,
          "workId",
        ),
      );
      continue;
    }
    const key = `${row.value.workId}\u0000${row.value.themeId}`;
    if (themeKeys.has(key)) {
      issues.push(
        issue(row, "error", "DUPLICATE_THEME", `Theme ${row.value.themeId} is duplicated`),
      );
      continue;
    }
    themeKeys.add(key);
    const themes = themesByWork.get(row.value.workId) ?? [];
    themes.push({
      id: row.value.themeId,
      centrality: row.value.centrality,
      confidence: row.value.confidence,
    });
    themesByWork.set(row.value.workId, themes);
    validateEvidenceReference(
      row,
      row.value.evidenceId,
      row.value.workId,
      "theme",
      row.value.themeId,
      evidenceById,
      warnedUnreviewedEvidenceIds,
      issues,
    );
  }

  const volumeRows = collectFirstByKey(
    source.volumes,
    (row) => row.id,
    "DUPLICATE_VOLUME_ID",
    issues,
  );
  const axisIds = new Set<string>(AXIS_IDS);
  const themeIds = new Set<string>(THEME_TAGS);
  const referencedEvidenceIds = new Set([
    ...source.works.map((row) => row.value.evidenceId),
    ...source.volumes.map((row) => row.value.evidenceId),
    ...source.factors.map((row) => row.value.evidenceId),
    ...source.themes.map((row) => row.value.evidenceId),
  ]);
  for (const row of source.evidence) {
    if (!workRows.has(row.value.workId)) {
      issues.push(
        issue(
          row,
          "error",
          "UNKNOWN_EVIDENCE_WORK",
          `Evidence references unknown work ${row.value.workId}`,
          "workId",
        ),
      );
    }
    if (row.value.targetType === "work" && row.value.targetId !== row.value.workId) {
      issues.push(
        issue(
          row,
          "error",
          "EVIDENCE_TARGET_MISMATCH",
          `Work evidence target ${row.value.targetId} must equal ${row.value.workId}`,
          "targetId",
        ),
      );
    }
    if (row.value.targetType === "volume") {
      const volume = volumeRows.get(row.value.targetId);
      if (volume === undefined || volume.value.workId !== row.value.workId) {
        issues.push(
          issue(
            row,
            "error",
            "EVIDENCE_TARGET_MISMATCH",
            `Volume evidence target ${row.value.targetId} is invalid`,
            "targetId",
          ),
        );
      }
    }
    if (row.value.targetType === "axis" && !axisIds.has(row.value.targetId)) {
      issues.push(
        issue(
          row,
          "error",
          "EVIDENCE_TARGET_MISMATCH",
          `Axis evidence target ${row.value.targetId} is invalid`,
          "targetId",
        ),
      );
    }
    if (row.value.targetType === "theme" && !themeIds.has(row.value.targetId)) {
      issues.push(
        issue(
          row,
          "error",
          "EVIDENCE_TARGET_MISMATCH",
          `Theme evidence target ${row.value.targetId} is invalid`,
          "targetId",
        ),
      );
    }
    if (!referencedEvidenceIds.has(row.value.id)) {
      issues.push(
        issue(
          row,
          "warning",
          "EVIDENCE_ORPHANED",
          `Evidence ${row.value.id} is not referenced by any source row`,
          "id",
        ),
      );
    }
  }
  const isbnRows = new Map<string, (typeof source.volumes)[number]>();
  const representativeRows = new Map<string, (typeof source.volumes)[number]>();
  const volumes: Volume[] = [];
  for (const row of volumeRows.values()) {
    if (!workRows.has(row.value.workId)) {
      issues.push(
        issue(
          row,
          "error",
          "UNKNOWN_VOLUME_WORK",
          `Volume references unknown work ${row.value.workId}`,
          "workId",
        ),
      );
    }
    const isbnIdentity = isbnIdentityKey(row.value.isbn);
    if (isbnRows.has(isbnIdentity)) {
      issues.push(
        issue(row, "error", "DUPLICATE_ISBN", `ISBN ${row.value.isbn} is duplicated`, "isbn"),
      );
    } else {
      isbnRows.set(isbnIdentity, row);
    }
    if (row.value.isRepresentative) {
      if (representativeRows.has(row.value.workId)) {
        issues.push(
          issue(
            row,
            "error",
            "MULTIPLE_REPRESENTATIVE_VOLUMES",
            `Multiple representative volumes for ${row.value.workId}`,
            "isRepresentative",
          ),
        );
      } else {
        representativeRows.set(row.value.workId, row);
      }
    }
    validateEvidenceReference(
      row,
      row.value.evidenceId,
      row.value.workId,
      "volume",
      row.value.id,
      evidenceById,
      warnedUnreviewedEvidenceIds,
      issues,
    );
    volumes.push({
      id: row.value.id,
      workId: row.value.workId,
      ...(row.value.volumeNumber === undefined ? {} : { volumeNumber: row.value.volumeNumber }),
      isbn: row.value.isbn,
      ...(row.value.releaseDate === undefined ? {} : { releaseDate: row.value.releaseDate }),
      editionKind: row.value.editionKind,
    });
  }

  const works: Work[] = [];
  for (const row of workRows.values()) {
    validateEvidenceReference(
      row,
      row.value.evidenceId,
      row.value.id,
      "work",
      row.value.id,
      evidenceById,
      warnedUnreviewedEvidenceIds,
      issues,
    );
    if (
      (row.value.onboardingEligible || row.value.recommendationEligible) &&
      row.value.annotationReviewMethod === "unreviewed"
    ) {
      issues.push(
        issue(
          row,
          "error",
          "UNREVIEWED_ELIGIBILITY",
          `${row.value.id} cannot be onboarding or recommendation eligible before annotation review`,
          "annotationReviewMethod",
        ),
      );
    }
    const workEvidence = evidenceById.get(row.value.evidenceId);
    if (
      row.value.annotationReviewMethod === "human" &&
      workEvidence !== undefined &&
      !workEvidence.value.reviewedByHuman
    ) {
      issues.push(
        issue(
          row,
          "error",
          "HUMAN_REVIEW_UNCONFIRMED",
          `${row.value.id} declares human review but its evidence is not human-reviewed`,
          "annotationReviewMethod",
        ),
      );
    }
    if (row.value.annotationReviewMethod === "authorizedModelPanel") {
      issues.push(
        issue(
          row,
          "warning",
          "AUTHORIZED_MODEL_PANEL_REVIEW",
          `${row.value.id} was approved by the user-authorized model panel, not a human`,
          "annotationReviewMethod",
        ),
      );
    }
    const axisEntries: [string, AxisFactor][] = AXIS_IDS.map((axisId) => {
      const factorRow = factorByWorkAndAxis.get(`${row.value.id}\u0000${axisId}`);
      if (factorRow === undefined) {
        issues.push(
          issue(
            row,
            "error",
            "AXIS_MISSING",
            `Axis ${axisId} is missing for ${row.value.id}`,
            axisId,
          ),
        );
        return [axisId, { state: "unknown" }];
      }
      if (factorRow.value.state === "known") {
        return [
          axisId,
          {
            state: "known",
            value: factorRow.value.value,
            confidence: factorRow.value.confidence,
          },
        ];
      }
      return [axisId, { state: factorRow.value.state }];
    });
    const axes = workAxesSchema.parse(Object.fromEntries(axisEntries));
    works.push({
      id: row.value.id,
      title: row.value.title,
      ...(row.value.titleKana === undefined ? {} : { titleKana: row.value.titleKana }),
      aliases: [...(aliasesByWork.get(row.value.id) ?? [])].sort(),
      creators: row.value.creators,
      ...(row.value.publisher === undefined ? {} : { publisher: row.value.publisher }),
      demographic: row.value.demographic,
      status: row.value.status,
      ...(row.value.firstPublishedYear === undefined
        ? {}
        : { firstPublishedYear: row.value.firstPublishedYear }),
      genres: [...row.value.genres].sort(),
      themes: [...(themesByWork.get(row.value.id) ?? [])].sort((left, right) =>
        left.id.localeCompare(right.id),
      ),
      axes,
      factorScope: row.value.factorScope,
      eligibility: {
        onboardingEligible: row.value.onboardingEligible,
        recommendationEligible: row.value.recommendationEligible,
        libraryOnly: row.value.libraryOnly,
      },
      evidence: {
        metadataConfidence: row.value.metadataConfidence,
        groupingConfidence: row.value.groupingConfidence,
        sourceAgreement: row.value.sourceAgreement,
        ...(row.value.annotationReviewedAt === undefined
          ? {}
          : { annotationReviewedAt: row.value.annotationReviewedAt }),
      },
    });
  }

  const representativeVolumeByWorkId = Object.fromEntries(
    [...representativeRows.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([workId, row]) => [workId, row.value.id]),
  );
  const unversionedCatalog = catalogV1Schema.parse({
    schemaVersion: 1,
    catalogVersion: "v1-unversioned",
    factorDictionaryVersion: "v1",
    works: works.sort((left, right) => left.id.localeCompare(right.id)),
    volumes: volumes.sort((left, right) => left.id.localeCompare(right.id)),
    representativeVolumeByWorkId,
  });
  const unversionedContext = compileRecommendationContext(
    source,
    unversionedCatalog,
    workRows,
    issues,
  );
  const { catalog, context } = assignJointVersion(unversionedCatalog, unversionedContext);

  for (const catalogIssue of validateCatalog(catalog)) {
    const located =
      (catalogIssue.workId === undefined ? undefined : workRows.get(catalogIssue.workId)) ??
      (catalogIssue.volumeId === undefined ? undefined : volumeRows.get(catalogIssue.volumeId));
    issues.push({
      severity: "error",
      code: catalogIssue.code,
      file: located?.file ?? "catalog-v1.json",
      ...(located === undefined ? {} : { row: located.row }),
      ...(catalogIssue.field === undefined ? {} : { field: catalogIssue.field }),
      message: catalogIssue.message,
    });
  }

  return { catalog, context, issues };
}
