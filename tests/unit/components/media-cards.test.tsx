// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { MediaPosterCard } from "@/components/media/media-poster-card";
import { RankingCard } from "@/components/media/ranking-card";
import { ShowcaseCard } from "@/components/media/showcase-card";

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
  it("renders the first ranking card with a crown plate, visible rank, and metadata", () => {
    const { container } = render(
      <ol>
        <RankingCard
          coverUrl="https://example.com/cover.jpg"
          creators={["作者"]}
          metadata="高い確信"
          position={1}
          presentation="landing-top-ten"
          priority
          title="作品名"
          workId="test-work"
        />
      </ol>,
    );

    const topTenPlate = screen.getByText("TOP").parentElement;
    expect(topTenPlate?.textContent).toBe("TOP10");
    expect(screen.getByText("1")).toBeTruthy();
    expect(screen.getByText("作品名")).toBeTruthy();
    expect(screen.getByText("高い確信")).toBeTruthy();
    expect(container.querySelector(".lucide-crown")).toBeTruthy();
    expect(container.querySelector("img")?.getAttribute("loading")).toBe("eager");
    expect(container.querySelector("li")?.classList.contains("w-28")).toBe(true);
    expect(container.querySelector("a")?.classList.contains("aspect-[6/7]")).toBe(true);
  });

  it("keeps non-first ranks visible without the first-place plate or eager loading", () => {
    const { container } = render(
      <ol>
        <RankingCard
          coverUrl="https://example.com/cover.jpg"
          creators={["作者"]}
          metadata="中程度の確信"
          position={2}
          presentation="landing-top-ten"
          priority
          title="次の作品"
          workId="test-work"
        />
      </ol>,
    );

    expect(screen.queryByText("TOP 10")).toBeNull();
    expect(screen.getByText("2")).toBeTruthy();
    expect(container.querySelector("img")?.getAttribute("loading")).toBe("lazy");
    expect(container.querySelector("li")?.classList.contains("w-20")).toBe(true);
    expect(container.querySelector("a")?.classList.contains("aspect-[3/5]")).toBe(true);
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
    expect(container.querySelectorAll(".cover-image")).toHaveLength(2);
    expect(container.querySelectorAll("img")).toHaveLength(2);
  });
});
