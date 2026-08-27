import { createHash } from "node:crypto";

export const PROMOTION_REASON_CODES = [
  "SOURCE_PROVENANCE_INCOMPLETE",
  "CANONICAL_IDENTITY_NOT_VERIFIED",
  "SAFETY_NOT_SAFE",
  "REPRESENTATIVE_ISBN_NOT_VERIFIED",
  "ANNOTATION_MISSING",
  "ANNOTATION_INCOMPLETE",
  "REVIEW_NOT_ACCEPTED",
  "EVIDENCE_INCOMPLETE",
  "RECOMMENDATION_CONTEXT_INCOMPLETE",
  "LAST_UPDATED_AT_MISSING",
  "ONBOARDING_INELIGIBLE",
  "RECOMMENDATION_INELIGIBLE",
] as const;

export type PromotionReasonCode = (typeof PROMOTION_REASON_CODES)[number];

export type PromotionJudgmentInput = {
  targetStatus: "gold" | "recommendationVerified";
  annotationStatus: "missing" | "draft" | "complete";
  reasonCodes: readonly PromotionReasonCode[];
  blockerCodes: readonly string[];
};

export type PromotionJudgment = {
  currentStatus: "libraryOnly" | "annotationDraft" | "recommendationVerified" | "gold";
  promotionOutcome: "pending" | "recommendationVerified" | "promotionBlocked" | "gold";
  reasonCodes: PromotionReasonCode[];
  blockerCodes: string[];
};

export type JudgmentArtifactIdentity = readonly [version: string, exactArtifactDigest: string];

export type PromotionJudgmentIdentityInput = {
  targetType: "promotion";
  targetId: string;
  sourceManifestDigest: string;
  acceptedFactsDigest: string;
  resolutionSetDigest: string;
  factorDictionaryIdentity: JudgmentArtifactIdentity;
  annotationGuideIdentity: JudgmentArtifactIdentity;
  policyIdentity: JudgmentArtifactIdentity;
  decisionSchemaIdentity: JudgmentArtifactIdentity;
  engineManifestDigest: string;
  contextMarketIdentity: JudgmentArtifactIdentity;
  goldManifestIdentity: JudgmentArtifactIdentity;
  legacyRegistryEvidenceIdentity: JudgmentArtifactIdentity;
};

const reasonCodeSet = new Set<string>(PROMOTION_REASON_CODES);

export function compareCodeUnit(left: string, right: string) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function canonicalCodes<Code extends string>(values: readonly Code[], label: string): Code[] {
  if (values.some((value) => value === ""))
    throw new Error(`${label} cannot contain an empty code`);
  return [...new Set(values)].sort(compareCodeUnit);
}

function canonicalReasonCodes(values: readonly PromotionReasonCode[]) {
  if (values.some((value) => !reasonCodeSet.has(value))) {
    throw new Error("Promotion reason codes contain an unknown code");
  }
  return canonicalCodes(values, "Promotion reason codes");
}

function assertDigest(value: string, label: string) {
  if (!/^[a-f0-9]{64}$/u.test(value)) throw new Error(`${label} must be a lowercase SHA-256`);
}

function artifactIdentity(identity: JudgmentArtifactIdentity, label: string) {
  if (identity[0] === "") throw new Error(`${label} version cannot be empty`);
  assertDigest(identity[1], `${label} digest`);
  return identity;
}

function digestTuple(value: unknown) {
  return createHash("sha256").update(JSON.stringify(value), "utf8").digest("hex");
}

export function promotionJudgmentInputDigest(input: PromotionJudgmentIdentityInput) {
  if (input.targetId === "") throw new Error("Promotion judgment target ID cannot be empty");
  assertDigest(input.sourceManifestDigest, "Source manifest digest");
  assertDigest(input.acceptedFactsDigest, "Accepted facts digest");
  assertDigest(input.resolutionSetDigest, "Resolution set digest");
  assertDigest(input.engineManifestDigest, "Engine manifest digest");
  return digestTuple([
    input.targetType,
    input.targetId,
    input.sourceManifestDigest,
    input.acceptedFactsDigest,
    input.resolutionSetDigest,
    artifactIdentity(input.factorDictionaryIdentity, "Factor Dictionary identity"),
    artifactIdentity(input.annotationGuideIdentity, "Annotation Guide identity"),
    artifactIdentity(input.policyIdentity, "Promotion policy identity"),
    artifactIdentity(input.decisionSchemaIdentity, "Decision schema identity"),
    input.engineManifestDigest,
    artifactIdentity(input.contextMarketIdentity, "Recommendation context identity"),
    artifactIdentity(input.goldManifestIdentity, "Gold manifest identity"),
    artifactIdentity(input.legacyRegistryEvidenceIdentity, "Legacy registry evidence identity"),
  ]);
}

export function promotionDecisionDigest(
  judgmentInputDigest: string,
  judgment: Pick<PromotionJudgment, "promotionOutcome" | "reasonCodes" | "blockerCodes">,
) {
  assertDigest(judgmentInputDigest, "Judgment input digest");
  return digestTuple([
    judgmentInputDigest,
    judgment.promotionOutcome,
    canonicalReasonCodes(judgment.reasonCodes),
    canonicalCodes(judgment.blockerCodes, "Promotion blocker codes"),
  ]);
}

function assertAnnotationReason(
  annotationStatus: PromotionJudgmentInput["annotationStatus"],
  reasonCodes: readonly PromotionReasonCode[],
) {
  const actual = reasonCodes.filter(
    (code) => code === "ANNOTATION_MISSING" || code === "ANNOTATION_INCOMPLETE",
  );
  const expected =
    annotationStatus === "missing"
      ? "ANNOTATION_MISSING"
      : annotationStatus === "draft"
        ? "ANNOTATION_INCOMPLETE"
        : undefined;
  if (
    (expected === undefined && actual.length !== 0) ||
    (expected !== undefined && (actual.length !== 1 || actual[0] !== expected))
  ) {
    throw new Error("Annotation status and promotion reason codes disagree");
  }
}

export function decidePromotionJudgment(input: PromotionJudgmentInput): PromotionJudgment {
  const reasonCodes = canonicalReasonCodes(input.reasonCodes);
  const blockerCodes = canonicalCodes(input.blockerCodes, "Promotion blocker codes");
  assertAnnotationReason(input.annotationStatus, reasonCodes);

  if (input.targetStatus === "gold") {
    if (
      input.annotationStatus !== "complete" ||
      reasonCodes.length !== 0 ||
      blockerCodes.length !== 0
    ) {
      throw new Error(
        "Gold promotion judgment requires complete annotation and no reason or blocker",
      );
    }
    return { currentStatus: "gold", promotionOutcome: "gold", reasonCodes, blockerCodes };
  }
  if (blockerCodes.length !== 0) {
    return {
      currentStatus: "libraryOnly",
      promotionOutcome: "promotionBlocked",
      reasonCodes,
      blockerCodes,
    };
  }
  if (reasonCodes.length === 0) {
    return {
      currentStatus: "recommendationVerified",
      promotionOutcome: "recommendationVerified",
      reasonCodes,
      blockerCodes,
    };
  }
  return {
    currentStatus: input.annotationStatus === "missing" ? "libraryOnly" : "annotationDraft",
    promotionOutcome: "pending",
    reasonCodes,
    blockerCodes,
  };
}
