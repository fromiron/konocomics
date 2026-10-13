// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import { MediaShelf } from "@/components/media/media-shelf";

afterEach(cleanup);

describe("MediaShelf", () => {
  it.each([0, 1, 2, 5])("does not duplicate a shelf with %i cards", (count) => {
    const { container } = render(
      <MediaShelf controlsPlacement="overlay" title="Small shelf">
        {Array.from({ length: count }, (_, index) => (
          <article key={index}>Card</article>
        ))}
      </MediaShelf>,
    );
    expect(container.querySelectorAll("article")).toHaveLength(count);
    expect(container.querySelector("[data-carousel-clone]")).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.queryByText(/作品$/)).toBeNull();
  });

  it("keeps the position line blank until the browser measures the track", () => {
    const html = renderToString(
      <MediaShelf title="Server shelf">
        <article>First</article>
        <article>Second</article>
      </MediaShelf>,
    );

    expect(html).not.toContain("作品");
    expect(html).toMatch(/<p class="[^"]*invisible[^"]*" aria-live="polite"/);
  });

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

    fireEvent.keyDown(first, { key: "ArrowLeft" });
    expect(document.activeElement).toBe(first);
    fireEvent.keyDown(first, { key: "ArrowRight" });
    expect(document.activeElement).toBe(second);
    fireEvent.keyDown(second, { key: "ArrowRight" });
    expect(document.activeElement).toBe(second);
  });

  it("reports the first card on the next visible page", () => {
    const onPageChange = vi.fn();
    const { container } = render(
      <MediaShelf controlsPlacement="overlay" onPageChange={onPageChange} title="Shelf">
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
    expect(screen.getByText(/\/ 2作品$/)).toBeTruthy();
    const previous = screen.getByRole<HTMLButtonElement>("button", { name: /前へ/ });
    const next = screen.getByRole<HTMLButtonElement>("button", { name: /次へ/ });
    const startFade = container.querySelector(".media-shelf-edge-fade--start");
    const endFade = container.querySelector(".media-shelf-edge-fade--end");
    expect(container.querySelector(".media-shelf-overlay")).not.toBeNull();
    expect(previous.disabled).toBe(true);
    expect(next.disabled).toBe(false);
    expect(startFade?.classList.contains("hidden")).toBe(true);
    expect(endFade?.classList.contains("hidden")).toBe(false);

    fireEvent.click(next);
    fireEvent.scroll(track);

    expect(onPageChange).toHaveBeenCalledWith(1);
    expect(previous.disabled).toBe(false);
    expect(next.disabled).toBe(true);
    expect(startFade?.classList.contains("hidden")).toBe(false);
    expect(endFade?.classList.contains("hidden")).toBe(true);
  });

  it("pages by the card area inside the faded bleed inset", () => {
    const onPageChange = vi.fn();
    const { container } = render(
      <MediaShelf controlsPlacement="overlay" onPageChange={onPageChange} title="Bleed shelf">
        {Array.from({ length: 6 }, (_, index) => (
          <article key={index}>Card {index + 1}</article>
        ))}
      </MediaShelf>,
    );
    const track = container.querySelector<HTMLElement>("[data-media-shelf-track]");
    if (track === null) throw new Error("Missing shelf track");
    track.style.scrollPaddingLeft = "50px";
    track.style.scrollPaddingRight = "50px";
    const scrollBy = vi.fn(({ left }: ScrollToOptions) => {
      track.scrollLeft += left ?? 0;
    });
    Object.defineProperties(track, {
      clientWidth: { configurable: true, value: 300 },
      scrollLeft: { configurable: true, value: 0, writable: true },
      scrollWidth: { configurable: true, value: 700 },
      scrollBy: { configurable: true, value: scrollBy },
    });
    Array.from(track.children).forEach((child, index) => {
      Object.defineProperties(child, {
        offsetLeft: { configurable: true, value: 50 + index * 100 },
        offsetWidth: { configurable: true, value: 100 },
      });
    });
    fireEvent.scroll(track);

    fireEvent.click(screen.getByRole("button", { name: /次へ/ }));

    expect(scrollBy).toHaveBeenCalledWith({ left: 200 });
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("re-evaluates finite overflow after resize without creating clones", () => {
    let resize: (() => void) | undefined;
    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(callback: () => void) {
          resize = callback;
        }
        observe() {}
        disconnect() {}
      },
    );
    try {
      const { container } = render(
        <MediaShelf controlsPlacement="overlay" title="Shelf">
          <article>First</article>
          <article>Second</article>
        </MediaShelf>,
      );
      const track = container.querySelector<HTMLElement>("[data-media-shelf-track]")!;
      let width = 300;
      Object.defineProperties(track, {
        clientWidth: { get: () => width },
        scrollWidth: { value: 200 },
      });
      act(() => resize?.());
      expect(screen.queryByRole("button", { name: /次へ/ })).toBeNull();
      width = 100;
      act(() => resize?.());
      expect(screen.getByRole<HTMLButtonElement>("button", { name: /前へ/ }).disabled).toBe(true);
      expect(screen.getByRole<HTMLButtonElement>("button", { name: /次へ/ }).disabled).toBe(false);
      expect(track.querySelectorAll("article")).toHaveLength(2);
      expect(track.querySelector("[data-carousel-clone]")).toBeNull();
      expect(track.scrollLeft).toBe(0);
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
