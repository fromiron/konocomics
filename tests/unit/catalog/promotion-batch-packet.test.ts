import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  derivePromotionBatchCandidateSha256,
  parseFrozenPromotionBatch,
  validateFrozenPromotionBatchPacket,
} from "../../../scripts/build-promotion-batch-packet";

describe("promotion batch packet", () => {
  it("binds the exact frozen Batch 004 inputs without absorbing annotation or Art outputs", () => {
    const manifest = validateFrozenPromotionBatchPacket("batch-004");
    const paths = manifest.payload.files.map((file) => file.path);

    expect(manifest.workSet.workIds).toHaveLength(50);
    expect(paths).toHaveLength(17);
    expect(paths).toEqual([...paths].sort());
    expect(paths).toContain("source/works.csv");
    expect(paths).toContain("provenance/source-membership.csv");
    expect(
      paths.some((path) => /^(?:annotation-pass-a|art-preflight|art-review)\//u.test(path)),
    ).toBe(false);

    expect(
      derivePromotionBatchCandidateSha256({
        batchId: manifest.batchId,
        factorDictionarySha256: manifest.policies.factorDictionary.sha256,
        annotationGuideSha256: manifest.policies.annotationGuide.sha256,
        promotionMethodSha256: manifest.policies.promotionMethod.sha256,
        workSetSha256: manifest.workSet.sha256,
        payloadLedgerSha256: "0".repeat(64),
      }),
    ).not.toBe(manifest.candidateSha256);
  }, 30_000);

  it("rejects decorative title delimiters in the frozen identity", () => {
    const path = join(
      process.cwd(),
      "data/staging/catalog-expansion/batches/batch-003/frozen-work-set.csv",
    );
    const frozen = readFileSync(path, "utf8");
    const changed = frozen.replace(",【推しの子】\n", ",『【推しの子】』\n");

    expect(() => parseFrozenPromotionBatch(changed)).toThrow("Canonical title contains delimiters");
  });

  it("accepts a final partial frozen work set", () => {
    const frozen = `${[
      "position,workId,canonicalTitle",
      ...Array.from(
        { length: 14 },
        (_, index) =>
          `${index + 1},work-${index.toString(16).padStart(20, "0")},Title ${index + 1}`,
      ),
    ].join("\n")}\n`;

    expect(parseFrozenPromotionBatch(frozen)).toHaveLength(14);
  });
});
