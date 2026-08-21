// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { MediaPosterCard } from "@/components/media/media-poster-card";
import { RankingCard } from "@/components/media/ranking-card";
import { ShowcaseCard } from "@/components/media/showcase-card";
import { HomeShowcaseShelf } from "@/features/landing/home-showcase";

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
  it("renders the default editorial spotlight plate without changing card geometry", () => {
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

    const topTenPlate = screen.getByText("TOP").parentElement;
    expect(topTenPlate?.textContent).toBe("TOP10");
    expect(screen.getAllByText("1")).toHaveLength(2);
    expect(screen.getByText("作品名")).toBeTruthy();
    expect(screen.getByText("高い確信")).toBeTruthy();
    expect(container.querySelector(".lucide-crown")).toBeTruthy();
    expect(container.querySelector('[data-ranking-first-swash="true"]')).toBeTruthy();
    const accessory = container.querySelector<HTMLElement>(
      '[data-ranking-editorial-accessory="true"]',
    );
    const accessoryPosition = container.querySelector<HTMLElement>(
      '[data-ranking-editorial-accessory-position="true"]',
    );
    const basePosition = container.querySelector<HTMLElement>(
      '[data-ranking-editorial-position="true"]',
    );
    expect(accessory).toBeTruthy();
    expect(accessoryPosition?.className).toContain("text-[length:var(--font-size-32)]");
    expect(accessoryPosition?.className).not.toContain("scale-x-");
    expect(basePosition?.className).toContain("text-[length:var(--font-size-32)]");
    expect(accessoryPosition?.className).toContain("font-display");
    expect(basePosition?.className).toContain("font-display");
    expect(container.querySelector("li")?.getAttribute("data-ranking-position")).toBe("1");
    expect(basePosition).toBeTruthy();
    expect(screen.getByRole("link").getAttribute("aria-label")).toMatch(/^おすすめ1位/u);
    expect(screen.getByRole("link").className).not.toContain("hover:-translate-y");
    expect(container.querySelector("img")?.getAttribute("loading")).toBe("eager");
    expect(container.querySelector("li")?.classList.contains("w-24")).toBe(true);
    expect(container.querySelector("a")?.classList.contains("aspect-[18/25]")).toBe(true);
  });

  it("gives later editorial ranks the same movable spotlight plate and geometry", () => {
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

    expect(screen.getByText("TOP")).toBeTruthy();
    expect(screen.getAllByText("2")).toHaveLength(2);
    expect(container.querySelector('[data-ranking-first-swash="true"]')).toBeTruthy();
    expect(container.querySelector("li")?.getAttribute("data-ranking-position")).toBe("2");
    expect(container.querySelector("img")?.getAttribute("loading")).toBe("lazy");
    expect(container.querySelector("li")?.classList.contains("w-24")).toBe(true);
    expect(container.querySelector("a")?.classList.contains("aspect-[18/25]")).toBe(true);
  });

  it("keeps the personalized first-place crown persistent without the editorial plate", () => {
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
    expect(container.querySelector('[data-ranking-personalized-crown="true"]')).toBeTruthy();
    expect(container.querySelector('[data-ranking-first-swash="true"]')).toBeNull();
    expect(screen.getByRole("link").className).toContain("hover:-translate-y-0.5");
    expect(container.querySelector("li")?.className).toContain(
      "w-[calc(var(--control-min-size)*1.75)]",
    );
    expect(container.querySelector("a")?.classList.contains("aspect-[30/43]")).toBe(true);
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
    expect(poster?.classList.contains("sm:w-40")).toBe(true);
    expect(
      poster?.classList.contains(
        "w-[calc((100vw-(var(--layout-page-padding)*2)-(var(--space-content-loose)*2))/2.4)]",
      ),
    ).toBe(true);
    expect(container.querySelector(".lucide-book-open")).toBeTruthy();
    expect(container.querySelector("a")?.classList.contains("shadow-[var(--shadow-level-1)]")).toBe(
      false,
    );
  });

  it("renders a layered featured showcase card with truthful overlay content", () => {
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
    expect(container.querySelectorAll(".cover-image")).toHaveLength(2);
    expect(container.querySelectorAll("img")).toHaveLength(2);
    const layers = container.querySelectorAll(".cover-image");
    const backdrop = layers[0] as HTMLElement;
    const foreground = layers[1] as HTMLElement;
    // first layer is blurred decorative backdrop and has direct-child object-cover
    expect(backdrop.className).toContain("[&>img]:!object-cover");
    expect(backdrop.className).toContain("blur-[16px]");
    expect(backdrop.className).toContain("opacity-[0.55]");
    // The wrapper shrink-wraps the intrinsic cover while radius and depth live on the actual image.
    expect(foreground.className).toContain("[&>img]:!object-contain");
    expect(foreground.className).toContain("h-[88%]");
    expect(foreground.className).toContain("w-auto");
    expect(foreground.className).toContain("!aspect-auto");
    expect(foreground.className).toContain("[&>img]:!static");
    expect(foreground.className).toContain("[&>img]:!h-full");
    expect(foreground.className).toContain("[&>img]:!w-auto");
    expect(foreground.className).toContain("[&>img]:!rounded-[var(--radius-cover)]");
    expect(foreground.className).toContain("rotate-[4deg]");
    expect(foreground.className).toContain("right-[var(--space-3)]");
    expect(foreground.className).toContain("!bg-transparent");
    expect(foreground.className).toContain("!border-0");
    expect(foreground.className).not.toContain("mask");
    expect(foreground.className).not.toContain("[mask-image");
    expect(foreground.className).not.toContain("[&>img]:!object-cover");
    expect(foreground.className).not.toContain("will-change");
    expect(foreground.className).not.toContain("transition");
    expect(foreground.className).not.toContain("shadow-[var(--shadow-raised)]");
    // base img class remains object-contain and direct-child selector holds
    expect(container.querySelectorAll(".cover-image > img.cover-image__image")).toHaveLength(2);
    for (const img of Array.from(container.querySelectorAll(".cover-image__image"))) {
      expect((img as HTMLElement).className).toContain("object-contain");
    }
  });

  it("keeps the collapsed portrait contained over a full-bleed backdrop", () => {
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
    expect(container.querySelectorAll(".cover-image")).toHaveLength(2);
    const layers = container.querySelectorAll(".cover-image");
    const backdrop = layers[0] as HTMLElement;
    const foreground = layers[1] as HTMLElement;
    // first layer is blurred decorative backdrop and has direct-child object-cover
    expect(backdrop.className).toContain("[&>img]:!object-cover");
    expect(backdrop.className).toContain("blur-[16px]");
    // The wrapper shrink-wraps the intrinsic cover while radius and depth live on the actual image.
    expect(foreground.className).toContain("[&>img]:!object-contain");
    expect(foreground.className).toContain("h-[88%]");
    expect(foreground.className).toContain("w-auto");
    expect(foreground.className).toContain("!aspect-auto");
    expect(foreground.className).toContain("[&>img]:!static");
    expect(foreground.className).toContain("[&>img]:!h-full");
    expect(foreground.className).toContain("[&>img]:!w-auto");
    expect(foreground.className).toContain("[&>img]:!rounded-[var(--radius-cover)]");
    expect(foreground.className).toContain("rotate-[4deg]");
    expect(foreground.className).toContain("right-[var(--space-3)]");
    expect(foreground.className).toContain("!bg-transparent");
    expect(foreground.className).toContain("!border-0");
    expect(foreground.className).not.toContain("mask");
    expect(foreground.className).not.toContain("[mask-image");
    expect(foreground.className).not.toContain("[&>img]:!object-cover");
    expect(foreground.className).not.toContain("will-change");
    expect(foreground.className).not.toContain("transition");
    expect(foreground.className).not.toContain("shadow-[var(--shadow-raised)]");
    // base img class remains object-contain and direct-child selector holds
    expect(container.querySelectorAll(".cover-image > img.cover-image__image")).toHaveLength(2);
    for (const img of Array.from(container.querySelectorAll(".cover-image__image"))) {
      expect((img as HTMLElement).className).toContain("object-contain");
    }
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

    const layersBefore = container.querySelectorAll(".cover-image");
    const foregroundBefore = layersBefore[1] as HTMLElement;
    const imgBefore = foregroundBefore.querySelector("img.cover-image__image") as HTMLImageElement;
    const srcBefore = imgBefore.getAttribute("src") ?? "";
    expect(srcBefore).toContain("_ex=400x400");
    expect(srcBefore).not.toContain("_ex=600x600");

    const backdropBefore = layersBefore[0] as HTMLElement;
    const backdropImgBefore = backdropBefore.querySelector(
      "img.cover-image__image",
    ) as HTMLImageElement;
    const backdropSrcBefore = backdropImgBefore.getAttribute("src") ?? "";
    expect(backdropSrcBefore).toContain("_ex=400x400");

    rerender(
      <ShowcaseCard
        coverUrl={coverUrl}
        creators={["作者"]}
        featured={false}
        title="安定性"
        workId="test-work"
      />,
    );

    const layersAfter = container.querySelectorAll(".cover-image");
    const foregroundAfter = layersAfter[1] as HTMLElement;
    const imgAfter = foregroundAfter.querySelector("img.cover-image__image") as HTMLImageElement;
    const srcAfter = imgAfter.getAttribute("src") ?? "";
    expect(imgAfter).toBe(imgBefore);
    expect(srcAfter).toBe(srcBefore);
    expect(srcAfter).toContain("_ex=400x400");

    const backdropAfter = layersAfter[0] as HTMLElement;
    const backdropImgAfter = backdropAfter.querySelector(
      "img.cover-image__image",
    ) as HTMLImageElement;
    expect(backdropImgAfter.getAttribute("src")).toBe(backdropSrcBefore);

    // geometry remains identical after toggle
    expect(foregroundAfter.className).toContain("h-[88%]");
    expect(foregroundAfter.className).toContain("w-auto");
    expect(foregroundAfter.className).toContain("!aspect-auto");
    expect(foregroundAfter.className).toContain("[&>img]:!rounded-[var(--radius-cover)]");
    expect(foregroundAfter.className).toContain("rotate-[4deg]");
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

    // No external image should be requested; ShowcaseCard must use its no-cover dark branch.
    expect(container.querySelectorAll("img")).toHaveLength(0);
    expect(container.querySelectorAll(".cover-image")).toHaveLength(0);
    expect(container.innerHTML).not.toContain("placehold.co");
    expect(container.innerHTML).not.toContain("TEST");
    expect(container.innerHTML).not.toContain("https://");
    // Dark semantic fallback gradient is present (existing no-cover branch).
    expect(container.innerHTML).toContain("radial-gradient");
    expect(container.innerHTML).toContain("ellipse_68%");
    // Real Japanese title/creator/metadata remain truthful and visible.
    expect(screen.getByText("テストタイトル")).toBeTruthy();
    expect(screen.getByText("作者 テスト作者")).toBeTruthy();
    expect(screen.getByText("ファンタジー · 完結")).toBeTruthy();
    expect(screen.getByText("2")).toBeTruthy();
    // CoverImage global contract remains contain; only the decorative backdrop overrides it to cover.
    // This fallback path must not introduce a CoverImage placeholder with external src.
    expect(container.querySelector(".cover-image--placeholder")).toBeNull();
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
    expect(container.querySelectorAll(".cover-image")).toHaveLength(0);
    // Dark fallback still present with radial gradient.
    expect(container.innerHTML).toContain("radial-gradient");
    // Truthful Japanese title/creator/metadata preserved.
    expect(screen.getByText("プレースホルダなし作品")).toBeTruthy();
    // creatorLine via coverStrings: "作者 " + join
    expect(screen.getByText("作者 宮崎駿")).toBeTruthy();
  });
});
