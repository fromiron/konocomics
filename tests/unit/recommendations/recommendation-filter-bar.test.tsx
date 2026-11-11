// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";

import { RecommendationFilterBar } from "@/features/recommendations/recommendation-filter-bar";
import { recommendationStrings } from "@/lib/strings";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

it("keeps every policy chip and the policy progress in the toolbar row on narrow screens", () => {
  vi.stubGlobal("matchMedia", () => ({
    matches: true,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  const onPolicyToggle = vi.fn();
  const props = {
    disabled: false,
    policyUpdating: false,
    policies: {
      preferCompleted: true,
      preferHidden: false,
      preferVerified: false,
      excludeIncomplete: false,
    },
    onPolicyToggle,
  };
  const { container, rerender } = render(<RecommendationFilterBar {...props} />);
  // Nothing is folded away: below md the row scrolls sideways instead (03 §5).
  expect(container.querySelector("details")).toBeNull();
  const row = container.querySelector("#recommendation-genre")!.closest("div.flex.min-w-0")!;
  expect(row.className).toContain("max-md:overflow-x-auto");
  expect(row.className).toContain("max-md:flex-nowrap");
  const completed = screen.getByRole("checkbox", {
    name: recommendationStrings.policyLabels.preferCompleted,
  });
  expect(row.contains(completed)).toBe(true);
  expect(completed.getAttribute("aria-checked")).toBe("true");
  expect(
    screen
      .getByRole("checkbox", { name: recommendationStrings.policyLabels.preferHidden })
      .getAttribute("aria-checked"),
  ).toBe("false");

  fireEvent.click(completed);
  expect(onPolicyToggle).toHaveBeenCalledWith("preferCompleted");
  rerender(<RecommendationFilterBar {...props} policyUpdating />);
  const region = screen.getByRole("region", { name: recommendationStrings.policiesHeading });
  expect(within(region).getByRole("status").textContent).toBe(
    recommendationStrings.policiesUpdating,
  );
});
