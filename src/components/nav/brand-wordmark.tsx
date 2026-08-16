import { coreStrings, navigationStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

type BrandWordmarkProps = Readonly<{
  className?: string;
  decorative?: boolean;
}>;

export function BrandWordmark({ className, decorative = false }: BrandWordmarkProps) {
  return (
    <span
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : coreStrings.appName}
      className={cn(
        "brand-wordmark inline-flex items-center font-display leading-none tracking-[-0.01em]",
        className,
      )}
      role={decorative ? undefined : "img"}
    >
      <span aria-hidden="true" className="brand-mark__accent font-bold text-accent">
        {navigationStrings.brandParts.kono}
      </span>
      <span aria-hidden="true" className="brand-mark__muted font-light text-text-muted">
        {navigationStrings.brandParts.co}
      </span>
      <span aria-hidden="true" className="brand-mark__accent font-bold text-accent">
        {navigationStrings.brandParts.mi}
      </span>
      <span aria-hidden="true" className="brand-mark__muted font-light text-text-muted">
        {navigationStrings.brandParts.cs}
      </span>
    </span>
  );
}
