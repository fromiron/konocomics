import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

import {
  runPromotionOverlay,
  type PromotionOverlayConfig,
  type PromotionOverlayMode,
} from "./catalog/promotion-overlay";

const sceneContexts = new Map<string, string>([
  ["work-017446dd1a9039d9839b", "street dialogue;shoe-locker encounter"],
  ["work-02d5d329c9ef85e481cb", "crowded street;wooden shop interior;sumo stable"],
  ["work-089947c5303024841fef", "office investigation;street confrontation"],
  ["work-0e036724913c69bb937a", "snow settlement;family dialogue"],
  ["work-1088a1dc00a3b0d22201", "carrier interior;bridge confrontation;aftermath"],
  ["work-19a26f01512166856a6a", "train interior;snowy exterior"],
  ["work-1e27731b880d0d9012f8", "classroom and corridor;stair and washroom;bucket collision"],
  ["work-207bb1ca28b7472fbe1d", "home and training;vehicle and animal;kendo strike"],
  ["work-23851cd7ccf1d0c676cc", "urban street;protective-suit response;monster confrontation"],
  ["work-29d4300ad9d3358fb67a", "shop search;later investigation"],
  ["work-3dfaf6231e21133620c6", "public concourse;gang-hall confrontation"],
  ["work-3e725951eb9c49771087", "town arrival;restaurant meal;fall response"],
  ["work-4c784fc78dfd9b139c3f", "classroom;home night;later school"],
  ["work-518d7ed42dd9253679c3", "army march;water demonstration;fortress arrival"],
  ["work-53e54c95f637b66c4fb2", "roadside conflict;field chase;station departure"],
  ["work-5915d6d7601377fcc75f", "journey encounter;conversation;confrontation"],
  ["work-5b4dc4e6e966436b2990", "domestic reunion;child episode;workplace"],
  ["work-5b9a3ec60ac5fc90f444", "auction;fairy bath;bedroom"],
  ["work-5e20323e014d6d390aaf", "practice assembly;armor training;match movement"],
  ["work-5ebbc9bede841d2faf7b", "office daydream;family encounter;city walk"],
  [
    "work-6f849a8e785deee3d5dc",
    "vehicle and rural road;carcass investigation;courtyard confrontation",
  ],
  ["work-71e824df2e6bc2125294", "hallway attack;urban exterior;warehouse fight"],
  ["work-7975d62582a89492a35f", "library entrance;equipment and textiles;crowd and architecture"],
  ["work-7d259c925286a9f91310", "station arrival;market encounter;train conversation"],
  ["work-8147aefccc365b0ecb4d", "estate introduction;servant encounter;decorative close-up"],
  ["work-838a6f0ad2d1ef487588", "rural arrival;forest pursuit;historical confrontation"],
  ["work-9072892a767332254f00", "school departure;home bookcase;doorway mishap"],
  ["work-98b7d2ef065bde405972", "first meeting;smoking conversation;store departure"],
  ["work-a8349445836546a82934", "food supply;dairy;household purchasing"],
  ["work-ab95f4d4997113e0687a", "confession response;manga work;renewed confession"],
  ["work-ad32c71b07fd13c65a79", "awakening;courtyard exchange;school corridor"],
  ["work-bbeeaad9e37ab267dc29", "motorcycle arrival;kitchen quiz;emotional misunderstanding"],
  ["work-c221a17d6b962b17c9f4", "village death;truck-stop arrival;village road"],
  ["work-c55467873ec70e670484", "ship confrontation;corpse declaration;laboratory corridor"],
  ["work-ccf0ddff9c6410c4de14", "pitching trial;classroom recruitment;batting test"],
  ["work-cdef8cfd678998a51447", "kitchen arrival;memorial hall;family negotiation"],
  ["work-ced7a8e6d9c3b8147702", "rainy arrival;room introduction;family memory"],
  ["work-daf65c6f2cce3e076dfa", "workplace;relationship apartment;new apartment"],
  ["work-db80d94709b62aa8823f", "ceremonial procession;prophecy encounter;burning estate"],
  ["work-ef1bdac46a0956a87f7f", "schoolyard meeting;home and dog;solitary search"],
  ["work-f5847c45d30753150364", "rooftop injury;domestic fever;nighttime eye change"],
  ["work-fabc7f5d853e361acaf3", "jungle tiger encounter;city meeting;sword sparring"],
]);

const motionReferences = new Map([
  ["work-1e27731b880d0d9012f8", "printed page 20 panels 1-5"],
  ["work-207bb1ca28b7472fbe1d", "printed page 23 panels 1-5"],
  ["work-71e824df2e6bc2125294", "official pages 10-11"],
  ["work-ccf0ddff9c6410c4de14", "official pages 10-11"],
  ["work-fabc7f5d853e361acaf3", "official pages 36-37"],
]);

const batch002Config: PromotionOverlayConfig = {
  batchId: "batch-002",
  batchLabel: "Batch 002",
  batchRoot: "data/staging/catalog-expansion/batches/batch-002",
  reviewReference: "reviews/batch-002-promotion-panel.md",
  reviewedAt: "2026-08-23T00:00:00+09:00",
  targetWorkCount: 50,
  expectedVerifiedPositions: [
    2, 3, 4, 6, 9, 10, 12, 13, 15, 17, 18, 20, 22, 24, 25, 26, 28, 29, 32, 33, 35, 36, 37, 38, 39,
    40, 41, 42, 43, 44, 45, 46, 48,
  ],
  chunks: ["01", "02", "03", "04", "05"],
  artPreflightReviewChunks: new Set(["04"]),
  sceneContexts,
  motionReferences,
};

export function runBatch002Overlay(mode: PromotionOverlayMode, root = process.cwd()) {
  return runPromotionOverlay(batch002Config, mode, root);
}

const invokedPath =
  process.argv[1] === undefined ? undefined : pathToFileURL(resolve(process.argv[1])).href;
if (invokedPath === import.meta.url) {
  try {
    const mode =
      process.argv[2] === "--check" ? "check" : process.argv[2] === "--write" ? "write" : undefined;
    if (mode === undefined)
      throw new Error("Usage: tsx scripts/build-batch-002-overlay.ts --check|--write");
    const result = runBatch002Overlay(mode);
    console.log(
      `Batch 002 overlay ${mode}: verified ${result.verified}; blocked ${result.blocked}.`,
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
