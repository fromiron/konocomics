import { z } from "zod";

import { ART_AXIS_IDS, FACTOR_SOURCE_TYPES } from "../../src/domain/catalog/constants";
import type { Located, SourceIssue } from "./types";

export const ART_EVIDENCE_MANIFEST_FILE = "evidence/art-evidence-manifest.csv";

export const artEvidenceManifestHeaders = [
  "workId",
  "axisId",
  "state",
  "value",
  "confidence",
  "authorityClass",
  "sourceType",
  "sourceUrl",
  "edition",
  "scopeMapping",
  "pageOrTimeRefs",
  "sampleCount",
  "contexts",
  "observation",
  "limitation",
  "reviewStatus",
] as const;

const requiredText = z.string().trim().min(1);
const catalogIdSchema = requiredText.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/u, {
  message: "Must be a lowercase kebab-case catalog ID",
});

export const artEvidenceManifestRowSchema = z
  .strictObject({
    workId: catalogIdSchema,
    axisId: z.enum(ART_AXIS_IDS),
    state: z.enum(["known", "unknown", "notApplicable"]),
    value: z.string(),
    confidence: z.string(),
    authorityClass: z.enum([
      "licensedPublisher",
      "publisherAuthorizedPlatform",
      "originalPublisher",
    ]),
    sourceType: z.enum(FACTOR_SOURCE_TYPES),
    sourceUrl: z.url(),
    edition: requiredText,
    scopeMapping: requiredText,
    pageOrTimeRefs: z.string(),
    sampleCount: z.string().regex(/^\d+$/u).transform(Number),
    contexts: requiredText,
    observation: requiredText,
    limitation: requiredText,
    reviewStatus: requiredText,
  })
  .superRefine((row, context) => {
    if (row.state === "known") {
      if (!/^[0-4]$/u.test(row.value)) {
        context.addIssue({ code: "custom", path: ["value"], message: "Known value is required" });
      }
      const confidence = Number(row.confidence);
      if (!/^\d+(?:\.\d+)?$/u.test(row.confidence) || confidence < 0 || confidence > 1) {
        context.addIssue({
          code: "custom",
          path: ["confidence"],
          message: "Known confidence must be between 0 and 1",
        });
      }
    } else if (row.value !== "" || row.confidence !== "") {
      context.addIssue({
        code: "custom",
        path: ["value"],
        message: "Unknown or not-applicable evidence cannot have value or confidence",
      });
    }
    if (row.state !== "unknown" && row.pageOrTimeRefs.trim() === "") {
      context.addIssue({
        code: "custom",
        path: ["pageOrTimeRefs"],
        message: "Known or not-applicable Art evidence requires references",
      });
    }
    if (row.state === "notApplicable" && row.axisId !== "motionImpact") {
      context.addIssue({
        code: "custom",
        path: ["state"],
        message: "notApplicable is only defined for motionImpact in factor dictionary v1",
      });
    }
    const expectedSourceType =
      row.authorityClass === "publisherAuthorizedPlatform" ? "manual" : "publisher";
    if (row.sourceType !== expectedSourceType) {
      context.addIssue({
        code: "custom",
        path: ["sourceType"],
        message: `${row.authorityClass} requires sourceType=${expectedSourceType}`,
      });
    }
  });

export type ArtEvidenceManifestRow = z.infer<typeof artEvidenceManifestRowSchema>;

type ArtEvidenceWork = { id: string };
type ArtEvidenceFactor = {
  workId: string;
  axisId: string;
  state: string;
  value: string | number;
  confidence: string | number;
  evidenceId: string;
};
type ArtEvidenceProvenance = {
  id: string;
  workId: string;
  sourceType: string;
  sourceUrl?: string;
};

export type ArtEvidenceValidationInput = {
  works: readonly Located<ArtEvidenceWork>[];
  factors: readonly Located<ArtEvidenceFactor>[];
  evidence: readonly Located<ArtEvidenceProvenance>[];
  manifest: readonly Located<ArtEvidenceManifestRow>[];
};

function issue(
  located: Pick<Located<unknown>, "file" | "row">,
  code: string,
  message: string,
  field?: string,
): SourceIssue {
  return {
    severity: "error",
    code,
    file: located.file,
    row: located.row,
    ...(field === undefined ? {} : { field }),
    message,
  };
}

function splitDistinct(value: string) {
  return new Set(
    value
      .split(";")
      .map((item) => item.trim())
      .filter((item) => item !== ""),
  );
}

function nonCoverReferences(value: string) {
  return new Set([...splitDistinct(value)].filter((reference) => !/\bcover\b/iu.test(reference)));
}

function hasContinuousSequenceRange(references: string) {
  if (/\b(?:page|spread)\s+\d+\s+bounded panel sequence\b/iu.test(references)) {
    return true;
  }

  const numberedRange = [
    ...references.matchAll(
      /\b(?:pages?|panels?)\s+(\d+)\s*(?:-|–|—|~|〜|to|through)\s*(?:(?:reader|printed|official)\s+)?(?:pages?|panels?)?\s*(\d+)/giu,
    ),
  ].some((match) => Number(match[2]) > Number(match[1]));
  if (numberedRange) {
    return true;
  }

  const timeRange = [
    ...references.matchAll(
      /\b(?:(\d{1,2}):)?([0-5]?\d):([0-5]\d(?:\.\d+)?)\s*-\s*(?:(\d{1,2}):)?([0-5]?\d):([0-5]\d(?:\.\d+)?)\b/gu,
    ),
  ].some((match) => {
    const start = Number(match[1] ?? 0) * 3600 + Number(match[2]) * 60 + Number(match[3]);
    const end = Number(match[4] ?? 0) * 3600 + Number(match[5]) * 60 + Number(match[6]);
    return end > start;
  });
  if (timeRange) {
    return true;
  }
  return false;
}

function sameFactorValue(factor: ArtEvidenceFactor, row: ArtEvidenceManifestRow) {
  if (factor.state !== row.state) {
    return false;
  }
  if (row.state === "known") {
    return (
      Number(factor.value) === Number(row.value) &&
      Number(factor.confidence) === Number(row.confidence)
    );
  }
  return (
    factor.value === "" && factor.confidence === "" && row.value === "" && row.confidence === ""
  );
}

function normalizedUrl(value: string) {
  return new URL(value).href;
}

export function validateArtEvidence(input: ArtEvidenceValidationInput): SourceIssue[] {
  const issues: SourceIssue[] = [];
  const workById = new Map(input.works.map((row) => [row.value.id, row]));
  const factorByPair = new Map(
    input.factors.map((row) => [`${row.value.workId}\u0000${row.value.axisId}`, row]),
  );
  const evidenceById = new Map(input.evidence.map((row) => [row.value.id, row]));
  const manifestByPair = new Map<string, Located<ArtEvidenceManifestRow>>();
  const referencesByWork = new Map<string, Set<string>>();
  const contextsByWork = new Map<string, Set<string>>();
  const maximumSampleCountByWork = new Map<string, number>();

  for (const located of input.manifest) {
    const row = located.value;
    const pair = `${row.workId}\u0000${row.axisId}`;
    if (manifestByPair.has(pair)) {
      issues.push(
        issue(
          located,
          "DUPLICATE_ART_EVIDENCE_PAIR",
          `Duplicate Art evidence pair: ${row.workId}/${row.axisId}`,
          "axisId",
        ),
      );
      continue;
    }
    manifestByPair.set(pair, located);

    if (!workById.has(row.workId)) {
      issues.push(
        issue(
          located,
          "UNKNOWN_ART_EVIDENCE_WORK",
          `Art evidence references unknown work ${row.workId}`,
          "workId",
        ),
      );
      continue;
    }

    const factor = factorByPair.get(pair)?.value;
    if (factor === undefined || !sameFactorValue(factor, row)) {
      issues.push(
        issue(
          located,
          "ART_EVIDENCE_FACTOR_MISMATCH",
          `Art evidence does not match final factor: ${row.workId}/${row.axisId}`,
          "state",
        ),
      );
    } else {
      const evidence = evidenceById.get(factor.evidenceId)?.value;
      if (
        evidence === undefined ||
        evidence.workId !== row.workId ||
        evidence.sourceType !== row.sourceType ||
        evidence.sourceUrl === undefined ||
        normalizedUrl(evidence.sourceUrl) !== normalizedUrl(row.sourceUrl)
      ) {
        issues.push(
          issue(
            located,
            "ART_EVIDENCE_PROVENANCE_MISMATCH",
            `Art evidence provenance does not match final factor: ${row.workId}/${row.axisId}`,
            "sourceUrl",
          ),
        );
      }
    }

    const rowReferences = nonCoverReferences(row.pageOrTimeRefs);
    const workReferences = referencesByWork.get(row.workId) ?? new Set<string>();
    for (const reference of rowReferences) {
      workReferences.add(reference);
    }
    referencesByWork.set(row.workId, workReferences);

    const workContexts = contextsByWork.get(row.workId) ?? new Set<string>();
    for (const context of splitDistinct(row.contexts)) {
      workContexts.add(context);
    }
    contextsByWork.set(row.workId, workContexts);
    maximumSampleCountByWork.set(
      row.workId,
      Math.max(maximumSampleCountByWork.get(row.workId) ?? 0, row.sampleCount),
    );

    if (row.state === "known" && row.axisId !== "motionImpact" && rowReferences.size < 2) {
      issues.push(
        issue(
          located,
          "ART_EVIDENCE_STATIC_REFS_INSUFFICIENT",
          `Known static Art evidence requires two distinct non-cover references: ${row.workId}/${row.axisId}`,
          "pageOrTimeRefs",
        ),
      );
    }
    if (
      row.state === "known" &&
      row.axisId === "motionImpact" &&
      !hasContinuousSequenceRange(row.pageOrTimeRefs)
    ) {
      issues.push(
        issue(
          located,
          "ART_EVIDENCE_MOTION_SEQUENCE_MISSING",
          `Known motion evidence requires a continuous sequence: ${row.workId}`,
          "pageOrTimeRefs",
        ),
      );
    }
  }

  for (const [workId, work] of workById) {
    const hasImageArtClaim = ART_AXIS_IDS.some((axisId) => {
      const factor = factorByPair.get(`${workId}\u0000${axisId}`)?.value;
      if (factor === undefined || factor.state === "unknown") return false;
      const sourceType = evidenceById.get(factor.evidenceId)?.value.sourceType;
      return sourceType === "publisher" || sourceType === "manual";
    });
    if (!hasImageArtClaim) continue;
    for (const axisId of ART_AXIS_IDS) {
      if (!manifestByPair.has(`${workId}\u0000${axisId}`)) {
        issues.push(
          issue(
            work,
            "ART_EVIDENCE_PAIR_MISSING",
            `Art evidence pair is missing: ${workId}/${axisId}`,
            axisId,
          ),
        );
      }
    }
    if ((referencesByWork.get(workId)?.size ?? 0) < 6) {
      issues.push(
        issue(
          work,
          "ART_EVIDENCE_WORK_SAMPLES_INSUFFICIENT",
          `Art evidence requires six work-wide samples: ${workId}`,
          "artEvidence",
        ),
      );
    }
    if ((maximumSampleCountByWork.get(workId) ?? 0) < 6) {
      issues.push(
        issue(
          work,
          "ART_EVIDENCE_SAMPLE_COUNT_INSUFFICIENT",
          `Art evidence sampleCount must record at least six work-wide samples: ${workId}`,
          "artEvidence",
        ),
      );
    }
    if ((contextsByWork.get(workId)?.size ?? 0) < 2) {
      issues.push(
        issue(
          work,
          "ART_EVIDENCE_WORK_CONTEXTS_INSUFFICIENT",
          `Art evidence requires two distinct work-wide contexts: ${workId}`,
          "artEvidence",
        ),
      );
    }
  }

  return issues;
}
