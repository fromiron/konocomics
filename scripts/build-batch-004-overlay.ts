import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

import {
  runPromotionOverlay,
  type PromotionOverlayConfig,
  type PromotionOverlayMode,
} from "./catalog/promotion-overlay";

const batch004Config: PromotionOverlayConfig = {
  batchId: "batch-004",
  batchLabel: "Batch 004",
  batchRoot: "data/staging/catalog-expansion/batches/batch-004",
  reviewReference: "reviews/batch-004-promotion-panel.md",
  reviewedAt: "2026-08-26T00:00:00+09:00",
  targetWorkCount: 50,
  expectedVerifiedPositions: [3, 7, 9, 14, 17, 18, 20, 21, 24, 41, 43, 44, 47, 49],
  chunks: ["01", "02", "03", "04", "05"],
  artPreflightReviewChunks: new Set(),
  annotationDirectory: "annotation-pass-a",
  artPreflightOverrideFiles: [
    "art-preflight/chunk-01/recovery-pos03-preflight.csv",
    "art-preflight/chunk-03/recovery-pos21-preflight.csv",
    "art-preflight/chunk-05/recovery-pos44-preflight.csv",
  ],
  terminalQaFiles: [
    "data/staging/catalog-expansion/batches/batch-004/reviews/daybreak-final-overlay-qa.md",
  ],
  blockerAdjudicationFile: "adjudication/blockers-final.csv",
  sceneContexts: new Map([
    [
      "work-0f3a44f5dcab9623d1be",
      "outdoor movement;indoor characters;Heian-kyō architecture;multi-person dialogue",
    ],
    ["work-2d385ad0525742330e70", "school and store;food interaction;apartment kitchen thriller"],
    ["work-3713ab561de583d709bc", "city street;convenience store;home restaurant"],
    [
      "work-39c1a2b6791238827ed5",
      "welding-floor worker safety;lunch and family;office interaction",
    ],
    ["work-44d0000353478596369e", "apartment family;workplace;restaurant group"],
    [
      "work-53fb816835ab36e40a1f",
      "vol2 barrier battle and aftermath exchange;vol3 outdoor confrontation and battle",
    ],
    ["work-65f856a6fa2078f21d2f", "eerie encounter;office;street action;aftermath"],
    [
      "work-c7280f9dcc2754d3f864",
      "supernatural room and forest;classroom conversation;school hallway",
    ],
    [
      "work-d8a87d01c1f35d58e791",
      "apartment entry and hallway;kitchen and dining meal interaction",
    ],
    [
      "work-e2f095e08fc5e08d5a2b",
      "formal meeting;school and transit;restaurant and home preparation",
    ],
    ["work-f8cb26831612e0c6ece5", "office and urban streets;interior action"],
    ["work-fd2a957c501c36047ed0", "supernatural threat;town and interior group"],
  ]),
  motionReferences: new Map(),
};

export function runBatch004Overlay(mode: PromotionOverlayMode, root = process.cwd()) {
  return runPromotionOverlay(batch004Config, mode, root);
}

const invokedPath =
  process.argv[1] === undefined ? undefined : pathToFileURL(resolve(process.argv[1])).href;
if (invokedPath === import.meta.url) {
  try {
    const mode =
      process.argv[2] === "--check" ? "check" : process.argv[2] === "--write" ? "write" : undefined;
    if (mode === undefined)
      throw new Error("Usage: tsx scripts/build-batch-004-overlay.ts --check|--write");
    const result = runBatch004Overlay(mode);
    console.log(
      `Batch 004 overlay ${mode}: verified ${result.verified}; blocked ${result.blocked}; pending ${result.pending}.`,
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
