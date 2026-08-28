import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

import {
  runPromotionOverlay,
  type PromotionOverlayConfig,
  type PromotionOverlayMode,
} from "./catalog/promotion-overlay";

const sceneContexts = new Map<string, string>([
  ["work-0029e59a039dce3f6e74", "night dialogue;forest aftermath;interior conversation"],
  ["work-064c0062e7a8e29cfbed", "street dialogue;interior encounter;throw sequence"],
  ["work-131ba7a362fa9e38a10a", "park play;sidewalk conversation;recorded incident"],
  ["work-174e7603bb0e71bb62ab", "classroom origami;classroom eraser;pool interaction"],
  ["work-1d447cc9026b530fb53d", "seaside family history;store arrival;candy demonstration"],
  ["work-550854424fc9cc94d585", "guardianship introduction;home breakfast;university food memory"],
  ["work-5baea1ce0e7e74df34b9", "riverside memory;street family;apartment threat"],
  [
    "work-88e75622b83b794c03ac",
    "childhood rural history;live bird hunting;firearm permit acquisition",
  ],
  ["work-a25bac53b4757f13f21a", "hell administration;workplace conflict;field animal encounter"],
  [
    "work-f1d22b68efa7fbd501ee",
    "chapter 26 bedroom interaction;chapter 27 package and living-room interaction",
  ],
  ["work-f6fa4c2d3a7e1dc5257b", "salmon restaurant;yakitori restaurant;street transition"],
]);

const batch003Config: PromotionOverlayConfig = {
  batchId: "batch-003",
  batchLabel: "Batch 003",
  batchRoot: "data/staging/catalog-expansion/batches/batch-003",
  reviewReference: "reviews/batch-003-promotion-panel.md",
  reviewedAt: "2026-08-25T00:00:00+09:00",
  targetWorkCount: 50,
  legacyArtRequired: true,
  expectedVerifiedPositions: [1, 4, 6, 8, 10, 15, 16, 26, 29, 47, 50],
  chunks: ["01", "02", "03", "04", "05"],
  artPreflightReviewChunks: new Set(),
  annotationDirectory: "annotation-pass-a",
  artFactorOverrideFiles: ["art-review/final-art-recovery-ac.csv"],
  artPreflightOverrideFiles: [
    "art-preflight/chunk-05/recovery-a-preflight.csv",
    "art-preflight/recovery-c-preflight.csv",
  ],
  terminalQaFiles: [
    "data/staging/catalog-expansion/batches/batch-003/reviews/daybreak-final-overlay-qa.md",
  ],
  sceneContexts,
  motionReferences: new Map([
    ["work-064c0062e7a8e29cfbed", "printed pages 65-66: throw through immediate aftermath"],
  ]),
};

export function runBatch003Overlay(mode: PromotionOverlayMode, root = process.cwd()) {
  return runPromotionOverlay(batch003Config, mode, root);
}

const invokedPath =
  process.argv[1] === undefined ? undefined : pathToFileURL(resolve(process.argv[1])).href;
if (invokedPath === import.meta.url) {
  try {
    const mode =
      process.argv[2] === "--check" ? "check" : process.argv[2] === "--write" ? "write" : undefined;
    if (mode === undefined)
      throw new Error("Usage: tsx scripts/build-batch-003-overlay.ts --check|--write");
    const result = runBatch003Overlay(mode);
    console.log(
      `Batch 003 overlay ${mode}: verified ${result.verified}; blocked ${result.blocked}.`,
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
