import { Link } from "@tanstack/react-router";
import { ArrowRightIcon } from "lucide-react";

import { mediaStrings, recommendationStrings } from "@/lib/strings";

/**
 * A card's one action where the page changes no records: the work's detail page. Expand panels,
 * stage cards and slot-form Quick Previews use it on pages without reading-state actions.
 */
export function WorkDetailLink({ title, workId }: Readonly<{ title: string; workId: string }>) {
  return (
    <Link
      aria-label={mediaStrings.openDetails(title)}
      className="inline-flex min-h-[var(--control-min-size)] items-center gap-[var(--space-1)] px-[var(--space-1)] text-[length:var(--font-size-12)] text-text-strong transition-colors duration-[var(--motion-duration-feedback)] hover:text-accent-ink focus-visible:text-accent-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring motion-reduce:transition-none"
      params={{ workId }}
      preload={false}
      to="/works/$workId"
    >
      {recommendationStrings.quickPreview.details}
      <ArrowRightIcon aria-hidden="true" className="size-4" />
    </Link>
  );
}
