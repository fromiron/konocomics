import type { CatalogV1 } from "@/domain/catalog/types";
import type { CatalogManifest } from "@/features/catalog/catalog-assets-schema";
import type { RecommendationInput, RecommendationPlanEntry } from "@/domain/recommendation/types";

type RecommendationStaticInput = Pick<RecommendationInput, "catalog" | "context">;
type RecommendationDynamicInput = Pick<RecommendationInput, "records" | "adjustments" | "policies">;

export type RecommendationPlanWorkerRequest =
  | TastePreviewRequest
  | Readonly<{
      type: "build";
      requestId: number;
      staticInput?: RecommendationStaticInput;
      input: RecommendationDynamicInput;
    }>;

export type TastePreviewInput = RecommendationDynamicInput & {
  baselineAdjustments: RecommendationInput["adjustments"];
};
export type TastePreviewRequest = Readonly<{
  type: "preview";
  requestId: number;
  manifest: CatalogManifest;
  input: TastePreviewInput;
}>;
export type TastePreviewResult = Readonly<{
  before: RecommendationPlanEntry[];
  after: RecommendationPlanEntry[];
  catalog: CatalogV1;
}>;
export type RecommendationPlanWorkerResponse =
  | Readonly<{ type: "preview-result"; requestId: number; preview: TastePreviewResult }>
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
