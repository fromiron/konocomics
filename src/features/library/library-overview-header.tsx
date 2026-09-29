"use client";

import { Button } from "@/components/design-system/button";
import { PageHeader } from "@/components/layout/page-header";
import { libraryStrings } from "@/lib/strings";

export function LibraryOverviewHeader({
  favorites,
  onAddWork,
  total,
}: Readonly<{
  favorites: number;
  onAddWork(opener: HTMLElement): void;
  total: number;
}>) {
  return (
    <PageHeader
      action={
        total === 0 ? null : (
          <Button onClick={(event) => onAddWork(event.currentTarget)} type="button">
            {libraryStrings.addWork}
          </Button>
        )
      }
      className="mb-[var(--space-6)]"
      title={libraryStrings.title}
    >
      {total === 0 ? null : (
        <p className="text-[length:var(--font-size-14)] leading-relaxed text-text-muted">
          {libraryStrings.basis(total, favorites)}
        </p>
      )}
    </PageHeader>
  );
}
