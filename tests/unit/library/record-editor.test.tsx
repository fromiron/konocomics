// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { UserWorkRecord } from "@/domain/profile/types";
import { LibraryRecordEditor } from "@/features/library/record-editor";
import { libraryStrings } from "@/lib/strings";

afterEach(cleanup);

/** Picks one option in a record-editor choice group (読書状態 or 感想). */
function choose(group: string, option: string) {
  fireEvent.click(
    within(screen.getByRole("radiogroup", { name: group })).getByRole("radio", { name: option }),
  );
}

describe("LibraryRecordEditor", () => {
  it("prevents unchanged writes, including reverted fields, while preserving collapsed progress", async () => {
    const onSave = vi.fn<(record: UserWorkRecord) => Promise<void>>().mockResolvedValue();
    render(
      <LibraryRecordEditor
        busy={false}
        onSave={onSave}
        record={{
          workId: "existing",
          readingState: "completed",
          reaction: "liked",
          progress: { volume: 3, chapter: 24 },
          updatedAt: "2026-08-14T00:00:00.000Z",
        }}
      />,
    );
    const save = screen.getByRole<HTMLButtonElement>("button", {
      name: libraryStrings.editor.save,
    });
    expect(save.disabled).toBe(true);
    fireEvent.submit(save.closest("form")!);
    expect(onSave).not.toHaveBeenCalled();
    choose(libraryStrings.editor.readingState, libraryStrings.tabs.dropped);
    expect(save.disabled).toBe(false);
    choose(libraryStrings.editor.readingState, libraryStrings.tabs.completed);
    expect(save.disabled).toBe(true);
    fireEvent.click(screen.getByText(libraryStrings.editor.progressOptional));
    choose(libraryStrings.editor.reaction, libraryStrings.reactions.favorite);
    fireEvent.click(save);
    await waitFor(() =>
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({
          reaction: "favorite",
          progress: { volume: 3, chapter: 24 },
        }),
      ),
    );
  });

  it("allows explicit confirmation of a new discovery record without changing its defaults", async () => {
    const onSave = vi.fn<(record: UserWorkRecord) => Promise<void>>().mockResolvedValue();
    render(
      <LibraryRecordEditor
        busy={false}
        isNewRecord
        onSave={onSave}
        record={{
          workId: "new",
          readingState: "completed",
          updatedAt: "2026-08-14T00:00:00.000Z",
        }}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: libraryStrings.editor.save }));
    await waitFor(() =>
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({ workId: "new", readingState: "completed" }),
      ),
    );
  });

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

    choose(libraryStrings.editor.readingState, libraryStrings.tabs.completed);
    choose(libraryStrings.editor.reaction, libraryStrings.reactions.liked);
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
