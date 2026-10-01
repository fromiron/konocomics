// @vitest-environment jsdom
import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { UserWorkRecord } from "@/domain/profile/types";
import {
  PersonalCatalogProvider,
  usePersonalCatalog,
  usePersonalProfile,
} from "@/features/catalog/personal-catalog-provider";
import { createTestCatalog, createTestWork } from "../../helpers/catalog";
const state = vi.hoisted(() => ({ records: [] as UserWorkRecord[], load: vi.fn() }));
vi.mock("@/infrastructure/db", () => ({ usePersistence: () => ({ userWorks: state.records }) }));
vi.mock("@/features/catalog/catalog-assets", () => ({ loadCatalogSelection: state.load }));
const works = Array.from({ length: 5 }, (_, i) => createTestWork({ id: `profile-${i}` }));
const selection = {
  catalog: { ...createTestCatalog(works[0]), works },
  context: {
    constraintByWorkId: {},
    marketSnapshot: { catalogVersion: "test", catalogAverageRating: 0, byWorkId: {} },
  },
};
beforeEach(() => {
  state.load.mockReset();
  state.records = works.map((work) => ({
    workId: work.id,
    reaction: "liked",
    readingState: "completed",
    updatedAt: "2026-10-01T00:00:00Z",
  }));
});
afterEach(cleanup);
describe("personal Catalog guard", () => {
  it("keeps the proven profile while a newly completed recommendation is loading or fails", async () => {
    state.load.mockResolvedValueOnce(selection);
    const { result, rerender } = renderHook(
      () => ({ profile: usePersonalProfile(), catalog: usePersonalCatalog() }),
      { wrapper: PersonalCatalogProvider },
    );
    await waitFor(() => expect(result.current.profile.hasProfile).toBe(true));
    let reject: (reason: Error) => void = () => {};
    state.load.mockImplementationOnce(
      () =>
        new Promise((_resolve, no) => {
          reject = no;
        }),
    );
    state.records = [
      ...state.records,
      { workId: "new-feedback", readingState: "completed", updatedAt: "2026-10-01T00:01:00Z" },
    ];
    rerender();
    expect(result.current.profile.hasProfile).toBe(true);
    expect(result.current.catalog.selection).toBeNull();
    await act(async () => reject(new Error("offline")));
    expect(result.current.profile).toEqual({ error: false, hasProfile: true });
    expect(result.current.catalog.error).toBe(true);
  });
  it("does not grant a profile from old records after they were removed", async () => {
    state.load.mockResolvedValueOnce(selection);
    const { result, rerender } = renderHook(() => usePersonalProfile(), {
      wrapper: PersonalCatalogProvider,
    });
    await waitFor(() => expect(result.current.hasProfile).toBe(true));
    state.records = [];
    state.load.mockResolvedValueOnce({
      ...selection,
      catalog: { ...selection.catalog, works: [] },
    });
    rerender();
    expect(result.current.hasProfile).not.toBe(true);
    await waitFor(() => expect(result.current.hasProfile).toBe(false));
  });
  it("distinguishes an initial asset failure from an empty profile", async () => {
    state.load.mockRejectedValue(new Error("offline"));
    const { result } = renderHook(() => usePersonalProfile(), { wrapper: PersonalCatalogProvider });
    await waitFor(() => expect(result.current.error).toBe(true));
    expect(result.current.hasProfile).toBeUndefined();
  });
});
