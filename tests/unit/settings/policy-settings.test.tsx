// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { RecommendationPolicies } from "@/domain/profile/types";
import { PolicySettings } from "@/features/settings/policy-settings";
import { settingsStrings } from "@/lib/strings";

const policies: RecommendationPolicies = {
  preferCompleted: false,
  preferHidden: true,
  preferVerified: false,
  excludeIncomplete: true,
};

afterEach(cleanup);

describe("PolicySettings", () => {
  it("saves only the visible toggle change and preserves hidden excludeIncomplete", async () => {
    let resolveSave: (() => void) | undefined;
    const savePolicies = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveSave = resolve;
        }),
    );
    render(<PolicySettings policies={policies} savePolicies={savePolicies} />);

    expect(screen.getAllByRole("switch")).toHaveLength(3);
    expect(
      screen.queryByRole("switch", {
        name: settingsStrings.policies.labels.excludeIncomplete,
      }),
    ).toBeNull();

    fireEvent.click(
      screen.getByRole("switch", { name: settingsStrings.policies.labels.preferCompleted }),
    );

    expect(savePolicies).toHaveBeenCalledWith({
      ...policies,
      preferCompleted: true,
      excludeIncomplete: true,
    });
    expect(
      screen.getAllByRole("switch").every((control) => control.matches("[data-disabled]")),
    ).toBe(true);

    resolveSave?.();
    await waitFor(() => expect(screen.queryByText(settingsStrings.policies.saving)).toBeNull());
  });

  it("restores the persisted view and exposes a truthful alert when saving fails", async () => {
    const savePolicies = vi.fn().mockRejectedValue(new Error("write failed"));
    render(<PolicySettings policies={policies} savePolicies={savePolicies} />);

    fireEvent.click(
      screen.getByRole("switch", { name: settingsStrings.policies.labels.preferVerified }),
    );

    await waitFor(() =>
      expect(screen.getByRole("alert").textContent).toBe(settingsStrings.policies.error),
    );
    expect(
      screen
        .getByRole("switch", {
          name: settingsStrings.policies.labels.preferVerified,
        })
        .getAttribute("aria-checked"),
    ).toBe("false");
  });
});
