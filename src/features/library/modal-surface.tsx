"use client";

import { XIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/design-system/button";
import { Dialog, DialogContent } from "@/components/design-system/dialog";
import { libraryStrings } from "@/lib/strings";

type ModalSurfaceName =
  Readonly<{ label: string; labelledBy?: never }> | Readonly<{ label?: never; labelledBy: string }>;

type ModalSurfaceProps = Readonly<{
  children: ReactNode;
  fallbackFocusId?: string;
  onClose(): void;
  opener: HTMLElement | null;
  variant: "detail" | "search";
}> &
  ModalSurfaceName;

export function ModalSurface({
  children,
  fallbackFocusId,
  label,
  labelledBy,
  onClose,
  opener,
  variant,
}: ModalSurfaceProps) {
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        aria-label={label}
        aria-labelledby={labelledBy}
        className="fixed top-auto bottom-0 left-1/2 z-50 max-h-[88dvh] w-full max-w-[var(--layout-width-library)] -translate-x-1/2 translate-y-0 overflow-y-auto rounded-t-[var(--radius-card)] rounded-b-none bg-surface-1 px-[var(--layout-page-padding)] pt-[var(--space-6)] pb-[calc(var(--space-6)+var(--layout-safe-area-bottom))] !transition-none data-closed:!animate-none data-open:!animate-none sm:max-w-[var(--layout-width-library)] md:top-1/2 md:bottom-auto md:-translate-y-1/2 md:rounded-[var(--radius-card)]"
        data-library-panel={variant}
        finalFocus={() =>
          opener?.isConnected === true
            ? opener
            : fallbackFocusId === undefined
              ? null
              : document.getElementById(fallbackFocusId)
        }
        showCloseButton={false}
      >
        <Button
          aria-label={libraryStrings.panel.close}
          className="sticky top-0 z-2 ml-auto grid size-[var(--control-min-size)] min-h-[var(--control-min-size)] place-items-center border border-line bg-surface-1 text-[length:var(--font-size-20)] leading-none text-text-strong"
          onClick={onClose}
          size="icon"
          type="button"
          variant="ghost"
        >
          <XIcon aria-hidden="true" />
        </Button>
        {children}
      </DialogContent>
    </Dialog>
  );
}
