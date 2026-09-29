"use client";

import { Share2Icon } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/design-system/button";
import { workDetailStrings } from "@/lib/strings";

type ShareMode = "share" | "copy" | null;

/** Shares the current page through the OS share sheet, or copies its link as a fallback. */
export function ShareButton({ title }: Readonly<{ title: string }>) {
  // Resolved after mount so the prerendered markup and the first client render match.
  const [mode, setMode] = useState<ShareMode>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    queueMicrotask(() =>
      setMode(
        typeof navigator.share === "function"
          ? "share"
          : typeof navigator.clipboard?.writeText === "function"
            ? "copy"
            : null,
      ),
    );
  }, []);

  if (mode === null) return null;

  const share = async () => {
    const url = window.location.href;
    setMessage("");
    try {
      if (mode === "share") {
        await navigator.share({ title, url });
      } else {
        await navigator.clipboard.writeText(url);
        setMessage(workDetailStrings.share.copied);
      }
    } catch (error) {
      // Dismissing the share sheet is not a failure.
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        setMessage(workDetailStrings.share.failed);
      }
    }
  };

  return (
    <span className="inline-flex flex-wrap items-center gap-x-[var(--space-3)]">
      <Button
        className="gap-[var(--space-2)] px-[var(--space-4)] font-bold"
        onClick={() => void share()}
        type="button"
        variant="outline"
      >
        <Share2Icon aria-hidden="true" className="size-4" />
        {workDetailStrings.share.action}
      </Button>
      <span aria-live="polite" className="text-[length:var(--text-caption-size)] text-text-muted">
        {message}
      </span>
    </span>
  );
}
