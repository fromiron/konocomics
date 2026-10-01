// @vitest-environment jsdom
import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useTastePreview } from "@/features/taste/use-taste-preview";
import type { TastePreviewResult } from "@/features/recommendations/recommendation-plan-worker-protocol";
import type { ProfileAdjustments } from "@/domain/profile/types";
const state = vi.hoisted(() => ({ preview: vi.fn(), terminate: vi.fn() }));
vi.mock("@/features/recommendations/recommendation-plan-worker-client", () => ({
  RecommendationPlanWorkerClient: class {
    preview = state.preview;
    terminate = state.terminate;
  },
}));
const records: [] = [];
const baseline: ProfileAdjustments = { axes: {}, themes: {} };
const policies = {
  preferCompleted: false,
  preferHidden: false,
  preferVerified: false,
  excludeIncomplete: false,
};
const empty: TastePreviewResult = {
  before: [],
  after: [],
  catalog: {
    schemaVersion: 1,
    catalogVersion: "test",
    factorDictionaryVersion: "v1",
    works: [],
    volumes: [],
    representativeVolumeByWorkId: {},
  },
};
beforeEach(() => {
  state.preview.mockReset();
  state.terminate.mockReset();
});
afterEach(cleanup);
describe("taste background preview", () => {
  it("does not expose a stale response as the latest shareable result", async () => {
    const pending: Array<(value: TastePreviewResult) => void> = [];
    state.preview.mockImplementation(
      () => new Promise<TastePreviewResult>((resolve) => pending.push(resolve)),
    );
    const { result, rerender } = renderHook(
      ({ adjustments }) => useTastePreview(records, adjustments, baseline, policies),
      { initialProps: { adjustments: baseline } },
    );
    expect(result.current.loading).toBe(true);
    expect(result.current.ready).toBe(false);
    await waitFor(() => expect(pending).toHaveLength(1));
    rerender({ adjustments: { axes: { strategy: "like" }, themes: {} } });
    await waitFor(() => expect(pending).toHaveLength(2));
    await act(async () => pending[1]!(empty));
    expect(result.current.ready).toBe(true);
    const old = { ...empty, catalog: { ...empty.catalog, catalogVersion: "old" } };
    await act(async () => pending[0]!(old));
    expect(result.current.result).toBe(empty);
  });
  it("distinguishes failure from loading and retries the real worker request", async () => {
    state.preview.mockRejectedValueOnce(new Error("offline")).mockResolvedValueOnce(empty);
    const { result } = renderHook(() => useTastePreview(records, baseline, baseline, policies));
    await waitFor(() => expect(result.current.error).toBe(true));
    expect(result.current.ready).toBe(false);
    act(() => result.current.retry());
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.ready).toBe(true));
    expect(state.preview).toHaveBeenCalledTimes(2);
  });
});
