// @vitest-environment jsdom

import { cleanup, render, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import catalogJson from "@/data/generated/catalog-v1.json";
import { catalogV1Schema } from "@/domain/catalog/schema";
import type { RecommendationPlanEntry } from "@/domain/recommendation/types";
import { RecommendationShelfCard } from "@/features/recommendations/recommendation-shelf-card";
import { mediaStrings } from "@/lib/strings";

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    "aria-label": ariaLabel,
    children,
    className,
    params,
  }: {
    "aria-label"?: string;
    children: ReactNode;
    className?: string;
    params?: { workId: string };
  }) => (
    <a aria-label={ariaLabel} className={className} href={`/works/${params?.workId ?? "missing"}`}>
      {children}
    </a>
  ),
}));

vi.mock("@/components/cover/CoverImage", () => ({
  coverSourceForSize: (coverUrl: string) => coverUrl,
  CoverImage: ({
    className,
    fit,
    title,
  }: {
    className?: string;
    fit?: "contain" | "cover";
    title: string;
  }) => <span aria-label={title} className={className} data-cover-fit={fit} role="img" />,
}));

const catalog = catalogV1Schema.parse(catalogJson);
const fixtureWork = catalog.works.find((candidate) => candidate.eligibility.recommendationEligible);

if (fixtureWork === undefined) throw new Error("Expected a recommendation shelf fixture");

const work = fixtureWork;

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

function renderShelfCard(
  variant: "anchor" | "discovery" | "completed",
  coverUrl: string | null = "https://example.com/cover.jpg",
) {
  return render(
    <RecommendationShelfCard
      coverUrl={coverUrl}
      entry={entry}
      onPreview={vi.fn()}
      resolveTitle={() => work.title}
      variant={variant}
      volumeCount={12}
      work={work}
    />,
  );
}

afterEach(cleanup);

describe("RecommendationShelfCard", () => {
  it.each(["discovery", "completed"] as const)(
    "keeps the %s shelf card dense without losing its cover and text hierarchy",
    (variant) => {
      const { container } = renderShelfCard(variant);

      const card = container.querySelector<HTMLElement>(
        `[data-recommendation-shelf-card="${variant}"]`,
      );
      if (card === null) throw new Error(`Missing ${variant} shelf card`);
      expect(within(card).getByRole("img", { name: work.title })).toBeTruthy();
      expect(within(card).getByRole("heading", { level: 3, name: work.title })).toBeTruthy();
      if (variant === "completed") {
        expect(card.textContent).toContain("ふつう");
        expect(card.className).toContain("border-transparent");
        expect(card.className).toContain("bg-transparent");
        expect(card.className).toContain("hover:bg-surface-2");
        expect(card.className).not.toContain("hover:border");
      } else {
        expect(card.textContent).not.toContain("ふつう");
      }
      expect(card.className).toContain("md:grid-cols-[auto_minmax(0,1fr)]");
      expect(card.className).toContain("md:min-w-60");
      expect(
        within(card).getByRole("link", { name: mediaStrings.openDetails(work.title) }).className,
      ).toContain("md:aspect-[30/43]");
      expect(within(card).getByRole("img", { name: work.title }).className).toContain(
        "aspect-[30/43]",
      );
      expect(within(card).getByRole("img", { name: work.title }).className).not.toContain(
        "md:aspect-auto",
      );
      expect(within(card).getByRole("img", { name: work.title }).className).not.toContain(
        "object-top",
      );
    },
  );

  it("morphs only a resolved discovery cover inside its fixed card geometry", () => {
    const { container } = renderShelfCard("discovery");
    const card = container.querySelector<HTMLElement>(
      '[data-recommendation-shelf-card="discovery"]',
    );
    if (card === null) throw new Error("Missing discovery shelf card");

    const cover = within(card).getByRole("img", { name: work.title });
    const coverLink = within(card).getByRole("link", {
      name: mediaStrings.openDetails(work.title),
    });
    expect(card.className).toContain("md:grid-rows-1");
    expect(card.className).toContain("bg-transparent");
    expect(card.className).toContain("focus-within:bg-surface-2");
    expect(card.className).toContain("hover:bg-surface-2");
    expect(card.className).not.toContain("hover:border-line-accent");
    expect(coverLink.className).toContain("md:aspect-[30/43]");
    expect(cover.getAttribute("data-cover-fit")).toBe("cover");
    expect(cover.className).toContain("[clip-path:inset(15.116279%_0_round_50%_/_34.883721%)]");
    expect(cover.className).toContain("transition-[clip-path]");
    expect(cover.className).toContain("ease-linear");
    expect(cover.className).not.toContain("var(--radius-pill)");
    expect(cover.className).not.toContain("border-color");
    expect(cover.className).toContain(
      "group-focus-within/shelf-card:[clip-path:inset(0_round_var(--radius-cover))]",
    );
    expect(cover.className).toContain(
      "group-hover/shelf-card:[clip-path:inset(0_round_var(--radius-cover))]",
    );
    expect(cover.className).toContain("motion-reduce:transition-none");
  });

  it("keeps the anchor border static on hover", () => {
    const { container } = renderShelfCard("anchor");
    const card = container.querySelector<HTMLElement>('[data-recommendation-shelf-card="anchor"]');
    if (card === null) throw new Error("Missing anchor shelf card");

    expect(card.className).toContain("border-line/80");
    expect(card.className).not.toContain("hover:border");
  });

  it("keeps a missing discovery cover rectangular and uncropped", () => {
    const { container } = renderShelfCard("discovery", null);
    const card = container.querySelector<HTMLElement>(
      '[data-recommendation-shelf-card="discovery"]',
    );
    if (card === null) throw new Error("Missing discovery shelf card");

    const cover = within(card).getByRole("img", { name: work.title });
    expect(cover.getAttribute("data-cover-fit")).toBe("contain");
    expect(cover.className).not.toContain("clip-path");
  });

  it.each(["anchor", "discovery", "completed"] as const)(
    "exposes a quiet Quick Preview control on the %s shelf card",
    (variant) => {
      const { container } = renderShelfCard(variant);

      const card = container.querySelector<HTMLElement>(
        `[data-recommendation-shelf-card="${variant}"]`,
      );
      if (card === null) throw new Error(`Missing ${variant} shelf card`);
      const preview = within(card).getByRole("button", {
        name: `「${work.title}」をクイック表示`,
      });
      expect(preview.className).toContain("quiet-text-action");
      expect(preview.textContent?.replaceAll(/\s+/gu, "")).toBe("クイック表示");
      expect(preview.textContent).not.toContain(work.title);
      expect(preview.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
      for (const link of within(card).getAllByRole("link")) {
        expect(link.contains(preview)).toBe(false);
      }
    },
  );

  it.each(["anchor", "discovery", "completed"] as const)(
    "sends the %s cover and title to work details without nesting Quick Preview",
    (variant) => {
      const { container } = renderShelfCard(variant);

      const card = container.querySelector<HTMLElement>(
        `[data-recommendation-shelf-card="${variant}"]`,
      );
      if (card === null) throw new Error(`Missing ${variant} shelf card`);
      const detailsHref = `/works/${work.id}`;
      const coverLink = within(card).getByRole("link", {
        name: mediaStrings.openDetails(work.title),
      });
      expect(coverLink.getAttribute("href")).toBe(detailsHref);
      const title = within(card).getByRole("heading", { level: 3, name: work.title });
      const titleLink = title.closest("a");
      expect(titleLink?.getAttribute("href")).toBe(detailsHref);
      const preview = within(card).getByRole("button", {
        name: `「${work.title}」をクイック表示`,
      });
      expect(coverLink.contains(preview)).toBe(false);
      expect(titleLink?.contains(preview)).toBe(false);
    },
  );
});
