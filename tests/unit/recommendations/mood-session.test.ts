// @vitest-environment jsdom

import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import {
  dismissForMood,
  resetMoodSession,
  selectMood,
  useMoodSession,
} from "@/features/recommendations/mood-session";

afterEach(() => {
  act(() => resetMoodSession());
});

describe("mood session", () => {
  it("keeps set-asides per mood and reapplies them when the mood returns", () => {
    const { result } = renderHook(() => useMoodSession("catalog-a"));

    act(() => {
      selectMood("warm", "catalog-a");
      dismissForMood("warm", "work-1", "catalog-a");
      selectMood("fastPaced", "catalog-a");
    });
    expect(result.current.mood).toBe("fastPaced");
    expect(result.current.dismissedByMood.fastPaced).toBeUndefined();

    act(() => selectMood(null, "catalog-a"));
    expect(result.current.mood).toBeNull();

    act(() => selectMood("warm", "catalog-a"));
    expect(result.current.dismissedByMood.warm).toEqual(["work-1"]);
  });

  it("reads another Catalog's session as empty and clears on reset", () => {
    act(() => {
      selectMood("lowStress", "catalog-a");
      dismissForMood("lowStress", "work-1", "catalog-a");
    });
    const other = renderHook(() => useMoodSession("catalog-b"));
    expect(other.result.current).toEqual({ mood: null, dismissedByMood: {}, catalogVersion: null });

    act(() => selectMood("lowStress", "catalog-b"));
    expect(other.result.current.dismissedByMood).toEqual({});

    act(() => resetMoodSession());
    expect(other.result.current.mood).toBeNull();
  });
});
