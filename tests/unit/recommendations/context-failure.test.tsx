// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import catalogJson from "@/data/generated/catalog-v1.json";
import { catalogV1Schema } from "@/domain/catalog/schema";
import { RecommendationsFlow } from "@/features/recommendations/recommendations-flow";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to }: { children: ReactNode; to: string }) => <a href={to}>{children}</a>,
}));

vi.mock("@/features/catalog/catalog-provider", () => ({
  useCatalog: () => catalogV1Schema.parse(catalogJson),
}));

vi.mock("@/infrastructure/db", () => ({
  usePersistence: () => ({
    status: { state: "ready", mode: "indexeddb", warning: null },
    userWorks: [],
    adjustments: { axes: {}, themes: {} },
    policies: {
      preferCompleted: false,
      preferHidden: false,
      preferVerified: false,
      excludeIncomplete: false,
    },
    getRecommendationCache: vi.fn(),
    saveRecommendationCache: vi.fn(),
    savePolicies: vi.fn(),
    saveUserWork: vi.fn(),
  }),
}));

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("RecommendationsFlow context failure", () => {
  it("renders a fatal calculation state with a real retry control", () => {
    render(<RecommendationsFlow context={null} />);

    expect(screen.getByRole("heading", { name: "おすすめを計算できませんでした。" })).toBeTruthy();
    const retry = screen.getByRole("button", { name: "再試行" });
    expect(retry).toBeTruthy();
    expect(screen.queryByRole("list")).toBeNull();

    const reload = vi.fn();
    const retryWindow = Object.create(window) as Window & typeof globalThis;
    Object.defineProperty(retryWindow, "location", { value: { reload } });
    vi.stubGlobal("window", retryWindow);
    fireEvent.click(retry);

    expect(reload).toHaveBeenCalledOnce();
  });
});
