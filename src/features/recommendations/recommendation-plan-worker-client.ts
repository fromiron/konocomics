import type { RecommendationInput, RecommendationPlanEntry } from "@/domain/recommendation/types";

import type {
  RecommendationPlanWorkerRequest,
  RecommendationPlanWorkerResponse,
} from "./recommendation-plan-worker-protocol";

type PendingRequest = Readonly<{
  resolve: (plan: RecommendationPlanEntry[]) => void;
  reject: (error: Error) => void;
}>;

export class RecommendationPlanWorkerClient {
  private worker: Worker | null = null;
  private initialized = false;
  private nextRequestId = 1;
  private readonly pending = new Map<number, PendingRequest>();

  async build(input: RecommendationInput): Promise<RecommendationPlanEntry[]> {
    if (typeof Worker === "undefined") {
      return (await import("@/domain/recommendation/rank")).buildRecommendationPlan(input);
    }

    const worker = this.worker ?? this.createWorker();
    const requestId = this.nextRequestId++;
    const request: RecommendationPlanWorkerRequest = {
      type: "build",
      requestId,
      input: {
        records: input.records,
        adjustments: input.adjustments,
        policies: input.policies,
      },
      ...(this.initialized
        ? {}
        : { staticInput: { catalog: input.catalog, context: input.context } }),
    };

    return new Promise((resolve, reject) => {
      this.pending.set(requestId, { resolve, reject });
      try {
        worker.postMessage(request);
        this.initialized = true;
      } catch (error) {
        this.reset(error instanceof Error ? error : new Error("Recommendation worker failed"));
      }
    });
  }

  terminate() {
    this.reset(new Error("Recommendation worker terminated"));
  }

  private createWorker() {
    const worker = new Worker(new URL("./recommendation-plan.worker.ts", import.meta.url), {
      type: "module",
    });
    worker.onmessage = (event: MessageEvent<RecommendationPlanWorkerResponse>) => {
      const response = event.data;
      const pending = this.pending.get(response.requestId);
      if (pending === undefined) return;
      this.pending.delete(response.requestId);
      if (response.type === "result") pending.resolve(response.plan);
      else pending.reject(new Error(response.message));
    };
    worker.onerror = () => this.reset(new Error("Recommendation worker crashed"));
    worker.onmessageerror = () => this.reset(new Error("Recommendation worker response failed"));
    this.worker = worker;
    return worker;
  }

  private reset(error: Error) {
    const worker = this.worker;
    this.worker = null;
    this.initialized = false;
    if (worker !== null) {
      worker.onmessage = null;
      worker.onerror = null;
      worker.onmessageerror = null;
      worker.terminate();
    }
    for (const request of this.pending.values()) request.reject(error);
    this.pending.clear();
  }
}
