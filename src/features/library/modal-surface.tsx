"use client";

import { type KeyboardEvent, type ReactNode, useEffect, useRef } from "react";

import { libraryStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

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
  const surfaceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const surface = surfaceRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const first = surface?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    first?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      if (opener?.isConnected === true) {
        opener.focus();
      } else if (fallbackFocusId !== undefined) {
        document.getElementById(fallbackFocusId)?.focus();
      }
    };
  }, [fallbackFocusId, opener]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
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
      className="library-panel"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
      role="presentation"
    >
      <div
        aria-label={label}
        aria-labelledby={labelledBy}
        aria-modal="true"
        className={cn("library-panel__surface surface-sheet", `library-panel__surface--${variant}`)}
        onKeyDown={handleKeyDown}
        ref={surfaceRef}
        role="dialog"
      >
        <button
          aria-label={libraryStrings.panel.close}
          className="library-panel__close interactive-press"
          onClick={onClose}
          type="button"
        >
          <span aria-hidden="true">×</span>
        </button>
        {children}
      </div>
    </div>
  );
}
