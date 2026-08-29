/// <reference lib="webworker" />

import { buildRecommendationPlan } from "@/domain/recommendation/rank";
import type { RecommendationInput } from "@/domain/recommendation/types";

import type {
  RecommendationPlanWorkerRequest,
  RecommendationPlanWorkerResponse,
} from "./recommendation-plan-worker-protocol";

const workerScope = self as DedicatedWorkerGlobalScope;
let staticInput: Pick<RecommendationInput, "catalog" | "context"> | null = null;

workerScope.addEventListener("message", (event: MessageEvent<RecommendationPlanWorkerRequest>) => {
  const request = event.data;
  if (request.staticInput !== undefined) staticInput = request.staticInput;

  let response: RecommendationPlanWorkerResponse;
  try {
    if (staticInput === null) throw new Error("Recommendation worker is not initialized");
    response = {
      type: "result",
      requestId: request.requestId,
      plan: buildRecommendationPlan({ ...staticInput, ...request.input }),
    };
  } catch (error) {
    response = {
      type: "error",
      requestId: request.requestId,
      message: error instanceof Error ? error.message : "Recommendation calculation failed",
    };
  }
  workerScope.postMessage(response);
});
