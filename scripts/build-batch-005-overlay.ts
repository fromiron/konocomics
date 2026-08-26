import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

import {
  runPromotionOverlay,
  type PromotionOverlayConfig,
  type PromotionOverlayMode,
} from "./catalog/promotion-overlay";

const batch005Config: PromotionOverlayConfig = {
  batchId: "batch-005",
  batchLabel: "Batch 005",
  batchRoot: "data/staging/catalog-expansion/batches/batch-005",
  reviewReference: "reviews/batch-005-promotion-panel.md",
  reviewedAt: "2026-08-25T00:00:00+09:00",
  targetWorkCount: 50,
  expectedVerifiedPositions: [4, 8, 23, 26, 27, 30, 35, 45, 47],
  chunks: ["01", "02", "03", "04", "05"],
  artPreflightReviewChunks: new Set(),
  annotationDirectory: "annotation-pass-a",
  artPreflightOverrideFiles: [
    "art-preflight/chunk-03/recovery-pos26-preflight.csv",
    "art-preflight/chunk-04/recovery-pos35-preflight.csv",
    "art-preflight/chunk-05/recovery-pos45-preflight.csv",
  ],
  terminalQaFiles: [
    "data/staging/catalog-expansion/batches/batch-005/reviews/daybreak-final-overlay-qa.md",
  ],
  blockerAdjudicationFile: "adjudication/blockers-final.csv",
  sceneContexts: new Map([
    ["work-0cf463005cc77eeded8e", "mountain;village and home;roadside"],
    ["work-0ede6921b81169dc2dda", "snowy wilderness;inhabited or human contexts"],
    [
      "work-43ebf010a490cfd4bb50",
      "mountain or outdoor scenes;domestic interiors;community or family gatherings",
    ],
    [
      "work-5b7cf2105a4bc6f6b46c",
      "ship and settlement landscape;mourning and group-character scenes",
    ],
    ["work-5e30ab3c7e3fb43e51f2", "palace;chase;confrontation"],
    ["work-77008e04537e3fd889e2", "character;urban and rubble;geological terrain"],
    ["work-8a7846af8ead1797e6a2", "street or social interaction;arcade/gameplay"],
    ["work-e658d3aee2e33c17aa38", "fantasy travel memory;school corridor and classroom"],
    ["work-f31a42ea4ad724acefa5", "household;street or bicycle;school"],
  ]),
  motionReferences: new Map([
    ["work-5b7cf2105a4bc6f6b46c", "official pages 15-17"],
    ["work-5e30ab3c7e3fb43e51f2", "official pages 5-7"],
    ["work-77008e04537e3fd889e2", "official spread 5 bounded panel sequence"],
    ["work-8a7846af8ead1797e6a2", "official page 10 bounded panel sequence"],
  ]),
};

export function runBatch005Overlay(mode: PromotionOverlayMode, root = process.cwd()) {
  return runPromotionOverlay(batch005Config, mode, root);
}

const invokedPath =
  process.argv[1] === undefined ? undefined : pathToFileURL(resolve(process.argv[1])).href;
if (invokedPath === import.meta.url) {
  try {
    const mode =
      process.argv[2] === "--check" ? "check" : process.argv[2] === "--write" ? "write" : undefined;
    if (mode === undefined)
      throw new Error("Usage: tsx scripts/build-batch-005-overlay.ts --check|--write");
    const result = runBatch005Overlay(mode);
    console.log(
      `Batch 005 overlay ${mode}: verified ${result.verified}; blocked ${result.blocked}; pending ${result.pending}.`,
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
