import { createHash } from "node:crypto";

import { describe, expect, it } from "vitest";

import {
  canonicalResolutionSnapshot,
  EMPTY_CITATION_SET_DIGEST,
  LEGACY_CUTOFF_SOURCE_MANIFEST,
  LEGACY_SNAPSHOT_REASON,
} from "../../../scripts/catalog/fact-resolution";

const legacy = {
  authorityKind: "legacySnapshot",
  authorityArtifactDigest: LEGACY_CUTOFF_SOURCE_MANIFEST,
  citationSetDigest: EMPTY_CITATION_SET_DIGEST,
  reasonCode: LEGACY_SNAPSHOT_REASON,
} as const;

describe("legacy fact resolution", () => {
  it("canonicalizes positional tuples with code-unit-stable digests", () => {
    const rows = [
      {
        factKey: "work:dungeon-meshi:genre:fantasy",
        state: "accepted",
        valueType: "boolean",
        lexicalValue: "true",
        ...legacy,
      },
      {
        factKey: "work:dungeon-meshi:factor:progression",
        state: "accepted",
        valueType: "integer",
        lexicalValue: "0",
        ...legacy,
      },
      {
        factKey: "work:dungeon-meshi:factor:strategy",
        state: "explicitUnknown",
        valueType: "none",
        lexicalValue: "",
        ...legacy,
      },
      {
        factKey: "work:dungeon-meshi:factor:motionImpact",
        state: "notApplicable",
        valueType: "none",
        lexicalValue: "",
        ...legacy,
      },
      {
        factKey: "work:dungeon-meshi:theme:cooking",
        state: "accepted",
        valueType: "integer",
        lexicalValue: "2",
        ...legacy,
      },
    ] as const;
    const forward = canonicalResolutionSnapshot(rows);
    const reversed = canonicalResolutionSnapshot([...rows].reverse());

    expect(reversed).toEqual(forward);
    expect(forward.states).toEqual({
      accepted: 3,
      explicitUnknown: 1,
      notApplicable: 1,
      rejected: 0,
      manualReview: 0,
    });
    expect(forward.acceptedFactsDigest).toBe(forward.resolutionSetDigest);
    expect(EMPTY_CITATION_SET_DIGEST).toBe(
      createHash("sha256")
        .update(Buffer.from(JSON.stringify([]), "utf8"))
        .digest("hex"),
    );
  });

  it("rejects duplicate keys and noncanonical kind/state/value combinations", () => {
    const valid = {
      factKey: "work:dungeon-meshi:factor:progression",
      state: "accepted",
      valueType: "integer",
      lexicalValue: "2",
      ...legacy,
    } as const;
    expect(() => canonicalResolutionSnapshot([valid, valid])).toThrow("Duplicate resolution");
    expect(() =>
      canonicalResolutionSnapshot([
        { ...valid, state: "notApplicable", valueType: "none", lexicalValue: "" },
      ]),
    ).toThrow("only defined for motionImpact");
    expect(() =>
      canonicalResolutionSnapshot([
        {
          ...valid,
          factKey: "work:dungeon-meshi:theme:cooking",
          lexicalValue: "0",
        },
      ]),
    ).toThrow("does not match its fact kind");
    expect(() => canonicalResolutionSnapshot([{ ...valid, verdict: "gold" }])).toThrow();
  });
});
