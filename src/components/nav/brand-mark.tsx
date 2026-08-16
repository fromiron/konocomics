import Link from "next/link";

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
      className={cn("brand-mark", className)}
      href="/recommendations"
      prefetch={false}
    >
      <BrandWordmark decorative />
    </Link>
  );
}
