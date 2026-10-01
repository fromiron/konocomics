"use client";

import { Share2Icon } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/design-system/button";
import { Snackbar } from "@/components/layout/snackbar";
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
    <>
      <Button
        aria-label={workDetailStrings.share.action}
        className="size-[var(--control-min-size)] shrink-0"
        onClick={() => void share()}
        size="icon"
        type="button"
        variant="outline"
      >
        <Share2Icon aria-hidden="true" className="size-4" />
      </Button>
      <Snackbar
        notice={
          message === ""
            ? undefined
            : {
                id: 1,
                text: message,
                tone: message === workDetailStrings.share.failed ? "error" : "status",
              }
        }
        onDismiss={() => setMessage("")}
      />
    </>
  );
}
