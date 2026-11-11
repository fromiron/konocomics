// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AccentSelector } from "@/components/design-system/accent-selector";
import type { AccentThemeId } from "@/lib/accent-theme";
import { accentStrings } from "@/lib/strings";

afterEach(cleanup);

function Harness({ onChange }: Readonly<{ onChange(value: AccentThemeId): void }>) {
  const [value, setValue] = useState<AccentThemeId>("butter");
  return (
    <AccentSelector
      onValueChange={(next) => {
        onChange(next);
        setValue(next);
      }}
      value={value}
    />
  );
}

const trigger = () => screen.getByRole("button", { name: /^アクセントカラー：/ });
const group = () => screen.getByRole("radiogroup", { name: accentStrings.title });
const option = (name: string) => screen.getByRole("radio", { name });

describe("AccentSelector", () => {
  it("names the trigger after the current accent and lists the six accents as a radiogroup", async () => {
    render(<Harness onChange={vi.fn()} />);
    expect(trigger().getAttribute("aria-label")).toBe(
      accentStrings.trigger(accentStrings.names.butter),
    );

    fireEvent.click(trigger());
    await waitFor(() => expect(group()).toBeTruthy());
    expect(screen.getAllByRole("radio")).toHaveLength(6);
    for (const name of Object.values(accentStrings.names)) expect(option(name)).toBeTruthy();
    expect(option(accentStrings.names.butter).getAttribute("aria-checked")).toBe("true");
    // Each swatch takes its colour from its own theme block.
    expect(
      [...group().querySelectorAll("[data-accent]")].map((swatch) =>
        swatch.getAttribute("data-accent"),
      ),
    ).toEqual(["butter", "kinaka", "lime", "ice", "paper", "amber"]);
  });

  it("applies a choice at once and stays open so another can be tried", async () => {
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);
    fireEvent.click(trigger());
    await waitFor(() => expect(group()).toBeTruthy());

    fireEvent.click(option(accentStrings.names.kinaka));
    expect(onChange).toHaveBeenLastCalledWith("kinaka");
    expect(option(accentStrings.names.kinaka).getAttribute("aria-checked")).toBe("true");
    expect(group()).toBeTruthy();
    expect(trigger().getAttribute("aria-label")).toBe(
      accentStrings.trigger(accentStrings.names.kinaka),
    );
  });

  it("moves the choice with the arrow keys, as a radio group does", async () => {
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);
    fireEvent.click(trigger());
    await waitFor(() => expect(group()).toBeTruthy());

    const butter = option(accentStrings.names.butter);
    act(() => butter.focus());
    fireEvent.keyDown(butter, { key: "ArrowDown" });
    await waitFor(() => expect(onChange).toHaveBeenLastCalledWith("kinaka"));
    expect(document.activeElement).toBe(option(accentStrings.names.kinaka));

    fireEvent.keyDown(option(accentStrings.names.kinaka), { key: "ArrowUp" });
    await waitFor(() => expect(onChange).toHaveBeenLastCalledWith("butter"));
    expect(document.activeElement).toBe(butter);
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    render(<Harness onChange={vi.fn()} />);
    act(() => trigger().focus());
    fireEvent.click(trigger());
    await waitFor(() => expect(group()).toBeTruthy());

    fireEvent.keyDown(option(accentStrings.names.butter), { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("radiogroup")).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(trigger()));
  });

  it("closes on a press outside and returns focus to the trigger", async () => {
    render(<Harness onChange={vi.fn()} />);
    fireEvent.click(trigger());
    await waitFor(() => expect(group()).toBeTruthy());

    act(() => option(accentStrings.names.butter).blur());
    fireEvent.pointerDown(document.body);
    fireEvent.mouseDown(document.body);
    fireEvent.pointerUp(document.body);
    fireEvent.mouseUp(document.body);
    fireEvent.click(document.body);
    await waitFor(() => expect(screen.queryByRole("radiogroup")).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(trigger()));
  });
});
