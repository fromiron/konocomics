import type { ComponentType } from "react";

import type { RecommendationMotionListProps } from "./recommendation-motion-list";

export async function loadRecommendationMotionList(): Promise<
  ComponentType<RecommendationMotionListProps>
> {
  const motionModule = await import("./recommendation-motion-list");
  return motionModule.RecommendationMotionList;
}
