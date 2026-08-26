import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

process.env.KONOCOMICS_PROMOTION_BATCH_ID = "batch-005";

export async function runBatch005Promotion(mode: "check" | "write", root = process.cwd()) {
  const { runBatch002Promotion } = await import("./promote-batch-002");
  return runBatch002Promotion(mode, root);
}

const invokedPath =
  process.argv[1] === undefined ? undefined : pathToFileURL(resolve(process.argv[1])).href;
if (invokedPath === import.meta.url) {
  try {
    const mode =
      process.argv[2] === "--check" ? "check" : process.argv[2] === "--write" ? "write" : undefined;
    if (mode === undefined)
      throw new Error("Usage: tsx scripts/promote-batch-005.ts --check|--write");
    const result = await runBatch005Promotion(mode);
    console.log(
      `Batch 005 ${mode} (${result.state}): ${result.catalogVersion}; Gold ${result.goldCount}; verified ${result.verifiedCount}; blocked ${result.blockedCount}; pending ${result.pendingCount}; profile ${result.profileWorkCount}.`,
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
