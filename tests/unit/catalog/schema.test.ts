import { describe, expect, it } from "vitest";

import { catalogV1Schema, workAxesSchema } from "@/domain/catalog/schema";
import { createTestCatalog, createTestWork } from "../../helpers/catalog";

describe("catalog schema", () => {
  it("round-trips a valid catalog", () => {
    const catalog = createTestCatalog();
    expect(catalogV1Schema.parse(JSON.parse(JSON.stringify(catalog)))).toEqual(catalog);
  });

  it("requires every v1 axis and rejects extra axis keys", () => {
    const work = createTestWork();
    const missingAxis = Object.fromEntries(
      Object.entries(work.axes).filter(([axisId]) => axisId !== "motionImpact"),
    );
    expect(workAxesSchema.safeParse(missingAxis).success).toBe(false);
    expect(
      workAxesSchema.safeParse({ ...work.axes, actionIntensity: work.axes.pacing }).success,
    ).toBe(false);
  });

  it("rejects notApplicable outside the one dictionary-defined axis", () => {
    const axes = { ...createTestWork().axes, progression: { state: "notApplicable" } };
    expect(workAxesSchema.safeParse(axes).success).toBe(false);
  });
});
