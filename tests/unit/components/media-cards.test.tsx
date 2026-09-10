// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

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
    const hoverPosition = container.querySelector<HTMLElement>(
      '[data-ranking-hover-position="true"]',
    );
    expect(hoverPosition?.className).toContain("opacity-0");
    expect(hoverPosition?.className).toContain("[transform:translateY(var(--space-2))]");
    expect(hoverPosition?.className).toContain("transition-[transform,opacity]");
    expect(hoverPosition?.className).toContain("duration-[var(--motion-duration-floating-action)]");
    expect(hoverPosition?.className).toContain("shadow-[var(--shadow-floating-action)]");
    expect(hoverPosition?.className).toContain("group-hover/ranking:opacity-100");
    expect(hoverPosition?.className).toContain("group-hover/ranking:[transform:translateY(0)]");
    expect(hoverPosition?.className).toContain("group-focus-visible/ranking:opacity-100");
    expect(hoverPosition?.className).toContain("motion-reduce:[transform:translateY(0)]");
    expect(hoverPosition?.className).toContain("motion-reduce:transition-none");
    expect(container.querySelector('[data-ranking-label="true"]')?.textContent).toBe(
      "アクション · コメディ · ファンタジー",
    );
    expect(container.querySelector('[data-ranking-label="true"]')?.className).toContain(
      "line-clamp-2",
    );
    expect(container.querySelector("button")).toBeNull();
  });

  it("reserves a decorative crown for personalized first place without replacing rank text", () => {
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
      expect(container.querySelectorAll(".ranking-crown")).toHaveLength(position === 1 ? 1 : 0);
      if (position === 1) {
        expect(container.querySelector(".ranking-crown")?.getAttribute("aria-hidden")).toBe("true");
      }
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
    expect(container.querySelector("article")?.className).toContain("md:transition-[width]");
    expect(container.querySelector("article")?.className).toContain(
      "motion-reduce:transition-none",
    );
    expect(container.querySelector(".cover-image")?.className).toContain(
      "motion-safe:[@media(hover:hover)_and_(pointer:fine)]:group-hover/showcase:scale-[1.03]",
    );
    expect(container.querySelector(".cover-image")?.className).not.toContain(
      "motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:group-hover/showcase:scale-[1.03]",
    );
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

const showcaseWorks = [
  {
    id: "showcase-one",
    title: "作品1",
    creators: ["作者"],
    genres: ["action" as const],
    status: "completed" as const,
  },
  {
    id: "showcase-two",
    title: "作品2",
    creators: ["作者"],
    genres: ["fantasy" as const],
    status: "completed" as const,
  },
  {
    id: "showcase-three",
    title: "作品3",
    creators: ["作者"],
    genres: ["mystery" as const],
    status: "completed" as const,
  },
];

function showcaseCards(container: HTMLElement) {
  return [...container.querySelectorAll<HTMLElement>('[data-card-presentation="showcase"]')];
}

function focusShowcaseLink(card: HTMLElement, focusVisible: boolean) {
  const link = within(card).getByRole("link");
  vi.spyOn(link, "matches").mockImplementation((selector: string) => {
    if (selector === ":focus-visible") return focusVisible;
    return Element.prototype.matches.call(link, selector);
  });
  act(() => {
    link.focus();
  });
  return link;
}

describe("HomeShowcaseShelf featured handoff", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("forwards the React focus event from the showcase card", () => {
    const onFocus = vi.fn();
    render(
      <ShowcaseCard
        coverUrl="https://example.com/cover.jpg"
        creators={["作者"]}
        onFocus={onFocus}
        title="注目作品"
        workId="test-work"
      />,
    );

    const link = screen.getByRole("link");
    fireEvent.focus(link);

    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onFocus.mock.calls[0]?.[0]).toMatchObject({ target: link });
  });

  it("cancels a pending hover handoff when keyboard focus-visible arrives", () => {
    const { container } = render(<HomeShowcaseShelf coverUrls={new Map()} works={showcaseWorks} />);
    const cards = showcaseCards(container);
    expect(cards[0]?.getAttribute("data-featured")).toBe("true");

    fireEvent.pointerEnter(cards[1]!);
    focusShowcaseLink(cards[2]!, true);

    expect(cards[2]?.getAttribute("data-featured")).toBe("true");
    expect(cards[0]?.getAttribute("data-featured")).toBeNull();
    expect(cards[1]?.getAttribute("data-featured")).toBeNull();

    act(() => {
      vi.advanceTimersByTime(140);
    });

    expect(cards[2]?.getAttribute("data-featured")).toBe("true");
    expect(cards[1]?.getAttribute("data-featured")).toBeNull();
  });

  it("keeps the focused card when the pointer leaves the track", () => {
    const { container } = render(<HomeShowcaseShelf coverUrls={new Map()} works={showcaseWorks} />);
    const cards = showcaseCards(container);
    const wrapper = container.firstElementChild;
    if (!(wrapper instanceof HTMLElement)) throw new Error("Missing showcase wrapper");

    focusShowcaseLink(cards[1]!, true);
    expect(cards[1]?.getAttribute("data-featured")).toBe("true");

    fireEvent.pointerLeave(wrapper);

    expect(cards[1]?.getAttribute("data-featured")).toBe("true");
    expect(cards[0]?.getAttribute("data-featured")).toBeNull();
  });

  it("does not treat pointer click focus as a keyboard-driven expansion", () => {
    const { container } = render(<HomeShowcaseShelf coverUrls={new Map()} works={showcaseWorks} />);
    const cards = showcaseCards(container);

    focusShowcaseLink(cards[1]!, false);

    expect(cards[0]?.getAttribute("data-featured")).toBe("true");
    expect(cards[1]?.getAttribute("data-featured")).toBeNull();

    act(() => {
      vi.advanceTimersByTime(140);
    });

    expect(cards[0]?.getAttribute("data-featured")).toBe("true");
    expect(cards[1]?.getAttribute("data-featured")).toBeNull();
  });
});
