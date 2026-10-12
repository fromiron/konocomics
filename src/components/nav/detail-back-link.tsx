import { Link, useCanGoBack, useRouter } from "@tanstack/react-router";
import { ArrowLeftIcon } from "lucide-react";

import { navigationStrings } from "@/lib/strings";

/** Preserve the router's scroll and preview restoration, with a useful direct-entry destination. */
export function DetailBackLink({
  fallback = "/recommendations",
}: Readonly<{ fallback?: "/recommendations" | "/library" }>) {
  const router = useRouter();
  const canGoBack = useCanGoBack();
  return (
    <Link
      className="mx-auto flex min-h-[var(--control-min-size)] w-full max-w-[var(--layout-width-reading)] items-center gap-[var(--space-2)] px-[var(--layout-page-padding)] text-text-muted"
      onClick={(event) => {
        if (
          !canGoBack ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        )
          return;
        event.preventDefault();
        router.history.back();
      }}
      preload={false}
      to={fallback}
    >
      <ArrowLeftIcon aria-hidden="true" className="size-4" />
      {canGoBack
        ? navigationStrings.detailBack
        : navigationStrings.items[fallback === "/library" ? "library" : "recommendations"]}
    </Link>
  );
}
