"use client";

import type { ReactNode } from "react";

import { Dialog, DialogContent } from "@/components/design-system/dialog";

type SettingsDialogProps = Readonly<{
  busy: boolean;
  children: ReactNode;
  fallbackFocusId?: string;
  initialFocusId?: string;
  labelledBy: string;
  onClose(): void;
  opener: HTMLElement | null;
}>;

export function SettingsDialog({
  busy,
  children,
  fallbackFocusId,
  initialFocusId,
  labelledBy,
  onClose,
  opener,
}: SettingsDialogProps) {
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !busy) onClose();
      }}
    >
      <DialogContent
        aria-labelledby={labelledBy}
        className="fixed top-1/2 left-1/2 z-50 grid max-h-[calc(100dvh-(var(--layout-page-padding)*2)-var(--layout-safe-area-bottom))] w-[min(100%,var(--layout-width-form))] max-w-[var(--layout-width-form)] -translate-x-1/2 -translate-y-1/2 gap-[var(--space-5)] overflow-y-auto rounded-[var(--radius-card)] bg-surface-1 p-[var(--space-6)] !transition-none data-closed:!animate-none data-open:!animate-none sm:max-w-[var(--layout-width-form)]"
        finalFocus={() =>
          busy && fallbackFocusId !== undefined
            ? document.getElementById(fallbackFocusId)
            : opener?.isConnected === true
              ? opener
              : fallbackFocusId === undefined
                ? null
                : document.getElementById(fallbackFocusId)
        }
        initialFocus={() =>
          initialFocusId === undefined ? null : document.getElementById(initialFocusId)
        }
        showCloseButton={false}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
}
