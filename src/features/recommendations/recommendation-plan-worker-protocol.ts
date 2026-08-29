import type { RecommendationInput, RecommendationPlanEntry } from "@/domain/recommendation/types";

type RecommendationStaticInput = Pick<RecommendationInput, "catalog" | "context">;
type RecommendationDynamicInput = Pick<RecommendationInput, "records" | "adjustments" | "policies">;

export type RecommendationPlanWorkerRequest = Readonly<{
  type: "build";
  requestId: number;
  staticInput?: RecommendationStaticInput;
  input: RecommendationDynamicInput;
}>;

export type RecommendationPlanWorkerResponse =
  | Readonly<{
      type: "result";
      requestId: number;
      plan: RecommendationPlanEntry[];
    }>
  | Readonly<{
      type: "error";
      requestId: number;
      message: string;
    }>;
