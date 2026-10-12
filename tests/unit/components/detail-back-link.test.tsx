// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { AnchorHTMLAttributes } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { DetailBackLink } from "@/components/nav/detail-back-link";
import { navigationStrings } from "@/lib/strings";

const state = vi.hoisted(() => ({ canGoBack: false, back: vi.fn() }));
vi.mock("@tanstack/react-router", () => ({
  useCanGoBack: () => state.canGoBack,
  useRouter: () => ({ history: { back: state.back } }),
  Link: ({
    to,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement> & { to: string; preload?: boolean }) => {
    delete props.preload;
    return <a {...props} href={to} />;
  },
}));
afterEach(() => {
  cleanup();
  state.back.mockClear();
});

describe("DetailBackLink", () => {
  it.each(["/library", "/recommendations"] as const)(
    "uses %s for direct entry and new tabs",
    (fallback) => {
      state.canGoBack = false;
      render(<DetailBackLink fallback={fallback} />);
      expect(screen.getByRole("link").getAttribute("href")).toBe(fallback);
      fireEvent.click(screen.getByRole("link"), { ctrlKey: true });
      expect(state.back).not.toHaveBeenCalled();
    },
  );
  it("uses history for an ordinary click while preserving modified clicks", () => {
    state.canGoBack = true;
    render(<DetailBackLink />);
    const link = screen.getByRole("link", { name: navigationStrings.detailBack });
    fireEvent.click(link);
    expect(state.back).toHaveBeenCalledTimes(1);
    fireEvent.click(link, { metaKey: true });
    expect(state.back).toHaveBeenCalledTimes(1);
  });
});
