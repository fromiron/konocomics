/// <reference lib="webworker" />
import { buildRecommendationPlanSteps } from "@/domain/recommendation/rank";
import { selectRecommendationPlanEntries } from "@/domain/recommendation/ordering";
import { serializeRecommendationInput } from "@/domain/recommendation/input-hash";
import type { RecommendationInput, RecommendationPlanEntry } from "@/domain/recommendation/types";
import { loadCompleteCatalog, type CatalogSelection } from "@/features/catalog/catalog-assets";
import type {
  RecommendationPlanWorkerRequest,
  RecommendationPlanWorkerResponse,
} from "./recommendation-plan-worker-protocol";

const workerScope = self as DedicatedWorkerGlobalScope;
let staticInput: Pick<RecommendationInput, "catalog" | "context"> | null = null;
let assets: { key: string; promise: Promise<CatalogSelection> } | undefined;
let latestPreview = 0;
const plans = new Map<string, RecommendationPlanEntry[]>();
async function calculate(input: RecommendationInput, isCurrent: () => boolean, preview = false) {
  const key = `${preview ? "preview" : "full"}:${serializeRecommendationInput(input)}`;
  const cached = plans.get(key);
  if (cached !== undefined) return cached;
  const steps = buildRecommendationPlanSteps(input);
  let next = steps.next();
  while (!next.done) {
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
    if (!isCurrent()) throw new Error("Recommendation request superseded");
    next = steps.next();
  }
  const result = preview
    ? selectRecommendationPlanEntries(next.value, input.policies).slice(0, 4)
    : next.value;
  plans.set(key, result);
  while (plans.size > 4) plans.delete(plans.keys().next().value!);
  return result;
}
workerScope.addEventListener("message", (event: MessageEvent<RecommendationPlanWorkerRequest>) => {
  const request = event.data;
  if (request.type === "preview") latestPreview = request.requestId;
  void (async () => {
    let response: RecommendationPlanWorkerResponse;
    try {
      if (request.type === "preview") {
        const assetKey = JSON.stringify(request.manifest);
        if (assets?.key !== assetKey) {
          const promise = loadCompleteCatalog(request.manifest);
          assets = { key: assetKey, promise };
          void promise.catch(() => {
            if (assets?.promise === promise) assets = undefined;
          });
        }
        const full = await assets.promise;
        const current = () => latestPreview === request.requestId;
        if (!current()) throw new Error("Recommendation request superseded");
        const before = await calculate(
          { ...full, ...request.input, adjustments: request.input.baselineAdjustments },
          current,
          true,
        );
        const after = await calculate({ ...full, ...request.input }, current, true);
        if (!current()) throw new Error("Recommendation request superseded");
        const ids = new Set([...before, ...after].map((entry) => entry.workId));
        const catalog = {
          ...full.catalog,
          works: full.catalog.works.filter((work) => ids.has(work.id)),
          volumes: full.catalog.volumes.filter((volume) => ids.has(volume.workId)),
          representativeVolumeByWorkId: Object.fromEntries(
            Object.entries(full.catalog.representativeVolumeByWorkId).filter(([id]) => ids.has(id)),
          ),
        };
        response = {
          type: "preview-result",
          requestId: request.requestId,
          preview: { before, after, catalog },
        };
      } else {
        if (request.staticInput !== undefined) {
          staticInput = request.staticInput;
          plans.clear();
        }
        if (staticInput === null) throw new Error("Recommendation worker is not initialized");
        response = {
          type: "result",
          requestId: request.requestId,
          plan: await calculate({ ...staticInput, ...request.input }, () => true),
        };
      }
    } catch (error) {
      response = {
        type: "error",
        requestId: request.requestId,
        message: error instanceof Error ? error.message : "Recommendation calculation failed",
      };
    }
    workerScope.postMessage(response);
  })();
});
