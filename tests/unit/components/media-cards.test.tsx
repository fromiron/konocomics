// @vitest-environment jsdom

import { cleanup, render, screen, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { MediaPosterCard } from "@/components/media/media-poster-card";
import { RankingCard } from "@/components/media/ranking-card";
import { ShowcaseCard } from "@/components/media/showcase-card";
import {
  HomeDiscoveryShelf,
  HomeRankingShelf,
  HomeShowcaseShelf,
} from "@/features/landing/home-showcase";
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
          metadata="高い確信"
          position={1}
          rankingKind="personalized-ranking"
          title="推薦作品"
          workId="test-work"
        />
      </ol>,
    );

    expect(screen.getByRole("link").getAttribute("aria-label")).toMatch(/^1位/u);
    expect(screen.getAllByText("1")).toHaveLength(1);
    expect(container.querySelector('[data-ranking-editorial-position="true"]')).toBeNull();
    expect(screen.getByRole("link").className).not.toContain("translate-y");
    expect(container.querySelector("li")?.className).toContain(
      "w-[calc(var(--control-min-size)*1.75)]",
    );
    expect(container.querySelector(".cover-image")?.classList.contains("aspect-[30/43]")).toBe(
      true,
    );
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
    expect(posterCover?.className).toContain("[&>img]:!object-cover");
    expect(posterCover?.className).toContain("[&>img]:!object-top");
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

  it("renders a cover-forward featured showcase card with truthful supporting text", () => {
    const { container } = render(
      <ShowcaseCard
        coverUrl="https://example.com/cover.jpg"
        creators={["作者"]}
        featured
        metadata="アクション · 完結"
        ordinal={1}
        priority
        title="注目作品"
        workId="test-work"
      />,
    );

    expect(screen.getByRole("link", { name: /注目作品/u })).toBeTruthy();
    expect(screen.getByRole("link", { name: /注目作品/u }).getAttribute("aria-label")).not.toMatch(
      /1位/u,
    );
    expect(screen.getByText("注目作品")).toBeTruthy();
    expect(screen.getByText("作者 作者")).toBeTruthy();
    expect(screen.getByText("アクション · 完結")).toBeTruthy();
    expect(container.querySelector('[data-card-presentation="showcase"]')).toBeTruthy();
    expect(container.querySelector('[data-featured="true"]')).toBeTruthy();
    expect(screen.getByRole("link").className).not.toContain("hover:-translate-y");
    expect(container.querySelector("article")?.classList.contains("md:w-56")).toBe(true);
    expect(container.querySelectorAll(".cover-image")).toHaveLength(1);
    expect(container.querySelectorAll("img")).toHaveLength(1);
    expect(container.querySelector(".cover-image")?.className).toContain("aspect-[30/43]");
    expect(container.querySelector("img")?.className).toContain("object-contain");
    expect(screen.getByRole("heading", { name: "注目作品" }).className).toContain(
      "text-[length:var(--font-size-16)]",
    );
  });

  it("keeps the collapsed showcase on the compact cover-forward geometry", () => {
    const { container } = render(
      <ShowcaseCard
        coverUrl="https://example.com/cover.jpg"
        creators={["作者"]}
        metadata="日常 · 連載中"
        title="通常作品"
        workId="test-work"
      />,
    );

    expect(container.querySelector('[data-featured="true"]')).toBeNull();
    expect(container.querySelector("article")?.classList.contains("md:w-44")).toBe(true);
    expect(container.querySelectorAll(".cover-image")).toHaveLength(1);
    expect(container.querySelector(".cover-image")?.className).toContain("aspect-[30/43]");
    expect(container.querySelector("img")?.className).toContain("object-contain");
    expect(screen.getByRole("heading", { name: "通常作品" }).className).toContain(
      "text-[length:var(--font-size-14)]",
    );
  });

  it("keeps foreground img node and src stable when featured toggles and requestedSize stays 400", () => {
    const coverUrl = "https://example.com/cover.jpg";
    const { container, rerender } = render(
      <ShowcaseCard
        coverUrl={coverUrl}
        creators={["作者"]}
        featured
        title="安定性"
        workId="test-work"
      />,
    );

    const coverBefore = container.querySelector(".cover-image") as HTMLElement;
    const imgBefore = coverBefore.querySelector("img.cover-image__image") as HTMLImageElement;
    const srcBefore = imgBefore.getAttribute("src") ?? "";
    expect(srcBefore).toContain("_ex=400x400");
    expect(srcBefore).not.toContain("_ex=600x600");

    rerender(
      <ShowcaseCard
        coverUrl={coverUrl}
        creators={["作者"]}
        featured={false}
        title="安定性"
        workId="test-work"
      />,
    );

    const coverAfter = container.querySelector(".cover-image") as HTMLElement;
    const imgAfter = coverAfter.querySelector("img.cover-image__image") as HTMLImageElement;
    const srcAfter = imgAfter.getAttribute("src") ?? "";
    expect(coverAfter).toBe(coverBefore);
    expect(imgAfter).toBe(imgBefore);
    expect(srcAfter).toBe(srcBefore);
    expect(srcAfter).toContain("_ex=400x400");
    expect(coverAfter.className).toContain("aspect-[30/43]");
    expect(container.querySelector("article")?.classList.contains("md:w-44")).toBe(true);
  });

  it("renders the dark semantic fallback when cover artwork is missing while preserving title and metadata", () => {
    const { container } = render(
      <ShowcaseCard
        coverUrl={null}
        creators={["テスト作者"]}
        metadata="ファンタジー · 完結"
        ordinal={2}
        title="テストタイトル"
        workId="missing-cover-work"
      />,
    );

    // No external image should be requested; CoverImage renders the local semantic placeholder.
    expect(container.querySelectorAll("img")).toHaveLength(0);
    expect(container.querySelectorAll(".cover-image")).toHaveLength(1);
    expect(container.innerHTML).not.toContain("placehold.co");
    expect(container.innerHTML).not.toContain("TEST");
    expect(container.innerHTML).not.toContain("https://");
    // The dark semantic placeholder retains the local screentone treatment.
    expect(container.innerHTML).toContain("radial-gradient");
    // Real Japanese title/creator/metadata remain truthful and visible.
    expect(screen.getAllByText("テストタイトル")).toHaveLength(2);
    expect(screen.getAllByText("作者 テスト作者")).toHaveLength(2);
    expect(screen.getByText("ファンタジー · 完結")).toBeTruthy();
    expect(screen.getByText("2")).toBeTruthy();
    expect(container.querySelector(".cover-image--placeholder")).toBeTruthy();
    expect(
      screen.getByRole("img", {
        name: "テストタイトルの表紙画像はありません。作者 テスト作者",
      }),
    ).toBeTruthy();
  });

  it("HomeShowcaseShelf does not construct external placeholder URLs and falls back to dark semantics", () => {
    const works = [
      {
        id: "landing-no-cover-1",
        title: "プレースホルダなし作品",
        creators: ["宮崎駿"],
        genres: ["fantasy" as const],
        status: "completed" as const,
      },
    ];
    const coverUrls = new Map<string, string | null>();

    const { container } = render(<HomeShowcaseShelf coverUrls={coverUrls} works={works} />);

    expect(container.innerHTML).not.toContain("placehold.co");
    expect(container.innerHTML).not.toContain("TEST");
    // No external image for missing artwork.
    expect(container.querySelectorAll("img")).toHaveLength(0);
    expect(container.querySelectorAll(".cover-image")).toHaveLength(1);
    expect(container.querySelector(".cover-image--placeholder")).toBeTruthy();
    // Dark fallback still presents its local screentone.
    expect(container.innerHTML).toContain("radial-gradient");
    // Truthful Japanese title/creator/metadata preserved.
    expect(screen.getAllByText("プレースホルダなし作品")).toHaveLength(2);
    // creatorLine via coverStrings: "作者 " + join
    expect(screen.getAllByText("作者 宮崎駿")).toHaveLength(2);
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
