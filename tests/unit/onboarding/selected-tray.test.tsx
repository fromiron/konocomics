// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { PositiveOnboardingEntry } from "@/domain/profile/onboarding";
import { SelectedTray } from "@/features/onboarding/selected-tray";
import { createTestWork } from "../../helpers/catalog";

afterEach(cleanup);

const works = ["1", "2"].map((id) => ({
  ...createTestWork({ id: `work-${id}` }),
  title: `作品${id}`,
}));
const worksById = new Map(works.map((work) => [work.id, work] as const));

function TrayHarness({
  initialSelections = works.map((work) => work.id),
}: Readonly<{ initialSelections?: readonly string[] }>) {
  const [selections, setSelections] = useState<readonly PositiveOnboardingEntry[]>(
    initialSelections.map((workId) => ({ workId, reaction: "liked" })),
  );

  return (
    <SelectedTray
      continueLabel="次へ"
      disabled={selections.length < 2}
      emptyLabel="まだ選ばれていません"
      label="選んだ作品"
      limitActive={false}
      onContinue={vi.fn()}
      onRemove={(workId) =>
        setSelections((current) => current.filter((entry) => entry.workId !== workId))
      }
      removeLabel="選択を解除"
      selections={selections}
      shakeKey={0}
      worksById={worksById}
    />
  );
}

describe("SelectedTray focus recovery", () => {
  it("reserves one visible add slot while the tray is below its maximum", () => {
    const { container } = render(<TrayHarness />);

    expect(container.querySelector(".selected-tray__empty-slot")).not.toBeNull();
  });

  it("moves focus to the next selected work after removal", async () => {
    render(<TrayHarness />);

    fireEvent.click(screen.getByRole("button", { name: "作品1 — 選択を解除" }));

    const next = screen.getByRole("button", { name: "作品2 — 選択を解除" });
    await waitFor(() => expect(document.activeElement).toBe(next));
  });

  it("moves focus to the tray after removing the only selection", async () => {
    render(<TrayHarness initialSelections={["work-1"]} />);

    fireEvent.click(screen.getByRole("button", { name: "作品1 — 選択を解除" }));

    const tray = screen.getByRole("complementary", { name: "選んだ作品" });
    await waitFor(() => expect(document.activeElement).toBe(tray));
  });
});

describe("SelectedTray motion ownership", () => {
  it("exposes a static limit state without Motion owning the tray", () => {
    const { container } = render(
      <SelectedTray
        continueLabel="次へ"
        disabled
        emptyLabel="まだ選ばれていません"
        label="選んだ作品"
        limitActive
        onContinue={vi.fn()}
        onRemove={vi.fn()}
        removeLabel="選択を解除"
        selections={[]}
        shakeKey={1}
        worksById={worksById}
      />,
    );

    const tray = screen.getByRole("complementary", { name: "選んだ作品" });
    expect(tray.tagName).toBe("ASIDE");
    expect(tray.getAttribute("data-limit-active")).toBe("true");
    expect(tray.classList.contains("selected-tray--limit-1")).toBe(true);
    expect(container.querySelector("[style*='translateX']")).toBeNull();
  });
});
