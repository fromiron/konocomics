import { describe, expect, it } from "vitest";

import {
  PROMOTION_METHOD_POLICY,
  PROMOTION_PANEL_POLICY,
  freezePromotionBatch,
  type PromotionBatchWork,
} from "../../../scripts/freeze-promotion-batch";
import type { PromotionRegistryRow } from "../../../scripts/build-promotion-registry";

function registryRow(
  workId: string,
  sourceCount: number,
  sourceTypes: string,
  overrides: Partial<PromotionRegistryRow> = {},
): PromotionRegistryRow {
  return {
    workId,
    canonicalTitle: workId,
    currentStatus: "libraryOnly",
    targetStatus: "recommendationVerified",
    sourceCount,
    sourceTypes,
    safetyStatus: "safe",
    canonicalStatus: "verified",
    representativeIsbnStatus: "verified",
    annotationStatus: "missing",
    reviewStatus: "unreviewed",
    evidenceStatus: "missing",
    recommendationContextStatus: "missing",
    onboardingEligibilityStatus: "ineligible",
    recommendationEligibilityStatus: "ineligible",
    plannedBatch: "",
    blockerCode: "",
    blockerDetails: "",
    lastUpdatedAt: "2026-08-23T00:00:00.000Z",
    promotionOutcome: "pending",
    ...overrides,
  };
}

function work(row: PromotionRegistryRow): PromotionBatchWork {
  return {
    id: row.workId,
    title: row.canonicalTitle,
    firstPublishedYear: 2021,
    demographic: "shonen",
    genres: [],
  };
}

describe("promotion batch freezer", () => {
  it("selects 50 eligible works by evidence priority and emits deterministic frozen artifacts", () => {
    const rich = Array.from({ length: 48 }, (_, index) =>
      registryRow(`work-rich-${String(index).padStart(2, "0")}`, 4, "award"),
    );
    const multiDistinctThree = registryRow("work-multi-three", 3, "award;bookseller;editorial");
    const multiDistinctTwo = registryRow("work-multi-two", 2, "award;bookseller");
    const multiHigherCountOneType = registryRow("work-multi-one", 3, "award");
    const excluded = [
      registryRow("work-planned", 9, "award;bookseller", { plannedBatch: "batch-002" }),
      registryRow("work-unsafe", 9, "award;bookseller", { safetyStatus: "safety-unknown" }),
      registryRow("work-blocked", 9, "award;bookseller", {
        blockerCode: "SOURCE_INFORMATION_UNAVAILABLE",
        blockerDetails: "No evidence",
      }),
    ];
    const rows = [
      ...rich,
      multiDistinctThree,
      multiDistinctTwo,
      multiHigherCountOneType,
      ...excluded,
    ];
    const works = rows.map(work);
    const first = freezePromotionBatch({
      batchId: "batch-003",
      freezeDate: "2026-08-23",
      registryRows: rows,
      works,
    });
    const second = freezePromotionBatch({
      batchId: "batch-003",
      freezeDate: "2026-08-23",
      registryRows: [...rows].reverse(),
      works: [...works].reverse(),
    });

    expect(first).toEqual(second);
    expect(first.selectedWorkIds).toHaveLength(50);
    expect(first.selectedWorkIds).toEqual([...first.selectedWorkIds].sort());
    expect(first.selectedWorkIds).toContain(multiDistinctThree.workId);
    expect(first.selectedWorkIds).toContain(multiDistinctTwo.workId);
    expect(first.selectedWorkIds).not.toContain(multiHigherCountOneType.workId);
    expect(first.batchLedgerRows).toHaveLength(50);
    expect(
      first.batchLedgerRows.every(
        (row) =>
          row.batchId === "batch-003" &&
          row.methodPolicy === PROMOTION_METHOD_POLICY &&
          row.panelPolicy === PROMOTION_PANEL_POLICY &&
          row.selectionReason.endsWith(";genre-unknown;ev-rich") ===
            row.workId.startsWith("work-rich-"),
      ),
    ).toBe(true);
    expect(first.frozenWorkSetCsv.split("\n")).toHaveLength(52);
    expect(first.batchLedgerCsv.split("\n")).toHaveLength(52);
    expect(first.selectionReport).toContain("ev-rich: 48");
    expect(first.selectionReport).toContain("ev-multi: 2");
    expect(first.selectionReport).toContain(PROMOTION_PANEL_POLICY);
    expect(() =>
      freezePromotionBatch({
        batchId: "batch-003",
        freezeDate: "2026-08-23",
        registryRows: [
          { ...rows[0]!, canonicalTitle: `『${rows[0]!.canonicalTitle}』` },
          ...rows.slice(1),
        ],
        works,
      }),
    ).toThrow(`Canonical title contains delimiters: ${rows[0]!.workId}`);
  });

  it("freezes the final partial batch", () => {
    const rows = Array.from({ length: 14 }, (_, index) =>
      registryRow(`work-final-${String(index).padStart(2, "0")}`, 2, "award;editorial"),
    );

    const result = freezePromotionBatch({
      batchId: "batch-030",
      freezeDate: "2026-08-26",
      registryRows: rows,
      works: rows.map(work),
    });

    expect(result.selectedWorkIds).toHaveLength(14);
    expect(result.batchLedgerRows).toHaveLength(14);
  });
});
