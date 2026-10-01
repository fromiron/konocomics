// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { MediaPosterCard } from "@/components/media/media-poster-card";
import { RankingCard } from "@/components/media/ranking-card";
import { HomeDiscoveryShelf, HomeRankingShelf } from "@/features/landing/home-showcase";
import { landingStrings } from "@/lib/strings";

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    children,
    className,
    "aria-label": ariaLabel,
  }: {
    children: ReactNode;
    className?: string;
    "aria-label"?: string;
  }) => (
    <a aria-label={ariaLabel} className={className} href="/works/test-work">
      {children}
    </a>
  ),
}));

afterEach(cleanup);

describe("media card anatomy", () => {
  it("renders the first editorial rank on a cover-forward card", () => {
    const { container } = render(
      <ol>
        <RankingCard
          coverUrl="https://example.com/cover.jpg"
          creators={["作者"]}
          metadata="高い確信"
          position={1}
          priority
          rankingKind="editorial-ranking"
          title="作品名"
          workId="test-work"
        />
      </ol>,
    );

    expect(screen.getAllByText("1")).toHaveLength(1);
    expect(screen.getByText("作品名")).toBeTruthy();
    expect(screen.getByText("高い確信")).toBeTruthy();
    const basePosition = container.querySelector<HTMLElement>(
      '[data-ranking-editorial-position="true"]',
    );
    expect(basePosition?.className).toContain("text-[length:var(--font-size-32)]");
    expect(basePosition?.className).toContain("font-display");
    expect(container.querySelector("li")?.getAttribute("data-ranking-position")).toBe("1");
    expect(basePosition).toBeTruthy();
    expect(screen.getByRole("link").getAttribute("aria-label")).toMatch(/^おすすめ1位/u);
    expect(screen.getByRole("link").className).not.toContain("hover:-translate-y");
    expect(container.querySelectorAll("img")).toHaveLength(1);
    expect(container.querySelector("img")?.getAttribute("loading")).toBe("eager");
    const rankingCover = container.querySelector<HTMLElement>(".cover-image");
    expect(rankingCover?.className).toContain("aspect-[30/43]");
    expect(container.querySelector("img")?.className).toContain("object-contain");
    expect(container.querySelector('[data-cover-backdrop="true"]')).toBeNull();
    expect(container.querySelector("li")?.classList.contains("w-24")).toBe(true);
    expect(container.querySelector("li")?.classList.contains("sm:w-28")).toBe(true);
    expect(container.querySelector('[data-media-meta-line="true"]')).toBeNull();
    expect(container.querySelector(".lucide-circle")).toBeNull();
  });

  it("gives later editorial ranks the same cover-forward geometry", () => {
    const { container } = render(
      <ol>
        <RankingCard
          coverUrl="https://example.com/cover.jpg"
          creators={["作者"]}
          metadata="中程度の確信"
          position={2}
          priority
          rankingKind="editorial-ranking"
          title="次の作品"
          workId="test-work"
        />
      </ol>,
    );

    expect(screen.getAllByText("2")).toHaveLength(1);
    expect(container.querySelector('[data-ranking-editorial-position="true"]')).toBeTruthy();
    expect(container.querySelector("li")?.getAttribute("data-ranking-position")).toBe("2");
    expect(container.querySelector("img")?.getAttribute("loading")).toBe("lazy");
    expect(container.querySelector("li")?.classList.contains("w-24")).toBe(true);
    expect(container.querySelector("li")?.classList.contains("sm:w-28")).toBe(true);
    expect(container.querySelector(".cover-image")?.classList.contains("aspect-[30/43]")).toBe(
      true,
    );
  });

  it("renders personalized first place without an editorial marker", () => {
    const { container } = render(
      <ol>
        <RankingCard
          coverUrl="https://example.com/cover.jpg"
          creators={["作者"]}
          metadata="アクション · コメディ · ファンタジー"
          metadataAccessibleLabel="アクション · コメディ · ファンタジー"
          position={1}
          rankingKind="personalized-ranking"
          title="推薦作品"
          workId="test-work"
        />
      </ol>,
    );

    expect(screen.getByRole("link").getAttribute("aria-label")).toMatch(/^1位/u);
    expect(screen.queryByText("1位")).toBeNull();
    expect(screen.getByText("1")).toBeTruthy();
    expect(container.querySelector('[data-ranking-editorial-position="true"]')).toBeNull();
    const link = screen.getByRole("link");
    expect(link.className).toContain("p-[var(--space-3)]");
    expect(link.className).toContain("hover:bg-surface-2");
    expect(link.className).toContain("focus-visible:bg-surface-2");
    expect(container.querySelector("li")?.className).toContain("w-44");
    expect(container.querySelector(".cover-image")?.classList.contains("aspect-[30/43]")).toBe(
      true,
    );
    expect(container.querySelector(".cover-image")?.className).toContain(
      "shadow-[var(--shadow-cover-featured)]",
    );
    const rankingImage = container.querySelector<HTMLImageElement>(".cover-image__image");
    const rankingArtwork = container.querySelector<HTMLElement>(".cover-image__artwork");
    if (rankingImage === null || rankingArtwork === null) {
      throw new Error("Expected the ranking cover");
    }
    Object.defineProperties(rankingImage, {
      naturalHeight: { configurable: true, value: 160 },
      naturalWidth: { configurable: true, value: 160 },
    });
    fireEvent.load(rankingImage);
    expect(rankingImage.className).toContain("object-cover");
    expect(rankingArtwork.className).toContain("absolute inset-0");
    expect(rankingArtwork.style.aspectRatio).toBe("");
    expect(container.querySelector<HTMLElement>(".cover-image")?.style.aspectRatio).toBe("");
    const rankBadge = container.querySelector<HTMLElement>('[data-ranking-badge-position="true"]');
    // The rank stays visible without hover or focus so touch users can read the order (03 §4).
    expect(rankBadge?.className).not.toContain("opacity-0");
    expect(rankBadge?.className).not.toContain("group-hover/ranking:opacity-100");
    expect(rankBadge?.className).toContain("shadow-[var(--shadow-floating-action)]");
    expect(container.querySelector('[data-ranking-label="true"]')?.textContent).toBe(
      "アクション · コメディ · ファンタジー",
    );
    expect(container.querySelector('[data-ranking-label="true"]')?.className).toContain(
      "line-clamp-2",
    );
    expect(container.querySelector("button")).toBeNull();
  });

  it("opens unranked works without announcing or decorating a rank", () => {
    const { container } = render(
      <ul>
        <RankingCard
          creators={["著者"]}
          metadata="作者 著者"
          metadataAccessibleLabel="作者 著者"
          title="候補作品"
          variant="unranked"
          workId="test-work"
        />
      </ul>,
    );

    expect(
      screen.getByRole("link", { name: "「候補作品」の作品詳細を見る · 作者 著者" }),
    ).toBeTruthy();
    expect(screen.getByRole("listitem").hasAttribute("data-ranking-kind")).toBe(false);
    expect(screen.getByRole("listitem").hasAttribute("data-ranking-position")).toBe(false);
    expect(container.querySelector("[data-ranking-badge-position], .ranking-crown")).toBeNull();
  });

  it("crowns the personalized top three in gold, silver, and bronze without replacing rank text", () => {
    const { container, rerender } = render(<ol />);
    for (const position of [1, 2, 3, 4, 10]) {
      rerender(
        <ol>
          <RankingCard
            creators={["作者"]}
            position={position}
            rankingKind="personalized-ranking"
            title="推薦作品"
            workId="test-work"
          />
        </ol>,
      );
      expect(screen.getByText(String(position))).toBeTruthy();
      expect(screen.getByRole("link").getAttribute("aria-label")).toMatch(
        new RegExp(`^${String(position)}位`, "u"),
      );
      const expectedMedal = ["gold", "silver", "bronze"][position - 1];
      const crown = container.querySelector(".rank-crown");
      expect(crown?.getAttribute("data-medal") ?? undefined).toBe(expectedMedal);
      expect(
        container.querySelector("[data-ranking-badge-position]")?.getAttribute("data-medal") ??
          undefined,
      ).toBe(expectedMedal);
      if (crown !== null) expect(crown.getAttribute("aria-hidden")).toBe("true");
    }
  });

  it("renders the overlay poster hierarchy inside the full-cover card", () => {
    const { container } = render(
      <MediaPosterCard
        coverUrl="https://example.com/cover.jpg"
        creators={["作者"]}
        metadata="ファンタジー · 完結"
        presentation="cover-overlay"
        title="発見した作品"
        workId="test-work"
      />,
    );

    expect(screen.getByText("発見した作品")).toBeTruthy();
    expect(screen.getByText("作者 作者")).toBeTruthy();
    expect(screen.getByText("ファンタジー · 完結")).toBeTruthy();
    const poster = container.querySelector('[data-card-presentation="cover-overlay"]');
    expect(poster).toBeTruthy();
    expect(poster?.classList.contains("sm:w-38")).toBe(true);
    expect(
      poster?.classList.contains(
        "w-[calc((100vw-(var(--layout-page-padding)*2)-(var(--space-content-loose)*2))/2.4)]",
      ),
    ).toBe(true);
    expect(container.querySelector('[data-media-meta-line="true"]')).toBeTruthy();
    expect(container.querySelector(".lucide-book-open")).toBeNull();
    expect(screen.getByRole("link").className).not.toContain("translate-y");
    expect(container.querySelector("a")?.classList.contains("shadow-[var(--shadow-level-1)]")).toBe(
      false,
    );
    const posterCover = container.querySelector<HTMLElement>(".cover-image");
    expect(container.querySelectorAll("img")).toHaveLength(1);
    expect(posterCover?.className).not.toContain("object-cover");
    expect(container.querySelector(".cover-image__artwork")?.className).toContain(
      "rounded-[var(--radius-cover)]",
    );
    expect(container.querySelector(".cover-image__image")?.className).toContain("object-contain");
    expect(container.querySelector('[data-cover-backdrop="true"]')).toBeNull();
  });

  it("keeps the standard poster desktop width independent from the discovery overlay", () => {
    const { container } = render(
      <MediaPosterCard
        coverUrl="https://example.com/cover.jpg"
        creators={["作者"]}
        title="標準作品"
        workId="standard-work"
      />,
    );

    const poster = container.querySelector("article");
    expect(poster?.classList.contains("sm:w-40")).toBe(true);
    expect(poster?.classList.contains("sm:w-38")).toBe(false);
  });

  it("shares a text-only catalog metadata contract while preserving multi-genre detail", () => {
    const works = [
      {
        id: "multi-genre-work",
        title: "複数ジャンル作品",
        creators: ["作者"],
        genres: ["action" as const, "fantasy" as const, "horror" as const],
        status: "completed" as const,
      },
    ];
    const coverUrls = new Map([["multi-genre-work", "https://example.com/cover.jpg"]]);

    render(
      <>
        <HomeRankingShelf coverUrls={coverUrls} works={works} />
        <HomeDiscoveryShelf coverUrls={coverUrls} works={works} />
      </>,
    );

    const ranking = screen.getByRole("list", { name: landingStrings.ranking.title });
    const discovery = screen
      .getByRole("heading", { name: landingStrings.discovery.title })
      .closest("section")
      ?.querySelector<HTMLElement>("[data-media-shelf-track]");
    expect(discovery).toBeTruthy();
    if (discovery === null || discovery === undefined) return;
    expect(within(ranking).getByText("アクション +2")).toBeTruthy();
    expect(within(discovery).getByText("アクション ほか2 · 完結")).toBeTruthy();
    expect(ranking.querySelector('[data-media-meta-line="true"]')).toBeNull();
    expect(discovery.querySelector('[data-media-meta-line="true"]')).toBeTruthy();
    expect(ranking.querySelector(".lucide-circle")).toBeNull();
    expect(discovery.querySelector(".lucide-book-open")).toBeNull();
    expect(within(ranking).getByRole("link").getAttribute("aria-label")).toContain(
      "ジャンル アクション、ファンタジー、ホラー。刊行状況 完結",
    );
    expect(within(discovery).getByRole("link").getAttribute("aria-label")).toContain(
      "ジャンル アクション、ファンタジー、ホラー。刊行状況 完結",
    );
  });
});
