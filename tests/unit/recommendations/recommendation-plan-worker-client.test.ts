import { afterEach, describe, expect, it, vi } from "vitest";

import type { RecommendationInput } from "@/domain/recommendation/types";
import { RecommendationPlanWorkerClient } from "@/features/recommendations/recommendation-plan-worker-client";
import type {
  RecommendationPlanWorkerRequest,
  RecommendationPlanWorkerResponse,
} from "@/features/recommendations/recommendation-plan-worker-protocol";

const input: RecommendationInput = {
  catalog: {
    schemaVersion: 1,
    catalogVersion: "test",
    factorDictionaryVersion: "v1",
    works: [],
    volumes: [],
    representativeVolumeByWorkId: {},
  },
  context: {
    constraintByWorkId: {},
    marketSnapshot: { catalogVersion: "test", catalogAverageRating: 0, byWorkId: {} },
  },
  records: [],
  adjustments: { axes: {}, themes: {} },
  policies: {
    preferCompleted: false,
    preferHidden: false,
    preferVerified: false,
    excludeIncomplete: false,
  },
};

class TestWorker {
  static instances: TestWorker[] = [];
  onmessage: ((event: MessageEvent<RecommendationPlanWorkerResponse>) => void) | null = null;
  onerror: (() => void) | null = null;
  onmessageerror: ((event: MessageEvent) => void) | null = null;
  readonly messages: RecommendationPlanWorkerRequest[] = [];
  terminated = false;

  constructor() {
    TestWorker.instances.push(this);
  }

  postMessage(message: RecommendationPlanWorkerRequest) {
    this.messages.push(message);
  }

  respond(response: RecommendationPlanWorkerResponse) {
    this.onmessage?.(new MessageEvent("message", { data: response }));
  }

  crash() {
    this.onerror?.();
  }

  terminate() {
    this.terminated = true;
  }
}

afterEach(() => {
  TestWorker.instances = [];
  vi.unstubAllGlobals();
});

describe("RecommendationPlanWorkerClient", () => {
  it("sends static input once and recreates a clean worker after a crash", async () => {
    vi.stubGlobal("Worker", TestWorker);
    const client = new RecommendationPlanWorkerClient();

    const firstPlan = client.build(input);
    const firstWorker = TestWorker.instances[0];
    const firstRequest = firstWorker?.messages[0];
    if (firstWorker === undefined || firstRequest === undefined) throw new Error("Missing worker");
    expect(firstRequest.staticInput).toEqual({ catalog: input.catalog, context: input.context });
    firstWorker.respond({ type: "result", requestId: firstRequest.requestId, plan: [] });
    await expect(firstPlan).resolves.toEqual([]);

    const secondPlan = client.build({ ...input, records: [] });
    const secondRequest = firstWorker.messages[1];
    if (secondRequest === undefined) throw new Error("Missing second request");
    expect(secondRequest.staticInput).toBeUndefined();

    const thirdPlan = client.build({ ...input, records: [] });
    const secondFailure = secondPlan.catch((error: unknown) => error);
    const thirdFailure = thirdPlan.catch((error: unknown) => error);
    firstWorker.crash();
    await expect(Promise.all([secondFailure, thirdFailure])).resolves.toEqual([
      expect.objectContaining({ message: "Recommendation worker crashed" }),
      expect.objectContaining({ message: "Recommendation worker crashed" }),
    ]);
    expect(firstWorker.terminated).toBe(true);

    const retryPlan = client.build(input);
    const retryWorker = TestWorker.instances[1];
    const retryRequest = retryWorker?.messages[0];
    if (retryWorker === undefined || retryRequest === undefined) {
      throw new Error("Missing retry worker");
    }
    expect(retryRequest.staticInput).toEqual({ catalog: input.catalog, context: input.context });
    retryWorker.respond({ type: "result", requestId: retryRequest.requestId, plan: [] });
    await expect(retryPlan).resolves.toEqual([]);
    client.terminate();
  });
});
