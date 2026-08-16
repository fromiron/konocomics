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
      className={cn("brand-wordmark", className)}
      role={decorative ? undefined : "img"}
    >
      <span aria-hidden="true" className="brand-mark__accent">
        {navigationStrings.brandParts.kono}
      </span>
      <span aria-hidden="true" className="brand-mark__muted">
        {navigationStrings.brandParts.co}
      </span>
      <span aria-hidden="true" className="brand-mark__accent">
        {navigationStrings.brandParts.mi}
      </span>
      <span aria-hidden="true" className="brand-mark__muted">
        {navigationStrings.brandParts.cs}
      </span>
    </span>
  );
}
