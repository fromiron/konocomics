import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type HeroBackdropProps = Readonly<{
  coverUrl?: string | null;
  children: ReactNode;
  className?: string;
  priority?: boolean;
}>;

export function HeroBackdrop({
  children,
  className,
  coverUrl,
  priority = false,
}: HeroBackdropProps) {
  const source = coverUrl?.trim();

  return (
    <div
      className={cn("relative isolate overflow-hidden bg-surface-1", className)}
      data-slot="hero-backdrop"
    >
      {source ? (
        <img
          alt=""
          aria-hidden="true"
          className="absolute inset-0 size-full scale-110 object-cover opacity-60 blur-3xl"
          data-cover-source={source}
          decoding="async"
          draggable={false}
          fetchPriority={priority ? "high" : "auto"}
          loading={priority ? "eager" : "lazy"}
          src={source}
        />
      ) : null}
      <span aria-hidden="true" className="absolute inset-0 bg-hero-scrim" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
