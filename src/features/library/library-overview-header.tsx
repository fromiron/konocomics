"use client";

import { Button } from "@/components/design-system/button";
import { libraryStrings } from "@/lib/strings";

export function LibraryOverviewHeader({
  onAddWork,
  total,
}: Readonly<{
  onAddWork(opener: HTMLElement): void;
  total: number;
}>) {
  return (
    <header className="mb-[var(--space-6)] flex flex-wrap items-center justify-between gap-[var(--space-3)]">
      <h1 className="text-[length:var(--text-page-title-size)] text-text-strong">
        {libraryStrings.title}
      </h1>
      {total === 0 ? null : (
        <Button onClick={(event) => onAddWork(event.currentTarget)} type="button">
          {libraryStrings.addWork}
        </Button>
      )}
    </header>
  );
}
