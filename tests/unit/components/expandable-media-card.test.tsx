// @vitest-environment jsdom

import { useState } from "react";
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ExpandableMediaCard } from "@/components/media/expandable-media-card";

let canExpand = true;
let reducedMotion = false;

function Shelf({ onPreview }: { onPreview: () => void }) {
  const [active, setActive] = useState<number | null>(null);
  return (
    <div data-media-shelf-track onPointerLeave={() => setActive(null)}>
      {[0, 1].map((index) => (
        <ExpandableMediaCard
          expanded={active === index}
          key={index}
          onExpandedChange={(next) =>
            setActive((current) => (next ? index : current === index ? null : current))
          }
          panel={<p>Connection {index}</p>}
        >
          <a href={`/works/${index}`}>
            <img alt={`cover ${index}`} src="/cover.jpg" />
          </a>
          <button onClick={onPreview} type="button">
            Quick Preview {index}
          </button>
        </ExpandableMediaCard>
      ))}
    </div>
  );
}

function renderCard(left = 20) {
  const onPreview = vi.fn();
  const view = render(<Shelf onPreview={onPreview} />);
  const articles = Array.from(view.container.querySelectorAll("article"));
  const article = articles[0]!;
  const panel = article.querySelector<HTMLDivElement>("[data-expandable-panel]")!;
  const track = article.parentElement!;
  vi.spyOn(track, "getBoundingClientRect").mockReturnValue(new DOMRect(0, 700, 700, 224));
  Object.defineProperty(track, "clientWidth", { configurable: true, value: 700 });
  Object.defineProperty(track, "scrollWidth", { configurable: true, value: 1400 });
  track.scrollLeft = 100;
  Object.defineProperty(track, "scrollTo", {
    configurable: true,
    value: ({ left }: ScrollToOptions) => {
      track.scrollLeft = left ?? 0;
    },
  });
  articles.forEach((card, index) => {
    card.style.setProperty("--control-min-size", "44px");
    card.style.setProperty("--motion-duration-value", "240ms");
    vi.spyOn(card, "getBoundingClientRect").mockImplementation(
      () =>
        new DOMRect(
          left + index * 124,
          700,
          112 + (Number.parseFloat(card.style.getPropertyValue("--media-card-expansion")) || 0),
          220,
        ),
    );
    vi.spyOn(card.firstElementChild!, "getBoundingClientRect").mockReturnValue(
      new DOMRect(0, 0, 110, 220),
    );
  });
  return { ...view, article, articles, panel, track, onPreview };
}

beforeEach(() => {
  canExpand = true;
  reducedMotion = false;
  vi.useFakeTimers();
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: query === "(prefers-reduced-motion: reduce)" ? reducedMotion : canExpand,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("ExpandableMediaCard", () => {
  it("reserves panel space after hover intent and hands off to the next card", () => {
    const { article, articles, panel, getByRole, track } = renderCard();
    const cover = getByRole("img", { name: "cover 0" });
    fireEvent.pointerEnter(article);
    act(() => vi.advanceTimersByTime(199));
    expect(panel.getAttribute("aria-hidden")).toBe("true");
    act(() => vi.advanceTimersByTime(1));
    expect(article.style.getPropertyValue("--media-card-expansion")).toBe("264");
    expect(article.firstElementChild?.getAttribute("style")).toContain("width: 110px");
    expect(getByRole("img", { name: "cover 0" })).toBe(cover);
    expect(track.scrollLeft).toBe(100);
    fireEvent.pointerLeave(article, { relatedTarget: articles[1] });
    expect(panel.getAttribute("aria-hidden")).toBe("false");
    fireEvent.pointerEnter(articles[1]!);
    act(() => vi.advanceTimersByTime(200));
    expect(article.style.getPropertyValue("--media-card-expansion")).toBe("0");
    expect(articles[1]?.dataset.expanded).toBe("true");
    expect(articles[1]?.dataset.expansionSide).toBe("left");
    expect(track.querySelectorAll('[data-expanded="true"]')).toHaveLength(1);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(track.querySelectorAll('[data-expanded="true"]')).toHaveLength(0);
    act(() => vi.advanceTimersByTime(20));
    expect(track.querySelectorAll("[data-expansion-active]")).toHaveLength(0);
  });

  it("compensates left expansion and restores only scrolling it still owns", () => {
    const { article, articles, track } = renderCard(540);
    reducedMotion = true;
    fireEvent.pointerEnter(article);
    act(() => vi.advanceTimersByTime(200));
    expect(article.dataset.expansionSide).toBe("left");
    expect(track.scrollLeft).toBe(364);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(track.scrollLeft).toBe(100);
    fireEvent.pointerEnter(article);
    act(() => vi.advanceTimersByTime(200));
    track.scrollLeft = 240;
    fireEvent.wheel(track, { deltaX: 20 });
    fireEvent.pointerEnter(articles[1]!);
    act(() => vi.advanceTimersByTime(200));
    expect(article.dataset.expanded).toBe("true");
    expect(articles[1]?.dataset.expanded).toBeUndefined();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(track.scrollLeft).toBe(240);
    const nextLink = articles[1]!.querySelector("a")!;
    vi.spyOn(nextLink, "matches").mockReturnValue(true);
    act(() => nextLink.focus());
    expect(articles[1]?.dataset.expanded).toBe("true");
  });

  it("opens for keyboard focus and Escape preserves the current control", () => {
    const { article, panel, getByRole } = renderCard();
    const link = article.querySelector("a")!;
    const preview = getByRole("button", { name: "Quick Preview 0" });
    // Real keyboard modality and focus handoff are checked in the browser.
    vi.spyOn(link, "matches").mockReturnValue(true);
    act(() => link.focus());
    expect(panel.getAttribute("aria-hidden")).toBe("false");
    act(() => preview.focus());
    expect(panel.getAttribute("aria-hidden")).toBe("false");
    fireEvent.keyDown(preview, { key: "Escape" });
    expect(panel.getAttribute("aria-hidden")).toBe("true");
    expect(document.activeElement).toBe(preview);
  });

  it("cancels abandoned intent and closes outside the shelf", () => {
    const { article, panel, track, unmount } = renderCard();
    fireEvent.pointerEnter(article);
    fireEvent.pointerLeave(article);
    act(() => vi.advanceTimersByTime(200));
    expect(panel.getAttribute("aria-hidden")).toBe("true");
    fireEvent.pointerEnter(article);
    act(() => vi.advanceTimersByTime(200));
    fireEvent.pointerLeave(track);
    expect(panel.getAttribute("aria-hidden")).toBe("true");
    fireEvent.pointerEnter(article);
    act(() => vi.advanceTimersByTime(200));
    fireEvent.pointerDown(document.body);
    expect(panel.getAttribute("aria-hidden")).toBe("true");
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("keeps touch and narrow screens on the existing detail link and Quick Preview", () => {
    canExpand = false;
    const { article, panel, getByRole, onPreview } = renderCard();
    fireEvent.pointerEnter(article, { pointerType: "touch" });
    act(() => vi.advanceTimersByTime(200));
    expect(panel.getAttribute("aria-hidden")).toBe("true");
    expect(article.querySelector("a")?.getAttribute("href")).toBe("/works/0");
    fireEvent.click(getByRole("button", { name: "Quick Preview 0" }));
    expect(onPreview).toHaveBeenCalledOnce();
  });
});
