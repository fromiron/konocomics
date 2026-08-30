import { Link } from "@tanstack/react-router";

import { navigationStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

import { BrandWordmark } from "./brand-wordmark";

type BrandMarkProps = Readonly<{
  className?: string;
}>;

export function BrandMark({ className }: BrandMarkProps) {
  return (
    <Link
      aria-label={navigationStrings.brandLinkLabel}
      className={cn(
        "brand-mark inline-flex w-fit min-h-[var(--control-min-size)] min-w-[var(--control-min-size)] justify-self-start items-center px-[var(--space-1)] font-display text-[length:var(--font-size-20)] leading-none tracking-[-0.01em] transition-opacity duration-[var(--motion-duration-feedback)] ease-[var(--motion-ease-direct)] motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:hover:opacity-80",
        className,
      )}
      preload={false}
      to="/recommendations"
    >
      <BrandWordmark decorative />
    </Link>
  );
}
