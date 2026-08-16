"use client";

import { type KeyboardEvent, type ReactNode, useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

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
  const surfaceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const requested = initialFocusId === undefined ? null : document.getElementById(initialFocusId);
    const first = surfaceRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    (requested ?? first)?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      if (opener?.isConnected === true) {
        opener.focus();
      } else if (fallbackFocusId !== undefined) {
        document.getElementById(fallbackFocusId)?.focus();
      }
    };
  }, [fallbackFocusId, initialFocusId, opener]);

  const requestClose = () => {
    if (!busy) onClose();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      requestClose();
      return;
    }
    if (event.key !== "Tab") return;

    const focusable = [
      ...(surfaceRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ?? []),
    ];
    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  };

  return (
    <div
      className="settings-dialog"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) requestClose();
      }}
      role="presentation"
    >
      <div
        aria-labelledby={labelledBy}
        aria-modal="true"
        className="settings-dialog__surface surface-sheet"
        onKeyDown={handleKeyDown}
        ref={surfaceRef}
        role="dialog"
      >
        {children}
      </div>
    </div>
  );
}
