// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";

import { RecommendationFilterBar } from "@/features/recommendations/recommendation-filter-bar";
import { recommendationStrings } from "@/lib/strings";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

it("keeps active policies and update progress visible when narrow-screen policy controls are folded", () => {
  vi.stubGlobal("matchMedia", () => ({
    matches: true,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  const onPolicyToggle = vi.fn();
  const props = {
    disabled: false,
    pending: true,
    policyUpdating: false,
    policies: {
      preferCompleted: true,
      preferHidden: false,
      preferVerified: false,
      excludeIncomplete: false,
    },
    updating: false,
    updateDisabled: false,
    updateButtonRef: null,
    onPolicyToggle,
    onUpdate: vi.fn(),
  };
  const { container, rerender } = render(<RecommendationFilterBar {...props} />);
  const disclosure = container.querySelector("details");
  const summary = container.querySelector("summary");
  expect(disclosure?.open).toBe(false);
  expect(summary?.textContent).toContain(recommendationStrings.policyLabels.preferCompleted);
  expect(summary?.textContent).not.toContain(recommendationStrings.policyLabels.preferHidden);
  expect(screen.getByRole("button", { name: recommendationStrings.update })).toBeTruthy();
  expect(screen.getByText(recommendationStrings.pendingChanges)).toBeTruthy();

  disclosure!.open = true;
  fireEvent(disclosure!, new Event("toggle"));
  fireEvent.click(
    screen.getByRole("checkbox", { name: recommendationStrings.policyLabels.preferCompleted }),
  );
  expect(onPolicyToggle).toHaveBeenCalledWith("preferCompleted");
  disclosure!.open = false;
  fireEvent(disclosure!, new Event("toggle"));
  rerender(<RecommendationFilterBar {...props} policyUpdating />);
  const region = screen.getByRole("region", { name: recommendationStrings.policiesHeading });
  expect(within(region).getByRole("status").textContent).toBe(
    recommendationStrings.policiesUpdating,
  );
  expect(disclosure?.open).toBe(false);
});
