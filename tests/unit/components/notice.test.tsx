// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Notice } from "@/components/design-system/notice";

afterEach(() => {
  cleanup();
});

describe("Notice", () => {
  it("announces each tone with its own live role and keeps the icon out of the name", () => {
    render(
      <>
        <Notice>info text</Notice>
        <Notice tone="warn">warn text</Notice>
        <Notice tone="danger">danger text</Notice>
      </>,
    );

    expect(screen.getByRole("note").textContent).toBe("info text");
    expect(screen.getByRole("status").textContent).toBe("warn text");
    expect(screen.getByRole("alert").textContent).toBe("danger text");
    for (const icon of document.querySelectorAll(".notice > svg")) {
      expect(icon.getAttribute("aria-hidden")).toBe("true");
    }
  });
});
