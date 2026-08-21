// @vitest-environment jsdom

import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ExpandableMediaCard } from "@/components/media/expandable-media-card";

function rect(left: number, width: number, height = 212, top = 0): DOMRect {
  return {
    bottom: top + height,
    height,
    left,
    right: left + width,
    top,
    width,
    x: left,
    y: top,
    toJSON: () => ({}),
  };
}

function renderCard(
  left: number,
  onExpandedChange?: (expanded: boolean) => void,
  initiallyExpanded = false,
) {
  const view = render(
    <ul data-media-shelf-track>
      <li>
        <ExpandableMediaCard
          articleRef={() => undefined}
          initiallyExpanded={initiallyExpanded}
          onExpandedChange={onExpandedChange}
        >
          {() => (
            <div>
              <div data-expandable-cover-frame>
                <img alt="cover" src="/cover.jpg" />
              </div>
              <div data-expandable-position-axis="block" data-expandable-position-part>
                identity copy
              </div>
              <button type="button">state action</button>
              <span data-expandable-reveal>expanded detail</span>
            </div>
          )}
        </ExpandableMediaCard>
      </li>
    </ul>,
  );
  const track = view.container.querySelector("ul");
  const item = view.container.querySelector("li");
  const article = view.container.querySelector("article");
  const frame = view.container.querySelector<HTMLElement>("[data-expandable-cover-frame]");
  const positionPart = view.container.querySelector<HTMLElement>("[data-expandable-position-part]");
  const reveal = view.container.querySelector<HTMLElement>("[data-expandable-reveal]");
  const cover = view.getByRole("img", { name: "cover" });
  if (
    track === null ||
    item === null ||
    article === null ||
    frame === null ||
    positionPart === null ||
    reveal === null
  ) {
    throw new Error("Missing card fixture");
  }

  article.style.setProperty("--control-min-size", "44px");
  article.style.setProperty("--motion-duration-page", "160ms");
  article.style.setProperty("--motion-duration-value", "240ms");
  article.style.setProperty("--motion-ease-direct", "ease-out");
  article.style.setProperty("--motion-ease-signature", "cubic-bezier(0.2, 0, 0, 1)");
  Object.defineProperty(track, "clientWidth", { configurable: true, value: 700 });
  Object.defineProperty(track, "scrollWidth", {
    configurable: true,
    get: () => (article.hasAttribute("data-expanded") ? 1000 : 802),
  });
  Object.defineProperty(track, "scrollLeft", { configurable: true, value: 100, writable: true });
  Object.defineProperty(item, "offsetWidth", {
    configurable: true,
    get: () => (article.hasAttribute("data-expanded") ? 352 : 154),
  });
  vi.spyOn(track, "getBoundingClientRect").mockImplementation(() => rect(0, 700, 222));
  vi.spyOn(item, "getBoundingClientRect").mockImplementation(() =>
    rect(left, article.hasAttribute("data-expanded") ? 352 : 154),
  );
  vi.spyOn(article, "getBoundingClientRect").mockImplementation(() =>
    rect(left, article.hasAttribute("data-expanded") ? 352 : 154),
  );
  vi.spyOn(frame, "getBoundingClientRect").mockImplementation(() =>
    rect(left, article.hasAttribute("data-expanded") ? 104 : 144, 206),
  );
  vi.spyOn(positionPart, "getBoundingClientRect").mockImplementation(() =>
    rect(left, 120, 80, article.hasAttribute("data-expanded") ? 40 : 180),
  );
  vi.spyOn(reveal, "getBoundingClientRect").mockImplementation(() => rect(left + 108, 120, 40));
  const cancelAnimation = vi.fn();
  const animate = vi.fn(() => ({ cancel: cancelAnimation }) as unknown as Animation);
  const articleAnimate = vi.fn(() => ({ cancel: vi.fn() }) as unknown as Animation);
  const positionAnimate = vi.fn(() => ({ cancel: vi.fn() }) as unknown as Animation);
  const revealAnimate = vi.fn(() => ({ cancel: vi.fn() }) as unknown as Animation);
  Object.defineProperty(frame, "animate", { configurable: true, value: animate });
  Object.defineProperty(article, "animate", { configurable: true, value: articleAnimate });
  Object.defineProperty(positionPart, "animate", { configurable: true, value: positionAnimate });
  Object.defineProperty(reveal, "animate", { configurable: true, value: revealAnimate });

  return {
    animate,
    article,
    articleAnimate,
    cover,
    item,
    positionAnimate,
    revealAnimate,
    track,
    unmount: view.unmount,
  };
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal("matchMedia", (query: string) => ({
    addEventListener: vi.fn(),
    addListener: vi.fn(),
    dispatchEvent: vi.fn(),
    matches: false,
    media: query,
    onchange: null,
    removeEventListener: vi.fn(),
    removeListener: vi.fn(),
  }));
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("ExpandableMediaCard", () => {
  it("can render the featured card expanded before pointer intent", () => {
    const onExpandedChange = vi.fn();
    const { article } = renderCard(20, onExpandedChange, true);

    expect(article.getAttribute("data-expanded")).toBe("true");
    expect(article.getAttribute("data-expansion-side")).toBe("right");
    expect(onExpandedChange).not.toHaveBeenCalled();

    fireEvent.pointerEnter(article);
    fireEvent.pointerLeave(article);
    expect(article.getAttribute("data-expanded")).toBeNull();
    expect(onExpandedChange).toHaveBeenLastCalledWith(false);
  });

  it("keeps the same cover node and expands right after the 200ms intent delay", () => {
    const { article, articleAnimate, cover, positionAnimate, revealAnimate, track } =
      renderCard(20);

    fireEvent.pointerEnter(article);
    act(() => vi.advanceTimersByTime(199));
    expect(article.getAttribute("data-expanded")).toBeNull();

    act(() => vi.advanceTimersByTime(1));
    expect(article.getAttribute("data-expanded")).toBe("true");
    expect(article.getAttribute("data-expansion-side")).toBe("right");
    expect(track.scrollLeft).toBe(100);
    expect(article.querySelector("img")).toBe(cover);
    expect(article.querySelectorAll("img")).toHaveLength(1);
    expect(articleAnimate).toHaveBeenCalledWith([{ width: "154px" }, { width: "352px" }], {
      duration: 240,
      easing: "cubic-bezier(0.2, 0, 0, 1)",
    });
    expect(positionAnimate).toHaveBeenCalledWith(
      [{ transform: "translate(0px, 140px)" }, { transform: "none" }],
      { duration: 240, easing: "cubic-bezier(0.2, 0, 0, 1)" },
    );
    expect(revealAnimate).toHaveBeenCalledWith(
      [
        { opacity: 0, transform: "translateX(-6px)" },
        { opacity: 1, transform: "none" },
      ],
      { delay: 80, duration: 160, easing: "ease-out", fill: "backwards" },
    );
  });

  it("reports the expanded state so a consuming shelf can synchronize its detail panel", () => {
    const onExpandedChange = vi.fn();
    const { article } = renderCard(20, onExpandedChange);

    fireEvent.pointerEnter(article);
    act(() => vi.advanceTimersByTime(200));
    expect(onExpandedChange).toHaveBeenLastCalledWith(true);

    fireEvent.pointerLeave(article);
    expect(onExpandedChange).toHaveBeenLastCalledWith(false);
  });

  it("anchors a right-edge card by expanding left and restores only its own scroll adjustment", () => {
    const { article, articleAnimate, cover, track } = renderCard(540);

    fireEvent.pointerEnter(article);
    act(() => vi.advanceTimersByTime(200));
    expect(article.getAttribute("data-expansion-side")).toBe("left");
    expect(track.scrollLeft).toBe(298);
    expect(article.querySelector("img")).toBe(cover);
    expect(article.querySelectorAll("img")).toHaveLength(1);
    expect(articleAnimate).toHaveBeenCalledWith([{ width: "154px" }, { width: "352px" }], {
      duration: 240,
      easing: "cubic-bezier(0.2, 0, 0, 1)",
    });

    fireEvent.pointerLeave(article);
    expect(article.getAttribute("data-expanded")).toBeNull();
    expect(track.scrollLeft).toBe(100);
  });

  it("does not overwrite a shelf position changed while the card is expanded", () => {
    const { article, track } = renderCard(540);

    fireEvent.pointerEnter(article);
    act(() => vi.advanceTimersByTime(200));
    track.scrollLeft = 240;
    fireEvent.pointerLeave(article);

    expect(track.scrollLeft).toBe(240);
  });

  it("restores its owned shelf adjustment when an expanded card unmounts", () => {
    const { article, track, unmount } = renderCard(540);

    fireEvent.pointerEnter(article);
    act(() => vi.advanceTimersByTime(200));
    expect(track.scrollLeft).toBe(298);

    unmount();
    expect(track.scrollLeft).toBe(100);
  });

  it("animates the same cover frame back to its collapsed geometry", () => {
    const { animate, article } = renderCard(20);

    fireEvent.pointerEnter(article);
    act(() => vi.advanceTimersByTime(200));
    expect(animate).toHaveBeenCalledTimes(1);

    fireEvent.pointerLeave(article);
    expect(animate).toHaveBeenCalledTimes(2);
  });

  it("uses the final cover layout without FLIP when reduced motion is requested", () => {
    vi.stubGlobal("matchMedia", (query: string) => ({
      addEventListener: vi.fn(),
      addListener: vi.fn(),
      dispatchEvent: vi.fn(),
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
      onchange: null,
      removeEventListener: vi.fn(),
      removeListener: vi.fn(),
    }));
    const { animate, article, articleAnimate, positionAnimate, revealAnimate } = renderCard(20);

    fireEvent.pointerEnter(article);
    act(() => vi.advanceTimersByTime(200));
    fireEvent.pointerLeave(article);

    expect(animate).not.toHaveBeenCalled();
    expect(articleAnimate).not.toHaveBeenCalled();
    expect(positionAnimate).not.toHaveBeenCalled();
    expect(revealAnimate).not.toHaveBeenCalled();
  });

  it("keeps the left expansion context while focus moves between controls in the card", () => {
    const { article, track } = renderCard(540);

    fireEvent.pointerEnter(article);
    act(() => vi.advanceTimersByTime(200));
    const action = article.querySelector("button");
    if (action === null) throw new Error("Missing state action fixture");

    act(() => action.focus());
    expect(document.activeElement).toBe(action);
    expect(article.getAttribute("data-expansion-side")).toBe("left");
    expect(track.scrollLeft).toBe(298);

    fireEvent.pointerLeave(article);
    expect(track.scrollLeft).toBe(298);
    fireEvent.blur(action, { relatedTarget: document.body });
    expect(article.getAttribute("data-expanded")).toBeNull();
    expect(track.scrollLeft).toBe(100);
  });

  it("does not hover-expand a second card while a focused card owns the shelf", () => {
    const { article, track } = renderCard(20);
    const focusedCard = document.createElement("article");
    const focusedControl = document.createElement("button");
    focusedCard.dataset.expanded = "true";
    focusedCard.append(focusedControl);
    track.prepend(focusedCard);
    focusedControl.focus();

    fireEvent.pointerEnter(article);
    act(() => vi.advanceTimersByTime(200));

    expect(document.activeElement).toBe(focusedControl);
    expect(article.getAttribute("data-expanded")).toBeNull();
  });
});
