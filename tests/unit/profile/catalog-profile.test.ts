import { describe, expect, it } from "vitest";

import {
  hasCatalogBackedProfile,
  hasCatalogBackedProfileById,
} from "@/domain/profile/catalog-profile";
import type { UserWorkRecord } from "@/domain/profile/types";

function record(workId: string, reaction: UserWorkRecord["reaction"]): UserWorkRecord {
  return {
    workId,
    readingState: "completed",
    reaction,
    updatedAt: "2026-08-14T00:00:00+09:00",
  };
}

describe("catalog-backed profile", () => {
  const catalogWorks = ["a", "b", "c", "d", "e"].map((id) => ({
    id,
    eligibility: { recommendationEligible: true },
  }));

  it("requires five distinct favorite or liked records present in the current catalog", () => {
    expect(
      hasCatalogBackedProfile(
        [
          record("a", "favorite"),
          record("a", "liked"),
          record("b", "liked"),
          record("c", "liked"),
          record("d", "liked"),
          record("stale", "favorite"),
          record("e", "neutral"),
        ],
        catalogWorks,
      ),
    ).toBe(false);

    expect(
      hasCatalogBackedProfile(
        [
          record("a", "favorite"),
          record("b", "liked"),
          record("c", "liked"),
          record("d", "liked"),
          record("e", "liked"),
          record("stale", "favorite"),
        ],
        catalogWorks,
      ),
    ).toBe(true);
  });

  it("keeps the guard pending until persisted records load", () => {
    expect(hasCatalogBackedProfile(undefined, catalogWorks)).toBe(undefined);
  });

  it("does not count library-only works as taste-profile anchors", () => {
    const libraryOnly = {
      id: "library",
      eligibility: { recommendationEligible: false },
    };
    expect(
      hasCatalogBackedProfile(
        ["a", "b", "c", "d", "library"].map((workId) => record(workId, "liked")),
        [...catalogWorks, libraryOnly],
      ),
    ).toBe(false);
  });

  it("accepts the same identity-only work id boundary used by the shared shell", () => {
    const records = ["a", "b", "c", "d", "e"].map((workId) => record(workId, "liked"));

    expect(
      hasCatalogBackedProfileById(
        records,
        catalogWorks.map((work) => work.id),
      ),
    ).toBe(true);
    expect(hasCatalogBackedProfileById(records, ["a", "b", "c", "d"])).toBe(false);
  });
});
