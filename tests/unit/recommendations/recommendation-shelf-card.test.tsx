// @vitest-environment jsdom

import { cleanup, render } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import catalogJson from "@/data/generated/catalog-v1.json";
import { catalogV1Schema } from "@/domain/catalog/schema";
import type { RecommendationPlanEntry } from "@/domain/recommendation/types";
import { RecommendationShelfCard } from "@/features/recommendations/recommendation-shelf-card";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, className }: { children: ReactNode; className?: string }) => (
    <a className={className} href="/works/test-work">
      {children}
    </a>
  ),
}));

vi.mock("@/components/cover/CoverImage", () => ({
  CoverImage: ({ className, title }: { className?: string; title: string }) => (
    <span aria-label={title} className={className} role="img" />
  ),
}));

const catalog = catalogV1Schema.parse(catalogJson);
const work = catalog.works.find((candidate) => candidate.eligibility.recommendationEligible);

if (work === undefined) throw new Error("Expected a recommendation shelf fixture");

const entry: RecommendationPlanEntry = {
  workId: work.id,
  tasteScore: 0.9,
  confidence: 0.8,
  confidenceLevel: "normal",
  bestAnchorId: work.id,
  contributions: [
    {
      source: "similarity",
      group: "narrative",
      factorId: "strategy",
      value: 0.2,
      anchorWorkIds: [work.id],
      explainable: true,
    },
  ],
  penaltiesApplied: [],
  isDiscovery: true,
  majorThemeKey: `fixture:${work.id}`,
  seriesGroupId: work.id,
};

afterEach(cleanup);

describe("RecommendationShelfCard", () => {
  it.each(["discovery", "completed"] as const)(
    "keeps the %s shelf card dense without losing its cover and text hierarchy",
    (variant) => {
      const { container } = render(
        <RecommendationShelfCard
          coverUrl="https://example.com/cover.jpg"
          entry={entry}
          onPreview={vi.fn()}
          resolveTitle={() => work.title}
          variant={variant}
          volumeCount={12}
          work={work}
        />,
      );

      const card = container.querySelector<HTMLElement>(
        `[data-recommendation-shelf-card="${variant}"]`,
      );
      expect(card).toBeTruthy();
      expect(card?.className).toContain("md:min-w-[10.5rem]");
      expect(card?.className).not.toContain("md:max-w");
      expect(card?.querySelector("a")?.className).toContain("md:grid-cols-[3.5rem_minmax(0,1fr)]");
      expect(card?.querySelector("h3")?.className).toContain("font-bold");
      expect(card?.textContent).toContain("ふつう");
    },
  );
});
