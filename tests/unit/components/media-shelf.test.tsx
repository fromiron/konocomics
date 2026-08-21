// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { MediaShelf } from "@/components/media/media-shelf";

afterEach(cleanup);

describe("MediaShelf", () => {
  it("moves focus between adjacent cards with the arrow keys", () => {
    render(
      <MediaShelf title="Shelf">
        <article>
          <button type="button">First</button>
        </article>
        <article>
          <button type="button">Second</button>
        </article>
      </MediaShelf>,
    );

    const first = screen.getByRole("button", { name: "First" });
    const second = screen.getByRole("button", { name: "Second" });
    first.focus();

    fireEvent.keyDown(first, { key: "ArrowRight" });
    expect(document.activeElement).toBe(second);

    fireEvent.keyDown(second, { key: "ArrowLeft" });
    expect(document.activeElement).toBe(first);
  });

  it("reports the first card on the next visible page", () => {
    const onPageChange = vi.fn();
    const { container } = render(
      <MediaShelf onPageChange={onPageChange} title="Shelf">
        <article>First</article>
        <article>Second</article>
      </MediaShelf>,
    );
    const track = container.querySelector<HTMLElement>("[data-media-shelf-track]");
    expect(track).not.toBeNull();
    if (track === null) return;

    Object.defineProperties(track, {
      clientWidth: { configurable: true, value: 100 },
      scrollLeft: { configurable: true, value: 0, writable: true },
      scrollWidth: { configurable: true, value: 200 },
      scrollBy: {
        configurable: true,
        value: ({ left }: ScrollToOptions) => {
          track.scrollLeft += left ?? 0;
        },
      },
    });
    Array.from(track.children).forEach((child, index) => {
      Object.defineProperties(child, {
        offsetLeft: { configurable: true, value: index * 100 },
        offsetWidth: { configurable: true, value: 100 },
      });
    });

    fireEvent.scroll(track);
    fireEvent.click(screen.getByRole("button", { name: /次へ/ }));

    expect(onPageChange).toHaveBeenCalledWith(1);
  });
});
