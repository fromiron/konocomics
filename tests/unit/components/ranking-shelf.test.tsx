// @vitest-environment jsdom

import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { RankingShelf } from "@/components/media/ranking-shelf";

afterEach(cleanup);

describe("RankingShelf", () => {
  it("keeps ranking cards as direct ordered-list items", () => {
    const { container } = render(
      <RankingShelf
        compactHeading
        rankingKind="editorial-ranking"
        title="おすすめ Top 10"
        trackClassName="items-start"
      >
        <li>First</li>
        <li>Second</li>
      </RankingShelf>,
    );

    const list = screen.getByRole("list", { name: "おすすめ Top 10" });
    expect(within(list).getAllByRole("listitem")).toHaveLength(2);
    expect(Array.from(list.children).every((child) => child.tagName === "LI")).toBe(true);
    expect(container.querySelector("li li")).toBeNull();
    expect(list.className).toContain("items-start");
    expect(list.getAttribute("data-ranking-shelf")).toBe("editorial-ranking");
  });
});
