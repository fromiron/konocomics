import type { ComponentProps } from "react";

import {
  NativeSelect as PrimitiveNativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { cn } from "@/lib/utils";

export type NativeSelectProps = ComponentProps<typeof PrimitiveNativeSelect>;

export function NativeSelect({ className, ...props }: NativeSelectProps) {
  return (
    <PrimitiveNativeSelect
      className={cn(
        "w-full has-[select:disabled]:cursor-not-allowed has-[select:disabled]:opacity-45 [&_[data-slot=native-select]]:min-h-[var(--control-min-size)] [&_[data-slot=native-select]]:rounded-[var(--radius-control)] [&_[data-slot=native-select]]:border-text-muted [&_[data-slot=native-select]]:bg-surface-1 [&_[data-slot=native-select]]:px-[var(--space-3)] [&_[data-slot=native-select]]:py-[var(--space-content)] [&_[data-slot=native-select]]:pr-[var(--space-8)] [&_[data-slot=native-select]]:text-[length:var(--text-body-size)] [&_[data-slot=native-select]]:text-text [&_[data-slot=native-select]]:transition-none [&_[data-slot=native-select]]:focus-visible:ring-0 [&_[data-slot=native-select]]:focus-visible:outline-2 [&_[data-slot=native-select]]:focus-visible:outline-offset-2 [&_[data-slot=native-select]]:focus-visible:outline-ring [&_[data-slot=native-select]:disabled]:pointer-events-auto [&_[data-slot=native-select]:disabled]:cursor-not-allowed",
        className,
      )}
      {...props}
    />
  );
}

export { NativeSelectOptGroup, NativeSelectOption };
