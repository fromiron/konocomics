// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { UserWorkRecord } from "@/domain/profile/types";
import { LibraryRecordEditor } from "@/features/library/record-editor";
import { libraryStrings } from "@/lib/strings";

afterEach(cleanup);

describe("LibraryRecordEditor", () => {
  it("edits state, reaction, progress, and reasons as one valid record", async () => {
    const onSave = vi.fn<(record: UserWorkRecord) => Promise<void>>().mockResolvedValue();
    render(
      <LibraryRecordEditor
        busy={false}
        onSave={onSave}
        record={{
          workId: "work-1",
          readingState: "dropped",
          reaction: "disliked",
          progress: { volume: 3, chapter: 24 },
          negativeReasons: ["tooSlow"],
          droppedReasons: ["external:no-time"],
          updatedAt: "2026-08-14T00:00:00.000Z",
        }}
      />,
    );

    fireEvent.click(
      screen.getAllByRole("button", { name: libraryStrings.editor.reasonLabels.vague })[0]!,
    );
    fireEvent.submit(
      screen.getByRole("button", { name: libraryStrings.editor.save }).closest("form")!,
    );

    await waitFor(() => expect(onSave).toHaveBeenCalledTimes(1));
    expect(onSave.mock.calls[0]?.[0]).toMatchObject({
      workId: "work-1",
      readingState: "dropped",
      reaction: "disliked",
      progress: { volume: 3, chapter: 24 },
      negativeReasons: ["vagueDislike"],
    });
    expect(onSave.mock.calls[0]?.[0]).not.toHaveProperty("droppedReasons");
  });

  it("removes incompatible reasons and an empty progress object when the user changes state", async () => {
    const onSave = vi.fn<(record: UserWorkRecord) => Promise<void>>().mockResolvedValue();
    render(
      <LibraryRecordEditor
        busy={false}
        onSave={onSave}
        record={{
          workId: "work-2",
          readingState: "dropped",
          reaction: "disliked",
          negativeReasons: ["tooDark"],
          droppedReasons: ["external:hiatus"],
          updatedAt: "2026-08-14T00:00:00.000Z",
        }}
      />,
    );

    const selects = screen.getAllByRole<HTMLSelectElement>("combobox");
    fireEvent.change(selects[0]!, { target: { value: "completed" } });
    fireEvent.change(selects[1]!, { target: { value: "liked" } });
    fireEvent.click(screen.getByRole("button", { name: libraryStrings.editor.save }));

    await waitFor(() => expect(onSave).toHaveBeenCalledTimes(1));
    expect(onSave.mock.calls[0]?.[0]).toMatchObject({
      readingState: "completed",
      reaction: "liked",
    });
    expect(onSave.mock.calls[0]?.[0]).not.toHaveProperty("negativeReasons");
    expect(onSave.mock.calls[0]?.[0]).not.toHaveProperty("droppedReasons");
    expect(onSave.mock.calls[0]?.[0]).not.toHaveProperty("progress");
  });
});
