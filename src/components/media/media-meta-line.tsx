import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type MediaMetaLineProps = Readonly<{
  children: ReactNode;
  className?: string;
}>;

export function MediaMetaLine({ children, className }: MediaMetaLineProps) {
  return (
    <span
      className={cn(
        "block min-w-0 truncate text-[length:var(--text-caption-size)] leading-tight text-text-muted",
        className,
      )}
      data-media-meta-line="true"
    >
      {children}
    </span>
  );
}
