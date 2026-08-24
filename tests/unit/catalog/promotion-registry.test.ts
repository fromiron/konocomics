import { parse } from "csv-parse/sync";
import { describe, expect, it } from "vitest";

import {
  PROMOTION_REGISTRY_HEADERS,
  buildPromotionRegistry,
  loadPromotionRegistryInput,
  serializePromotionRegistry,
  validatePromotionRegistry,
} from "../../../scripts/build-promotion-registry";

describe("promotion registry", () => {
  it("covers source works deterministically, keeps Gold distinct, and fails closed", () => {
    const input = loadPromotionRegistryInput(process.cwd());
    const expectedWorkIds = input.source.works.map((row) => row.value.id).sort();
    const rows = buildPromotionRegistry(input);

    expect(() => validatePromotionRegistry(rows, expectedWorkIds)).not.toThrow();
    expect(rows.map((row) => row.workId)).toEqual(expectedWorkIds);
    expect(rows.filter((row) => row.currentStatus === "gold")).toHaveLength(
      input.goldWorkIds.length,
    );
    expect(
      rows
        .filter((row) => row.currentStatus === "gold")
        .every(
          (row) =>
            row.targetStatus === "gold" &&
            row.promotionOutcome === "gold" &&
            row.sourceTypes === "frozen",
        ),
    ).toBe(true);
    expect(rows.filter((row) => row.promotionOutcome === "gold")).toHaveLength(
      input.goldWorkIds.length,
    );
    const verifiedRows = rows.filter((row) => row.promotionOutcome === "recommendationVerified");
    const blockedRows = rows.filter((row) => row.promotionOutcome === "promotionBlocked");
    expect(rows.filter((row) => row.promotionOutcome === "pending")).toHaveLength(
      expectedWorkIds.length - input.goldWorkIds.length - verifiedRows.length - blockedRows.length,
    );
    expect(blockedRows).toHaveLength(input.blockers.length);

    const pilotBatches = input.batches.filter((batch) => batch.batchId === "pilot-001");
    const batch002Batches = input.batches.filter((batch) => batch.batchId === "batch-002");
    const pilotWorkIds = new Set(pilotBatches.map((batch) => batch.workId));
    const batch002WorkIds = new Set(batch002Batches.map((batch) => batch.workId));
    const blockerWorkIds = new Set(input.blockers.map((blocker) => blocker.workId));
    const plannedWorkIds = new Set(input.batches.map((batch) => batch.workId));
    const plannedRows = rows.filter((row) => row.plannedBatch !== "");
    const pilotRows = rows.filter((row) => row.plannedBatch === "pilot-001");
    const batch002Rows = rows.filter((row) => row.plannedBatch === "batch-002");
    expect(plannedRows).toHaveLength(input.batches.length);
    expect(plannedRows.map((row) => `${row.workId}\u0000${row.plannedBatch}`).sort()).toEqual(
      input.batches.map((row) => `${row.workId}\u0000${row.batchId}`).sort(),
    );
    expect(
      [...Map.groupBy(input.batches, (batch) => batch.batchId)].every(
        ([batchId, batches]) =>
          batches.length === 50 &&
          batches.every(
            (batch) =>
              batch.batchType === (batchId === "pilot-001" ? "pilot" : "batch") &&
              batch.status === "frozen" &&
              batch.methodPolicy === "promotion-evidence-v2" &&
              batch.panelPolicy ===
                "art-local-codex+gemini-3.7-flash-high;grok-art-abstain;muse-conditional" &&
              /^\d{4}-\d{2}-\d{2}$/u.test(batch.lastUpdatedAt),
          ),
      ),
    ).toBe(true);
    expect(pilotBatches).toHaveLength(50);
    expect(
      pilotBatches.every(
        (batch) =>
          batch.batchId === "pilot-001" &&
          batch.batchType === "pilot" &&
          batch.status === "frozen" &&
          batch.methodPolicy === "promotion-evidence-v2" &&
          batch.panelPolicy ===
            "art-local-codex+gemini-3.7-flash-high;grok-art-abstain;muse-conditional" &&
          batch.lastUpdatedAt === "2026-08-22",
      ),
    ).toBe(true);
    expect(pilotRows).toHaveLength(50);
    expect(pilotRows.map((row) => row.workId)).toEqual([...pilotWorkIds].sort());
    expect(pilotRows.every((row) => row.promotionOutcome === "recommendationVerified")).toBe(true);
    expect(batch002Batches).toHaveLength(50);
    expect(
      batch002Batches.every(
        (batch) =>
          batch.batchType === "batch" &&
          batch.status === "frozen" &&
          batch.methodPolicy === "promotion-evidence-v2" &&
          batch.panelPolicy ===
            "art-local-codex+gemini-3.7-flash-high;grok-art-abstain;muse-conditional" &&
          batch.lastUpdatedAt === "2026-08-23",
      ),
    ).toBe(true);
    expect(batch002Rows).toHaveLength(50);
    expect(batch002Rows.map((row) => row.workId)).toEqual([...batch002WorkIds].sort());
    expect(
      batch002Rows.every((row) =>
        blockerWorkIds.has(row.workId)
          ? row.currentStatus === "libraryOnly" && row.promotionOutcome === "promotionBlocked"
          : row.currentStatus === "recommendationVerified" &&
            row.promotionOutcome === "recommendationVerified",
      ),
    ).toBe(true);
    expect(
      rows.filter((row) => !plannedWorkIds.has(row.workId)).every((row) => row.plannedBatch === ""),
    ).toBe(true);

    const firstBatch = input.batches[0]!;
    expect(() =>
      buildPromotionRegistry({
        ...input,
        batches: [...input.batches, firstBatch],
      }),
    ).toThrow(`Work has duplicate batch assignments: ${firstBatch.workId}`);
    expect(() =>
      buildPromotionRegistry({
        ...input,
        batches: [...input.batches, { ...firstBatch, workId: "work-unknown" }],
      }),
    ).toThrow("Batch assignment references an unknown source work: work-unknown");
    expect(() =>
      buildPromotionRegistry({
        ...input,
        batches: [...input.batches, { ...firstBatch, workId: input.goldWorkIds[0]! }],
      }),
    ).toThrow(`Gold work cannot have a planned batch: ${input.goldWorkIds[0]!}`);

    const reversed = buildPromotionRegistry({
      ...input,
      source: Object.fromEntries(
        Object.entries(input.source).map(([key, value]) => [key, [...value].reverse()]),
      ) as typeof input.source,
      artEvidence: [...input.artEvidence].reverse(),
      expansion: {
        sources: [...input.expansion.sources].reverse(),
        memberships: [...input.expansion.memberships].reverse(),
        mappings: [...input.expansion.mappings].reverse(),
        safetyReviews: [...input.expansion.safetyReviews].reverse(),
      },
      goldWorkIds: [...input.goldWorkIds].reverse(),
      batches: [...input.batches].reverse(),
    });
    expect(reversed).toEqual(rows);

    const nonGold = rows.find((row) => row.currentStatus !== "gold")!;
    const withoutCanonical = buildPromotionRegistry({
      ...input,
      expansion: {
        ...input.expansion,
        mappings: input.expansion.mappings.filter((mapping) => mapping.workId !== nonGold.workId),
      },
    }).find((row) => row.workId === nonGold.workId)!;
    expect(withoutCanonical).toMatchObject({
      canonicalStatus: "missing",
      promotionOutcome: "pending",
      blockerCode: "",
      blockerDetails: "",
    });
    expect(() =>
      validatePromotionRegistry(
        rows.map((row) =>
          row.workId === withoutCanonical.workId
            ? {
                ...withoutCanonical,
                currentStatus: "recommendationVerified",
                promotionOutcome: "recommendationVerified",
              }
            : row,
        ),
        expectedWorkIds,
      ),
    ).toThrow(`Promotion registry fails open: ${withoutCanonical.workId}`);

    const verificationReady = {
      ...nonGold,
      sourceCount: 1,
      sourceTypes: "official",
      safetyStatus: "safe" as const,
      canonicalStatus: "verified" as const,
      representativeIsbnStatus: "verified" as const,
      annotationStatus: "complete" as const,
      reviewStatus: "authorizedModelPanel" as const,
      evidenceStatus: "complete" as const,
      recommendationContextStatus: "complete" as const,
      onboardingEligibilityStatus: "ineligible" as const,
      recommendationEligibilityStatus: "eligible" as const,
      lastUpdatedAt: "2026-08-23T00:00:00Z",
      currentStatus: "recommendationVerified" as const,
      promotionOutcome: "recommendationVerified" as const,
    };
    expect(() =>
      validatePromotionRegistry(
        rows.map((row) => (row.workId === nonGold.workId ? verificationReady : row)),
        expectedWorkIds,
      ),
    ).toThrow(`Verified promotion status is inconsistent: ${nonGold.workId}`);
    expect(() =>
      validatePromotionRegistry(
        rows.map((row) =>
          row.workId === nonGold.workId
            ? { ...verificationReady, onboardingEligibilityStatus: "eligible" as const }
            : row,
        ),
        expectedWorkIds,
      ),
    ).not.toThrow();

    const draftButBlocked = buildPromotionRegistry({
      ...input,
      source: {
        ...input.source,
        works: input.source.works.map((work) =>
          work.value.id === nonGold.workId
            ? { ...work, value: { ...work.value, genres: ["action" as const] } }
            : work,
        ),
      },
      blockers: [
        {
          workId: nonGold.workId,
          blockerCode: "SOURCE_INFORMATION_UNAVAILABLE",
          blockerDetails: "The immutable recommendation coverage contract cannot be met.",
          evidenceName: "Official preview availability audit",
          evidenceUrl: "https://example.com/official-preview",
          evidencePublishedAt: "2026",
          retrievedAt: "2026-08-22",
          recheckPath: "Recheck when a qualifying official preview becomes available.",
        },
      ],
    }).find((row) => row.workId === nonGold.workId)!;
    expect(draftButBlocked).toMatchObject({
      currentStatus: "libraryOnly",
      annotationStatus: "draft",
      promotionOutcome: "promotionBlocked",
      blockerCode: "SOURCE_INFORMATION_UNAVAILABLE",
    });

    const [headers] = parse(serializePromotionRegistry(rows)) as string[][];
    expect(headers).toEqual(PROMOTION_REGISTRY_HEADERS);
  }, 15_000);
});
