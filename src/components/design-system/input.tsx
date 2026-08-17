import type { ComponentProps } from "react";

import { Input as PrimitiveInput } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type InputProps = ComponentProps<typeof PrimitiveInput>;

export function Input({ className, ...props }: InputProps) {
  return (
    <PrimitiveInput
      className={cn(
        "min-h-[var(--control-min-size)] rounded-[var(--radius-control)] border-text-muted bg-surface-1 px-[var(--space-3)] py-[var(--space-content)] text-[length:var(--text-body-size)] text-text transition-none placeholder:text-text-muted focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-auto disabled:opacity-45",
        className,
      )}
      {...props}
    />
  );
}
