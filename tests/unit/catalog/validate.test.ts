import { describe, expect, it } from "vitest";

import { validateCatalog } from "@/domain/catalog/validate";
import { createTestAxes, createTestCatalog, createTestWork } from "../../helpers/catalog";

function codes(catalog: ReturnType<typeof createTestCatalog>) {
  return validateCatalog(catalog).map((issue) => issue.code);
}

describe("catalog semantic validation", () => {
  it("accepts the valid fixture", () => {
    expect(validateCatalog(createTestCatalog())).toEqual([]);
  });

  it("rejects duplicate work and volume ids", () => {
    const catalog = createTestCatalog();
    catalog.works.push(createTestWork({ id: catalog.works[0]?.id }));
    catalog.volumes.push({
      ...catalog.volumes[0]!,
    });
    expect(codes(catalog)).toEqual(
      expect.arrayContaining(["DUPLICATE_WORK_ID", "DUPLICATE_VOLUME_ID", "DUPLICATE_ISBN"]),
    );
  });

  it.each(["external", `ext:rakuten:v1:${"a".repeat(64)}`])(
    "reserves the external detail namespace from catalog work ids: %s",
    (id) => {
      expect(codes(createTestCatalog(createTestWork({ id })))).toContain("RESERVED_WORK_ID");
    },
  );

  it("treats equivalent ISBN-10 and ISBN-13 values as duplicates", () => {
    const catalog = createTestCatalog();
    catalog.volumes.push({
      ...catalog.volumes[0]!,
      id: "second-volume",
      isbn: "0306406152",
    });
    expect(codes(catalog)).toContain("DUPLICATE_ISBN");
  });

  it("rejects conflicting or missing eligibility roles", () => {
    const conflict = createTestCatalog(
      createTestWork({
        eligibility: {
          onboardingEligible: true,
          recommendationEligible: false,
          libraryOnly: true,
        },
      }),
    );
    const noRole = createTestCatalog(
      createTestWork({
        eligibility: {
          onboardingEligible: false,
          recommendationEligible: false,
          libraryOnly: false,
        },
      }),
    );
    expect(codes(conflict)).toContain("ELIGIBILITY_CONFLICT");
    expect(codes(noRole)).toContain("NO_ELIGIBILITY_ROLE");
  });

  it("rejects recommendation works below the fixed group threshold", () => {
    const axes = createTestAxes({
      progression: { state: "unknown" },
      problemSolving: { state: "unknown" },
      strategy: { state: "unknown" },
    });
    const catalog = createTestCatalog(createTestWork({ axes }));
    expect(codes(catalog)).toContain("COVERAGE_BELOW_THRESHOLD");
  });

  it("rejects duplicate tags and missing representative volumes", () => {
    const work = createTestWork({
      genres: ["fantasy", "fantasy"],
      themes: [
        { id: "adventure", centrality: 2, confidence: 0.9 },
        { id: "adventure", centrality: 1, confidence: 0.8 },
      ],
    });
    const catalog = createTestCatalog(work);
    catalog.representativeVolumeByWorkId = {};
    expect(codes(catalog)).toEqual(
      expect.arrayContaining([
        "DUPLICATE_GENRE",
        "DUPLICATE_THEME",
        "REPRESENTATIVE_VOLUME_MISSING",
      ]),
    );
  });

  it("rejects a representative volume from another work", () => {
    const catalog = createTestCatalog();
    catalog.representativeVolumeByWorkId["test-work"] = "missing-volume";
    expect(codes(catalog)).toContain("REPRESENTATIVE_VOLUME_INVALID");
  });
});
